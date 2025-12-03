export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

export interface ExperienceItem {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bulletPoints: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  gpa?: string;
  graduationDate: string;
  bulletPoints?: string[];
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  link?: string;
  technologies: string[];
  bulletPoints?: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: 'Native' | 'Fluent' | 'Professional' | 'Intermediate' | 'Basic';
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
}

export type EditSource = 'visual' | 'code' | 'none';

export interface SyncMetadata {
  lastEditedBy: EditSource;
  lastSyncTime: number;
  isDirty: boolean;
  syncStatus: 'synced' | 'syncing' | 'error';
}

export interface CompilationError {
  line: number;
  message: string;
}

export interface PDFState {
  url: string | null;
  isCompiling: boolean;
  errors: CompilationError[];
}

export interface EditorSettings {
  fontSize: number;
  theme: 'light' | 'dark';
  autoSaveInterval: number;
  zoomLevel: number;
  template: string;
}
