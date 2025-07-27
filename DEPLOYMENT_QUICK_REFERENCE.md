# 🚀 NavImpact Deployment Quick Reference

**Purpose**: Quick guide for safe deployments  
**Last Updated**: July 27, 2025

---

## 🎯 **Quick Commands**

### **Complete Safe Deployment**
```bash
# Production deployment with 30-minute monitoring
./scripts/safe_deploy.sh --production --monitor-duration=30

# Staging deployment
./scripts/safe_deploy.sh --staging
```

### **Pre-Deployment Checks Only**
```bash
./scripts/pre_deployment_check.sh
```

### **Post-Deployment Monitoring Only**
```bash
# Monitor for 30 minutes (default)
./scripts/post_deployment_monitor.sh

# Monitor for custom duration
./scripts/post_deployment_monitor.sh 60  # 60 minutes
```

---

## 📋 **Pre-Deployment Checklist**

### **Essential Checks**
- [ ] Run `./scripts/pre_deployment_check.sh`
- [ ] All tests pass locally
- [ ] No uncommitted changes
- [ ] Database migrations tested
- [ ] Environment variables configured

### **Manual Verification**
- [ ] Test core features locally
- [ ] Check API endpoints
- [ ] Verify frontend builds
- [ ] Review security audit results

---

## 🚨 **Emergency Procedures**

### **Immediate Rollback**
```bash
# If deployment fails, rollback to backup branch
git checkout backup/YYYYMMDD_HHMMSS
git push origin backup/YYYYMMDD_HHMMSS:main --force
```

### **Database Rollback**
```bash
# Rollback last migration
alembic downgrade -1
```

### **Stop Monitoring**
```bash
# Find monitoring process
ps aux | grep post_deployment_monitor

# Kill monitoring process
kill <PID>
```

---

## 📊 **Success Criteria**

### **Deployment Success**
- ✅ Health checks pass (3/10 minimum)
- ✅ API tests pass
- ✅ Frontend tests pass
- ✅ No critical errors in logs
- ✅ Performance within thresholds

### **Performance Thresholds**
- **API Response**: < 2 seconds
- **Frontend Load**: < 5 seconds
- **Error Rate**: < 1%
- **Uptime**: > 99.9%

---

## 🔍 **Troubleshooting**

### **Common Issues**

**Deployment Stuck**
```bash
# Check Render deployment status
curl -I https://navimpact-web.onrender.com

# Check API health
curl https://navimpact-api.onrender.com/health
```

**Health Checks Failing**
```bash
# Check detailed logs
tail -f deployment_YYYYMMDD_HHMMSS.log

# Check monitoring logs
tail -f monitoring_YYYYMMDD_HHMMSS.log
```

**Database Issues**
```bash
# Test database connection
python scripts/check_database_connection.py

# Check migration status
alembic current
```

---

## 📞 **Emergency Contacts**

### **Primary Contacts**
- **Lead Developer**: [Contact Info]
- **DevOps Engineer**: [Contact Info]
- **System Administrator**: [Contact Info]

### **Escalation Path**
1. **Level 1**: Developer on-call
2. **Level 2**: Lead developer
3. **Level 3**: System administrator
4. **Level 4**: CTO/Technical Director

---

## 📈 **Monitoring Dashboard**

### **Key URLs**
- **Production Frontend**: https://navimpact-web.onrender.com
- **Production API**: https://navimpact-api.onrender.com
- **API Health**: https://navimpact-api.onrender.com/health

### **Key Metrics**
- **Error Rate**: < 1%
- **Response Time**: < 500ms
- **Uptime**: > 99.9%
- **Active Users**: Track daily

---

## 🔄 **Deployment Workflow**

### **Standard Process**
1. **Pre-deployment checks** → `./scripts/pre_deployment_check.sh`
2. **Safe deployment** → `./scripts/safe_deploy.sh --production`
3. **Post-deployment monitoring** → Automatic (30 minutes)
4. **Verification** → Manual testing + automated tests

### **Quick Deployment** (for minor changes)
```bash
# Quick check and deploy
./scripts/pre_deployment_check.sh && git push origin main
```

### **Full Deployment** (for major changes)
```bash
# Complete safety workflow
./scripts/safe_deploy.sh --production --monitor-duration=60
```

---

## 📝 **Documentation**

### **Log Files**
- **Deployment Log**: `deployment_YYYYMMDD_HHMMSS.log`
- **Monitoring Log**: `monitoring_YYYYMMDD_HHMMSS.log`
- **Test Results**: `test_YYYYMMDD_HHMMSS.log`

### **Backup Branches**
- **Format**: `backup/YYYYMMDD_HHMMSS`
- **Purpose**: Rollback point for each deployment
- **Cleanup**: Keep for 7 days, then delete

---

## 🎯 **Best Practices**

### **Before Deployment**
- ✅ Test all changes locally
- ✅ Run full test suite
- ✅ Check for security vulnerabilities
- ✅ Review code changes
- ✅ Update documentation

### **During Deployment**
- ✅ Monitor deployment progress
- ✅ Watch for error messages
- ✅ Verify health checks
- ✅ Test critical functionality

### **After Deployment**
- ✅ Monitor system for 24 hours
- ✅ Check user feedback
- ✅ Review performance metrics
- ✅ Update deployment logs
- ✅ Document lessons learned

---

**Remember**: When in doubt, use the full safe deployment workflow. It's better to be thorough than to fix issues later! 