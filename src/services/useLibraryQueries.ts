import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService, seatService, dashboardService, categoryService, feeService } from './api';

// Query Keys
export const QUERY_KEYS = {
  students: ['students'] as const,
  seats: ['seats'] as const,
  categories: ['categories'] as const,
  dashboard: ['dashboard'] as const,
  fees: ['fees'] as const
};

// 1. Students Query & Mutations
export const useStudents = (filters: Record<string, string> = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.students, filters],
    queryFn: async () => {
      const res = await studentService.getAll(filters);
      return res.data || [];
    },
    // Keep showing previous data during background refetch to avoid UI flash
    placeholderData: (previousData: any) => previousData,
    staleTime: 1000 * 60 * 2 // 2 minutes
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newStudent: any) => studentService.create(newStudent),
    onSuccess: () => {
      // Invalidate relevant queries without full page reload
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.students });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.seats });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
    }
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => studentService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.students });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.seats });
    }
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => studentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.students });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.seats });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
    }
  });
};

export const useBulkDeleteStudents = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => studentService.bulkDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.students });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.seats });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
    }
  });
};

export const useToggleCheckIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => studentService.toggleCheckIn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.students });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.seats });
    }
  });
};

// 2. Seats Query & Mutations
export const useSeatLayout = () => {
  return useQuery({
    queryKey: QUERY_KEYS.seats,
    queryFn: async () => {
      const res = await seatService.getLayout();
      return res.data;
    }
  });
};

export const useSaveSeatLayout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (layout: any) => seatService.saveLayout(layout),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.seats });
    }
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: async () => {
      const res = await categoryService.getAll();
      return res.data || {};
    }
  });
};

// 3. Dashboard Stats Query
export interface DashboardStatsData {
  students: {
    total: number;
    regular: number;
    demo: number;
    inside: number;
    overdue: number;
    dueSoon: number;
    totalWithDues?: number;
  };
  seats: {
    total: number;
    available: number;
    occupied: number;
    maintenance: number;
    occupancyRate: number;
  };
  financials: {
    monthlyCollection: number;
    pendingDues: number;
    totalTransactions: number;
  };
}

export const useDashboardStats = () => {
  return useQuery<DashboardStatsData>({
    queryKey: QUERY_KEYS.dashboard,
    queryFn: async (): Promise<DashboardStatsData> => {
      const res = await dashboardService.getStats();
      return res.data as DashboardStatsData;
    }
  });
};

// 4. Fee Payment Mutation & Queries
export const useFeeReceipts = () => {
  return useQuery({
    queryKey: QUERY_KEYS.fees,
    queryFn: async () => {
      const res = await feeService.getReceipts();
      return res.data || [];
    },
    staleTime: 1000 * 60 * 2
  });
};

export const useRecordFeePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (paymentData: any) => feeService.recordPayment(paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.students });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.seats });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.fees });
    }
  });
};
