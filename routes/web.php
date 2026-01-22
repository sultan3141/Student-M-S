<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $user = Auth::user();

    if ($user->hasRole('super_admin')) {
        return redirect()->route('super_admin.dashboard');
    }

    if ($user->hasRole('student')) {
        return redirect()->route('student.dashboard');
    }

    if ($user->hasRole('teacher')) {
        return redirect()->route('teacher.dashboard');
    }

    if ($user->hasRole('parent')) {
        return redirect()->route('parent.dashboard');
    }

    if ($user->hasRole('registrar')) {
        return redirect()->route('registrar.dashboard');
    }

    if ($user->hasRole('admin') || $user->hasRole('school_director')) {
        return redirect()->route('director.dashboard');
    }

    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';

Route::middleware(['auth', 'role:registrar'])->prefix('registrar')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\RegistrarController::class, 'dashboard'])->name('registrar.dashboard');

    // Student Management (New Controller)
    Route::get('/students', [\App\Http\Controllers\RegistrarStudentController::class, 'index'])->name('registrar.students.index');
    Route::get('/students/create', [\App\Http\Controllers\RegistrarStudentController::class, 'create'])->name('registrar.students.create');
    Route::post('/students', [\App\Http\Controllers\RegistrarStudentController::class, 'store'])->name('registrar.students.store');
    Route::delete('/students/{id}', [\App\Http\Controllers\RegistrarStudentController::class, 'destroy'])->name('registrar.students.destroy');
    Route::get('/parents/search', [\App\Http\Controllers\RegistrarStudentController::class, 'searchParents'])->name('registrar.parents.search');

    Route::resource('payments', \App\Http\Controllers\RegistrarPaymentController::class)
        ->only(['index', 'create', 'store'])
        ->names('registrar.payments');

    // Guardian Management
    Route::get('/guardians', [\App\Http\Controllers\RegistrarGuardianController::class, 'index'])->name('registrar.guardians.index');
    Route::get('/guardians/create', [\App\Http\Controllers\RegistrarGuardianController::class, 'create'])->name('registrar.guardians.create');
    Route::post('/guardians', [\App\Http\Controllers\RegistrarGuardianController::class, 'store'])->name('registrar.guardians.store');
    Route::post('/guardians/link', [\App\Http\Controllers\RegistrarGuardianController::class, 'link'])->name('registrar.guardians.link');
    Route::post('/guardians/unlink', [\App\Http\Controllers\RegistrarGuardianController::class, 'unlink'])->name('registrar.guardians.unlink');
    Route::post('/guardians/{id}/reset-password', [\App\Http\Controllers\RegistrarGuardianController::class, 'resetPassword'])->name('registrar.guardians.reset-password');

    // Application Monitor
    Route::get('/completion', [\App\Http\Controllers\RegistrarCompletionController::class, 'index'])->name('registrar.completion.index');

    // Academic Year Manager
    Route::get('/academic', [\App\Http\Controllers\RegistrarAcademicYearController::class, 'index'])->name('registrar.academic.index');
    Route::post('/academic/promote', [\App\Http\Controllers\RegistrarAcademicYearController::class, 'promote'])->name('registrar.academic.promote');

    // Reporting Center
    Route::get('/reports', [\App\Http\Controllers\RegistrarReportController::class, 'index'])->name('registrar.reports.index');
    Route::get('/reports/generate', [\App\Http\Controllers\RegistrarReportController::class, 'generate'])->name('registrar.reports.generate');

    // Audit Log
    Route::get('/audit', [\App\Http\Controllers\RegistrarAuditController::class, 'index'])->name('registrar.audit.index');
});

Route::middleware(['auth', 'role:student'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\StudentController::class, 'dashboard'])->name('dashboard');

    // Annual Registration
    Route::get('/registration', [\App\Http\Controllers\StudentRegistrationController::class, 'create'])->name('registration.create');
    Route::post('/registration', [\App\Http\Controllers\StudentRegistrationController::class, 'store'])->name('registration.store');

    // Redirect legacy/wrong URL
    Route::get('/applications/create', function () {
        return redirect()->route('student.registration.create');
    });

    // Profile & Settings
    Route::get('/profile', [\App\Http\Controllers\StudentProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [\App\Http\Controllers\StudentProfileController::class, 'update'])->name('profile.update');
    Route::get('/password', [\App\Http\Controllers\StudentProfileController::class, 'editPassword'])->name('password.edit');
    Route::patch('/password', [\App\Http\Controllers\StudentProfileController::class, 'updatePassword'])->name('password.update');


    // Semester Academic Records
    Route::get('/academic/semesters', [\App\Http\Controllers\SemesterRecordController::class, 'index'])->name('academic.semesters');
    Route::get('/academic/semesters/{semester}/{academicYear}', [\App\Http\Controllers\SemesterRecordController::class, 'show'])->name('academic.semester.show');

    // Academic Year Records
    Route::get('/academic/year/current', [\App\Http\Controllers\AcademicYearRecordController::class, 'current'])->name('academic.year.current');
    Route::get('/academic/year/{academicYear}', [\App\Http\Controllers\AcademicYearRecordController::class, 'show'])->name('academic.year.show');


});

Route::middleware(['auth', 'role:parent'])->prefix('parent')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\ParentDashboardController::class, 'index'])->name('parent.dashboard');
    Route::get('/student/{studentId}', [\App\Http\Controllers\ParentDashboardController::class, 'profile'])->name('parent.student.profile');

    // Registration
    Route::get('/registration/{studentId}', [\App\Http\Controllers\ParentDashboardController::class, 'registrationCreate'])->name('parent.registration.create');
    Route::post('/registration/{studentId}', [\App\Http\Controllers\ParentDashboardController::class, 'registrationStore'])->name('parent.registration.store');

    Route::get('/student/{studentId}/marks', [\App\Http\Controllers\ParentDashboardController::class, 'marks'])->name('parent.student.marks');
    Route::get('/student/{studentId}/progress', [\App\Http\Controllers\ParentDashboardController::class, 'progress'])->name('parent.student.progress');
    Route::get('/student/{studentId}/payments', [\App\Http\Controllers\ParentDashboardController::class, 'paymentHistory'])->name('parent.student.payments');
    Route::get('/notifications', [\App\Http\Controllers\ParentDashboardController::class, 'notifications'])->name('parent.notifications');
    Route::get('/school-contact', [\App\Http\Controllers\ParentDashboardController::class, 'schoolContact'])->name('parent.school-contact');

    // Academic Records (New - Aligned with Student)
    Route::get('/student/{studentId}/academic/semesters', [\App\Http\Controllers\ParentDashboardController::class, 'semesterIndex'])->name('parent.academic.semesters');
    Route::get('/student/{studentId}/academic/semesters/{semester}/{academicYear}', [\App\Http\Controllers\ParentDashboardController::class, 'semesterShow'])->name('parent.academic.semester.show');
    Route::get('/student/{studentId}/academic/year/current', [\App\Http\Controllers\ParentDashboardController::class, 'academicYearCurrent'])->name('parent.academic.year.current');
    Route::get('/student/{studentId}/academic/year/{academicYear}', [\App\Http\Controllers\ParentDashboardController::class, 'academicYearShow'])->name('parent.academic.year.show');

    Route::get('/settings/password', [\App\Http\Controllers\ParentSettingsController::class, 'edit'])->name('parent.settings.password');
    Route::post('/settings/password', [\App\Http\Controllers\ParentSettingsController::class, 'updatePassword'])->name('parent.settings.password.update');
});

Route::middleware(['auth', 'verified'])->prefix('teacher')->name('teacher.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [\App\Http\Controllers\TeacherDashboardController::class, 'index'])->name('dashboard');

    // Marks Management
    Route::get('/marks', [\App\Http\Controllers\TeacherMarkController::class, 'index'])->name('marks.index');
    Route::get('/marks/enter', [\App\Http\Controllers\TeacherMarkController::class, 'create'])->name('marks.create');
    Route::post('/marks/store', [\App\Http\Controllers\TeacherMarkController::class, 'store'])->name('marks.store');
    Route::get('/marks/students', [\App\Http\Controllers\TeacherAssignmentController::class, 'getStudents'])->name('marks.students');

    // Modern Mark Management Wizard (Updated - No Grade Selection)
    Route::prefix('marks/wizard')->name('marks.wizard.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Teacher/Marks/MarkWizard');
        })->name('index');
        Route::get('/all-sections', [\App\Http\Controllers\TeacherClassController::class, 'getAllAssignedSections'])->name('all-sections');
        // Deprecated routes - kept for backward compatibility but return empty data
        Route::get('/grades', [\App\Http\Controllers\TeacherClassController::class, 'getTeacherGrades'])->name('grades');
        Route::get('/sections/{grade}', [\App\Http\Controllers\TeacherClassController::class, 'getSectionsByGrade'])->name('sections');
        Route::get('/subjects/{section}', [\App\Http\Controllers\TeacherClassController::class, 'getSubjectsBySection'])->name('subjects');
        Route::get('/assessments/{subject}/{semester}', [\App\Http\Controllers\TeacherClassController::class, 'getAssessmentsBySubject'])->name('assessments');
    });

    // Attendance Management (NEW)
    Route::prefix('attendance')->name('attendance.')->group(function () {
        Route::get('/', [\App\Http\Controllers\TeacherAttendanceController::class, 'index'])->name('index');
        Route::get('/create/{section}', [\App\Http\Controllers\TeacherAttendanceController::class, 'create'])->name('create');
        Route::post('/store', [\App\Http\Controllers\TeacherAttendanceController::class, 'store'])->name('store');
        Route::get('/history', [\App\Http\Controllers\TeacherAttendanceController::class, 'history'])->name('history');
    });

    // Assessment Management (CRUD & Bulk Operations)
    Route::resource('assessments', \App\Http\Controllers\AssessmentController::class);
    Route::post('/assessments/{id}/import', [\App\Http\Controllers\AssessmentController::class, 'importMarks'])->name('assessments.import');
    Route::get('/assessments/{id}/template', [\App\Http\Controllers\AssessmentController::class, 'exportTemplate'])->name('assessments.template');
    Route::get('/assessments/{id}/stats', [\App\Http\Controllers\AssessmentController::class, 'getStats'])->name('assessments.stats');

    // Custom Assessment Management (NEW)
    Route::prefix('custom-assessments')->name('custom-assessments.')->group(function () {
        Route::get('/', [\App\Http\Controllers\TeacherCustomAssessmentController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\TeacherCustomAssessmentController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\TeacherCustomAssessmentController::class, 'store'])->name('store');
        Route::get('/{id}', [\App\Http\Controllers\TeacherCustomAssessmentController::class, 'show'])->name('show');
        Route::get('/{id}/enter-marks', [\App\Http\Controllers\TeacherCustomAssessmentController::class, 'enterMarks'])->name('enter-marks');
        Route::post('/{id}/store-marks', [\App\Http\Controllers\TeacherCustomAssessmentController::class, 'storeMarks'])->name('store-marks');
    });

    // Assessment Management (Old 2-step workflow - Keep for backward compatibility)
    Route::get('/assessments-old', [\App\Http\Controllers\TeacherAssessmentController::class, 'index'])->name('assessments-old.index');
    Route::post('/assessments-old', [\App\Http\Controllers\TeacherAssessmentController::class, 'store'])->name('assessments-old.store');
    Route::put('/assessments-old/{assessment}', [\App\Http\Controllers\TeacherAssessmentController::class, 'update'])->name('assessments-old.update');
    Route::delete('/assessments-old/{assessment}', [\App\Http\Controllers\TeacherAssessmentController::class, 'destroy'])->name('assessments-old.destroy');

    // Classes
    Route::get('/classes', [\App\Http\Controllers\TeacherClassController::class, 'index'])->name('classes.index');
    Route::get('/classes/{id}', [\App\Http\Controllers\TeacherClassController::class, 'show'])->name('classes.show');

    // Rankings
    Route::get('/rankings', [\App\Http\Controllers\TeacherRankingController::class, 'index'])->name('rankings.index');
    Route::get('/rankings/live/{classId}', [\App\Http\Controllers\TeacherRankingController::class, 'live'])->name('rankings.live');

    // Reports & Analytics
    Route::get('/analytics', [\App\Http\Controllers\TeacherAnalyticsController::class, 'index'])->name('analytics.index');
    Route::get('/analytics/class/{classId}', [\App\Http\Controllers\TeacherAnalyticsController::class, 'getClassAnalytics'])->name('analytics.class');
    Route::get('/analytics/student/{studentId}', [\App\Http\Controllers\TeacherAnalyticsController::class, 'getStudentAnalytics'])->name('analytics.student');

    Route::get('/reports', [\App\Http\Controllers\TeacherReportController::class, 'index'])->name('reports.index');

    // Student Tracking
    Route::get('/students', [\App\Http\Controllers\TeacherStudentController::class, 'index'])->name('students.index');
    Route::get('/students/{id}', [\App\Http\Controllers\TeacherStudentController::class, 'show'])->name('students.show');


    // Profile
    Route::get('/profile', [\App\Http\Controllers\TeacherProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [\App\Http\Controllers\TeacherProfileController::class, 'update'])->name('profile.update');

    Route::get('/assignments/subjects', [\App\Http\Controllers\TeacherAssignmentController::class, 'getAssignedSubjects']);
});

// Director/Admin Routes
Route::middleware(['auth', 'role:school_director|admin', 'audit'])->prefix('director')->name('director.')->group(function () {
    // Dashboard & Metrics
    Route::get('/dashboard', [\App\Http\Controllers\DirectorDashboardController::class, 'index'])->name('dashboard');
    Route::get('/metrics/academic', [\App\Http\Controllers\DirectorDashboardController::class, 'getAcademicHealth'])->name('metrics.academic');
    Route::get('/metrics/operational', [\App\Http\Controllers\DirectorDashboardController::class, 'getOperationalMetrics'])->name('metrics.operational');
    Route::get('/metrics/financial', [\App\Http\Controllers\DirectorDashboardController::class, 'getFinancialOverview'])->name('metrics.financial');

    // Profile
    Route::get('/profile', [\App\Http\Controllers\DirectorProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile/update', [\App\Http\Controllers\DirectorProfileController::class, 'update'])->name('profile.update');
    Route::put('/password/update', [\App\Http\Controllers\DirectorProfileController::class, 'updatePassword'])->name('password.update');

    // Teacher Management
    Route::resource('teachers', \App\Http\Controllers\DirectorTeacherController::class);
    Route::get('/teachers/{id}/performance', [\App\Http\Controllers\DirectorTeacherController::class, 'getPerformanceMetrics'])->name('teachers.performance');
    
    // Teacher Assignments (NEW)
    Route::get('/teacher-assignments', [\App\Http\Controllers\SchoolDirectorController::class, 'teacherAssignments'])->name('teacher.assignments');
    Route::post('/teacher-assignments', [\App\Http\Controllers\SchoolDirectorController::class, 'assignTeacher'])->name('teacher.assign');
    Route::delete('/teacher-assignments/{assignmentId}', [\App\Http\Controllers\SchoolDirectorController::class, 'removeTeacherAssignment'])->name('teacher.assignment.remove');
    Route::get('/grades/{gradeId}/sections', [\App\Http\Controllers\SchoolDirectorController::class, 'getSectionsByGrade'])->name('grades.sections');

    // Academic Analytics  
    Route::get('/academic/overview', [\App\Http\Controllers\DirectorAcademicController::class, 'getPerformanceOverview'])->name('academic.overview');
    Route::get('/academic/grade/{grade}', [\App\Http\Controllers\DirectorAcademicController::class, 'getGradeAnalytics'])->name('academic.grade');
    Route::get('/academic/heatmap', [\App\Http\Controllers\DirectorAcademicController::class, 'getSubjectHeatMap'])->name('academic.heatmap');
    Route::post('/academic/export', [\App\Http\Controllers\DirectorAcademicController::class, 'exportAnalytics'])->name('academic.export');

    // Registration Control
    Route::get('/registration/status', [\App\Http\Controllers\DirectorRegistrationController::class, 'getStatus'])->name('registration.status');
    Route::post('/registration/toggle', [\App\Http\Controllers\DirectorRegistrationController::class, 'toggle'])->name('registration.toggle');
    Route::get('/registration/stats', [\App\Http\Controllers\DirectorRegistrationController::class, 'getEnrollmentStats'])->name('registration.stats');
    Route::post('/registration/process', [\App\Http\Controllers\DirectorRegistrationController::class, 'processApplications'])->name('registration.process');
    Route::get('/registration/export-excel', [\App\Http\Controllers\DirectorRegistrationController::class, 'exportExcel'])->name('registration.export-excel');
    Route::get('/registration/export-pdf', [\App\Http\Controllers\DirectorRegistrationController::class, 'exportPdf'])->name('registration.export-pdf');

    // School Schedule
    Route::get('/schedule', [\App\Http\Controllers\DirectorScheduleController::class, 'index'])->name('schedule.index');
    Route::get('/schedule/today', [\App\Http\Controllers\DirectorScheduleController::class, 'getTodaySchedule'])->name('schedule.today');
    Route::get('/schedule/grade/{grade}', [\App\Http\Controllers\DirectorScheduleController::class, 'getGradeSchedule'])->name('schedule.grade');
    Route::get('/schedule/export-pdf', [\App\Http\Controllers\DirectorScheduleController::class, 'exportPdf'])->name('schedule.export-pdf');
    Route::get('/schedule/export-csv', [\App\Http\Controllers\DirectorScheduleController::class, 'exportCsv'])->name('schedule.export-csv');

    // Student Statistics & Directory
    Route::get('/statistics/students', [\App\Http\Controllers\DirectorStudentStatisticsController::class, 'index'])->name('statistics.students');
    Route::get('/statistics/students/data', [\App\Http\Controllers\DirectorStudentStatisticsController::class, 'getStatisticsJson'])->name('statistics.students.data');
    
    // Student Directory (New)
    Route::get('/students', [\App\Http\Controllers\DirectorStudentController::class, 'index'])->name('students.index');
    Route::get('/students/{student}', [\App\Http\Controllers\DirectorStudentController::class, 'show'])->name('students.show');

    // Parent Directory (New)
    Route::get('/parents', [\App\Http\Controllers\DirectorParentController::class, 'index'])->name('parents.index');
    Route::get('/parents/{parent}', [\App\Http\Controllers\DirectorParentController::class, 'show'])->name('parents.show');

    // Communication Center
    Route::resource('announcements', \App\Http\Controllers\DirectorCommunicationController::class);
    Route::get('/announcements/{id}/analytics', [\App\Http\Controllers\DirectorCommunicationController::class, 'getAnalytics'])->name('announcements.analytics');

    // Documents Management - Specific routes BEFORE resource routes
    Route::post('/documents/generate-batch', [\App\Http\Controllers\DirectorDocumentsController::class, 'generateBatch'])->name('documents.generate-batch');
    Route::get('/documents/export-data', [\App\Http\Controllers\DirectorDocumentsController::class, 'exportData'])->name('documents.export-data');
    Route::post('/documents/{document}/generate', [\App\Http\Controllers\DirectorDocumentsController::class, 'generate'])->name('documents.generate');
    Route::get('/documents/{document}/preview', [\App\Http\Controllers\DirectorDocumentsController::class, 'preview'])->name('documents.preview');
    Route::resource('documents', \App\Http\Controllers\DirectorDocumentsController::class);

    // Audit Logging - Specific routes BEFORE parameterized routes
    Route::get('/audit', [\App\Http\Controllers\DirectorAuditController::class, 'index'])->name('audit.index');
    Route::get('/audit/export', [\App\Http\Controllers\DirectorAuditController::class, 'export'])->name('audit.export');
    Route::get('/audit/statistics', [\App\Http\Controllers\DirectorAuditController::class, 'statistics'])->name('audit.statistics');
    Route::post('/audit/clear-old', [\App\Http\Controllers\DirectorAuditController::class, 'clearOld'])->name('audit.clear-old');
    Route::get('/audit/{log}', [\App\Http\Controllers\DirectorAuditController::class, 'show'])->name('audit.show');
});

// Legacy Admin Route (for backward compatibility)
Route::middleware(['auth', 'role:admin|super_admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return redirect()->route('director.dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'role:super_admin'])->prefix('super_admin')->name('super_admin.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [\App\Http\Controllers\SuperAdminController::class, 'dashboard'])->name('dashboard');

    // 1. User Management
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [\App\Http\Controllers\SuperAdminUserController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\SuperAdminUserController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\SuperAdminUserController::class, 'store'])->name('store');
        Route::get('/{user}/edit', [\App\Http\Controllers\SuperAdminUserController::class, 'edit'])->name('edit');
        Route::put('/{user}', [\App\Http\Controllers\SuperAdminUserController::class, 'update'])->name('update');
        Route::delete('/{user}', [\App\Http\Controllers\SuperAdminUserController::class, 'destroy'])->name('destroy');
        Route::post('/{user}/activate', [\App\Http\Controllers\SuperAdminUserController::class, 'activate'])->name('activate');
        Route::post('/{user}/deactivate', [\App\Http\Controllers\SuperAdminUserController::class, 'deactivate'])->name('deactivate');
        Route::post('/{user}/reset-password', [\App\Http\Controllers\SuperAdminUserController::class, 'resetPassword'])->name('reset-password');
    });

    // 2. System Configuration
    Route::prefix('config')->name('config.')->group(function () {
        Route::get('/', [\App\Http\Controllers\SuperAdminSystemConfigController::class, 'index'])->name('index');
        Route::post('/grading', [\App\Http\Controllers\SuperAdminSystemConfigController::class, 'updateGrading'])->name('grading');
        Route::post('/fees', [\App\Http\Controllers\SuperAdminSystemConfigController::class, 'updateFees'])->name('fees');
        Route::post('/academic', [\App\Http\Controllers\SuperAdminSystemConfigController::class, 'updateAcademic'])->name('academic');
        Route::post('/workflows', [\App\Http\Controllers\SuperAdminSystemConfigController::class, 'updateWorkflows'])->name('workflows');
    });

    // 3. Security and Audit
    Route::prefix('security')->name('security.')->group(function () {
        Route::get('/audit-logs', [\App\Http\Controllers\SuperAdminSecurityController::class, 'auditLogs'])->name('audit-logs');
        Route::get('/events', [\App\Http\Controllers\SuperAdminSecurityController::class, 'securityEvents'])->name('events');
        Route::get('/settings', [\App\Http\Controllers\SuperAdminSecurityController::class, 'settings'])->name('settings');
        Route::post('/settings', [\App\Http\Controllers\SuperAdminSecurityController::class, 'updateSettings'])->name('settings.update');
    });

    // 4. Data Oversight and Backup
    Route::prefix('data')->name('data.')->group(function () {
        Route::get('/backups', [\App\Http\Controllers\SuperAdminDataController::class, 'backups'])->name('backups');
        Route::post('/backup/create', [\App\Http\Controllers\SuperAdminDataController::class, 'createBackup'])->name('backup.create');
        Route::post('/backup/restore', [\App\Http\Controllers\SuperAdminDataController::class, 'restoreBackup'])->name('backup.restore');
        Route::get('/export', [\App\Http\Controllers\SuperAdminDataController::class, 'export'])->name('export');
        Route::get('/reports', [\App\Http\Controllers\SuperAdminDataController::class, 'reports'])->name('reports');
    });

    // 5. Access Control
    Route::prefix('access')->name('access.')->group(function () {
        Route::get('/', [\App\Http\Controllers\SuperAdminAccessController::class, 'index'])->name('index');
        Route::get('/permissions', [\App\Http\Controllers\SuperAdminAccessController::class, 'permissions'])->name('permissions');
        Route::post('/permissions', [\App\Http\Controllers\SuperAdminAccessController::class, 'updatePermissions'])->name('permissions.update');
        Route::get('/logs', [\App\Http\Controllers\SuperAdminAccessController::class, 'accessLogs'])->name('logs');
    });
});


Route::get('/fix-user', function () {
    try {
        DB::beginTransaction();

        // 1. Force FRESH Migration (Clean Slate)
        \Illuminate\Support\Facades\Artisan::call('migrate:fresh', [
            '--force' => true,
        ]);

        // 2. Ensure Roles Exist
        $roles = ['admin', 'teacher', 'student', 'parent', 'registrar', 'super_admin'];
        foreach ($roles as $role) {
            \Spatie\Permission\Models\Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }

        // 3. Create Users & Profiles
        $superAdmin = \App\Models\User::create(['name' => 'Super Admin', 'username' => 'super_admin', 'password' => bcrypt('password')]);
        $superAdmin->assignRole('super_admin');

        $admin = \App\Models\User::create(['name' => 'Admin User', 'username' => 'admin', 'password' => bcrypt('password')]);
        $admin->assignRole('admin');

        $teacherUser = \App\Models\User::create(['name' => 'John Teacher', 'username' => 'teacher_john', 'password' => bcrypt('password')]);
        $teacherUser->assignRole('teacher');
        $teacher = \App\Models\Teacher::create([
            'user_id' => $teacherUser->id,
            'employee_id' => 'T001',
            'qualification' => 'M.Ed',
            'specialization' => 'Math'
        ]);


        // 4. Create Academic Structure
        $year = \App\Models\AcademicYear::create([
            'name' => '2025-2026',
            'start_date' => '2025-09-01',
            'end_date' => '2026-06-30',
            'is_current' => true
        ]);

        $grades = [];
        foreach (range(9, 12) as $level) {
            $grades[$level] = \App\Models\Grade::create([
                'name' => "Grade $level",
                'level' => $level,
                'stream' => 'General'
            ]);
        }

        // 5. Create Sections
        $sectionA = \App\Models\Section::create([
            'name' => 'Section A',
            'grade_id' => $grades[9]->id,
            'capacity' => 40
        ]);

        $sectionB = \App\Models\Section::create([
            'name' => 'Section B',
            'grade_id' => $grades[9]->id,
            'capacity' => 40
        ]);

        // 6. Create Subjects
        $mathSubject = \App\Models\Subject::create([
            'name' => 'Mathematics',
            'code' => 'MATH9',
            'credit_hours' => 4,
            'description' => 'General Mathematics'
        ]);

        $engSubject = \App\Models\Subject::create([
            'name' => 'English',
            'code' => 'ENG9',
            'credit_hours' => 3,
            'description' => 'English Language'
        ]);

        // 7. Assign Teacher to Classes (Crucial for Wizard)
        \App\Models\TeacherAssignment::create([
            'teacher_id' => $teacher->id,
            'subject_id' => $mathSubject->id,
            'grade_id' => $grades[9]->id,
            'section_id' => $sectionA->id,
            'academic_year_id' => $year->id
        ]);

        \App\Models\TeacherAssignment::create([
            'teacher_id' => $teacher->id,
            'subject_id' => $engSubject->id,
            'grade_id' => $grades[9]->id,
            'section_id' => $sectionB->id,
            'academic_year_id' => $year->id
        ]);

        // 8. Create Assessment Types
        $types = ['Midterm', 'Final', 'Test', 'Assignment'];
        foreach ($types as $type) {
            \App\Models\AssessmentType::create(['name' => $type, 'weight_percentage' => 25]);
        }

        // 9. Create Students
        $students = [
            ['Alice Smith', '9A01'],
            ['Bob Jones', '9A02'],
            ['Charlie Brown', '9A03'],
            ['Diana Prince', '9A04'],
            ['Evan Wright', '9A05'],
        ];

        foreach ($students as $data) {
            $u = \App\Models\User::create([
                'name' => $data[0],
                'username' => strtolower(str_replace(' ', '_', $data[0])),
                'password' => bcrypt('password')
            ]);
            $u->assignRole('student');

            \App\Models\Student::create([
                'user_id' => $u->id,
                'student_id' => $data[1],
                'grade_id' => $grades[9]->id,
                'section_id' => $sectionA->id,
                'dob' => '2010-01-01',
                'gender' => 'Other',
                'address' => '123 School Lane'
            ]);
        }

        DB::commit();

        return "<h1>✅ SUPER FIX SUCCESS!</h1>
        <p>Created:</p>
        <ul>
            <li>Teacher: John Teacher (teacher_john / password)</li>
            <li>Grade: 9 (with Section A & B)</li>
            <li>Subject: Math & English</li>
            <li>Assignment: Teacher John -> Grade 9 -> Section A -> Math</li>
            <li>Students: 5 students in Section A</li>
        </ul>
        <a href='/login'>Go to Login</a>";

    } catch (\Throwable $e) {
        DB::rollBack();
        return "<h1>❌ ERROR!</h1><pre>" . $e->getMessage() . "</pre><br><pre>" . $e->getTraceAsString() . "</pre>";
    }
});

Route::get('/create-director', function () {
    try {
        // Ensure role exists
        if (!\Spatie\Permission\Models\Role::where('name', 'school_director')->exists()) {
                \Spatie\Permission\Models\Role::create(['name' => 'school_director', 'guard_name' => 'web']);
        }

        $user = \App\Models\User::firstOrCreate(
            ['username' => 'director'],
            [
                'name' => 'School Director',
                'email' => 'director@school.com',
                'password' => bcrypt('password')
            ]
        );
        
        // Force update password and role just in case
        $user->password = bcrypt('password');
        $user->save();
        $user->syncRoles(['school_director']);

        return "<h1>✅ Director Account Ready</h1>
                <p><strong>Username:</strong> director</p>
                <p><strong>Password:</strong> password</p>
                <a href='/login'>Go to Login</a>";
    } catch (\Throwable $e) {
        return "Error: " . $e->getMessage();
    }
});
