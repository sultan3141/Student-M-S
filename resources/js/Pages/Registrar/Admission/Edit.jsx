import RegistrarLayout from '@/Layouts/RegistrarLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Edit({ student, grades, streams }) {
    const { data, setData, put, processing, errors } = useForm({
        full_name: student.user?.name || '',
        grade_id: student.grade_id || '',
        section_id: student.section_id || '',
        gender: student.gender || 'Male',
        dob: student.dob || '',
        stream_id: student.stream_id || '',
    });

    const [sections, setSections] = useState([]);

    useEffect(() => {
        const selectedGrade = grades.find(g => g.id == data.grade_id);
        if (selectedGrade) {
            let filteredSections = selectedGrade.sections;
            const isGrade11or12 = selectedGrade.name.includes('11') || selectedGrade.name.includes('12');

            if (isGrade11or12 && data.stream_id) {
                filteredSections = filteredSections.filter(s => s.stream_id == data.stream_id);
            } else if (isGrade11or12 && !data.stream_id) {
                // If Grade 11/12 but no stream selected, maybe show empty or all? 
                // Showing all might be confusing if they pick a mismatch. 
                // Let's filteredSections = [] or show all but validation fails?
                // Let's show all for now (default behavior) so they can see existing section if any, 
                // but ideally they should pick a stream.
                // Actually, if they haven't picked a stream, they shouldn't see sections yet?
                // Let's keep it simple: show all sections belonging to that grade if no stream is picked yet.
            }
            setSections(filteredSections);
        } else {
            setSections([]);
        }
    }, [data.grade_id, data.stream_id]);

    const handleGradeChange = (e) => {
        setData(previousData => ({
            ...previousData,
            grade_id: e.target.value,
            section_id: '', // Reset section when grade changes
            stream_id: '',  // Reset stream when grade changes
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('registrar.admission.update', student.id));
    };

    return (
        <RegistrarLayout>
            <Head title="Edit Student" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">EDIT STUDENT</h1>
                            <div className="text-sm text-gray-500 mt-1">
                                Student › Edit
                            </div>
                        </div>
                        <Link
                            href={route('registrar.admission.index')}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                            ← Back to List
                        </Link>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-6">Edit Student Info</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={data.full_name}
                                    onChange={e => setData('full_name', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Full Name"
                                />
                                {errors.full_name && <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>}
                            </div>

                            {/* Class (Grade) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Class
                                </label>
                                <select
                                    value={data.grade_id}
                                    onChange={handleGradeChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">-- Select a Class --</option>
                                    {grades.map(grade => (
                                        <option key={grade.id} value={grade.id}>{grade.name}</option>
                                    ))}
                                </select>
                                {errors.grade_id && <p className="mt-1 text-sm text-red-600">{errors.grade_id}</p>}
                            </div>

                            {/* Stream Selection - Only for Grade 11 & 12 */}
                            {(() => {
                                const selectedGrade = grades.find(g => g.id == data.grade_id);
                                const isGrade11or12 = selectedGrade && (selectedGrade.name.includes('11') || selectedGrade.name.includes('12'));

                                return isGrade11or12 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Stream <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.stream_id}
                                            onChange={e => {
                                                setData(previousData => ({
                                                    ...previousData,
                                                    stream_id: e.target.value,
                                                    section_id: '' // Reset section when stream changes
                                                }));
                                            }}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">-- Select Stream --</option>
                                            {streams && streams.map(stream => (
                                                <option key={stream.id} value={stream.id}>{stream.name}</option>
                                            ))}
                                        </select>
                                        {errors.stream_id && <p className="mt-1 text-sm text-red-600">{errors.stream_id}</p>}
                                    </div>
                                );
                            })()}

                            {/* Section */}
                            {sections.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Section
                                    </label>
                                    <select
                                        value={data.section_id}
                                        onChange={e => setData('section_id', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">-- Select Section --</option>
                                        {sections.map(section => (
                                            <option key={section.id} value={section.id}>{section.name}</option>
                                        ))}
                                    </select>
                                    {errors.section_id && <p className="mt-1 text-sm text-red-600">{errors.section_id}</p>}
                                </div>
                            )}

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

                            {/* Submit Button */}
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing ? 'Updating...' : 'Update Student'}
                                </button>
                                <Link
                                    href={route('registrar.admission.index')}
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
