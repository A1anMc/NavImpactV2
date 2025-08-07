# 🤖 **MOVEMBER AI AGENT PROMPT**

## 🎯 **PROJECT OVERVIEW**

You are an AI coding assistant tasked with building a comprehensive grant management and impact measurement system for **Movember Foundation**. This system will be similar to the NavImpact V2 platform but tailored specifically for Movember's mission of men's health advocacy and funding.

### **Movember Context:**
- **Mission**: Men's health advocacy, prostate cancer, testicular cancer, mental health, suicide prevention
- **Focus**: Grant funding for men's health research, awareness campaigns, and community programs
- **Target Users**: Researchers, healthcare professionals, community organizations, mental health advocates
- **Geographic Scope**: Global (primary focus on Australia, UK, Canada, US)

---

## 🏗️ **SYSTEM ARCHITECTURE REQUIREMENTS**

### **Technology Stack (Same as NavImpact V2):**
- **Backend**: FastAPI (Python 3.11.9) with PostgreSQL
- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Database**: PostgreSQL with Alembic migrations
- **Deployment**: Render.com with separate staging/production environments
- **Authentication**: JWT-based authentication system
- **API Documentation**: Auto-generated with FastAPI

### **Core Components:**
1. **Grant Management System**
2. **Impact Measurement Dashboard**
3. **Research Project Tracking**
4. **Community Program Management**
5. **Health Campaign Coordination**
6. **Analytics and Reporting**

---

## 📋 **CRITICAL REQUIREMENTS & LEARNINGS**

### **🚨 CONFIGURATION PREVENTION SYSTEM (MANDATORY)**

**CRITICAL RULE**: Never mix URLs between different projects. Implement this prevention system immediately:

#### **1. URL Validation Script**
```bash
# Create: scripts/validate_configuration.sh
# Must check for forbidden URLs and validate correct URLs
# Must block deployment if wrong URLs found
```

#### **2. Pre-Commit Validation**
```bash
# Create: scripts/pre-commit-validation.sh
# Must block commits with wrong URLs
# Must validate branch-specific configurations
```

#### **3. Prevention Rules Document**
- Create comprehensive prevention rules
- Document correct URLs for each environment
- Include emergency procedures for fixing mistakes

### **✅ CORRECT URLS FOR MOVEMBER:**
- **Production API**: `https://movember-api.onrender.com`
- **Production Web**: `https://movember-web.onrender.com`
- **Staging API**: `https://movember-api-staging.onrender.com`
- **Staging Web**: `https://movember-web-staging.onrender.com`

### **❌ FORBIDDEN URLS (Never Use):**
- `https://navimpact-api.onrender.com`
- `https://shadow-goose-api.onrender.com`
- Any other project URLs

---

## 🎨 **MOVEMBER BRANDING & DESIGN**

### **Color Palette:**
- **Primary**: Movember Blue (#0066CC)
- **Secondary**: Movember Orange (#FF6B35)
- **Accent**: Movember Green (#00A651)
- **Neutral**: Charcoal (#2C3E50)
- **Background**: Light Gray (#F8F9FA)

### **Typography:**
- **Primary**: Inter (clean, modern, accessible)
- **Secondary**: Roboto (for data displays)
- **Headings**: Bold weight with proper hierarchy

### **Design Elements:**
- **Mustache Icons**: Throughout the interface
- **Health Icons**: Medical, research, community symbols
- **Progress Indicators**: Health-focused metrics
- **Impact Visualizations**: Health outcome charts

---

## 📊 **CORE FEATURES TO IMPLEMENT**

### **1. Grant Management System**
```typescript
// Required Models:
interface Grant {
  id: string;
  title: string;
  description: string;
  category: 'prostate_cancer' | 'testicular_cancer' | 'mental_health' | 'suicide_prevention' | 'general_health';
  funding_amount: number;
  max_amount: number;
  deadline: Date;
  eligibility_criteria: string[];
  application_requirements: string[];
  impact_metrics: string[];
  status: 'open' | 'closing_soon' | 'closed' | 'awarded';
  health_focus: string[];
  geographic_scope: string[];
  org_type: string[];
}
```

### **2. Research Project Tracking**
```typescript
interface ResearchProject {
  id: string;
  title: string;
  principal_investigator: string;
  institution: string;
  health_focus: string[];
  methodology: string;
  expected_outcomes: string[];
  timeline_months: number;
  budget: number;
  status: 'proposed' | 'approved' | 'in_progress' | 'completed';
  impact_metrics: ImpactMetric[];
}
```

### **3. Impact Measurement Dashboard**
```typescript
interface ImpactMetric {
  id: string;
  name: string;
  description: string;
  category: 'health_outcomes' | 'awareness' | 'community_engagement' | 'research_advancement';
  current_value: number;
  target_value: number;
  unit: string;
  trend: 'improving' | 'stable' | 'declining';
  last_updated: Date;
}
```

### **4. Community Program Management**
```typescript
interface CommunityProgram {
  id: string;
  name: string;
  description: string;
  location: string;
  target_audience: string[];
  health_focus: string[];
  participants_count: number;
  duration_months: number;
  outcomes: string[];
  status: 'planning' | 'active' | 'completed' | 'evaluating';
}
```

---

## 🔧 **TECHNICAL IMPLEMENTATION REQUIREMENTS**

### **Backend API Endpoints (FastAPI):**
```python
# Required endpoints:
/api/v1/grants/           # Grant management
/api/v1/research/         # Research projects
/api/v1/impact/           # Impact metrics
/api/v1/programs/         # Community programs
/api/v1/campaigns/        # Health campaigns
/api/v1/analytics/        # Analytics and reporting
/api/v1/users/            # User management
/api/v1/health/           # Health checks
```

### **Frontend Pages (Next.js):**
```typescript
// Required pages:
/grants/                  # Grant listings and applications
/research/                # Research project tracking
/impact/                  # Impact measurement dashboard
/programs/                # Community program management
/campaigns/               # Health campaign coordination
/analytics/               # Analytics and reporting
/team/                    # Team management
/settings/                # System settings
```

### **Database Schema:**
```sql
-- Core tables:
grants                    # Grant information
research_projects         # Research project data
impact_metrics           # Impact measurement data
community_programs       # Community program data
health_campaigns         # Campaign information
users                    # User management
organizations            # Organization data
applications             # Grant applications
```

---

## 🚀 **DEPLOYMENT REQUIREMENTS**

### **Render Configuration:**
```yaml
# render.yaml
services:
  - type: web
    name: movember-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn app.main:app --bind 0.0.0.0:$PORT --workers 2
    envVars:
      - key: DATABASE_URL
        value: [your-movember-database-url]
      - key: SECRET_KEY
        generateValue: true

  - type: web
    name: movember-web
    env: node
    buildCommand: cd frontend && npm ci && npm run build
    startCommand: cd frontend && npx serve@latest out -p $PORT
    envVars:
      - key: NEXT_PUBLIC_API_URL
        value: https://movember-api.onrender.com
```

### **Environment Variables:**
```bash
# Required environment variables:
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]
SECRET_KEY=[your-secret-key]
JWT_SECRET_KEY=[your-jwt-secret]
NEXT_PUBLIC_API_URL=https://movember-api.onrender.com
CORS_ORIGINS=https://movember-web.onrender.com
ALLOWED_HOSTS=movember-api.onrender.com,localhost,127.0.0.1
```

---

## 📈 **MOVEMBER-SPECIFIC FEATURES**

### **1. Health Focus Categories:**
- Prostate Cancer Research
- Testicular Cancer Awareness
- Mental Health Support
- Suicide Prevention
- General Men's Health
- Community Engagement

### **2. Impact Metrics:**
- Lives Saved
- Awareness Campaign Reach
- Research Publications
- Community Program Participants
- Health Screening Uptake
- Mental Health Support Access

### **3. Geographic Targeting:**
- Australia
- United Kingdom
- Canada
- United States
- Global Programs

### **4. User Roles:**
- Researchers
- Healthcare Professionals
- Community Organizers
- Campaign Managers
- Impact Analysts
- Administrators

---

## 🛡️ **QUALITY ASSURANCE REQUIREMENTS**

### **1. Testing Strategy:**
```python
# Required test coverage:
- Unit tests for all models and services
- Integration tests for API endpoints
- Frontend component tests
- End-to-end user flow tests
- Configuration validation tests
```

### **2. Code Quality:**
```bash
# Required tools:
- Black (Python formatting)
- isort (Python import sorting)
- flake8 (Python linting)
- ESLint (JavaScript linting)
- Prettier (JavaScript formatting)
- TypeScript strict mode
```

### **3. Security Requirements:**
- JWT authentication
- Input validation
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting

---

## 📋 **IMPLEMENTATION CHECKLIST**

### **Phase 1: Foundation (Week 1)**
- [ ] Set up project structure
- [ ] Configure database and migrations
- [ ] Implement basic API endpoints
- [ ] Create frontend foundation
- [ ] Set up deployment configuration
- [ ] Implement configuration prevention system

### **Phase 2: Core Features (Week 2-3)**
- [ ] Grant management system
- [ ] Research project tracking
- [ ] Impact measurement dashboard
- [ ] User authentication
- [ ] Basic frontend pages

### **Phase 3: Advanced Features (Week 4)**
- [ ] Community program management
- [ ] Health campaign coordination
- [ ] Analytics and reporting
- [ ] Advanced impact metrics
- [ ] Team collaboration features

### **Phase 4: Testing & Deployment (Week 5)**
- [ ] Comprehensive testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Staging deployment
- [ ] Production deployment

---

## 🎯 **SUCCESS CRITERIA**

### **Technical Success:**
- ✅ All API endpoints return 200 OK
- ✅ Frontend loads without errors
- ✅ Database migrations complete successfully
- ✅ Real data displays (not fallback)
- ✅ No configuration URL mistakes

### **Functional Success:**
- ✅ Grant applications work end-to-end
- ✅ Research projects can be tracked
- ✅ Impact metrics are measurable
- ✅ Community programs are manageable
- ✅ Analytics provide meaningful insights

### **User Experience Success:**
- ✅ Intuitive navigation
- ✅ Responsive design
- ✅ Fast loading times
- ✅ Accessible interface
- ✅ Movember branding consistent

---

## 🚨 **CRITICAL REMINDERS**

### **1. Configuration Prevention:**
- **ALWAYS** run validation scripts before deployment
- **NEVER** mix URLs between projects
- **ALWAYS** test staging before production
- **ALWAYS** validate configuration changes

### **2. Code Quality:**
- **ALWAYS** write tests for new features
- **ALWAYS** follow coding standards
- **ALWAYS** validate user input
- **ALWAYS** handle errors gracefully

### **3. Deployment Safety:**
- **ALWAYS** test in staging first
- **ALWAYS** backup before major changes
- **ALWAYS** monitor deployment logs
- **ALWAYS** verify functionality after deployment

---

## 📞 **SUPPORT & DOCUMENTATION**

### **Required Documentation:**
- Architecture documentation
- API documentation
- User guides
- Deployment guides
- Configuration guides
- Troubleshooting guides

### **Monitoring & Maintenance:**
- Health check endpoints
- Error logging
- Performance monitoring
- Regular backups
- Security updates

---

**🎯 GOAL: Build a robust, scalable, and user-friendly grant management system specifically tailored for Movember's men's health mission, incorporating all the best practices and lessons learned from the NavImpact V2 project.**

**Remember: This system will directly impact men's health outcomes globally, so quality and reliability are paramount.** 