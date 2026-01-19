import { Head } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import PerformanceChart from '@/Components/Dashboard/PerformanceChart';
import { ChartBarIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function Index({ distribution, subjectPerformance, classPassRate }) {

    // Transform distribution object to array for chart if needed, 
    // but PerformanceChart expects raw marks usually. 
    // Adapting PerformanceChart to accept aggregated data or creating new ones.

    // For this demo, I'll create simple visual bars for the aggregated data directly here
    // rather than complex Chart.js implementation to ensure it works without npm install steps if they failed.

    return (
        <TeacherLayout>
            <Head title="Reports" />

            <div className="sm:flex sm:items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Academic Reports</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Performance analytics and grade distribution across your classes.
                    </p>
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                    Export PDF
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Grade Distribution Card */}
                <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Overall Grade Distribution</h3>
                        <ChartBarIcon className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="flex items-end space-x-4 h-64 mt-4">
                        {[
                            { label: 'F (<60)', count: distribution.grade_F, color: 'bg-red-400' },
                            { label: 'D (60-69)', count: distribution.grade_D, color: 'bg-orange-400' },
                            { label: 'C (70-79)', count: distribution.grade_C, color: 'bg-yellow-400' },
                            { label: 'B (80-89)', count: distribution.grade_B, color: 'bg-blue-400' },
                            { label: 'A (90+)', count: distribution.grade_A, color: 'bg-green-400' },
                        ].map((item, idx) => {
                            const max = Math.max(distribution.grade_A, distribution.grade_B, distribution.grade_C, distribution.grade_D, distribution.grade_F, 1);
                            const height = `${(item.count / max) * 100}%`;

                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center group">
                                    <div className="relative w-full flex flex-col justify-end h-full">
                                        <div
                                            className={`w-full rounded-t-md ${item.color} opacity-80 group-hover:opacity-100 transition-all`}
                                            style={{ height: height }}
                                        ></div>
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-bold text-gray-700">
                                            {item.count}
                                        </span>
                                    </div>
                                    <span className="mt-2 text-xs font-medium text-gray-500">{item.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Subject Performance Card */}
                <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Average Score by Subject</h3>
                    </div>
                    <div className="space-y-4">
                        {subjectPerformance.map((subject, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-sm font-medium text-gray-900 mb-1">
                                    <span>{subject.name}</span>
                                    <span>{parseFloat(subject.average_score).toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-indigo-600 h-2.5 rounded-full"
                                        style={{ width: `${subject.average_score}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Class Pass Rate Card */}
                <div className="bg-white p-6 rounded-lg shadow border border-gray-100 lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Pass Rate by Class</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {classPassRate.map((cls, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                <h4 className="font-medium text-gray-900">{cls.class_name}</h4>
                                <div className="mt-2 flex items-baseline">
                                    <span className="text-2xl font-bold text-gray-900">{parseFloat(cls.pass_rate).toFixed(1)}%</span>
                                    <span className="ml-2 text-sm text-gray-500">passing</span>
                                </div>
                                <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                        className={`h-1.5 rounded-full ${cls.pass_rate >= 70 ? 'bg-green-500' : cls.pass_rate >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                        style={{ width: `${cls.pass_rate}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </TeacherLayout>
    );
}
