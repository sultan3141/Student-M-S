# Quick Reference - Username Login System

## 🚀 Quick Start (3 Steps)

### 1. Setup Database
```
Double-click: SETUP-DATABASE.bat
```

### 2. Start Servers
```
Double-click: CLEAN-AND-START.bat
```

### 3. Login
```
URL: http://localhost:8000/login
Username: admin
Password: password
```

---

## 👥 Test Users

| Username | Password | Role | Theme |
|----------|----------|------|-------|
| `admin` | `password` | Admin | 🟠 Gold |
| `registrar_jane` | `password` | Registrar | 🟣 Indigo |
| `teacher_john` | `password` | Teacher | 🔵 Blue |
| `student_alice` | `password` | Student | 🟢 Green |
| `parent_mary` | `password` | Parent | 🟣 Purple |

---

## 🎨 Username Patterns

- `admin*` → Admin Dashboard (Gold)
- `teacher_*` or `t_*` → Teacher Dashboard (Blue)
- `student_*` or `s_*` → Student Dashboard (Green)
- `parent_*` or `p_*` → Parent Dashboard (Purple)
- `registrar_*` or `r_*` → Registrar Dashboard (Indigo)

---

## 🔧 Common Commands

```bash
# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Start Laravel
php artisan serve

# Start Vite
npm run dev

# Reset database
php artisan migrate:fresh --seed
```

---

## 📁 Important Files

- `SETUP-DATABASE.bat` - Initialize database
- `CLEAN-AND-START.bat` - Start servers
- `database/seeders/UserSeeder.php` - Test users
- `resources/js/Pages/Auth/UnifiedLogin.jsx` - Login page

---

## ✅ Verification Checklist

- [ ] Database migrated
- [ ] Test users created
- [ ] Servers running
- [ ] Login page loads
- [ ] Theme changes when typing
- [ ] Login successful
- [ ] Dashboard loads

---

## 🆘 Troubleshooting

**Connection Refused?**
→ Run `CLEAN-AND-START.bat`

**Invalid Credentials?**
→ Run `SETUP-DATABASE.bat`

**Theme Not Changing?**
→ Clear cache (Ctrl + Shift + R)

---

**Need help?** Check `walkthrough.md` for detailed guide!
