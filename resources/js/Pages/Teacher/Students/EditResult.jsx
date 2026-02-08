import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, useForm } from '@inertiajs/react';

export default function EditResult({ student, subject, assessments, marks, grade, section }) {
    const { data, setData, post, processing, errors } = useForm({
        marks: marks || {}, // { assessment_id: score }
    });

    const handleMarkChange = (assessmentId, value) => {
        setData('marks', {
            ...data.marks,
            [assessmentId]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('teacher.students.update-result', {
            student: student.id,
            subject: subject.id
        }), {
            onSuccess: () => {
                // inertia handles redirect
            }
        });
    };

    return (
        <TeacherLayout>
            <Head title={`Edit Result - ${student.user.name}`} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Edit Student Result</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                {student.user.name} ({student.student_id}) • {grade.name} - {section.name} • {subject.name}
                            </p>
                        </div>
                        <a
                            href={route('teacher.students.manage-results', { grade_id: grade.id, section_id: section.id })}
                            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                        >
                            ← Back to List
                        </a>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <form onSubmit={handleSubmit}>
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Assessment Marks</h3>

                                <div className="space-y-6">
                                    {assessments.map(assessment => (
                                        <div key={assessment.id} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                            <div className="sm:col-span-2">
                                                <label htmlFor={`mark-${assessment.id}`} className="block text-sm font-medium text-gray-700">
                                                    {assessment.name} <span className="text-xs text-gray-500 font-normal">({assessment.type})</span>
                                                </label>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    Max Score: {assessment.max_score} • Semester {assessment.semester}
                                                </p>
                                            </div>
                                            <div>
                                                <div className="relative rounded-md shadow-sm">
                                                    <input
                                                        type="number"
                                                        id={`mark-${assessment.id}`}
                                                        name={`mark-${assessment.id}`}
                                                        min="0"
                                                        max={assessment.max_score}
                                                        step="0.5"
                                                        disabled={!assessment.is_open}
                                                        value={data.marks[assessment.id] !== undefined ? data.marks[assessment.id] : ''}
                                                        onChange={(e) => handleMarkChange(assessment.id, e.target.value)}
                                                        className={`block w-full rounded-md sm:text-sm 
                                                            ${!assessment.is_open
                                                                ? 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed'
                                                                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                                            }
                                                        `}
                                                        placeholder={!assessment.is_open ? 'Closed' : `/${assessment.max_score}`}
                                                    />
                                                </div>
                                                {errors[`marks.${assessment.id}`] && (
                                                    <p className="mt-1 text-xs text-red-600">{errors[`marks.${assessment.id}`]}</p>
                                                )}
                                                {!assessment.is_open && (
                                                    <p className="mt-1 text-xs text-red-500">Semester Closed</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {assessments.length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            No assessments found for this subject.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="mr-3 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing || assessments.length === 0}
                                    className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
