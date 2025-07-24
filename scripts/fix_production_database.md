# 🔧 Fix Production Database - Budget Fields Migration

## 🚨 Current Issue
The production database is missing the `budget` and `budget_currency` columns in the `projects` table, causing the API to fail.

## ✅ Solution Options

### Option 1: Apply Migration via Render Database Interface (Recommended)

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Navigate to your NavImpact-dbV2 database

2. **Open Database Console**
   - Click on "Connect" → "External Database"
   - Copy the connection string

3. **Run the SQL Script**
   - Use any PostgreSQL client (pgAdmin, DBeaver, etc.)
   - Connect using the external database URL
   - Run the SQL script: `scripts/add_budget_fields.sql`

### Option 2: Apply Migration via Command Line

```bash
# Get the database URL from Render dashboard
# Then run:
psql "YOUR_DATABASE_URL" -f scripts/add_budget_fields.sql
```

### Option 3: Manual SQL Commands

Run these commands in your PostgreSQL database:

```sql
-- Add budget column
ALTER TABLE projects ADD COLUMN IF NOT EXISTS budget FLOAT;

-- Add budget_currency column  
ALTER TABLE projects ADD COLUMN IF NOT EXISTS budget_currency VARCHAR(3) NOT NULL DEFAULT 'AUD';

-- Update alembic version
UPDATE alembic_version SET version_num = 'ea804a9513f2' WHERE version_num != 'ea804a9513f2';
```

## 🔍 Verification

After applying the migration, test:

```bash
# Test backend API
curl "https://navimpact-api.onrender.com/api/v1/projects/"

# Test frontend API  
curl "https://navimpact-web.onrender.com/api/projects"
```

Both should return: `{"items":[],"total":0,"page":1,"size":100,"has_next":false,"has_prev":false}`

## 🎯 Expected Result

Once the migration is applied:
- ✅ Projects page loads without errors
- ✅ Project creation works with budget fields
- ✅ All CRUD operations function properly
- ✅ Budget tracking is available

## 📞 Need Help?

If you need assistance applying the migration, let me know and I can provide more detailed steps for your specific setup. 