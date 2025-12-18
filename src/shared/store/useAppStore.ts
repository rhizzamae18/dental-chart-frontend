import { create } from "zustand";

// DEFINE THE TYPES
// This describes what shape our data has
interface AppState {
  // What screen are we showing?
  appState: "empty" | "loading" | "verification";

  // Which page of the dental form (1-4)?
  currentPage: number;

  // The uploaded image file
  uploadedImage: File | null;

  // Data extracted by AI (we'll define this better later)
  extractedData: Record<string, unknown> | null;

  // User's edited form data
  formData: Record<string, string | number | boolean>;

  // For PDF uploads: holds the 4 generated image URLs
  separatedPages: string[];

  // Track which upload mode user selected
  uploadMode: "pdf" | "images" | null;

  // Patient ID from page 1 upload (needed for page 2)
  patientId: string | null;

  // Dental Chart ID from page 2 upload
  dentalChartId: string | null;

  dentalRecordId: string | null;
}

// Functions to change the state
interface AppActions {
  // Change which screen we're showing
  setAppState: (state: "empty" | "loading" | "verification") => void;

  // Move to next page (1 -> 2 -> 3 -> 4)
  nextPage: () => void;

  // Move to previous page (4 -> 3 -> 2 -> 1)
  previousPage: () => void;

  // Set the upload image
  setUploadedImage: (file: File) => void;

  // Set the AI extracted data
  setExtractedData: (data: Record<string, unknown>) => void;

  // Update form data when user edits
  updateFormData: (field: string, value: string | number | boolean) => void;

  // Reset everything (for next upload)
  resetPage: () => void;

  // NEW: For PDF, store the 4 extracted page images (URLs)
  setSeparatedPages: (pages: string[]) => void;

  // Set upload mode
  setUploadMode: (mode: "pdf" | "images" | null) => void;

  // Set patient ID from page 1
  setPatientId: (id: string | null) => void;

  // Set dental chart ID from page 2
  setDentalChartId: (id: string | null) => void;

  setDentalRecordId: (id: string | null) => void;
}

// Create the store
export const useAppStore = create<AppState & AppActions>((set) => ({
  // Initial state (starting values)
  appState: "empty",
  currentPage: 1,
  uploadedImage: null,
  extractedData: null,
  formData: {},
  separatedPages: [],
  uploadMode: null,
  patientId: null,
  dentalChartId: null,
  dentalRecordId: null,

  // ACTIONS (functions to update state)
  setAppState: (state) => set({ appState: state }),

  nextPage: () =>
    set((prev) => ({
      currentPage: Number(prev.currentPage) + 1,
    })),

  previousPage: () =>
    set((prev) => ({
      currentPage: Math.max(1, Number(prev.currentPage) - 1),
    })),

  setUploadedImage: (file) => set({ uploadedImage: file }),

  setExtractedData: (data) => set({ extractedData: data }),

  updateFormData: (field, value) =>
    set((prev) => ({
      formData: {
        ...prev.formData,
        [field]: value,
      },
    })),

  setSeparatedPages: (pages) => set({ separatedPages: pages }),

  setUploadMode: (mode) => set({ uploadMode: mode }),

  setPatientId: (id) => set({ patientId: id }),

  setDentalChartId: (id) => set({ dentalChartId: id }),

  setDentalRecordId: (id) => set({ dentalRecordId: id }),

  resetPage: () =>
    set({
      appState: "empty",
      currentPage: 1,
      uploadedImage: null,
      extractedData: null,
      formData: {},
      separatedPages: [],
      uploadMode: null,
      patientId: null,
      dentalChartId: null,
    }),
}));
