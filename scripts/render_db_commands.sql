-- Render Database Console Commands
-- Run these in the Render psql console

-- 1. Check current projects table structure
\d+ projects;

-- 2. Check if framework_alignment column exists
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'projects' AND column_name = 'framework_alignment';

-- 3. If column doesn't exist, add it safely
ALTER TABLE projects ADD COLUMN IF NOT EXISTS framework_alignment JSONB;

-- 4. Verify the column was added
\d+ projects;

-- 5. Check current data in projects table
SELECT COUNT(*) as total_projects FROM projects;

-- 6. Check for any existing framework_alignment data
SELECT id, name, framework_alignment 
FROM projects 
WHERE framework_alignment IS NOT NULL 
LIMIT 5;

-- 7. Check Alembic migration state
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'alembic_version'
);

-- 8. If alembic_version table exists, check current version
SELECT version_num FROM alembic_version;

-- 9. Check for duplicate projects
SELECT name, COUNT(*) as count
FROM projects 
GROUP BY LOWER(name)
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- 10. Sample recent projects
SELECT id, name, created_at, status
FROM projects 
ORDER BY created_at DESC 
LIMIT 5; 