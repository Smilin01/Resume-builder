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
- Supabase (PostgreSQL database) - for resume storage
- YtoTech LaTeX-on-HTTP API - for PDF compilation (no authentication required)

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (optional - only needed for resume storage)

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Set up environment variables (optional - only for database features):
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials if you want resume storage:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note:** The LaTeX compilation works without any API keys! The YtoTech API is fully public.

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
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
3. Request sent to YtoTech LaTeX-on-HTTP API with LaTeX source
4. API compiles using pdflatex (configurable to xelatex, lualatex, etc.)
5. PDF blob is received and displayed in preview panel
6. Compilation time is tracked and displayed to user
7. Compilation errors are parsed from logs and displayed with line numbers

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
│   ├── PDFPreview.tsx          # PDF viewer with compilation time
│   └── TemplateSelector.tsx    # Template selection UI
├── hooks/
│   ├── useSyncSystem.ts        # Bidirectional sync logic
│   └── usePDFCompiler.ts       # PDF compilation with YtoTech API
├── store/
│   └── resumeStore.ts          # Zustand state management
├── types/
│   └── resume.ts               # TypeScript interfaces
├── utils/
│   ├── latexConverter.ts       # JSON → LaTeX converter
│   ├── latexParser.ts          # LaTeX → JSON parser
│   └── latexApi.ts             # YtoTech API utilities
├── data/
│   └── templates.ts            # LaTeX resume templates
└── App.tsx                     # Main app component
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

### LaTeX Compilation API
The application uses the **YtoTech LaTeX-on-HTTP API** for PDF compilation:
- **Endpoint**: `https://latex.ytotech.com/builds/sync`
- **Authentication**: None required (fully public API)
- **Compilers**: Supports pdflatex, xelatex, lualatex, and more
- **Documentation**: https://github.com/YtoTech/latex-on-http

For details on the API migration, see [LATEX_API_MIGRATION.md](./LATEX_API_MIGRATION.md)

## Current Limitations & Future Enhancements

### Completed (Phase 1)
- ✅ Core visual editor with all major sections
- ✅ Monaco code editor with LaTeX support
- ✅ Bidirectional sync system
- ✅ PDF compilation pipeline with YtoTech API
- ✅ Compilation time tracking and display
- ✅ Multiple LaTeX templates (Classic, Modern Compact, Developer)
- ✅ Enhanced error handling with line numbers
- ✅ Database persistence
- ✅ Dark/light theme toggle
- ✅ Responsive layout

### Future Enhancements
- 📝 Compiler selection UI (pdflatex, xelatex, lualatex)
- 📝 Drag-and-drop reordering
- 📝 Import from existing PDF/DOCX
- 📝 Export to multiple formats
- 📝 Version history and rollback
- 📝 Real-time collaboration
- 📝 AI-powered content suggestions
- 📝 Form validation with Zod
- 📝 Auto-save indicator
- 📝 Multi-file LaTeX support (split resume into sections)
- 📝 Image upload for profile pictures

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
