# LaTeX API Migration - YtoTech Integration

## Overview
Successfully migrated from `latexonline.cc` to **YtoTech LaTeX-on-HTTP API** for LaTeX compilation.

**New API Endpoint:** `https://latex.ytotech.com/builds/sync`

## What Changed

### 1. **API Endpoint Migration**
- **Before:** Supabase Edge Function (`${SUPABASE_URL}/functions/v1/compile-latex`)
- **After:** YtoTech LaTeX-on-HTTP API (`https://latex.ytotech.com/builds/sync`)

### 2. **Authentication**
- **Before:** Required Supabase authentication (Bearer token + API key)
- **After:** No authentication required (fully public API)

### 3. **Request Format**
**Before (Supabase):**
```json
{
  "latex": "\\documentclass{article}..."
}
```

**After (YtoTech):**
```json
{
  "compiler": "pdflatex",
  "resources": [
    {
      "main": true,
      "content": "\\documentclass{article}...",
      "path": "resume.tex"
    }
  ]
}
```

### 4. **Response Handling**
- **Success:** Both return PDF blob (no change)
- **Error:** YtoTech returns `{ message, logs, status }` with detailed LaTeX error logs

### 5. **New Features Added**
- ✅ **Compilation Time Tracking** - Shows how long compilation took
- ✅ **Enhanced Error Parsing** - Extracts line numbers from LaTeX error logs
- ✅ **Network Error Detection** - Better error messages for connectivity issues
- ✅ **Compiler Selection Support** - Ready for multi-compiler support (pdflatex, xelatex, lualatex, etc.)

## Files Modified

### Core Changes
1. **`src/hooks/usePDFCompiler.ts`** - Main compilation logic
   - Updated API endpoint
   - Changed request format
   - Added compilation time tracking
   - Enhanced error parsing with `parseLatexErrors()` function
   - Improved network error handling

2. **`src/types/resume.ts`** - Type definitions
   - Added `compilationTime?: number` to `PDFState` interface

3. **`src/components/PDFPreview.tsx`** - UI component
   - Added compilation time display below PDF preview

### New Files
4. **`src/utils/latexApi.ts`** - API utilities (NEW)
   - Type-safe API interfaces
   - Helper functions for compilation
   - Compiler information and documentation
   - Reusable across the application

## Available Compilers

The YtoTech API supports multiple LaTeX compilers:

| Compiler | Use Case |
|----------|----------|
| `pdflatex` | Default - fastest, most compatible |
| `xelatex` | Unicode support, modern fonts |
| `lualatex` | Lua scripting, advanced features |
| `platex` | Japanese typesetting |
| `uplatex` | Universal pLaTeX |
| `context` | ConTeXt typesetting system |

Currently using: **pdflatex** (default)

## Error Handling

### Network Errors
```
❌ Network Error: Unable to reach compilation server. Check your connection.
```

### LaTeX Syntax Errors
Errors are parsed from compilation logs and displayed with:
- Line number (if available)
- Error message
- Full logs in console for debugging

### Example Error Display
```
Line 42: Undefined control sequence
```

## Performance

- **Compilation Time:** Typically 2-5 seconds
- **Auto-compile Delay:** 2 seconds after last edit (debounced)
- **Performance Tracking:** Compilation time displayed in UI

## Testing Checklist

✅ Basic compilation works
✅ Error messages display correctly
✅ Compilation time shows in UI
✅ Network errors handled gracefully
✅ PDF preview updates automatically
✅ Multiple templates compile successfully

## Future Enhancements

### Phase 2 (Optional)
- [ ] **Compiler Selection UI** - Let users choose compiler (xelatex, lualatex, etc.)
- [ ] **Multi-file Support** - Split resume into sections
- [ ] **Image Support** - Add profile pictures via URL or base64
- [ ] **Real-time Compilation** - Compile on every keystroke (with debounce)
- [ ] **Syntax Highlighting** - LaTeX syntax highlighting in code editor
- [ ] **Error Line Highlighting** - Jump to error line in code editor

### Phase 3 (Advanced)
- [ ] **Self-hosted Fallback** - Deploy own LaTeX-on-HTTP instance
- [ ] **Rate Limiting** - Handle API rate limits gracefully
- [ ] **Caching** - Cache compiled PDFs in sessionStorage
- [ ] **Offline Mode** - Queue compilations when offline

## API Documentation

**Official Docs:** https://github.com/YtoTech/latex-on-http  
**Demo:** https://latex-http-demo.ytotech.com

## Testing the API Directly

You can test the API using curl:

```bash
curl -X POST https://latex.ytotech.com/builds/sync \
  -H "Content-Type: application/json" \
  -d '{
    "compiler": "pdflatex",
    "resources": [
      {
        "main": true,
        "content": "\\documentclass{article}\\begin{document}Hello World\\end{document}"
      }
    ]
  }' \
  --output test.pdf
```

## Environment Variables

**Removed:**
- `VITE_SUPABASE_URL` - No longer needed
- `VITE_SUPABASE_ANON_KEY` - No longer needed

**No new environment variables required** - API is fully public!

## Rollback Plan

If issues arise, you can rollback by:
1. Reverting `src/hooks/usePDFCompiler.ts` to use Supabase endpoint
2. Re-adding Supabase environment variables
3. Reverting type changes in `src/types/resume.ts`

## Support

For API issues:
- GitHub: https://github.com/YtoTech/latex-on-http/issues
- Check API status: Try the demo at https://latex-http-demo.ytotech.com

## Migration Date
**December 3, 2025**

---

**Status:** ✅ Migration Complete and Tested
