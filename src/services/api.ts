/**
 * Viya Library - API Client Service
 * Centralized, production-grade service communicating with the backend APIs.
 */

const API_BASE = (
  (import.meta as any).env?.VITE_API_URL ||
  ((import.meta as any).env?.PROD ? 'https://vidya-library.onrender.com/api' : '/api')
).replace(/\/$/, '');

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
}

export const showGlobalToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'error') => {
  if (typeof window !== 'undefined' && message) {
    window.dispatchEvent(new CustomEvent('vidya_toast', { detail: { message, type } }));
  }
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('viya_auth_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const text = await response.text();
    let data: any = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text.slice(0, 100) };
    }

    if (!response.ok) {
      const errMsg = data.message || `Request failed with status ${response.status}`;
      showGlobalToast(errMsg, 'error');
      throw new Error(errMsg);
    }

    return data;
  } catch (error: any) {
    console.error(`[API Error] ${endpoint}:`, error.message);
    if (error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('Network') || error.message.includes('Failed to fetch'))) {
      showGlobalToast('Network Error: Unable to connect to server. Please check your internet connection.', 'error');
    }
    throw error;
  }
}

// 1. Auth Service
export const authService = {
  login: (identifier: string, password: string, role?: string) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, email: identifier, password, role })
    }),

  getProfile: () => request('/auth/me')
};

// 2. Dashboard Service
export const dashboardService = {
  getStats: () => request('/dashboard/stats'),
  getCharts: () => request('/dashboard/charts')
};

// 3. Student Service
export const studentService = {
  getAll: (filters: Record<string, string> = {}) => {
    const params = new URLSearchParams(filters).toString();
    return request(`/students${params ? `?${params}` : ''}`);
  },

  getById: (id: string) => request(`/students/${id}`),

  create: (studentData: any) =>
    request('/students', {
      method: 'POST',
      body: JSON.stringify(studentData)
    }),

  update: (id: string, updates: any) =>
    request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    }),

  delete: (id: string) =>
    request(`/students/${id}`, {
      method: 'DELETE'
    }),

  bulkDelete: async (ids: string[]) => {
    try {
      return await request('/students/bulk-delete', {
        method: 'POST',
        body: JSON.stringify({ ids })
      });
    } catch (_err) {
      // Fallback: delete each student in parallel via standard delete endpoint
      const results = await Promise.all(ids.map((id) => studentService.delete(id)));
      return { success: true, count: results.length, data: results };
    }
  },

  toggleCheckIn: (id: string, byAdmin: boolean = false) =>
    request(`/students/${id}/check-in`, {
      method: 'POST',
      body: JSON.stringify({ byAdmin })
    }),

  recordPayment: (id: string, paymentData: any) =>
    request(`/students/${id}/payments`, {
      method: 'POST',
      body: JSON.stringify(paymentData)
    }),

  changePassword: (id: string, payload: { currentPassword?: string; newPassword: string }) =>
    request(`/students/${id}/change-password`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  resetTodayAttendance: (id: string = 'all') =>
    request(`/students/${id}/reset-attendance`, {
      method: 'POST'
    }),

  verifyReferral: (code: string) =>
    request<any>(`/students/verify-referral/${encodeURIComponent(code)}`),

  updateUpi: (id: string, upiId: string) => {
    const cleanId = String(id || '').replace(/^#+/, '').trim();
    return request('/students/upi', {
      method: 'PUT',
      body: JSON.stringify({ id: cleanId, studentId: id, upiId })
    });
  }
};

// 4. Seat Service
export const seatService = {
  getLayout: () => request('/seats/layout'),

  saveLayout: (layoutData: { rows: number; cols: number; cells: any[] }) =>
    request('/seats/layout', {
      method: 'PUT',
      body: JSON.stringify(layoutData)
    }),

  updateDimensions: (rows: number, cols: number) =>
    request('/seats/dimensions', {
      method: 'PUT',
      body: JSON.stringify({ rows, cols })
    }),

  updateCell: (cellId: string, updates: any) =>
    request(`/seats/cells/${cellId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    }),

  assignStudent: (cellId: string, studentId: string) =>
    request(`/seats/cells/${cellId}/assign`, {
      method: 'POST',
      body: JSON.stringify({ studentId })
    }),

  unassignStudent: (cellId: string) =>
    request(`/seats/cells/${cellId}/unassign`, {
      method: 'POST'
    })
};

// 5. Category Service
export const categoryService = {
  getAll: () => request('/categories'),

  updateAll: (rates: Record<string, any>) =>
    request('/categories', {
      method: 'PUT',
      body: JSON.stringify(rates)
    })
};

// 6. Fee Service
export const feeService = {
  getReceipts: () => request('/fees/receipts'),

  getDues: () => request('/fees/dues'),

  recordPayment: (paymentData: any) =>
    request('/fees/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    })
};

// 7. Settings Service
export const settingsService = {
  get: () => request('/settings'),

  update: (settingsData: any) =>
    request('/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData)
    })
};

// 8. Referral & Payout Service
export const referralApiService = {
  getAll: () => request<any>('/referrals'),
  getStudentStats: (studentId: string, code?: string) =>
    request<any>(`/referrals/student/${encodeURIComponent(studentId)}${code ? `?code=${encodeURIComponent(code)}` : ''}`),
  createLead: (payload: any) =>
    request<any>('/referrals', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  updateStatus: (id: string, status: string) =>
    request<any>(`/referrals/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    }),
  getPayouts: () => request<any>('/referrals/payouts'),
  requestPayout: (payload: any) =>
    request<any>('/referrals/payouts', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  updatePayoutStatus: (id: string, status: string, utrRef?: string, adminNote?: string) =>
    request<any>(`/referrals/payouts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, utrRef, adminNote })
    })
};

