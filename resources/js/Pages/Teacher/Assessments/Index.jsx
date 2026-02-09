import React from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    PlusIcon,
    TrashIcon,
    DocumentTextIcon,
    AcademicCapIcon,
    CheckCircleIcon,
    LockClosedIcon,
    ClockIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

export default function Index({ assessments, error, filters }) {
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this assessment?')) {
            router.delete(route('teacher.assessments-simple.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const clearFilters = () => {
        router.get(route('teacher.assessments-simple.index'));
    };

    // Deduplicate assessments by name, grade, subject, and date
    const uniqueAssessments = assessments?.reduce((acc, assessment) => {
        const key = `${assessment.name}-${assessment.grade?.id}-${assessment.subject?.id}-${assessment.due_date || assessment.date}`;
        if (!acc[key]) {
            acc[key] = assessment;
        }
        return acc;
    }, {});

    const deduplicatedAssessments = uniqueAssessments ? Object.values(uniqueAssessments) : [];

    const isFiltered = filters?.grade_id || filters?.section_id;

    return (
        <TeacherLayout>
            <Head title="Assessments" />

            {/* Premium Header / Hero */}
            <div className="bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] shadow-lg mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden group">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-screen filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                </div>

                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-blue-500/20 rounded-2xl backdrop-blur-md border border-blue-400/30">
                                <DocumentTextIcon className="w-5 h-5 text-blue-200" />
                            </div>
                            <span className="text-blue-200 font-black uppercase tracking-[0.3em] text-[10px]">Academic Evaluation</span>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight leading-none">
                            MY <span className="text-blue-300">ASSESSMENTS</span>
                        </h1>
                        <p className="mt-4 text-blue-100/60 font-medium max-w-xl">
                            Create, track, and manage student evaluations. High-precision tools for academic performance measurement.
                        </p>
                    </div>

                    {!error && (
                        <Link
                            href={route('teacher.assessments-simple.create')}
                            className="inline-flex items-center px-10 py-5 bg-white text-blue-600 text-xs font-black uppercase tracking-widest rounded-[32px] hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-blue-500/20 transition-all active:translate-y-0"
                        >
                            <PlusIcon className="w-5 h-5 mr-3" />
                            Create New Assessment
                        </Link>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto pb-12">
                {error ? (
                    <div className="bg-rose-50 border-2 border-rose-100 rounded-[32px] p-8 flex items-center gap-6 shadow-xl shadow-rose-900/5">
                        <div className="w-16 h-16 rounded-[24px] bg-rose-100 flex items-center justify-center text-rose-600">
                            <AcademicCapIcon className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-rose-900 font-black uppercase tracking-widest text-sm mb-1">System Error</h3>
                            <p className="text-rose-700 font-medium text-sm">{error}</p>
                        </div>
                    </div>
                ) : deduplicatedAssessments && deduplicatedAssessments.length > 0 ? (
                    <div className="bg-white rounded-[40px] border-2 border-gray-50 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-100 bg-white sticky top-0 z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                                    ASSESSMENT BOARD
                                    {isFiltered && (
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100">
                                                Filtered View
                                            </span>
                                            <button
                                                onClick={clearFilters}
                                                className="text-[10px] font-black text-gray-400 hover:text-rose-500 uppercase tracking-widest transition-colors"
                                            >
                                                [Clear]
                                            </button>
                                        </div>
                                    )}
                                </h2>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Real-time Evaluation tracking</p>
                            </div>
                            <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                                <ChartBarIcon className="w-5 h-5 text-blue-500" />
                                <span className="text-xs font-black text-gray-600 uppercase tracking-widest">{deduplicatedAssessments.length} Total</span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-50">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Title</th>
                                        <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Assignment</th>
                                        <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Date</th>
                                        <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Max Score</th>
                                        <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                        <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Control</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-50">
                                    {deduplicatedAssessments.map((assessment) => (
                                        <tr key={assessment.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="text-sm font-black text-gray-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                                                    {assessment.name}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="flex flex-col gap-1">
                                                    <div className="text-xs font-black text-gray-700 uppercase">{assessment.grade?.name}</div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{assessment.subject?.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-xs font-black text-gray-900 tabular-nums">
                                                    <ClockIcon className="w-4 h-4 text-gray-300" />
                                                    {new Date(assessment.due_date || assessment.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="inline-flex items-center px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-sm font-black text-gray-900 tabular-nums shadow-sm">
                                                    {assessment.max_score || assessment.total_marks}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <span className={`px-4 py-1.5 inline-flex text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm
                                                    ${assessment.status === 'published'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : assessment.status === 'locked'
                                                            ? 'bg-rose-100 text-rose-700'
                                                            : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {assessment.status || 'draft'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap text-right">
                                                <button
                                                    onClick={() => handleDelete(assessment.id)}
                                                    className={`p-3 rounded-2xl transition-all shadow-sm flex items-center justify-center ml-auto
                                                        ${assessment.status === 'locked'
                                                            ? 'bg-gray-50 text-gray-300 cursor-not-allowed border border-gray-100'
                                                            : 'bg-white text-rose-500 border border-rose-100 hover:bg-rose-600 hover:text-white hover:border-rose-600'
                                                        }
                                                    `}
                                                    disabled={assessment.status === 'locked'}
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-[40px] border-2 border-dashed border-gray-200 p-20 text-center flex flex-col items-center">
                        <div className="w-24 h-24 rounded-[32px] bg-gray-50 flex items-center justify-center text-gray-200 mb-8 border border-gray-100 shadow-inner">
                            <DocumentTextIcon className="w-12 h-12" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase mb-2">No Assessments Found</h3>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">
                            Your Evaluation board is currently empty.
                        </p>
                        <Link
                            href={route('teacher.assessments-simple.create')}
                            className="inline-flex items-center px-12 py-5 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-[32px] hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-blue-200 transition-all active:translate-y-0"
                        >
                            <PlusIcon className="w-5 h-5 mr-3" />
                            Create Your First Assessment
                        </Link>
                    </div>
                )}
            </div>
        </TeacherLayout>
    );
}
