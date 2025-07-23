#!/bin/bash

# Script to fix the industry_news table in production
echo "🚀 Connecting to production database and creating industry_news table..."

# Set the password environment variable
export PGPASSWORD="g1eSzQIQfN7GiGEElTXlcZddSQv2yYyE"

# SQL commands to create the table
cat << 'EOF' | psql -h dpg-d1vj88juibrs739eo5dg-a.oregon-postgres.render.com -U navimpact navimpact

-- Drop existing table if it exists
DROP TABLE IF EXISTS industry_news CASCADE;

-- Create table with all required fields
CREATE TABLE industry_news (
    id SERIAL PRIMARY KEY,
    sector VARCHAR(100) NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    url TEXT NOT NULL,
    url_hash VARCHAR(32) NOT NULL,
    source VARCHAR(200),
    platform VARCHAR(50),
    platform_icon VARCHAR(50),
    relevance_score DECIMAL(3,2),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX ix_industry_news_sector ON industry_news (sector);
CREATE UNIQUE INDEX ix_industry_news_url_hash ON industry_news (url_hash);
CREATE INDEX idx_industry_news_sector_published ON industry_news (sector, published_at);
CREATE INDEX idx_industry_news_relevance ON industry_news (relevance_score);
CREATE INDEX idx_industry_news_created ON industry_news (created_at);
CREATE INDEX idx_industry_news_platform ON industry_news (platform);

-- Verify table creation
SELECT 'industry_news table created successfully' as status;
SELECT COUNT(*) as row_count FROM industry_news;

EOF

echo "✅ SQL commands executed. Checking if table was created..."

# Test if the table exists
PGPASSWORD="g1eSzQIQfN7GiGEElTXlcZddSQv2yYyE" psql -h dpg-d1vj88juibrs739eo5dg-a.oregon-postgres.render.com -U navimpact navimpact -c "SELECT COUNT(*) FROM industry_news;"

echo "🎉 Production database table creation complete!" 