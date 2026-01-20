import { Head, Link, useForm } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import {
    AcademicCapIcon,
    CheckBadgeIcon,
    ArrowRightIcon,
    DocumentCheckIcon,
    ExclamationTriangleIcon,
    BuildingLibraryIcon
} from '@heroicons/react/24/outline';

export default function AnnualRegistration({ auth, student, academicYear, existingRegistration, streams, nextGrade }) {
    const { data, setData, post, processing, errors } = useForm({
        grade_id: nextGrade?.id || student?.grade_id || '',
        stream_id: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('student.registration.store'));
    };

    const requiresStream = nextGrade && nextGrade.level === 11;

    return (
        <StudentLayout auth={auth} title="Annual Registration">
            <Head title="Annual Registration" />

            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-2xl"></div>
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <AcademicCapIcon className="w-10 h-10 text-blue-200" />
                            Annual Registration
                        </h1>
                        <p className="text-blue-100 mt-2 text-lg">
                            Secure your enrollment for the <span className="font-bold text-white">{academicYear?.year || 'Upcoming'}</span> academic session.
                        </p>
                    </div>
                </div>

                {existingRegistration ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center animate-fade-in">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-50 rounded-full mb-6 relative">
                            <div className="absolute inset-0 rounded-full bg-green-200 animate-ping opacity-20"></div>
                            <CheckBadgeIcon className="w-12 h-12 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Registration Confirmed!</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">
                            You have successfully registered for the {academicYear?.year} academic year. Your application is currently <span className="font-semibold text-blue-600">{existingRegistration.status || 'Under Review'}</span>.
                        </p>
                        <Link
                            href={route('student.dashboard')}
                            className="inline-flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group"
                        >
                            Return to Dashboard
                            <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Info Column */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <DocumentCheckIcon className="w-5 h-5 text-blue-600" />
                                    Current Status
                                </h3>
                                <div className="space-y-4">
                                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                        <div className="text-xs text-blue-500 uppercase font-bold mb-1">Grade</div>
                                        <div className="text-blue-900 font-semibold">{student?.grade?.name || 'N/A'}</div>
                                    </div>
                                    <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                                        <div className="text-xs text-indigo-500 uppercase font-bold mb-1">Section</div>
                                        <div className="text-indigo-900 font-semibold">{student?.section?.name || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-sm border border-amber-100">
                                <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                                    <ExclamationTriangleIcon className="w-5 h-5 text-amber-600" />
                                    Important
                                </h3>
                                <p className="text-sm text-amber-800 leading-relaxed">
                                    Registration can only be submitted once per academic year. Please review all details carefully before finalizing your application.
                                </p>
                            </div>
                        </div>

                        {/* Right Form Column */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-8 py-6 border-b border-gray-100">
                                    <h2 className="text-lg font-bold text-gray-900">Application Details</h2>
                                </div>

                                <div className="p-8 space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Applying For
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <BuildingLibraryIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <select
                                                value={data.grade_id}
                                                onChange={(e) => setData('grade_id', e.target.value)}
                                                className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20 shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                                                disabled
                                            >
                                                <option value={nextGrade?.id || student?.grade_id}>
                                                    {nextGrade?.name || student?.grade?.name || 'N/A'}
                                                </option>
                                            </select>
                                        </div>
                                        <p className="text-xs text-blue-600 mt-2 font-medium flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                                            {nextGrade ? 'Automatic Promotion Eligibility Detected' : 'Continuing in Current Grade'}
                                        </p>
                                    </div>

                                    {requiresStream && (
                                        <div className="animate-fade-in-up">
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                Select Academic Stream <span className="text-red-500">*</span>
                                            </label>
                                            <div className="grid grid-cols-1 gap-3">
                                                {streams && streams.map((stream) => (
                                                    <label
                                                        key={stream.id}
                                                        className={`relative flex items-start p-4 border rounded-xl cursor-pointer transition-all ${data.stream_id === stream.id
                                                                ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                                                                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <div className="flex items-center h-5">
                                                            <input
                                                                type="radio"
                                                                name="stream"
                                                                value={stream.id}
                                                                checked={data.stream_id === stream.id}
                                                                onChange={(e) => setData('stream_id', parseInt(e.target.value))}
                                                                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="ml-3">
                                                            <span className={`block text-sm font-bold ${data.stream_id === stream.id ? 'text-blue-900' : 'text-gray-900'}`}>{stream.name}</span>
                                                            <span className={`block text-xs mt-1 ${data.stream_id === stream.id ? 'text-blue-700' : 'text-gray-500'}`}>{stream.description || 'specialized academic track'}</span>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                            {errors.stream_id && <p className="text-red-500 text-sm mt-2 font-medium">{errors.stream_id}</p>}
                                        </div>
                                    )}

                                    {errors.error && (
                                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                                            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 shrink-0" />
                                            <p className="text-sm text-red-800 font-medium">{errors.error}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                                    <Link
                                        href={route('student.dashboard')}
                                        className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Submit Registration
                                                <ArrowRightIcon className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </StudentLayout>
    );
}
