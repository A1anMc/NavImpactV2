# 🚨 HARD RULES - NO EXCEPTIONS

## **BRANCH MANAGEMENT RULES**

### **RULE 1: BRANCH ISOLATION**
- **MAIN BRANCH** = **NAVIMPACT ONLY**
- **SGE BRANCH** = **SHADOW GOOSE ONLY**
- **NEVER CROSS-CONTAMINATE**

### **RULE 2: DEPLOYMENT CONFIGURATION**
```
NAVIMPACT SERVICE (navimpact-web):
├── Branch: main
├── Build: npm ci --only=production && npm run build
├── Start: npm start
├── Publish Directory: (BLANK)
└── API: https://navimpact-api.onrender.com

SHADOW GOOSE SERVICE (shadow-goose-dashboard):
├── Branch: sge
├── Build: npm ci --only=production && npm run build
├── Start: npx serve@latest out
├── Publish Directory: frontend/out
└── API: https://shadow-goose-api.onrender.com
```

### **RULE 3: CODE CHANGES**
- **Before ANY code change:** Check current branch with `git branch`
- **NavImpact changes:** Must be on `main` branch
- **SGE changes:** Must be on `sge` branch
- **If wrong branch:** Switch first, then make changes

### **RULE 4: PUSH RULES**
```bash
# ✅ CORRECT
git checkout main
# make NavImpact changes
git push origin main

git checkout sge
# make SGE changes
git push origin sge

# ❌ NEVER DO THIS
git checkout main
# make SGE changes
git push origin main  # WRONG!

git checkout sge
# make NavImpact changes
git push origin sge   # WRONG!
```

### **RULE 5: DEPLOYMENT VERIFICATION**
**Before deploying ANY service:**
1. **Check branch:** `git branch`
2. **Check config:** Verify next.config.js matches service
3. **Check API URL:** Verify correct API endpoint
4. **Check branding:** Verify correct theme/colors

### **RULE 6: EMERGENCY PROCEDURES**
**If wrong branch is deployed:**
1. **STOP** - Don't make more changes
2. **IDENTIFY** - Which service is affected
3. **REVERT** - Switch to correct branch
4. **REDEPLOY** - From correct branch
5. **VERIFY** - Service shows correct branding

## **CONFIGURATION CHECKLISTS**

### **NAVIMPACT (main branch) - MUST HAVE:**
- [ ] NO `output: 'export'` in next.config.js
- [ ] API URL: `https://navimpact-api.onrender.com`
- [ ] Team: Alan, Harry, Clooney only
- [ ] Branding: NavImpact (blue/green)
- [ ] NO SGE branding files

### **SGE (sge branch) - MUST HAVE:**
- [ ] `output: 'export'` in next.config.js
- [ ] API URL: `https://shadow-goose-api.onrender.com`
- [ ] Team: Full SGE team (Ursula, Ash, Shamita, Alan, Mish, Kiara)
- [ ] Branding: SGE (black/forest/tawny)
- [ ] SGE branding files present

## **COMMAND REFERENCE**

### **Check Current Branch:**
```bash
git branch
```

### **Switch Branches:**
```bash
git checkout main    # for NavImpact
git checkout sge     # for Shadow Goose
```

### **Verify Config:**
```bash
# Check next.config.js
cat frontend/next.config.js | grep -E "(output|NEXT_PUBLIC_API_URL)"
```

### **Safe Push:**
```bash
# Always verify before pushing
git branch
git status
git push origin [BRANCH_NAME]
```

## **🚨 EMERGENCY CONTACTS**

**If you break these rules:**
1. **STOP immediately**
2. **Don't make more changes**
3. **Switch to correct branch**
4. **Redeploy from correct branch**
5. **Verify service is correct**

## **✅ SUCCESS CRITERIA**

**NavImpact Service:**
- ✅ Shows NavImpact branding
- ✅ Team shows Alan, Harry, Clooney
- ✅ Blue/green color scheme
- ✅ Normal Next.js deployment

**Shadow Goose Service:**
- ✅ Shows SGE branding
- ✅ Team shows full SGE team
- ✅ Black/forest/tawny color scheme
- ✅ Static export deployment

## **⚠️ WARNING SIGNS**

**If you see these, STOP and fix:**
- NavImpact showing SGE branding
- Shadow Goose showing NavImpact branding
- Wrong team members on either service
- Wrong color schemes
- Deployment errors about wrong config

## **🎯 REMEMBER**

**MAIN = NAVIMPACT**
**SGE = SHADOW GOOSE**
**NEVER MIX THEM** 