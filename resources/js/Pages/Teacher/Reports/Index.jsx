import { Head } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import PerformanceChart from '@/Components/Dashboard/PerformanceChart';
import { ChartBarIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function Index({ statistics, subjectPerformance, classPassRate }) {

    // Transform statistics object to display score statistics instead of grade distribution

    return (
        <TeacherLayout>
            <Head title="Reports" />

            <div className="sm:flex sm:items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Academic Reports</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Performance analytics and score distribution across your classes.
                    </p>
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                    Export PDF
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Score Statistics Card */}
                <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Score Statistics</h3>
                        <ChartBarIcon className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{statistics?.average_score?.toFixed(1) || '0.0'}</div>
                            <div className="text-sm text-gray-600">Average Score</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{statistics?.high_performers || 0}</div>
                            <div className="text-sm text-gray-600">High Performers (80+)</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-600">{statistics?.passing_students || 0}</div>
                            <div className="text-sm text-gray-600">Passing (60+)</div>
                        </div>
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">{statistics?.failing_students || 0}</div>
                            <div className="text-sm text-gray-600">Below 60</div>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Min Score: {statistics?.min_score || 0}</span>
                            <span>Max Score: {statistics?.max_score || 0}</span>
                        </div>
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
