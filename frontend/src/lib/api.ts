import { getAuthToken } from "./utils";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiRequest<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  logout: () => apiRequest("/auth/logout", { method: "POST" }),

  me: () => apiRequest<{ user: any }>("/auth/me"),
};

// Dashboard API
export const dashboardApi = {
  getStats: () =>
    apiRequest<{
      totalUsers: number;
      totalExams: number;
      totalQuizzes: number;
      totalQuestions: number;
      recentActivity: any[];
    }>("/admin/dashboard"),

  getAnalytics: () =>
    apiRequest<{
      overview: any;
      performance: any;
      subjects: any;
    }>("/admin/analytics"),
};

// Lookup API
export const lookupApi = {
  questionTypes: () =>
    apiRequest<{ data: { id: number; name: string }[] }>("/question-types"),
  difficultyLevels: () =>
    apiRequest<{ data: { id: number; name: string; code: string }[] }>(
      "/difficulty-levels"
    ),
};

// Users API
export const usersApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.role) searchParams.append("role", params.role);

    return apiRequest<{
      data: any[];
      total: number;
      current_page: number;
      last_page: number;
    }>(`/admin/users?${searchParams.toString()}`);
  },

  getById: (id: string) => apiRequest<any>(`/admin/users/${id}`),

  create: (userData: any) =>
    apiRequest<any>("/admin/users", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  update: (id: string, userData: any) =>
    apiRequest<any>(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    }),

  delete: (id: string) =>
    apiRequest(`/admin/users/${id}`, { method: "DELETE" }),

  bulkDelete: (ids: string[]) =>
    apiRequest("/admin/users/bulk-delete", {
      method: "POST",
      body: JSON.stringify({ ids }),
    }),
};

// Admin Lookup APIs
export const adminLookupApi = {
  getRoles: () => apiRequest<{ data: any[] }>("/admin/lookup/roles"),
  getUserGroups: () => apiRequest<{ data: any[] }>("/admin/lookup/user-groups"),
  getSubscriptionPlans: () =>
    apiRequest<{ data: any[] }>("/admin/lookup/subscription-plans"),
};

// Exams API
export const examsApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.category) searchParams.append("category", params.category);

    return apiRequest<{
      data: any[];
      total: number;
      current_page: number;
      last_page: number;
    }>(`/exams?${searchParams.toString()}`);
  },

  getById: (id: string) => apiRequest<any>(`/exams/${id}`),

  create: (examData: any) =>
    apiRequest<any>("/exams", {
      method: "POST",
      body: JSON.stringify(examData),
    }),

  update: (id: string, examData: any) =>
    apiRequest<any>(`/exams/${id}`, {
      method: "PUT",
      body: JSON.stringify(examData),
    }),

  delete: (id: string) => apiRequest(`/exams/${id}`, { method: "DELETE" }),

  duplicate: (id: string) =>
    apiRequest<any>(`/exams/${id}/duplicate`, { method: "POST" }),

  getSections: (examId: string) =>
    apiRequest<any[]>(`/exams/${examId}/sections`),
};

// Quizzes API
export const quizzesApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.status) searchParams.append("status", params.status);

    return apiRequest<{
      data: any[];
      total: number;
      current_page: number;
      last_page: number;
    }>(`/admin/quizzes?${searchParams.toString()}`);
  },

  getById: (id: string) => apiRequest<any>(`/admin/quizzes/${id}`),

  create: (quizData: any) =>
    apiRequest<any>("/admin/quizzes", {
      method: "POST",
      body: JSON.stringify(quizData),
    }),

  update: (id: string, quizData: any) =>
    apiRequest<any>(`/admin/quizzes/${id}`, {
      method: "PUT",
      body: JSON.stringify(quizData),
    }),

  delete: (id: string) =>
    apiRequest(`/admin/quizzes/${id}`, { method: "DELETE" }),
};

// Questions API
export const questionsApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    subject?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.type) searchParams.append("type", params.type);
    if (params?.subject) searchParams.append("subject", params.subject);

    return apiRequest<{
      data: any[];
      meta: { total: number; current_page: number; last_page: number };
    }>(`/questions?${searchParams.toString()}`);
  },

  getById: (id: string) => apiRequest<any>(`/questions/${id}`),

  create: (questionData: any) =>
    apiRequest<any>("/questions", {
      method: "POST",
      body: JSON.stringify(questionData),
    }),

  update: (id: string, questionData: any) =>
    apiRequest<any>(`/questions/${id}`, {
      method: "PUT",
      body: JSON.stringify(questionData),
    }),

  delete: (id: string) => apiRequest(`/questions/${id}`, { method: "DELETE" }),

  bulkDelete: (ids: string[]) =>
    apiRequest("/admin/questions/bulk-delete", {
      method: "POST",
      body: JSON.stringify({ ids }),
    }),

  import: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiRequest<any>("/admin/questions/import", {
      method: "POST",
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },
};

// Practice Sets API
export const practiceSetsApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.status) searchParams.append("status", params.status);

    return apiRequest<{
      data: any[];
      total: number;
      current_page: number;
      last_page: number;
    }>(`/admin/practice-sets?${searchParams.toString()}`);
  },

  getById: (id: string) => apiRequest<any>(`/admin/practice-sets/${id}`),

  create: (practiceSetData: any) =>
    apiRequest<any>("/admin/practice-sets", {
      method: "POST",
      body: JSON.stringify(practiceSetData),
    }),

  update: (id: string, practiceSetData: any) =>
    apiRequest<any>(`/admin/practice-sets/${id}`, {
      method: "PUT",
      body: JSON.stringify(practiceSetData),
    }),

  delete: (id: string) =>
    apiRequest(`/admin/practice-sets/${id}`, { method: "DELETE" }),

  getQuestions: (id: string, params?: { per_page?: number }) =>
    apiRequest<{ data: any[]; total: number }>(
      `/admin/practice-sets/${id}/questions${
        params?.per_page ? `?per_page=${params.per_page}` : ""
      }`
    ),

  addQuestions: (id: string, ids: number[]) =>
    apiRequest<any>(`/admin/practice-sets/${id}/questions`, {
      method: "POST",
      body: JSON.stringify({ ids }),
    }),

  removeQuestion: (id: string, questionId: number) =>
    apiRequest<any>(`/admin/practice-sets/${id}/questions/${questionId}`, {
      method: "DELETE",
    }),
};

// Categories API
export const categoriesApi = {
  getAll: () => apiRequest<any[]>("/admin/categories"),

  getById: (id: string) => apiRequest<any>(`/admin/categories/${id}`),

  create: (categoryData: any) =>
    apiRequest<any>("/admin/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    }),

  update: (id: string, categoryData: any) =>
    apiRequest<any>(`/admin/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    }),

  delete: (id: string) =>
    apiRequest(`/admin/categories/${id}`, { method: "DELETE" }),
};

// Sub-Categories API
export const subCategoriesApi = {
  getAll: () => apiRequest<any[]>("/sub-categories"),

  getById: (id: string) => apiRequest<any>(`/admin/sub-categories/${id}`),

  create: (data: any) =>
    apiRequest<any>("/admin/sub-categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest<any>(`/admin/sub-categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/admin/sub-categories/${id}`, { method: "DELETE" }),
};

// Tags API
export const tagsApi = {
  getAll: () => apiRequest<any[]>("/admin/tags"),

  getById: (id: string) => apiRequest<any>(`/admin/tags/${id}`),

  create: (tagData: any) =>
    apiRequest<any>("/admin/tags", {
      method: "POST",
      body: JSON.stringify(tagData),
    }),

  update: (id: string, tagData: any) =>
    apiRequest<any>(`/admin/tags/${id}`, {
      method: "PUT",
      body: JSON.stringify(tagData),
    }),

  delete: (id: string) => apiRequest(`/admin/tags/${id}`, { method: "DELETE" }),
};

// Topics API
export const topicsApi = {
  getAll: (params?: {
    search?: string;
    status?: string;
    category_id?: string;
    skill_id?: string;
    per_page?: number;
    page?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.status && params.status !== "all")
      searchParams.append("status", params.status);
    if (params?.category_id && params.category_id !== "all")
      searchParams.append("category_id", params.category_id);
    if (params?.skill_id && params.skill_id !== "all")
      searchParams.append("skill_id", params.skill_id);
    if (params?.per_page)
      searchParams.append("per_page", params.per_page.toString());
    if (params?.page) searchParams.append("page", params.page.toString());

    const queryString = searchParams.toString();
    return apiRequest<{
      data: Array<{
        id: number;
        name: string;
        description: string | null;
        category_id: number;
        skill_id: number | null;
        is_active: boolean;
        sort_order: number | null;
        difficulty_level: string | null;
        created_at: string;
        updated_at: string;
        category: {
          id: number;
          name: string;
        };
        skill: {
          id: number;
          name: string;
        } | null;
        questions_count: number;
        lessons_count: number;
      }>;
      meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
      };
    }>(`/admin/topics${queryString ? `?${queryString}` : ""}`);
  },

  getById: (id: string) => apiRequest<any>(`/admin/topics/${id}`),

  create: (topicData: any) =>
    apiRequest<any>("/admin/topics", {
      method: "POST",
      body: JSON.stringify(topicData),
    }),

  update: (id: string, topicData: any) =>
    apiRequest<any>(`/admin/topics/${id}`, {
      method: "PUT",
      body: JSON.stringify(topicData),
    }),

  delete: (id: string) =>
    apiRequest(`/admin/topics/${id}`, { method: "DELETE" }),
};

// Public browse Topics (filtered)
export const browseTopicsApi = {
  list: (params?: {
    skill_id?: string | number;
    category_id?: string | number;
    search?: string;
    status?: string;
    per_page?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.skill_id)
      searchParams.append("skill_id", String(params.skill_id));
    if (params?.category_id)
      searchParams.append("category_id", String(params.category_id));
    if (params?.search) searchParams.append("search", params.search);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.per_page)
      searchParams.append("per_page", String(params.per_page));
    return apiRequest<any>(`/topics?${searchParams.toString()}`);
  },
};

// Public browse Skills (filtered)
export const browseSkillsApi = {
  list: (params?: {
    section_id?: string | number;
    search?: string;
    status?: string;
    per_page?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.section_id)
      searchParams.append("section_id", String(params.section_id));
    if (params?.search) searchParams.append("search", params.search);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.per_page)
      searchParams.append("per_page", String(params.per_page));
    return apiRequest<any>(`/skills?${searchParams.toString()}`);
  },
};

// Pages API
export const pagesApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    type?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.type) searchParams.append("type", params.type);

    return apiRequest<{
      data: any[];
      total: number;
      current_page: number;
      last_page: number;
    }>(`/admin/pages?${searchParams.toString()}`);
  },

  getById: (id: string) => apiRequest<any>(`/admin/pages/${id}`),

  create: (pageData: any) =>
    apiRequest<any>("/admin/pages", {
      method: "POST",
      body: JSON.stringify(pageData),
    }),

  update: (id: string, pageData: any) =>
    apiRequest<any>(`/admin/pages/${id}`, {
      method: "PUT",
      body: JSON.stringify(pageData),
    }),

  delete: (id: string) =>
    apiRequest(`/admin/pages/${id}`, { method: "DELETE" }),
};

// Lessons API
export const lessonsApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.status) searchParams.append("status", params.status);

    return apiRequest<{
      data: any[];
      total: number;
      current_page: number;
      last_page: number;
    }>(`/admin/lessons?${searchParams.toString()}`);
  },

  getById: (id: string) => apiRequest<any>(`/admin/lessons/${id}`),

  create: (lessonData: any) =>
    apiRequest<any>("/admin/lessons", {
      method: "POST",
      body: JSON.stringify(lessonData),
    }),

  update: (id: string, lessonData: any) =>
    apiRequest<any>(`/admin/lessons/${id}`, {
      method: "PUT",
      body: JSON.stringify(lessonData),
    }),

  delete: (id: string) =>
    apiRequest(`/admin/lessons/${id}`, { method: "DELETE" }),
};

// Videos API
export const videosApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.status) searchParams.append("status", params.status);

    return apiRequest<{
      data: any[];
      total: number;
      current_page: number;
      last_page: number;
    }>(`/admin/videos?${searchParams.toString()}`);
  },

  getById: (id: string) => apiRequest<any>(`/admin/videos/${id}`),

  create: (videoData: any) =>
    apiRequest<any>("/admin/videos", {
      method: "POST",
      body: JSON.stringify(videoData),
    }),

  update: (id: string, videoData: any) =>
    apiRequest<any>(`/admin/videos/${id}`, {
      method: "PUT",
      body: JSON.stringify(videoData),
    }),

  delete: (id: string) =>
    apiRequest(`/admin/videos/${id}`, { method: "DELETE" }),
};

// Comprehensions API
export const comprehensionsApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.status) searchParams.append("status", params.status);

    return apiRequest<{
      data: any[];
      total: number;
      current_page: number;
      last_page: number;
    }>(`/admin/comprehensions?${searchParams.toString()}`);
  },

  getById: (id: string) => apiRequest<any>(`/admin/comprehensions/${id}`),

  create: (comprehensionData: any) =>
    apiRequest<any>("/admin/comprehensions", {
      method: "POST",
      body: JSON.stringify(comprehensionData),
    }),

  update: (id: string, comprehensionData: any) =>
    apiRequest<any>(`/admin/comprehensions/${id}`, {
      method: "PUT",
      body: JSON.stringify(comprehensionData),
    }),

  delete: (id: string) =>
    apiRequest(`/admin/comprehensions/${id}`, { method: "DELETE" }),
};

// Plans API
export const plansApi = {
  getAll: () => apiRequest<any[]>("/admin/plans"),

  getById: (id: string) => apiRequest<any>(`/admin/plans/${id}`),

  create: (planData: any) =>
    apiRequest<any>("/admin/plans", {
      method: "POST",
      body: JSON.stringify(planData),
    }),

  update: (id: string, planData: any) =>
    apiRequest<any>(`/admin/plans/${id}`, {
      method: "PUT",
      body: JSON.stringify(planData),
    }),

  delete: (id: string) =>
    apiRequest(`/admin/plans/${id}`, { method: "DELETE" }),
};

// Subscriptions API
export const subscriptionsApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.status) searchParams.append("status", params.status);

    return apiRequest<{
      data: any[];
      total: number;
      current_page: number;
      last_page: number;
    }>(`/admin/subscriptions?${searchParams.toString()}`);
  },

  getById: (id: string) => apiRequest<any>(`/admin/subscriptions/${id}`),

  update: (id: string, subscriptionData: any) =>
    apiRequest<any>(`/admin/subscriptions/${id}`, {
      method: "PUT",
      body: JSON.stringify(subscriptionData),
    }),

  cancel: (id: string) =>
    apiRequest<any>(`/admin/subscriptions/${id}/cancel`, { method: "POST" }),
};

// Payments API
export const paymentsApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.status) searchParams.append("status", params.status);

    return apiRequest<{
      data: any[];
      total: number;
      current_page: number;
      last_page: number;
    }>(`/admin/payments?${searchParams.toString()}`);
  },

  getById: (id: string) => apiRequest<any>(`/admin/payments/${id}`),

  refund: (id: string, amount?: number) =>
    apiRequest<any>(`/admin/payments/${id}/refund`, {
      method: "POST",
      body: JSON.stringify({ amount }),
    }),
};

// User Groups API
export const userGroupsApi = {
  getAll: () => apiRequest<any[]>("/admin/user-groups"),

  getById: (id: string) => apiRequest<any>(`/admin/user-groups/${id}`),

  create: (groupData: any) =>
    apiRequest<any>("/admin/user-groups", {
      method: "POST",
      body: JSON.stringify(groupData),
    }),

  update: (id: string, groupData: any) =>
    apiRequest<any>(`/admin/user-groups/${id}`, {
      method: "PUT",
      body: JSON.stringify(groupData),
    }),

  delete: (id: string) =>
    apiRequest(`/admin/user-groups/${id}`, { method: "DELETE" }),
};

// Settings API
export const settingsApi = {
  getGeneral: () => apiRequest<any>("/admin/settings/general"),

  updateGeneral: (settings: any) =>
    apiRequest<any>("/admin/settings/general", {
      method: "PUT",
      body: JSON.stringify(settings),
    }),

  getEmail: () => apiRequest<any>("/admin/settings/email"),

  updateEmail: (settings: any) =>
    apiRequest<any>("/admin/settings/email", {
      method: "PUT",
      body: JSON.stringify(settings),
    }),

  getPayment: () => apiRequest<any>("/admin/settings/payment"),

  updatePayment: (settings: any) =>
    apiRequest<any>("/admin/settings/payment", {
      method: "PUT",
      body: JSON.stringify(settings),
    }),

  getTheme: () => apiRequest<any>("/admin/settings/theme"),

  updateTheme: (settings: any) =>
    apiRequest<any>("/admin/settings/theme", {
      method: "PUT",
      body: JSON.stringify(settings),
    }),

  getLocalization: () => apiRequest<any>("/admin/settings/localization"),

  updateLocalization: (settings: any) =>
    apiRequest<any>("/admin/settings/localization", {
      method: "PUT",
      body: JSON.stringify(settings),
    }),
};

// Menu Builder API
export const menuApi = {
  getMenu: () => apiRequest<any[]>("/admin/menu"),

  updateMenu: (menuData: any[]) =>
    apiRequest<any>("/admin/menu", {
      method: "PUT",
      body: JSON.stringify({ items: menuData }),
    }),
};

// Maintenance API
export const maintenanceApi = {
  status: () =>
    apiRequest<{ appVersion: string; debugMode: boolean }>(
      "/admin/maintenance"
    ),

  clearCache: () =>
    apiRequest<{ message: string; success: boolean }>(
      "/admin/maintenance/clear-cache",
      {
        method: "POST",
      }
    ),

  fixStorageLinks: () =>
    apiRequest<{ message: string; success: boolean }>(
      "/admin/maintenance/fix-storage-links",
      {
        method: "POST",
      }
    ),

  expireSchedules: () =>
    apiRequest<{
      message: string;
      success: boolean;
      quizExpired?: number;
      examExpired?: number;
    }>("/admin/maintenance/expire-schedules", {
      method: "POST",
    }),

  setDebugMode: (mode: boolean) =>
    apiRequest<{ debugMode: boolean; message: string; success: boolean }>(
      "/admin/maintenance/debug-mode",
      {
        method: "POST",
        body: JSON.stringify({ mode }),
      }
    ),

  fixUpdates: () =>
    apiRequest<{ message: string; success: boolean }>(
      "/admin/maintenance/update",
      {
        method: "POST",
      }
    ),
};

// General Settings API
export const generalSettingsApi = {
  getSettings: () =>
    apiRequest<{
      site: {
        app_name: string;
        tag_line: string;
        seo_description: string;
        logo_path: string;
        white_logo_path: string;
        favicon_path: string;
        can_register: boolean;
      };
      localization: {
        default_locale: string;
        default_direction: string;
        default_timezone: string;
      };
      timezones: string[];
      languages: Array<{ code: string; name: string }>;
    }>("/admin/general-settings"),

  updateSite: (data: {
    app_name: string;
    tag_line: string;
    seo_description: string;
    can_register: boolean;
  }) =>
    apiRequest<{ message: string; success: boolean; data: any }>(
      "/admin/general-settings/site",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),

  updateLocalization: (data: {
    default_locale: string;
    default_direction: string;
    default_timezone: string;
  }) =>
    apiRequest<{ message: string; success: boolean; data: any }>(
      "/admin/general-settings/localization",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),

  updateLogo: (file: File) => {
    const formData = new FormData();
    formData.append("logo", file);
    return fetch("/api/admin/general-settings/logo", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => res.json());
  },

  updateWhiteLogo: (file: File) => {
    const formData = new FormData();
    formData.append("white_logo", file);
    return fetch("/api/admin/general-settings/white-logo", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => res.json());
  },

  updateFavicon: (file: File) => {
    const formData = new FormData();
    formData.append("favicon", file);
    return fetch("/api/admin/general-settings/favicon", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => res.json());
  },
};

// Sections API
export const sectionsApi = {
  getSections: (params?: {
    search?: string;
    status?: string;
    type?: string;
    per_page?: number;
    page?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.type) searchParams.append("type", params.type);
    if (params?.per_page)
      searchParams.append("per_page", params.per_page.toString());
    if (params?.page) searchParams.append("page", params.page.toString());

    const queryString = searchParams.toString();
    return apiRequest<{
      data: Array<{
        id: number;
        name: string;
        code: string;
        slug: string;
        short_description: string | null;
        icon_path: string | null;
        is_active: boolean;
        created_at: string;
        updated_at: string;
        questions_count: number;
        exams_count: number;
      }>;
      meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
      };
    }>(`/admin/sections${queryString ? `?${queryString}` : ""}`);
  },

  getSection: (id: number) =>
    apiRequest<{
      data: {
        id: number;
        name: string;
        code: string;
        slug: string;
        short_description: string | null;
        icon_path: string | null;
        is_active: boolean;
        created_at: string;
        updated_at: string;
        questions_count: number;
        exams_count: number;
      };
    }>(`/admin/sections/${id}`),

  createSection: (data: {
    name: string;
    short_description?: string;
    is_active?: boolean;
  }) =>
    apiRequest<{
      message: string;
      data: {
        id: number;
        name: string;
        code: string;
        slug: string;
        short_description: string | null;
        icon_path: string | null;
        is_active: boolean;
        created_at: string;
        updated_at: string;
        questions_count: number;
        exams_count: number;
      };
    }>("/admin/sections", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateSection: (
    id: number,
    data: {
      name: string;
      short_description?: string;
      is_active?: boolean;
    }
  ) =>
    apiRequest<{
      message: string;
      data: {
        id: number;
        name: string;
        code: string;
        slug: string;
        short_description: string | null;
        icon_path: string | null;
        is_active: boolean;
        created_at: string;
        updated_at: string;
        questions_count: number;
        exams_count: number;
      };
    }>(`/admin/sections/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteSection: (id: number) =>
    apiRequest<{ message: string }>(`/admin/sections/${id}`, {
      method: "DELETE",
    }),
};

// Skills API
export const skillsApi = {
  getSkills: (params?: {
    search?: string;
    status?: string;
    level?: string;
    category_id?: number;
    section_id?: number;
    per_page?: number;
    page?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.level) searchParams.append("level", params.level);
    if (params?.category_id)
      searchParams.append("category_id", params.category_id.toString());
    if (params?.section_id)
      searchParams.append("section_id", params.section_id.toString());
    if (params?.per_page)
      searchParams.append("per_page", params.per_page.toString());
    if (params?.page) searchParams.append("page", params.page.toString());

    const queryString = searchParams.toString();
    return apiRequest<{
      data: Array<{
        id: number;
        name: string;
        code: string;
        slug: string;
        short_description: string | null;
        section_id: number;
        is_active: boolean;
        created_at: string;
        updated_at: string;
        section: {
          id: number;
          name: string;
        };
        questions_count: number;
        exams_count: number;
      }>;
      meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
      };
    }>(`/admin/skills${queryString ? `?${queryString}` : ""}`);
  },

  getSkill: (id: number) =>
    apiRequest<{
      data: {
        id: number;
        name: string;
        code: string;
        slug: string;
        short_description: string | null;
        section_id: number;
        is_active: boolean;
        created_at: string;
        updated_at: string;
        section: {
          id: number;
          name: string;
        };
        questions_count: number;
        exams_count: number;
      };
    }>(`/admin/skills/${id}`),

  createSkill: (data: {
    name: string;
    short_description?: string;
    section_id: number;
    is_active?: boolean;
  }) =>
    apiRequest<{
      message: string;
      data: {
        id: number;
        name: string;
        code: string;
        slug: string;
        short_description: string | null;
        section_id: number;
        is_active: boolean;
        created_at: string;
        updated_at: string;
        section: {
          id: number;
          name: string;
        };
        questions_count: number;
        exams_count: number;
      };
    }>("/admin/skills", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateSkill: (
    id: number,
    data: {
      name: string;
      short_description?: string;
      section_id: number;
      is_active?: boolean;
    }
  ) =>
    apiRequest<{
      message: string;
      data: {
        id: number;
        name: string;
        code: string;
        slug: string;
        short_description: string | null;
        section_id: number;
        is_active: boolean;
        created_at: string;
        updated_at: string;
        section: {
          id: number;
          name: string;
        };
        questions_count: number;
        exams_count: number;
      };
    }>(`/admin/skills/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteSkill: (id: number) =>
    apiRequest<{ message: string }>(`/admin/skills/${id}`, {
      method: "DELETE",
    }),
};

// Billing & Tax API
export const billingTaxApi = {
  getSettings: () =>
    apiRequest<{
      billing: {
        vendor_name: string;
        address: string;
        city: string;
        state: string;
        country: string;
        zip: string;
        phone_number: string;
        vat_number: string;
        enable_invoicing: boolean;
        invoice_prefix: string;
      };
      tax: {
        enable_tax: boolean;
        tax_name: string;
        tax_type: string;
        tax_amount_type: string;
        tax_amount: number;
        enable_additional_tax: boolean;
        additional_tax_name: string;
        additional_tax_type: string;
        additional_tax_amount_type: string;
        additional_tax_amount: number;
      };
      countries: Array<{ code: string; name: string }>;
    }>("/admin/billing-tax"),

  updateBilling: (data: {
    vendor_name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    phone_number: string;
    vat_number?: string;
    enable_invoicing: boolean;
    invoice_prefix: string;
  }) =>
    apiRequest<{ message: string; success: boolean; data: any }>(
      "/admin/billing-tax/billing",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),

  updateTax: (data: {
    enable_tax: boolean;
    tax_name: string;
    tax_type: string;
    tax_amount_type: string;
    tax_amount: number;
    enable_additional_tax: boolean;
    additional_tax_name?: string;
    additional_tax_type?: string;
    additional_tax_amount_type?: string;
    additional_tax_amount?: number;
  }) =>
    apiRequest<{ message: string; success: boolean; data: any }>(
      "/admin/billing-tax/tax",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),
};

// File Manager API
export const fileManagerApi = {
  getFiles: (params?: {
    path?: string;
    search?: string;
    type?: string;
    sort?: string;
    order?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.path) searchParams.append("path", params.path);
    if (params?.search) searchParams.append("search", params.search);
    if (params?.type) searchParams.append("type", params.type);
    if (params?.sort) searchParams.append("sort", params.sort);
    if (params?.order) searchParams.append("order", params.order);

    return apiRequest<{
      path: string;
      items: any[];
      breadcrumbs: { name: string; path: string }[];
      parent_path: string | null;
    }>(`/file-manager?${searchParams.toString()}`);
  },

  uploadFiles: async (files: File[], path?: string) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files[]", file);
    });
    if (path) formData.append("path", path);

    console.log(
      "Uploading files:",
      files.map((f) => f.name)
    );
    console.log("Upload path:", path);
    console.log("Auth token:", getAuthToken() ? "Present" : "Missing");

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/file-manager/upload`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        // Don't set Content-Type, let browser set it for FormData
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  },

  createFolder: (name: string, path?: string) =>
    apiRequest<any>("/file-manager/create-folder", {
      method: "POST",
      body: JSON.stringify({ name, path }),
    }),

  rename: (oldName: string, newName: string, path?: string) =>
    apiRequest<any>("/file-manager/rename", {
      method: "POST",
      body: JSON.stringify({ old_name: oldName, new_name: newName, path }),
    }),

  delete: (items: string[], path?: string) =>
    apiRequest<any>("/file-manager/delete", {
      method: "POST",
      body: JSON.stringify({ items, path }),
    }),

  move: (items: string[], toPath: string, fromPath?: string) =>
    apiRequest<any>("/file-manager/move", {
      method: "POST",
      body: JSON.stringify({ items, to_path: toPath, from_path: fromPath }),
    }),

  copy: (items: string[], toPath: string, fromPath?: string) =>
    apiRequest<any>("/file-manager/copy", {
      method: "POST",
      body: JSON.stringify({ items, to_path: toPath, from_path: fromPath }),
    }),

  download: (item: string, path?: string) => {
    const searchParams = new URLSearchParams();
    searchParams.append("item", item);
    if (path) searchParams.append("path", path);

    return fetch(
      `${API_BASE_URL}/file-manager/download?${searchParams.toString()}`,
      {
        headers: {
          ...(getAuthToken() && {
            Authorization: `Bearer ${getAuthToken()}`,
          }),
        },
      }
    );
  },

  preview: (item: string, path?: string) => {
    const searchParams = new URLSearchParams();
    searchParams.append("item", item);
    if (path) searchParams.append("path", path);

    return apiRequest<{
      url: string;
      mime_type: string;
      size: number;
    }>(`/file-manager/preview?${searchParams.toString()}`);
  },
};

// Payment API
export const paymentApi = {
  getSettings: () =>
    apiRequest<{
      payment: {
        default_payment_processor: string;
        default_currency: string;
        currency_symbol: string;
        currency_symbol_position: string;
        enable_bank: boolean;
        enable_paypal: boolean;
        enable_stripe: boolean;
        enable_razorpay: boolean;
      };
      stripe: {
        api_key: string;
        secret_key: string;
        webhook_url: string;
        webhook_secret: string;
      };
      razorpay: {
        key_id: string;
        key_secret: string;
        webhook_url: string;
        webhook_secret: string;
      };
      paypal: {
        client_id: string;
        secret: string;
        webhook_url: string;
      };
      bank: {
        bank_name: string;
        account_owner: string;
        account_number: string;
        iban: string;
        routing_number: string;
        bic_swift: string;
        other_details: string;
      };
      currencies: Array<{ code: string; name: string; symbol: string }>;
      payment_processors: Array<{ value: string; label: string }>;
    }>("/admin/payment"),

  updateGeneral: (data: {
    default_payment_processor: string;
    default_currency: string;
    currency_symbol: string;
    currency_symbol_position: string;
    enable_bank: boolean;
    enable_paypal: boolean;
    enable_stripe: boolean;
    enable_razorpay: boolean;
  }) =>
    apiRequest<{ message: string; success: boolean; data: any }>(
      "/admin/payment/general",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),

  updateStripe: (data: {
    api_key: string;
    secret_key: string;
    webhook_url?: string;
    webhook_secret?: string;
  }) =>
    apiRequest<{ message: string; success: boolean; data: any }>(
      "/admin/payment/stripe",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),

  updateRazorpay: (data: {
    key_id: string;
    key_secret: string;
    webhook_url?: string;
    webhook_secret?: string;
  }) =>
    apiRequest<{ message: string; success: boolean; data: any }>(
      "/admin/payment/razorpay",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),

  updatePayPal: (data: {
    client_id: string;
    secret: string;
    webhook_url?: string;
  }) =>
    apiRequest<{ message: string; success: boolean; data: any }>(
      "/admin/payment/paypal",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),

  updateBank: (data: {
    bank_name: string;
    account_owner: string;
    account_number: string;
    iban?: string;
    routing_number?: string;
    bic_swift?: string;
    other_details?: string;
  }) =>
    apiRequest<{ message: string; success: boolean; data: any }>(
      "/admin/payment/bank",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),
};

// Email API
export const emailApi = {
  getSettings: () =>
    apiRequest<{
      email: {
        host: string;
        port: number;
        username: string;
        password: string;
        encryption: string;
        from_address: string;
        from_name: string;
      };
      encryption_options: Array<{ value: string; label: string }>;
      port_options: Array<{ value: number; label: string }>;
    }>("/admin/email"),

  updateSettings: (data: {
    host: string;
    port: number;
    username: string;
    password: string;
    encryption: string;
    from_address: string;
    from_name: string;
  }) =>
    apiRequest<{ message: string; success: boolean; data: any }>(
      "/admin/email",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),

  testEmail: (testEmail: string) =>
    apiRequest<{ message: string; success: boolean }>("/admin/email/test", {
      method: "POST",
      body: JSON.stringify({ test_email: testEmail }),
    }),
};

// Export all APIs
export const api = {
  auth: authApi,
  dashboard: dashboardApi,
  users: usersApi,
  exams: examsApi,
  quizzes: quizzesApi,
  questions: questionsApi,
  practiceSets: practiceSetsApi,
  categories: categoriesApi,
  subCategories: subCategoriesApi,
  tags: tagsApi,
  topics: topicsApi,
  browseTopics: browseTopicsApi,
  skills: skillsApi,
  browseSkills: browseSkillsApi,
  sections: sectionsApi,
  pages: pagesApi,
  lessons: lessonsApi,
  videos: videosApi,
  comprehensions: comprehensionsApi,
  plans: plansApi,
  subscriptions: subscriptionsApi,
  payments: paymentsApi,
  userGroups: userGroupsApi,
  settings: settingsApi,
  menu: menuApi,
  lookup: lookupApi,
  fileManager: fileManagerApi,
  maintenance: maintenanceApi,
  billingTax: billingTaxApi,
  payment: paymentApi,
  email: emailApi,
  generalSettings: generalSettingsApi,
};
