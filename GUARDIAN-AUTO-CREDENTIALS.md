# Guardian Account Auto-Creation System

## Overview
This system automatically generates usernames and passwords when registrars create guardian accounts, making it easy to provide parent portal access.

## Features

### 1. Automatic Username Generation
- **Format:** `parent_[firstname]_[lastname]`
- **Example:** "John Doe" → `parent_john_doe`
- **Uniqueness:** If username exists, adds a number (e.g., `parent_john_doe_2`)
- **Lowercase:** All usernames are converted to lowercase with underscores

### 2. Automatic Password Generation
- **Length:** 8 characters
- **Characters:** Mix of uppercase, lowercase, and numbers
- **Random:** Each password is uniquely generated
- **Secure:** Passwords are hashed before storage

### 3. Credential Display
- **After Creation:** Credentials shown immediately after account creation
- **Copy to Clipboard:** One-click copy for username and password
- **Warning:** Clear message that password won't be shown again
- **Printable:** Credentials can be saved or printed for the guardian

### 4. Password Reset
- **Reset Button:** Available on each guardian card
- **New Password:** Generates a new random 8-character password
- **Immediate Display:** New credentials shown after reset
- **Confirmation:** Requires confirmation before resetting

## How to Use

### Creating a New Guardian Account

1. **Navigate to Guardian Management:**
   - From Registrar Dashboard → Click "Manage Guardians" button
   - Or click "Guardians" in the shortcuts section

2. **Click "New Guardian" Button:**
   - Located in the top-right of the Guardian Management page
   - Yellow button with a plus icon

3. **Fill in Guardian Information:**
   - **Name** (Required): Full name of the guardian
   - **Phone** (Required): Contact phone number
   - **Email** (Optional): Email address
   - **Address** (Optional): Home address

4. **Submit the Form:**
   - Click "Create Guardian Account"
   - System automatically generates username and password

5. **Save the Credentials:**
   - Credentials are displayed in a green success banner
   - **Username:** Shown in blue box with copy button
   - **Password:** Shown in red box with copy button
   - Click clipboard icons to copy
   - **Important:** Save these credentials - password won't be shown again!

6. **Provide Credentials to Guardian:**
   - Print or write down the credentials
   - Give them to the guardian
   - Guardian can now log in to the Parent Portal

### Viewing Guardian Credentials

1. **Go to Guardian Management Page**

2. **Find the Guardian Card**

3. **Click "Show" Button:**
   - Located in the "Parent Portal Login" section
   - Reveals the username

4. **Username Display:**
   - Username is shown and can be copied
   - Password is not stored in plain text (security)

5. **Reset Password if Needed:**
   - Click "Reset Password" button
   - Confirm the action
   - New password will be generated and displayed

### Resetting a Guardian Password

1. **Locate the Guardian:**
   - Search or scroll to find the guardian

2. **Show Credentials:**
   - Click "Show" in the login credentials section

3. **Click "Reset Password":**
   - Yellow button with key icon
   - Confirm the reset action

4. **Save New Credentials:**
   - New password displayed in success banner
   - Copy and provide to guardian
   - Old password is now invalid

## Workflow Example

### Scenario: Registering a New Parent

**Step 1: Create Guardian Account**
```
Registrar fills form:
- Name: Mary Johnson
- Phone: +251-911-234567
- Email: mary@example.com
- Address: 123 Main St, Addis Ababa
```

**Step 2: System Generates Credentials**
```
Username: parent_mary_johnson
Password: aB3xK9mP (randomly generated)
```

**Step 3: Credentials Displayed**
```
✅ Guardian Account Created Successfully!

Guardian: Mary Johnson
Username: parent_mary_johnson [Copy]
Password: aB3xK9mP [Copy]

⚠️ Important: Please save these credentials and provide them to the guardian.
```

**Step 4: Registrar Actions**
- Copies username and password
- Writes them on a paper or prints
- Gives to Mary Johnson

**Step 5: Link Students**
- Registrar links Mary's children to her account
- Uses the Quick Linking Tool

**Step 6: Parent Logs In**
- Mary goes to Parent Portal
- Enters username: `parent_mary_johnson`
- Enters password: `aB3xK9mP`
- Sees her children's information

## Security Features

### Password Security
- ✅ Passwords are hashed using bcrypt
- ✅ Plain text passwords never stored in database
- ✅ Passwords only shown once at creation/reset
- ✅ Random generation prevents predictable passwords

### Username Security
- ✅ Unique usernames prevent conflicts
- ✅ Standardized format for easy identification
- ✅ Cannot be changed by users (prevents impersonation)

### Access Control
- ✅ Only registrars can create guardian accounts
- ✅ Only registrars can reset passwords
- ✅ Guardians can only see their linked children

## Technical Details

### Username Generation Algorithm
```php
1. Take guardian's full name
2. Convert to lowercase
3. Replace spaces with underscores
4. Prefix with "parent_"
5. Check if username exists
6. If exists, append _1, _2, etc.
7. Return unique username
```

### Password Generation Algorithm
```php
1. Define character set (a-z, A-Z, 0-9)
2. Generate 8 random characters
3. Return password string
4. Hash with bcrypt before storing
```

### Database Structure
```
users table:
- id
- name
- username (unique, indexed)
- password (hashed)
- email

parents table:
- id
- user_id (foreign key)
- phone
- address
```

## Files Modified/Created

### Backend:
- `app/Http/Controllers/RegistrarGuardianController.php`
  - Added `create()` method
  - Added `store()` method
  - Added `resetPassword()` method
  - Added `generatePassword()` helper

### Frontend:
- `resources/js/Pages/Registrar/Guardians/Create.jsx` (NEW)
  - Guardian creation form
  - Field validation
  - User-friendly interface

- `resources/js/Pages/Registrar/Guardians/Index.jsx`
  - Added credential display section
  - Added show/hide toggle
  - Added copy to clipboard
  - Added reset password button
  - Added success banner for new credentials

### Routes:
- `GET /registrar/guardians/create` - Show creation form
- `POST /registrar/guardians` - Store new guardian
- `POST /registrar/guardians/{id}/reset-password` - Reset password

## Best Practices

### For Registrars:
1. **Always save credentials immediately** after creation
2. **Verify information** before creating account
3. **Provide credentials securely** to guardians
4. **Link students** right after creating guardian
5. **Test login** to ensure credentials work

### For Guardians:
1. **Keep credentials safe** - don't share with others
2. **Change password** if compromised (contact registrar)
3. **Log out** after using shared computers
4. **Contact registrar** if login issues occur

## Troubleshooting

**Issue:** Guardian forgot password
- **Solution:** Registrar resets password from Guardian Management page

**Issue:** Username already exists
- **Solution:** System automatically adds number suffix

**Issue:** Credentials not showing after creation
- **Solution:** Check flash messages, may need to refresh page

**Issue:** Cannot copy credentials
- **Solution:** Manually write down or use browser's copy function

**Issue:** Guardian cannot log in
- **Solution:** Verify username is correct (case-sensitive), reset password if needed

## Future Enhancements

1. **Email Credentials:** Automatically email credentials to guardian
2. **SMS Notifications:** Send credentials via SMS
3. **Password Strength:** Add password complexity requirements
4. **Password Expiry:** Force password change after first login
5. **Audit Log:** Track who created/reset passwords
6. **Bulk Creation:** Import multiple guardians from CSV
7. **QR Code:** Generate QR code with login credentials

## Summary

The Guardian Auto-Credentials system streamlines the process of creating parent portal accounts by:
- Automatically generating unique usernames
- Creating secure random passwords
- Displaying credentials immediately
- Providing easy password reset
- Ensuring security best practices

This makes it easy for registrars to quickly set up parent accounts and provide access to the parent portal.
