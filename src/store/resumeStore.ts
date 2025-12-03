import { create } from 'zustand';
import {
  ResumeData,
  SyncMetadata,
  PDFState,
  EditorSettings,
  ExperienceItem,
  EducationItem,
  SkillCategory,
  ProjectItem,
  CertificationItem,
  LanguageItem,
  CustomSection,
  EditSource,
} from '../types/resume';

const createDefaultResumeData = (): ResumeData => ({
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    profiles: [],
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  customSections: [],
});

interface ResumeStore {
  resumeData: ResumeData;
  latexCode: string;
  pdfState: PDFState;
  syncMetadata: SyncMetadata;
  settings: EditorSettings;
  currentTab: 'templates' | 'visual' | 'code' | 'preview';
  resumeId: string | null;
  recompileTrigger: number;

  triggerRecompile: () => void;

  setResumeData: (data: ResumeData, source?: EditSource) => void;
  setLatexCode: (code: string, source?: EditSource) => void;
  setPdfState: (state: Partial<PDFState>) => void;
  setSyncStatus: (status: SyncMetadata['syncStatus']) => void;
  setSettings: (settings: Partial<EditorSettings>) => void;
  setCurrentTab: (tab: 'templates' | 'visual' | 'code' | 'preview') => void;
  setResumeId: (id: string | null) => void;

  updatePersonalInfo: (info: Partial<ResumeData['personalInfo']>) => void;

  addExperience: (item: Omit<ExperienceItem, 'id'>) => void;
  updateExperience: (id: string, item: Partial<ExperienceItem>) => void;
  deleteExperience: (id: string) => void;
  reorderExperience: (startIndex: number, endIndex: number) => void;

  addEducation: (item: Omit<EducationItem, 'id'>) => void;
  updateEducation: (id: string, item: Partial<EducationItem>) => void;
  deleteEducation: (id: string) => void;

  addSkillCategory: (item: Omit<SkillCategory, 'id'>) => void;
  updateSkillCategory: (id: string, item: Partial<SkillCategory>) => void;
  deleteSkillCategory: (id: string) => void;

  addProject: (item: Omit<ProjectItem, 'id'>) => void;
  updateProject: (id: string, item: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;

  addCertification: (item: Omit<CertificationItem, 'id'>) => void;
  updateCertification: (id: string, item: Partial<CertificationItem>) => void;
  deleteCertification: (id: string) => void;

  addLanguage: (item: Omit<LanguageItem, 'id'>) => void;
  updateLanguage: (id: string, item: Partial<LanguageItem>) => void;
  deleteLanguage: (id: string) => void;

  addCustomSection: (item: Omit<CustomSection, 'id'>) => void;
  updateCustomSection: (id: string, item: Partial<CustomSection>) => void;
  deleteCustomSection: (id: string) => void;

  resetResume: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useResumeStore = create<ResumeStore>((set) => ({
  resumeData: createDefaultResumeData(),
  latexCode: '',
  pdfState: {
    url: null,
    isCompiling: false,
    errors: [],
  },
  syncMetadata: {
    lastEditedBy: 'none',
    lastSyncTime: Date.now(),
    isDirty: false,
    syncStatus: 'synced',
  },
  settings: {
    fontSize: 14,
    theme: 'light',
    autoSaveInterval: 30000,
    zoomLevel: 100,
    template: 'classic',
  },
  currentTab: 'visual',
  resumeId: null,
  recompileTrigger: 0,

  triggerRecompile: () => set((state) => ({ recompileTrigger: state.recompileTrigger + 1 })),

  setResumeData: (data, source = 'visual') =>
    set((state) => ({
      resumeData: data,
      syncMetadata: {
        ...state.syncMetadata,
        lastEditedBy: source,
        lastSyncTime: Date.now(),
        isDirty: true,
      },
    })),

  setLatexCode: (code, source = 'code') =>
    set((state) => ({
      latexCode: code,
      syncMetadata: {
        ...state.syncMetadata,
        lastEditedBy: source,
        lastSyncTime: Date.now(),
        isDirty: true,
      },
    })),

  setPdfState: (state) =>
    set((prev) => ({
      pdfState: { ...prev.pdfState, ...state },
    })),

  setSyncStatus: (status) =>
    set((state) => ({
      syncMetadata: { ...state.syncMetadata, syncStatus: status },
    })),

  setSettings: (settings) =>
    set((state) => ({
      settings: { ...state.settings, ...settings },
    })),

  setCurrentTab: (tab) => set({ currentTab: tab }),

  setResumeId: (id) => set({ resumeId: id }),

  updatePersonalInfo: (info) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        personalInfo: { ...state.resumeData.personalInfo, ...info },
      },
      syncMetadata: {
        ...state.syncMetadata,
        lastEditedBy: 'visual',
        lastSyncTime: Date.now(),
        isDirty: true,
      },
    })),

  addExperience: (item) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        experience: [...state.resumeData.experience, { ...item, id: generateId() }],
      },
      syncMetadata: {
        ...state.syncMetadata,
        lastEditedBy: 'visual',
        lastSyncTime: Date.now(),
        isDirty: true,
      },
    })),

  updateExperience: (id, item) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        experience: state.resumeData.experience.map((exp) =>
          exp.id === id ? { ...exp, ...item } : exp
        ),
      },
      syncMetadata: {
        ...state.syncMetadata,
        lastEditedBy: 'visual',
        lastSyncTime: Date.now(),
        isDirty: true,
      },
    })),

  deleteExperience: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        experience: state.resumeData.experience.filter((exp) => exp.id !== id),
      },
      syncMetadata: {
        ...state.syncMetadata,
        lastEditedBy: 'visual',
        lastSyncTime: Date.now(),
        isDirty: true,
      },
    })),

  reorderExperience: (startIndex, endIndex) =>
    set((state) => {
      const newExperience = Array.from(state.resumeData.experience);
      const [removed] = newExperience.splice(startIndex, 1);
      newExperience.splice(endIndex, 0, removed);
      return {
        resumeData: { ...state.resumeData, experience: newExperience },
        syncMetadata: {
          ...state.syncMetadata,
          lastEditedBy: 'visual',
          lastSyncTime: Date.now(),
          isDirty: true,
        },
      };
    }),

  addEducation: (item) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        education: [...state.resumeData.education, { ...item, id: generateId() }],
      },
      syncMetadata: {
        ...state.syncMetadata,
        lastEditedBy: 'visual',
        lastSyncTime: Date.now(),
        isDirty: true,
      },
    })),

  updateEducation: (id, item) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        education: state.resumeData.education.map((edu) =>
          edu.id === id ? { ...edu, ...item } : edu
        ),
      },
      syncMetadata: {
        ...state.syncMetadata,
        lastEditedBy: 'visual',
        lastSyncTime: Date.now(),
        isDirty: true,
      },
    })),

  deleteEducation: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        education: state.resumeData.education.filter((edu) => edu.id !== id),
      },
      syncMetadata: {
        ...state.syncMetadata,
        lastEditedBy: 'visual',
        lastSyncTime: Date.now(),
        isDirty: true,
      },
    })),

  addSkillCategory: (item) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        skills: [...state.resumeData.skills, { ...item, id: generateId() }],
      },
      syncMetadata: {
        ...state.syncMetadata,
        lastEditedBy: 'visual',
        lastSyncTime: Date.now(),
        isDirty: true,
      },
    })),

  updateSkillCategory: (id, item) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        skills: state.resumeData.skills.map((skill) =>
          skill.id === id ? { ...skill, ...item } : skill
        ),
      },
      syncMetadata: {
        ...state.syncMetadata,
        lastEditedBy: 'visual',
        lastSyncTime: Date.now(),
        isDirty: true,
      },
    })),

  deleteSkillCategory: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        skills: state.resumeData.skills.filter((skill) => skill.id !== id),
      },
      syncMetadata: {
        ...state.syncMetadata,
        lastEditedBy: 'visual',
        lastSyncTime: Date.now(),
        isDirty: true,
      },
    })),

  addProject: (item) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: [...state.resumeData.projects, { ...item, id: generateId() }],
      },
      syncMetadata: {
        ...state.syncMetadata,
        lastEditedBy: 'visual',
        lastSyncTime: Date.now(),
        isDirty: true,
      },
    })),

  updateProject: (id, item) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: state.resumeData.projects.map((proj) =>
          proj.id === id ? { ...proj, ...item } : proj
        ),
      },
      syncMetadata: {
        ...state.syncMetadata,
        lastEditedBy: 'visual',
        lastSyncTime: Date.now(),
        isDirty: true,
      },
    })),

  deleteProject: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: state.resumeData.projects.filter((proj) => proj.id !== id),
      },
      syncMetadata: {
        ...state.syncMetadata,
        lastEditedBy: 'visual',
        lastSyncTime: Date.now(),
        isDirty: true,
      },
    })),

  addCertification: (item) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        certifications: [...state.resumeData.certifications, { ...item, id: generateId() }],
      },
      syncMetadata: {
        ...state.syncMetadata,
        lastEditedBy: 'visual',
        lastSyncTime: Date.now(),
        isDirty: true,
      },
    })),

  updateCertification: (id, item) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        certifications: state.resumeData.certifications.map((cert) =>
          cert.id === id ? { ...cert, ...item } : cert
        ),
      },
      syncMetadata: {
        ...state.syncMetadata,
        lastEditedBy: 'visual',
        lastSyncTime: Date.now(),
        isDirty: true,
      },
    })),

  deleteCertification: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        certifications: state.resumeData.certifications.filter((cert) => cert.id !== id),
      },
      syncMetadata: {
        ...state.syncMetadata,
        lastEditedBy: 'visual',
        lastSyncTime: Date.now(),
        isDirty: true,
      },
    })),

  addLanguage: (item) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        languages: [...state.resumeData.languages, { ...item, id: generateId() }],
      },
      syncMetadata: {
        ...state.syncMetadata,
        lastEditedBy: 'visual',
        lastSyncTime: Date.now(),
        isDirty: true,
      },
    })),

  updateLanguage: (id, item) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        languages: state.resumeData.languages.map((lang) =>
          lang.id === id ? { ...lang, ...item } : lang
        ),
      },
      syncMetadata: {
        ...state.syncMetadata,
        lastEditedBy: 'visual',
        lastSyncTime: Date.now(),
        isDirty: true,
      },
    })),

  deleteLanguage: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        languages: state.resumeData.languages.filter((lang) => lang.id !== id),
      },
      syncMetadata: {
        ...state.syncMetadata,
        lastEditedBy: 'visual',
        lastSyncTime: Date.now(),
        isDirty: true,
      },
    })),

  addCustomSection: (item) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        customSections: [...state.resumeData.customSections, { ...item, id: generateId() }],
      },
      syncMetadata: {
        ...state.syncMetadata,
        lastEditedBy: 'visual',
        lastSyncTime: Date.now(),
        isDirty: true,
      },
    })),

  updateCustomSection: (id, item) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        customSections: state.resumeData.customSections.map((section) =>
          section.id === id ? { ...section, ...item } : section
        ),
      },
      syncMetadata: {
        ...state.syncMetadata,
        lastEditedBy: 'visual',
        lastSyncTime: Date.now(),
        isDirty: true,
      },
    })),

  deleteCustomSection: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        customSections: state.resumeData.customSections.filter((section) => section.id !== id),
      },
      syncMetadata: {
        ...state.syncMetadata,
        lastEditedBy: 'visual',
        lastSyncTime: Date.now(),
        isDirty: true,
      },
    })),

  resetResume: () =>
    set({
      resumeData: createDefaultResumeData(),
      latexCode: '',
      pdfState: { url: null, isCompiling: false, errors: [] },
      syncMetadata: {
        lastEditedBy: 'none',
        lastSyncTime: Date.now(),
        isDirty: false,
        syncStatus: 'synced',
      },
      resumeId: null,
    }),
}));
