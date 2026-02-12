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
        } else if (type === 'section_cards') {
            url = route('director.reports.export.section-cards');
            if (!selectedSection) {
                alert('Please select a section first.');
                return;
            }
            params.append('section_id', selectedSection);
            params.append('academic_year_id', selectedAcademicYear);
        }

        params.append('format', format);
        window.location.href = `${url}?${params.toString()}`;
    };

    return (
        <div className="animate-fade-in-up">

            {/* Global Filters Control Panel */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-10">
                <div className="flex items-center mb-6 text-gray-800">
                    <FunnelIcon className="w-5 h-5 mr-2 text-indigo-600" />
                    <h3 className="text-lg font-bold">Data Configuration</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="relative">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Academic Year</label>
                        <select
                            className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg bg-gray-50 transition-all cursor-pointer"
                            value={selectedAcademicYear}
                            onChange={(e) => setSelectedAcademicYear(e.target.value)}
                        >
                            {academic_years.map(year => (
                                <option key={year.id} value={year.id}>{year.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="relative">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Grade Level</label>
                        <select
                            className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg bg-gray-50 transition-all cursor-pointer"
                            value={selectedGrade}
                            onChange={(e) => { setSelectedGrade(e.target.value); setSelectedSection(''); }}
                        >
                            {grades.map(grade => (
                                <option key={grade.id} value={grade.id}>{grade.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="relative">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Section</label>
                        <select
                            className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg bg-gray-50 transition-all cursor-pointer"
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
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Semester</label>
                        <select
                            className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg bg-gray-50 transition-all cursor-pointer"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Student Directory Card */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full">
                    <div className="p-1 h-1.5 bg-blue-500"></div>
                    <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 rounded text-gray-400">ADMIN</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Student Directory</h3>
                        <p className="text-gray-500 text-xs mb-6 leading-relaxed flex-grow">
                            Export student lists, guardian info, and enrollment rosters for the selected grade/section.
                        </p>
                        <div className="space-y-2 mt-auto">
                            <button
                                onClick={() => handleExport('students', 'pdf')}
                                className="w-full flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                            >
                                <ArrowDownTrayIcon className="w-4 h-4 mr-2" /> Download PDF
                            </button>
                            <button
                                onClick={() => handleExport('students', 'csv')}
                                className="w-full flex items-center justify-center px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                            >
                                Export CSV
                            </button>
                        </div>
                    </div>
                </div>

                {/* Official Report Cards Card */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full">
                    <div className="p-1 h-1.5 bg-slate-800" style={{ backgroundColor: '#1E293B' }}></div>
                    <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-slate-100 transition-colors">
                                <DocumentTextIcon className="w-6 h-6 text-slate-700" />
                            </div>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-900/5 rounded text-slate-600 uppercase">Official</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Student Report Cards</h3>
                        <p className="text-gray-500 text-xs mb-6 leading-relaxed flex-grow">
                            Download all student report cards for a specific section as one printable multi-page PDF.
                        </p>
                        <div className="space-y-2 mt-auto">
                            <button
                                onClick={() => handleExport('section_cards', 'pdf')}
                                className="w-full flex items-center justify-center px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                                style={{ backgroundColor: '#1E293B' }}
                            >
                                <ArrowDownTrayIcon className="w-4 h-4 mr-2" /> Download Section Cards
                            </button>
                            <p className="text-[10px] text-center text-gray-400 mt-2 italic">
                                Requires selection of a specific section above
                            </p>
                        </div>
                    </div>
                </div>

                {/* Academic Ranking Card */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full">
                    <div className="p-1 h-1.5 bg-purple-500"></div>
                    <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                                <ArrowTrendingUpIcon className="w-6 h-6 text-purple-600" />
                            </div>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 rounded text-gray-400">ACADEMIC</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Academic Ranking</h3>
                        <p className="text-gray-500 text-xs mb-6 leading-relaxed flex-grow">
                            Generate merit lists and student rankings based on semester and yearly averages.
                        </p>
                        <div className="space-y-2 mt-auto">
                            <button
                                onClick={() => handleExport('ranks', 'pdf')}
                                className="w-full flex items-center justify-center px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                            >
                                <ArrowDownTrayIcon className="w-4 h-4 mr-2" /> Merit List PDF
                            </button>
                            <button
                                onClick={() => handleExport('ranks', 'csv')}
                                className="w-full flex items-center justify-center px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                            >
                                Export CSV
                            </button>
                        </div>
                    </div>
                </div>

                {/* Financial Status Card */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full">
                    <div className="p-1 h-1.5 bg-emerald-500"></div>
                    <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                                <CurrencyDollarIcon className="w-6 h-6 text-emerald-600" />
                            </div>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 rounded text-gray-400">FINANCE</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Financial Status</h3>
                        <div className="mb-4">
                            <select
                                className="block w-full py-1.5 text-xs border-gray-200 focus:ring-emerald-500 rounded-md bg-white pr-8 transition-all cursor-pointer"
                                value={paymentStatus}
                                onChange={(e) => setPaymentStatus(e.target.value)}
                            >
                                <option value="">All Transactions</option>
                                <option value="paid">Paid</option>
                                <option value="partial">Partial</option>
                                <option value="unpaid">Unpaid</option>
                            </select>
                        </div>
                        <div className="space-y-2 mt-auto">
                            <button
                                onClick={() => handleExport('payments', 'pdf')}
                                className="w-full flex items-center justify-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                            >
                                <ArrowDownTrayIcon className="w-4 h-4 mr-2" /> Payments PDF
                            </button>
                            <button
                                onClick={() => handleExport('payments', 'csv')}
                                className="w-full flex items-center justify-center px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                            >
                                Export CSV
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
