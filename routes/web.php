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
    $user = Auth::user();

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

require __DIR__.'/auth.php'; 

Route::middleware(['auth', 'role:registrar'])->prefix('registrar')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\RegistrarController::class, 'dashboard'])->name('registrar.dashboard');
    Route::get('/students/create', [\App\Http\Controllers\RegistrarController::class, 'create'])->name('registrar.students.create');
    Route::post('/students', [\App\Http\Controllers\RegistrarController::class, 'store'])->name('registrar.students.store');

    Route::resource('payments', \App\Http\Controllers\RegistrarPaymentController::class)
        ->only(['index', 'create', 'store'])
        ->names('registrar.payments');
});

Route::middleware(['auth', 'role:student'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\StudentController::class, 'dashboard'])->name('dashboard');

    // Annual Registration
    Route::get('/registration', [\App\Http\Controllers\StudentRegistrationController::class, 'create'])->name('registration.create');
    Route::post('/registration', [\App\Http\Controllers\StudentRegistrationController::class, 'store'])->name('registration.store');
    
    // Redirect legacy/wrong URL
    Route::get('/applications/create', function() {
        return redirect()->route('student.registration.create');
    });
    
    // Profile & Settings
    Route::get('/profile', [\App\Http\Controllers\StudentProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [\App\Http\Controllers\StudentProfileController::class, 'update'])->name('profile.update');
    Route::get('/password', [\App\Http\Controllers\StudentProfileController::class, 'editPassword'])->name('password.edit');
    


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

// Director/Admin Routes
Route::middleware(['auth', 'role:admin'])->prefix('director')->name('director.')->group(function () {
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
    
    // Student Statistics
    Route::get('/statistics/students', [\App\Http\Controllers\DirectorStudentStatisticsController::class, 'index'])->name('statistics.students');
    Route::get('/statistics/students/data', [\App\Http\Controllers\DirectorStudentStatisticsController::class, 'getStatisticsJson'])->name('statistics.students.data');
    
    // Communication Center
    Route::resource('announcements', \App\Http\Controllers\DirectorCommunicationController::class);
    Route::get('/announcements/{id}/analytics', [\App\Http\Controllers\DirectorCommunicationController::class, 'getAnalytics'])->name('announcements.analytics');
});

// Legacy Admin Route (for backward compatibility)
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return redirect()->route('director.dashboard');
    })->name('dashboard');
});

// Emergency Quick Fix Route - VISIT THIS ONCE: http://localhost:8000/fix-user
// Emergency Quick Fix Route - VISIT THIS ONCE: http://localhost:8000/fix-user
Route::get('/fix-user', function () {
    try {
        DB::beginTransaction();

        // 1. Force FRESH Migration (Clean Slate)
        \Illuminate\Support\Facades\Artisan::call('migrate:fresh', [
            '--force' => true,
        ]);

        // 2. Ensure Roles Exist
        $roles = ['admin', 'teacher', 'student', 'parent', 'registrar'];
        foreach ($roles as $role) {
            \Spatie\Permission\Models\Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }

        // 3. Create Users
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
            \App\Models\AssessmentType::create(['name' => $type, 'weight' => 25]);
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
