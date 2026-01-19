import React from 'react';
import RegistrarLayout from '@/Layouts/RegistrarLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ recentReports }) {

    const { data, setData, post, processing } = useForm({
        type: 'enrollment',
        format: 'pdf',
        date_range: 'current_year',
    });

    const handleGenerate = (e) => {
        e.preventDefault();
        post(route('registrar.reports.generate'));
    };

    return (
        <RegistrarLayout user={null}>
            <Head title="Search & Reporting Center" />

            <div className="space-y-6">

                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-[#1F2937] flex items-center">
                        <span className="mr-2">📊</span> SEARCH & REPORTING CENTER
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Report Generator */}
                    <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
                        <div className="bg-[#1E40AF] px-6 py-4 border-b border-blue-800">
                            <h3 className="font-bold text-white">GENERATE NEW REPORT</h3>
                        </div>
                        <form onSubmit={handleGenerate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Report Type</label>
                                <select
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value)}
                                    className="w-full border-gray-300 rounded shadow-sm focus:border-[#228B22] focus:ring-[#228B22] text-sm"
                                >
                                    <option value="enrollment">Student Enrollment Summary</option>
                                    <option value="finance">Fee Collection Report</option>
                                    <option value="capacity">Class Capacity Analysis</option>
                                    <option value="guardians">Guardian Directory Export</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Date Range</label>
                                <select
                                    value={data.date_range}
                                    onChange={e => setData('date_range', e.target.value)}
                                    className="w-full border-gray-300 rounded shadow-sm focus:border-[#228B22] focus:ring-[#228B22] text-sm"
                                >
                                    <option value="today">Today Only</option>
                                    <option value="this_month">This Month</option>
                                    <option value="current_year">Current Academic Year</option>
                                    <option value="all_time">All Time</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Format</label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="format"
                                            value="pdf"
                                            checked={data.format === 'pdf'}
                                            onChange={e => setData('format', e.target.value)}
                                            className="text-[#1E40AF] focus:ring-[#1E40AF]"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">PDF Document</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="format"
                                            value="csv"
                                            checked={data.format === 'csv'}
                                            onChange={e => setData('format', e.target.value)}
                                            className="text-[#1E40AF] focus:ring-[#1E40AF]"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Excel / CSV</span>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#228B22] hover:bg-green-700 text-white font-bold py-3 px-4 rounded shadow-md transition-colors flex justify-center items-center"
                            >
                                {processing ? 'Generating...' : 'Download Report'}
                            </button>
                        </form>
                    </div>

                    {/* Report Archive / Recent */}
                    <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h3 className="font-bold text-gray-700">RECENTLY GENERATED</h3>
                        </div>
                        <ul className="divide-y divide-gray-200">
                            {recentReports.map(report => (
                                <li key={report.id} className="p-4 hover:bg-gray-50 flex justify-between items-center group">
                                    <div className="flex items-center">
                                        <div className={`h-8 w-8 rounded flex items-center justify-center mr-3 font-bold text-xs ${report.type === 'PDF' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {report.type}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800 text-sm group-hover:text-[#1E40AF]">{report.name}</p>
                                            <p className="text-xs text-gray-500">{report.date}</p>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        ⬇️
                                    </button>
                                </li>
                            ))}
                            {recentReports.length === 0 && (
                                <li className="p-8 text-center text-gray-500 italic text-sm">No recent reports found.</li>
                            )}
                        </ul>
                        <div className="bg-gray-50 p-3 text-center border-t border-gray-200">
                            <button className="text-xs text-[#1E40AF] font-bold hover:underline">View All Archive</button>
                        </div>
                    </div>

                    {/* Advanced Search Info */}
                    <div className="md:col-span-2 bg-[#D4AF37] bg-opacity-10 rounded-lg p-4 border border-[#D4AF37] flex items-start">
                        <div className="text-2xl mr-4">💡</div>
                        <div>
                            <h4 className="font-bold text-[#b59218]">Where is Advanced Search?</h4>
                            <p className="text-sm text-gray-700 mt-1">
                                Contextual search is embedded within each module (e.g. searching students in the Registration Portal, searching guardians in the Guardian Hub). Global search is coming in the next update.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </RegistrarLayout>
    );
}
