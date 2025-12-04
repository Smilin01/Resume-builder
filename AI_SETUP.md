# AI Setup Guide

This resume builder uses OpenRouter AI to enhance resume content and provide intelligent editing suggestions.

## Setup Instructions

### 1. Get an OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up or log in to your account
3. Navigate to the API Keys section
4. Create a new API key

### 2. Configure Your Environment

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and replace `your_openrouter_api_key_here` with your actual API key:
   ```
   VITE_OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
   ```

### 3. Important Security Notes

- **NEVER commit the `.env` file to git** - it's already in `.gitignore`
- The `.env.example` file is safe to commit (it doesn't contain real keys)
- Keep your API key private and secure

## AI Features

The AI assistant provides:

- **Resume Enhancement**: Automatically improves professional summaries, bullet points, and descriptions
- **Content Generation**: Creates missing content based on available information
- **Smart Editing**: Responds to natural language requests to modify your resume
- **Template Optimization**: Adjusts content to fit perfectly on one page

## Current AI Model

The application uses `x-ai/grok-4.1-fast:free` for fast, free resume generation and editing.

## Troubleshooting

### API Key Not Working

- Verify your API key is correct in the `.env` file
- Ensure there are no extra spaces or quotes around the key
- Restart the development server after changing `.env`

### Environment Variable Not Loading

- Make sure the variable name starts with `VITE_` (required for Vite)
- Restart the dev server: `npm run dev`
- Check that `.env` is in the project root directory

## Development

When running the development server, Vite automatically loads environment variables from `.env` and makes them available via `import.meta.env`.
