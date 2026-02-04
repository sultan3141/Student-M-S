import RegistrarLayout from '@/Layouts/RegistrarLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ grades }) {
    const { data, setData, post, processing, errors } = useForm({
        full_name: '',
        grade_id: '',
        gender: 'Male',
        dob: '',
        photo: null,
        previous_school: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('registrar.admission.store'));
    };

    return (
        <RegistrarLayout>
            <Head title="Student Admission" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">STUDENT ADMISSION</h1>
                        <div className="text-sm text-gray-500 mt-1">
                            Student › Admission
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-6">Fill Student Info</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.full_name}
                                    onChange={e => setData('full_name', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Full Name"
                                />
                                {errors.full_name && <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>}
                                <p className="mt-1 text-xs text-gray-500">Roll ID will be auto-generated</p>
                            </div>

                            {/* Class (Grade) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Class <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.grade_id}
                                    onChange={e => setData('grade_id', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">-- Select a Class --</option>
                                    {grades.map(grade => (
                                        <option key={grade.id} value={grade.id}>{grade.name}</option>
                                    ))}
                                </select>
                                {errors.grade_id && <p className="mt-1 text-sm text-red-600">{errors.grade_id}</p>}
                                <p className="mt-1 text-xs text-gray-500">Section will be auto-assigned based on gender and capacity</p>
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Gender
                                </label>
                                <div className="flex gap-6">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="Male"
                                            checked={data.gender === 'Male'}
                                            onChange={e => setData('gender', e.target.value)}
                                            className="mr-2"
                                        />
                                        Male
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="Female"
                                            checked={data.gender === 'Female'}
                                            onChange={e => setData('gender', e.target.value)}
                                            className="mr-2"
                                        />
                                        Female
                                    </label>
                                </div>
                            </div>

                            {/* DOB */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    DOB
                                </label>
                                <input
                                    type="date"
                                    value={data.dob}
                                    onChange={e => setData('dob', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {errors.dob && <p className="mt-1 text-sm text-red-600">{errors.dob}</p>}
                            </div>

                            {/* Previous School */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Previous School
                                </label>
                                <input
                                    type="text"
                                    value={data.previous_school}
                                    onChange={e => setData('previous_school', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Previous School (Optional)"
                                />
                            </div>

                            {/* Photo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Photo
                                </label>
                                <input
                                    type="file"
                                    onChange={e => setData('photo', e.target.files[0])}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    accept="image/*"
                                />
                                <p className="mt-1 text-xs text-gray-500">Choose File - No file chosen</p>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </RegistrarLayout>
    );
}
