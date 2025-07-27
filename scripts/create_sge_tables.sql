-- SGE Media Module Tables
-- This script creates the SGE Media Module tables directly

-- Create SGE Media Projects table
CREATE TABLE IF NOT EXISTS sge_media_projects (
    id SERIAL PRIMARY KEY,
    project_id INTEGER,
    media_type VARCHAR(50) NOT NULL,
    duration VARCHAR(20),
    release_date DATE,
    target_audience TEXT[],
    contributors TEXT[],
    production_budget NUMERIC(10,2),
    thumbnail_url VARCHAR(500),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Create Distribution Tracking table
CREATE TABLE IF NOT EXISTS sge_distribution_logs (
    id SERIAL PRIMARY KEY,
    media_project_id INTEGER NOT NULL,
    platform VARCHAR(100) NOT NULL,
    url TEXT,
    publish_date DATE,
    views INTEGER,
    reach INTEGER,
    engagement_rate NUMERIC(5,2),
    notes TEXT,
    created_at TIMESTAMP
);

-- Create Performance Metrics table
CREATE TABLE IF NOT EXISTS sge_performance_metrics (
    id SERIAL PRIMARY KEY,
    media_project_id INTEGER NOT NULL,
    metric_date DATE NOT NULL,
    views INTEGER,
    unique_viewers INTEGER,
    watch_time_minutes INTEGER,
    engagement_rate NUMERIC(5,2),
    shares INTEGER,
    comments INTEGER,
    created_at TIMESTAMP
);

-- Create Impact Stories table
CREATE TABLE IF NOT EXISTS sge_impact_stories (
    id SERIAL PRIMARY KEY,
    media_project_id INTEGER NOT NULL,
    story_type VARCHAR(50),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    stakeholder_name VARCHAR(200),
    stakeholder_organisation VARCHAR(200),
    impact_date DATE,
    quantifiable_outcome TEXT,
    created_at TIMESTAMP
);

-- Create Client Access table
CREATE TABLE IF NOT EXISTS sge_client_access (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(200) NOT NULL,
    client_email VARCHAR(200) NOT NULL UNIQUE,
    access_level VARCHAR(50),
    allowed_projects INTEGER[],
    is_active BOOLEAN,
    created_at TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS ix_sge_media_projects_project_id ON sge_media_projects(project_id);
CREATE INDEX IF NOT EXISTS ix_sge_media_projects_media_type ON sge_media_projects(media_type);
CREATE INDEX IF NOT EXISTS ix_sge_distribution_logs_media_project_id ON sge_distribution_logs(media_project_id);
CREATE INDEX IF NOT EXISTS ix_sge_distribution_logs_platform ON sge_distribution_logs(platform);
CREATE INDEX IF NOT EXISTS ix_sge_performance_metrics_media_project_id ON sge_performance_metrics(media_project_id);
CREATE INDEX IF NOT EXISTS ix_sge_performance_metrics_metric_date ON sge_performance_metrics(metric_date);
CREATE INDEX IF NOT EXISTS ix_sge_impact_stories_media_project_id ON sge_impact_stories(media_project_id);
CREATE INDEX IF NOT EXISTS ix_sge_impact_stories_story_type ON sge_impact_stories(story_type);

