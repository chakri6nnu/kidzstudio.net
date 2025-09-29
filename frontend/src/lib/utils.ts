import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simple API client for backend integration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:8000/api"
    : "/api");

export type ApiError = { message: string; errors?: Record<string, string[]> };

export function getAuthToken(): string | null {
  return localStorage.getItem("auth_token");
}

export function setAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem("auth_token", token);
  } else {
    localStorage.removeItem("auth_token");
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const resp = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (!resp.ok) {
    let payload: any = null;
    try {
      payload = await resp.json();
    } catch (_) {}
    const error: ApiError = {
      message: payload?.message || `Request failed with status ${resp.status}`,
      errors: payload?.errors,
    };
    throw error;
  }
  if (resp.status === 204) return undefined as unknown as T;
  return resp.json() as Promise<T>;
}

export type LoginResponse = {
  token: string;
  user: { id: number; name: string; email: string; user_name?: string };
};

export async function loginApi(
  email: string,
  password: string,
  deviceName = "react-client"
): Promise<LoginResponse> {
  const data = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password, device_name: deviceName }),
  });
  setAuthToken(data.token);
  return data;
}

export async function logoutApi(): Promise<void> {
  await apiFetch("/auth/logout", { method: "POST" });
  setAuthToken(null);
}

export async function meApi() {
  return apiFetch("/auth/me");
}

// Exam API functions
export type Exam = {
  id: number;
  title: string;
  slug: string;
  code: string;
  description?: string;
  exam_type_id: number;
  exam_mode: "objective" | "subjective" | "mixed";
  sub_category_id: number;
  exam_template_id?: number;
  total_marks?: number;
  total_duration: number;
  total_questions: number;
  is_paid: boolean;
  price?: number;
  can_redeem: boolean;
  points_required?: number;
  is_private: boolean;
  is_active: boolean;
  settings?: any;
  sub_category?: { id: number; name: string };
  exam_type?: { id: number; name: string };
  exam_sections_count?: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
};

export type ExamFilters = {
  search?: string;
  status?: string;
  category?: string;
  per_page?: number;
};

export async function getExamsApi(
  filters: ExamFilters = {}
): Promise<{ data: Exam[]; meta: any }> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });

  const queryString = params.toString();
  const url = queryString ? `/exams?${queryString}` : "/exams";
  return apiFetch(url);
}

export async function getExamApi(id: number): Promise<{ data: Exam }> {
  return apiFetch(`/exams/${id}`);
}

export async function createExamApi(
  examData: Partial<Exam>
): Promise<{ message: string; data: Exam }> {
  return apiFetch("/exams", {
    method: "POST",
    body: JSON.stringify(examData),
  });
}

export async function updateExamApi(
  id: number,
  examData: Partial<Exam>
): Promise<{ message: string; data: Exam }> {
  return apiFetch(`/exams/${id}`, {
    method: "PUT",
    body: JSON.stringify(examData),
  });
}

export async function deleteExamApi(id: number): Promise<{ message: string }> {
  return apiFetch(`/exams/${id}`, {
    method: "DELETE",
  });
}

// Lookups
export async function getExamTypesApi(): Promise<{
  data: { id: number; name: string }[];
}> {
  return apiFetch("/exam-types");
}

export async function getSubCategoriesApi(): Promise<{
  data: { id: number; name: string }[];
}> {
  return apiFetch("/sub-categories");
}

export async function getQuestionTypesApi(): Promise<{
  data: { id: number; name: string }[];
}> {
  return apiFetch("/question-types");
}

export type Question = {
  id: number;
  code: string;
  text?: string;
  question_type?: { id: number; name: string };
  difficulty_level?: { id: number; name: string };
  topic?: { id: number; name: string };
  skill?: { id: number; name: string };
};

export async function getQuestionsApi(
  params: Record<string, any>
): Promise<{ data: Question[]; meta: any }> {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    if (Array.isArray(v)) v.forEach((vv) => usp.append(k + "[]", String(vv)));
    else usp.append(k, String(v));
  });
  const qs = usp.toString();
  return apiFetch(`/questions${qs ? `?${qs}` : ""}`);
}

export async function getAdminDashboard(): Promise<{
  stats: any;
  recent_exams: any[];
  recent_activity: any[];
}> {
  return apiFetch("/admin/dashboard");
}

// Exam section question attach/remove
export async function attachSectionQuestions(
  examId: number,
  sectionId: number,
  questionIds: number[]
): Promise<{ message: string }> {
  return apiFetch(`/exams/${examId}/sections/${sectionId}/questions`, {
    method: "POST",
    body: JSON.stringify({ question_ids: questionIds }),
  });
}

// Quizzes API
export type Quiz = {
  id: number;
  title: string;
  description?: string;
  quiz_type_id: number;
  sub_category_id: number;
  total_marks?: number;
  total_duration?: number;
  is_paid: boolean;
  price?: number;
  can_redeem: boolean;
  points_required?: number;
  is_private: boolean;
  is_active: boolean;
  settings?: any;
  sub_category?: { id: number; name: string };
  quiz_type?: { id: number; name: string };
  created_at: string;
  updated_at: string;
};

export async function getQuizzesApi(
  filters: { search?: string; per_page?: number } = {}
): Promise<{ data: Quiz[]; meta: any }> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params.append(k, String(v));
  });
  const qs = params.toString();
  return apiFetch(`/quizzes${qs ? `?${qs}` : ""}`);
}

export async function getQuizApi(id: number): Promise<{ data: Quiz }> {
  return apiFetch(`/quizzes/${id}`);
}

export async function createQuizApi(
  quizData: Partial<Quiz>
): Promise<{ message: string; data: Quiz }> {
  return apiFetch(`/quizzes`, {
    method: "POST",
    body: JSON.stringify(quizData),
  });
}

export async function updateQuizApi(
  id: number,
  quizData: Partial<Quiz>
): Promise<{ message: string; data: Quiz }> {
  return apiFetch(`/quizzes/${id}`, {
    method: "PUT",
    body: JSON.stringify(quizData),
  });
}

export async function deleteQuizApi(id: number): Promise<{ message: string }> {
  return apiFetch(`/quizzes/${id}`, { method: "DELETE" });
}

// Quiz Types API
export type QuizType = {
  id: number;
  code: string;
  name: string;
  description?: string;
  color?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export async function getQuizTypesApi(
  filters: { search?: string; per_page?: number } = {}
): Promise<{ data: QuizType[]; meta: any }> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params.append(k, String(v));
  });
  const qs = params.toString();
  return apiFetch(`/quiz-types${qs ? `?${qs}` : ""}`);
}

export async function createQuizTypeApi(
  payload: Partial<QuizType>
): Promise<{ message: string; data: QuizType }> {
  return apiFetch(`/quiz-types`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateQuizTypeApi(
  id: number,
  payload: Partial<QuizType>
): Promise<{ message: string; data: QuizType }> {
  return apiFetch(`/quiz-types/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteQuizTypeApi(
  id: number
): Promise<{ message: string }> {
  return apiFetch(`/quiz-types/${id}`, { method: "DELETE" });
}

// Comprehensions API
export type Comprehension = {
  id: number;
  title: string;
  passage: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  questions_count?: number;
};

export async function getComprehensionsApi(
  filters: { search?: string; per_page?: number } = {}
): Promise<{ data: Comprehension[]; meta: any }> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params.append(k, String(v));
  });
  const qs = params.toString();
  return apiFetch(`/comprehensions${qs ? `?${qs}` : ""}`);
}

export async function createComprehensionApi(
  payload: Partial<Comprehension>
): Promise<{ message: string; data: Comprehension }> {
  return apiFetch(`/comprehensions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateComprehensionApi(
  id: number,
  payload: Partial<Comprehension>
): Promise<{ message: string; data: Comprehension }> {
  return apiFetch(`/comprehensions/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteComprehensionApi(
  id: number
): Promise<{ message: string }> {
  return apiFetch(`/comprehensions/${id}`, { method: "DELETE" });
}

// Question Types API (admin)
export type AdminQuestionType = {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export async function getAdminQuestionTypesApi(
  filters: { search?: string; per_page?: number } = {}
): Promise<{ data: AdminQuestionType[]; meta: any }> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params.append(k, String(v));
  });
  const qs = params.toString();
  return apiFetch(`/question-types${qs ? `?${qs}` : ""}`);
}

export async function createAdminQuestionTypeApi(payload: Partial<AdminQuestionType>): Promise<{ message: string; data: AdminQuestionType }> {
  return apiFetch(`/question-types`, { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateAdminQuestionTypeApi(
  id: number,
  payload: Partial<AdminQuestionType>
): Promise<{ message: string; data: AdminQuestionType }> {
  return apiFetch(`/question-types/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export async function deleteAdminQuestionTypeApi(id: number): Promise<{ message: string }> {
  return apiFetch(`/question-types/${id}`, { method: 'DELETE' });
}

export async function removeSectionQuestion(
  examId: number,
  sectionId: number,
  questionId: number
): Promise<{ message: string }> {
  return apiFetch(
    `/exams/${examId}/sections/${sectionId}/questions/${questionId}`,
    {
      method: "DELETE",
    }
  );
}
