import React, { useState, useEffect } from 'react';
import {
  Settings,
  Building,
  Clock,
  Wifi,
  Shield,
  Save,
  Download,
  RotateCcw,
  CheckCircle2,
  Lock,
  Phone,
  Mail,
  MapPin,
  IndianRupee,
  Layers,
  BadgePercent,
  Tag,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { getStoredSettings } from '../utils/storage';
import { MultiMonthDiscount, DEFAULT_DISCOUNTS, calculateMultiMonthFee } from '../utils/discountUtils';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, showToast, showConfirm, resetDemoData, students } = useLibrary();

  // Local form state initialized from context settings
  const [formData, setFormData] = useState({
    libraryName: settings?.libraryName || 'Vidya Library',
    tagline: settings?.tagline || 'Your Space to Grow • Premium Study Lounge',
    phone: settings?.phone || '9303961613',
    email: settings?.email || 'admin@vidyalibrary.com',
    address: settings?.address || '66W8+4FH, Gayatri Nagar, Gwalior, MP 474005',
    upiId: settings?.upiId || 'vidyalibrary@upi',

    // Operating hours & shifts
    openingTime: settings?.openingTime || '06:00 AM',
    closingTime: settings?.closingTime || '11:00 PM',
    morningRate: settings?.morningRate || '800',
    eveningRate: settings?.eveningRate || '800',
    nightRate: settings?.nightRate || '900',
    fullDayRate: settings?.fullDayRate || '1200',
    reservedSurcharge: settings?.reservedSurcharge || '200',

    // Rules & amenities
    wifiSSID: settings?.wifiSSID || 'Vidya_HighSpeed_5G',
    wifiPassword: settings?.wifiPassword || 'StudyHard@2026',
    gracePeriodDays: settings?.gracePeriodDays || '3',
    totalSeatsCapacity: settings?.totalSeatsCapacity || '164',
    lockerFee: settings?.lockerFee || '150',

    // Admin Credentials
    adminName: settings?.adminName || 'Admin',
    adminEmail: settings?.adminEmail || 'admin@vidyalibrary.com',
    adminPhone: settings?.adminPhone || settings?.phone || '9303961613',

    // Multi-Month Discounts
    multiMonthDiscounts: (settings?.multiMonthDiscounts && settings.multiMonthDiscounts.length > 0)
      ? settings.multiMonthDiscounts
      : DEFAULT_DISCOUNTS
  });

  const [activeSection, setActiveSection] = useState<'profile' | 'shifts' | 'discounts' | 'rules' | 'account'>('profile');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Discount Modal State
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [editingDiscountId, setEditingDiscountId] = useState<string | null>(null);
  const [discountForm, setDiscountForm] = useState<{
    months: number;
    discountType: 'percentage' | 'flat';
    discountValue: number;
    label: string;
    isActive: boolean;
  }>({
    months: 3,
    discountType: 'percentage',
    discountValue: 10,
    label: '3 Months Advance (10% OFF)',
    isActive: true
  });

  // Sync form state when backend settings are retrieved from database
  useEffect(() => {
    if (settings) {
      setFormData((prev) => ({
        ...prev,
        ...settings,
        phone: settings.phone || settings.adminPhone || prev.phone,
        adminPhone: settings.adminPhone || settings.phone || prev.adminPhone || prev.phone,
        multiMonthDiscounts: Array.isArray(settings.multiMonthDiscounts) && settings.multiMonthDiscounts.length > 0
          ? settings.multiMonthDiscounts
          : (prev.multiMonthDiscounts || DEFAULT_DISCOUNTS)
      }));
    }
  }, [settings]);

  // Discount Handlers
  const handleOpenAddDiscount = () => {
    setEditingDiscountId(null);
    setDiscountForm({
      months: 3,
      discountType: 'percentage',
      discountValue: 10,
      label: '3 Months Advance (10% OFF)',
      isActive: true
    });
    setIsDiscountModalOpen(true);
  };

  const handleOpenEditDiscount = (disc: MultiMonthDiscount) => {
    setEditingDiscountId(disc.id);
    setDiscountForm({
      months: disc.months,
      discountType: disc.discountType,
      discountValue: disc.discountValue,
      label: disc.label || `${disc.months} Months Advance (${disc.discountValue}${disc.discountType === 'percentage' ? '%' : '₹'} OFF)`,
      isActive: disc.isActive !== false
    });
    setIsDiscountModalOpen(true);
  };

  const handleSaveDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    const monthsNum = Number(discountForm.months) || 3;
    const valNum = Number(discountForm.discountValue) || 0;

    if (monthsNum < 2) {
      showToast('Advance discount requires at least 2 months.', 'error');
      return;
    }
    if (valNum <= 0) {
      showToast('Please enter a valid discount value greater than 0.', 'error');
      return;
    }

    const currentList: MultiMonthDiscount[] = Array.isArray(formData.multiMonthDiscounts)
      ? [...formData.multiMonthDiscounts]
      : [...DEFAULT_DISCOUNTS];

    let updatedList: MultiMonthDiscount[];
    if (editingDiscountId) {
      updatedList = currentList.map((d) =>
        d.id === editingDiscountId
          ? {
              ...d,
              months: monthsNum,
              discountType: discountForm.discountType,
              discountValue: valNum,
              label: discountForm.label.trim() || `${monthsNum} Months (${valNum}${discountForm.discountType === 'percentage' ? '%' : '₹'} OFF)`,
              isActive: discountForm.isActive
            }
          : d
      );
    } else {
      const newDisc: MultiMonthDiscount = {
        id: `disc_${Date.now()}`,
        months: monthsNum,
        discountType: discountForm.discountType,
        discountValue: valNum,
        label: discountForm.label.trim() || `${monthsNum} Months Advance (${valNum}${discountForm.discountType === 'percentage' ? '%' : '₹'} OFF)`,
        isActive: discountForm.isActive
      };
      // If a discount for this number of months already exists, replace it
      const existingIdx = currentList.findIndex((d) => Number(d.months) === monthsNum);
      if (existingIdx >= 0) {
        currentList[existingIdx] = newDisc;
        updatedList = currentList;
      } else {
        updatedList = [...currentList, newDisc].sort((a, b) => a.months - b.months);
      }
    }

    const nextFormData = {
      ...formData,
      multiMonthDiscounts: updatedList
    };

    setFormData(nextFormData);
    setIsDiscountModalOpen(false);

    try {
      if (updateSettings) {
        await updateSettings(nextFormData);
      }
      showToast(`Discount for ${monthsNum} Months saved successfully!`);
    } catch {
      showToast('Error syncing discount to server', 'error');
    }
  };

  const handleToggleDiscountActive = async (id: string) => {
    const currentList: MultiMonthDiscount[] = Array.isArray(formData.multiMonthDiscounts)
      ? [...formData.multiMonthDiscounts]
      : [...DEFAULT_DISCOUNTS];

    const updatedList = currentList.map((d) =>
      d.id === id ? { ...d, isActive: !d.isActive } : d
    );

    const nextFormData = {
      ...formData,
      multiMonthDiscounts: updatedList
    };

    setFormData(nextFormData);
    if (updateSettings) {
      await updateSettings(nextFormData);
    }
    showToast('Discount status updated!');
  };

  const handleDeleteDiscount = async (id: string, months: number) => {
    const confirmed = await showConfirm({
      title: 'Delete Discount Offer',
      message: `Are you sure you want to delete the ${months} Months advance discount offer?`,
      confirmText: 'Yes, Delete',
      cancelText: 'Keep Offer',
      variant: 'danger'
    });

    if (!confirmed) return;

    const currentList: MultiMonthDiscount[] = Array.isArray(formData.multiMonthDiscounts)
      ? [...formData.multiMonthDiscounts]
      : [...DEFAULT_DISCOUNTS];

    const updatedList = currentList.filter((d) => d.id !== id);
    const nextFormData = {
      ...formData,
      multiMonthDiscounts: updatedList
    };

    setFormData(nextFormData);
    if (updateSettings) {
      await updateSettings(nextFormData);
    }
    showToast(`Discount for ${months} Months removed!`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      // Keep phone and adminPhone in lockstep
      if (name === 'phone') next.adminPhone = value;
      if (name === 'adminPhone') next.phone = value;
      return next;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (updateSettings) {
        await updateSettings(formData);
      } else {
        localStorage.setItem('vidya_library_settings_v2', JSON.stringify(formData));
        showToast('Settings saved successfully!');
      }
    } catch {
      showToast('Error saving settings to database', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Export full JSON Backup
  const handleExportBackup = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      libraryName: formData.libraryName,
      settings: formData,
      totalStudents: students?.length || 0,
      students: students || []
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Vidya_Library_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Database backup downloaded successfully!');
  };

  // Reset to default
  const handleResetDefaults = async () => {
    const confirmed = await showConfirm({
      title: 'Reset to Default Settings?',
      message: 'Are you sure you want to restore default library settings? This will reset custom pricing and contact details.',
      confirmText: 'Yes, Reset',
      variant: 'warning'
    });

    if (confirmed) {
      const defaults = {
        libraryName: 'Vidya Library',
        tagline: 'Your Space to Grow • Premium Study Lounge',
        phone: '9303961613',
        email: 'admin@vidyalibrary.com',
        address: '66W8+4FH, Gayatri Nagar, Gwalior, MP 474005',
        upiId: 'vidyalibrary@upi',
        openingTime: '06:00 AM',
        closingTime: '11:00 PM',
        morningRate: '800',
        eveningRate: '800',
        nightRate: '900',
        fullDayRate: '1200',
        reservedSurcharge: '200',
        wifiSSID: 'Vidya_HighSpeed_5G',
        wifiPassword: 'StudyHard@2026',
        gracePeriodDays: '3',
        totalSeatsCapacity: '164',
        lockerFee: '150',
        adminName: 'Admin',
        adminEmail: 'admin@vidyalibrary.com',
        adminPhone: '9303961613',
        multiMonthDiscounts: DEFAULT_DISCOUNTS
      };
      setFormData(defaults);
      if (updateSettings) updateSettings(defaults);
      showToast('Settings restored to defaults!');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#192038] m-0">
            Settings
          </h2>
          <p className="text-xs sm:text-sm text-[#8F9BB3] mt-1 m-0">
            Configure library profile, shift hours, monthly pricing plans, library rules, and administrative account.
          </p>
        </div>

        {/* Save Changes Button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-[#544bec] text-white hover:bg-[#4338ca] shadow-sm shadow-[#544bec]/30 inline-flex items-center gap-2 transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* 2. Horizontal Section Nav Tabs */}
      <div className="bg-white rounded-2xl p-1.5 border border-[#EDF1F7] shadow-xs flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => setActiveSection('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSection === 'profile'
              ? 'bg-[#544bec] text-white shadow-xs'
              : 'text-[#6B778C] hover:text-[#192038] hover:bg-[#F7F9FC]'
          }`}
        >
          <Building size={14} />
          <span>Library Profile</span>
        </button>

        <button
          onClick={() => setActiveSection('shifts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSection === 'shifts'
              ? 'bg-[#544bec] text-white shadow-xs'
              : 'text-[#6B778C] hover:text-[#192038] hover:bg-[#F7F9FC]'
          }`}
        >
          <Clock size={14} />
          <span>Shifts & Pricing</span>
        </button>

        <button
          onClick={() => setActiveSection('discounts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSection === 'discounts'
              ? 'bg-[#544bec] text-white shadow-xs'
              : 'text-[#6B778C] hover:text-[#192038] hover:bg-[#F7F9FC]'
          }`}
        >
          <BadgePercent size={14} />
          <span>Multi-Month Discounts</span>
        </button>

        <button
          onClick={() => setActiveSection('rules')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSection === 'rules'
              ? 'bg-[#544bec] text-white shadow-xs'
              : 'text-[#6B778C] hover:text-[#192038] hover:bg-[#F7F9FC]'
          }`}
        >
          <Wifi size={14} />
          <span>Rules & Wi-Fi</span>
        </button>

        <button
          onClick={() => setActiveSection('account')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSection === 'account'
              ? 'bg-[#544bec] text-white shadow-xs'
              : 'text-[#6B778C] hover:text-[#192038] hover:bg-[#F7F9FC]'
          }`}
        >
          <Shield size={14} />
          <span>Account & Backup</span>
        </button>
      </div>

      {/* 3. Section Content Panels */}

      {/* SECTION 1: LIBRARY PROFILE */}
      {activeSection === 'profile' && (
        <div className="bg-white rounded-2xl border border-[#EDF1F7] shadow-xs p-6 space-y-6">
          <div className="border-b border-[#EDF1F7] pb-4">
            <h3 className="text-base font-extrabold text-[#192038] m-0">
              Library Profile & Public Information
            </h3>
            <p className="text-xs text-[#8F9BB3] mt-1 m-0">
              This information appears on fee payment receipts and top dashboard branding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Library Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#192038]">
                Library Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="libraryName"
                value={formData.libraryName}
                onChange={handleChange}
                placeholder="e.g. Vidya Library"
                className="w-full px-4 py-2.5 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs font-semibold text-[#192038] focus:outline-none focus:border-[#544bec] focus:bg-white transition-all"
              />
            </div>

            {/* Tagline */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#192038]">Tagline / Slogan</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="e.g. Your Space to Grow"
                className="w-full px-4 py-2.5 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs font-semibold text-[#192038] focus:outline-none focus:border-[#544bec] focus:bg-white transition-all"
              />
            </div>

            {/* Contact Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#192038]">Contact Phone</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F9BB3]" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9303961613"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs font-semibold text-[#192038] focus:outline-none focus:border-[#544bec] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Contact Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#192038]">Contact Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F9BB3]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@vidyalibrary.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs font-semibold text-[#192038] focus:outline-none focus:border-[#544bec] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* UPI ID for Fees */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#192038]">UPI ID (For Receipt QR / Digital Fee)</label>
              <div className="relative">
                <IndianRupee size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F9BB3]" />
                <input
                  type="text"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleChange}
                  placeholder="vidyalibrary@upi"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs font-semibold text-[#192038] focus:outline-none focus:border-[#544bec] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Physical Address */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-[#192038]">Physical Address</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3.5 top-3 text-[#8F9BB3]" />
                <textarea
                  rows={2}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Near Metro Gate 2, Main Market, New Delhi"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs font-semibold text-[#192038] focus:outline-none focus:border-[#544bec] focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: SHIFTS & PRICING */}
      {activeSection === 'shifts' && (
        <div className="bg-white rounded-2xl border border-[#EDF1F7] shadow-xs p-6 space-y-6">
          <div className="border-b border-[#EDF1F7] pb-4">
            <h3 className="text-base font-extrabold text-[#192038] m-0">
              Shift Timings & Default Monthly Fee Plans
            </h3>
            <p className="text-xs text-[#8F9BB3] mt-1 m-0">
              Define the working hours and base rates for study shifts in the library.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Opening / Closing Hours */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#192038]">Hall Opening Time</label>
              <input
                type="text"
                name="openingTime"
                value={formData.openingTime}
                onChange={handleChange}
                placeholder="06:00 AM"
                className="w-full px-4 py-2.5 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs font-semibold text-[#192038] focus:outline-none focus:border-[#544bec] focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#192038]">Hall Closing Time</label>
              <input
                type="text"
                name="closingTime"
                value={formData.closingTime}
                onChange={handleChange}
                placeholder="11:00 PM"
                className="w-full px-4 py-2.5 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs font-semibold text-[#192038] focus:outline-none focus:border-[#544bec] focus:bg-white transition-all"
              />
            </div>

            {/* Morning Shift Rate */}
            <div className="p-4 bg-[#F8FAFD] rounded-xl border border-[#EDF1F7] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#192038]">Morning Shift (06 AM - 02 PM)</span>
                <span className="text-[10px] font-bold text-[#544bec] bg-[#EEF0FD] px-2 py-0.5 rounded">8 Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8F9BB3]">Monthly Fee: ₹</span>
                <input
                  type="number"
                  name="morningRate"
                  value={formData.morningRate}
                  onChange={handleChange}
                  className="w-32 px-3 py-1.5 bg-white border border-[#EDF1F7] rounded-lg text-xs font-extrabold text-[#192038] focus:outline-none focus:border-[#544bec]"
                />
              </div>
            </div>

            {/* Evening Shift Rate */}
            <div className="p-4 bg-[#F8FAFD] rounded-xl border border-[#EDF1F7] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#192038]">Evening Shift (02 PM - 10 PM)</span>
                <span className="text-[10px] font-bold text-[#544bec] bg-[#EEF0FD] px-2 py-0.5 rounded">8 Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8F9BB3]">Monthly Fee: ₹</span>
                <input
                  type="number"
                  name="eveningRate"
                  value={formData.eveningRate}
                  onChange={handleChange}
                  className="w-32 px-3 py-1.5 bg-white border border-[#EDF1F7] rounded-lg text-xs font-extrabold text-[#192038] focus:outline-none focus:border-[#544bec]"
                />
              </div>
            </div>

            {/* Night Shift Rate */}
            <div className="p-4 bg-[#F8FAFD] rounded-xl border border-[#EDF1F7] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#192038]">Night Shift (10 PM - 06 AM)</span>
                <span className="text-[10px] font-bold text-[#544bec] bg-[#EEF0FD] px-2 py-0.5 rounded">8 Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8F9BB3]">Monthly Fee: ₹</span>
                <input
                  type="number"
                  name="nightRate"
                  value={formData.nightRate}
                  onChange={handleChange}
                  className="w-32 px-3 py-1.5 bg-white border border-[#EDF1F7] rounded-lg text-xs font-extrabold text-[#192038] focus:outline-none focus:border-[#544bec]"
                />
              </div>
            </div>

            {/* Full Day Rate */}
            <div className="p-4 bg-[#F8FAFD] rounded-xl border border-[#EDF1F7] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#192038]">Full Day (24/7 Access)</span>
                <span className="text-[10px] font-bold text-[#544bec] bg-[#EEF0FD] px-2 py-0.5 rounded">Unlimited</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8F9BB3]">Monthly Fee: ₹</span>
                <input
                  type="number"
                  name="fullDayRate"
                  value={formData.fullDayRate}
                  onChange={handleChange}
                  className="w-32 px-3 py-1.5 bg-white border border-[#EDF1F7] rounded-lg text-xs font-extrabold text-[#192038] focus:outline-none focus:border-[#544bec]"
                />
              </div>
            </div>

            {/* Reserved Desk Surcharge */}
            <div className="p-4 bg-[#EEF0FD]/40 rounded-xl border border-[#544bec]/20 md:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#192038]">Fixed Reserved Desk Surcharge</span>
                <span className="text-[10px] font-bold text-[#544bec] bg-[#EEF0FD] px-2 py-0.5 rounded">Optional Add-on</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8F9BB3]">Additional surcharge per month: ₹</span>
                <input
                  type="number"
                  name="reservedSurcharge"
                  value={formData.reservedSurcharge}
                  onChange={handleChange}
                  className="w-32 px-3 py-1.5 bg-white border border-[#EDF1F7] rounded-lg text-xs font-extrabold text-[#192038] focus:outline-none focus:border-[#544bec]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2.5: MULTI-MONTH ADVANCE PAYMENT DISCOUNTS */}
      {activeSection === 'discounts' && (
        <div className="bg-white rounded-2xl border border-[#EDF1F7] shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDF1F7] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-emerald-50 text-[#544bec] flex items-center justify-center font-bold">
                  <BadgePercent size={18} />
                </span>
                <h3 className="text-base font-extrabold text-[#192038] m-0">
                  Multi-Month Advance Fee Discounts
                </h3>
              </div>
              <p className="text-xs text-[#8F9BB3] mt-1 m-0">
                Configure tiered discounts when students pay for 3, 6, or 12 months in advance. These discounts are automatically applied during admission and fee collection.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddDiscount}
              className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-[#544bec] text-white hover:bg-[#4338ca] shadow-sm shadow-[#544bec]/30 inline-flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto shrink-0"
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>Create Discount Offer</span>
            </button>
          </div>

          {/* Quick Notice Banner */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50/40 border border-emerald-200/60 rounded-xl flex items-start gap-3">
            <Sparkles size={18} className="text-[#544bec] shrink-0 mt-0.5" />
            <div className="text-xs text-[#192038] leading-relaxed">
              <strong className="text-[#544bec]">Automated Advance Savings:</strong> Configured offers automatically apply when choosing multi-month plans during student admission or fee collection. You can edit or toggle offers anytime.
            </div>
          </div>

          {/* Discount Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Array.isArray(formData.multiMonthDiscounts) ? formData.multiMonthDiscounts : []).map((disc) => {
              const basePrice = Number(formData.morningRate || 800);
              const calc = calculateMultiMonthFee(disc.months, basePrice, [disc]);

              return (
                <div
                  key={disc.id}
                  className={`p-4 rounded-2xl border transition-all relative flex flex-col justify-between ${
                    disc.isActive !== false
                      ? 'border-[#EDF1F7] bg-white hover:border-[#544bec]/40 hover:shadow-xs'
                      : 'border-slate-200 bg-slate-50/80 opacity-75'
                  }`}
                >
                  <div>
                    {/* Top row: badge & active toggle */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-[#EEF0FD] text-[#544bec] border border-[#544bec]/20">
                        {disc.months} Months Plan
                      </span>

                      <button
                        type="button"
                        onClick={() => handleToggleDiscountActive(disc.id)}
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                          disc.isActive !== false
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {disc.isActive !== false ? '● Active' : '○ Disabled'}
                      </button>
                    </div>

                    {/* Discount Value Display */}
                    <div className="mt-3">
                      <div className="text-2xl font-black text-[#192038] tracking-tight">
                        {disc.discountType === 'percentage' ? `${disc.discountValue}% OFF` : `₹${disc.discountValue} FLAT OFF`}
                      </div>
                      <div className="text-xs font-semibold text-[#6B778C] mt-0.5 truncate">
                        {disc.label || `${disc.months} Months Advance Offer`}
                      </div>
                    </div>

                    {/* Example Live Calculation Card */}
                    <div className="mt-3.5 p-2.5 rounded-xl bg-[#F8FAFD] border border-[#EDF1F7] text-[11px] space-y-1">
                      <div className="flex justify-between text-[#8F9BB3]">
                        <span>Standard (₹{basePrice} × {disc.months}m):</span>
                        <span className="line-through">₹{calc.originalTotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between font-bold text-emerald-600">
                        <span>Discount Savings:</span>
                        <span>-₹{calc.discountAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between font-extrabold text-[#192038] pt-1 border-t border-[#EDF1F7]">
                        <span>Student Pays:</span>
                        <span className="text-[#544bec]">₹{calc.finalTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-[#EDF1F7] flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditDiscount(disc)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#6B778C] hover:text-[#544bec] hover:bg-[#EEF0FD] transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 size={12} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteDiscount(disc.id, disc.months)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 size={12} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {(!formData.multiMonthDiscounts || formData.multiMonthDiscounts.length === 0) && (
            <div className="p-8 text-center bg-[#F8FAFD] border border-dashed border-[#EDF1F7] rounded-2xl">
              <BadgePercent size={32} className="mx-auto text-[#8F9BB3] mb-2" />
              <p className="text-xs font-bold text-[#192038]">No discount offers configured yet.</p>
              <p className="text-[11px] text-[#8F9BB3] mt-0.5">Click "Create Discount Offer" above to configure advance payment savings.</p>
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: RULES & WI-FI */}
      {activeSection === 'rules' && (
        <div className="bg-white rounded-2xl border border-[#EDF1F7] shadow-xs p-6 space-y-6">
          <div className="border-b border-[#EDF1F7] pb-4">
            <h3 className="text-base font-extrabold text-[#192038] m-0">
              Rules, Facility Capacity & Member Wi-Fi
            </h3>
            <p className="text-xs text-[#8F9BB3] mt-1 m-0">
              Configure attendance rules, grace period for overdue fees, and member internet credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Wi-Fi SSID */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#192038]">Wi-Fi Network Name (SSID)</label>
              <div className="relative">
                <Wifi size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F9BB3]" />
                <input
                  type="text"
                  name="wifiSSID"
                  value={formData.wifiSSID}
                  onChange={handleChange}
                  placeholder="Vidya_HighSpeed_5G"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs font-semibold text-[#192038] focus:outline-none focus:border-[#544bec] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Wi-Fi Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#192038]">Wi-Fi Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F9BB3]" />
                <input
                  type="text"
                  name="wifiPassword"
                  value={formData.wifiPassword}
                  onChange={handleChange}
                  placeholder="StudyHard@2026"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs font-semibold text-[#192038] focus:outline-none focus:border-[#544bec] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Grace Period */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#192038]">Fee Due Grace Period (Days)</label>
              <input
                type="number"
                name="gracePeriodDays"
                value={formData.gracePeriodDays}
                onChange={handleChange}
                placeholder="3"
                className="w-full px-4 py-2.5 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs font-semibold text-[#192038] focus:outline-none focus:border-[#544bec] focus:bg-white transition-all"
              />
              <span className="text-[11px] text-[#8F9BB3]">
                Number of days before student status transitions to "Overdue"
              </span>
            </div>

            {/* Total Seating Capacity */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#192038]">Total Seating Capacity</label>
              <input
                type="number"
                name="totalSeatsCapacity"
                value={formData.totalSeatsCapacity}
                onChange={handleChange}
                placeholder="164"
                className="w-full px-4 py-2.5 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs font-semibold text-[#192038] focus:outline-none focus:border-[#544bec] focus:bg-white transition-all"
              />
              <span className="text-[11px] text-[#8F9BB3]">
                Total physical study desks available in reading hall
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: ACCOUNT & BACKUP */}
      {activeSection === 'account' && (
        <div className="bg-white rounded-2xl border border-[#EDF1F7] shadow-xs p-6 space-y-6">
          <div className="border-b border-[#EDF1F7] pb-4">
            <h3 className="text-base font-extrabold text-[#192038] m-0">
              Admin Account & Database Management
            </h3>
            <p className="text-xs text-[#8F9BB3] mt-1 m-0">
              Manage administrator credentials and download full database backups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Admin Display Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#192038]">Admin Name</label>
              <input
                type="text"
                name="adminName"
                value={formData.adminName}
                onChange={handleChange}
                placeholder="Admin"
                className="w-full px-4 py-2.5 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs font-semibold text-[#192038] focus:outline-none focus:border-[#544bec] focus:bg-white transition-all"
              />
            </div>

            {/* Admin Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#192038]">Admin Email</label>
              <input
                type="email"
                name="adminEmail"
                value={formData.adminEmail}
                onChange={handleChange}
                placeholder="admin@vidyalibrary.com"
                className="w-full px-4 py-2.5 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs font-semibold text-[#192038] focus:outline-none focus:border-[#544bec] focus:bg-white transition-all"
              />
            </div>

            {/* Admin Phone / Student Helpline (Saved to Database) */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-[#192038] flex items-center justify-between">
                <span>Call Admin Helpline (Database Contact Number)</span>
                <span className="text-[10px] text-[#544bec] font-extrabold uppercase">Shown on Student Portal</span>
              </label>
              <div className="relative">
                <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F9BB3]" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9685912333"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs font-semibold text-[#192038] focus:outline-none focus:border-[#544bec] focus:bg-white transition-all"
                />
              </div>
              <p className="text-[11px] text-[#8F9BB3] m-0">
                Agar kisi student ki fee overdue ya status inactive hota hai, to attendance punch locked hone par yahi number student portal par <strong>"Call Admin"</strong> ke roop me dikhai deta hai.
              </p>
            </div>
          </div>

          {/* Backup & System Status Actions */}
          <div className="pt-4 border-t border-[#EDF1F7] space-y-4">
            <h4 className="text-xs uppercase font-extrabold text-[#8F9BB3] tracking-wider m-0">
              Data Backup & Safety
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Backup Card */}
              <div className="p-4 bg-[#F8FAFD] rounded-xl border border-[#EDF1F7] flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[#192038] m-0">Export Full JSON Backup</h5>
                  <p className="text-[11px] text-[#8F9BB3] mt-0.5 m-0">Download full offline snapshot of students & settings</p>
                </div>
                <button
                  onClick={handleExportBackup}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-[#192038] border border-[#EDF1F7] hover:bg-[#F7F9FC] shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Download size={14} className="text-[#544bec]" />
                  <span>Download</span>
                </button>
              </div>

              {/* Reset to Defaults */}
              <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-rose-900 m-0">Restore Default Settings</h5>
                  <p className="text-[11px] text-rose-700 mt-0.5 m-0">Reset library rates & contact info to defaults</p>
                </div>
                <button
                  onClick={handleResetDefaults}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <RotateCcw size={14} />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT DISCOUNT OFFER MODAL */}
      {isDiscountModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsDiscountModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md p-5 sm:p-6 space-y-4 shadow-xl border border-[#EDF1F7] animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EDF1F7] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 text-[#544bec] flex items-center justify-center">
                  <BadgePercent size={18} />
                </span>
                <h4 className="text-sm font-extrabold text-[#192038] m-0">
                  {editingDiscountId ? 'Edit Discount Offer' : 'Create Advance Discount Offer'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsDiscountModalOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveDiscount} className="space-y-4">
              {/* Duration in Months */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#192038]">
                  Plan Duration (Advance Months) <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5 mb-1.5">
                  {[3, 6, 9, 12].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() =>
                        setDiscountForm((prev) => ({
                          ...prev,
                          months: m,
                          label: `${m} Months Advance (${prev.discountValue}${prev.discountType === 'percentage' ? '%' : '₹'} OFF)`
                        }))
                      }
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        Number(discountForm.months) === m
                          ? 'bg-[#544bec] text-white shadow-xs'
                          : 'bg-[#F8FAFD] border border-[#EDF1F7] text-[#6B778C] hover:bg-white'
                      }`}
                    >
                      {m} Months
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="2"
                  max="24"
                  required
                  value={discountForm.months}
                  onChange={(e) => {
                    const m = Number(e.target.value) || 2;
                    setDiscountForm((prev) => ({
                      ...prev,
                      months: m,
                      label: `${m} Months Advance (${prev.discountValue}${prev.discountType === 'percentage' ? '%' : '₹'} OFF)`
                    }));
                  }}
                  className="w-full px-3.5 py-2 bg-[#F8FAFD] border border-[#EDF1F7] rounded-xl text-xs font-extrabold text-[#192038] focus:outline-none focus:border-[#544bec]"
                  placeholder="Custom months e.g. 3, 6, 12"
                />
              </div>

              {/* Discount Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#192038]">
                  Discount Type <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setDiscountForm((prev) => ({
                        ...prev,
                        discountType: 'percentage',
                        label: `${prev.months} Months Advance (${prev.discountValue}% OFF)`
                      }))
                    }
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                      discountForm.discountType === 'percentage'
                        ? 'border-[#544bec] bg-emerald-50 text-[#544bec] shadow-xs'
                        : 'border-[#EDF1F7] bg-white text-[#6B778C] hover:bg-[#F8FAFD]'
                    }`}
                  >
                    Percentage (% Off)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDiscountForm((prev) => ({
                        ...prev,
                        discountType: 'flat',
                        label: `${prev.months} Months Advance (₹${prev.discountValue} OFF)`
                      }))
                    }
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                      discountForm.discountType === 'flat'
                        ? 'border-[#544bec] bg-emerald-50 text-[#544bec] shadow-xs'
                        : 'border-[#EDF1F7] bg-white text-[#6B778C] hover:bg-[#F8FAFD]'
                    }`}
                  >
                    Flat Cash (₹ Off)
                  </button>
                </div>
              </div>

              {/* Discount Value */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#192038]">
                  {discountForm.discountType === 'percentage' ? 'Discount Percentage (%)' : 'Flat Discount Amount (₹)'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8F9BB3]">
                    {discountForm.discountType === 'percentage' ? '%' : '₹'}
                  </span>
                  <input
                    type="number"
                    min="1"
                    max={discountForm.discountType === 'percentage' ? 90 : 50000}
                    required
                    value={discountForm.discountValue}
                    onChange={(e) => {
                      const v = Number(e.target.value) || 0;
                      setDiscountForm((prev) => ({
                        ...prev,
                        discountValue: v,
                        label: `${prev.months} Months Advance (${v}${prev.discountType === 'percentage' ? '%' : '₹'} OFF)`
                      }));
                    }}
                    className="w-full pl-8 pr-3.5 py-2 bg-[#F8FAFD] border border-[#EDF1F7] rounded-xl text-xs font-black text-[#192038] focus:outline-none focus:border-[#544bec]"
                    placeholder={discountForm.discountType === 'percentage' ? 'e.g. 10' : 'e.g. 300'}
                  />
                </div>
              </div>

              {/* Offer Title / Label */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#192038]">Offer Label (Shown in fee selection)</label>
                <input
                  type="text"
                  value={discountForm.label}
                  onChange={(e) => setDiscountForm((prev) => ({ ...prev, label: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-[#F8FAFD] border border-[#EDF1F7] rounded-xl text-xs font-semibold text-[#192038] focus:outline-none focus:border-[#544bec]"
                  placeholder="e.g. 3 Months Advance (10% OFF)"
                />
              </div>

              {/* Live Preview Calculation */}
              <div className="p-3 bg-gradient-to-br from-emerald-50/70 to-teal-50/40 border border-emerald-200/80 rounded-xl space-y-1 text-xs">
                <div className="text-[11px] font-bold text-emerald-800">
                  ⚡ Live Calculation Preview (Standard ₹800/mo)
                </div>
                <div className="text-[11px] text-[#6B778C]">
                  Normal Fee: ₹800 × {discountForm.months} = <strong>₹{800 * discountForm.months}</strong>
                </div>
                <div className="text-[11px] font-bold text-emerald-700">
                  Discount: -₹{discountForm.discountType === 'percentage'
                    ? Math.round((800 * discountForm.months * (discountForm.discountValue || 0)) / 100)
                    : (discountForm.discountValue || 0)}
                </div>
                <div className="text-xs font-black text-[#192038] pt-1 border-t border-emerald-200/60">
                  Payable Fee: <span className="text-[#544bec]">₹{Math.max(0, (800 * discountForm.months) - (discountForm.discountType === 'percentage'
                    ? Math.round((800 * discountForm.months * (discountForm.discountValue || 0)) / 100)
                    : (discountForm.discountValue || 0)))}</span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EDF1F7]">
                <button
                  type="button"
                  onClick={() => setIsDiscountModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#6B778C] hover:bg-[#F8FAFD] border border-[#EDF1F7] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-extrabold bg-[#544bec] text-white hover:bg-[#4338ca] shadow-sm shadow-[#544bec]/30 cursor-pointer"
                >
                  Save Discount Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
