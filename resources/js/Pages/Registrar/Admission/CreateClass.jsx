import RegistrarLayout from '@/Layouts/RegistrarLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function CreateClass({ grades, streams }) {
    const { data, setData, post, processing, errors } = useForm({
        grade_id: '',
        name: '',
        gender: 'Mixed',
        capacity: 50,
        stream_id: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('registrar.admission.classes.store'));
    };

    return (
        <RegistrarLayout>
            <Head title="Create Section" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">CREATE NEW SECTION</h1>
                            <div className="text-sm text-gray-500 mt-1">
                                Create › Section
                            </div>
                        </div>
                        <Link
                            href={route('registrar.admission.classes')}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                            ← Back
                        </Link>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-6">Create New Section</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Grade Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Class (Grade) <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.grade_id}
                                    onChange={e => setData('grade_id', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">-- Select Class --</option>
                                    {grades.map(grade => (
                                        <option key={grade.id} value={grade.id}>{grade.name}</option>
                                    ))}
                                </select>
                                <p className="mt-1 text-xs text-gray-500">Choose the class/grade for this section</p>
                                {errors.grade_id && <p className="mt-1 text-sm text-red-600">{errors.grade_id}</p>}
                            </div>

                            {/* Stream Selection - Only for Grade 11 & 12 */}
                            {(() => {
                                const selectedGrade = grades?.find(g => g.id === parseInt(data.grade_id));
                                const isGrade11or12 = selectedGrade && (selectedGrade.name.includes('11') || selectedGrade.name.includes('12'));

                                return isGrade11or12 ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Stream <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.stream_id}
                                            onChange={e => setData('stream_id', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">-- Select Stream --</option>
                                            {streams && streams.map(stream => (
                                                <option key={stream.id} value={stream.id}>{stream.name}</option>
                                            ))}
                                        </select>
                                        <p className="mt-1 text-xs text-gray-500">Choose the stream for this section</p>
                                        {errors.stream_id && <p className="mt-1 text-sm text-red-600">{errors.stream_id}</p>}
                                    </div>
                                ) : null;
                            })()}

                            {/* Section Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Section Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Section Name"
                                />
                                <p className="mt-1 text-xs text-gray-500">Eg: A, B, C, D, etc.</p>
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            {/* Gender (Optional) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Gender Type (Optional)
                                </label>
                                <select
                                    value={data.gender}
                                    onChange={e => setData('gender', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Mixed">Mixed (Boys & Girls)</option>
                                    <option value="Male">Boys Only</option>
                                    <option value="Female">Girls Only</option>
                                </select>
                                <p className="mt-1 text-xs text-gray-500">Specify if this section is gender-specific</p>
                            </div>

                            {/* Maximum Students */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Maximum Students <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.capacity}
                                    onChange={e => setData('capacity', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="50"
                                    min="1"
                                />
                                <p className="mt-1 text-xs text-gray-500">Maximum number of students this section can handle</p>
                                {errors.capacity && <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing ? 'Creating...' : 'Create Section'}
                                </button>
                                <Link
                                    href={route('registrar.admission.classes')}
                                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </RegistrarLayout>
    );
}
