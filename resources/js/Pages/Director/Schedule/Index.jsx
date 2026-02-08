import React from 'react';
import DirectorLayout from '@/Layouts/DirectorLayout';
import { Head, Link } from '@inertiajs/react';
import SchoolSchedule from '@/Components/Director/SchoolSchedule';
import { ArrowDownTrayIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

export default function ScheduleIndex() {
    const handleExport = (format) => {
        window.location.href = route(`director.schedule.export-${format}`);
    };

    return (
        <DirectorLayout>
            <Head title="School Schedule" />

            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-navy-900" style={{ color: '#0F172A' }}>
                            📅 School Program Schedule
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            5-Day Week Schedule - Monday to Friday
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => handleExport('pdf')}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                            <DocumentArrowDownIcon className="h-5 w-5" />
                            <span>Export PDF</span>
                        </button>
                        <button
                            onClick={() => handleExport('csv')}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                            <ArrowDownTrayIcon className="h-5 w-5" />
                            <span>Export CSV</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Schedule Component */}
            <SchoolSchedule />

            {/* Quick Links */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                    href={route('director.dashboard')}
                    className="executive-card hover:shadow-lg transition-shadow cursor-pointer"
                >
                    <div className="text-3xl mb-2">📊</div>
                    <h3 className="font-bold text-gray-900 mb-1">Back to Dashboard</h3>
                    <p className="text-sm text-gray-600">View overall school metrics</p>
                </Link>

                <Link
                    href={route('director.students.index')}
                    className="executive-card hover:shadow-lg transition-shadow cursor-pointer"
                >
                    <div className="text-3xl mb-2">👥</div>
                    <h3 className="font-bold text-gray-900 mb-1">Student Directory</h3>
                    <p className="text-sm text-gray-600">Manage student information</p>
                </Link>

                <Link
                    href={route('director.teachers.index')}
                    className="executive-card hover:shadow-lg transition-shadow cursor-pointer"
                >
                    <div className="text-3xl mb-2">👨‍🏫</div>
                    <h3 className="font-bold text-gray-900 mb-1">Teacher Management</h3>
                    <p className="text-sm text-gray-600">Manage teacher assignments</p>
                </Link>
            </div>
        </DirectorLayout>
    );
}
