/*
  # Create Resumes Table

  ## Overview
  Creates the main table for storing resume data with support for version control,
  user ownership, and caching of compiled PDFs.

  ## Tables Created
  1. `resumes`
    - `id` (uuid, primary key) - Unique identifier for each resume
    - `user_id` (uuid, nullable) - Owner of the resume (future auth integration)
    - `title` (text) - Resume title/name
    - `resume_data` (jsonb) - Structured resume content (JSON format)
    - `latex_code` (text) - LaTeX source code
    - `pdf_url` (text, nullable) - URL to compiled PDF (if cached)
    - `pdf_cache_key` (text, nullable) - SHA256 hash for cache invalidation
    - `created_at` (timestamptz) - Creation timestamp
    - `updated_at` (timestamptz) - Last modification timestamp
    - `last_compiled_at` (timestamptz, nullable) - Last successful PDF compilation

  ## Security
  - Enable RLS on resumes table
  - Allow public access for now (will be restricted after auth implementation)
  - Future: Add policies for authenticated users to manage their own resumes

  ## Indexes
  - Index on user_id for efficient user-based queries
  - Index on pdf_cache_key for cache lookups
*/

CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  title text NOT NULL DEFAULT 'Untitled Resume',
  resume_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  latex_code text NOT NULL DEFAULT '',
  pdf_url text,
  pdf_cache_key text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_compiled_at timestamptz
);

ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to resumes"
  ON resumes
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS resumes_user_id_idx ON resumes(user_id);
CREATE INDEX IF NOT EXISTS resumes_pdf_cache_key_idx ON resumes(pdf_cache_key);
CREATE INDEX IF NOT EXISTS resumes_updated_at_idx ON resumes(updated_at DESC);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_resumes_updated_at
  BEFORE UPDATE ON resumes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
