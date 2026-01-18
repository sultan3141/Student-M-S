import { Head } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import StatsCard from '@/Components/Dashboard/StatsCard';
import {
    UserGroupIcon,
    ClipboardDocumentListIcon,
    ClockIcon,
    CheckBadgeIcon,
    SparklesIcon,
    CalendarDaysIcon,
    AcademicCapIcon,
    ChartBarIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline';

export default function Dashboard({ stats, recentActivity, deadlines, teacher }) {
    return (
        <TeacherLayout>
            <Head title="Teacher Dashboard" />

            {/* Welcome Banner with Gradient */}
            <div className="relative mb-8 overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-3xl shadow-2xl">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-72 h-72 bg-white opacity-5 rounded-full blur-3xl"></div>
                <div className="relative px-8 py-10">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                <SparklesIcon className="w-6 h-6 text-yellow-300 animate-pulse" />
                                <span className="text-blue-200 text-sm font-semibold uppercase tracking-wider">Dashboard Overview</span>
                            </div>
                            <h1 className="text-4xl font-black text-white mb-2">
                                Welcome back, {teacher.user.name}!
                            </h1>
                            <p className="text-blue-100 text-lg font-medium">
                                You have <span className="text-yellow-300 font-bold">{stats.pendingMarks}</span> mark sheets pending for submission this week.
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="w-32 h-32 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/20">
                                <AcademicCapIcon className="w-16 h-16 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Students"
                    value={stats.totalStudents}
                    icon={UserGroupIcon}
                    color="blue"
                    trend={+12}
                />
                <StatsCard
                    title="Pending Marks"
                    value={stats.pendingMarks}
                    icon={ClipboardDocumentListIcon}
                    color="orange"
                    trend={-8}
                />
                <StatsCard
                    title="Completion Rate"
                    value={`${stats.completionRate}%`}
                    icon={CheckBadgeIcon}
                    color="green"
                    trend={+5}
                />
                <StatsCard
                    title="This Week"
                    value="23"
                    icon={ClockIcon}
                    color="purple"
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                            Recent Activity
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="flow-root">
                            <ul className="-mb-8">
                                {recentActivity && recentActivity.slice(0, 5).map((activity, idx) => (
                                    <li key={idx}>
                                        <div className="relative pb-8">
                                            {idx !== recentActivity.slice(0, 5).length - 1 && (
                                                <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gradient-to-b from-blue-200 to-transparent" aria-hidden="true"></span>
                                            )}
                                            <div className="relative flex items-start space-x-3 group">
                                                <div className="relative">
                                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-4 ring-white group-hover:scale-110 transition-transform">
                                                        <ClipboardDocumentListIcon className="h-5 w-5 text-white" />
                                                    </div>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">{activity}</p>
                                                        <p className="mt-0.5 text-xs text-gray-500">2 hours ago</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Upcoming Deadlines */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center">
                            <CalendarDaysIcon className="w-5 h-5 mr-2 text-orange-600" />
                            Upcoming Deadlines
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {deadlines && deadlines.slice(0, 5).map((deadline, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all duration-200 group">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform">
                                            {idx + 20}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{deadline.title || deadline}</p>
                                            <p className="text-xs text-gray-500">{deadline.subject || 'Mathematics'}</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 text-xs font-bold text-orange-700 bg-orange-100 rounded-full">
                                        {deadline.days_left || '3'} days
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions - Modern Floating Buttons */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <a href={route('teacher.marks.create')} className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
                    <div className="relative">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-white font-bold text-sm">Enter Marks</p>
                    </div>
                </a>

                <a href={route('teacher.reports.index')} className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
                    <div className="relative">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <ChartBarIcon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-white font-bold text-sm">View Reports</p>
                    </div>
                </a>

                <a href="#" className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
                    <div className="relative">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <UserGroupIcon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-white font-bold text-sm">My Classes</p>
                    </div>
                </a>

                <a href={route('teacher.profile.edit')} className="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
                    <div className="relative">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <UserCircleIcon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-white font-bold text-sm">My Profile</p>
                    </div>
                </a>
            </div>
        </TeacherLayout>
    );
}
