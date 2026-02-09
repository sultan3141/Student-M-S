import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    ChevronDownIcon,
    MagnifyingGlassIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';

export default function ManageResults({ grades, subjects, students, selectedGrade, selectedSection, academicYear, semesterStatuses, selectedSemester }) {
    const [filters, setFilters] = useState({
        grade_id: selectedGrade?.id || '',
        section_id: selectedSection?.id || '',
        semester: selectedSemester || '',
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [entriesCount, setEntriesCount] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const resetFilters = () => {
        setFilters({
            grade_id: '',
            section_id: '',
            semester: '',
        });
        setSearchTerm('');
        setCurrentPage(1);
        router.get(route('teacher.students.manage-results'));
    };

    const handleFilterChange = (field, value) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);

        // If grade changes, reset section
        if (field === 'grade_id') {
            newFilters.section_id = '';
            newFilters.semester = ''; // Reset semester on grade change too
        }

        // Auto-submit when both are selected
        if (newFilters.grade_id && newFilters.section_id) {
            router.get(route('teacher.students.manage-results'), newFilters, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const handleEditStudent = (studentId, subjectId) => {
        // Redirect to edit result page
        router.get(route('teacher.students.edit-result', {
            student: studentId,
            subject: subjectId,
        }));
    };

    const getStatusColor = (percentage) => {
        if (percentage === 100) return 'text-green-600';
        if (percentage >= 50) return 'text-yellow-600';
        if (percentage > 0) return 'text-orange-600';
        return 'text-red-600';
    };

    const getStatusText = (percentage) => {
        if (percentage === 100) return 'Complete';
        if (percentage >= 50) return 'Partial';
        if (percentage > 0) return 'Started';
        return 'Not Filled';
    };

    const selectedGradeData = grades.find(g => g.id === parseInt(filters.grade_id));

    // Filter students by search term
    const filteredStudents = students?.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const totalPages = Math.ceil(filteredStudents.length / entriesCount);
    const paginatedStudents = filteredStudents.slice(
        (currentPage - 1) * entriesCount,
        currentPage * entriesCount
    );

    return (
        <TeacherLayout>
            <Head title="Manage Student Results" />

            <div className="py-8 bg-gray-50/50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                                STUDENT <span className="text-blue-600">RESULTS</span>
                            </h1>
                            <div className="mt-2 flex items-center text-sm font-medium">
                                <Link href={route('teacher.dashboard')} className="text-gray-400 hover:text-blue-600 transition-colors">
                                    Dashboard
                                </Link>
                                <svg className="mx-2 h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="text-gray-600">Result Management</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-bold text-gray-700 flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                {academicYear?.name || 'Current Year'}
                            </div>
                        </div>
                    </div>

                    {/* Filters Card */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 mb-8 transition-all hover:shadow-2xl hover:shadow-gray-200/60">
                        <div className="flex flex-col lg:flex-row lg:items-end gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                                {/* Grade Selector */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                                        Academic Grade
                                    </label>
                                    <div className="relative group">
                                        <select
                                            value={filters.grade_id}
                                            onChange={(e) => handleFilterChange('grade_id', e.target.value)}
                                            className="w-full pl-4 pr-10 py-3.5 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-xl text-sm font-bold text-gray-700 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Choose Grade</option>
                                            {grades.map(grade => (
                                                <option key={grade.id} value={grade.id}>{grade.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none transition-transform group-hover:text-blue-500" />
                                    </div>
                                </div>

                                {/* Section Selector */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                                        Class Section
                                    </label>
                                    <div className="relative group">
                                        <select
                                            value={filters.section_id}
                                            onChange={(e) => handleFilterChange('section_id', e.target.value)}
                                            disabled={!filters.grade_id}
                                            className="w-full pl-4 pr-10 py-3.5 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-xl text-sm font-bold text-gray-700 transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <option value="">Choose Section</option>
                                            {selectedGradeData?.sections?.map(section => (
                                                <option key={section.id} value={section.id}>
                                                    Section {section.name} {section.stream && `(${section.stream.name})`}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none transition-transform group-hover:text-blue-500" />
                                    </div>
                                </div>

                                {/* Semester Selector */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                                        Academic Term
                                    </label>
                                    <div className="relative group">
                                        <select
                                            value={filters.semester}
                                            onChange={(e) => handleFilterChange('semester', e.target.value)}
                                            disabled={!filters.grade_id || !filters.section_id}
                                            className="w-full pl-4 pr-10 py-3.5 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-xl text-sm font-bold text-gray-700 transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <option value="">Full Year</option>
                                            <option value="1">Semester 1</option>
                                            <option value="2">Semester 2</option>
                                        </select>
                                        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none transition-transform group-hover:text-blue-500" />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={resetFilters}
                                className="px-6 py-3.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 text-sm font-black transition-all border-none flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                RESET
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    {students && students.length > 0 ? (
                        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                            {/* Table Controls */}
                            <div className="px-8 py-6 border-b border-gray-100 bg-white sticky top-0 z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-lg font-black text-gray-900">STUDENT DIRECTORY</h3>
                                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">
                                        {selectedGrade?.name} • Section {selectedSection?.name} • {filteredStudents.length} Students
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="relative group max-w-xs w-full">
                                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 transition-colors group-focus-within:text-blue-500" />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-xl text-sm font-bold text-gray-700 transition-all"
                                            placeholder="Search by name or ID..."
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl">
                                        <span className="text-xs font-black text-gray-400 uppercase">Show</span>
                                        <select
                                            value={entriesCount}
                                            onChange={(e) => {
                                                setEntriesCount(parseInt(e.target.value));
                                                setCurrentPage(1);
                                            }}
                                            className="bg-transparent border-none text-sm font-bold text-gray-700 focus:ring-0 cursor-pointer py-1"
                                        >
                                            <option value="10">10</option>
                                            <option value="25">25</option>
                                            <option value="50">50</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">#</th>
                                            <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Student Details</th>
                                            <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Gender</th>
                                            {subjects.map(subject => (
                                                <th key={subject.id} className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                                    {subject.name}
                                                </th>
                                            ))}
                                            <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Completion</th>
                                            <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-50">
                                        {paginatedStudents.map((student, index) => (
                                            <tr key={student.id} className="hover:bg-blue-50/30 transition-colors group">
                                                <td className="px-8 py-6 whitespace-nowrap text-sm font-black text-gray-300 group-hover:text-blue-200">
                                                    {String((currentPage - 1) * entriesCount + index + 1).padStart(2, '0')}
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-black text-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                            {student.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-black text-gray-900">{student.name}</div>
                                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{student.student_id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${student.gender === 'Female' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'
                                                        }`}>
                                                        {student.gender}
                                                    </span>
                                                </td>
                                                {subjects.map(subject => {
                                                    const status = student.subject_status[subject.id];
                                                    return (
                                                        <td key={subject.id} className="px-8 py-6 whitespace-nowrap">
                                                            <div className="flex flex-col gap-1.5">
                                                                <div className="flex items-center gap-2">
                                                                    <div className={`text-sm font-black ${getStatusColor(status.percentage)}`}>
                                                                        {status.percentage}%
                                                                    </div>
                                                                    <div className="text-[10px] font-bold text-gray-400">
                                                                        ({status.filled}/{status.total})
                                                                    </div>
                                                                </div>
                                                                {status.is_editable ? (
                                                                    <button
                                                                        onClick={() => handleEditStudent(student.id, subject.id)}
                                                                        className="w-fit px-3 py-1 bg-gray-50 text-[10px] font-black text-gray-500 rounded-lg border border-gray-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all uppercase tracking-wider"
                                                                    >
                                                                        {status.percentage === 100 ? 'Review' : 'Fill'}
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => {
                                                                            router.get(route('teacher.declare-result.index'), {
                                                                                step: 5,
                                                                                grade_id: filters.grade_id,
                                                                                section_id: filters.section_id,
                                                                                subject_id: subject.id,
                                                                                student_id: student.id,
                                                                                show_closed: 1
                                                                            });
                                                                        }}
                                                                        className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-wider hover:text-gray-900 transition-colors"
                                                                    >
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                        </svg>
                                                                        Locked
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <div className="flex flex-col gap-2">
                                                        <div className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md w-fit ${getStatusColor(student.completion_percentage).replace('text-', 'bg-').replace('600', '100')} ${getStatusColor(student.completion_percentage)}`}>
                                                            {getStatusText(student.completion_percentage)}
                                                        </div>
                                                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full transition-all duration-500 ${getStatusColor(student.completion_percentage).replace('text-', 'bg-')}`}
                                                                style={{ width: `${student.completion_percentage}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => router.get(route('teacher.students.show', student.id))}
                                                        className="inline-flex items-center px-4 py-2 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                    >
                                                        Analytics
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Enhanced Pagination Footer */}
                            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                        Showing <span className="text-gray-900">{filteredStudents.length > 0 ? (currentPage - 1) * entriesCount + 1 : 0}</span> to <span className="text-gray-900">{Math.min(currentPage * entriesCount, filteredStudents.length)}</span> of <span className="text-gray-900">{filteredStudents.length}</span> students
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="p-2 bg-white border border-gray-200 rounded-xl text-gray-400 disabled:opacity-30 hover:bg-gray-50 transition-all font-black text-xs"
                                            >
                                                Prev
                                            </button>
                                            <div className="flex items-center gap-1.5 px-2">
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`w-8 h-8 rounded-xl font-black text-xs transition-all ${currentPage === page
                                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                                            : 'text-gray-400 hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className="p-2 bg-white border border-gray-200 rounded-xl text-gray-400 disabled:opacity-30 hover:bg-gray-50 transition-all font-black text-xs"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Complete</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Partial</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Empty</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-lg p-12 text-center text-gray-500">
                            <UserGroupIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                            <p className="text-lg font-medium text-gray-900">No results to display</p>
                            <p className="text-sm">Please select a grade and section from the filters above to view student results.</p>
                        </div>
                    )}
                </div>
            </div>
        </TeacherLayout>
    );
}
