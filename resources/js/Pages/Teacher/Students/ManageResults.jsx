import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';

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

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">MANAGE STUDENT RESULTS</h1>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                            <Link href={route('teacher.dashboard')} className="hover:text-blue-600 transition-colors">
                                Dashboard
                            </Link>
                            <svg className="mx-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>Student Results</span>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex justify-between items-end gap-6">
                            <div className="grid grid-cols-4 gap-6 items-end flex-1">
                                {/* Grade Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Grade
                                    </label>
                                    <select
                                        value={filters.grade_id}
                                        onChange={(e) => handleFilterChange('grade_id', e.target.value)}
                                        className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                    >
                                        <option value="">-- Select Grade --</option>
                                        {grades.map(grade => (
                                            <option key={grade.id} value={grade.id}>
                                                {grade.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Section Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Section
                                    </label>
                                    <select
                                        value={filters.section_id}
                                        onChange={(e) => handleFilterChange('section_id', e.target.value)}
                                        disabled={!filters.grade_id}
                                        className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm disabled:bg-gray-100"
                                    >
                                        <option value="">-- Select Section --</option>
                                        {selectedGradeData?.sections?.map(section => (
                                            <option key={section.id} value={section.id}>
                                                Section {section.name}
                                                {section.stream && ` - ${section.stream.name}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Semester Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Semester
                                    </label>
                                    <select
                                        value={filters.semester}
                                        onChange={(e) => handleFilterChange('semester', e.target.value)}
                                        disabled={!filters.grade_id || !filters.section_id}
                                        className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm disabled:bg-gray-100"
                                    >
                                        <option value="">All Semesters</option>
                                        <option value="1">Semester 1</option>
                                        <option value="2">Semester 2</option>
                                    </select>
                                </div>

                                {/* Academic Year Display */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Academic Year
                                    </label>
                                    <div className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-[7px] bg-gray-50 text-gray-700">
                                        {academicYear?.name || 'N/A'}
                                    </div>
                                </div>
                            </div>

                            {/* Reset Button */}
                            <div className="flex-shrink-0">
                                <button
                                    onClick={resetFilters}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium transition-colors border border-gray-300"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Content */}
                    {students && students.length > 0 ? (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            {/* Table Header */}
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700">View Student Results Info</h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {selectedGrade?.name} - Section {selectedSection?.name} • {filteredStudents.length} students
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-gray-600">Show</label>
                                            <select
                                                value={entriesCount}
                                                onChange={(e) => {
                                                    setEntriesCount(parseInt(e.target.value));
                                                    setCurrentPage(1);
                                                }}
                                                className="border-gray-300 rounded-md text-sm"
                                            >
                                                <option value="10">10</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                            </select>
                                            <span className="text-sm text-gray-600">entries</span>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => {
                                                    setSearchTerm(e.target.value);
                                                    setCurrentPage(1);
                                                }}
                                                className="pl-10 border-gray-300 rounded-md text-sm w-64 focus:border-blue-500 focus:ring-blue-500"
                                                placeholder="Search student name or ID..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                #
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Student Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Student ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Gender
                                            </th>
                                            {subjects.map(subject => (
                                                <th key={subject.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {subject.name}
                                                </th>
                                            ))}
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Overall Status
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {paginatedStudents.map((student, index) => (
                                            <tr key={student.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                    {(currentPage - 1) * entriesCount + index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {student.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {student.student_id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                                                    {student.gender}
                                                </td>
                                                {subjects.map(subject => {
                                                    const status = student.subject_status[subject.id];
                                                    return (
                                                        <td key={subject.id} className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <div className="flex flex-col gap-1">
                                                                <span className={`font-medium ${getStatusColor(status.percentage)}`}>
                                                                    {status.filled}/{status.total}
                                                                </span>
                                                                {status.is_editable ? (
                                                                    <button
                                                                        onClick={() => handleEditStudent(student.id, subject.id)}
                                                                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline text-left"
                                                                    >
                                                                        {status.percentage === 100 ? 'Edit' : 'Fill'}
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => {
                                                                            router.get(route('teacher.declare-result.index'), {
                                                                                step: 5,
                                                                                grade_id: selectedGrade.id,
                                                                                section_id: selectedSection.id,
                                                                                subject_id: subject.id,
                                                                                student_id: student.id,
                                                                                show_closed: 1
                                                                            });
                                                                        }}
                                                                        className="text-xs text-gray-600 hover:text-gray-900 hover:underline text-left flex items-center gap-1 font-medium"
                                                                    >
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                        </svg>
                                                                        View (Locked)
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`font-medium ${getStatusColor(student.completion_percentage)}`}>
                                                        {getStatusText(student.completion_percentage)}
                                                    </span>
                                                    <div className="text-xs text-gray-500">
                                                        {student.total_filled}/{student.total_assessments} ({student.completion_percentage}%)
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-3">
                                                        <button
                                                            onClick={() => router.get(route('teacher.students.show', student.id))}
                                                            className="inline-flex items-center text-blue-600 hover:text-blue-900"
                                                            title="Performance Analytics"
                                                        >
                                                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14" />
                                                            </svg>
                                                            Analytics
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Table Footer */}
                            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-sm text-gray-600">
                                        Showing {filteredStudents.length > 0 ? (currentPage - 1) * entriesCount + 1 : 0} to {Math.min(currentPage * entriesCount, filteredStudents.length)} of {filteredStudents.length} entries
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
                                            >
                                                Previous
                                            </button>
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`px-3 py-1 border rounded-md text-sm ${currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-100'}`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}

                                    <div className="text-xs flex gap-4">
                                        <span className="font-medium text-green-600">● Complete</span>
                                        <span className="font-medium text-yellow-600">● Partial</span>
                                        <span className="font-medium text-orange-600">● Started</span>
                                        <span className="font-medium text-red-600">● Not Filled</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : filters.grade_id && filters.section_id ? (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                There are no students in this section.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Select Grade and Section</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Choose a grade and section above to view student results.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </TeacherLayout>
    );
}
