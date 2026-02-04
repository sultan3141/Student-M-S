import DirectorLayout from '@/Layouts/DirectorLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function SemesterManagement({ academicYear, semesters }) {
    const [processing, setProcessing] = useState(false);

    const handleOpen = (semesterId) => {
        if (confirm('Are you sure you want to open this semester for result entry?')) {
            setProcessing(true);
            router.post(route('director.semesters.open'), {
                semester_period_id: semesterId,
            }, {
                onFinish: () => setProcessing(false),
                preserveScroll: true,
            });
        }
    };

    const handleClose = (semesterId, semester) => {
        if (confirm(`Are you sure you want to close Semester ${semester}? Students will be able to view their results.`)) {
            setProcessing(true);
            router.post(route('director.semesters.close'), {
                semester_period_id: semesterId,
            }, {
                onFinish: () => setProcessing(false),
                preserveScroll: true,
            });
        }
    };

    const handleReopen = (semesterId, semester) => {
        if (confirm(`Are you sure you want to reopen Semester ${semester}? Student results will be hidden again.`)) {
            setProcessing(true);
            router.post(route('director.semesters.reopen'), {
                semester_period_id: semesterId,
            }, {
                onFinish: () => setProcessing(false),
                preserveScroll: true,
            });
        }
    };

    const getStatusBadge = (status) => {
        if (status === 'open') {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <span className="mr-1">🔓</span> OPEN
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                <span className="mr-1">🔒</span> CLOSED
            </span>
        );
    };

    return (
        <DirectorLayout>
            <Head title="Semester Management" />

            {/* Header */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-500 shadow-sm mb-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-semibold text-white mb-1">
                        Semester Management
                    </h1>
                    <p className="text-blue-100 text-sm">
                        Control semester opening and closing for {academicYear.name}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">How it works</h3>
                            <div className="mt-2 text-sm text-blue-700">
                                <ul className="list-disc list-inside space-y-1">
                                    <li><strong>Open:</strong> Teachers can enter/edit results. Students cannot see results.</li>
                                    <li><strong>Close:</strong> Results are locked. Students can view their results.</li>
                                    <li><strong>Reopen:</strong> Unlock results for editing. Hide from students again.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Semester Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {semesters.map((semester) => (
                        <div key={semester.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            {/* Card Header */}
                            <div className={`px-6 py-4 ${semester.status === 'open' ? 'bg-green-50 border-b-2 border-green-200' : 'bg-gray-50 border-b border-gray-200'}`}>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Semester {semester.semester}
                                    </h2>
                                    {getStatusBadge(semester.status)}
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="px-6 py-4">
                                {semester.status === 'open' ? (
                                    <div className="space-y-3">
                                        <div className="flex items-start">
                                            <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Teachers can enter results</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Opened on {new Date(semester.opened_at).toLocaleDateString('en-US', { 
                                                        year: 'numeric', 
                                                        month: 'long', 
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                                {semester.opened_by && (
                                                    <p className="text-xs text-gray-500">by {semester.opened_by}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <svg className="h-5 w-5 text-gray-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            <p className="text-sm text-gray-600">Students cannot view results</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex items-start">
                                            <svg className="h-5 w-5 text-gray-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                            </svg>
                                            <p className="text-sm text-gray-600">Results are locked (read-only)</p>
                                        </div>
                                        <div className="flex items-start">
                                            <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Students can view results</p>
                                                {semester.closed_at && (
                                                    <>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Closed on {new Date(semester.closed_at).toLocaleDateString('en-US', { 
                                                                year: 'numeric', 
                                                                month: 'long', 
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </p>
                                                        {semester.closed_by && (
                                                            <p className="text-xs text-gray-500">by {semester.closed_by}</p>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Card Actions */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                {semester.status === 'open' ? (
                                    <button
                                        onClick={() => handleClose(semester.id, semester.semester)}
                                        disabled={processing}
                                        className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                                    >
                                        {processing ? 'Processing...' : `Close Semester ${semester.semester}`}
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleReopen(semester.id, semester.semester)}
                                            disabled={processing}
                                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                                        >
                                            {processing ? 'Processing...' : `Reopen Semester ${semester.semester}`}
                                        </button>
                                        
                                        {semester.semester === 2 && (
                                            <p className="mt-2 text-xs text-gray-500 text-center">
                                                Semester 2 opens automatically when Semester 1 closes
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Rules Section */}
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-200 rounded-lg p-6">
                    <div className="flex items-start">
                        <svg className="h-6 w-6 text-indigo-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-indigo-900 mb-3">Automated Academic Progression</h3>
                            <div className="space-y-3 text-sm text-indigo-800">
                                <div className="bg-white bg-opacity-60 rounded-lg p-3">
                                    <p className="font-semibold mb-1">When Semester 1 Closes:</p>
                                    <p>✓ Semester 2 automatically OPENS for result entry</p>
                                </div>
                                <div className="bg-white bg-opacity-60 rounded-lg p-3">
                                    <p className="font-semibold mb-1">When Semester 2 Closes:</p>
                                    <p>✓ Current academic year is marked as completed</p>
                                    <p>✓ Next academic year is automatically created</p>
                                    <p>✓ New year's Semester 1 automatically OPENS</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Rules */}
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-3">Important Rules</h3>
                    <ul className="space-y-2 text-sm text-yellow-800">
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Only ONE semester can be OPEN at a time</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Semester 2 cannot be manually opened (it opens automatically when S1 closes)</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Closing a semester requires at least some results to be entered</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>You can reopen any closed semester if corrections are needed</span>
                        </li>
                    </ul>
                </div>
            </div>
        </DirectorLayout>
    );
}
