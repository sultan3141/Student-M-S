import { Head, Link } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import SemesterWidget from '@/Components/SemesterWidget';
import StudentDonutChart from '@/Components/Charts/StudentDonutChart';
import PerformanceTrendChart from '@/Components/Charts/PerformanceTrendChart';
import GradeDistributionChart from '@/Components/Charts/GradeDistributionChart';
import {
    UserGroupIcon,
    AcademicCapIcon,
    ClipboardDocumentCheckIcon,
    ClockIcon,
    CalendarIcon,
    ArrowRightIcon,
    BookOpenIcon,
    ChartPieIcon,
    ChartBarIcon,
    SparklesIcon,
    FireIcon,
    TrophyIcon
} from '@heroicons/react/24/outline';
import ErrorBoundary from '@/Components/ErrorBoundary';

export default function Dashboard({ 
    stats = {}, 
    teacher = {}, 
    currentSemester = null, 
    todaySchedule = [], 
    today = '',
    gradeDistribution = [],
    performanceTrend = [],
    assessmentDistribution = {}
}) {
    const safeRoute = (name, params = undefined) => {
        try {
            return route(name, params);
        } catch (e) {
            console.error(`Route error for ${name}:`, e);
            return '#';
        }
    };

    // Debug logging
    console.log('Dashboard Data:', {
        gradeDistribution,
        performanceTrend,
        assessmentDistribution,
        stats
    });

    return (
        <TeacherLayout>
            <ErrorBoundary>
                <Head title="Teacher Dashboard" />

                {/* Modern Gradient Header */}
                <div className="mb-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-5 rounded-3xl"></div>
                    <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white to-blue-50/30 border border-blue-100 shadow-lg shadow-blue-100/50">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                <SparklesIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                                    Welcome Back, {teacher?.user?.name?.split(' ')[0] || 'Teacher'}!
                                </h1>
                                <p className="text-sm font-semibold text-gray-500 mt-1">
                                    {today} • Your teaching command center
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Semester Status Widget */}
                {currentSemester && (
                    <div className="mb-8">
                        <SemesterWidget semester={currentSemester} userType="teacher" />
                    </div>
                )}

                {/* Modern Stats Grid with Gradients */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <UserGroupIcon className="h-6 w-6 text-white" />
                                </div>
                                <TrophyIcon className="h-5 w-5 text-white/40" />
                            </div>
                            <p className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1">Students</p>
                            <p className="text-3xl font-black text-white">{stats.totalStudents || 0}</p>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <AcademicCapIcon className="h-6 w-6 text-white" />
                                </div>
                                <FireIcon className="h-5 w-5 text-white/40" />
                            </div>
                            <p className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1">Classes</p>
                            <p className="text-3xl font-black text-white">{stats.activeClasses || 0}</p>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <ClipboardDocumentCheckIcon className="h-6 w-6 text-white" />
                                </div>
                                <SparklesIcon className="h-5 w-5 text-white/40" />
                            </div>
                            <p className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1">Pending</p>
                            <p className="text-3xl font-black text-white">{stats.pendingMarks || 0}</p>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <ChartPieIcon className="h-6 w-6 text-white" />
                                </div>
                                <ChartBarIcon className="h-5 w-5 text-white/40" />
                            </div>
                            <p className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1">Attendance</p>
                            <p className="text-3xl font-black text-white">94.2%</p>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <BookOpenIcon className="h-6 w-6 text-white" />
                                </div>
                                <AcademicCapIcon className="h-5 w-5 text-white/40" />
                            </div>
                            <p className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1">Subjects</p>
                            <p className="text-3xl font-black text-white">{stats.totalSubjects || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Modern Schedule Section */}
                {todaySchedule && Array.isArray(todaySchedule) && todaySchedule.length > 0 && (
                    <div className="bg-white rounded-3xl p-8 mb-8 shadow-xl border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                    <CalendarIcon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-gray-900">Today's Schedule</h2>
                                    <p className="text-xs text-gray-500 font-semibold">{today}</p>
                                </div>
                            </div>
                            <Link
                                href={safeRoute('teacher.schedule')}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all hover:scale-105"
                            >
                                View All
                                <ArrowRightIcon className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {todaySchedule.map((slot, index) => {
                                const activityName = slot.activity || 'Class';
                                const isBreak = activityName.toLowerCase().includes('break') ||
                                    activityName.toLowerCase().includes('lunch');
                                
                                const gradientColors = [
                                    'from-blue-500 to-cyan-500',
                                    'from-purple-500 to-pink-500',
                                    'from-emerald-500 to-teal-500',
                                    'from-orange-500 to-red-500',
                                    'from-indigo-500 to-purple-500',
                                    'from-rose-500 to-pink-500'
                                ];
                                const gradient = gradientColors[index % gradientColors.length];

                                return (
                                    <div key={index} className="group relative overflow-hidden bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300">
                                        <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${gradient}`}></div>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
                                                {isBreak ? <ClockIcon className="w-5 h-5 text-white" /> : <AcademicCapIcon className="w-5 h-5 text-white" />}
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-bold text-gray-900 block">{slot.start_time}</span>
                                                <span className="text-xs font-semibold text-gray-400">{slot.end_time}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-gray-900 mb-2">
                                                {slot.grade} • {slot.section}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${isBreak ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                                                    {slot.activity}
                                                </span>
                                                {slot.location && (
                                                    <span className="text-xs font-semibold text-gray-400">{slot.location}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Analytics Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Grade Distribution Chart */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                                <ChartBarIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900">Student Distribution</h2>
                                <p className="text-xs text-gray-500 font-semibold">By grade level</p>
                            </div>
                        </div>
                        {gradeDistribution && gradeDistribution.length > 0 ? (
                            <GradeDistributionChart data={gradeDistribution} />
                        ) : (
                            <div className="h-64 flex items-center justify-center text-gray-400">
                                <div className="text-center">
                                    <ChartBarIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                    <p className="text-sm">No grade distribution data</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Assessment Distribution Donut Chart */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg">
                                <ChartPieIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900">Assessment Types</h2>
                                <p className="text-xs text-gray-500 font-semibold">Distribution overview</p>
                            </div>
                        </div>
                        {assessmentDistribution && assessmentDistribution.total > 0 ? (
                            <StudentDonutChart 
                                data={assessmentDistribution} 
                                title="Assessment Distribution"
                            />
                        ) : (
                            <div className="h-64 flex items-center justify-center text-gray-400">
                                <div className="text-center">
                                    <ChartPieIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                    <p className="text-sm">No assessment data</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Performance Trend Chart */}
                <div className="bg-white rounded-3xl p-8 mb-8 shadow-xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                            <ChartBarIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900">Performance Trend</h2>
                            <p className="text-xs text-gray-500 font-semibold">Monthly average marks</p>
                        </div>
                    </div>
                    {performanceTrend && performanceTrend.length > 0 ? (
                        <div className="h-64">
                            <PerformanceTrendChart data={performanceTrend} />
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <ChartBarIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                <p className="text-sm">No performance trend data</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modern Quick Actions with Gradients */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Link
                        href={route('teacher.attendance.index')}
                        className="group relative overflow-hidden bg-white rounded-3xl p-8 border border-gray-100 hover:border-blue-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative flex items-center gap-6">
                            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl group-hover:shadow-2xl transition-all">
                                <CalendarIcon className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Daily Roll Call</p>
                                <p className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">Record Attendance</p>
                                <p className="text-xs text-gray-500 mt-1">Mark student presence today</p>
                            </div>
                            <ArrowRightIcon className="w-6 h-6 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" />
                        </div>
                    </Link>

                    <Link
                        href={route('teacher.assessments-simple.index')}
                        className="group relative overflow-hidden bg-white rounded-3xl p-8 border border-gray-100 hover:border-purple-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative flex items-center gap-6">
                            <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl group-hover:shadow-2xl transition-all">
                                <ClipboardDocumentCheckIcon className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Active Assessments</p>
                                <p className="text-xl font-black text-gray-900 group-hover:text-purple-600 transition-colors">View Registry</p>
                                <p className="text-xs text-gray-500 mt-1">Manage all assessments</p>
                            </div>
                            <ArrowRightIcon className="w-6 h-6 text-gray-300 group-hover:text-purple-600 group-hover:translate-x-2 transition-all" />
                        </div>
                    </Link>
                </div>

                {/* Recent Activities & Upcoming Deadlines */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Recent Activities */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
                                    <ClockIcon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-gray-900">Recent Activity</h2>
                                    <p className="text-xs text-gray-500 font-semibold">Latest updates</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {[
                                { icon: '📝', title: 'Math Quiz Graded', desc: 'Grade 10A - 28 students', time: '2 hours ago', color: 'bg-blue-50 text-blue-600' },
                                { icon: '✅', title: 'Attendance Marked', desc: 'Grade 11B - Morning session', time: '5 hours ago', color: 'bg-emerald-50 text-emerald-600' },
                                { icon: '📊', title: 'Results Published', desc: 'Science Test - Grade 9C', time: '1 day ago', color: 'bg-purple-50 text-purple-600' },
                                { icon: '📚', title: 'Assignment Created', desc: 'English Essay - Grade 12A', time: '2 days ago', color: 'bg-amber-50 text-amber-600' }
                            ].map((activity, index) => (
                                <div key={index} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group">
                                    <div className={`w-12 h-12 rounded-xl ${activity.color} flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                        {activity.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-900 mb-1">{activity.title}</p>
                                        <p className="text-xs text-gray-500">{activity.desc}</p>
                                    </div>
                                    <span className="text-xs font-semibold text-gray-400 whitespace-nowrap">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Deadlines */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl shadow-lg">
                                    <CalendarIcon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-gray-900">Upcoming Deadlines</h2>
                                    <p className="text-xs text-gray-500 font-semibold">Don't miss these</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {[
                                { subject: 'Mathematics', task: 'Midterm Submission', days: 3, urgent: true },
                                { subject: 'Science', task: 'Final Grades', days: 5, urgent: false },
                                { subject: 'English', task: 'Essay Review', days: 7, urgent: false },
                                { subject: 'Physics', task: 'Lab Reports', days: 10, urgent: false }
                            ].map((deadline, index) => (
                                <div key={index} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-16 h-16 rounded-xl ${deadline.urgent ? 'bg-gradient-to-br from-red-500 to-rose-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'} flex flex-col items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                            <span className="text-2xl font-black">{deadline.days}</span>
                                            <span className="text-xs font-bold">days</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 mb-1">{deadline.task}</p>
                                            <p className="text-xs text-gray-500">{deadline.subject}</p>
                                        </div>
                                    </div>
                                    {deadline.urgent && (
                                        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg">Urgent</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Achievement Highlights */}
                <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 shadow-2xl mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                                <TrophyIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white">Achievement Highlights</h2>
                                <p className="text-sm text-white/80 font-semibold">Your teaching impact this month</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Classes Taught', value: '156', icon: '🎓' },
                                { label: 'Assessments Graded', value: '342', icon: '📝' },
                                { label: 'Avg Class Score', value: '87%', icon: '⭐' },
                                { label: 'Student Feedback', value: '4.8/5', icon: '💬' }
                            ].map((achievement, index) => (
                                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                                    <div className="text-4xl mb-3">{achievement.icon}</div>
                                    <p className="text-3xl font-black text-white mb-1">{achievement.value}</p>
                                    <p className="text-xs font-bold text-white/80 uppercase tracking-wider">{achievement.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </ErrorBoundary>
        </TeacherLayout>
    );
}
