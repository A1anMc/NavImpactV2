-- SGE Team Members Creation Script
-- This script creates the 7 SGE team members in the production database

-- First, let's check if any SGE team members already exist
SELECT 'Checking existing SGE team members...' as status;
SELECT id, email, full_name, job_title, organisation 
FROM users 
WHERE organisation = 'Shadow Goose Entertainment';

-- Create SGE Team Members
-- Note: Using a simple password hash for now (users should change passwords)

-- 1. Ursula Searle - Managing Director
INSERT INTO users (
    email, 
    hashed_password, 
    full_name, 
    job_title, 
    organisation, 
    bio, 
    skills, 
    current_status, 
    is_intern, 
    is_active, 
    created_at, 
    updated_at
) VALUES (
    'ursula@shadowgoose.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8i', -- password: SGE2024!
    'Ursula Searle',
    'Managing Director',
    'Shadow Goose Entertainment',
    'Strategic leader focused on sustainable media impact and organisational growth',
    ARRAY['Strategic Planning', 'Leadership', 'Project Management', 'Business Development'],
    'available',
    false,
    true,
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- 2. Ash Dorman - Managing Director
INSERT INTO users (
    email, 
    hashed_password, 
    full_name, 
    job_title, 
    organisation, 
    bio, 
    skills, 
    current_status, 
    is_intern, 
    is_active, 
    created_at, 
    updated_at
) VALUES (
    'ash@shadowgoose.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8i', -- password: SGE2024!
    'Ash Dorman',
    'Managing Director',
    'Shadow Goose Entertainment',
    'Business development and strategic partnerships specialist',
    ARRAY['Strategic Planning', 'Leadership', 'Business Development', 'Partnerships'],
    'available',
    false,
    true,
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- 3. Shamita Siva - Creative Director
INSERT INTO users (
    email, 
    hashed_password, 
    full_name, 
    job_title, 
    organisation, 
    bio, 
    skills, 
    current_status, 
    is_intern, 
    is_active, 
    created_at, 
    updated_at
) VALUES (
    'shamita@shadowgoose.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8i', -- password: SGE2024!
    'Shamita Siva',
    'Creative Director',
    'Shadow Goose Entertainment',
    'Creative visionary driving storytelling and media production excellence',
    ARRAY['Creative Direction', 'Storytelling', 'Media Production', 'Content Strategy'],
    'available',
    false,
    true,
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- 4. Alan McCarthy - Impact Director
INSERT INTO users (
    email, 
    hashed_password, 
    full_name, 
    job_title, 
    organisation, 
    bio, 
    skills, 
    current_status, 
    is_intern, 
    is_active, 
    created_at, 
    updated_at
) VALUES (
    'alan@navimpact.org',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8i', -- password: SGE2024!
    'Alan McCarthy',
    'Impact Director',
    'Shadow Goose Entertainment',
    'Impact measurement and stakeholder engagement specialist',
    ARRAY['Impact Measurement', 'Data Analysis', 'Stakeholder Engagement', 'Sustainability'],
    'available',
    false,
    true,
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- 5. Mish Rep - Operations Officer
INSERT INTO users (
    email, 
    hashed_password, 
    full_name, 
    job_title, 
    organisation, 
    bio, 
    skills, 
    current_status, 
    is_intern, 
    is_active, 
    created_at, 
    updated_at
) VALUES (
    'mish@shadowgoose.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8i', -- password: SGE2024!
    'Mish Rep',
    'Operations Officer',
    'Shadow Goose Entertainment',
    'Operations management and process optimization expert',
    ARRAY['Operations Management', 'Coordination', 'Process Improvement', 'Project Coordination'],
    'available',
    false,
    true,
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- 6. Kiara Holt - Intern
INSERT INTO users (
    email, 
    hashed_password, 
    full_name, 
    job_title, 
    organisation, 
    bio, 
    skills, 
    current_status, 
    is_intern, 
    is_active, 
    created_at, 
    updated_at
) VALUES (
    'kiara@shadowgoose.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8i', -- password: SGE2024!
    'Kiara Holt',
    'Intern',
    'Shadow Goose Entertainment',
    'Learning media production and impact measurement',
    ARRAY['Research', 'Content Creation', 'Social Media', 'Learning'],
    'learning',
    true,
    true,
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Set up mentorship relationship (Shamita mentors Kiara)
UPDATE users 
SET mentor_id = (SELECT id FROM users WHERE email = 'shamita@shadowgoose.com')
WHERE email = 'kiara@shadowgoose.com';

-- Verify the team was created
SELECT 'SGE Team Creation Complete!' as status;
SELECT 
    id,
    email,
    full_name,
    job_title,
    organisation,
    current_status,
    is_intern,
    mentor_id,
    created_at
FROM users 
WHERE organisation = 'Shadow Goose Entertainment'
ORDER BY 
    CASE 
        WHEN job_title LIKE '%Director%' THEN 1
        WHEN job_title = 'Operations Officer' THEN 2
        WHEN job_title = 'Intern' THEN 3
        ELSE 4
    END,
    full_name;

-- Show mentorship relationship
SELECT 
    m.full_name as mentor,
    i.full_name as intern,
    i.email as intern_email
FROM users m
JOIN users i ON m.id = i.mentor_id
WHERE m.organisation = 'Shadow Goose Entertainment' 
AND i.organisation = 'Shadow Goose Entertainment'; 