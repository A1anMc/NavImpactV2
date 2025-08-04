# 🧹 COMPREHENSIVE CLEANUP REPORT

## **📋 EXECUTIVE SUMMARY**

**Current Status**: Mixed NavImpact/SGE codebase with significant duplication and outdated files
**Goal**: Clean separation between NavImpact and SGE while removing unnecessary files
**Risk Level**: HIGH - Need to be very careful not to break either system

---

## **🎯 CRITICAL SEPARATION ISSUES**

### **🚨 CONFLICTING DEPLOYMENT CONFIGS**
- **Current `render.yaml`**: Points to SGE services (`shadow-goose-api`, `shadow-goose-dashboard`)
- **`render.sge.yaml`**: SGE-specific configuration
- **`render.navimpact.yaml`**: NavImpact-specific configuration
- **Issue**: Current deployment is using SGE config but should be NavImpact

### **🔧 IMMEDIATE FIXES NEEDED**

#### **1. Fix Current Deployment Configuration**
```bash
# Current render.yaml is SGE config - needs to be NavImpact
# Should be:
cp render.navimpact.yaml render.yaml
```

#### **2. Separate Database Configurations**
- **SGE**: Uses `NavImpact-dbV3` (shared)
- **NavImpact**: Should use `NavImpact-dbV2` (dedicated)
- **Issue**: Both systems sharing same database

---

## **📁 FILE CLEANUP ANALYSIS**

### **✅ KEEP (Essential Files)**

#### **Core Application Files:**
- `app/` - Main application code
- `frontend/` - Frontend application
- `alembic/` - Database migrations
- `requirements.txt` - Python dependencies
- `package-lock.json` - Node dependencies
- `alembic.ini` - Alembic configuration
- `.envV2` - Environment configuration
- `.gitignore` - Git ignore rules

#### **Essential Documentation:**
- `README.md` - Main documentation
- `README.deploy.md` - Deployment guide
- `README.dev.md` - Development guide
- `LICENSE` - License file

#### **Deployment Configurations:**
- `render.yaml` - Current deployment (needs to be NavImpact)
- `render.navimpact.yaml` - NavImpact deployment
- `render.sge.yaml` - SGE deployment
- `env.production.template` - Production environment template

#### **Real Data Configuration (New):**
- `scripts/configure_real_data.py` - Real data configuration script
- `REAL_DATA_SETUP_PLAN.md` - Real data setup guide
- `QUICK_START_REAL_DATA.md` - Quick start guide
- `REAL_DATA_SUMMARY.md` - Real data summary
- `env.sge.template` - SGE environment template

---

### **🗑️ REMOVE (Outdated/Duplicate Files)**

#### **Duplicate Test Files:**
- `test_ai_bot.py` - Duplicate AI bot test
- `test_ai_grants.py` - Duplicate grant test
- `test_ai_grants_simple.py` - Duplicate simple test
- `test_deployment_fixes.py` - Outdated deployment test
- `render_mock_api.py` - Mock API (replaced by real data)
- `mock_api.py` - Mock API (replaced by real data)

#### **Outdated Documentation:**
- `AI_BOT_STRATEGY.md` - Outdated AI strategy
- `AI_GRANTS_IMPLEMENTATION_SUMMARY.md` - Outdated implementation
- `OKR_GRANT_ACTION_PLAN.md` - Outdated action plan
- `SGE_PRESENTATION_READY.md` - Outdated presentation
- `SGE_PRESENTATION_SLIDES.md` - Outdated slides
- `SGE_PITCH_DECK.md` - Outdated pitch deck
- `SGE_LICENSE_AGREEMENT.md` - Outdated license
- `SGE_PRESENTATION_READY.md` - Duplicate presentation file

#### **Outdated Status Reports:**
- `FINAL_IMPLEMENTATION_STATUS.md` - Outdated status
- `SGE_OPERATIONAL_STATUS.md` - Outdated status
- `SGE_DEPLOYMENT_STATUS.md` - Outdated status
- `SGE_DEPLOYMENT_SETTINGS_CHECK.md` - Outdated check
- `SHADOW_GOOSE_DEPLOYMENT_STATUS.md` - Outdated status
- `SGE_PRESENTATION_READY.md` - Duplicate file

#### **Outdated Integration Docs:**
- `INTEGRATION_API_SETUP.md` - Outdated API setup
- `ANALYTICS_API_SETUP.md` - Outdated analytics setup
- `GRANT_API_SETUP.md` - Outdated grant setup
- `NOTION_SETUP_GUIDE.md` - Outdated Notion guide
- `NOTION_INTEGRATION_IMPLEMENTATION.md` - Outdated implementation
- `NOTION_INTEGRATION_PLAN.md` - Outdated plan

#### **Outdated Deployment Docs:**
- `RENDER_DEPLOYMENT_FIX_STEPS.md` - Outdated fix steps
- `RENDER_DEPLOYMENT_FIX.md` - Outdated fix
- `RENDER_DEPLOYMENT.md` - Outdated deployment
- `DEPLOYMENT_QUICK_REFERENCE.md` - Outdated reference
- `DEPLOYMENT_SAFETY_FRAMEWORK.md` - Outdated framework
- `DEPLOYMENT_BUILD_PLAN.md` - Outdated build plan
- `DEPLOYMENT_CHECKLIST.md` - Outdated checklist

#### **Outdated Reports:**
- `CEO_PROJECT_REPORT.md` - Outdated report
- `CUSTOMER_HUB_VISUALIZATION.md` - Outdated visualization
- `CLIENT_DASHBOARD_MANAGEMENT_GUIDE.md` - Outdated guide
- `SGE_MEDIA_DEPLOYMENT_GUIDE.md` - Outdated guide
- `SGE_MEDIA_MODULE_IMPLEMENTATION.md` - Outdated implementation

#### **Outdated Baseline Docs:**
- `PHASE1_BASELINE.md` - Outdated baseline
- `CLEAN_BASELINE.md` - Outdated baseline
- `BASELINE_STATUS.md` - Outdated status
- `NAVIMPACT_BASELINE.md` - Outdated baseline
- `STABLE_BASELINE_MARKER.md` - Outdated marker

#### **Outdated Scraper Docs:**
- `AUSTRALIAN_GRANTS_SCRAPER_INTEGRATION.md` - Outdated integration
- `AUSTRALIAN_GRANTS_SCRAPER.md` - Outdated scraper

#### **Outdated Test Results:**
- `backend_api_test_results.json` - Outdated test results
- `production_api_test_results.json` - Outdated test results
- `grants_deployment_summary.json` - Outdated summary
- `okr_grant_test_report.json` - Outdated report

#### **Outdated Scripts:**
- `sprint_migration.sql` - Outdated migration
- `simple_sge_dashboard.html` - Outdated dashboard
- `instagram_env_template.txt` - Outdated template
- `frontend_consistency_fixes.md` - Outdated fixes

#### **Outdated Security Docs:**
- `SECURITY_HARDENING.md` - Outdated security
- `NAVIMPACT_BRANDING_REPORT.md` - Outdated branding

---

### **📦 ARCHIVE (Keep for Reference)**

#### **Move to ARCHIVE/outdated/:**
- All files marked for removal above
- Keep for historical reference but out of main directory

---

## **🔧 CRITICAL FIXES NEEDED**

### **1. Fix Current Deployment Configuration**
```bash
# Current render.yaml is SGE config - needs to be NavImpact
cp render.navimpact.yaml render.yaml
```

### **2. Separate Database Configurations**
- **NavImpact**: Use `NavImpact-dbV2` (dedicated)
- **SGE**: Use `NavImpact-dbV3` (shared)

### **3. Update Environment Variables**
- **NavImpact**: Use `navimpact-api.onrender.com`
- **SGE**: Use `shadow-goose-api.onrender.com`

---

## **📋 CLEANUP ACTION PLAN**

### **Phase 1: Critical Fixes (IMMEDIATE)**
1. ✅ Fix deployment configuration
2. ✅ Separate database configurations
3. ✅ Update environment variables

### **Phase 2: File Cleanup (SAFE)**
1. ✅ Move outdated files to ARCHIVE/outdated/
2. ✅ Remove duplicate test files
3. ✅ Clean up outdated documentation

### **Phase 3: Script Cleanup (CAREFUL)**
1. ✅ Review and clean up scripts/
2. ✅ Keep essential scripts
3. ✅ Archive outdated scripts

### **Phase 4: Documentation Cleanup (FINAL)**
1. ✅ Update main README.md
2. ✅ Consolidate deployment guides
3. ✅ Create clear separation docs

---

## **🛡️ SAFETY MEASURES**

### **Before Cleanup:**
- ✅ Create backup branch
- ✅ Test current deployment
- ✅ Verify database connections

### **During Cleanup:**
- ✅ Move files, don't delete
- ✅ Test after each phase
- ✅ Keep deployment configs separate

### **After Cleanup:**
- ✅ Verify both systems work
- ✅ Update documentation
- ✅ Test real data integration

---

## **📊 EXPECTED RESULTS**

### **After Cleanup:**
- ✅ Clean separation between NavImpact and SGE
- ✅ Reduced file count by ~60%
- ✅ Clear deployment configurations
- ✅ Updated documentation
- ✅ Real data integration ready

### **File Count Reduction:**
- **Before**: ~100+ files in root directory
- **After**: ~40 essential files
- **Archived**: ~60 outdated files

---

## **🚀 IMMEDIATE NEXT STEPS**

### **1. Create Backup**
```bash
git checkout -b backup-before-cleanup
git push origin backup-before-cleanup
```

### **2. Fix Deployment Config**
```bash
cp render.navimpact.yaml render.yaml
git add render.yaml
git commit -m "🔧 Fix: Use NavImpact deployment configuration"
```

### **3. Start Cleanup**
```bash
# Create archive directory
mkdir -p ARCHIVE/outdated

# Move outdated files (see list above)
# Test after each move
```

**Ready to proceed with cleanup? The system will be much cleaner and easier to maintain!** 