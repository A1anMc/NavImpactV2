# 🔧 Manual Budget Migration Guide

## Problem
- Frontend and backend deploy simultaneously from GitHub
- Backend needs migration before frontend can use budget fields
- This causes deployment conflicts

## Solution: Manual Migration

### Step 1: Wait for Backend Deployment
```bash
# Check if backend is ready
curl https://navimpact-api.onrender.com/health
```

### Step 2: Trigger Migration via API
```bash
# Use the migration endpoint (requires admin token)
curl -X POST "https://navimpact-api.onrender.com/api/v1/migrations/budget-migration" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Step 3: Verify Migration
```bash
# Check if budget fields exist
curl "https://navimpact-api.onrender.com/api/v1/projects/" | jq '.[0] | {budget, budget_currency}'
```

## Alternative: Direct Database Access
If API migration fails, use direct database access:

```sql
-- Add budget column
ALTER TABLE projects ADD COLUMN IF NOT EXISTS budget FLOAT;

-- Add budget_currency column  
ALTER TABLE projects ADD COLUMN IF NOT EXISTS budget_currency VARCHAR(3) NOT NULL DEFAULT 'AUD';
```

## Benefits of Manual Migration
- ✅ No deployment conflicts
- ✅ Can verify each step
- ✅ Rollback if needed
- ✅ Better control over timing 