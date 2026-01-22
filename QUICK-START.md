# Quick Start Guide

## ✅ Method 1: Double-Click Launcher (Easiest)

1. **Go to your project folder:**
   ```
   C:\Users\Ezedi\Student-M-S\Student-M-S
   ```

2. **Double-click:** `LAUNCH-SERVERS.bat`

3. **Wait for 2 windows to open**:
   - Window 1: "Laravel Backend - PORT 8000"
   - Window 2: "Vite Frontend - PORT 5173"

4. **Browser opens automatically** to http://localhost:8000/teacher/dashboard

**✨ That's it!**

---

## ✅ Method 2: VS Code Tasks

1. **Open project in VS Code**

2. **Press:** `Ctrl + Shift + P`

3. **Type:** "Tasks: Run Task"

4. **Select:** "Start All Servers"

5. **See output** in VS Code terminal panel

6. **Open browser** to http://localhost:8000/teacher/dashboard

---

## ✅ Method 3: Manual Terminal

**Terminal 1 (Laravel):**
```cmd
cd C:\Users\Ezedi\Student-M-S\Student-M-S
php artisan serve
```
✔️ Should show: "Laravel development server started: http://127.0.0.1:8000"

**Terminal 2 (Vite):**
```cmd
cd C:\Users\Ezedi\Student-M-S\Student-M-S
npm run dev
```
✔️ Should show: "VITE v... ready in ...ms"

**Browser:**
```
http://localhost:8000/teacher/dashboard
```

---

## 🔍 Troubleshooting

### Problem: "php is not recognized"
Use full path:
```cmd
C:\xampp\php\php.exe artisan serve
```

### Problem: "Address already in use"
Kill the process:
```cmd
netstat -ano | findstr :8000
taskkill /PID [NUMBER] /F
```

### Problem: "npm is not recognized"
Install Node.js: https://nodejs.org/

### Problem: Blank page loads
1. Check BOTH server windows are open
2. Look for errors in server windows
3. Hard refresh browser: `Ctrl + Shift + R`

---

## 📊 How to Know It's Working

**Laravel Window:**
```
✅ "Laravel development server started: http://127.0.0.1:8000"
✅ No error messages
✅ Window stays open
```

**Vite Window:**
```
✅ "VITE v... ready in ...ms"
✅ "Local: http://localhost:5173/"
✅ Window stays open
```

**Browser:**
```
✅ Dark sidebar visible
✅ "Dashboard Overview" header
✅ Stats cards showing
✅ NO "Connection refused" error
```

---

## 🛑 Stopping Servers

**Method 1:** Close both server windows

**Method 2:** Press `Ctrl + C` in each terminal window

---

## 📱 Next Steps

Once servers are running successfully:
1. Explore the Teacher Dashboard
2. Navigate to different pages
3. Test the features
4. Report any issues you find

Then we'll build the **Glassmorphism Login System**! 🎨
