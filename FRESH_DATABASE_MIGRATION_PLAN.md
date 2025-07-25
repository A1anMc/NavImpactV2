# 🗄️ NavImpact Fresh Database Migration Plan

## 📊 Current Situation

**Problem:** The current database has schema conflicts with the `framework_alignment` column, causing 503 errors on the projects API endpoints.

**Root Cause:** Multiple conflicting Alembic migrations trying to add the same column with different types, causing the API to fail when querying the `framework_alignment` field.

**Solution:** Create a fresh database with clean migrations and migrate all existing data.

## 📁 Data Backup Status

✅ **Data Export Completed:**
- **Export File:** `database_export_20250725_160641.json`
- **Migration Script:** `migration_script_20250725_160641.sql`
- **Total Tables:** 27
- **Total Rows:** 100

### 📊 Data Summary
- **projects:** 35 rows (main data)
- **tasks:** 19 rows
- **time_entries:** 25 rows
- **grants:** 3 rows
- **industry_news:** 15 rows
- **users:** 1 row
- **user:** 1 row
- **alembic_version:** 1 row

## 🚀 Migration Steps

### Phase 1: Prepare Fresh Database
1. **Create New PostgreSQL Database**
   - Create new database on Render or preferred provider
   - Get new DATABASE_URL

2. **Clean Migrations**
   ```bash
   python scripts/setup_fresh_database.py
   # Choose option 1: Clean migrations
   ```

3. **Generate Fresh Migration**
   - Remove all conflicting migration files
   - Create single initial migration with all current models
   - Include `framework_alignment` as JSONB column

### Phase 2: Deploy Fresh Database
1. **Update Environment Variables**
   - Update DATABASE_URL in Render dashboard
   - Point to new database

2. **Deploy Application**
   ```bash
   git add .
   git commit -m "Fresh database setup with clean migrations"
   git push origin main
   ```

3. **Apply Fresh Migration**
   - Deploy will automatically run `alembic upgrade head`
   - Creates clean schema with all models

### Phase 3: Import Data
1. **Import Existing Data**
   ```bash
   python scripts/setup_fresh_database.py
   # Choose option 3: Import data
   # Provide new DATABASE_URL
   ```

2. **Verify Data Import**
   ```bash
   python scripts/setup_fresh_database.py
   # Choose option 4: Verify setup
   ```

### Phase 4: Test & Validate
1. **Test API Endpoints**
   ```bash
   python scripts/test_simple_api.py
   python scripts/test_framework_alignment.py
   ```

2. **Test Framework Alignment**
   - Create project with `framework_alignment` data
   - Test filtering by framework
   - Verify portfolio summary

## 🔧 Technical Details

### Current Database Issues
- **Conflicting Migrations:** Multiple files trying to add `framework_alignment`
- **Type Mismatch:** Some migrations use `JSON`, others use `JSONB`
- **Schema Drift:** Database state doesn't match Alembic expectations

### Fresh Database Benefits
- **Clean Schema:** Single migration with all models
- **No Conflicts:** No migration history conflicts
- **Proper Types:** `framework_alignment` as JSONB from start
- **Future-Proof:** Clean migration history for future changes

### Migration Scripts Available
1. **`scripts/export_data_for_migration.py`** - Export current data
2. **`scripts/setup_fresh_database.py`** - Setup fresh database
3. **`scripts/test_simple_api.py`** - Test API functionality
4. **`scripts/test_framework_alignment.py`** - Test framework features

## 📋 Pre-Migration Checklist

- [ ] Data export completed ✅
- [ ] Migration script generated ✅
- [ ] New database created
- [ ] New DATABASE_URL obtained
- [ ] Environment variables updated
- [ ] Fresh migrations prepared
- [ ] Application deployed
- [ ] Data imported
- [ ] API tested
- [ ] Framework alignment tested

## 🚨 Rollback Plan

If issues occur during migration:

1. **Restore Original Database**
   - Revert DATABASE_URL to original
   - Redeploy with original configuration

2. **Restore Data**
   - Use migration script to restore data
   - Verify data integrity

3. **Alternative Approach**
   - Fix current database manually
   - Resolve migration conflicts
   - Sync Alembic state

## 📞 Next Steps

1. **Create New Database** on Render
2. **Get New DATABASE_URL**
3. **Run Fresh Database Setup**
4. **Deploy and Test**

## 📁 Generated Files

- `database_export_20250725_160641.json` - Complete data backup
- `migration_script_20250725_160641.sql` - SQL import script
- `scripts/setup_fresh_database.py` - Setup automation
- `FRESH_DATABASE_MIGRATION_PLAN.md` - This plan

---

**Status:** Ready for migration
**Last Updated:** 2025-07-25 16:06:41
**Data Integrity:** ✅ Verified 