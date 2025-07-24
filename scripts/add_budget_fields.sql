-- Add budget fields to projects table
-- Run this script in your Render PostgreSQL database

-- Check if columns already exist
DO $$
BEGIN
    -- Add budget column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'budget'
    ) THEN
        ALTER TABLE projects ADD COLUMN budget FLOAT;
        RAISE NOTICE 'Added budget column to projects table';
    ELSE
        RAISE NOTICE 'Budget column already exists in projects table';
    END IF;

    -- Add budget_currency column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'budget_currency'
    ) THEN
        ALTER TABLE projects ADD COLUMN budget_currency VARCHAR(3) NOT NULL DEFAULT 'AUD';
        RAISE NOTICE 'Added budget_currency column to projects table';
    ELSE
        RAISE NOTICE 'Budget_currency column already exists in projects table';
    END IF;
END $$;

-- Update alembic version to match the merge migration
UPDATE alembic_version SET version_num = 'ea804a9513f2' WHERE version_num != 'ea804a9513f2';

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'projects' AND column_name IN ('budget', 'budget_currency')
ORDER BY column_name;

-- Show current alembic version
SELECT version_num FROM alembic_version; 