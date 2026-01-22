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
    $user = auth()->user();
    
    if ($user->hasRole('school_director')) {
        return redirect()->route('school-director.dashboard');
    } elseif ($user->hasRole('teacher')) {
        return redirect()->route('teacher.dashboard');
    } elseif ($user->hasRole('student')) {
        return redirect()->route('student.dashboard');
    } elseif ($user->hasRole('registrar')) {
        return redirect()->route('registrar.dashboard');
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

Route::middleware(['auth', 'role:student'])->prefix('student')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\StudentController::class, 'dashboard'])->name('student.dashboard');
    Route::get('/profile', [\App\Http\Controllers\StudentProfileController::class, 'edit'])->name('student.profile.edit');
    Route::patch('/profile', [\App\Http\Controllers\StudentProfileController::class, 'update'])->name('student.profile.update');
    Route::get('/marks', [\App\Http\Controllers\StudentController::class, 'marks'])->name('student.marks');
});

// Teacher routes
Route::middleware(['auth', 'role:teacher'])->prefix('teacher')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\TeacherController::class, 'dashboard'])->name('teacher.dashboard');
    Route::resource('assessments', \App\Http\Controllers\AssessmentController::class);
    Route::get('/assessments/{assessment}/marks/upload', [\App\Http\Controllers\MarkController::class, 'uploadForm'])->name('marks.upload');
    Route::post('/assessments/{assessment}/marks', [\App\Http\Controllers\MarkController::class, 'bulkStore'])->name('marks.store');
});

// School Director routes
Route::middleware(['auth', 'role:school_director'])->prefix('school-director')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\SchoolDirectorController::class, 'dashboard'])->name('school-director.dashboard');
    Route::get('/teachers', [\App\Http\Controllers\SchoolDirectorController::class, 'teachers'])->name('school-director.teachers');
    Route::get('/assessments', [\App\Http\Controllers\SchoolDirectorController::class, 'assessments'])->name('school-director.assessments');
    Route::get('/reports', [\App\Http\Controllers\SchoolDirectorController::class, 'reports'])->name('school-director.reports');
});

// Reports routes
Route::middleware(['auth'])->prefix('reports')->group(function () {
    Route::get('/student/{student}', [\App\Http\Controllers\ReportController::class, 'studentPerformance'])->name('reports.student');
    Route::get('/class/{grade}', [\App\Http\Controllers\ReportController::class, 'classPerformance'])->name('reports.class');
    Route::get('/teacher-assessments', [\App\Http\Controllers\ReportController::class, 'teacherAssessments'])->name('reports.teacher-assessments');
});

// Notifications routes
Route::middleware(['auth'])->prefix('notifications')->group(function () {
    Route::get('/student', [\App\Http\Controllers\NotificationController::class, 'getStudentNotifications'])->name('notifications.student');
    Route::post('/mark-read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.mark-read');
});

// Search routes
Route::middleware(['auth'])->prefix('search')->group(function () {
    Route::get('/global', [\App\Http\Controllers\SearchController::class, 'global'])->name('search.global');
    Route::get('/assessments', [\App\Http\Controllers\SearchController::class, 'assessments'])->name('search.assessments');
});
