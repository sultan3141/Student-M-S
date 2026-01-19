import { useState } from 'react';
import DirectorLayout from '@/Layouts/DirectorLayout';
import { Head, router } from '@inertiajs/react';

export default function RegistrationStatus({
    isOpen,
    totalCapacity,
    currentEnrollment,
    enrollmentPercentage,
    pendingApplications,
    waitlist,
    gradeEnrollment
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
