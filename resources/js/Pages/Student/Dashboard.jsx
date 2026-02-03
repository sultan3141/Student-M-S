import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    AcademicCapIcon,
    CalendarDaysIcon,
    CheckCircleIcon,
    ClipboardDocumentListIcon,
    BookOpenIcon,
    UserCircleIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function StudentDashboard({ auth, student, academicYear, subjects, recentMarks, upcomingAssessments, averageScore, marks }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Student Portal</h2>}
        >
            <Head title="Student Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header with Welcome Message */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-3xl font-bold text-gray-900 font-primary">My Dashboard</h1>
                            <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full uppercase tracking-wide shadow-sm">
                                Student
                            </span>
                        </div>
                        <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                            Welcome back, <span className="text-emerald-600 font-black">{student?.user?.name || auth.user.name}</span>
                        </div>
                    </div>

                    {/* Student Info & Semester Status Card */}
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-lg p-8 mb-8 text-white relative overflow-hidden">
                        {/* Decorative Pattern */}
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                            <div>
                                <p className="text-emerald-100 text-xs uppercase tracking-widest font-bold mb-1">Student ID</p>
                                <p className="text-2xl font-black">{student?.student_id || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-emerald-100 text-xs uppercase tracking-widest font-bold mb-1">Grade / Section</p>
                                <p className="text-2xl font-black">{student?.grade?.name || 'N/A'} - {student?.section?.name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-emerald-100 text-xs uppercase tracking-widest font-bold mb-1">Academic Year</p>
                                <p className="text-2xl font-black">{academicYear?.name || 'N/A'}</p>
                            </div>
                            <div className="text-right border-l border-white/20 pl-8 hidden md:block">
                                <p className="text-emerald-100 text-xs uppercase tracking-widest font-bold mb-1">Status</p>
                                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase">Enrolled</span>
                            </div>
                        </div>

                        {/* Semester Access Indicator */}
                        <div className="mt-8 pt-6 border-t border-white/20 flex flex-wrap justify-between items-center gap-4 relative z-10">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <BookOpenIcon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-emerald-100 text-[10px] uppercase font-black tracking-tighter">Current Period</p>
                                    <p className="text-lg font-bold flex items-center gap-2">
                                        {academicYear?.currentSemester?.semester_label || 'Semester 1'}
                                        {academicYear?.currentSemester?.is_open ? (
                                            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-white text-emerald-600 rounded text-[10px] uppercase font-black">
                                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                                Active
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 bg-black/20 text-white/80 rounded text-[10px] uppercase font-black">Locked</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {academicYear?.currentSemester?.is_open && (
                                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                                    <div className="flex -space-x-1">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-emerald-300"></div>
                                    </div>
                                    <p className="text-xs font-bold uppercase tracking-wide">Academic Records are currently updatable</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Attendance / Info */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 group hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                                    <CalendarDaysIcon className="w-6 h-6 text-blue-600" />
                                </div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Attendance</span>
                            </div>
                            <div className="flex items-baseline space-x-2">
                                <span className="text-3xl font-black text-gray-900">95%</span>
                                <span className="text-sm font-bold text-emerald-500">+2% this month</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-2 font-medium">Keep up the great consistency!</p>
                        </div>

                        {/* Recent Performance */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 group hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                                    <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
                                </div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Performance</span>
                            </div>
                            <div className="flex items-baseline space-x-2">
                                <span className="text-3xl font-black text-emerald-600">{averageScore || marks?.average?.toFixed(1) || '0.0'}%</span>
                                <span className="text-sm font-bold text-gray-500">Overall Average</span>
                            </div>
                            <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${averageScore || marks?.average || 0}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Assessments Info */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 group hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                                    <ClipboardDocumentListIcon className="w-6 h-6 text-purple-600" />
                                </div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Assessments</span>
                            </div>
                            <div className="flex items-baseline space-x-2">
                                <span className="text-3xl font-black text-gray-900">{recentMarks?.length || 0}</span>
                                <span className="text-sm font-bold text-gray-500">Completed Items</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-2 font-medium">
                                {upcomingAssessments?.length > 0 ? `${upcomingAssessments.length} pending tasks` : 'All caught up!'}
                            </p>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Recent Marks List */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-900 font-primary">Recent Results</h3>
                                <Link href={route('student.marks')} className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-wider">View All</Link>
                            </div>
                            <div className="p-6 flex-1">
                                {recentMarks && recentMarks.length > 0 ? (
                                    <div className="space-y-4">
                                        {recentMarks.map((mark) => (
                                            <div key={mark.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-900 truncate">{mark.assessment?.title}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] font-black uppercase text-blue-600">{mark.assessment?.subject?.name}</span>
                                                        <span className="text-[10px] text-gray-400">•</span>
                                                        <span className="text-[10px] text-gray-500 italic">{mark.assessment?.assessment_type}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <p className="text-lg font-black text-gray-900">{mark.score}/{mark.assessment?.max_score}</p>
                                                    <p className={`text-[10px] font-bold uppercase ${((mark.score / mark.assessment?.max_score) * 100) >= 75 ? 'text-emerald-600' :
                                                            ((mark.score / mark.assessment?.max_score) * 100) >= 50 ? 'text-yellow-600' :
                                                                'text-red-600'
                                                        }`}>
                                                        {((mark.score / mark.assessment?.max_score) * 100).toFixed(1)}%
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                            <ClipboardDocumentListIcon className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <p className="text-gray-500 text-sm italic">No marks recorded yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Upcoming Assessments List */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="text-lg font-bold text-gray-900 font-primary">Upcoming Tasks</h3>
                            </div>
                            <div className="p-6 flex-1">
                                {upcomingAssessments && upcomingAssessments.length > 0 ? (
                                    <div className="space-y-4">
                                        {upcomingAssessments.map((assessment) => (
                                            <div key={assessment.id} className="flex items-center justify-between p-4 bg-orange-50/50 rounded-xl border-l-4 border-orange-400">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-900 truncate">{assessment.title}</p>
                                                    <p className="text-[10px] font-black text-orange-600 uppercase mt-1">{assessment.subject?.name}</p>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <p className="text-[10px] font-black text-gray-500 uppercase">Due Date</p>
                                                    <p className="text-xs font-bold text-orange-700">
                                                        {assessment.due_date ? new Date(assessment.due_date).toLocaleDateString() : 'TBD'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                            <CheckCircleIcon className="w-8 h-8 text-emerald-200" />
                                        </div>
                                        <p className="text-gray-500 text-sm font-medium">All assessments completed!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer Navigation Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link
                            href={route('student.marks')}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center group hover:bg-emerald-600 transition-all"
                        >
                            <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-white/20 transition-colors">
                                <BookOpenIcon className="w-6 h-6 text-emerald-600 group-hover:text-white" />
                            </div>
                            <div className="ml-4">
                                <h4 className="text-md font-bold text-gray-900 group-hover:text-white">Academic Records</h4>
                                <p className="text-xs text-gray-500 group-hover:text-white/80">View full history</p>
                            </div>
                            <ArrowRightIcon className="w-5 h-5 ml-auto text-gray-300 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all" />
                        </Link>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center group">
                            <div className="p-3 bg-blue-50 rounded-xl">
                                <AcademicCapIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <h4 className="text-md font-bold text-gray-900">Assigned Courses</h4>
                                <p className="text-xs text-gray-500">{subjects?.length || 0} active subjects</p>
                            </div>
                        </div>

                        <Link
                            href={route('student.profile.edit')}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center group hover:bg-gray-900 transition-all"
                        >
                            <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-white/20 transition-colors">
                                <UserCircleIcon className="w-6 h-6 text-gray-600 group-hover:text-white" />
                            </div>
                            <div className="ml-4">
                                <h4 className="text-md font-bold text-gray-900 group-hover:text-white">My Profile</h4>
                                <p className="text-xs text-gray-500 group-hover:text-white/80">Manage settings</p>
                            </div>
                            <ArrowRightIcon className="w-5 h-5 ml-auto text-gray-300 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all" />
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
