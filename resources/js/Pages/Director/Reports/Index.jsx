import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ArrowDownTrayIcon, DocumentTextIcon, ArrowTrendingUpIcon, CurrencyDollarIcon, FunnelIcon } from '@heroicons/react/24/outline';

export default function ReportsIndex({ auth, grades, academic_years }) {
    const [selectedGrade, setSelectedGrade] = useState(grades[0]?.id || '');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedSemester, setSelectedSemester] = useState(1);
    const [selectedAcademicYear, setSelectedAcademicYear] = useState(academic_years[0]?.id || '');
    const [paymentStatus, setPaymentStatus] = useState('');

    const sections = grades.find(g => g.id == selectedGrade)?.sections || [];

    const handleExport = (type, format) => {
        let url = '';
        const params = new URLSearchParams();

        if (type === 'students') {
            url = route('director.reports.export.students');
            params.append('grade_id', selectedGrade);
            if (selectedSection) params.append('section_id', selectedSection);
        } else if (type === 'ranks') {
            url = route('director.reports.export.ranks');
            params.append('grade_id', selectedGrade);
            if (selectedSection) params.append('section_id', selectedSection);
            params.append('semester', selectedSemester);
            params.append('academic_year_id', selectedAcademicYear);
        } else if (type === 'payments') {
            url = route('director.reports.export.payments');
            params.append('grade_id', selectedGrade || 'all');
            if (paymentStatus) params.append('status', paymentStatus);
        }

        params.append('format', format);
        window.location.href = `${url}?${params.toString()}`;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Reports Center</h2>}
        >
            <Head title="Reports Dashboard" />

            <div className="py-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Hero Section */}
                    <div className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-2xl shadow-xl p-8 mb-8 text-white">
                        <h1 className="text-3xl font-bold mb-2">Director's Analytics & Reporting</h1>
                        <p className="text-blue-100 max-w-2xl">
                            Generate comprehensive insights, track academic performance, and monitor financial health with professional-grade exports.
                        </p>
                    </div>

                    {/* Global Filters Control Panel */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-10">
                        <div className="flex items-center mb-6 text-gray-800">
                            <FunnelIcon className="w-5 h-5 mr-2 text-indigo-600" />
                            <h3 className="text-lg font-bold">Global Data Configuration</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="relative">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Academic Year</label>
                                <select
                                    className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg bg-gray-50"
                                    value={selectedAcademicYear}
                                    onChange={(e) => setSelectedAcademicYear(e.target.value)}
                                >
                                    {academic_years.map(year => (
                                        <option key={year.id} value={year.id}>{year.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="relative">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Target Grade</label>
                                <select
                                    className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg bg-gray-50"
                                    value={selectedGrade}
                                    onChange={(e) => { setSelectedGrade(e.target.value); setSelectedSection(''); }}
                                >
                                    {grades.map(grade => (
                                        <option key={grade.id} value={grade.id}>{grade.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="relative">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Section Filter</label>
                                <select
                                    className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg bg-gray-50"
                                    value={selectedSection}
                                    onChange={(e) => setSelectedSection(e.target.value)}
                                >
                                    <option value="">All Sections</option>
                                    {sections.map(section => (
                                        <option key={section.id} value={section.id}>{section.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="relative">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Semester Period</label>
                                <select
                                    className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg bg-gray-50"
                                    value={selectedSemester}
                                    onChange={(e) => setSelectedSemester(e.target.value)}
                                >
                                    <option value="1">Semester 1</option>
                                    <option value="2">Semester 2</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Report Cards Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Student List Card */}
                        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                            <div className="p-1 h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                                        <DocumentTextIcon className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded text-gray-500">ADMIN</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Student Directory</h3>
                                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                                    Export detailed student rosters including innovative IDs, guardian contacts, and enrollment status for the selected scope.
                                </p>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => handleExport('students', 'pdf')}
                                        className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                                    >
                                        <ArrowDownTrayIcon className="w-5 h-5 mr-2" /> Download Directory PDF
                                    </button>
                                    <button
                                        onClick={() => handleExport('students', 'csv')}
                                        className="w-full flex items-center justify-center px-4 py-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                                    >
                                        Export as CSV
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Rank List Card */}
                        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                            <div className="p-1 h-2 bg-gradient-to-r from-purple-400 to-purple-600"></div>
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                                        <ArrowTrendingUpIcon className="w-8 h-8 text-purple-600" />
                                    </div>
                                    <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded text-gray-500">ACADEMIC</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Academic Ranking</h3>
                                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                                    Generate merit lists based on semester averages. Ideal for identifying top performers and tracking academic progression.
                                </p>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => handleExport('ranks', 'pdf')}
                                        className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                                    >
                                        <ArrowDownTrayIcon className="w-5 h-5 mr-2" /> Download Merit List PDF
                                    </button>
                                    <button
                                        onClick={() => handleExport('ranks', 'csv')}
                                        className="w-full flex items-center justify-center px-4 py-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                                    >
                                        Export as CSV
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Payment Status Card */}
                        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                            <div className="p-1 h-2 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                                        <CurrencyDollarIcon className="w-8 h-8 text-emerald-600" />
                                    </div>
                                    <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded text-gray-500">FINANCE</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Financial Status</h3>
                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Filter by Status</label>
                                    <div className="relative">
                                        <select
                                            className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 rounded-md bg-white"
                                            value={paymentStatus}
                                            onChange={(e) => setPaymentStatus(e.target.value)}
                                        >
                                            <option value="">All Transactions</option>
                                            <option value="paid">Paid</option>
                                            <option value="partial">Partial Payment</option>
                                            <option value="unpaid">Unpaid / Pending</option>
                                            <option value="overdue">Overdue</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => handleExport('payments', 'pdf')}
                                        className="w-full flex items-center justify-center px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                                    >
                                        <ArrowDownTrayIcon className="w-5 h-5 mr-2" /> Download Report PDF
                                    </button>
                                    <button
                                        onClick={() => handleExport('payments', 'csv')}
                                        className="w-full flex items-center justify-center px-4 py-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                                    >
                                        Export as CSV
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
