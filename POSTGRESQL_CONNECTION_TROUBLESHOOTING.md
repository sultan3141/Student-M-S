# PostgreSQL Connection Troubleshooting Guide

## Current Issue
Cannot connect to Aiven PostgreSQL database due to DNS resolution failure.

**Error:** `could not translate host name "pg-2fe3d2b1-wariyoo404-7abb.h.aivencloud.com" to address: Unknown host`

## Your Database Credentials
```
Host: pg-2fe3d2b1-wariyoo404-7abb.h.aivencloud.com
Port: 16994
Database: defaultdb
Username: avnadmin
Password: <REDACTED>
SSL Mode: require
```

## Troubleshooting Steps

### Step 1: Check Internet Connection
1. Open Command Prompt
2. Run: `ping google.com`
3. If this fails, check your internet connection

### Step 2: Check DNS Resolution
1. Run: `nslookup pg-2fe3d2b1-wariyoo404-7abb.h.aivencloud.com`
2. If this fails, try: `nslookup pg-2fe3d2b1-wariyoo404-7abb.h.aivencloud.com 8.8.8.8`
3. If still failing, there's a DNS issue

### Step 3: Check Firewall
1. Check if your firewall is blocking port 16994
2. Temporarily disable firewall to test
3. Add exception for port 16994 if needed

### Step 4: Verify Aiven Database Status
1. Log into your Aiven account at https://console.aiven.io
2. Check if the database instance is running
3. Verify the hostname is correct
4. Check if the instance expired (free tier expires after inactivity)

### Step 5: Try Direct IP Connection (if DNS fails)
If you can get the IP address from Aiven console:
1. Update `.env` file with IP address instead of hostname
2. Example: `DB_HOST=123.45.67.89`

## Current Workaround Applied

To allow the application to run without database connection errors, I've configured:

```env
SESSION_DRIVER=file  # Changed from database
CACHE_STORE=file     # Changed from database
```

This allows the app to start without immediately connecting to the database.

## Solutions

### Solution A: Fix Network/DNS Issue
1. Restart your router
2. Flush DNS cache: `ipconfig /flushdns`
3. Change DNS servers to Google DNS (8.8.8.8, 8.8.4.4)
4. Try again

### Solution B: Use Local PostgreSQL
Install PostgreSQL locally and update `.env`:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=student_management
DB_USERNAME=postgres
DB_PASSWORD=<REDACTED>
DB_SSLMODE=prefer
```

### Solution C: Use SQLite (Temporary)
For development without network:
```env
DB_CONNECTION=sqlite
```

## Testing Connection

Once network is fixed, test the connection:

```bash
php artisan tinker
```

Then run:
```php
DB::connection()->getPdo();
```

If successful, you'll see PDO object details.

## Next Steps

1. Fix your internet/DNS connection
2. Verify Aiven database is active
3. Test connection with `php artisan tinker`
4. Run `php artisan config:clear`
5. Run `php artisan cache:clear`
6. Access the application

## Contact Support

If the issue persists:
- Check Aiven status page: https://status.aiven.io
- Contact Aiven support if database is down
- Check your ISP if DNS is consistently failing

