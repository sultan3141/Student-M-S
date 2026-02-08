import React, { useState } from 'react';
import { ArrowDownTrayIcon, DocumentTextIcon, ArrowTrendingUpIcon, CurrencyDollarIcon, FunnelIcon } from '@heroicons/react/24/outline';

export default function ReportsDashboard({ grades, academic_years }) {
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
        <div className="animate-fade-in-up">

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex items-center mb-6">
                    <FunnelIcon className="w-5 h-5 mr-3 text-gray-400" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Report Configuration</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2">Academic Year</label>
                        <select
                            className="block w-full py-2 px-3 border border-gray-200 bg-gray-50 rounded-lg text-sm focus:ring-gray-900 focus:border-gray-900 focus:outline-none transition-colors"
                            value={selectedAcademicYear}
                            onChange={(e) => setSelectedAcademicYear(e.target.value)}
                        >
                            {academic_years.map(year => (
                                <option key={year.id} value={year.id}>{year.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2">Grade Level</label>
                        <select
                            className="block w-full py-2 px-3 border border-gray-200 bg-gray-50 rounded-lg text-sm focus:ring-gray-900 focus:border-gray-900 focus:outline-none transition-colors"
                            value={selectedGrade}
                            onChange={(e) => { setSelectedGrade(e.target.value); setSelectedSection(''); }}
                        >
                            {grades.map(grade => (
                                <option key={grade.id} value={grade.id}>{grade.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2">Section</label>
                        <select
                            className="block w-full py-2 px-3 border border-gray-200 bg-gray-50 rounded-lg text-sm focus:ring-gray-900 focus:border-gray-900 focus:outline-none transition-colors"
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}
                        >
                            <option value="">All Sections</option>
                            {sections.map(section => (
                                <option key={section.id} value={section.id}>{section.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2">Semester</label>
                        <select
                            className="block w-full py-2 px-3 border border-gray-200 bg-gray-50 rounded-lg text-sm focus:ring-gray-900 focus:border-gray-900 focus:outline-none transition-colors"
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                        >
                            <option value="1">Semester 1</option>
                            <option value="2">Semester 2</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Student List */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <DocumentTextIcon className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-gray-900">Student List</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-6 flex-grow">
                        Export detailed student rosters with contact info.
                    </p>
                    <div className="grid grid-cols-2 gap-3 mt-auto">
                        <button onClick={() => handleExport('students', 'pdf')} className="flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors">
                            <ArrowDownTrayIcon className="w-3 h-3 mr-2" /> PDF
                        </button>
                        <button onClick={() => handleExport('students', 'csv')} className="flex items-center justify-center px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">
                            <ArrowDownTrayIcon className="w-3 h-3 mr-2" /> CSV
                        </button>
                    </div>
                </div>

                {/* Rank List */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <ArrowTrendingUpIcon className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-gray-900">Rank List</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-6 flex-grow">
                        Academic rankings based on semester marks.
                    </p>
                    <div className="grid grid-cols-2 gap-3 mt-auto">
                        <button onClick={() => handleExport('ranks', 'pdf')} className="flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors">
                            <ArrowDownTrayIcon className="w-3 h-3 mr-2" /> PDF
                        </button>
                        <button onClick={() => handleExport('ranks', 'csv')} className="flex items-center justify-center px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">
                            <ArrowDownTrayIcon className="w-3 h-3 mr-2" /> CSV
                        </button>
                    </div>
                </div>

                {/* Payment List */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <CurrencyDollarIcon className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-gray-900">Payments</h3>
                    </div>
                    <div className="mb-4 flex-grow">
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Status Filter</label>
                        <select
                            className="block w-full py-1.5 px-3 border border-gray-200 bg-white rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                            value={paymentStatus}
                            onChange={(e) => setPaymentStatus(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="paid">Paid</option>
                            <option value="partial">Partial</option>
                            <option value="unpaid">Unpaid</option>
                            <option value="overdue">Overdue</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-auto">
                        <button onClick={() => handleExport('payments', 'pdf')} className="flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors">
                            <ArrowDownTrayIcon className="w-3 h-3 mr-2" /> PDF
                        </button>
                        <button onClick={() => handleExport('payments', 'csv')} className="flex items-center justify-center px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">
                            <ArrowDownTrayIcon className="w-3 h-3 mr-2" /> CSV
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
