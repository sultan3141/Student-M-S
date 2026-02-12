<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TeacherDamageControlController;

Route::middleware(['auth', 'verified'])->prefix('teacher')->name('teacher.')->group(function () {
    Route::get('/dashboard-test', [TeacherDamageControlController::class, 'index'])->name('dashboard-test');
});
