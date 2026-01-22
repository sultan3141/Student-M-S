import React, { useState } from 'react';
import DirectorLayout from '@/Layouts/DirectorLayout';
import { Head } from '@inertiajs/react';
import StudentBarChart from '@/Components/Charts/StudentBarChart';
import StudentDonutChart from '@/Components/Charts/StudentDonutChart';
import SchoolSchedule from '@/Components/Director/SchoolSchedule';
import { UsersIcon, UserGroupIcon, AcademicCapIcon, UserIcon, ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';

export default function Dashboard({ statistics, recentData }) {
    const { students, instructors, parents } = statistics;
    const { recentStudents, recentParents } = recentData;

    const [searchTerm, setSearchTerm] = useState('');
    const [filterGrade, setFilterGrade] = useState('');
    const [filterSection, setFilterSection] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Get unique grades and sections from students
    const grades = [...new Set(recentStudents.map(s => s.grade?.name))].filter(Boolean);
    const sections = [...new Set(recentStudents.map(s => s.section?.name))].filter(Boolean);

    // Filter students based on search and filters
    const filteredStudents = recentStudents.filter(student => {
        const matchesSearch = !searchTerm ||
            student.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesGrade = !filterGrade || student.grade?.name === filterGrade;
        const matchesSection = !filterSection || student.section?.name === filterSection;

        return matchesSearch && matchesGrade && matchesSection;
    });

    // Pagination
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

    const handleReset = () => {
        setSearchTerm('');
        setFilterGrade('');
        setFilterSection('');
        setCurrentPage(1);
    };

    return (
        <DirectorLayout>
            <Head title="Executive Dashboard" />

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-navy-900" style={{ color: '#0F172A' }}>
                    📊 Executive Dashboard
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                    Real-time school performance analytics and student demographics
                </p>
            </div>

            {/* Overall Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="executive-card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-3 bg-blue-500 rounded-lg">
                            <UsersIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-blue-700">{students.male}</div>
                            <div className="text-xs text-blue-600">Male Students</div>
                        </div>
                    </div>
                    <div className="text-sm text-blue-700 font-medium">
                        {students.malePercent}% of total students
                    </div>
                </div>

                <div className="executive-card bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-3 bg-pink-500 rounded-lg">
                            <UserGroupIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-pink-700">{students.female}</div>
                            <div className="text-xs text-pink-600">Female Students</div>
                        </div>
                    </div>
                    <div className="text-sm text-pink-700 font-medium">
                        {students.femalePercent}% of total students
                    </div>
                </div>

                <div className="executive-card bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-3 bg-emerald-500 rounded-lg">
                            <AcademicCapIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-emerald-700">{students.total}</div>
                            <div className="text-xs text-emerald-600">Total Students</div>
                        </div>
                    </div>
                    <div className="text-sm text-emerald-700 font-medium">
                        {instructors} Instructors
                    </div>
                </div>

                <div className="executive-card bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-3 bg-amber-500 rounded-lg">
                            <UserIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-amber-700">{parents}</div>
                            <div className="text-xs text-amber-600">Total Parents</div>
                        </div>
                    </div>
                    <div className="text-sm text-amber-700 font-medium">
                        Guardian Records
                    </div>
                </div>
            </div>

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <StudentBarChart studentCount={students.total} instructorCount={instructors} />
                <StudentDonutChart data={students} title="Student Gender Distribution" />
            </div>

            {/* Students Section - Full Table with Search & Filter */}
            <div className="executive-card overflow-hidden mb-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-navy-900" style={{ color: '#0F172A' }}>
                        📚 Student Section Table ({filteredStudents.length})
                    </h3>
                    <Link
                        href={route('director.students.index')}
                        className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        View All <ArrowRightIcon className="ml-1 h-4 w-4" />
                    </Link>
                </div>

                {/* Search and Filter Bar */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, ID, or email..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>

                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            value={filterGrade}
                            onChange={(e) => {
                                setFilterGrade(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">All Grades</option>
                            {grades.map(grade => (
                                <option key={grade} value={grade}>{grade}</option>
                            ))}
                        </select>

                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            value={filterSection}
                            onChange={(e) => {
                                setFilterSection(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">All Sections</option>
                            {sections.map(section => (
                                <option key={section} value={section}>{section}</option>
                            ))}
                        </select>

                        <button
                            onClick={handleReset}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
                        >
                            Reset
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-600">
                            Items per page:
                            <select
                                className="ml-2 px-3 py-1 border border-gray-300 rounded text-sm"
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                        </label>
                        <span className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages || 1}
                        </span>
                    </div>
                </div>

                {/* Students Table */}
                <div className="overflow-x-auto -mx-6">
                    <table className="w-full min-w-[1000px]">
                        <thead className="bg-gray-50 border-y border-gray-100 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Grade/Section</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Parent/Guardian</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedStudents.length > 0 ? (
                                paginatedStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                                            {student.student_id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        {student.user?.name || 'N/A'}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {student.user?.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {student.grade?.name} - {student.section?.name}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600">
                                            {student.parents && student.parents.length > 0 ? (
                                                <div className="font-medium text-gray-900">{student.parents[0].user?.name}</div>
                                            ) : (
                                                <span className="text-gray-400 italic">Not Assigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <div className="flex justify-center space-x-3">
                                                <Link
                                                    href={route('director.students.show', student.id)}
                                                    className="text-blue-600 hover:text-blue-900 font-bold bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                                                >
                                                    View
                                                </Link>
                                                {student.parents && student.parents.length > 0 && (
                                                    <Link
                                                        href={route('director.parents.show', student.parents[0].id)}
                                                        className="text-emerald-600 hover:text-emerald-900 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-emerald-100"
                                                    >
                                                        Parent
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-8 px-6 text-center text-gray-500">
                                        No students found matching your criteria
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>

                        <div className="flex items-center space-x-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${currentPage === page
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}

                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 text-xs text-gray-600">
                    Showing {paginatedStudents.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, filteredStudents.length)} of {filteredStudents.length} student(s)
                </div>
            </div>

            {/* Recent Parents */}
            <div className="executive-card overflow-hidden mb-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-navy-900" style={{ color: '#0F172A' }}>
                        👥 Recent Parents/Guardians
                    </h3>
                    <Link
                        href={route('director.parents.index')}
                        className="flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-800 transition-colors"
                    >
                        View All <ArrowRightIcon className="ml-1 h-4 w-4" />
                    </Link>
                </div>
                <div className="overflow-x-auto -mx-6">
                    <table className="w-full min-w-[500px]">
                        <thead className="bg-gray-50 border-y border-gray-100">
                            <tr>
                                <th className="text-left py-3 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Parent/Guardian</th>
                                <th className="text-left py-3 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Contact</th>
                                <th className="text-left py-3 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Students</th>
                                <th className="text-right py-3 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentParents.map((parent) => (
                                <tr key={parent.id} className="hover:bg-emerald-50/30 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="font-semibold text-gray-900">{parent.user?.name}</div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-600">
                                        {parent.phone || parent.user?.email || 'N/A'}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-600">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                            {parent.students?.length || 0} Student(s)
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <Link
                                            href={route('director.parents.show', parent.id)}
                                            className="text-emerald-600 hover:text-emerald-900 font-medium text-sm"
                                        >
                                            Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detailed Statistics Table */}
            <div className="executive-card mb-8">
                <h3 className="text-lg font-semibold text-navy-900 mb-4" style={{ color: '#0F172A' }}>
                    Detailed Breakdown
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">CATEGORY</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-blue-700">MALE</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-pink-700">FEMALE</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-emerald-700">TOTAL</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">PERCENTAGE</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-4 font-medium text-gray-900">Students</td>
                                <td className="py-4 px-4 text-right font-semibold text-blue-600">{students.male}</td>
                                <td className="py-4 px-4 text-right font-semibold text-pink-600">{students.female}</td>
                                <td className="py-4 px-4 text-right font-semibold text-emerald-600">{students.total}</td>
                                <td className="py-4 px-4 text-right text-sm text-gray-600">
                                    M: {students.malePercent}% | F: {students.femalePercent}%
                                </td>
                            </tr>
                            <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-4 font-medium text-gray-900">Instructors</td>
                                <td className="py-4 px-4 text-right text-gray-400">-</td>
                                <td className="py-4 px-4 text-right text-gray-400">-</td>
                                <td className="py-4 px-4 text-right font-semibold text-emerald-600">{instructors}</td>
                                <td className="py-4 px-4 text-right text-sm text-gray-600">-</td>
                            </tr>
                            <tr className="border-t-2 border-gray-300 bg-gray-50 font-bold">
                                <td className="py-4 px-4 text-gray-900">RATIO</td>
                                <td className="py-4 px-4 text-right" colSpan="3">
                                    <span className="text-blue-700">{students.total}</span>
                                    <span className="text-gray-500"> : </span>
                                    <span className="text-emerald-700">{instructors}</span>
                                    <span className="text-sm text-gray-600 ml-2">
                                        ({instructors > 0 ? Math.round(students.total / instructors) : 0}:1 ratio)
                                    </span>
                                </td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* School Schedule Section */}
            <div className="mb-8">
                <SchoolSchedule />
            </div>
        </DirectorLayout>
    );
}
