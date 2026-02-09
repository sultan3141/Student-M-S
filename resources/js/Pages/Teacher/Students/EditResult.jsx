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

            <div className="py-8 bg-gray-50/50 min-h-screen">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header with Gradient Background */}
                    <div className="relative overflow-hidden bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 mb-8 group">
                        <div className="absolute top-0 right-0 -m-8 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-colors duration-500"></div>
                        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                    <Link href={route('teacher.students.manage-results')} className="hover:text-blue-600 transition-colors">Manage Results</Link>
                                    <span className="text-gray-300">/</span>
                                    <span className="text-gray-900">Edit Marks</span>
                                </div>
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none uppercase">
                                    EDIT STUDENT <span className="text-blue-600">RESULT</span>
                                </h1>
                                <p className="mt-3 text-sm font-bold text-gray-400 uppercase tracking-widest">
                                    {student.user.name} • {grade.name} {section.name} • {subject.name}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mark Entry Progress</div>
                                <div className="flex items-center gap-4">
                                    <div className="w-48 h-3 bg-blue-50 rounded-full overflow-hidden border border-blue-100/50">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000"
                                            style={{ width: `${(Object.keys(data.marks).length / assessments.length) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-lg font-black text-blue-600 tabular-nums">
                                        {Math.round((Object.keys(data.marks).length / assessments.length) * 100)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Assessment Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {assessments.map(assessment => (
                                <div
                                    key={assessment.id}
                                    className={`relative group bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 transition-all duration-300 hover:shadow-2xl hover:translate-y-[-4px] 
                                        ${!assessment.is_open ? 'opacity-75 grayscale-[0.5]' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:rotate-6 transition-transform">
                                            <AcademicCapIcon className="w-6 h-6" />
                                        </div>
                                        {!assessment.is_open && (
                                            <span className="px-3 py-1 bg-red-50 text-red-600 text-[8px] font-black uppercase tracking-widest rounded-full">
                                                Locked
                                            </span>
                                        )}
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-1">{assessment.name}</h3>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{assessment.type}</span>
                                            <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Max: {assessment.max_score}</span>
                                        </div>
                                    </div>

                                    <div className="relative">
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
                                            className={`block w-full px-6 py-4 rounded-2xl text-lg font-black tracking-tight transition-all
                                                ${!assessment.is_open
                                                    ? 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed'
                                                    : 'bg-white border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 border-2'
                                                }
                                            `}
                                            placeholder={!assessment.is_open ? 'LOCKED' : `ENTER MARKS / ${assessment.max_score}`}
                                        />
                                        {errors[`marks.${assessment.id}`] && (
                                            <p className="mt-3 text-[10px] font-black text-red-600 uppercase tracking-widest">{errors[`marks.${assessment.id}`]}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {assessments.length === 0 && (
                            <div className="bg-white rounded-[2rem] p-12 text-center border border-dashed border-gray-200">
                                <AcademicCapIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                <h3 className="text-lg font-black text-gray-400 uppercase tracking-[0.2em]">No Assessments Available</h3>
                            </div>
                        )}

                        {/* Footer Actions */}
                        <div className="flex items-center justify-between bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-gray-900 transition-colors"
                            >
                                Cancel Changes
                            </button>
                            <button
                                type="submit"
                                disabled={processing || assessments.length === 0}
                                className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-xs font-black uppercase tracking-widest rounded-3xl hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-blue-200 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        SYCHRONIZING...
                                    </>
                                ) : (
                                    <>
                                        <ClipboardDocumentCheckIcon className="w-4 h-4 mr-2" />
                                        Save All Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </TeacherLayout>
    );
}
