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

export async function createAdminQuestionTypeApi(
  payload: Partial<AdminQuestionType>
): Promise<{ message: string; data: AdminQuestionType }> {
  return apiFetch(`/question-types`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAdminQuestionTypeApi(
  id: number,
  payload: Partial<AdminQuestionType>
): Promise<{ message: string; data: AdminQuestionType }> {
  return apiFetch(`/question-types/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminQuestionTypeApi(
  id: number
): Promise<{ message: string }> {
  return apiFetch(`/question-types/${id}`, { method: "DELETE" });
}

// Lessons API
export type Lesson = {
  id: number;
  title: string;
  description?: string;
  content?: string;
  difficulty_level_id?: number;
  skill_id?: number;
  topic_id?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export async function getLessonsApi(
  filters: { search?: string; per_page?: number } = {}
): Promise<{ data: Lesson[]; meta: any }> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params.append(k, String(v));
  });
  const qs = params.toString();
  return apiFetch(`/lessons${qs ? `?${qs}` : ""}`);
}

export async function createLessonApi(
  payload: Partial<Lesson>
): Promise<{ message: string; data: Lesson }> {
  return apiFetch(`/lessons`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateLessonApi(
  id: number,
  payload: Partial<Lesson>
): Promise<{ message: string; data: Lesson }> {
  return apiFetch(`/lessons/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteLessonApi(
  id: number
): Promise<{ message: string }> {
  return apiFetch(`/lessons/${id}`, { method: "DELETE" });
}

// Videos API
export type Video = {
  id: number;
  title: string;
  description?: string;
  category: string;
  sub_category?: string;
  tags?: string;
  quality: string;
  status: string;
  is_active: boolean;
  duration?: string;
  size?: string;
  format?: string;
  views?: number;
  thumbnail?: string;
  video_url?: string;
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
};

export async function getVideosApi(
  filters: {
    search?: string;
    category?: string;
    status?: string;
    quality?: string;
    per_page?: number;
  } = {}
): Promise<{ data: Video[]; meta: any }> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params.append(k, String(v));
  });
  const qs = params.toString();
  return apiFetch(`/videos${qs ? `?${qs}` : ""}`);
}

export async function getVideoApi(id: number): Promise<{ data: Video }> {
  return apiFetch(`/videos/${id}`);
}

export async function createVideoApi(
  payload: Partial<Video>
): Promise<{ message: string; data: Video }> {
  return apiFetch(`/videos`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateVideoApi(
  id: number,
  payload: Partial<Video>
): Promise<{ message: string; data: Video }> {
  return apiFetch(`/videos/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteVideoApi(id: number): Promise<{ message: string }> {
  return apiFetch(`/videos/${id}`, { method: "DELETE" });
}

// Users API
export type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  group_id?: number;
  is_active: boolean;
  date_of_birth?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  created_at: string;
  updated_at: string;
};

export async function getUsersApi(
  filters: {
    search?: string;
    role?: string;
    status?: string;
    group_id?: number;
    per_page?: number;
  } = {}
): Promise<{ data: User[]; meta: any }> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params.append(k, String(v));
  });
  const qs = params.toString();
  return apiFetch(`/users${qs ? `?${qs}` : ""}`);
}

export async function getUserApi(id: number): Promise<{ data: User }> {
  return apiFetch(`/users/${id}`);
}

export async function createUserApi(
  payload: Partial<User> & { password: string }
): Promise<{ message: string; data: User }> {
  return apiFetch(`/users`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateUserApi(
  id: number,
  payload: Partial<User> & { password?: string }
): Promise<{ message: string; data: User }> {
  return apiFetch(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteUserApi(id: number): Promise<{ message: string }> {
  return apiFetch(`/users/${id}`, { method: "DELETE" });
}

// User Groups API
export type UserGroup = {
  id: number;
  name: string;
  description?: string;
  type: string;
  color?: string;
  is_active: boolean;
  permissions?: any[];
  settings?: any;
  users_count?: number;
  created_at: string;
  updated_at: string;
};

export async function getUserGroupsApi(
  filters: {
    search?: string;
    status?: string;
    type?: string;
    per_page?: number;
  } = {}
): Promise<{ data: UserGroup[]; meta: any }> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params.append(k, String(v));
  });
  const qs = params.toString();
  return apiFetch(`/user-groups${qs ? `?${qs}` : ""}`);
}

export async function getUserGroupApi(
  id: number
): Promise<{ data: UserGroup }> {
  return apiFetch(`/user-groups/${id}`);
}

export async function createUserGroupApi(
  payload: Partial<UserGroup>
): Promise<{ message: string; data: UserGroup }> {
  return apiFetch(`/user-groups`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateUserGroupApi(
  id: number,
  payload: Partial<UserGroup>
): Promise<{ message: string; data: UserGroup }> {
  return apiFetch(`/user-groups/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteUserGroupApi(
  id: number
): Promise<{ message: string }> {
  return apiFetch(`/user-groups/${id}`, { method: "DELETE" });
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

// Categories API functions
export interface Category {
  id: number;
  name: string;
  description?: string;
  type: "academic" | "general" | "skill";
  is_active: boolean;
  color?: string;
  icon?: string;
  sub_categories_count: number;
  questions_count: number;
  exams_count: number;
  created_at: string;
  updated_at: string;
}

export const getCategoriesApi = async (filters?: {
  search?: string;
  status?: string;
  type?: string;
  per_page?: number;
}) => {
  const queryParams = new URLSearchParams();
  if (filters?.search) queryParams.append("search", filters.search);
  if (filters?.status && filters.status !== "all")
    queryParams.append("status", filters.status);
  if (filters?.type && filters.type !== "all")
    queryParams.append("type", filters.type);
  if (filters?.per_page)
    queryParams.append("per_page", filters.per_page.toString());

  const response = await apiFetch(`/categories?${queryParams.toString()}`);
  return response;
};

export const getCategoryApi = async (id: number) => {
  const response = await apiFetch(`/categories/${id}`);
  return response;
};

export const createCategoryApi = async (data: Partial<Category>) => {
  const response = await apiFetch("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
};

export const updateCategoryApi = async (
  id: number,
  data: Partial<Category>
) => {
  const response = await apiFetch(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response;
};

export const deleteCategoryApi = async (id: number) => {
  const response = await apiFetch(`/categories/${id}`, {
    method: "DELETE",
  });
  return response;
};

// Sub Categories API functions
export interface SubCategory {
  id: number;
  name: string;
  description?: string;
  category_id: number;
  category: Category;
  is_active: boolean;
  color?: string;
  icon?: string;
  questions_count: number;
  exams_count: number;
  created_at: string;
  updated_at: string;
}

export const getSubCategoriesApi = async (filters?: {
  search?: string;
  status?: string;
  category_id?: string;
  per_page?: number;
}) => {
  const queryParams = new URLSearchParams();
  if (filters?.search) queryParams.append("search", filters.search);
  if (filters?.status && filters.status !== "all")
    queryParams.append("status", filters.status);
  if (filters?.category_id && filters.category_id !== "all")
    queryParams.append("category_id", filters.category_id);
  if (filters?.per_page)
    queryParams.append("per_page", filters.per_page.toString());

  const response = await apiFetch(`/sub-categories?${queryParams.toString()}`);
  return response;
};

export const getSubCategoryApi = async (id: number) => {
  const response = await apiFetch(`/sub-categories/${id}`);
  return response;
};

export const createSubCategoryApi = async (data: Partial<SubCategory>) => {
  const response = await apiFetch("/sub-categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
};

export const updateSubCategoryApi = async (
  id: number,
  data: Partial<SubCategory>
) => {
  const response = await apiFetch(`/sub-categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response;
};

export const deleteSubCategoryApi = async (id: number) => {
  const response = await apiFetch(`/sub-categories/${id}`, {
    method: "DELETE",
  });
  return response;
};

// Tags API functions
export interface Tag {
  id: number;
  name: string;
  description?: string;
  color?: string;
  is_active: boolean;
  questions_count: number;
  exams_count: number;
  created_at: string;
  updated_at: string;
}

export const getTagsApi = async (filters?: {
  search?: string;
  status?: string;
  color?: string;
  per_page?: number;
}) => {
  const queryParams = new URLSearchParams();
  if (filters?.search) queryParams.append("search", filters.search);
  if (filters?.status && filters.status !== "all")
    queryParams.append("status", filters.status);
  if (filters?.color && filters.color !== "all")
    queryParams.append("color", filters.color);
  if (filters?.per_page)
    queryParams.append("per_page", filters.per_page.toString());

  const response = await apiFetch(`/tags?${queryParams.toString()}`);
  return response;
};

export const getTagApi = async (id: number) => {
  const response = await apiFetch(`/tags/${id}`);
  return response;
};

export const createTagApi = async (data: Partial<Tag>) => {
  const response = await apiFetch("/tags", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
};

export const updateTagApi = async (id: number, data: Partial<Tag>) => {
  const response = await apiFetch(`/tags/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response;
};

export const deleteTagApi = async (id: number) => {
  const response = await apiFetch(`/tags/${id}`, {
    method: "DELETE",
  });
  return response;
};

// Sections API functions
export interface Section {
  id: number;
  name: string;
  description?: string;
  type: "multiple_choice" | "essay" | "fill_blank" | "true_false";
  is_active: boolean;
  sort_order?: number;
  questions_count: number;
  exams_count: number;
  created_at: string;
  updated_at: string;
}

export const getSectionsApi = async (filters?: {
  search?: string;
  status?: string;
  type?: string;
  per_page?: number;
}) => {
  const queryParams = new URLSearchParams();
  if (filters?.search) queryParams.append("search", filters.search);
  if (filters?.status && filters.status !== "all")
    queryParams.append("status", filters.status);
  if (filters?.type && filters.type !== "all")
    queryParams.append("type", filters.type);
  if (filters?.per_page)
    queryParams.append("per_page", filters.per_page.toString());

  const response = await apiFetch(`/sections?${queryParams.toString()}`);
  return response;
};

export const getSectionApi = async (id: number) => {
  const response = await apiFetch(`/sections/${id}`);
  return response;
};

export const createSectionApi = async (data: Partial<Section>) => {
  const response = await apiFetch("/sections", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
};

export const updateSectionApi = async (id: number, data: Partial<Section>) => {
  const response = await apiFetch(`/sections/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response;
};

export const deleteSectionApi = async (id: number) => {
  const response = await apiFetch(`/sections/${id}`, {
    method: "DELETE",
  });
  return response;
};

// Skills API functions
export interface Skill {
  id: number;
  name: string;
  description?: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  category_id: number;
  category: Category;
  is_active: boolean;
  sort_order?: number;
  questions_count: number;
  exams_count: number;
  created_at: string;
  updated_at: string;
}

export const getSkillsApi = async (filters?: {
  search?: string;
  status?: string;
  level?: string;
  category_id?: string;
  per_page?: number;
}) => {
  const queryParams = new URLSearchParams();
  if (filters?.search) queryParams.append("search", filters.search);
  if (filters?.status && filters.status !== "all")
    queryParams.append("status", filters.status);
  if (filters?.level && filters.level !== "all")
    queryParams.append("level", filters.level);
  if (filters?.category_id && filters.category_id !== "all")
    queryParams.append("category_id", filters.category_id);
  if (filters?.per_page)
    queryParams.append("per_page", filters.per_page.toString());

  const response = await apiFetch(`/skills?${queryParams.toString()}`);
  return response;
};

export const getSkillApi = async (id: number) => {
  const response = await apiFetch(`/skills/${id}`);
  return response;
};

export const createSkillApi = async (data: Partial<Skill>) => {
  const response = await apiFetch("/skills", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
};

export const updateSkillApi = async (id: number, data: Partial<Skill>) => {
  const response = await apiFetch(`/skills/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response;
};

export const deleteSkillApi = async (id: number) => {
  const response = await apiFetch(`/skills/${id}`, {
    method: "DELETE",
  });
  return response;
};

// Topics API functions
export interface Topic {
  id: number;
  name: string;
  description?: string;
  category_id: number;
  category: Category;
  skill_id?: number;
  skill?: Skill;
  is_active: boolean;
  sort_order?: number;
  difficulty_level?: "beginner" | "intermediate" | "advanced";
  questions_count: number;
  lessons_count: number;
  created_at: string;
  updated_at: string;
}

export const getTopicsApi = async (filters?: {
  search?: string;
  status?: string;
  category_id?: string;
  skill_id?: string;
  per_page?: number;
}) => {
  const queryParams = new URLSearchParams();
  if (filters?.search) queryParams.append("search", filters.search);
  if (filters?.status && filters.status !== "all")
    queryParams.append("status", filters.status);
  if (filters?.category_id && filters.category_id !== "all")
    queryParams.append("category_id", filters.category_id);
  if (filters?.skill_id && filters.skill_id !== "all")
    queryParams.append("skill_id", filters.skill_id);
  if (filters?.per_page)
    queryParams.append("per_page", filters.per_page.toString());

  const response = await apiFetch(`/topics?${queryParams.toString()}`);
  return response;
};

export const getTopicApi = async (id: number) => {
  const response = await apiFetch(`/topics/${id}`);
  return response;
};

export const createTopicApi = async (data: Partial<Topic>) => {
  const response = await apiFetch("/topics", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
};

export const updateTopicApi = async (id: number, data: Partial<Topic>) => {
  const response = await apiFetch(`/topics/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response;
};

export const deleteTopicApi = async (id: number) => {
  const response = await apiFetch(`/topics/${id}`, {
    method: "DELETE",
  });
  return response;
};

// Plans API functions
export interface Plan {
  id: number;
  name: string;
  description?: string;
  type: "free" | "premium" | "enterprise";
  price: number;
  currency: string;
  billing_cycle: "monthly" | "yearly" | "lifetime";
  features?: string[];
  is_active: boolean;
  sort_order?: number;
  trial_days?: number;
  subscriptions_count: number;
  created_at: string;
  updated_at: string;
}

export const getPlansApi = async (filters?: {
  search?: string;
  status?: string;
  type?: string;
  price_min?: number;
  price_max?: number;
  per_page?: number;
}) => {
  const queryParams = new URLSearchParams();
  if (filters?.search) queryParams.append("search", filters.search);
  if (filters?.status && filters.status !== "all")
    queryParams.append("status", filters.status);
  if (filters?.type && filters.type !== "all")
    queryParams.append("type", filters.type);
  if (filters?.price_min)
    queryParams.append("price_min", filters.price_min.toString());
  if (filters?.price_max)
    queryParams.append("price_max", filters.price_max.toString());
  if (filters?.per_page)
    queryParams.append("per_page", filters.per_page.toString());

  const response = await apiFetch(`/plans?${queryParams.toString()}`);
  return response;
};

export const getPlanApi = async (id: number) => {
  const response = await apiFetch(`/plans/${id}`);
  return response;
};

export const createPlanApi = async (data: Partial<Plan>) => {
  const response = await apiFetch("/plans", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
};

export const updatePlanApi = async (id: number, data: Partial<Plan>) => {
  const response = await apiFetch(`/plans/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response;
};

export const deletePlanApi = async (id: number) => {
  const response = await apiFetch(`/plans/${id}`, {
    method: "DELETE",
  });
  return response;
};

// Subscriptions API functions
export interface Subscription {
  id: number;
  user_id: number;
  user: User;
  plan_id: number;
  plan: Plan;
  status: "active" | "inactive" | "cancelled" | "expired";
  start_date: string;
  end_date?: string;
  auto_renew: boolean;
  payment_method?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const getSubscriptionsApi = async (filters?: {
  search?: string;
  status?: string;
  plan_id?: string;
  start_date?: string;
  end_date?: string;
  per_page?: number;
}) => {
  const queryParams = new URLSearchParams();
  if (filters?.search) queryParams.append("search", filters.search);
  if (filters?.status && filters.status !== "all")
    queryParams.append("status", filters.status);
  if (filters?.plan_id && filters.plan_id !== "all")
    queryParams.append("plan_id", filters.plan_id);
  if (filters?.start_date) queryParams.append("start_date", filters.start_date);
  if (filters?.end_date) queryParams.append("end_date", filters.end_date);
  if (filters?.per_page)
    queryParams.append("per_page", filters.per_page.toString());

  const response = await apiFetch(`/subscriptions?${queryParams.toString()}`);
  return response;
};

export const getSubscriptionApi = async (id: number) => {
  const response = await apiFetch(`/subscriptions/${id}`);
  return response;
};

export const createSubscriptionApi = async (data: Partial<Subscription>) => {
  const response = await apiFetch("/subscriptions", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
};

export const updateSubscriptionApi = async (
  id: number,
  data: Partial<Subscription>
) => {
  const response = await apiFetch(`/subscriptions/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response;
};

export const deleteSubscriptionApi = async (id: number) => {
  const response = await apiFetch(`/subscriptions/${id}`, {
    method: "DELETE",
  });
  return response;
};

// Settings API functions
export interface Setting {
  id: number;
  key: string;
  value: string;
  type: "string" | "number" | "boolean" | "json" | "text";
  category: string;
  description?: string;
  is_public: boolean;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}

export const getSettingsApi = async (filters?: {
  search?: string;
  category?: string;
  type?: string;
  per_page?: number;
}) => {
  const queryParams = new URLSearchParams();
  if (filters?.search) queryParams.append("search", filters.search);
  if (filters?.category && filters.category !== "all")
    queryParams.append("category", filters.category);
  if (filters?.type && filters.type !== "all")
    queryParams.append("type", filters.type);
  if (filters?.per_page)
    queryParams.append("per_page", filters.per_page.toString());

  const response = await apiFetch(`/settings?${queryParams.toString()}`);
  return response;
};

export const getSettingApi = async (id: number) => {
  const response = await apiFetch(`/settings/${id}`);
  return response;
};

export const createSettingApi = async (data: Partial<Setting>) => {
  const response = await apiFetch("/settings", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
};

export const updateSettingApi = async (id: number, data: Partial<Setting>) => {
  const response = await apiFetch(`/settings/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response;
};

export const deleteSettingApi = async (id: number) => {
  const response = await apiFetch(`/settings/${id}`, {
    method: "DELETE",
  });
  return response;
};
