import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import DirectorLayout from '@/Layouts/DirectorLayout';
import {
    CalendarIcon,
    PlusIcon,
    ClockIcon,
    CheckCircleIcon,
    LockClosedIcon,
    LockOpenIcon,
    ArrowRightIcon,
    ExclamationTriangleIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ArchiveBoxIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function AcademicYearsIndex({ currentYear, pastYears, auth }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [expandedYearId, setExpandedYearId] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        start_date: '',
        end_date: '',
        set_as_current: true,
    });

    const handleCreate = (e) => {
        e.preventDefault();
        post(route('director.academic-years.store'), {
            onSuccess: () => {
                setShowCreateModal(false);
                reset();
            },
        });
    };

    const toggleSemester = (semester, action, yearId) => {
        const actionText = action === 'open' ? 'OPEN' : 'CLOSE';
        if (!confirm(`Are you sure you want to ${actionText} Semester ${semester}? This will affect all grades for this academic year.`)) return;

        router.post(route('director.academic-years.toggle-semester'), {
            semester,
            action,
            academic_year_id: yearId
        });
    };

    const toggleYearExpansion = (yearId) => {
        setExpandedYearId(expandedYearId === yearId ? null : yearId);
    };

    const SemesterCard = ({ number, statusData, yearId, isCurrent }) => {
        // Status data might be missing if no semesters generated for old years
        // Fallback safely
        if (!statusData) return null;

        const isOpen = statusData.status === 'open';
        const canOpen = statusData.can_open;

        return (
            <div className={`relative flex-1 p-5 rounded-xl border transition-all ${isOpen
                ? 'border-green-500 bg-green-50/50'
                : 'border-gray-200 bg-white'
                }`}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Semester {number}</h3>
                        <p className={`text-sm font-medium flex items-center gap-1.5 ${isOpen ? 'text-green-700' : 'text-gray-500'
                            }`}>
                            <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                            {isOpen ? 'Active' : 'Closed'}
                        </p>
                    </div>
                    <div className={`p-2 rounded-lg ${isOpen ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                        {isOpen ? <LockOpenIcon className="w-5 h-5" /> : <LockClosedIcon className="w-5 h-5" />}
                    </div>
                </div>

                <div className="mt-4">
                    {isOpen ? (
                        <button
                            onClick={() => toggleSemester(number, 'close', yearId)}
                            className="w-full py-2 px-4 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
                        >
                            <LockClosedIcon className="w-4 h-4" />
                            Close Semester
                        </button>
                    ) : (
                        <button
                            onClick={() => toggleSemester(number, 'open', yearId)}
                            disabled={!canOpen}
                            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm shadow-sm ${canOpen
                                ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-200'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                }`}
                        >
                            <LockOpenIcon className="w-4 h-4" />
                            {canOpen ? 'Open Semester' : 'Locked'}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <DirectorLayout>
            <Head title="Academic Year Management" />

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Academic Year Management</h1>
                        <p className="text-gray-500 mt-1">Control academic progression and semester status</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 bg-indigo-900 hover:bg-indigo-800 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        <PlusIcon className="w-5 h-5" />
                        New Academic Year
                    </button>
                </div>

                {/* Current Active Year */}
                {currentYear ? (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <CalendarIcon className="w-64 h-64" />
                        </div>

                        <div className="bg-indigo-900/5 px-6 py-4 border-b border-gray-200 flex justify-between items-center relative z-10">
                            <div className="flex items-center gap-4">
                                <span className="px-2.5 py-1 bg-amber-400 text-indigo-900 text-xs font-bold rounded-md uppercase tracking-wider shadow-sm">
                                    Current
                                </span>
                                <h2 className="text-xl font-bold text-indigo-900">{currentYear.name}</h2>
                            </div>
                            <div className="text-gray-500 text-sm font-medium flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                                <CalendarIcon className="w-4 h-4 text-gray-400" />
                                {currentYear.start_date} — {currentYear.end_date}
                            </div>
                        </div>

                        <div className="p-8 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-8 items-center">
                                {/* Semester 1 */}
                                <SemesterCard
                                    number={1}
                                    statusData={currentYear.semesters[1]}
                                    yearId={currentYear.id}
                                    isCurrent={true}
                                />

                                {/* Flow Arrow */}
                                <div className="hidden md:flex flex-col items-center justify-center text-gray-300">
                                    <ArrowRightIcon className="w-8 h-8" />
                                </div>

                                {/* Semester 2 */}
                                <SemesterCard
                                    number={2}
                                    statusData={currentYear.semesters[2]}
                                    yearId={currentYear.id}
                                    isCurrent={true}
                                />
                            </div>

                            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
                                <ExclamationTriangleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-blue-900 text-sm">Progression Logic</h4>
                                    <p className="text-sm text-blue-700 mt-1 leading-relaxed">
                                        Semester 2 can only be opened after Semester 1 is closed.
                                        <strong> Important:</strong> Closing Semester 2 will automatically generate the next academic year.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-amber-50 border-2 border-amber-200/50 rounded-2xl p-10 text-center">
                        <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ExclamationTriangleIcon className="w-8 h-8 text-amber-600" />
                        </div>
                        <h3 className="text-xl font-bold text-amber-900">No Active Academic Year</h3>
                        <p className="text-amber-700 mt-2 mb-8 max-w-md mx-auto">
                            There is currently no active academic year. Create a new one to start managing semesters and classes.
                        </p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-md hover:shadow-lg"
                        >
                            Initialize Academic Year
                        </button>
                    </div>
                )}

                {/* Past Years Timeline */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 pl-1">
                        <ArchiveBoxIcon className="w-5 h-5 text-gray-400" />
                        Academic History
                    </h2>

                    {pastYears.length > 0 ? (
                        <div className="grid gap-4">
                            {pastYears.map((year) => {
                                const isExpanded = expandedYearId === year.id;
                                return (
                                    <div
                                        key={year.id}
                                        className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${isExpanded ? 'border-indigo-200 shadow-md ring-1 ring-indigo-50' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div
                                            onClick={() => toggleYearExpansion(year.id)}
                                            className="px-6 py-4 flex items-center justify-between cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg transition-colors ${isExpanded ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-600'}`}>
                                                    <ClockIcon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                        {year.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {year.start_date} — {year.end_date}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${year.status === 'completed'
                                                    ? 'bg-gray-100 text-gray-600 border-gray-200'
                                                    : 'bg-blue-50 text-blue-600 border-blue-100'
                                                    }`}>
                                                    {year.status.toUpperCase()}
                                                </span>
                                                {isExpanded ? (
                                                    <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                                                ) : (
                                                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="px-6 pb-6 pt-2 border-t border-gray-100 bg-gray-50/30">
                                                {/* Actions */}
                                                <div className="flex justify-end mb-4">
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Set this as the CURRENT active academic year? This will deactivate the current one.')) {
                                                                router.post(route('director.academic-years.set-current', year.id));
                                                            }
                                                        }}
                                                        className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
                                                    >
                                                        <ArrowPathIcon className="w-3.5 h-3.5" />
                                                        Set as Current Year
                                                    </button>
                                                </div>

                                                {/* Semesters for this past year */}
                                                {/* We need to fetch semester statuses for past years. 
                                                    Currently the index controller passes basic info. 
                                                    We might need to update the controller to pass semester details for past years too 
                                                    OR make a separate request.
                                                    
                                                    But wait! The controller DOES pass 'semesterStatuses' relation for past years.
                                                    We need to parse it to match the 'SemesterCard' format.
                                                */}

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {[1, 2].map(semNum => {
                                                        // Find status
                                                        const status = year.semesterStatuses?.find(s => s.semester === semNum);
                                                        // Mock the structure expected by SemesterCard
                                                        const statusData = status ? {
                                                            status: status.status,
                                                            can_open: true, // Directors can force open past semesters
                                                            open_count: status.status === 'open' ? 1 : 0
                                                        } : { status: 'closed', can_open: true, open_count: 0 }; // Default if missing

                                                        return (
                                                            <div key={semNum} className="bg-white p-4 rounded-lg border border-gray-200">
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <span className="font-bold text-gray-700">Semester {semNum}</span>
                                                                    <span className={`text-xs px-2 py-1 rounded ${statusData.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                                                        }`}>
                                                                        {statusData.status.toUpperCase()}
                                                                    </span>
                                                                </div>

                                                                {statusData.status === 'open' ? (
                                                                    <button
                                                                        onClick={() => toggleSemester(semNum, 'close', year.id)}
                                                                        className="w-full mt-2 py-1.5 px-3 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs rounded-md font-medium transition-colors"
                                                                    >
                                                                        Close Access
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => toggleSemester(semNum, 'open', year.id)}
                                                                        className="w-full mt-2 py-1.5 px-3 bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs rounded-md font-medium transition-colors"
                                                                    >
                                                                        Re-open for Editing
                                                                    </button>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <ArchiveBoxIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500">No archival history available yet.</p>
                        </div>
                    )}
                </div>

                {/* Create Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all scale-100">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">New Academic Year</h2>
                                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <span className="sr-only">Close</span>
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleCreate} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Year Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., 2026-2027"
                                        className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Date</label>
                                        <input
                                            type="date"
                                            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                                            value={data.start_date}
                                            onChange={e => setData('start_date', e.target.value)}
                                            required
                                        />
                                        {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                        <input
                                            type="date"
                                            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                            value={data.end_date}
                                            onChange={e => setData('end_date', e.target.value)}
                                            required
                                        />
                                        {errors.end_date && <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-2">
                                    <input
                                        type="checkbox"
                                        id="set_current"
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        checked={data.set_as_current}
                                        onChange={e => setData('set_as_current', e.target.checked)}
                                    />
                                    <label htmlFor="set_current" className="text-sm text-gray-700">
                                        Set as active academic year immediately
                                    </label>
                                </div>

                                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-indigo-900 text-white rounded-lg font-medium hover:bg-indigo-800 disabled:opacity-50"
                                    >
                                        {processing ? 'Creating...' : 'Create Year'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DirectorLayout>
    );
}
