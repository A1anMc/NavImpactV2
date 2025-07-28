# Branch Setup Summary

## 🎯 **CLEAN BRANCH SEPARATION**

### **MAIN BRANCH** → **NavImpact Service**
- **Purpose:** NavImpact platform (original, clean)
- **Deployment:** Normal Next.js (no static export)
- **API URL:** `https://navimpact-api.onrender.com`
- **Team:** Alan McCarthy, Harry Dog, Clooney Cat
- **Branding:** NavImpact (blue/green theme)
- **Features:** Core NavImpact features only

### **SGE BRANCH** → **Shadow Goose Service**
- **Purpose:** Shadow Goose Entertainment (SGE custom)
- **Deployment:** Static export (`output: 'export'`)
- **API URL:** `https://shadow-goose-api.onrender.com`
- **Team:** Full SGE team (Ursula, Ash, Shamita, Alan, Mish, Kiara)
- **Branding:** SGE (black/forest/tawny theme)
- **Features:** SGE branding + team collaboration + profile pages

## 🚀 **DEPLOYMENT CONFIGURATION**

### **NavImpact Service** (`navimpact-web`)
- **Branch:** `main`
- **Build Command:** `npm ci --only=production && npm run build`
- **Start Command:** `npm start`
- **Publish Directory:** (leave blank)

### **Shadow Goose Service** (`shadow-goose-dashboard`)
- **Branch:** `sge`
- **Build Command:** `npm ci --only=production && npm run build`
- **Start Command:** `npx serve@latest out`
- **Publish Directory:** `frontend/out`

## ✅ **VERIFICATION CHECKLIST**

### **NavImpact (main branch):**
- [ ] No `output: 'export'` in next.config.js
- [ ] API URL points to navimpact-api.onrender.com
- [ ] Team page shows Alan, Harry, Clooney only
- [ ] NavImpact branding (blue/green)

### **SGE (sge branch):**
- [ ] Has `output: 'export'` in next.config.js
- [ ] API URL points to shadow-goose-api.onrender.com
- [ ] Team page shows full SGE team
- [ ] SGE branding (black/forest/tawny)
- [ ] Has collaboration and profile pages

## 🔧 **COMMANDS TO SWITCH BRANCHES**

```bash
# Switch to NavImpact (main)
git checkout main

# Switch to SGE
git checkout sge

# Push changes to correct branch
git push origin main    # for NavImpact
git push origin sge     # for Shadow Goose
```

## ⚠️ **IMPORTANT RULES**

1. **NEVER push SGE changes to main branch**
2. **NEVER push NavImpact changes to sge branch**
3. **Always check which branch you're on before making changes**
4. **Use `git status` to verify current branch**
5. **Deploy from the correct branch for each service**

## 🎯 **CURRENT STATUS**

- ✅ **Main branch:** Clean NavImpact (ready for navimpact-web)
- ✅ **SGE branch:** Complete SGE features (ready for shadow-goose-dashboard)
- ✅ **No more confusion:** Each service has its dedicated branch 