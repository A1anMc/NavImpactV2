-- Add sprint management system
-- Migration: Add sprint tables

CREATE TABLE IF NOT EXISTS sprints (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    status VARCHAR NOT NULL DEFAULT 'planning',
    priority VARCHAR NOT NULL DEFAULT 'medium',
    
    -- Sprint lifecycle
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    planned_start TIMESTAMP,
    planned_end TIMESTAMP,
    
    -- Sprint goals and metrics
    goals JSONB,
    metrics JSONB,
    deliverables JSONB,
    
    -- Team and resources
    team_members JSONB,
    resources JSONB,
    
    -- Progress tracking
    progress_percentage INTEGER DEFAULT 0,
    completed_tasks INTEGER DEFAULT 0,
    total_tasks INTEGER DEFAULT 0,
    
    -- Strategic alignment
    strategic_objectives JSONB,
    impact_areas JSONB,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    
    -- Project association
    project_id INTEGER REFERENCES projects(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sprints_status ON sprints(status);
CREATE INDEX IF NOT EXISTS idx_sprints_priority ON sprints(priority);
CREATE INDEX IF NOT EXISTS idx_sprints_project_id ON sprints(project_id);
CREATE INDEX IF NOT EXISTS idx_sprints_created_by ON sprints(created_by);
CREATE INDEX IF NOT EXISTS idx_sprints_created_at ON sprints(created_at);
