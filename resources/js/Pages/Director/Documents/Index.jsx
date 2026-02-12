import React, { useState, useEffect, useCallback } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import DirectorLayout from '@/Layouts/DirectorLayout';
import { PencilSquareIcon, TrashIcon, PlusIcon, DocumentDuplicateIcon, ChartBarIcon, DocumentTextIcon, CheckBadgeIcon, MagnifyingGlassIcon, UserIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import ReportsDashboard from '@/Components/Director/ReportsDashboard';

// Simple debounce implementation
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

export default function Index({ auth, templates, grades, academic_years, students, filters }) {
    const { flash } = usePage().props;

    // Parse URL param for initial tab state
    const getInitialTab = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('tab') === 'reports' ? 'reports' : 'transcripts';
    };

    const [activeTab, setActiveTab] = useState(getInitialTab());
    const [search, setSearch] = useState(filters.search || '');
    const [selectedGrade, setSelectedGrade] = useState(filters.grade_id || '');

    // Update URL without reloading when tab changes
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        const url = new URL(window.location);
        url.searchParams.set('tab', tab);
        window.history.pushState({}, '', url);
    };

    // Handle search with debounce
    const handleSearch = useCallback(
        debounce((value, grade) => {
            router.get(route('director.documents.index'),
                { search: value, grade_id: grade, tab: 'transcripts' },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 300),
        []
    );

    useEffect(() => {
        if (activeTab === 'transcripts') {
            handleSearch(search, selectedGrade);
        }
    }, [search, selectedGrade]);

    const handleDownloadTranscript = (studentId) => {
        window.location.href = route('director.reports.export.transcript', { student_id: studentId });
    };

    return (
        <DirectorLayout>
            <Head title="Director Workspace" />

            <div className="min-h-screen bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                    {/* Compact Page Header */}
                    <div className="mb-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900" style={{ color: '#0F172A' }}>
                                    📂 Director Workspace
                                </h1>
                                <p className="text-gray-500 mt-1 text-xs">Manage student transcripts and generate administrative reports.</p>
                            </div>

                            {activeTab === 'transcripts' && (
                                <Link
                                    href={route('director.documents.create')}
                                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all shadow-lg hover:shadow-xl"
                                >
                                    <PlusIcon className="w-5 h-5 mr-2" />
                                    Manage Layouts
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Segmented Control Tabs */}
                    <div className="mb-8">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                <button
                                    onClick={() => handleTabChange('transcripts')}
                                    className={`${activeTab === 'transcripts'
                                        ? 'border-black text-black'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm flex items-center transition-all duration-200`}
                                >
                                    <DocumentTextIcon className={`w-5 h-5 mr-2 ${activeTab === 'transcripts' ? 'text-black' : 'text-gray-400'}`} />
                                    Official Transcripts
                                </button>

                                <button
                                    onClick={() => handleTabChange('reports')}
                                    className={`${activeTab === 'reports'
                                        ? 'border-black text-black'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm flex items-center transition-all duration-200`}
                                >
                                    <ChartBarIcon className={`w-5 h-5 mr-2 ${activeTab === 'reports' ? 'text-black' : 'text-gray-400'}`} />
                                    Analytics & Reports
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Flash Message */}
                    {flash.success && (
                        <div className="mb-8 bg-green-50 border border-green-100 text-green-800 px-4 py-4 rounded-xl flex items-center shadow-sm" role="alert">
                            <CheckBadgeIcon className="w-6 h-6 mr-3 text-green-600" />
                            <span className="font-medium">{flash.success}</span>
                        </div>
                    )}

                    {/* Tab Content */}
                    <div className="min-h-[400px]">
                        {activeTab === 'transcripts' ? (
                            <div className="animate-fade-in-up">
                                {/* Search & Filters */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-col md:flex-row gap-4 items-end">
                                    <div className="flex-grow">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Search Student</label>
                                        <div className="relative">
                                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Name or Student ID..."
                                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full md:w-64">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Grade Level</label>
                                        <select
                                            className="w-full px-4 py-2.5 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                            value={selectedGrade}
                                            onChange={(e) => setSelectedGrade(e.target.value)}
                                        >
                                            <option value="">All Grades</option>
                                            {grades.map(grade => (
                                                <option key={grade.id} value={grade.id}>{grade.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Student List */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-100">
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Student</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">ID</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Grade</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {students.data.length > 0 ? (
                                                students.data.map((student) => (
                                                    <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center">
                                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                                                    <UserIcon className="w-6 h-6 text-gray-400" />
                                                                </div>
                                                                <div className="font-bold text-gray-900">{student.user.name}</div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500">{student.student_id}</td>
                                                        <td className="px-6 py-4">
                                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">
                                                                {student.grade?.name}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button
                                                                onClick={() => handleDownloadTranscript(student.id)}
                                                                className="inline-flex items-center px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
                                                            >
                                                                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                                                                Download Transcript
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-20 text-center">
                                                        <div className="text-gray-400 italic">No students found matching your search.</div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="mt-8">
                                    {students.links && students.links.length > 3 && (
                                        <div className="flex justify-center">
                                            {students.links.map((link, i) => (
                                                <Link
                                                    key={i}
                                                    href={link.url}
                                                    className={`px-4 py-2 mx-1 rounded-xl text-sm font-bold transition-all ${link.active
                                                        ? 'bg-black text-white shadow-lg'
                                                        : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-100'
                                                        } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="animate-fade-in-up">
                                <ReportsDashboard grades={grades} academic_years={academic_years} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DirectorLayout>
    );
}

