-- NavImpact Database Fix - Run these commands in Render Web Console
-- Copy and paste each command one by one

-- 1. Check current table structure
\d+ projects;

-- 2. Add the framework_alignment column safely
ALTER TABLE projects ADD COLUMN IF NOT EXISTS framework_alignment JSONB;

-- 3. Verify the column was added
\d+ projects;

-- 4. Check for duplicate projects
SELECT name, COUNT(*) as count FROM projects GROUP BY LOWER(name) HAVING COUNT(*) > 1 ORDER BY count DESC;

-- 5. Check current data
SELECT COUNT(*) as total_projects FROM projects;

-- 6. Sample some projects
SELECT id, name, created_at FROM projects ORDER BY created_at DESC LIMIT 5;

-- 7. Exit when done
\q 