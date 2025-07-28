# 🎯 **CLIENT DASHBOARD MANAGEMENT GUIDE**

## 📋 **OVERVIEW**

This guide explains how to manage multiple client dashboards within the NavImpact platform, using Shadow Goose Entertainment (SGE) as our first example. This approach allows you to maintain a clean base NavImpact dashboard while creating customised versions for each client organisation.

---

## 🏗️ **CURRENT ARCHITECTURE**

### **Base Platform: NavImpact**
- **Purpose**: Core grant management and impact measurement platform
- **Status**: Production-ready with all core features
- **Location**: Main branch of repository
- **Features**: Grant management, task system, user profiles, team collaboration

### **Client Customisations: SGE Example**
- **Purpose**: Shadow Goose Entertainment's branded dashboard
- **Status**: Stored in git stash for easy switching
- **Features**: SGE branding, custom color palette, typography, team integration

---

## 🔄 **MANAGEMENT APPROACHES**

### **Approach 1: Git Stash Method (RECOMMENDED)**

**Best for**: Quick switching between versions
**Use case**: When you need to rapidly switch between base NavImpact and client versions

#### **Commands:**
```bash
# Switch to SGE branding
git stash pop

# Switch back to NavImpact
git stash push -m "SGE branding changes"

# Check what's stashed
git stash list

# View stash contents
git stash show -p
```

#### **Workflow:**
1. **Development**: Work on clean NavImpact version
2. **Client Work**: Apply client customisations via stash
3. **Presentations**: Use client version for meetings
4. **Switching**: Instant toggle between versions

### **Approach 2: Git Branches Method**

**Best for**: Permanent client versions
**Use case**: When you want to maintain separate branches for each client

#### **Commands:**
```bash
# Create client branch
git checkout -b sge-branding
git add .
git commit -m "SGE branding implementation"

# Switch between versions
git checkout main          # NavImpact version
git checkout sge-branding  # SGE version

# List all branches
git branch -a
```

### **Approach 3: Separate Repositories**

**Best for**: Completely independent client projects
**Use case**: When clients need their own deployment and development cycle

#### **Commands:**
```bash
# Clone for new client
cp -r NavImpactV2 NavImpactV2-ClientName
cd NavImpactV2-ClientName

# Apply client customisations
# Deploy to separate Render instance
```

---

## 🎨 **CLIENT CUSTOMISATION PROCESS**

### **Step 1: Identify Client Requirements**

**Branding Elements:**
- Logo and visual identity
- Color palette (primary, secondary, accent colors)
- Typography (headers, body text, special fonts)
- Tone and aesthetic (minimal, corporate, creative, etc.)

**Functional Requirements:**
- Team structure and roles
- Project types and workflows
- Grant focus areas
- Impact measurement frameworks
- Integration needs (Notion, etc.)

### **Step 2: Create Customisation Plan**

**Example SGE Requirements:**
```markdown
## SGE Branding Requirements

### Colors:
- Black Goose: #181818
- Forest Goose: #425627  
- Tawny Goose: #885C24
- White Goose: #fffefe

### Typography:
- Headers: Carrotflower (cinematic)
- Body: Neue Haas Grotesk Display Pro

### Tone:
- Minimal, cinematic, premium
- Darker surfaces with subtle gradients
- No rainbow gradients - keep muted + elegant
```

### **Step 3: Implement Customisations**

**Files to Modify:**
1. `frontend/tailwind.config.ts` - Add client colors and fonts
2. `frontend/src/app/globals.css` - Import client fonts and styles
3. `frontend/src/app/(dashboard)/page.tsx` - Update dashboard design
4. `frontend/src/components/layout/Sidebar.tsx` - Update navigation branding
5. `frontend/src/app/(dashboard)/team/page.tsx` - Customise team display
6. `frontend/src/app/(dashboard)/profile/page.tsx` - Update profile styling

**Example Implementation:**
```typescript
// tailwind.config.ts
colors: {
  'client-primary': '#181818',
  'client-secondary': '#425627',
  'client-accent': '#885C24',
  'client-white': '#fffefe',
},
fontFamily: {
  'client-header': ['Carrotflower', 'serif'],
  'client-body': ['"Neue Haas Grotesk Display Pro"', 'sans-serif'],
},
```

### **Step 4: Test and Deploy**

**Testing Checklist:**
- [ ] All pages load correctly with new branding
- [ ] Fonts load properly in production
- [ ] Color contrast meets accessibility standards
- [ ] Responsive design works on all devices
- [ ] Performance remains optimal

---

## 📊 **CLIENT ONBOARDING TEMPLATE**

### **Client Information Gathering**

**Branding:**
- [ ] Logo files (SVG preferred)
- [ ] Brand guidelines document
- [ ] Color palette specifications
- [ ] Typography requirements
- [ ] Tone and aesthetic preferences

**Team Structure:**
- [ ] Team member list with roles
- [ ] Organisational hierarchy
- [ ] Project assignments
- [ ] Mentorship relationships
- [ ] Access permissions

**Functional Requirements:**
- [ ] Grant focus areas
- [ ] Project types and workflows
- [ ] Impact measurement frameworks
- [ ] Integration requirements
- [ ] Reporting needs

### **Implementation Checklist**

**Phase 1: Setup (1-2 days)**
- [ ] Create client branch or stash
- [ ] Update Tailwind config with client colors
- [ ] Import client fonts
- [ ] Update global CSS variables

**Phase 2: Design (2-3 days)**
- [ ] Redesign dashboard with client branding
- [ ] Update navigation and sidebar
- [ ] Customise team and profile pages
- [ ] Apply consistent styling across all components

**Phase 3: Content (1-2 days)**
- [ ] Add client team members
- [ ] Set up project assignments
- [ ] Configure grant matching criteria
- [ ] Customise impact measurement frameworks

**Phase 4: Testing (1 day)**
- [ ] Test all functionality with new branding
- [ ] Verify font loading in production
- [ ] Check accessibility compliance
- [ ] Performance testing

**Phase 5: Deployment (1 day)**
- [ ] Deploy to staging environment
- [ ] Client review and feedback
- [ ] Deploy to production
- [ ] Client training and handover

---

## 🛠️ **TECHNICAL IMPLEMENTATION GUIDE**

### **Color Palette Integration**

**1. Update Tailwind Config:**
```typescript
// frontend/tailwind.config.ts
colors: {
  // Client-specific colors
  'client-black': '#181818',
  'client-forest': '#425627',
  'client-tawny': '#885C24',
  'client-white': '#fffefe',
  
  // Keep existing colors for fallback
  primary: { /* existing */ },
  impact: { /* existing */ },
  // ... other existing colors
},
```

**2. Update Global CSS:**
```css
/* frontend/src/app/globals.css */
:root {
  --client-black: #181818;
  --client-forest: #425627;
  --client-tawny: #885C24;
  --client-white: #fffefe;
}

body {
  background: linear-gradient(135deg, var(--client-black) 0%, var(--client-forest) 50%, var(--client-tawny) 100%);
  color: var(--client-white);
}
```

### **Typography Integration**

**1. Font Imports:**
```css
/* frontend/src/app/globals.css */
@import url('https://fonts.googleapis.com/css2?family=ClientFont:wght@300;400;500;600;700&display=swap');
```

**2. Tailwind Config:**
```typescript
fontFamily: {
  'client-header': ['ClientFont', 'serif'],
  'client-body': ['"Client Body Font"', 'sans-serif'],
},
```

### **Component Customisation**

**Dashboard Page:**
```typescript
// frontend/src/app/(dashboard)/page.tsx
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-client-black via-client-forest to-client-tawny">
      {/* Client-branded content */}
    </div>
  );
}
```

**Sidebar Navigation:**
```typescript
// frontend/src/components/layout/Sidebar.tsx
<div className="bg-gradient-to-br from-client-black to-client-forest">
  {/* Client-branded navigation */}
</div>
```

---

## 📈 **CLIENT MANAGEMENT WORKFLOW**

### **For New Client Onboarding:**

1. **Discovery Phase (1 week)**
   - Gather client requirements
   - Review brand guidelines
   - Understand team structure
   - Define functional needs

2. **Design Phase (1 week)**
   - Create customisation plan
   - Implement branding changes
   - Test design consistency
   - Get client feedback

3. **Implementation Phase (1 week)**
   - Add client team members
   - Configure workflows
   - Set up integrations
   - Customise features

4. **Deployment Phase (3-5 days)**
   - Deploy to staging
   - Client testing
   - Deploy to production
   - Training and handover

### **For Existing Client Updates:**

1. **Change Request**
   - Document requested changes
   - Assess impact on existing functionality
   - Create implementation plan

2. **Implementation**
   - Apply changes to client branch/stash
   - Test thoroughly
   - Get client approval

3. **Deployment**
   - Deploy updates
   - Monitor for issues
   - Update documentation

---

## 🔄 **VERSION CONTROL STRATEGY**

### **Recommended Structure:**

```
NavImpactV2/
├── main/                    # Base NavImpact platform
├── branches/
│   ├── sge-branding/       # SGE customisations
│   ├── client-b/           # Client B customisations
│   └── client-c/           # Client C customisations
└── stashes/
    ├── sge-changes/        # Quick SGE changes
    └── client-changes/     # Quick client changes
```

### **Git Commands Reference:**

```bash
# Create new client branch
git checkout -b client-name-branding

# Switch between versions
git checkout main
git checkout client-name-branding

# Stash current changes
git stash push -m "Client changes"

# Apply stashed changes
git stash pop

# List all stashes
git stash list

# View stash contents
git stash show -p stash@{0}
```

---

## 📋 **CLIENT CUSTOMISATION CHECKLIST**

### **Branding Elements:**
- [ ] Logo integration
- [ ] Color palette implementation
- [ ] Typography setup
- [ ] Visual tone and aesthetic
- [ ] Icon and graphic customisation

### **Functional Elements:**
- [ ] Team member setup
- [ ] Role and permission configuration
- [ ] Project assignment
- [ ] Workflow customisation
- [ ] Integration setup

### **Technical Elements:**
- [ ] Font loading verification
- [ ] Color contrast testing
- [ ] Responsive design testing
- [ ] Performance optimisation
- [ ] Accessibility compliance

### **Deployment Elements:**
- [ ] Staging environment setup
- [ ] Production deployment
- [ ] Client training materials
- [ ] Documentation updates
- [ ] Support handover

---

## 🎯 **BEST PRACTICES**

### **Design Principles:**
1. **Consistency**: Maintain consistent branding across all components
2. **Accessibility**: Ensure color contrast meets WCAG standards
3. **Performance**: Keep customisations lightweight
4. **Maintainability**: Use CSS variables for easy updates
5. **Scalability**: Design for future feature additions

### **Development Practices:**
1. **Version Control**: Always use git for change management
2. **Testing**: Test thoroughly before deployment
3. **Documentation**: Keep detailed records of customisations
4. **Backup**: Maintain clean base version
5. **Communication**: Regular client updates and feedback

### **Client Management:**
1. **Requirements Gathering**: Thorough initial discovery
2. **Feedback Loops**: Regular client check-ins
3. **Training**: Comprehensive user training
4. **Support**: Ongoing technical support
5. **Evolution**: Plan for future enhancements

---

## 📞 **SUPPORT AND MAINTENANCE**

### **Ongoing Support:**
- **Technical Issues**: Monitor and resolve quickly
- **Feature Updates**: Regular platform improvements
- **Client Requests**: Handle customisation requests
- **Performance**: Monitor and optimise as needed

### **Maintenance Schedule:**
- **Weekly**: Performance monitoring
- **Monthly**: Security updates
- **Quarterly**: Feature reviews and updates
- **Annually**: Major platform upgrades

---

*This guide provides a comprehensive framework for managing multiple client dashboards while maintaining a clean, scalable base platform. Use this as your reference for all future client customisations.*

**Last Updated**: January 27, 2025  
**Version**: 1.0  
**Status**: Production Ready 