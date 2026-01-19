<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
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
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php'; 

Route::middleware(['auth', 'role:registrar'])->prefix('registrar')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\RegistrarController::class, 'dashboard'])->name('registrar.dashboard');
    Route::get('/students/create', [\App\Http\Controllers\RegistrarController::class, 'create'])->name('registrar.students.create');
    Route::post('/students', [\App\Http\Controllers\RegistrarController::class, 'store'])->name('registrar.students.store');

    Route::resource('payments', \App\Http\Controllers\RegistrarPaymentController::class)
        ->only(['index', 'create', 'store'])
        ->names('registrar.payments');
});

Route::middleware(['auth', 'role:student'])->prefix('student')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\StudentController::class, 'dashboard'])->name('student.dashboard');
    Route::get('/profile', [\App\Http\Controllers\StudentProfileController::class, 'edit'])->name('student.profile.edit');
    Route::patch('/profile', [\App\Http\Controllers\StudentProfileController::class, 'update'])->name('student.profile.update');
});

Route::middleware(['auth', 'role:parent'])->prefix('parent')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\ParentDashboardController::class, 'index'])->name('parent.dashboard');
    Route::get('/student/{studentId}', [\App\Http\Controllers\ParentDashboardController::class, 'profile'])->name('parent.student.profile');
    Route::get('/student/{studentId}/marks', [\App\Http\Controllers\ParentDashboardController::class, 'marks'])->name('parent.student.marks');
    Route::get('/student/{studentId}/progress', [\App\Http\Controllers\ParentDashboardController::class, 'progress'])->name('parent.student.progress');
    Route::get('/student/{studentId}/payments', [\App\Http\Controllers\ParentDashboardController::class, 'paymentHistory'])->name('parent.student.payments');
    Route::get('/notifications', [\App\Http\Controllers\ParentDashboardController::class, 'notifications'])->name('parent.notifications');
    Route::get('/school-contact', [\App\Http\Controllers\ParentDashboardController::class, 'schoolContact'])->name('parent.school-contact');
    
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
    
    // Modern Mark Management Wizard (NEW)
    Route::prefix('marks/wizard')->name('marks.wizard.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Teacher/Marks/MarkWizard');
        })->name('index');
        Route::get('/grades', [\App\Http\Controllers\TeacherClassController::class, 'getTeacherGrades'])->name('grades');
        Route::get('/sections/{grade}', [\App\Http\Controllers\TeacherClassController::class, 'getSectionsByGrade'])->name('sections');
        Route::get('/subjects/{section}', [\App\Http\Controllers\TeacherClassController::class, 'getSubjectsBySection'])->name('subjects');
        Route::get('/assessments/{subject}/{semester}', [\App\Http\Controllers\TeacherClassController::class, 'getAssessmentsBySubject'])->name('assessments');
    });
    
    // Assessment Management (CRUD & Bulk Operations)
    Route::resource('assessments', \App\Http\Controllers\AssessmentController::class);
    Route::post('/assessments/{id}/import', [\App\Http\Controllers\AssessmentController::class, 'importMarks'])->name('assessments.import');
    Route::get('/assessments/{id}/template', [\App\Http\Controllers\AssessmentController::class, 'exportTemplate'])->name('assessments.template');
    Route::get('/assessments/{id}/stats', [\App\Http\Controllers\AssessmentController::class, 'getStats'])->name('assessments.stats');
    
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

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');
});

// Emergency Quick Fix Route - VISIT THIS ONCE: http://localhost:8000/fix-user
Route::get('/fix-user', function () {
    try {
        // 1. Force FRESH Migration (Clean Slate)
        \Illuminate\Support\Facades\Artisan::call('migrate:fresh', [
            '--force' => true,
        ]);

        // 2. Ensure Roles Exist
        $roles = ['admin', 'teacher', 'student', 'parent', 'registrar'];
        foreach ($roles as $role) {
            \Spatie\Permission\Models\Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }

        // 3. Create Users & Profiles
        $admin = \App\Models\User::create(['name' => 'Admin User', 'username' => 'admin', 'password' => bcrypt('password')]);
        $admin->assignRole('admin');

        $teacherUser = \App\Models\User::create(['name' => 'John Teacher', 'username' => 'teacher_john', 'password' => bcrypt('password')]);
        $teacherUser->assignRole('teacher');
        \App\Models\Teacher::create(['user_id' => $teacherUser->id, 'employee_id' => 'T001', 'qualification' => 'M.Ed', 'specialization' => 'Math']);

        $studentUser = \App\Models\User::create(['name' => 'Alice Student', 'username' => 'student_alice', 'password' => bcrypt('password')]);
        $studentUser->assignRole('student');
        // create student record if needed

        $parent = \App\Models\User::create(['name' => 'Mary Parent', 'username' => 'parent_mary', 'password' => bcrypt('password')]);
        $parent->assignRole('parent');

        $registrar = \App\Models\User::create(['name' => 'Jane Registrar', 'username' => 'registrar_jane', 'password' => bcrypt('password')]);
        $registrar->assignRole('registrar');

        return "<h1>✅ SUCCESS!</h1><p>All users AND profiles created successfully.</p><a href='/login'>Go to Login</a>";
        
    } catch (\Throwable $e) {
        return "<h1>❌ ERROR!</h1><pre>" . $e->getMessage() . "</pre><br><pre>" . $e->getTraceAsString() . "</pre>";
    }
});
