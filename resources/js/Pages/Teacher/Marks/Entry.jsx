import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import ModernMarkTable from '@/Components/Marks/ModernMarkTable';
import BulkOperationsPanel from '@/Components/Marks/BulkOperationsPanel';
import PerformancePreview from '@/Components/Marks/PerformancePreview';
import {
    ChevronRightIcon,
    ArrowUpTrayIcon,
    ClipboardDocumentIcon,
    Cog6ToothIcon,
    ChartBarIcon,
    BookmarkIcon
} from '@heroicons/react/24/outline';

export default function Entry({ assessment, students, subject, semester, is_locked }) {
    const [showBulkOps, setShowBulkOps] = useState(false);
    const [showPerformance, setShowPerformance] = useState(true);

    const { data, setData, post, processing } = useForm({
        assessment_id: assessment.id,
        marks: [],
    });

    // Initialize marks from props if not already set
    if (data.marks.length === 0 && students.length > 0) {
        /* 
           We can likely rely on ModernMarkTable to handle local state, 
           but if we need to initialize form data here:
        */
        const initialMarks = students.map(s => ({
            student_id: s.id,
            marks_obtained: s.mark, // Map 'score' to 'marks_obtained' if consistent
            student_name: s.name,
            student_code: s.student_id
        }));
        // Note: useForm might warn if we set data during render. 
        // Better to use useEffect or initialize in useForm argument.
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('teacher.marks.store'));
    };

    // Calculate stats for bottom bar
    const enteredCount = data.marks?.filter(m => m.marks_obtained !== null && m.marks_obtained !== '').length || 0;
    const totalCount = students.length;
    const completionPercentage = totalCount > 0 ? Math.round((enteredCount / totalCount) * 100) : 0;

    const marks = data.marks?.map(m => m.marks_obtained) || [];
    const validMarks = marks.filter(m => m !== null && m !== '' && m !== undefined);
    const average = validMarks.length > 0
        ? (validMarks.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / validMarks.length).toFixed(1)
        : 0;

    return (
        <TeacherLayout>
            <Head title={`Enter Marks - ${assessment.name}`} />

            {/* Header Area with Gradient */}
            <div className="bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] shadow-md mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-blue-100/80 mb-4">
                    <span className="hover:text-white transition-colors cursor-pointer">Grade {assessment.grade?.name || 'N/A'}</span>
                    <ChevronRightIcon className="w-4 h-4 mx-2 text-white/50" />
                    <span className="hover:text-white transition-colors cursor-pointer">Section {assessment.section?.name || 'N/A'}</span>
                    <ChevronRightIcon className="w-4 h-4 mx-2 text-white/50" />
                    <span className="hover:text-white transition-colors cursor-pointer">{subject}</span>
                    <ChevronRightIcon className="w-4 h-4 mx-2 text-white/50" />
                    <span className="font-semibold text-white">{assessment.name}</span>
                </div>

                {/* Header Content */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">📊 Enter Marks</h1>
                        <p className="text-blue-100 mt-1">
                            {subject} • Semester {semester} • {students.length} Students
                        </p>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 shadow-lg">
                        <span className="text-white font-medium">{assessment.name}</span>
                        <span className="px-2 py-0.5 bg-white text-[#1E40AF] text-xs font-bold rounded-full">
                            {assessment.weight}% Weight
                        </span>
                    </div>
                </div>
            </div>

            {/* Quick Actions Toolbar */}
            {is_locked && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 mx-4 sm:mx-0 rounded-r-lg shadow-sm">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Cog6ToothIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">
                                <span className="font-bold">Read Only Mode:</span> Result entry for Semester {semester} is currently <span className="font-bold">CLOSED</span> by the Director. You cannot edit marks.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-6">
                <button
                    onClick={() => setShowBulkOps(!showBulkOps)}
                    disabled={is_locked}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-colors ${showBulkOps ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-2 border-blue-200 hover:bg-blue-50'
                        } ${is_locked ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <ArrowUpTrayIcon className="w-5 h-5" />
                    <span>Import CSV</span>
                </button>

                <button
                    onClick={() => setShowBulkOps(!showBulkOps)}
                    disabled={is_locked}
                    className={`flex items-center space-x-2 px-4 py-2 bg-white text-green-600 border-2 border-green-200 rounded-lg font-semibold hover:bg-green-50 transition-colors ${is_locked ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <ClipboardDocumentIcon className="w-5 h-5" />
                    <span>Paste Data</span>
                </button>

                <button
                    onClick={() => setShowPerformance(!showPerformance)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-colors ${showPerformance ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 border-2 border-purple-200 hover:bg-purple-50'
                        }`}
                >
                    <ChartBarIcon className="w-5 h-5" />
                    <span>Stats</span>
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-600 border-2 border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                    <BookmarkIcon className="w-5 h-5" />
                    <span>Save Draft</span>
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-600 border-2 border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                    <Cog6ToothIcon className="w-5 h-5" />
                    <span>Settings</span>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Bulk Operations Panel */}
                {showBulkOps && (
                    <BulkOperationsPanel
                        assessmentId={assessment.id}
                        onImportComplete={() => window.location.reload()}
                    />
                )}

                {/* Performance Preview */}
                {showPerformance && (
                    <PerformancePreview marks={marks} />
                )}

                {/* Modern Mark Table */}
                <ModernMarkTable
                    students={students}
                    data={data}
                    setData={setData}
                    maxScore={assessment.max_score || 100}
                    disabled={is_locked}
                />

                {/* Bottom Stats Bar */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center space-x-6">
                            <div>
                                <p className="text-blue-100 text-sm">Entered</p>
                                <p className="text-2xl font-bold text-white">{enteredCount}/{totalCount}</p>
                            </div>
                            <div>
                                <p className="text-blue-100 text-sm">Average</p>
                                <p className="text-2xl font-bold text-white">{average}%</p>
                            </div>
                            <div>
                                <p className="text-blue-100 text-sm">Progress</p>
                                <p className="text-2xl font-bold text-white">{completionPercentage}%</p>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-6 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors"
                            >
                                ← Back
                            </button>
                            <button
                                type="submit"
                                disabled={processing || is_locked}
                                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg flex items-center space-x-2"
                            >
                                {processing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        {is_locked ? 'Locked' : 'Submit All Marks →'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </TeacherLayout>
    );
}
