# Audit Logging - Quick Reference Guide

## 🎯 Quick Start

### Access Audit Logs
1. Login as Director/Admin
2. Click "Audit Log" in sidebar
3. View all logged actions

### Filter Logs
- **By User**: Select from dropdown
- **By Action**: created, updated, deleted
- **By Date**: Set from/to dates
- **Export**: Click "Export CSV"

---

## 📊 What Gets Logged

| Action | Logged | Example |
|--------|--------|---------|
| Create Teacher | ✅ | POST teachers #5 |
| Update Teacher | ✅ | PUT teachers #5 |
| Delete Teacher | ✅ | DELETE teachers #5 |
| Toggle Registration | ✅ | POST registration/toggle |
| Create Document | ✅ | POST documents #3 |
| Send Announcement | ✅ | POST announcements #2 |
| Update Profile | ✅ | PUT profile/update |
| Change Password | ✅ | PUT password/update |

---

## 🔍 View Details

**Click "View" on any log entry to see**:
- User who performed action
- Exact timestamp
- IP address
- Resource affected
- Data changes (if applicable)
- HTTP status

---

## 📥 Export Logs

1. Go to Audit Log page
2. Apply filters (optional)
3. Click "Export CSV"
4. File downloads automatically
5. Open in Excel or Google Sheets

**CSV Columns**:
- Date & Time
- User
- Action
- Description
- IP Address

---

## 📈 Statistics

**View audit statistics**:
```
GET /director/audit/statistics
```

**Returns**:
- Total actions logged
- Actions today
- Actions this week
- Breakdown by action type
- Top users

---

## 🔐 Security Features

✅ **Passwords excluded** - Never logged  
✅ **Tokens excluded** - Never logged  
✅ **IP addresses captured** - For tracking  
✅ **User identification** - Full accountability  
✅ **Immutable trail** - Cannot be deleted  
✅ **Role-based access** - Directors only  

---

## 🗑️ Cleanup

**Automatic cleanup**:
- Logs older than 90 days deleted automatically
- Prevents database bloat
- Maintains performance

**Manual cleanup**:
```bash
php artisan tinker
>>> \App\Models\AuditLog::where('created_at', '<', now()->subDays(90))->delete();
```

---

## 🚀 Routes

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/director/audit` | List audit logs |
| GET | `/director/audit/{id}` | View log details |
| GET | `/director/audit/export` | Export as CSV |
| GET | `/director/audit/statistics` | Get statistics |
| POST | `/director/audit/clear-old` | Delete old logs |

---

## 💡 Use Cases

### 1. Track Teacher Changes
```
Filter by: Action = "updated"
See: All teacher profile updates
```

### 2. Monitor Registration Activity
```
Filter by: Action = "created" or "updated"
See: All registration changes
```

### 3. Audit User Activity
```
Filter by: User = "John Director"
See: All actions by specific user
```

### 4. Compliance Report
```
Filter by: Date range
Export: CSV
Use: For compliance audits
```

### 5. Investigate Issues
```
Filter by: Date range + User
View: Details of specific action
See: Data changes made
```

---

## ⚠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| No logs appearing | Check middleware is applied to routes |
| Incomplete data | Verify request includes data in body |
| Export not working | Check file permissions in storage |
| Performance slow | Run cleanup to delete old logs |
| Can't see logs | Verify you have Director/Admin role |

---

## 📋 Compliance

✅ **GDPR**: User data tracked, retention policy, export capability  
✅ **SOC 2**: Complete audit trail, accountability, change tracking  
✅ **FERPA**: Student data protection, access logging  
✅ **Educational Standards**: Administrative accountability  

---

## 🎓 Examples

### Example 1: View Teacher Creation
```
1. Go to Audit Log
2. Filter by Action: "created"
3. Find "POST teachers #5"
4. Click "View"
5. See: User, timestamp, IP, data changes
```

### Example 2: Export Monthly Report
```
1. Go to Audit Log
2. Set From Date: 2026-01-01
3. Set To Date: 2026-01-31
4. Click "Export CSV"
5. Open in Excel
6. Use for compliance report
```

### Example 3: Track User Activity
```
1. Go to Audit Log
2. Filter by User: "John Director"
3. See all actions by this user
4. Click any entry for details
5. Verify all actions are authorized
```

---

## 📞 Support

**For issues**:
1. Check troubleshooting section above
2. Review AUDIT_LOGGING_IMPLEMENTATION.md
3. Contact system administrator

---

## 📚 Related Documentation

- `AUDIT_LOGGING_IMPLEMENTATION.md` - Full implementation guide
- `DIRECTOR_ROLE_VALIDATION_REPORT.md` - Comprehensive validation
- `DIRECTOR_IMPLEMENTATION_SUMMARY.md` - Implementation status

---

**Last Updated**: January 21, 2026  
**Status**: Production Ready  
**Version**: 1.0
