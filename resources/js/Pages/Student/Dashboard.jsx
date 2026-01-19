import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import {
    BookOpenIcon,
    ChartBarIcon,
    AcademicCapIcon,
    ClockIcon,
    ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

export default function StudentDashboard({ auth, student, academicYear, subjects }) {
    return (
        <StudentLayout>
            <Head title="Student Dashboard" />

            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl shadow-lg p-8 mb-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Welcome back, {auth.user.name.split(' ')[0]}! 👋</h1>
                        <p className="text-emerald-100 text-lg">
                            Ready to learn? You have <span className="font-bold text-white">4 classes</span> today.
                        </p>
                    </div>
                    <div className="mt-6 md:mt-0 bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-100 mb-1">Current Term</p>
                        <p className="text-xl font-bold">{academicYear?.name || '2025-2026 Term 1'}</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mr-5">
                        <BookOpenIcon className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Enrolled Courses</p>
                        <p className="text-2xl font-bold text-gray-900">{subjects?.length || 8}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mr-5">
                        <ArrowTrendingUpIcon className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Average GPA</p>
                        <p className="text-2xl font-bold text-gray-900">3.8</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 mr-5">
                        <ClockIcon className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Attendance</p>
                        <p className="text-2xl font-bold text-gray-900">98%</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Course List (Left 2/3) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900">My Courses</h3>
                        <Link href="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">View All</Link>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {subjects && subjects.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {subjects.map((subject) => (
                                    <div key={subject.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                                                {subject.code?.substring(0, 2) || 'MA'}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{subject.name}</h4>
                                                <p className="text-sm text-gray-500">{subject.teacher_name || 'Mr. Teacher'}</p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">In Progress</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // Fallback mockup data if no subjects
                            <div className="divide-y divide-gray-100">
                                {['Advanced Mathematics', 'Physics 101', 'World History', 'English Literature'].map((course, idx) => (
                                    <div key={idx} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group">
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-md
                                                ${idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-indigo-500' : idx === 2 ? 'bg-orange-500' : 'bg-pink-500'}`}>
                                                {course.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{course}</h4>
                                                <p className="text-sm text-gray-500">Room 10{idx + 1} • {10 + idx}:00 AM</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-lg font-bold text-gray-900">9{5 - idx}%</span>
                                            <span className="text-xs text-gray-400">Current Grade</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar (Schedule/Assignments) */}
                <div className="space-y-6">
                    {/* Next Class */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Up Next</h3>
                        <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
                            <div className="flex justify-between items-start mb-2">
                                <span className="px-2 py-1 bg-white text-indigo-600 text-[10px] font-bold uppercase rounded shadow-sm">11:00 AM</span>
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            </div>
                            <h4 className="font-bold text-indigo-900">Physics Lab</h4>
                            <p className="text-sm text-indigo-600 mb-3">Room 302 • Mr. Anderson</p>
                            <button className="w-full py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors">
                                View Materials
                            </button>
                        </div>
                    </div>

                    {/* Pending Assignments */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Assignments</h3>
                            <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">2</span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start pb-4 border-b border-gray-50">
                                <div className="mt-1 min-w-[4px] h-10 bg-red-500 rounded-full mr-3"></div>
                                <div>
                                    <h5 className="font-bold text-gray-900 text-sm">Calculus Problem Set</h5>
                                    <p className="text-xs text-red-500 font-semibold mt-1">Due Today, 5:00 PM</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="mt-1 min-w-[4px] h-10 bg-orange-400 rounded-full mr-3"></div>
                                <div>
                                    <h5 className="font-bold text-gray-900 text-sm">History Essay Draft</h5>
                                    <p className="text-xs text-gray-500 mt-1">Due Tomorrow</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
