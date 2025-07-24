#!/bin/bash

# Script to seed the industry_news table in production
echo "🌱 Seeding production news table with sample data..."

# Set the password environment variable
export PGPASSWORD="g1eSzQIQfN7GiGEElTXlcZddSQv2yYyE"

# SQL commands to insert sample news data
cat << 'EOF' | psql -h dpg-d1vj88juibrs739eo5dg-a.oregon-postgres.render.com -U navimpact navimpact

-- Insert sample news data
INSERT INTO industry_news (sector, title, summary, url, url_hash, source, platform, platform_icon, relevance_score, published_at) VALUES
('tech', 'AI Breakthrough in Renewable Energy', 'New artificial intelligence algorithms are revolutionizing solar panel efficiency, potentially increasing energy output by 40%.', 'https://example.com/ai-renewable-energy', 'abc123def456', 'TechNews Daily', 'twitter', 'twitter-icon', 0.95, NOW() - INTERVAL '2 hours'),
('tech', 'Quantum Computing Milestone Achieved', 'Researchers have achieved quantum supremacy in solving complex optimization problems, opening new possibilities for cryptography.', 'https://example.com/quantum-computing', 'def456ghi789', 'Quantum Weekly', 'linkedin', 'linkedin-icon', 0.92, NOW() - INTERVAL '4 hours'),
('health', 'Breakthrough in Cancer Treatment', 'New immunotherapy approach shows promising results in clinical trials, with 70% success rate in early-stage patients.', 'https://example.com/cancer-treatment', 'ghi789jkl012', 'Health Journal', 'facebook', 'facebook-icon', 0.98, NOW() - INTERVAL '6 hours'),
('creative', 'Digital Art Revolution', 'NFT marketplace sees unprecedented growth as artists embrace blockchain technology for digital art sales.', 'https://example.com/digital-art-nft', 'jkl012mno345', 'Creative Times', 'instagram', 'instagram-icon', 0.88, NOW() - INTERVAL '8 hours'),
('government', 'New Grant Program for Startups', 'Federal government announces $50M grant program to support innovative startup companies in emerging technologies.', 'https://example.com/startup-grants', 'mno345pqr678', 'Government News', 'twitter', 'twitter-icon', 0.90, NOW() - INTERVAL '10 hours'),
('funding', 'VC Investment Trends 2024', 'Venture capital firms are increasingly focusing on sustainable technology investments, with 60% increase in funding.', 'https://example.com/vc-trends-2024', 'pqr678stu901', 'Funding Weekly', 'linkedin', 'linkedin-icon', 0.85, NOW() - INTERVAL '12 hours'),
('tech', 'Cybersecurity Innovation', 'New AI-powered cybersecurity platform detects threats 10x faster than traditional methods.', 'https://example.com/cybersecurity-ai', 'stu901vwx234', 'Security Today', 'twitter', 'twitter-icon', 0.93, NOW() - INTERVAL '14 hours'),
('health', 'Mental Health Tech Solutions', 'Digital mental health platforms are gaining traction, with 300% increase in user adoption during the past year.', 'https://example.com/mental-health-tech', 'vwx234yza567', 'Health Tech News', 'facebook', 'facebook-icon', 0.87, NOW() - INTERVAL '16 hours'),
('creative', 'Virtual Reality in Education', 'VR technology is transforming educational experiences, with schools reporting 50% improvement in student engagement.', 'https://example.com/vr-education', 'yza567bcd890', 'EdTech Magazine', 'youtube', 'youtube-icon', 0.89, NOW() - INTERVAL '18 hours'),
('government', 'Smart City Initiatives', 'Major cities are implementing IoT solutions for traffic management and energy efficiency, reducing costs by 25%.', 'https://example.com/smart-cities', 'bcd890efg123', 'Urban Development', 'linkedin', 'linkedin-icon', 0.91, NOW() - INTERVAL '20 hours');

-- Verify the data was inserted
SELECT COUNT(*) as total_records FROM industry_news;
SELECT sector, COUNT(*) as count FROM industry_news GROUP BY sector ORDER BY count DESC;

EOF

echo "✅ Sample news data seeded successfully!" 