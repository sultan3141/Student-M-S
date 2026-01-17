import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { useState } from 'react';

export default function MarksCreate({ auth, section, subject, students, assessmentTypes }) {
    // Initial marks state populated with null/empty
    const initialMarks = {};
    students.forEach(student => {
        initialMarks[student.id] = '';
    });

    const { data, setData, post, processing, errors } = useForm({
        section_id: section.id,
        subject_id: subject.id,
        semester: 'Term 1', // Default
        assessment_type: assessmentTypes[0], // Default first type
        marks: initialMarks,
    });

    const handleMarkChange = (studentId, value) => {
        setData('marks', {
            ...data.marks,
            [studentId]: value,
        });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('teacher.marks.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Enter Marks: {subject.name} ({section.grade.name} - {section.name})</h2>}
        >
            <Head title={`Grading - ${subject.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">

                            <form onSubmit={submit}>
                                {/* Assessment Settings */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <InputLabel htmlFor="semester" value="Semester / Term" />
                                        <select
                                            id="semester"
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            value={data.semester}
                                            onChange={(e) => setData('semester', e.target.value)}
                                            required
                                        >
                                            <option value="Term 1">Term 1</option>
                                            <option value="Term 2">Term 2</option>
                                        </select>
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="assessment_type" value="Assessment Type" />
                                        <select
                                            id="assessment_type"
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            value={data.assessment_type}
                                            onChange={(e) => setData('assessment_type', e.target.value)}
                                            required
                                        >
                                            {assessmentTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Grading Table */}
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Score (0-100)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {students.map((student) => (
                                                <tr key={student.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {student.student_id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {student.user.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <TextInput
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            className="w-full"
                                                            value={data.marks[student.id]}
                                                            onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                                            placeholder="-"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-8 flex items-center justify-end">
                                    <Link
                                        href={route('teacher.marks.index')}
                                        className="text-sm text-gray-600 underline hover:text-indigo-900 mr-4"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        Save Marks
                                    </PrimaryButton>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
