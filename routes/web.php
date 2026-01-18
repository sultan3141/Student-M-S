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

// Public Admission Route
Route::get('/admissions/apply', [\App\Http\Controllers\AdmissionController::class, 'create'])->name('admissions.create');
Route::post('/admissions/apply', [\App\Http\Controllers\AdmissionController::class, 'store'])->name('admissions.store');

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
    Route::get('/records', [\App\Http\Controllers\StudentController::class, 'academicRecords'])->name('student.records');
    Route::get('/profile/edit', [\App\Http\Controllers\StudentController::class, 'profileEdit'])->name('student.profile.edit');
    Route::put('/profile', [\App\Http\Controllers\StudentController::class, 'profileUpdate'])->name('student.profile.update');
    Route::put('/password', [\App\Http\Controllers\StudentController::class, 'passwordUpdate'])->name('student.password.update');
    
    // Admission Application (FR-02)
    Route::get('/admission/apply', [\App\Http\Controllers\StudentController::class, 'admissionForm'])->name('student.admission.form');
    Route::post('/admission/apply', [\App\Http\Controllers\StudentController::class, 'admissionStore'])->name('student.admission.store');
    
    // Annual Registration (FR-04, FR-05)
    Route::get('/registration', [\App\Http\Controllers\StudentController::class, 'registrationForm'])->name('student.registration.form');
    Route::post('/registration', [\App\Http\Controllers\StudentController::class, 'registrationStore'])->name('student.registration.store');
    
    // Grade Audit (FR-06)
    Route::get('/grade-audit', [\App\Http\Controllers\StudentController::class, 'gradeAudit'])->name('student.grade-audit');
});

// Teacher Routes
Route::middleware(['auth', 'verified'])->prefix('teacher')->name('teacher.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [\App\Http\Controllers\TeacherDashboardController::class, 'index'])->name('dashboard');
    
    // Marks Management
    Route::get('/marks', [\App\Http\Controllers\TeacherMarkController::class, 'index'])->name('marks.index');
    Route::get('/marks/enter', [\App\Http\Controllers\TeacherMarkController::class, 'create'])->name('marks.create');
    Route::post('/marks/store', [\App\Http\Controllers\TeacherMarkController::class, 'store'])->name('marks.store');
    
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

    // Attendance Management
    Route::get('/attendance', [\App\Http\Controllers\TeacherAttendanceController::class, 'index'])->name('attendance.index');
    Route::get('/attendance/create', [\App\Http\Controllers\TeacherAttendanceController::class, 'create'])->name('attendance.create');
    Route::post('/attendance', [\App\Http\Controllers\TeacherAttendanceController::class, 'store'])->name('attendance.store');

    // Profile
    Route::get('/profile', [\App\Http\Controllers\TeacherProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [\App\Http\Controllers\TeacherProfileController::class, 'update'])->name('profile.update');

    Route::get('/assignments/subjects', [\App\Http\Controllers\TeacherAssignmentController::class, 'getAssignedSubjects']);
});

// School Director Routes
Route::middleware(['auth', 'role:school_director'])->prefix('director')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\SchoolDirectorController::class, 'dashboard'])->name('director.dashboard');
    
    // Teacher Management
    Route::get('/teachers', [\App\Http\Controllers\SchoolDirectorController::class, 'teachersIndex'])->name('director.teachers.index');
    Route::get('/teachers/create', [\App\Http\Controllers\SchoolDirectorController::class, 'teachersCreate'])->name('director.teachers.create');
    Route::post('/teachers', [\App\Http\Controllers\SchoolDirectorController::class, 'teachersStore'])->name('director.teachers.store');

    // Reports / Transcripts
    Route::get('/reports', [\App\Http\Controllers\SchoolDirectorReportController::class, 'index'])->name('director.reports.index');
    Route::get('/reports/transcript/{id}', [\App\Http\Controllers\SchoolDirectorReportController::class, 'transcript'])->name('director.reports.transcript');

    // Academic Year Management
    Route::get('/academic-years', [\App\Http\Controllers\AcademicYearController::class, 'index'])->name('director.academic-years.index');
    Route::post('/academic-years', [\App\Http\Controllers\AcademicYearController::class, 'store'])->name('director.academic-years.store');
    Route::post('/academic-years/{id}/activate', [\App\Http\Controllers\AcademicYearController::class, 'activate'])->name('director.academic-years.activate');
});

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'role:parent'])->prefix('parent')->name('parent.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Parent/Dashboard');
    })->name('dashboard');
});

