import RegistrarLayout from '@/Layouts/RegistrarLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function EditClass({ section, streams }) {
    const { data, setData, put, processing, errors } = useForm({
        name: section.name || '',
        capacity: section.capacity || 50,
        stream_id: section.stream_id || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('registrar.admission.classes.update', section.id));
    };

    return (
        <RegistrarLayout>
            <Head title="Edit Student Class" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">EDIT STUDENT CLASS</h1>
                            <div className="text-sm text-gray-500 mt-1">
                                Edit › Class
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
                        <h2 className="text-lg font-semibold mb-6">Edit Student Class</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Class Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Class Name
                                </label>
                                <input
                                    type="text"
                                    value={section.grade?.name || 'N/A'}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                />
                                <p className="mt-1 text-xs text-gray-500">Eg : First, Second, Third etc</p>
                            </div>

                            {/* Stream Selection - Only for Grade 11 & 12 */}
                            {section.grade?.name && (section.grade.name.includes('11') || section.grade.name.includes('12')) && (
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
                            )}

                            {/* Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Section
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Section"
                                />
                                <p className="mt-1 text-xs text-gray-500">Eg : A, B, C etc</p>
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
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
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing ? 'Updating...' : 'Update Class'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </RegistrarLayout>
    );
}
