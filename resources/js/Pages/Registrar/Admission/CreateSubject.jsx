import React from 'react';
import RegistrarLayout from '@/Layouts/RegistrarLayout';
import { Head, useForm } from '@inertiajs/react';

export default function CreateSubject({ grades, streams, academicYear }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        grade_id: '',
        stream_id: '',
    });

    // Check if selected grade is 11 or 12
    const selectedGrade = grades.find(g => g.id == data.grade_id);
    const isGrade11or12 = selectedGrade && (selectedGrade.name === 'Grade 11' || selectedGrade.name === 'Grade 12');

    const handleGradeChange = (gradeId) => {
        setData('grade_id', gradeId);
        // Reset stream when grade changes
        const grade = grades.find(g => g.id == gradeId);
        if (!grade || (grade.name !== 'Grade 11' && grade.name !== 'Grade 12')) {
            setData('stream_id', '');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('registrar.admission.subjects.store'));
    };

    return (
        <RegistrarLayout>
            <Head title="Create Subject" />

            <div className="max-w-5xl mx-auto pb-12">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">SUBJECT CREATION</h1>
                        <p className="text-gray-500 text-sm mt-1">Configure subjects, assignments, and assessment weights</p>
                    </div>
                    <div className="text-sm font-medium bg-blue-50 text-blue-700 px-4 py-2 rounded-full border border-blue-100 italic">
                        Academic Year: {academicYear?.name}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                    {/* Subject Information */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Subject Information</h2>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                    placeholder="e.g. Advanced Mathematics"
                                    required
                                />
                                <p className="mt-2 text-xs text-gray-500">
                                    Subject code will be automatically generated based on the subject name.
                                </p>
                                {errors.name && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Placement Grade</label>
                                <select
                                    value={data.grade_id}
                                    onChange={(e) => handleGradeChange(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm bg-white"
                                    required
                                >
                                    <option value="">Select Grade</option>
                                    {grades.map((grade) => (
                                        <option key={grade.id} value={grade.id}>{grade.name}</option>
                                    ))}
                                </select>
                                {errors.grade_id && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.grade_id}</p>}
                            </div>

                            {/* Stream Selection - Only for Grade 11 & 12 */}
                            {isGrade11or12 && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Stream <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.stream_id}
                                        onChange={(e) => setData('stream_id', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm bg-white"
                                        required
                                    >
                                        <option value="">Select Stream</option>
                                        {streams && streams.map((stream) => (
                                            <option key={stream.id} value={stream.id}>{stream.name}</option>
                                        ))}
                                    </select>
                                    <p className="mt-2 text-xs text-gray-500">
                                        This subject will be automatically assigned to all sections of this grade with the selected stream.
                                    </p>
                                    {errors.stream_id && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.stream_id}</p>}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Creating...' : 'Create Subject'}
                        </button>
                    </div>
                </form>
            </div>
        </RegistrarLayout>
    );
}
