# Dual-Mode Resume Builder

A modern, full-featured resume builder that combines visual form-based editing with raw LaTeX code editing. Edit your resume using intuitive forms or dive into LaTeX code directly - changes sync automatically between both modes with live PDF preview.

## Features

### Core Functionality
- **Visual Editor**: Form-based interface for editing resume sections
- **Code Editor**: Monaco-powered LaTeX editor with syntax highlighting
- **Live PDF Preview**: Real-time PDF compilation and preview
- **Bidirectional Sync**: Seamless synchronization between visual and code editors
- **Auto-Save**: Automatic saving to Supabase database
- **Dark/Light Theme**: Toggle between themes

### Resume Sections Supported
- Personal Information (name, email, phone, location, summary)
- Experience (job title, company, dates, achievements)
- Education (degree, institution, GPA, graduation date)
- Skills (categorized skill lists)
- Projects (with technologies and descriptions)
- Certifications (with issuer and dates)
- Languages (with proficiency levels)

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Zustand for state management
- Monaco Editor for code editing
- React PDF for PDF viewing
- Tailwind CSS for styling
- Lucide React for icons

### Backend
- Supabase (PostgreSQL database)
- Supabase Edge Functions (Deno runtime)
- External LaTeX compilation service

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. The database schema and Edge Function are already deployed to your Supabase project.

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Architecture

### State Management
The application uses Zustand for centralized state management with the following key stores:
- `resumeData`: Structured JSON data for all resume sections
- `latexCode`: Raw LaTeX source code
- `pdfState`: PDF compilation status and errors
- `syncMetadata`: Tracks sync status between editors

### Synchronization System
The bidirectional sync works as follows:

**Visual Editor → Code Editor:**
1. User edits form fields
2. Changes update `resumeData` in store
3. After 300ms debounce, JSON is converted to LaTeX
4. Monaco editor is updated with new LaTeX code

**Code Editor → Visual Editor:**
1. User edits LaTeX code
2. Changes update `latexCode` in store
3. After 500ms debounce, LaTeX is parsed to JSON
4. Form fields are updated with parsed data

### PDF Compilation Pipeline
1. LaTeX code changes trigger compilation after 2-second debounce
2. Code hash is generated to prevent duplicate compilations
3. Edge Function sends LaTeX to external compilation service
4. PDF blob is received and displayed in preview panel
5. Compilation errors are captured and displayed

### Data Flow
```
User Input (Form/Code)
        ↓
   Zustand Store
        ↓
  Debounced Sync
        ↓
  Convert/Parse
        ↓
   Update Other Editor
        ↓
  Trigger PDF Compilation
        ↓
   Display Preview
```

## Project Structure

```
src/
├── components/
│   ├── Layout.tsx              # Main layout with navigation
│   ├── VisualEditor.tsx        # Form-based editor
│   ├── CodeEditor.tsx          # Monaco LaTeX editor
│   └── PDFPreview.tsx          # PDF viewer
├── hooks/
│   ├── useSyncSystem.ts        # Bidirectional sync logic
│   └── usePDFCompiler.ts       # PDF compilation hook
├── store/
│   └── resumeStore.ts          # Zustand state management
├── types/
│   └── resume.ts               # TypeScript interfaces
├── utils/
│   ├── latexConverter.ts       # JSON → LaTeX converter
│   └── latexParser.ts          # LaTeX → JSON parser
└── App.tsx                     # Main app component

supabase/
└── functions/
    └── compile-latex/
        └── index.ts            # Edge Function for PDF compilation
```

## Key Implementation Details

### LaTeX Character Escaping
Special LaTeX characters are automatically escaped during JSON → LaTeX conversion:
- `&` → `\&`
- `%` → `\%`
- `$` → `\$`
- `#` → `\#`
- `_` → `\_`
- `{` → `\{`
- `}` → `\}`
- `~` → `\textasciitilde{}`
- `^` → `\textasciicircum{}`

### Database Schema
The `resumes` table stores:
- `id`: Unique identifier
- `title`: Resume name
- `resume_data`: Structured JSON data
- `latex_code`: LaTeX source
- `pdf_url`: Cached PDF URL
- `pdf_cache_key`: SHA256 hash for cache invalidation
- Timestamps for creation, updates, and compilation

### Edge Function
The `compile-latex` function:
- Accepts LaTeX code via POST request
- Forwards to external compilation service
- Returns compiled PDF or error messages
- Handles CORS for browser requests

## Current Limitations & Future Enhancements

### Completed (Phase 1)
- ✅ Core visual editor with all major sections
- ✅ Monaco code editor with LaTeX support
- ✅ Bidirectional sync system
- ✅ PDF compilation pipeline
- ✅ Database persistence
- ✅ Dark/light theme toggle
- ✅ Responsive layout

### Future Enhancements
- 📝 Additional sections: Projects, Certifications, Languages (forms ready, need UI)
- 📝 Drag-and-drop reordering
- 📝 Multiple LaTeX templates
- 📝 Import from existing PDF/DOCX
- 📝 Export to multiple formats
- 📝 Version history and rollback
- 📝 Real-time collaboration
- 📝 AI-powered content suggestions
- 📝 Form validation with Zod
- 📝 Auto-save indicator

## Development

### Run Type Check
```bash
npm run typecheck
```

### Run Linter
```bash
npm run lint
```

### Build for Production
```bash
npm run build
```

## Contributing

This is a comprehensive resume builder project demonstrating modern web development practices including:
- Type-safe React with TypeScript
- Advanced state management
- Real-time synchronization
- External service integration
- Serverless functions

Feel free to extend and customize for your needs.

## License

MIT
