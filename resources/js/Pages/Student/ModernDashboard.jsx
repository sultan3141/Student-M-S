import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import SemesterWidget from '@/Components/SemesterWidget';
import {
    AcademicCapIcon,
    CalendarDaysIcon,
    ChartBarIcon,
    UserGroupIcon,
    HeartIcon,
    TrophyIcon,
    SparklesIcon,
    FireIcon,
    BoltIcon,
    StarIcon,
    RocketLaunchIcon,
    LightBulbIcon,
} from '@heroicons/react/24/outline';

export default function ModernDashboard({ auth, student, academicYear, attendance, marks, subjects, schedule, notifications, currentSemester }) {
    const [activeTab, setActiveTab] = useState('academic');

    // Calculate real stats from data
    const streak = 7; // This could be calculated from attendance
    const goalsCompleted = 4; // This would come from a goals system
    const totalGoals = 7;
    const moodScore = 8.5; // This would come from a wellness tracking system
    const energyLevel = 85;

    // Get real data with fallbacks
    const currentAverage = marks?.average || 0;
    const currentRank = marks?.rank || '-';
    const totalStudents = marks?.totalStudents || 0;
    const attendanceRate = attendance?.rate || 100;
    const recentMarks = marks?.recent || [];
    const recentAttendance = attendance?.recent || [];

    return (
        <StudentLayout>
            <Head title="My Learning Universe" />

            {/* Semester Widget - Full Width */}
            {currentSemester && (
                <div className="mb-8">
                    <SemesterWidget semester={currentSemester} userType="student" />
                </div>
            )}

            {/* Personalized Welcome Header */}
            <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                        <span className="text-4xl">🎉</span>
                        <h1 className="text-3xl font-bold">Welcome Back, {student?.user?.name?.split(' ')[0] || 'Student'}!</h1>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm mb-6 opacity-90">
                        <span>{student?.grade?.name || 'Grade 10'}</span>
                        <span>•</span>
                        <span>Section {student?.section?.name || 'A'}</span>
                        {student?.stream?.name && (
                            <>
                                <span>•</span>
                                <span>{student.stream.name} Stream</span>
                            </>
                        )}
                    </div>

                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
                        <p className="text-sm italic mb-2">"Believe you can and you're halfway there." - Theodore Roosevelt</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-1">
                                <ChartBarIcon className="h-5 w-5" />
                                <span className="text-xs opacity-80">Current Average</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-2xl font-bold">{currentAverage.toFixed(1)}%</span>
                                {currentAverage >= 90 && <TrophyIcon className="h-5 w-5 text-yellow-300" />}
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-1">
                                <TrophyIcon className="h-5 w-5" />
                                <span className="text-xs opacity-80">Class Rank</span>
                            </div>
                            <span className="text-2xl font-bold">#{currentRank}/{totalStudents}</span>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-1">
                                <CalendarDaysIcon className="h-5 w-5" />
                                <span className="text-xs opacity-80">Attendance</span>
                            </div>
                            <span className="text-2xl font-bold">{attendanceRate}%</span>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-1">
                                <FireIcon className="h-5 w-5" />
                                <span className="text-xs opacity-80">Streak</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span className="text-2xl font-bold">{streak}</span>
                                <span className="text-sm">days</span>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-1">
                                <AcademicCapIcon className="h-5 w-5" />
                                <span className="text-xs opacity-80">Subjects</span>
                            </div>
                            <span className="text-2xl font-bold">{marks?.totalSubjects || 0}</span>
                        </div>
                    </div>

                    {/* Daily Motivation */}
                    {currentAverage > 0 && (
                        <div className="mt-4 bg-green-500/30 backdrop-blur-sm rounded-lg p-3 border border-green-300/30">
                            <div className="flex items-center space-x-2">
                                <SparklesIcon className="h-5 w-5 text-yellow-300" />
                                <span className="text-sm font-medium">
                                    {currentAverage >= 90 
                                        ? `Outstanding! Your ${currentAverage.toFixed(0)}% average shows exceptional excellence!`
                                        : currentAverage >= 75
                                        ? `Great work! Your ${currentAverage.toFixed(0)}% average shows consistent progress!`
                                        : `Keep pushing! You're building momentum with ${currentAverage.toFixed(0)}%!`
                                    }
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Dashboard - Modular Layout */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <RocketLaunchIcon className="h-7 w-7 text-blue-600" />
                    <span>Your Learning Universe</span>
                </h2>

                {/* Module Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Academic Galaxy */}
                    <Link
                        href={route('student.academic.semesters')}
                        className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer"
                    >
                        <div className="text-4xl mb-3">🪐</div>
                        <h3 className="text-xl font-bold mb-2">Academic Galaxy</h3>
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="opacity-90">Avg Score</span>
                                <span className="font-bold text-lg">{currentAverage.toFixed(1)}%</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <StarIcon className="h-4 w-4" />
                                <span className="text-sm">
                                    {currentRank && totalStudents 
                                        ? `Rank #${currentRank} of ${totalStudents}`
                                        : 'Keep learning!'
                                    }
                                </span>
                            </div>
                        </div>
                        <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg py-2 text-sm font-medium transition-colors">
                            Explore
                        </button>
                    </Link>

                    {/* Social Hub */}
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer">
                        <div className="text-4xl mb-3">👥</div>
                        <h3 className="text-xl font-bold mb-2">Social Hub</h3>
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="opacity-90">Friends</span>
                                <span className="font-bold text-lg">248</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span className="text-sm">💬 12 New Messages</span>
                            </div>
                        </div>
                        <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg py-2 text-sm font-medium transition-colors">
                            Connect
                        </button>
                    </div>

                    {/* Wellness Zone */}
                    <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer">
                        <div className="text-4xl mb-3">😊</div>
                        <h3 className="text-xl font-bold mb-2">Wellness Zone</h3>
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="opacity-90">Mood Score</span>
                                <span className="font-bold text-lg">{moodScore}/10</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <BoltIcon className="h-4 w-4" />
                                <span className="text-sm">{energyLevel}% Energy</span>
                            </div>
                        </div>
                        <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg py-2 text-sm font-medium transition-colors">
                            Check-in
                        </button>
                    </div>
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Goals Tracker */}
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer">
                        <div className="text-4xl mb-3">🎯</div>
                        <h3 className="text-xl font-bold mb-2">Goals Tracker</h3>
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="opacity-90">Weekly Goals</span>
                                <span className="font-bold text-lg">{goalsCompleted}/{totalGoals}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span className="text-sm">✅ 3 Ahead of Plan</span>
                            </div>
                        </div>
                        <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg py-2 text-sm font-medium transition-colors">
                            Set Goals
                        </button>
                    </div>

                    {/* Skills Lab */}
                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer">
                        <div className="text-4xl mb-3">🔬</div>
                        <h3 className="text-xl font-bold mb-2">Skills Lab</h3>
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="opacity-90">Skills Leveling</span>
                                <span className="font-bold text-lg">8</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span className="text-sm">⬆️ 2 New This Month</span>
                            </div>
                        </div>
                        <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg py-2 text-sm font-medium transition-colors">
                            Build Skills
                        </button>
                    </div>

                    {/* Career Path */}
                    <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer">
                        <div className="text-4xl mb-3">💼</div>
                        <h3 className="text-xl font-bold mb-2">Career Path</h3>
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="opacity-90">Pathways Explored</span>
                                <span className="font-bold text-lg">3</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span className="text-sm">👀 12 More Options</span>
                            </div>
                        </div>
                        <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg py-2 text-sm font-medium transition-colors">
                            Explore
                        </button>
                    </div>
                </div>

                {/* Personalized Spotlight */}
                {recentMarks.length > 0 && (
                    <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-orange-500 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                            <LightBulbIcon className="h-6 w-6 text-orange-600" />
                            <p className="text-gray-800 font-medium">
                                Latest: {recentMarks[0].subject} - {recentMarks[0].percentage}% 
                                {recentMarks[0].percentage >= 90 ? ' 🚀 Excellent work!' : 
                                 recentMarks[0].percentage >= 75 ? ' 👍 Good job!' : 
                                 ' 💪 Keep improving!'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Marks */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                            <ChartBarIcon className="h-5 w-5 text-emerald-600" />
                            <span>Recent Performance</span>
                        </h3>
                    </div>
                    <div className="p-6">
                        {recentMarks && recentMarks.length > 0 ? (
                            <div className="space-y-3">
                                {recentMarks.map((mark, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-shadow">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{mark.subject}</p>
                                            <p className="text-xs text-gray-500">{mark.assessment}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-xl font-bold ${
                                                mark.percentage >= 90 ? 'text-green-600' :
                                                mark.percentage >= 75 ? 'text-blue-600' :
                                                mark.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                                            }`}>{mark.percentage}%</p>
                                            <p className="text-xs text-gray-500">{mark.score}/{mark.maxScore}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <AcademicCapIcon className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No marks recorded yet</p>
                                <p className="text-sm text-gray-400 mt-1">Your academic journey starts here!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Attendance */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                            <CalendarDaysIcon className="h-5 w-5 text-blue-600" />
                            <span>Attendance Tracker</span>
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="mb-4 p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg text-white">
                            <div className="flex items-center justify-between">
                                <span className="text-sm opacity-90">Attendance Rate</span>
                                <span className="text-3xl font-bold">{attendanceRate}%</span>
                            </div>
                            <div className="mt-2 bg-white/20 rounded-full h-2">
                                <div 
                                    className="bg-white rounded-full h-2 transition-all" 
                                    style={{ width: `${attendanceRate}%` }}
                                ></div>
                            </div>
                        </div>
                        
                        {recentAttendance && recentAttendance.length > 0 ? (
                            <div className="space-y-2">
                                {recentAttendance.map((record, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-2 h-2 rounded-full ${
                                                record.status === 'Present' ? 'bg-green-500' :
                                                record.status === 'Absent' ? 'bg-red-500' : 'bg-yellow-500'
                                            }`}></div>
                                            <span className="text-sm text-gray-700">{record.date}</span>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            record.status === 'Present' ? 'bg-green-100 text-green-800' :
                                            record.status === 'Absent' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {record.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <CalendarDaysIcon className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No attendance records yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
