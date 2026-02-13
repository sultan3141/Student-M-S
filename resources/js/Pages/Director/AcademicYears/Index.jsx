import React, { useState, useEffect } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import DirectorLayout from '@/Layouts/DirectorLayout';
import {
    CalendarIcon,
    PlusIcon,
    ClockIcon,
    LockClosedIcon,
    LockOpenIcon,
    ArrowRightIcon,
    ExclamationTriangleIcon,
    ChevronDownIcon,
    ArchiveBoxIcon,
    ArrowPathIcon,
    EllipsisHorizontalIcon,
    CheckCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export default function AcademicYearsIndex({ currentYear, pastYears, auth }) {
    const { flash } = usePage().props;
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 5000);
        }
    }, [flash]);
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
        if (!confirm(`Are you sure you want to ${actionText} Semester ${semester}? This will affect all grades.`)) return;

        router.post(route('director.academic-years.toggle-semester'), {
            semester,
            action,
            academic_year_id: yearId
        });
    };

    const toggleYearExpansion = (yearId) => {
        setExpandedYearId(expandedYearId === yearId ? null : yearId);
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            open: 'bg-emerald-500 text-white ring-emerald-600 shadow-lg shadow-emerald-200',
            closed: 'bg-red-50 text-red-700 ring-red-600/10',
            upcoming: 'bg-blue-50 text-blue-700 ring-blue-700/10',
            completed: 'bg-gray-100 text-gray-700 ring-gray-600/20'
        };
        const config = styles[status] || styles.closed;

        return (
            <span className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-bold ring-2 ring-inset ${config} transition-all`}>
                {status.toUpperCase()}
            </span>
        );
    };

    const SemesterCard = ({ number, statusData, yearId, isCurrent }) => {
        if (!statusData) return null;

        const isOpen = statusData.status === 'open';
        const canOpen = statusData.can_open;
        const isArchive = !isCurrent;

        return (
            <div className={`flex flex-col border rounded-lg shadow-sm transition-all duration-300 ${isOpen
                ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-400 ring-4 ring-emerald-100 shadow-emerald-200'
                : 'bg-white border-gray-200'
                }`}>
                <div className={`p-5 border-b flex justify-between items-start ${isOpen ? 'border-emerald-200 bg-white/50' : 'border-gray-100'
                    }`}>
                    <div>
                        <h4 className={`text-sm font-semibold uppercase tracking-wide ${isOpen ? 'text-emerald-700' : 'text-gray-500'
                            }`}>Semester {number}</h4>
                        <div className="mt-2 flex items-center gap-2">
                            <StatusBadge status={statusData.status} />
                            {isOpen && (
                                <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-700">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
                                    </span>
                                    Accepting Marks
                                </span>
                            )}
                        </div>
                    </div>
                    {isOpen ? (
                        <LockOpenIcon className="w-6 h-6 text-emerald-600" />
                    ) : (
                        <LockClosedIcon className="w-6 h-6 text-gray-400" />
                    )}
                </div>

                <div className="p-4 bg-gray-50/50 rounded-b-lg flex-1 flex flex-col gap-3">
                    {isOpen ? (
                        <>
                            <p className="text-xs text-gray-500">
                                {number === 2 && isCurrent ? (
                                    "Closing will calculate yearly results and AUTO-CREATE the next academic year."
                                ) : (
                                    "Closing will calculate results for this period and lock mark entry."
                                )}
                            </p>
                            <button
                                onClick={() => toggleSemester(number, 'close', yearId)}
                                className="w-full inline-flex justify-center items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-200 hover:bg-red-50 hover:ring-red-300 transition-all"
                            >
                                <LockClosedIcon className="-ml-0.5 h-4 w-4" aria-hidden="true" />
                                Close Period
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="text-xs text-gray-500">
                                {isArchive ? (
                                    "Reopening an archived semester allows teachers to correct historical marks."
                                ) : (
                                    canOpen ? "Opening access allows teachers to start declaring results." : "Semester 1 must be closed before opening Semester 2."
                                )}
                            </p>
                            <button
                                onClick={() => toggleSemester(number, 'open', yearId)}
                                disabled={!canOpen}
                                className={`w-full inline-flex justify-center items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset transition-all ${canOpen
                                    ? isArchive
                                        ? 'bg-amber-50 text-amber-700 ring-amber-200 hover:bg-amber-100'
                                        : 'bg-slate-800 text-white hover:bg-slate-700 ring-slate-800'
                                    : 'bg-gray-100 text-gray-400 ring-gray-200 cursor-not-allowed'
                                    }`}
                            >
                                {isArchive ? (
                                    <><ArrowPathIcon className="-ml-0.5 h-4 w-4" /> Reopen for Edits</>
                                ) : (
                                    canOpen ? 'Open Access' : 'Locked'
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <DirectorLayout>
            <Head title="Academic Year Management" />

            <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                            Academic Management
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Manage academic calendars, control semester access, and view historical archives.
                        </p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <button
                            type="button"
                            onClick={() => setShowCreateModal(true)}
                            className="block rounded-md bg-slate-800 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
                        >
                            Create Academic Year
                        </button>
                    </div>
                </div>

                <div className="mt-8 space-y-8">
                    {/* Current Active Year */}
                    <section aria-labelledby="active-year-heading">
                        <div className="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5">
                            <div className="border-b border-gray-200 px-4 py-5 sm:px-6 flex justify-between items-center bg-gray-50/50 rounded-t-lg">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-600">
                                        <CalendarIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <h2 id="active-year-heading" className="text-lg font-semibold leading-6 text-gray-900">
                                            Current Academic Year
                                        </h2>
                                        <p className="mt-1 flex items-center text-sm text-gray-500">
                                            <span className="truncate">{currentYear ? currentYear.name : 'No Active Year'}</span>
                                        </p>
                                    </div>
                                </div>
                                {currentYear && (
                                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                        Active Cycle
                                    </span>
                                )}
                            </div>

                            {currentYear ? (
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                                        <div className="col-span-1 md:col-span-2 bg-slate-900 text-white p-5 rounded-xl shadow-lg border border-slate-700">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 bg-slate-800 rounded-lg p-2">
                                                    <ArrowPathIcon className="h-6 w-6 text-emerald-400" aria-hidden="true" />
                                                </div>
                                                <div className="ml-4">
                                                    <h3 className="text-md font-bold text-white uppercase tracking-wider">Automated Progression Rule</h3>
                                                    <p className="mt-1 text-sm text-slate-300 leading-relaxed">
                                                        The workflow is fully automated for efficiency:
                                                        <span className="block mt-1 font-semibold text-emerald-400">
                                                            S1 Close &rarr; S2 Opens Automatically | S2 Close &rarr; Year Archives &amp; Next Year Starts
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <SemesterCard
                                            number={1}
                                            statusData={currentYear.semesters[1]}
                                            yearId={currentYear.id}
                                            isCurrent={true}
                                        />

                                        <SemesterCard
                                            number={2}
                                            statusData={currentYear.semesters[2]}
                                            yearId={currentYear.id}
                                            isCurrent={true}
                                        />
                                    </div>
                                    <div className="mt-6 border-t border-gray-100 pt-4">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <ClockIcon className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                                            Duration: <span className="font-medium text-gray-900 ml-1">{currentYear.start_date} - {currentYear.end_date}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <ArchiveBoxIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No active academic year</h3>
                                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new academic cycle.</p>
                                    <div className="mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowCreateModal(true)}
                                            className="inline-flex items-center rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
                                        >
                                            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                                            Initialize Year
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Historical Archives */}
                    <section aria-labelledby="history-heading">
                        <div className="flex items-center justify-between mb-4">
                            <h2 id="history-heading" className="text-base font-semibold leading-6 text-gray-900">
                                Archives
                            </h2>
                        </div>
                        <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5">
                            <ul role="list" className="divide-y divide-gray-100">
                                {pastYears.length > 0 ? pastYears.map((year) => {
                                    const isExpanded = expandedYearId === year.id;
                                    return (
                                        <li key={year.id} className="transition hover:bg-gray-50">
                                            <div className="px-4 py-4 sm:px-6">
                                                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleYearExpansion(year.id)}>
                                                    <div className="flex gap-4 items-center">
                                                        <div className="flex-shrink-0">
                                                            <div className="h-10 w-10 flex items-center justify-center rounded bg-gray-100 text-gray-500">
                                                                <ClockIcon className="h-5 w-5" />
                                                            </div>
                                                        </div>
                                                        <div className="min-w-0 flex-auto">
                                                            <p className="text-sm font-semibold leading-6 text-gray-900">{year.name}</p>
                                                            <p className="truncate text-xs leading-5 text-gray-500">{year.start_date} to {year.end_date}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <StatusBadge status={year.status} />
                                                        <ChevronDownIcon className={`h-5 w-5 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                    </div>
                                                </div>

                                                {isExpanded && (
                                                    <div className="mt-4 pl-14 pr-2 pb-2 border-t border-gray-100 pt-4">
                                                        <div className="flex justify-end mb-4">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (confirm('Set this as the CURRENT active academic year? This will deactivate the current one.')) {
                                                                        router.post(route('director.academic-years.set-current', year.id));
                                                                    }
                                                                }}
                                                                className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1"
                                                            >
                                                                <ArrowPathIcon className="w-3.5 h-3.5" />
                                                                Reactivate Year
                                                            </button>
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            {[1, 2].map(semNum => {
                                                                const status = year.semesterStatuses?.find(s => s.semester === semNum);
                                                                return (
                                                                    <div key={semNum} className="rounded-md border border-gray-200 p-3 bg-gray-50 flex items-center justify-between">
                                                                        <span className="text-sm font-medium text-gray-700">Semester {semNum}</span>
                                                                        <div className="flex items-center gap-3">
                                                                            <StatusBadge status={status?.status || 'closed'} />
                                                                            {/* Only show edit actions if needed, keeping archive read-mostly */}
                                                                            <button
                                                                                onClick={() => toggleSemester(semNum, status?.status === 'open' ? 'close' : 'open', year.id)}
                                                                                className="text-gray-400 hover:text-slate-600"
                                                                            >
                                                                                <EllipsisHorizontalIcon className="w-5 h-5" />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </li>
                                    );
                                }) : (
                                    <li className="px-4 py-8 text-center text-sm text-gray-500">
                                        No archived records found.
                                    </li>
                                )}
                            </ul>
                        </div>
                    </section>
                </div>

                {/* Create Modal */}
                {showCreateModal && (
                    <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <CalendarIcon className="h-6 w-6 text-slate-600" aria-hidden="true" />
                                        </div>
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                            <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Create Academic Year</h3>
                                            <div className="mt-4">
                                                <form onSubmit={handleCreate} className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium leading-6 text-gray-900">Year Name</label>
                                                        <div className="mt-1">
                                                            <input
                                                                type="text"
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
                                                                placeholder="e.g. 2026-2027"
                                                                value={data.name}
                                                                onChange={e => setData('name', e.target.value)}
                                                                required
                                                            />
                                                            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium leading-6 text-gray-900">Start Date</label>
                                                            <input
                                                                type="date"
                                                                className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
                                                                value={data.start_date}
                                                                onChange={e => setData('start_date', e.target.value)}
                                                                required
                                                            />
                                                            {errors.start_date && <p className="mt-1 text-xs text-red-600">{errors.start_date}</p>}
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium leading-6 text-gray-900">End Date</label>
                                                            <input
                                                                type="date"
                                                                className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
                                                                value={data.end_date}
                                                                onChange={e => setData('end_date', e.target.value)}
                                                                required
                                                            />
                                                            {errors.end_date && <p className="mt-1 text-xs text-red-600">{errors.end_date}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="relative flex gap-x-3">
                                                        <div className="flex h-6 items-center">
                                                            <input
                                                                id="set_current"
                                                                name="set_current"
                                                                type="checkbox"
                                                                className="h-4 w-4 rounded border-gray-300 text-slate-600 focus:ring-slate-600"
                                                                checked={data.set_as_current}
                                                                onChange={e => setData('set_as_current', e.target.checked)}
                                                            />
                                                        </div>
                                                        <div className="text-sm leading-6">
                                                            <label htmlFor="set_current" className="font-medium text-gray-900">Set as Current Year</label>
                                                            <p className="text-gray-500">Automatically deactivate other years.</p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                                        <button
                                                            type="submit"
                                                            disabled={processing}
                                                            className="inline-flex w-full justify-center rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 sm:ml-3 sm:w-auto"
                                                        >
                                                            {processing ? 'Creating...' : 'Create'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                            onClick={() => setShowCreateModal(false)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Success Toast Notification */}
                {showToast && (
                    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                        <div className="flex items-center gap-3 bg-emerald-600 text-white px-6 py-4 rounded-lg shadow-2xl shadow-emerald-900/50 ring-2 ring-emerald-400 min-w-[320px]">
                            <CheckCircleIcon className="h-6 w-6 flex-shrink-0" />
                            <p className="text-sm font-semibold flex-1">{toastMessage}</p>
                            <button
                                onClick={() => setShowToast(false)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </DirectorLayout>
    );
}
