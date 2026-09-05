import axios from 'axios';
import { auth, isFirebaseConfigured } from '../firebase/firebase';

export const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:8081/api');

export const TOKEN_KEY = 'avento_firebase_token';
export const USER_KEY = 'avento_user';
export const SESSION_EXPIRY_KEY = 'avento_session_expiry';
export const SESSION_REMEMBER_KEY = 'avento_remember_me';

// Session durations: 30 days if "Remember Me" is enabled (default), 24 hours if disabled
export const DEFAULT_SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;
export const SHORT_SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

export const authStorage = {
  isSessionExpired() {
    try {
      const rawUser = localStorage.getItem(USER_KEY) || localStorage.getItem('avento_auth_user');
      if (!rawUser) {
        return false;
      }
      const expiry = localStorage.getItem(SESSION_EXPIRY_KEY);
      if (!expiry) {
        // Automatically establish expiration window for existing active session
        this.setSessionExpiry(true);
        return false;
      }
      const isExpired = Date.now() > Number(expiry);
      if (isExpired) {
        this.clear();
      }
      return isExpired;
    } catch {
      return false;
    }
  },

  setSessionExpiry(remember = true) {
    try {
      const duration = remember ? DEFAULT_SESSION_DURATION_MS : SHORT_SESSION_DURATION_MS;
      const expiryTime = Date.now() + duration;
      localStorage.setItem(SESSION_EXPIRY_KEY, String(expiryTime));
      localStorage.setItem(SESSION_REMEMBER_KEY, remember ? 'true' : 'false');
    } catch (e) {
      console.warn('Could not store session expiry:', e);
    }
  },

  getSessionExpiry() {
    try {
      const expiry = localStorage.getItem(SESSION_EXPIRY_KEY);
      return expiry ? Number(expiry) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    if (this.isSessionExpired()) {
      return null;
    }
    return localStorage.getItem(TOKEN_KEY) || localStorage.getItem('avento_auth_token');
  },

  setToken(token) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem('avento_auth_token', token);
    }
  },

  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('avento_auth_token');
  },

  getUser() {
    if (this.isSessionExpired()) {
      return null;
    }
    const raw = localStorage.getItem(USER_KEY) || localStorage.getItem('avento_auth_user');
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setUser(user, remember = true) {
    if (user) {
      const s = JSON.stringify(user);
      localStorage.setItem(USER_KEY, s);
      localStorage.setItem('avento_auth_user', s);
      this.setSessionExpiry(remember);
    }
  },

  removeUser() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('avento_auth_user');
  },

  clear() {
    this.removeToken();
    this.removeUser();
    try {
      localStorage.removeItem(SESSION_EXPIRY_KEY);
      localStorage.removeItem(SESSION_REMEMBER_KEY);
      sessionStorage.removeItem('avento_dashboard_tab');
    } catch {}
  }
};

// Create Axios Instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 20000
});

// Request Interceptor: Attach Firebase ID Token
apiClient.interceptors.request.use(
  async (config) => {
    let token = authStorage.getToken();
    if (isFirebaseConfigured && auth?.currentUser) {
      try {
        token = await auth.currentUser.getIdToken();
        authStorage.setToken(token);
      } catch (err) {
        console.warn('Could not refresh Firebase ID token:', err);
      }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const currentUser = authStorage.getUser();
    if (currentUser?.email) {
      config.headers['X-User-Email'] = currentUser.email;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global 401 Auto Logout & Unified Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      authStorage.clear();
      window.dispatchEvent(new CustomEvent('avento_auth_unauthorized'));
    }
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    const err = new Error(message);
    err.response = error.response;
    return Promise.reject(err);
  }
);

// ==========================================
// 1. AUTHENTICATION APIS (Firebase Integrated)
// ==========================================
export const authApi = {
  login: async (credentials) => {
    const res = await apiClient.post('/auth/login', credentials);
    return res.data;
  },
  sync: async (userData) => {
    const res = await apiClient.post('/auth/sync', userData);
    return res.data;
  },
  getProfile: async () => {
    const res = await apiClient.get('/auth/profile');
    return res.data;
  },
  getPendingOrganizers: async () => {
    const res = await apiClient.get('/auth/pending-organizers');
    return res.data;
  },
  approveOrganizer: async (userId) => {
    const res = await apiClient.put(`/auth/approve/${userId}`);
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await apiClient.put('/auth/profile', data);
    if (res.data) {
      authStorage.setUser(res.data);
    }
    return res.data;
  },
  logout: () => {
    authStorage.clear();
  }
};

// ==========================================
// 2. EVENTS APIS
// ==========================================
export const eventApi = {
  getAll: async (params = {}) => {
    const res = await apiClient.get('/events', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await apiClient.get(`/events/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await apiClient.post('/events', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/events/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/events/${id}`);
    return res.data;
  }
};

// ==========================================
// 3. STUDENT APIS
// ==========================================
export const studentApi = {
  getDashboard: async () => {
    const res = await apiClient.get('/student/dashboard');
    return res.data;
  },
  getRegistrations: async () => {
    const res = await apiClient.get('/student/registrations');
    return res.data;
  },
  getTickets: async () => {
    const res = await apiClient.get('/student/tickets');
    return res.data;
  },
  getCertificates: async () => {
    const res = await apiClient.get('/student/certificates');
    return res.data;
  },
  getNotifications: async () => {
    const res = await apiClient.get('/student/notifications');
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await apiClient.put('/student/profile', data);
    if (res.data) {
      authStorage.setUser(res.data);
    }
    return res.data;
  }
};

export const studentDashboardApi = {
  getDashboardData: async () => {
    return await studentApi.getDashboard();
  }
};

// ==========================================
// 4. REGISTRATION & TICKET APIS
// ==========================================
export const registrationApi = {
  register: async (data) => {
    const res = await apiClient.post('/registrations', data);
    return res.data;
  },
  getTicketDetails: async (id) => {
    const res = await apiClient.get(`/tickets/${id}`);
    return res.data;
  },
  checkRegistration: async (eventId) => {
    try {
      const res = await apiClient.get(`/registrations/check/${eventId}`);
      return res.data;
    } catch {
      return { eventId, isRegistered: false };
    }
  }
};

// ==========================================
// 5. ORGANIZER APIS
// ==========================================
export const organizerApi = {
  getDashboard: async () => {
    const res = await apiClient.get('/organizer/dashboard');
    return res.data;
  },
  getMyEvents: async () => {
    const res = await apiClient.get('/organizer/events');
    return res.data;
  },
  getEventRegistrations: async (eventId) => {
    const res = await apiClient.get(`/organizer/events/${eventId}/registrations`);
    return res.data;
  },
  getRegistrations: async (eventId) => {
    const res = await apiClient.get('/organizer/registrations', {
      params: eventId ? { eventId } : {}
    });
    return res.data;
  },
  scanAttendance: async (data) => {
    const res = await apiClient.post('/attendance/scan', data);
    return res.data;
  },
  generateCertificate: async (params) => {
    const res = await apiClient.post('/certificates/generate', null, { params });
    return res.data;
  },
  getRevenue: async () => {
    const res = await apiClient.get('/organizer/revenue');
    return res.data;
  },
  getNotifications: async () => {
    const res = await apiClient.get('/organizer/notifications');
    return res.data;
  }
};

// ==========================================
// 6. ADMIN APIS
// ==========================================
export const adminApi = {
  getDashboard: async () => {
    const res = await apiClient.get('/admin/dashboard');
    return res.data;
  },
  getUsers: async () => {
    const res = await apiClient.get('/admin/users');
    return res.data;
  },
  toggleBlockUser: async (id) => {
    const res = await apiClient.put(`/admin/users/${id}/toggle-block`);
    return res.data;
  },
  deleteUser: async (id) => {
    const res = await apiClient.delete(`/admin/users/${id}`);
    return res.data;
  },
  approveOrganizer: async (id) => {
    const res = await apiClient.put(`/admin/organizers/${id}/approve`);
    return res.data;
  },
  rejectOrganizer: async (id) => {
    const res = await apiClient.put(`/admin/organizers/${id}/reject`);
    return res.data;
  },
  getPendingEvents: async () => {
    const res = await apiClient.get('/admin/events/pending');
    return res.data;
  },
  approveEvent: async (id) => {
    const res = await apiClient.put(`/admin/events/${id}/approve`);
    return res.data;
  },
  rejectEvent: async (id) => {
    const res = await apiClient.put(`/admin/events/${id}/reject`);
    return res.data;
  },
  getPayments: async () => {
    const res = await apiClient.get('/admin/payments');
    return res.data;
  },
  refundPayment: async (txnId) => {
    const res = await apiClient.post(`/admin/payments/${txnId}/refund`);
    return res.data;
  },
  getAnnouncements: async () => {
    const res = await apiClient.get('/admin/announcements');
    return res.data;
  },
  createAnnouncement: async (data) => {
    const res = await apiClient.post('/admin/announcements', data);
    return res.data;
  },
  downloadReport: async (format = 'csv', timeframe = 'monthly') => {
    const res = await apiClient.get('/admin/reports', {
      params: { format, timeframe },
      responseType: 'blob'
    });
    return res.data;
  }
};

// ==========================================
// 7. RAZORPAY PAYMENT APIS
// ==========================================
export const paymentApi = {
  createOrder: async (data) => {
    const res = await apiClient.post('/payments/create-order', data);
    return res.data;
  },
  verifyPayment: async (data) => {
    const res = await apiClient.post('/payments/verify', data);
    return res.data;
  },
  getHistory: async () => {
    const res = await apiClient.get('/payments/history');
    return res.data;
  },
  refund: async (paymentId) => {
    const res = await apiClient.post(`/payments/refund/${paymentId}`);
    return res.data;
  }
};

// ==========================================
// 8. ENTERPRISE NOTIFICATION APIS
// ==========================================
export const notificationApi = {
  getAll: async () => {
    const res = await apiClient.get('/notifications');
    return res.data;
  },
  getUnreadCount: async () => {
    const res = await apiClient.get('/notifications/unread-count');
    return res.data;
  },
  markAsRead: async (id) => {
    const res = await apiClient.put(`/notifications/${id}/read`);
    return res.data;
  },
  markAllAsRead: async () => {
    const res = await apiClient.put('/notifications/read-all');
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/notifications/${id}`);
    return res.data;
  }
};

// ==========================================
// 9. ENTERPRISE SEARCH APIS
// ==========================================
export const searchApi = {
  search: async (q, type = 'ALL') => {
    const res = await apiClient.get('/search', { params: { q, type } });
    return res.data;
  }
};

// ==========================================
// 10. WISHLIST APIS
// ==========================================
export const wishlistApi = {
  getAll: async () => {
    const res = await apiClient.get('/wishlist');
    return res.data;
  },
  add: async (eventId) => {
    const res = await apiClient.post(`/wishlist/${eventId}`);
    return res.data;
  },
  remove: async (eventId) => {
    const res = await apiClient.delete(`/wishlist/${eventId}`);
    return res.data;
  },
  check: async (eventId) => {
    const res = await apiClient.get(`/wishlist/check/${eventId}`);
    return res.data;
  }
};

// ==========================================
// 11. EVENT REVIEWS & RATINGS APIS
// ==========================================
export const reviewApi = {
  getEventReviews: async (eventId) => {
    const res = await apiClient.get(`/events/${eventId}/reviews`);
    return res.data;
  },
  addReview: async (eventId, data) => {
    const res = await apiClient.post(`/events/${eventId}/reviews`, data);
    return res.data;
  },
  replyReview: async (reviewId, data) => {
    const res = await apiClient.post(`/reviews/${reviewId}/reply`, data);
    return res.data;
  },
  reportReview: async (reviewId) => {
    const res = await apiClient.post(`/reviews/${reviewId}/report`);
    return res.data;
  }
};

// ==========================================
// 12. LIVE CHAT APIS
// ==========================================
export const chatApi = {
  getConversations: async () => {
    const res = await apiClient.get('/chat/conversations');
    return res.data;
  },
  getMessages: async (otherUserId) => {
    const res = await apiClient.get(`/chat/messages/${otherUserId}`);
    return res.data;
  },
  send: async (data) => {
    const res = await apiClient.post('/chat/send', data);
    return res.data;
  },
  markRead: async (otherUserId) => {
    const res = await apiClient.put(`/chat/read/${otherUserId}`);
    return res.data;
  }
};

// ==========================================
// 13. FILE UPLOAD APIS
// ==========================================
export const uploadApi = {
  uploadFile: async (file, folder = 'avento') => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post('/upload', formData, {
      params: { folder },
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  }
};

// ==========================================
// 14. ENTERPRISE REPORT EXPORTER APIS
// ==========================================
export const reportApi = {
  downloadInvoicePdf: async (txnId) => {
    const res = await apiClient.get(`/reports/invoices/${txnId}/pdf`, { responseType: 'blob' });
    const blob = new Blob([res.data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${txnId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },
  downloadAttendanceExcel: async (eventId) => {
    const res = await apiClient.get(`/reports/attendance/${eventId}/excel`, { responseType: 'blob' });
    const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Attendance-Event-${eventId}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },
  downloadRevenueExcel: async () => {
    const res = await apiClient.get('/reports/revenue/excel', { responseType: 'blob' });
    const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Revenue-Settlement-Report.xlsx';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },
  downloadEventsCsv: async () => {
    const res = await apiClient.get('/reports/events/csv', { responseType: 'blob' });
    const blob = new Blob([res.data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AVENTO-Events-Export.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
};

// ==========================================
// 15. AUDIT LOG APIS
// ==========================================
export const auditApi = {
  getAuditLogs: async () => {
    const res = await apiClient.get('/admin/audit-logs');
    return res.data;
  }
};

export default apiClient;
