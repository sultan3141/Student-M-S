import { useState } from 'react';
import DirectorLayout from '@/Layouts/DirectorLayout';
import { Head, router, Link } from '@inertiajs/react';

export default function RegistrationStatus({
    isOpen,
    totalCapacity,
    currentEnrollment,
    enrollmentPercentage,
    pendingApplications,
    waitlist,
    gradeEnrollment,
    reportData
}) {
    const [toggling, setToggling] = useState(false);

    const handleToggle = (newStatus) => {
        setToggling(true);
        router.post('/director/registration/toggle', {
            status: newStatus
        }, {
            preserveScroll: true,
            onFinish: () => setToggling(false),
            onSuccess: () => {
                // Success is handled by automatic prop updates
            },
            onError: () => {
                alert('Failed to update registration status');
            }
        });
    };

    return (
        <DirectorLayout>
            <Head title="Registration Control Hub" />

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-navy-900" style={{ color: '#0F172A' }}>
                    🎫 Registration Control Hub
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                    Manage enrollment, control registration periods, and monitor capacity
                </p>
            </div>

            {/* Status Banner */}
            <div className={`mb-6 p-6 rounded-xl border-2 ${isOpen
                ? 'bg-emerald-50 border-emerald-300'
                : 'bg-gray-50 border-gray-300'
                }`}>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <span className="text-3xl">{isOpen ? '🟢' : '🔴'}</span>
                            <h2 className="text-2xl font-bold" style={{ color: '#0F172A' }}>
                                Registration is {isOpen ? 'OPEN' : 'CLOSED'}
                            </h2>
                        </div>
                        <p className="text-sm text-gray-600">
                            Current enrollment: {currentEnrollment} / {totalCapacity} students
                            ({enrollmentPercentage}%)
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => handleToggle('open')}
                            disabled={toggling || isOpen}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all ${isOpen
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl'
                                }`}
                        >
                            {toggling && !isOpen ? 'Processing...' : '● OPEN Registration'}
                        </button>
                        <button
                            onClick={() => handleToggle('closed')}
                            disabled={toggling || !isOpen}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all ${!isOpen
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl'
                                }`}
                        >
                            {toggling && isOpen ? 'Processing...' : '○ CLOSE Registration'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="executive-card">
                    <div className="text-sm font-medium text-gray-600 mb-2">TOTAL CAPACITY</div>
                    <div className="text-3xl font-bold text-navy-900" style={{ color: '#0F172A' }}>
                        {totalCapacity}
                    </div>
                </div>
                <div className="executive-card">
                    <div className="text-sm font-medium text-gray-600 mb-2">ENROLLED</div>
                    <div className="text-3xl font-bold text-blue-600">
                        {currentEnrollment}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        {enrollmentPercentage}% of capacity
                    </div>
                </div>
                <div className="executive-card">
                    <div className="text-sm font-medium text-gray-600 mb-2">PENDING</div>
                    <div className="text-3xl font-bold text-amber-600">
                        {pendingApplications || 0}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Applications</div>
                </div>
                <div className="executive-card">
                    <div className="text-sm font-medium text-gray-600 mb-2">WAITLIST</div>
                    <div className="text-3xl font-bold text-purple-600">
                        {waitlist || 0}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Students</div>
                </div>
            </div>

            {/* Enrollment by Grade */}
            <div className="executive-card">
                <h3 className="text-xl font-semibold text-navy-900 mb-4" style={{ color: '#0F172A' }}>
                    Enrollment by Grade
                </h3>
                <div className="space-y-4">
                    {gradeEnrollment?.map((grade, index) => (
                        <div key={index}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-900">{grade.grade}</span>
                                <span className="text-sm text-gray-600">
                                    {grade.enrolled} / {grade.capacity} ({grade.percentage}%)
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full transition-all ${grade.percentage >= 95
                                        ? 'bg-red-500'
                                        : grade.percentage >= 85
                                            ? 'bg-amber-500'
                                            : 'bg-emerald-500'
                                        }`}
                                    style={{ width: `${Math.min(grade.percentage, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Registration Report Section */}
            <div className="mt-6 executive-card overflow-hidden !p-0">
                {/* Report Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                    <div className="flex items-center space-x-3 mb-2">
                        <span className="text-3xl">📊</span>
                        <h3 className="text-2xl font-bold">REPORTS CENTER</h3>
                    </div>
                    <p className="text-blue-100">Generate comprehensive reports for registration management</p>
                </div>

                <div className="p-6">
                    {/* Report Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div className="flex items-center space-x-3">
                                <div className="text-2xl">👥</div>
                                <div>
                                    <div className="text-sm font-medium text-gray-600">Total Registrations</div>
                                    <div className="text-2xl font-bold text-blue-600">{reportData?.totalRegistrations || 0}</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                            <div className="flex items-center space-x-3">
                                <div className="text-2xl">✅</div>
                                <div>
                                    <div className="text-sm font-medium text-gray-600">Completed</div>
                                    <div className="text-2xl font-bold text-emerald-600">{reportData?.completedRegistrations || 0}</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                            <div className="flex items-center space-x-3">
                                <div className="text-2xl">⏳</div>
                                <div>
                                    <div className="text-sm font-medium text-gray-600">Pending</div>
                                    <div className="text-2xl font-bold text-amber-600">{reportData?.pendingRegistrations || 0}</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <div className="flex items-center space-x-3">
                                <div className="text-2xl">❌</div>
                                <div>
                                    <div className="text-sm font-medium text-gray-600">Rejected</div>
                                    <div className="text-2xl font-bold text-red-600">{reportData?.rejectedRegistrations || 0}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Report Type Selection */}
                    <div className="mb-8">
                        <h4 className="text-lg font-bold text-gray-900 mb-4">Select Report Type</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {/* Registration Summary Report */}
                            <div className="border-2 border-blue-300 rounded-lg p-4 hover:bg-blue-50 cursor-pointer transition-colors">
                                <div className="flex items-start space-x-3">
                                    <div className="text-2xl">📋</div>
                                    <div>
                                        <h5 className="font-bold text-gray-900">Registration Summary Report</h5>
                                        <p className="text-sm text-gray-600">Overview of all registrations and their status</p>
                                    </div>
                                </div>
                            </div>

                            {/* Grade Distribution Report */}
                            <div className="border-2 border-indigo-300 rounded-lg p-4 hover:bg-indigo-50 cursor-pointer transition-colors">
                                <div className="flex items-start space-x-3">
                                    <div className="text-2xl">📊</div>
                                    <div>
                                        <h5 className="font-bold text-gray-900">Grade Distribution Report</h5>
                                        <p className="text-sm text-gray-600">Student distribution across grades</p>
                                    </div>
                                </div>
                            </div>

                            {/* Enrollment Trend Report */}
                            <div className="border-2 border-emerald-300 rounded-lg p-4 hover:bg-emerald-50 cursor-pointer transition-colors">
                                <div className="flex items-start space-x-3">
                                    <div className="text-2xl">📈</div>
                                    <div>
                                        <h5 className="font-bold text-gray-900">Enrollment Trend Report</h5>
                                        <p className="text-sm text-gray-600">Registration trends and capacity analysis</p>
                                    </div>
                                </div>
                            </div>

                            {/* Pending Applications Report */}
                            <div className="border-2 border-amber-300 rounded-lg p-4 hover:bg-amber-50 cursor-pointer transition-colors">
                                <div className="flex items-start space-x-3">
                                    <div className="text-2xl">⏱️</div>
                                    <div>
                                        <h5 className="font-bold text-gray-900">Pending Applications Report</h5>
                                        <p className="text-sm text-gray-600">Applications awaiting approval or action</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Export Buttons */}
                        <div className="flex space-x-3">
                            <button
                                onClick={() => window.location.href = route('director.registration.export-excel')}
                                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                            >
                                <span>📊</span>
                                <span>Export to Excel</span>
                            </button>
                            <button
                                onClick={() => window.location.href = route('director.registration.export-pdf')}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                <span>📄</span>
                                <span>Export to PDF</span>
                            </button>
                        </div>
                    </div>

                    {/* Recent Registrations Table */}
                    <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-4">Recent Registrations</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Student Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Student ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Grade</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {reportData?.recentRegistrations && reportData.recentRegistrations.length > 0 ? (
                                        reportData.recentRegistrations.map((reg) => (
                                            <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{reg.studentName}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600 font-mono">{reg.studentId}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{reg.grade}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        reg.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                                                        reg.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{reg.createdAt}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                                                No registrations found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Settings Panel */}
            <div className="mt-6 executive-card">
                <h3 className="text-lg font-semibold text-navy-900 mb-4" style={{ color: '#0F172A' }}>
                    Registration Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Auto-close at capacity:
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option>90%</option>
                            <option>95%</option>
                            <option>100%</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Waitlist management:
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option>Automatic</option>
                            <option>Manual Approval</option>
                        </select>
                    </div>
                </div>
            </div>
        </DirectorLayout>
    );
}
