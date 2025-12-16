# 🦷 Dental Chart IDP Frontend

A modern **React + TypeScript** frontend application for the **Dental Chart Intelligent Document Processing (IDP)** system. This app provides an intuitive interface for uploading dental forms, viewing AI‑extracted data, and editing patient information across multiple pages.

---

## 📋 Table of Contents

* [Tech Stack](#-tech-stack)
* [Prerequisites](#-prerequisites)
* [Installation](#-installation)
* [Environment Configuration](#-environment-configuration)
* [Running the Application](#-running-the-application)
* [Project Structure](#-project-structure)
* [Features](#-features)
* [Architecture](#-architecture)
* [Testing](#-testing)
* [Building for Production](#-building-for-production)
* [Troubleshooting](#-troubleshooting)
* [Customization](#-customization)
* [Development Notes](#-development-notes)
* [Contributing](#-contributing)
* [Support](#-support)

---

## 🛠 Tech Stack

* **Framework**: React 19
* **Language**: TypeScript
* **Build Tool**: Vite
* **Styling**: Tailwind CSS
* **State Management**: Zustand
* **HTTP Client**: Axios
* **PDF Processing**: PDF.js
* **Form Handling**: React Hook Form + Zod
* **Icons**: Lucide React
* **Routing**: React Router DOM

---

## ✅ Prerequisites

Before you begin, ensure you have:

* **Node.js** v18 or higher
* **npm** v9 or higher
* **Backend server running** (see backend README)

---

## 📦 Installation

```bash
cd dental-chart-frontend
npm install
```

---

## ⚙️ Environment Configuration

### Development

`.env.development`

```env
VITE_API_URL=http://localhost:5002
```

### Production

`.env.production`

```env
VITE_API_URL=https://your-production-api.com
```

**Configuration Details**:

* `VITE_API_URL`: Base URL of the backend API

---

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

The app will open at `http://localhost:5173` (or the next available port).

### Preview Production Build

```bash
npm run preview
```

---

## 📁 Project Structure

```text
dental-chart-idp-frontend-main/
├── public/
│   └── dental-logo.png
├── src/
│   ├── app/
│   │   └── App.tsx
│   ├── features/
│   │   ├── edit-field/
│   │   │   ├── FormField.tsx
│   │   │   └── forms/
│   │   │       ├── PatientInfoForm.tsx
│   │   │       ├── DentalHistoryForm.tsx
│   │   │       ├── MedicalHistoryForm.tsx
│   │   │       ├── DentalChartForm.tsx
│   │   │       ├── ClinicalFindingsForm.tsx
│   │   │       ├── ConsentTreatmentForm.tsx
│   │   │       ├── ConsentProceduresForm.tsx
│   │   │       ├── SignaturesForm.tsx
│   │   │       └── TreatmentRecordsForm.tsx
│   │   └── upload-chart/
│   │       └── UploadZone.tsx
│   ├── pages/
│   │   ├── landing/
│   │   │   └── LandingPage.tsx
│   │   └── main/
│   │       └── MainPage.tsx
│   ├── shared/
│   │   ├── api/
│   │   │   └── api.ts
│   │   ├── store/
│   │   │   └── useAppStore.ts
│   │   └── ui/
│   │       ├── Button.tsx
│   │       └── SuccessModal.tsx
│   ├── widgets/
│   │   ├── form-panel/
│   │   │   └── FormPanel.tsx
│   │   └── image-viewer/
│   │       └── ImageViewer.tsx
│   ├── index.css
│   └── main.tsx
├── .env.development
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## ✨ Features

### 1. Multi‑Page Form System

* 4‑page dental form workflow
* Tab‑based navigation
* AI‑auto‑filled fields
* Real‑time validation

### 2. File Upload

* 4‑page PDF support
* 4 individual image uploads
* Drag‑and‑drop UI
* File validation

### 3. AI Data Extraction

* Gemini AI‑powered extraction
* Editable pre‑filled data

### 4. PDF / Image Viewer

* Side‑by‑side form & document
* Zoom and navigation

### 5. State Management

* Zustand global store
* Persistent form data

---

## 🏗 Architecture

### Feature‑Sliced Design (FSD)

* **app/** – App initialization & routing
* **pages/** – Full pages
* **widgets/** – Complex UI blocks
* **features/** – User interactions
* **shared/** – Reusable utilities

### Zustand Store (`useAppStore.ts`)

```ts
{
  appState: 'empty' | 'loading' | 'verification',
  currentPage: number,
  uploadedImage: File | null,
  extractedData: Record<string, any>,
  formData: Record<string, any>,
  separatedPages: string[],
  uploadMode: 'pdf' | 'images' | null,
  patientId: string | null,
  dentalChartId: string | null
}
```

### API Endpoints Used

* `POST /api/extract/page1`
* `POST /api/extract/page2`
* `POST /api/extract/page3`
* `POST /api/extract/page4`

---

## 🧪 Testing

### Manual Testing

```bash
# Backend
cd dental-backend
npm run dev

# Frontend
cd dental-chart-frontend
npm run dev
```

Test workflow:

* Upload PDF or images
* Verify extracted data
* Edit forms
* Save & finish

### Linting

```bash
npm run lint
```

---

## 🏗 Building for Production

```bash
npm run build
npm run preview
```

Deploy the `dist/` folder to:

* Vercel
* Netlify
* AWS S3 + CloudFront

---

## 🔧 Troubleshooting

### API / CORS Errors

* Check backend port
* Verify `VITE_API_URL`
* Enable CORS in backend

### PDF Not Loading

* Verify PDF.js worker
* Check console errors

### Build Errors

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 🎨 Customization

### Change Colors

```css
:root {
  --color-primary: 63 99 141;
  --color-primary-hover: 51 79 113;
}
```

### Add New Forms

1. Create form in `features/edit-field/forms/`
2. Register in `FormPanel.tsx`
3. Update `PAGE_TABS`
4. Add backend endpoint

---

## 📝 Development Notes

* Functional components only
* Strong TypeScript typing
* Proper loading & error states
* Accessible components

---

## 🤝 Contributing

1. Create feature branch
2. Commit changes
3. Run `npm run lint`
4. Test thoroughly
5. Open pull request

---


## 🆘 Support

* Review documentation
* Check troubleshooting section
* Contact the development team

---

**Last Updated**: December 2025



