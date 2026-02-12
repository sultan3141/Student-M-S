<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class TeacherDamageControlController extends Controller
{
    public function index()
    {
        return Inertia::render('Teacher/DashboardSimple');
    }
}
