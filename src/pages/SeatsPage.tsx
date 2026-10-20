import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Monitor } from 'lucide-react';
import { SeatStatCards } from '../components/seats/SeatStatCards';
import { SeatCategoryLegend } from '../components/seats/SeatCategoryLegend';
import { VisualSeatMap } from '../components/seats/VisualSeatMap';
import { SeatDetailPanel } from '../components/seats/SeatDetailPanel';
import { AssignStudentModal } from '../components/seats/AssignStudentModal';
import { EditRatesModal } from '../components/seats/EditRatesModal';
import { EditSeatModal } from '../components/seats/EditSeatModal';
import { SeatGridCell, CategoryRateConfig, SeatCategory } from '../types/seatManagement';
import { initialSeatCells, initialCategoryRates } from '../data/mockSeatsLayoutData';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import { AdminPasswordModal } from '../components/common/AdminPasswordModal';
import { seatService, categoryService } from '../services/api';
import { useSeatLayout } from '../services/useLibraryQueries';

export const SeatsPage: React.FC = () => {
  const { showToast, showAlert, showConfirm } = useLibrary();
  const { user } = useAuth();
  const { data: serverLayout, refetch: refetchLayout } = useSeatLayout();

  // Load persisted cells or fallback to mock
  const [cells, setCells] = useState<SeatGridCell[]>(() => {
    try {
      const stored = localStorage.getItem('viya_library_seat_layout');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return initialSeatCells;
  });

  // Load persisted rates
  const [categoryRates, setCategoryRates] = useState<Record<string, CategoryRateConfig>>(() => {
    try {
      const stored = localStorage.getItem('viya_seat_categories');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return initialCategoryRates;
  });

  // Grid dimensions with persistence and auto-detection
  const [rows, setRows] = useState<number>(() => {
    try {
      const storedDims = localStorage.getItem('viya_library_grid_dims');
      if (storedDims) return JSON.parse(storedDims).rows || 6;
      const storedCells = localStorage.getItem('viya_library_seat_layout');
      if (storedCells) {
        const parsed = JSON.parse(storedCells);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return Math.max(...parsed.map((c: any) => c.row || 1));
        }
      }
    } catch (e) {}
    return 6;
  });

  const [cols, setCols] = useState<number>(() => {
    try {
      const storedDims = localStorage.getItem('viya_library_grid_dims');
      if (storedDims) return JSON.parse(storedDims).cols || 8;
      const storedCells = localStorage.getItem('viya_library_seat_layout');
      if (storedCells) {
        const parsed = JSON.parse(storedCells);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return Math.max(...parsed.map((c: any) => c.col || 1));
        }
      }
    } catch (e) {}
    return 8;
  });

  // Modes & UI States
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  
  // Selected Cell (Default to Seat 5 like in the reference image)
  const [selectedCellId, setSelectedCellId] = useState<string>(() => {
    const seat5 = initialSeatCells.find((c) => c.seatNumber === 5);
    return seat5 ? seat5.id : initialSeatCells[0]?.id || '';
  });

  // Modals state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);
  const [isEditRatesModalOpen, setIsEditRatesModalOpen] = useState<boolean>(false);
  const [isEditSeatModalOpen, setIsEditSeatModalOpen] = useState<boolean>(false);

  // Mobile navigation tab: 'map' (Floor plan) or 'details' (Selected seat panel)
  const [mobileTab, setMobileTab] = useState<'map' | 'details'>('map');

  // Admin Password Verification Modal state
  const [adminAuthModal, setAdminAuthModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionLabel: string;
    onAuthorize: () => Promise<void> | void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    actionLabel: '',
    onAuthorize: () => {}
  });

  // Helper to guard any seat configuration or layout change behind admin password
  const requireAdminAuth = (
    options: { title?: string; description?: string; actionLabel?: string },
    action: () => Promise<void> | void
  ) => {
    setAdminAuthModal({
      isOpen: true,
      title: options.title || 'Admin Authorization Required',
      description:
        options.description ||
        'Please enter your admin password to update library seat configuration or layout.',
      actionLabel: options.actionLabel || 'Authorize & Save',
      onAuthorize: async () => {
        setAdminAuthModal((prev) => ({ ...prev, isOpen: false }));
        await action();
      }
    });
  };

  // Backup layout snapshot for cancel in edit mode
  const [backupLayout, setBackupLayout] = useState<{
    cells: SeatGridCell[];
    rows: number;
    cols: number;
  }>({ cells, rows, cols });

  // Selected cell reference
  const selectedCell = useMemo(() => {
    return cells.find((c) => c.id === selectedCellId) || null;
  }, [cells, selectedCellId]);

  // Dynamic Metrics Calculation
  const metrics = useMemo(() => {
    const seatCells = cells.filter((c) => c.isSeat);
    const occupied = seatCells.filter((c) => c.status === 'Occupied' || Boolean(c.assignedStudent?.name)).length;
    const maintenance = seatCells.filter((c) => c.status === 'Maintenance').length;
    const available = seatCells.filter((c) => (c.status === 'Available' || !c.status) && !c.assignedStudent?.name && c.status !== 'Maintenance').length;

    const premiumCount = seatCells.filter((c) => c.category === 'Premium').length;
    const lockerCount = seatCells.filter((c) => c.category === 'Locker').length;
    const normalCount = seatCells.filter((c) => c.category === 'Normal').length;

    return {
      total: seatCells.length,
      available,
      occupied,
      maintenance,
      counts: {
        all: seatCells.length,
        premium: premiumCount,
        locker: lockerCount,
        normal: normalCount
      }
    };
  }, [cells]);

  // Existing student assignments map (studentId -> seatId)
  const existingAssignments = useMemo(() => {
    const map: Record<string, string> = {};
    cells.forEach((c) => {
      if (c.assignedStudent?.id) {
        map[c.assignedStudent.id] = c.id;
      }
    });
    return map;
  }, [cells]);

  // Sync layout whenever serverLayout updates from backend or query invalidation
  useEffect(() => {
    const layout = serverLayout as { rows?: number; cols?: number; cells?: SeatGridCell[] } | undefined;
    if (layout && Array.isArray(layout.cells) && layout.cells.length > 0) {
      setRows(Number(layout.rows) || 6);
      setCols(Number(layout.cols) || 8);
      setCells(layout.cells);
      try {
        localStorage.setItem('viya_library_seat_layout', JSON.stringify(layout.cells));
        localStorage.setItem('viya_library_grid_dims', JSON.stringify({ rows: layout.rows, cols: layout.cols }));
      } catch (e) {}
    }
  }, [serverLayout]);

  // Fetch category rates on mount
  useEffect(() => {
    let isMounted = true;
    const fetchCategoryRates = async () => {
      try {
        const catRes = await categoryService.getAll();
        if (isMounted && catRes.success && catRes.data) {
          setCategoryRates(catRes.data as Record<string, CategoryRateConfig>);
        }
      } catch (err) {
        console.warn('API getCategories unavailable, using local cache:', err);
      }
    };

    fetchCategoryRates();
    return () => {
      isMounted = false;
    };
  }, []);

  // Persist to localStorage as offline fallback
  useEffect(() => {
    try {
      localStorage.setItem('viya_library_seat_layout', JSON.stringify(cells));
    } catch (e) {
      console.error(e);
    }
  }, [cells]);

  useEffect(() => {
    try {
      localStorage.setItem('viya_seat_categories', JSON.stringify(categoryRates));
    } catch (e) {
      console.error(e);
    }
  }, [categoryRates]);

  // Switch to Edit Mode
  const handleStartEdit = () => {
    setBackupLayout({
      cells: JSON.parse(JSON.stringify(cells)),
      rows,
      cols
    });
    setIsEditMode(true);
    if (showToast) showToast('Edit Layout mode active. Adjust rows/columns or modify seats.');
  };

  const handleSaveEdit = async () => {
    requireAdminAuth(
      {
        title: 'Save Seating Layout',
        description: 'Please enter your admin password to save library seating layout and desk arrangement.',
        actionLabel: 'Verify & Save Layout'
      },
      async () => {
        setIsEditMode(false);
        try {
          localStorage.setItem('viya_library_seat_layout', JSON.stringify(cells));
          localStorage.setItem('viya_library_grid_dims', JSON.stringify({ rows, cols }));
          await seatService.saveLayout({ rows, cols, cells });
          if (showToast) showToast('Seating layout saved successfully!', 'success');
        } catch (e: any) {
          console.error('Error saving layout to backend:', e);
          if (showToast) showToast(e?.message || 'Failed to save layout to server.', 'error');
        }
      }
    );
  };

  const handleCancelEdit = () => {
    setCells(backupLayout.cells);
    setRows(backupLayout.rows);
    setCols(backupLayout.cols);
    setIsEditMode(false);
    if (showToast) showToast('Layout changes cancelled.');
  };

  // Renumber seats sequentially: 1, 2, 3, 4, 5... (Strictly numbers only!)
  const renumberCells = (gridList: SeatGridCell[]): SeatGridCell[] => {
    let currentNumber = 1;
    return gridList.map((cell) => {
      if (!cell.isSeat) {
        return { ...cell, seatNumber: null };
      }
      const num = currentNumber++;
      return { ...cell, seatNumber: num };
    });
  };

  // Adjust Grid Dimensions in Real-Time (supports up to 50 rows & columns)
  const handleUpdateGridDimensions = async (newRows: number, newCols: number) => {
    const safeRows = Math.max(1, Math.min(50, newRows));
    const safeCols = Math.max(1, Math.min(50, newCols));

    // Prevent reducing dimensions if any occupied seat with student would be cut off
    const wouldDeleteOccupied = cells.some(
      (c) => (c.row > safeRows || c.col > safeCols) && c.isSeat && c.status === 'Occupied' && c.assignedStudent
    );
    if (wouldDeleteOccupied) {
      if (showAlert) {
        await showAlert({
          title: 'Cannot Reduce Layout Size',
          message: 'One or more seats in the area to be removed currently have assigned students.\n\nPlease unassign or relocate those students first before shrinking the grid.',
          confirmText: 'Understood',
          variant: 'warning'
        });
      }
      return;
    }

    setRows(safeRows);
    setCols(safeCols);

    const existingMap = new Map<string, SeatGridCell>();
    cells.forEach((c) => {
      existingMap.set(`${c.row}-${c.col}`, c);
    });

    const newCells: SeatGridCell[] = [];
    for (let r = 1; r <= safeRows; r++) {
      for (let c = 1; c <= safeCols; c++) {
        const key = `${r}-${c}`;
        const existing = existingMap.get(key);
        if (existing) {
          newCells.push(existing);
        } else {
          // New available normal seat
          newCells.push({
            id: `cell-${r}-${c}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            row: r,
            col: c,
            isSeat: true,
            seatNumber: 1, // dynamically renumbered below
            category: 'Normal',
            status: 'Available',
            monthlyFee: categoryRates.Normal?.rate || 600,
            addedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            assignedStudent: null
          });
        }
      }
    }

    const renumbered = renumberCells(newCells);
    setCells(renumbered);
  };

  // Toggle single cell between Seat and Aisle/Empty Space
  const handleToggleAisleOrRemove = async (targetCell: SeatGridCell) => {
    if (targetCell.isSeat && targetCell.status === 'Occupied' && targetCell.assignedStudent) {
      if (showAlert) {
        await showAlert({
          title: 'Seat Has Assigned Student',
          message: `Cannot remove Seat #${targetCell.seatNumber} because ${targetCell.assignedStudent.name} is currently assigned to it.\n\nPlease unassign the student before converting this seat.`,
          confirmText: 'Got It',
          variant: 'warning'
        });
      }
      return;
    }

    requireAdminAuth(
      {
        title: 'Authorize Space/Aisle Change',
        description: `Please enter the admin password to convert this desk into an aisle or open space.`,
        actionLabel: 'Authorize Change'
      },
      () => {
        const updated = cells.map((c) => {
          if (c.id === targetCell.id) {
            const nextIsSeat = !c.isSeat;
            return {
              ...c,
              isSeat: nextIsSeat,
              status: nextIsSeat ? ('Available' as const) : ('Available' as const),
              assignedStudent: null
            };
          }
          return c;
        });

        setCells(renumberCells(updated));
      }
    );
  };

  // Toggle Maintenance status (Quick Action - No password required)
  const handleToggleMaintenance = async (targetCell: SeatGridCell) => {
    if (targetCell.status === 'Occupied') {
      if (showAlert) {
        await showAlert({
          title: 'Seat Currently Occupied',
          message: `Cannot put Seat #${targetCell.seatNumber} under maintenance while a student is assigned.\n\nPlease reassign or relocate the student first.`,
          confirmText: 'Understood',
          variant: 'warning'
        });
      }
      return;
    }

    const nextStatus = targetCell.status === 'Maintenance' ? 'Available' : 'Maintenance';
    setCells((prev) =>
      prev.map((c) => (c.id === targetCell.id ? { ...c, status: nextStatus } : c))
    );
    try {
      await seatService.updateCell(targetCell.id, { status: nextStatus });
    } catch (e) {
      console.warn('API sync toggle maintenance failed:', e);
    }
    if (showToast) {
      showToast(
        nextStatus === 'Maintenance'
          ? `Seat #${targetCell.seatNumber} put under Maintenance.`
          : `Seat #${targetCell.seatNumber} marked Available.`
      );
    }
  };

  // Assign Student to Seat
  const handleAssignStudent = async (cellId: string, studentData: any) => {
    requireAdminAuth(
      {
        title: 'Authorize Student Assignment',
        description: `Please enter the admin password to assign this seat to ${studentData.name}.`,
        actionLabel: 'Authorize & Assign'
      },
      async () => {
        setCells((prev) =>
          prev.map((c) => {
            if (c.id === cellId) {
              return {
                ...c,
                status: 'Occupied',
                assignedStudent: studentData
              };
            }
            return c;
          })
        );
        try {
          await seatService.assignStudent(cellId, studentData.id);
          if (showToast) showToast(`Seat assigned to ${studentData.name} successfully!`, 'success');
        } catch (e: any) {
          console.warn('API sync assign student failed:', e);
          if (showToast) showToast(e?.message || 'Failed to sync student assignment to server.', 'error');
        }
      }
    );
  };

  // Unassign Student
  const handleUnassignStudent = async (targetCell: SeatGridCell) => {
    const studentName = targetCell.assignedStudent?.name || 'Student';
    if (showConfirm) {
      const isConfirmed = await showConfirm({
        title: 'Unassign Student from Seat?',
        message: `Are you sure you want to unassign "${studentName}" from Seat #${targetCell.seatNumber}?\n\nThis seat will immediately become Available for other students.`,
        confirmText: 'Yes, Unassign',
        cancelText: 'Keep Assigned',
        variant: 'warning'
      });
      if (!isConfirmed) return;
    }

    requireAdminAuth(
      {
        title: 'Authorize Student Unassignment',
        description: `Please enter the admin password to unassign ${studentName} from Seat #${targetCell.seatNumber}.`,
        actionLabel: 'Authorize Unassign'
      },
      async () => {
        setCells((prev) =>
          prev.map((c) => {
            if (c.id === targetCell.id) {
              return {
                ...c,
                status: 'Available',
                assignedStudent: null
              };
            }
            return c;
          })
        );
        try {
          await seatService.unassignStudent(targetCell.id);
          if (showToast) showToast(`${studentName} unassigned from Seat ${targetCell.seatNumber}.`, 'success');
        } catch (e: any) {
          console.warn('API sync unassign student failed:', e);
          if (showToast) showToast(e?.message || 'Failed to sync unassign to server.', 'error');
        }
      }
    );
  };

  // Save updated category rates
  const handleSaveRates = async (newRates: Record<string, number>) => {
    requireAdminAuth(
      {
        title: 'Authorize Seat Rate Changes',
        description: 'Please enter the admin password to update seat category rates and pricing.',
        actionLabel: 'Authorize & Save Rates'
      },
      async () => {
        const updatedRates: Record<string, CategoryRateConfig> = { ...categoryRates };
        Object.keys(newRates).forEach((cat) => {
          if (updatedRates[cat]) {
            updatedRates[cat].rate = newRates[cat];
          }
        });

        setCategoryRates(updatedRates);

        // Update monthly fee on all seats of that category
        setCells((prev) =>
          prev.map((c) => {
            if (c.isSeat && newRates[c.category]) {
              return { ...c, monthlyFee: newRates[c.category] };
            }
            return c;
          })
        );

        try {
          await categoryService.updateAll(updatedRates);
        } catch (e) {
          console.warn('API sync update rates failed:', e);
        }
        if (showToast) showToast('Seat category rates updated successfully!');
      }
    );
  };

  // Update a single cell
  const handleSaveSeatUpdates = async (cellId: string, updates: Partial<SeatGridCell>) => {
    requireAdminAuth(
      {
        title: 'Authorize Seat Configuration',
        description: 'Please enter the admin password to update seat details and pricing configuration.',
        actionLabel: 'Authorize Update'
      },
      async () => {
        setCells((prev) =>
          prev.map((c) => (c.id === cellId ? { ...c, ...updates } : c))
        );
        try {
          await seatService.updateCell(cellId, updates);
        } catch (e) {
          console.warn('API sync seat update failed:', e);
        }
        if (showToast) showToast('Seat details updated.');
      }
    );
  };

  // Quick change seat category (1-click from Quick Actions or Seat Map - No password required)
  const handleQuickChangeCategory = async (cellId: string, newCategory: SeatCategory) => {
    const rate = categoryRates[newCategory]?.rate || (newCategory === 'Premium' ? 800 : newCategory === 'Locker' ? 650 : 600);
    const updates = {
      category: newCategory,
      monthlyFee: rate
    };

    setCells((prev) =>
      prev.map((c) => (c.id === cellId ? { ...c, ...updates } : c))
    );

    try {
      await seatService.updateCell(cellId, updates);
    } catch (e) {
      console.warn('API sync seat category failed:', e);
    }

    const targetCell = cells.find((c) => c.id === cellId);
    const seatNo = targetCell ? targetCell.seatNumber : '';
    if (showToast) showToast(`Seat #${seatNo} category changed to ${newCategory} (₹${rate}/month)`);
  };

  return (
    <>
      {/* 1. Mobile Screen Notice (Seat Management is hidden on Mobile) */}
      <div className="lg:hidden flex flex-col items-center justify-center min-h-[65vh] text-center p-6 bg-white rounded-2xl border border-[#EDF1F7] shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 ring-8 ring-amber-50/50">
          <Monitor size={32} />
        </div>
        <h3 className="text-base sm:text-lg font-black text-[#192038] m-0">
          Desktop Only Feature
        </h3>
        <p className="text-xs text-[#8F9BB3] max-w-xs mt-2 leading-relaxed">
          The interactive seating layout editor is optimized for larger displays. Please open this page on a desktop or laptop computer.
        </p>
        <div className="flex items-center gap-2.5 mt-6">
          <Link
            to="/admin"
            className="px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#EDF1F7] text-xs font-bold text-[#6B778C] hover:bg-[#EDF1F7] transition-all"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/students"
            className="px-4 py-2.5 rounded-xl bg-[#544bec] text-white text-xs font-extrabold shadow-sm shadow-[#544bec]/30 transition-all"
          >
            Go to Students
          </Link>
        </div>
      </div>

      {/* 2. Desktop / Laptop Interface (Hidden on mobile) */}
      <div className="hidden lg:block space-y-6">
        {/* Header with Title */}
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#192038] m-0">
            Seat Management
          </h2>
          <p className="text-sm text-[#8F9BB3] mt-1 m-0">
            Design and manage your library seat layout, categories and occupancy.
          </p>
        </div>

        {/* Top Summary KPI Cards */}
        <SeatStatCards
          totalSeats={metrics.total}
          availableCount={metrics.available}
          occupiedCount={metrics.occupied}
          maintenanceCount={metrics.maintenance}
        />

        {/* Category Filter Buttons & Status Legend */}
        <SeatCategoryLegend
          selectedCategory={selectedCategoryFilter}
          onSelectCategory={setSelectedCategoryFilter}
          counts={metrics.counts}
        />

        {/* Main Two-Column Layout (Seat Map on left, Seat Details on right) */}
        <div className="grid grid-cols-12 gap-5 items-start">
          {/* Visual Seat Map (Spans 8 cols) */}
          <div className="col-span-8">
            <VisualSeatMap
              cells={cells}
              rows={rows}
              cols={cols}
              selectedCell={selectedCell}
              onSelectCell={(cell) => setSelectedCellId(cell.id)}
              isEditMode={isEditMode}
              onStartEdit={handleStartEdit}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              onUpdateGridDimensions={handleUpdateGridDimensions}
              onUpdateCell={(id, up) => handleSaveSeatUpdates(id, up)}
              categoryFilter={selectedCategoryFilter}
            />
          </div>

          {/* Seat Details Panel (Spans 4 cols) */}
          <div className="col-span-4 sticky top-6">
            <SeatDetailPanel
              cell={selectedCell}
              isEditMode={isEditMode}
              onClose={() => setSelectedCellId('')}
              onAssignStudent={() => setIsAssignModalOpen(true)}
              onToggleMaintenance={handleToggleMaintenance}
              onToggleAisleOrRemove={handleToggleAisleOrRemove}
              onEditCellCategory={() => setIsEditSeatModalOpen(true)}
              categoryRates={categoryRates}
              onOpenEditRates={() => setIsEditRatesModalOpen(true)}
              onUnassignStudent={handleUnassignStudent}
              onQuickChangeCategory={handleQuickChangeCategory}
              categoryCounts={metrics.counts}
            />
          </div>
        </div>
      </div>

      {/* Assign Student Modal */}
      <AssignStudentModal
        isOpen={isAssignModalOpen}
        cell={selectedCell}
        onClose={() => setIsAssignModalOpen(false)}
        onAssign={handleAssignStudent}
        existingAssignments={existingAssignments}
      />

      {/* Edit Rates Modal */}
      <EditRatesModal
        isOpen={isEditRatesModalOpen}
        rates={categoryRates}
        onClose={() => setIsEditRatesModalOpen(false)}
        onSaveRates={handleSaveRates}
      />

      {/* Edit Single Seat Modal */}
      <EditSeatModal
        isOpen={isEditSeatModalOpen}
        cell={selectedCell}
        categoryRates={categoryRates}
        onClose={() => setIsEditSeatModalOpen(false)}
        onSaveSeat={handleSaveSeatUpdates}
      />

      {/* Admin Password Verification Modal */}
      <AdminPasswordModal
        isOpen={adminAuthModal.isOpen}
        title={adminAuthModal.title}
        description={adminAuthModal.description}
        actionLabel={adminAuthModal.actionLabel}
        adminEmail={user?.email}
        onConfirm={adminAuthModal.onAuthorize}
        onCancel={() => setAdminAuthModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
};
