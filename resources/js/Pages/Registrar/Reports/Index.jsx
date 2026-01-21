import React, { useState } from 'react';
import RegistrarLayout from '@/Layouts/RegistrarLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { 
    ChartBarIcon, 
    DocumentArrowDownIcon, 
    AcademicCapIcon,
    BanknotesIcon,
    UserGroupIcon,
    ClipboardDocumentListIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function Index({ stats, recentReports, grades, academicYears }) {
    const [selectedReport, setSelectedReport] = useState('enrollment');
    const [selectedFormat, setSelectedFormat] = useState('csv');
    const { flash } = usePage().props;

    const { data, setData, post, processing } = useForm({
        type: 'enrollment',
        format: 'csv',
        grade_id: '',
        academic_year_id: '',
        date_from: '',
        date_to: '',
    });

    const reportTypes = [
        {
            id: 'enrollment',
            name: 'Student Enrollment Report',
            description: 'Complete list of all registered students with their details',
            icon: AcademicCapIcon,
            color: 'blue',
            fields: ['grade_id']
        },
        {
            id: 'finance',
            name: 'Financial Report',
            description: 'Payment records and fee collection summary',
            icon: BanknotesIcon,
            color: 'green',
            fields: ['date_from', 'date_to']
        },
        {
            id: 'grades',
            name: 'Grade Distribution Report',
            description: 'Student distribution across grades with statistics',
            icon: ChartBarIcon,
            color: 'purple',
            fields: []
        },
        {
            id: 'parents',
            name: 'Parent Contact Report',
            description: 'Guardian information and contact details',
            icon: UserGroupIcon,
            color: 'orange',
            fields: []
        },
        {
            id: 'academic',
            name: 'Academic Performance Report',
            description: 'Student marks and academic performance data',
            icon: ClipboardDocumentListIcon,
            color: 'indigo',
            fields: ['grade_id', 'academic_year_id']
        },
        {
            id: 'attendance',
            name: 'Attendance Report',
            description: 'Student attendance records and statistics',
            icon: CheckCircleIcon,
            color: 'teal',
            fields: ['grade_id', 'date_from', 'date_to']
        }
    ];

    const formatOptions = [
        { id: 'csv', name: 'CSV (Excel Compatible)', description: 'Comma-separated values for spreadsheet applications' },
        { id: 'pdf', name: 'PDF Document', description: 'Formatted document for printing and sharing' },
        { id: 'excel', name: 'Excel Workbook', description: 'Native Excel format with formatting' }
    ];

    const handleReportTypeChange = (reportId) => {
        setSelectedReport(reportId);
        setData('type', reportId);
    };

    const handleFormatChange = (format) => {
        setSelectedFormat(format);
        setData('format', format);
    };

    const handleGenerateReport = (e) => {
        e.preventDefault();
        post(route('registrar.reports.generate'));
    };

    const selectedReportType = reportTypes.find(r => r.id === selectedReport);

    return (
        <RegistrarLayout user={null}>
            <Head title="Reports Center" />

            <div className="space-y-6">

                {/* Success/Error Messages */}
                {flash?.success && (
                    <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-4">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-green-800 font-medium">{flash.success}</p>
                        </div>
                    </div>
                )}

                {flash?.error && (
                    <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-4">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-800 font-medium">{flash.error}</p>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
                    <div className="bg-[#228B22] px-6 py-4 border-b border-[#D4AF37]">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <ChartBarIcon className="w-6 h-6 mr-2" />
                            REPORTS CENTER
                        </h2>
                        <p className="text-green-100 text-sm mt-1">Generate comprehensive reports for school management</p>
                    </div>
                </div>

                {/* Statistics Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100">
                                <AcademicCapIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Students</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total_students}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100">
                                <UserGroupIcon className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Parents</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total_parents}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100">
                                <ChartBarIcon className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Grades</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total_grades}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-orange-100">
                                <BanknotesIcon className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Payments</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total_payments}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Report Generator */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Report Type Selection */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Select Report Type</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {reportTypes.map((report) => (
                                    <div
                                        key={report.id}
                                        onClick={() => handleReportTypeChange(report.id)}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                            selectedReport === report.id
                                                ? `border-${report.color}-500 bg-${report.color}-50`
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <report.icon className={`w-6 h-6 ${selectedReport === report.id ? `text-${report.color}-600` : 'text-gray-400'}`} />
                                            <div className="flex-1">
                                                <h4 className={`font-medium ${selectedReport === report.id ? `text-${report.color}-900` : 'text-gray-900'}`}>
                                                    {report.name}
                                                </h4>
                                                <p className={`text-sm mt-1 ${selectedReport === report.id ? `text-${report.color}-700` : 'text-gray-500'}`}>
                                                    {report.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Report Configuration */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">⚙️ Report Configuration</h3>
                            
                            <form onSubmit={handleGenerateReport} className="space-y-4">
                                
                                {/* Format Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Output Format</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {formatOptions.map((format) => (
                                            <div
                                                key={format.id}
                                                onClick={() => handleFormatChange(format.id)}
                                                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                                    selectedFormat === format.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <h5 className={`font-medium ${selectedFormat === format.id ? 'text-blue-900' : 'text-gray-900'}`}>
                                                    {format.name}
                                                </h5>
                                                <p className={`text-xs mt-1 ${selectedFormat === format.id ? 'text-blue-700' : 'text-gray-500'}`}>
                                                    {format.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Dynamic Filters */}
                                {selectedReportType && selectedReportType.fields.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        
                                        {selectedReportType.fields.includes('grade_id') && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Grade</label>
                                                <select
                                                    value={data.grade_id}
                                                    onChange={e => setData('grade_id', e.target.value)}
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                >
                                                    <option value="">All Grades</option>
                                                    {grades.map(grade => (
                                                        <option key={grade.id} value={grade.id}>{grade.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        {selectedReportType.fields.includes('academic_year_id') && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                                                <select
                                                    value={data.academic_year_id}
                                                    onChange={e => setData('academic_year_id', e.target.value)}
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                >
                                                    <option value="">Current Year</option>
                                                    {academicYears.map(year => (
                                                        <option key={year.id} value={year.id}>{year.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        {selectedReportType.fields.includes('date_from') && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                                                <input
                                                    type="date"
                                                    value={data.date_from}
                                                    onChange={e => setData('date_from', e.target.value)}
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                        )}

                                        {selectedReportType.fields.includes('date_to') && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                                                <input
                                                    type="date"
                                                    value={data.date_to}
                                                    onChange={e => setData('date_to', e.target.value)}
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Generate Button */}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full flex items-center justify-center px-6 py-3 bg-[#228B22] hover:bg-green-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                                        {processing ? 'Generating Report...' : `Generate ${selectedReportType?.name || 'Report'}`}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Recent Reports & Quick Stats */}
                    <div className="space-y-6">
                        
                        {/* Quick Stats */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">📈 Quick Stats</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Students with Parents</span>
                                    <span className="font-bold text-green-600">{stats.students_with_parents}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Students without Parents</span>
                                    <span className="font-bold text-red-600">{stats.students_without_parents}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Completed Payments</span>
                                    <span className="font-bold text-blue-600">{stats.completed_payments}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Pending Payments</span>
                                    <span className="font-bold text-orange-600">{stats.pending_payments}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Total Marks</span>
                                    <span className="font-bold text-purple-600">{stats.total_marks}</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Reports */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Recent Reports</h3>
                            <div className="space-y-3">
                                {recentReports.map((report) => (
                                    <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 text-sm">{report.name}</h4>
                                            <p className="text-xs text-gray-500">{report.date} • {report.size}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-bold rounded ${
                                            report.type === 'PDF' ? 'bg-red-100 text-red-800' :
                                            report.type === 'Excel' ? 'bg-green-100 text-green-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                            {report.type}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Academic Year Info */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">📅 Academic Info</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Current Academic Year</span>
                                    <span className="font-bold text-blue-600">{stats.current_academic_year}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Report Generated</span>
                                    <span className="font-bold text-gray-900">{new Date().toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </RegistrarLayout>
    );
}