import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function UploadMarks({ auth, assessment, students, existingMarks }) {
    const [marks, setMarks] = useState(() => {
        const initialMarks = {};
        students.forEach(student => {
            initialMarks[student.id] = {
                student_id: student.id,
                score: existingMarks[student.id] || '',
                remarks: ''
            };
        });
        return initialMarks;
    });

    const { post, processing } = useForm();

    const handleScoreChange = (studentId, score) => {
        setMarks(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                score: score
            }
        }));
    };

    const handleRemarksChange = (studentId, remarks) => {
        setMarks(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                remarks: remarks
            }
        }));
    };

    const submit = (e) => {
        e.preventDefault();
        
        // Filter out empty scores
        const validMarks = Object.values(marks).filter(mark => mark.score !== '');
        
        post(route('marks.store', assessment.id), {
            data: { marks: validMarks }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Upload Marks</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {assessment.title} - {assessment.subject?.name} ({assessment.grade?.name})
                    </p>
                </div>
            }
        >
            <Head title="Upload Marks" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Assessment Details</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-700">Type:</span>
                                            <span className="ml-2">{assessment.assessment_type}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Max Score:</span>
                                            <span className="ml-2">{assessment.max_score}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Semester:</span>
                                            <span className="ml-2">{assessment.semester}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Students:</span>
                                            <span className="ml-2">{students.length}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={submit}>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Student
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Student ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Score (/{assessment.max_score})
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Remarks
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {students.map((student) => (
                                                <tr key={student.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {student.user?.name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {student.student_id}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max={assessment.max_score}
                                                            step="0.01"
                                                            value={marks[student.id]?.score || ''}
                                                            onChange={(e) => handleScoreChange(student.id, e.target.value)}
                                                            className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                            placeholder="0"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            type="text"
                                                            value={marks[student.id]?.remarks || ''}
                                                            onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                            placeholder="Optional remarks"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Uploading...' : 'Upload Marks'}
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