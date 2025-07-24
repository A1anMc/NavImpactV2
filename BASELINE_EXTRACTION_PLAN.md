# 🔧 Baseline Extraction & Client Duplication Plan

**Date**: July 24, 2025  
**Status**: 🚀 READY TO EXECUTE  
**Goal**: Create duplicatable baseline for multi-client business  

---

## 🎯 **Immediate Action Plan**

### **Step 1: Create Baseline Repository (Today)**

#### **1.1 Create New Baseline Repository**
```bash
# Create new baseline repository
git clone https://github.com/alanmccarthy/NavImpactV2.git NavImpactV2-Baseline
cd NavImpactV2-Baseline

# Create baseline branch
git checkout -b baseline-universal
```

#### **1.2 Remove Client-Specific Content**
```bash
# Remove NavImpact-specific branding
rm -rf ARCHIVE/
rm -f NAVIMPACT_*.md
rm -f AUSTRALIAN_GRANTS_SCRAPER*.md
rm -f BASELINE_*.md
rm -f DEPLOYMENT_*.md
rm -f PHASE*.md
rm -f SGE_*.md

# Keep only universal components
# - Core database models
# - Universal API endpoints
# - Generic UI components
# - Deployment configuration
```

#### **1.3 Create Universal Configuration**
```bash
# Create universal config structure
mkdir -p config/{branding,features,integrations}
mkdir -p docs/{setup,client-onboarding,api}
```

### **Step 2: Implement Configuration System (Week 1)**

#### **2.1 Environment-Based Configuration**
```typescript
// frontend/src/lib/config.ts
export const config = {
  company: {
    name: process.env.NEXT_PUBLIC_COMPANY_NAME || 'ProjectManager',
    logo: process.env.NEXT_PUBLIC_COMPANY_LOGO || '/logo.svg',
    primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#3B82F6',
    secondaryColor: process.env.NEXT_PUBLIC_SECONDARY_COLOR || '#1F2937',
    accentColor: process.env.NEXT_PUBLIC_ACCENT_COLOR || '#10B981',
    domain: process.env.NEXT_PUBLIC_DOMAIN || 'projectmanager.com',
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@projectmanager.com'
  },
  features: {
    grants: process.env.NEXT_PUBLIC_ENABLE_GRANTS === 'true',
    news: process.env.NEXT_PUBLIC_ENABLE_NEWS === 'true',
    impact: process.env.NEXT_PUBLIC_ENABLE_IMPACT === 'true',
    notion: process.env.NEXT_PUBLIC_ENABLE_NOTION === 'true',
    slack: process.env.NEXT_PUBLIC_ENABLE_SLACK === 'true',
    quickbooks: process.env.NEXT_PUBLIC_ENABLE_QUICKBOOKS === 'true',
    advancedReporting: process.env.NEXT_PUBLIC_ENABLE_ADVANCED_REPORTING === 'true',
    aiInsights: process.env.NEXT_PUBLIC_ENABLE_AI_INSIGHTS === 'true'
  },
  industry: process.env.NEXT_PUBLIC_INDUSTRY || 'general',
  tier: process.env.NEXT_PUBLIC_TIER || 'basic'
}
```

#### **2.2 Dynamic Component Loading**
```typescript
// frontend/src/components/features/FeatureLoader.tsx
import { config } from '@/lib/config'

interface FeatureLoaderProps {
  feature: keyof typeof config.features
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const FeatureLoader = ({ feature, children, fallback }: FeatureLoaderProps) => {
  if (!config.features[feature]) {
    return fallback || (
      <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500 text-center">
          {feature} feature is not available in your current plan.
        </p>
      </div>
    )
  }
  return <>{children}</>
}
```

#### **2.3 Branding System**
```typescript
// frontend/src/lib/branding.ts
import { config } from './config'

export const branding = {
  colors: {
    primary: config.company.primaryColor,
    secondary: config.company.secondaryColor,
    accent: config.company.accentColor,
    background: '#FFFFFF',
    surface: '#F9FAFB',
    text: '#111827',
    textSecondary: '#6B7280'
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  }
}
```

### **Step 3: Create Client Templates (Week 1-2)**

#### **3.1 Industry Templates**
```bash
# Create industry-specific templates
mkdir -p templates/{media-creative,technology,consulting,education,nonprofit}

# Media & Creative Template
cat > templates/media-creative/config.json << EOF
{
  "industry": "media-creative",
  "features": {
    "grants": true,
    "news": true,
    "impact": true,
    "notion": true,
    "advancedReporting": true
  },
  "branding": {
    "primaryColor": "#FF6B6B",
    "secondaryColor": "#4ECDC4",
    "accentColor": "#45B7D1"
  },
  "templates": [
    "film-production",
    "festival-submission",
    "creative-campaign",
    "event-management"
  ]
}
EOF

# Technology Template
cat > templates/technology/config.json << EOF
{
  "industry": "technology",
  "features": {
    "grants": false,
    "news": true,
    "impact": true,
    "slack": true,
    "advancedReporting": true,
    "aiInsights": true
  },
  "branding": {
    "primaryColor": "#3B82F6",
    "secondaryColor": "#1F2937",
    "accentColor": "#10B981"
  },
  "templates": [
    "software-development",
    "product-management",
    "devops-pipeline",
    "agile-sprint"
  ]
}
EOF
```

#### **3.2 Client Onboarding Script**
```bash
#!/bin/bash
# scripts/create-client.sh

CLIENT_NAME=$1
INDUSTRY=$2
DOMAIN=$3

if [ -z "$CLIENT_NAME" ] || [ -z "$INDUSTRY" ] || [ -z "$DOMAIN" ]; then
    echo "Usage: ./create-client.sh <client-name> <industry> <domain>"
    echo "Example: ./create-client.sh CreativeStudio media-creative creativestudio.com"
    exit 1
fi

# Create client directory
mkdir -p clients/$CLIENT_NAME
cd clients/$CLIENT_NAME

# Copy baseline
cp -r ../../NavImpactV2-Baseline/* .

# Apply industry template
cp ../../templates/$INDUSTRY/config.json ./config/client.json

# Update environment variables
cat > .env.client << EOF
NEXT_PUBLIC_COMPANY_NAME=$CLIENT_NAME
NEXT_PUBLIC_DOMAIN=$DOMAIN
NEXT_PUBLIC_INDUSTRY=$INDUSTRY
$(cat ../../templates/$INDUSTRY/config.json | jq -r '.features | to_entries[] | "NEXT_PUBLIC_ENABLE_\(.key | ascii_upcase)=\(.value | tostring)"')
$(cat ../../templates/$INDUSTRY/config.json | jq -r '.branding | to_entries[] | "NEXT_PUBLIC_\(.key | ascii_upcase | gsub("color"; "COLOR"))=\(.value)"')
EOF

# Update render.yaml
sed -i "s/navimpact/$CLIENT_NAME/g" render.yaml
sed -i "s/navimpact-web/$CLIENT_NAME-web/g" render.yaml
sed -i "s/navimpact-api/$CLIENT_NAME-api/g" render.yaml

echo "✅ Client $CLIENT_NAME created successfully!"
echo "📁 Location: clients/$CLIENT_NAME"
echo "🌐 Domain: $DOMAIN"
echo "🏭 Industry: $INDUSTRY"
```

### **Step 4: Automated Deployment (Week 2)**

#### **4.1 GitHub Actions Workflow**
```yaml
# .github/workflows/client-deploy.yml
name: Deploy Client Instance

on:
  push:
    branches: [main]
    paths: ['clients/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
          
      - name: Deploy to Render
        env:
          RENDER_TOKEN: ${{ secrets.RENDER_TOKEN }}
        run: |
          # Deploy backend
          curl -X POST "https://api.render.com/v1/services/${{ env.BACKEND_SERVICE_ID }}/deploys" \
            -H "Authorization: Bearer $RENDER_TOKEN" \
            -H "Content-Type: application/json"
          
          # Deploy frontend
          curl -X POST "https://api.render.com/v1/services/${{ env.FRONTEND_SERVICE_ID }}/deploys" \
            -H "Authorization: Bearer $RENDER_TOKEN" \
            -H "Content-Type: application/json"
```

#### **4.2 Client Management Dashboard**
```typescript
// frontend/src/app/admin/clients/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Client {
  id: string
  name: string
  domain: string
  industry: string
  tier: string
  status: 'active' | 'inactive' | 'pending'
  createdAt: string
  lastLogin: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Client Management</h1>
        <Button>Add New Client</Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clients.map(client => (
          <Card key={client.id}>
            <CardHeader>
              <CardTitle className="flex justify-between">
                {client.name}
                <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                  {client.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">Domain: {client.domain}</p>
              <p className="text-sm text-gray-600 mb-2">Industry: {client.industry}</p>
              <p className="text-sm text-gray-600 mb-4">Tier: {client.tier}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">View</Button>
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm" variant="outline">Deploy</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

---

## 🎯 **Pilot Client Selection**

### **Recommended First Clients**

#### **1. Creative Studio (Media & Creative)**
- **Industry**: Film production, creative campaigns
- **Features**: Grants, news, impact, Notion integration
- **Customisation**: Film production templates, festival submission tracking
- **Timeline**: 2 weeks setup

#### **2. Tech Startup (Technology)**
- **Industry**: Software development, product management
- **Features**: News, impact, Slack integration, AI insights
- **Customisation**: Agile templates, tech stack tracking
- **Timeline**: 2 weeks setup

#### **3. Consulting Firm (Consulting)**
- **Industry**: Business consulting, client management
- **Features**: Impact, QuickBooks integration, advanced reporting
- **Customisation**: Client management templates, proposal tracking
- **Timeline**: 3 weeks setup

---

## 📊 **Success Metrics**

### **Week 1 Goals**
- [ ] Baseline repository created and documented
- [ ] Configuration system implemented
- [ ] First industry template created
- [ ] Client onboarding script working

### **Week 2 Goals**
- [ ] Automated deployment pipeline working
- [ ] First pilot client deployed
- [ ] Client management dashboard functional
- [ ] Documentation complete

### **Month 1 Goals**
- [ ] 3 pilot clients successfully deployed
- [ ] Client onboarding process streamlined
- [ ] Revenue generation started
- [ ] Feedback collected and improvements made

---

## 🚀 **Ready to Execute**

**Status**: ✅ **PLAN READY - START IMMEDIATELY**

### **Next Actions**
1. **Create baseline repository** (Today)
2. **Implement configuration system** (This week)
3. **Choose first pilot client** (This week)
4. **Deploy first client instance** (Next week)

### **Expected Outcomes**
- **Week 1**: Universal baseline ready
- **Week 2**: First client deployed
- **Month 1**: 3 clients generating revenue
- **Month 3**: 10+ clients, $3K+ MRR

**Ready to start building your scalable business!** 🚀 