import React from 'react';
import DirectorLayout from '@/Layouts/DirectorLayout';
import { Head, Link } from '@inertiajs/react';
import StudentBarChart from '@/Components/Charts/StudentBarChart';
import StudentDonutChart from '@/Components/Charts/StudentDonutChart';
import { UsersIcon, UserGroupIcon, AcademicCapIcon, UserIcon, CalendarIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';

export default function Dashboard({ statistics, recentData, semesterStatus }) {
    const { students, instructors, parents } = statistics;

    return (
        <DirectorLayout>
            <Head title="Executive Dashboard" />

            {/* Compact Page Header */}
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-navy-900" style={{ color: '#0F172A' }}>
                    📊 Executive Dashboard
                </h1>
                <p className="mt-1 text-xs text-gray-600">
                    Real-time school performance overview
                </p>
            </div>

            {/* Semester Status Banner */}
            {semesterStatus && (
                <div className="mb-4 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg shadow-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-white/20 rounded-lg">
                                <CalendarIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg">
                                    {semesterStatus.academicYear} - Semester Status
                                </h3>
                                <div className="flex items-center space-x-4 mt-1">
                                    {semesterStatus.semesters?.map((sem) => (
                                        <div key={sem.semester} className="flex items-center space-x-2">
                                            {sem.is_open ? (
                                                <LockOpenIcon className="h-4 w-4 text-green-300" />
                                            ) : (
                                                <LockClosedIcon className="h-4 w-4 text-gray-300" />
                                            )}
                                            <span className="text-white text-sm">
                                                Semester {sem.semester}: 
                                                <span className={`ml-1 font-semibold ${sem.is_open ? 'text-green-300' : 'text-gray-300'}`}>
                                                    {sem.status.toUpperCase()}
                                                </span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <Link
                            href={route('director.semesters.index')}
                            className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium text-sm"
                        >
                            Manage Semesters
                        </Link>
                    </div>
                </div>
            )}

            {/* Compact Summary Cards - 5 columns */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                        <div className="p-2 bg-blue-500 rounded">
                            <UsersIcon className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-blue-700">{students.male}</div>
                        </div>
                    </div>
                    <div className="text-xs text-blue-600 font-medium">Male Students</div>
                    <div className="text-xs text-blue-500">{students.malePercent}%</div>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                        <div className="p-2 bg-pink-500 rounded">
                            <UserGroupIcon className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-pink-700">{students.female}</div>
                        </div>
                    </div>
                    <div className="text-xs text-pink-600 font-medium">Female Students</div>
                    <div className="text-xs text-pink-500">{students.femalePercent}%</div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                        <div className="p-2 bg-emerald-500 rounded">
                            <AcademicCapIcon className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-emerald-700">{students.total}</div>
                        </div>
                    </div>
                    <div className="text-xs text-emerald-600 font-medium">Total Students</div>
                    <div className="text-xs text-emerald-500">Enrolled</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                        <div className="p-2 bg-purple-500 rounded">
                            <AcademicCapIcon className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-purple-700">{instructors}</div>
                        </div>
                    </div>
                    <div className="text-xs text-purple-600 font-medium">Instructors</div>
                    <div className="text-xs text-purple-500">Teaching Staff</div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                        <div className="p-2 bg-amber-500 rounded">
                            <UserIcon className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-amber-700">{parents}</div>
                        </div>
                    </div>
                    <div className="text-xs text-amber-600 font-medium">Parents</div>
                    <div className="text-xs text-amber-500">Guardians</div>
                </div>
            </div>

            {/* Analysis Section with Charts and Gender Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <StudentBarChart studentCount={students.total} instructorCount={instructors} />
                <StudentDonutChart data={students} title="Student Gender Distribution" />
            </div>

            {/* Gender Distribution Analysis */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">📊 Gender Distribution Analysis</h3>
                <div className="space-y-2">
                    <div>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Male Students</span>
                            <span className="font-semibold">{students.male} ({students.malePercent}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-blue-500 h-2 rounded-full transition-all" 
                                style={{ width: `${students.malePercent}%` }}
                            ></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Female Students</span>
                            <span className="font-semibold">{students.female} ({students.femalePercent}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-pink-500 h-2 rounded-full transition-all" 
                                style={{ width: `${students.femalePercent}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                        <div className="flex justify-between text-xs text-gray-700">
                            <span className="font-semibold">Student-Teacher Ratio</span>
                            <span className="font-bold text-emerald-600">
                                {instructors > 0 ? Math.round(students.total / instructors) : 0}:1
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </DirectorLayout>
    );
}
