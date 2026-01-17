import { Head, Link, useForm } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';

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

            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Annual Registration</h1>
                    <p className="text-gray-600 mt-2">Register for Academic Year {academicYear?.year || 'N/A'}</p>
                </div>

                {existingRegistration ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                        <div className="text-6xl mb-4">✓</div>
                        <h3 className="text-2xl font-bold text-green-800 mb-2">Already Registered!</h3>
                        <p className="text-green-700">
                            You are already registered for {academicYear?.year || 'this academic year'}.
                        </p>
                        <Link
                            href={route('student.dashboard')}
                            className="inline-block mt-6 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                        >
                            Return to Dashboard
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <h3 className="font-semibold text-blue-900 mb-2">Registration Information</h3>
                                <div className="space-y-2 text-sm text-blue-800">
                                    <p><strong>Current Grade:</strong> {student?.grade?.name || 'N/A'}</p>
                                    <p><strong>Current Section:</strong> {student?.section?.name || 'N/A'}</p>
                                    <p><strong>Academic Year:</strong> {academicYear?.year || 'N/A'}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Registering for Grade *
                                </label>
                                <select
                                    value={data.grade_id}
                                    onChange={(e) => setData('grade_id', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                                    disabled
                                >
                                    <option value={nextGrade?.id || student?.grade_id}>
                                        {nextGrade?.name || student?.grade?.name || 'N/A'}
                                    </option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    {nextGrade ? 'You are being promoted to the next grade' : 'Continuing in current grade'}
                                </p>
                            </div>

                            {requiresStream && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Academic Stream * (Required for Grade 11)
                                    </label>
                                    <div className="space-y-3">
                                        {streams && streams.map((stream) => (
                                            <label
                                                key={stream.id}
                                                className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-500 transition"
                                            >
                                                <input
                                                    type="radio"
                                                    name="stream"
                                                    value={stream.id}
                                                    checked={data.stream_id === stream.id}
                                                    onChange={(e) => setData('stream_id', parseInt(e.target.value))}
                                                    className="w-5 h-5 text-green-600"
                                                    required
                                                />
                                                <div className="ml-3">
                                                    <div className="font-semibold text-gray-800">{stream.name}</div>
                                                    <div className="text-sm text-gray-500">{stream.description || 'Academic stream'}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.stream_id && <p className="text-red-500 text-sm mt-2">{errors.stream_id}</p>}
                                </div>
                            )}

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-sm text-yellow-800">
                                    <strong>Important:</strong> You can only register once per academic year. Please review your information before submitting.
                                </p>
                            </div>

                            {errors.error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-sm text-red-800">{errors.error}</p>
                                </div>
                            )}

                            <div className="flex space-x-4">
                                <Link
                                    href={route('student.dashboard')}
                                    className="flex-1 text-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                                >
                                    {processing ? 'Registering...' : 'Complete Registration'}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </StudentLayout>
    );
}
