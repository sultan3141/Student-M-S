import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import {
    BookOpenIcon,
    ChartBarIcon,
    AcademicCapIcon,
    ClockIcon,
    ArrowTrendingUpIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XCircleIcon,
    UserIcon
} from '@heroicons/react/24/outline';

const StatusBadge = ({ status, type }) => {
    const styles = {
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-800',
        neutral: 'bg-gray-100 text-gray-800'
    };

    let style = styles.neutral;
    if (type === 'fee') {
        style = status === 'Paid' ? styles.success : status === 'Partially Paid' ? styles.warning : styles.danger;
    } else if (type === 'registration') {
        style = status === 'Registered' ? styles.success : styles.warning;
    } else if (type === 'promotion') {
        style = status === 'Eligible' ? styles.success : styles.danger;
    }

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
            {status}
        </span>
    );
};

export default function StudentDashboard({ auth, student, academicYear, subjects, promotionStatus, stats, charts }) {
    const studentName = student?.user?.name || auth.user.name;
    const studentId = student?.student_id || 'N/A';
    const gradeName = student?.current_registration?.grade?.name || student?.grade?.name || 'N/A';
    const sectionName = student?.current_registration?.section?.name || student?.section?.name || 'N/A';

    // Determine Statuses (Mocked or Real)
    const feeStatus = 'Unpaid';
    const registrationStatus = student?.current_registration ? 'Registered' : 'Not Registered';

    return (
        <StudentLayout>
            <Head title="Student Dashboard" />

            {/* Overview Panel & Welcome Banner */}
            <div className="bg-gradient-to-r from-emerald-700 to-teal-600 rounded-3xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Welcome, {studentName.split(' ')[0]}! 👋</h1>
                        <p className="text-emerald-100 text-lg mb-6">
                            Academic Year: <span className="font-bold text-white">{academicYear?.name || '2025-2026'}</span>
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
                                <p className="text-xs text-emerald-200 uppercase">Student ID</p>
                                <p className="font-mono font-bold">{studentId}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
                                <p className="text-xs text-emerald-200 uppercase">Grade / Section</p>
                                <p className="font-bold">{gradeName} - {sectionName}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-200 mb-4 border-b border-white/10 pb-2">Current Status</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-white/90">Registration</span>
                                <div className="flex items-center gap-2">
                                    <StatusBadge status={registrationStatus} type="registration" />
                                    {registrationStatus === 'Not Registered' && (
                                        <Link href={route('student.registration.create')} className="text-xs bg-white text-emerald-800 px-2 py-1 rounded-full font-bold hover:bg-emerald-50 transition-colors shadow-sm">
                                            Register
                                        </Link>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-white/90">Fee Status</span>
                                <StatusBadge status={feeStatus} type="fee" />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-white/90">Promotion Eligibility</span>
                                <StatusBadge status={promotionStatus} type="promotion" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alerts & Notifications */}
            {feeStatus === 'Unpaid' && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg shadow-sm flex items-start">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3 mt-0.5" />
                    <div>
                        <h4 className="text-red-800 font-bold">Outstanding Fee Alert</h4>
                        <p className="text-red-700 text-sm">You have pending tuition fees suitable for the current term. Please visit the finance office.</p>
                    </div>
                </div>
            )}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                    <BookOpenIcon className="w-8 h-8 text-blue-500 mb-2" />
                    <p className="text-3xl font-bold text-gray-900">{subjects.length}</p>
                    <p className="text-xs font-medium text-gray-500 uppercase">Enrolled Courses</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                    <ArrowTrendingUpIcon className="w-8 h-8 text-emerald-500 mb-2" />
                    <p className="text-3xl font-bold text-gray-900">{stats?.gpa || 'N/A'}</p>
                    <p className="text-xs font-medium text-gray-500 uppercase">Average GPA</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                    <ClockIcon className="w-8 h-8 text-purple-500 mb-2" />
                    <p className="text-3xl font-bold text-gray-900">{stats?.attendance || 0}%</p>
                    <p className="text-xs font-medium text-gray-500 uppercase">Attendance Rate</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                    <UserIcon className="w-8 h-8 text-orange-500 mb-2" />
                    <p className="text-3xl font-bold text-gray-900">#{stats?.rank || 'N/A'}</p>
                    <p className="text-xs font-medium text-gray-500 uppercase">Class Rank</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Course List (Left 2/3) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">My Scored Subjects</h3>
                            <Link href={route('student.academic.semesters')} className="text-sm text-emerald-600 font-medium hover:underline">View All</Link>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {subjects.length > 0 ? subjects.map((subject) => (
                                <div key={subject.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                                            {subject.code?.substring(0, 2) || 'SUB'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{subject.name}</h4>
                                            <p className="text-sm text-gray-500">{subject.credit_hours} Credits</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">Active</span>
                                </div>
                            )) : (
                                <div className="p-8 text-center text-gray-500">
                                    No subjects enrolled for this term yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar (Charts & Analytics) */}
                <div className="space-y-6">
                    {/* School Gender Distribution */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Student Demographics</h3>
                        <div className="relative h-48">
                            {/* Placeholder for Chart - In a real app use Recharts/ChartJS */}
                            <div className="flex h-full items-end space-x-4 justify-center">
                                <div className="w-16 bg-blue-500 rounded-t-lg relative group" style={{ height: '55%' }}>
                                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-600">{charts?.gender?.Male || 0}</span>
                                    <div className="absolute bottom-2 left-0 right-0 text-center text-white text-xs font-bold">Male</div>
                                </div>
                                <div className="w-16 bg-pink-500 rounded-t-lg relative group" style={{ height: '45%' }}>
                                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-600">{charts?.gender?.Female || 0}</span>
                                    <div className="absolute bottom-2 left-0 right-0 text-center text-white text-xs font-bold">Female</div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-xs text-gray-400 mt-2">Gender Distribution (School Wide)</p>
                    </div>

                    {/* School Pass Rate */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">School Performance</h3>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Overall Pass Rate</span>
                            <span className="text-2xl font-bold text-emerald-600">{stats?.pass_percentage || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5 mt-2">
                            <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${stats?.pass_percentage || 0}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
