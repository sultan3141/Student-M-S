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
        subject_id: '',
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

        // Cascading reset logic
        if (field === 'grade_id') {
            newFilters.section_id = '';
            newFilters.subject_id = '';
        } else if (field === 'section_id') {
            newFilters.subject_id = '';
        }

        setFilters(newFilters);

        // Auto-submit when grade and section are selected (to fetch subjects and students)
        if (newFilters.grade_id && newFilters.section_id) {
            router.get(route('teacher.students.manage-results'), {
                grade_id: newFilters.grade_id,
                section_id: newFilters.section_id
            }, {
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
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-16">
                        <div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">
                                <Link href={route('teacher.dashboard')} className="hover:text-blue-600 transition-colors">
                                    Dashboard
                                </Link>
                                <span className="text-gray-300">/</span>
                                <span className="text-gray-900">Result Management</span>
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
                                Student <span className="text-blue-600">Results</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="px-5 py-2.5 bg-white border border-gray-100 rounded-2xl shadow-sm text-[11px] font-black text-gray-400 tracking-widest flex items-center gap-2 h-fit">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                {academicYear?.name || '2025–2026'}
                            </div>
                        </div>
                    </div>

                    {/* Class Selection Card - Centered */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-12 transition-all hover:shadow-md relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-50 to-blue-600/20"></div>

                            <div className="text-center mb-10">
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Class <span className="text-blue-600">Selection</span></h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">
                                    Select grade, section, and subject to begin
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Grade Selector */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                                        Academic Grade
                                    </label>
                                    <div className="relative group">
                                        <select
                                            value={filters.grade_id}
                                            onChange={(e) => handleFilterChange('grade_id', e.target.value)}
                                            className="w-full pl-5 pr-12 py-4 bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 rounded-2xl text-xs font-black text-gray-700 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Select Grade</option>
                                            {grades.map(grade => (
                                                <option key={grade.id} value={grade.id}>{grade.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none transition-transform group-focus-within:rotate-180" />
                                    </div>
                                </div>

                                {/* Section Selector */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                                        Class Section
                                    </label>
                                    <div className="relative group">
                                        <select
                                            value={filters.section_id}
                                            onChange={(e) => handleFilterChange('section_id', e.target.value)}
                                            disabled={!filters.grade_id}
                                            className="w-full pl-5 pr-12 py-4 bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 rounded-2xl text-xs font-black text-gray-700 transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <option value="">Select Section</option>
                                            {selectedGradeData?.sections?.map(section => (
                                                <option key={section.id} value={section.id}>
                                                    Section {section.name} {section.stream && `(${section.stream.name})`}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none transition-transform group-focus-within:rotate-180" />
                                    </div>
                                </div>

                                {/* Subject Selector */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                                        Subject
                                    </label>
                                    <div className="relative group">
                                        <select
                                            value={filters.subject_id}
                                            onChange={(e) => handleFilterChange('subject_id', e.target.value)}
                                            disabled={!filters.section_id}
                                            className="w-full pl-5 pr-12 py-4 bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 rounded-2xl text-xs font-black text-gray-700 transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <option value="">Select Subject</option>
                                            {subjects.map(subject => (
                                                <option key={subject.id} value={subject.id}>{subject.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none transition-transform group-focus-within:rotate-180" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    {students && filters.subject_id ? (
                        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/30 border border-gray-100 overflow-hidden">
                            {/* Table Controls */}
                            <div className="px-10 py-8 border-b border-gray-100 bg-white sticky top-0 z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 uppercase">Student Results</h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            {selectedGrade?.name} • Section {selectedSection?.name}
                                        </p>
                                        <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider">
                                            {subjects.find(s => s.id === parseInt(filters.subject_id))?.name}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="relative group max-w-xs w-full">
                                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 transition-colors group-focus-within:text-blue-500" />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 rounded-2xl text-[11px] font-black text-gray-700 transition-all placeholder:text-gray-300"
                                            placeholder="SEARCH BY NAME OR ID..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-10 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] w-16">#</th>
                                            <th className="px-10 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Student Details</th>
                                            <th className="px-10 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Gender</th>
                                            <th className="px-10 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                                {subjects.find(s => s.id === parseInt(filters.subject_id))?.name} Status
                                            </th>
                                            <th className="px-10 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Overall Progress</th>
                                            <th className="px-10 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-50">
                                        {paginatedStudents.map((student, index) => {
                                            const status = student.subject_status[filters.subject_id];
                                            return (
                                                <tr key={student.id} className="hover:bg-gray-50/30 transition-colors group">
                                                    <td className="px-10 py-6 whitespace-nowrap text-[11px] font-black text-gray-300 group-hover:text-blue-500 transition-colors">
                                                        {String((currentPage - 1) * entriesCount + index + 1).padStart(2, '0')}
                                                    </td>
                                                    <td className="px-10 py-6 whitespace-nowrap">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 font-black text-lg group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-sm">
                                                                {student.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{student.name}</div>
                                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{student.student_id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-6 whitespace-nowrap">
                                                        <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${student.gender === 'Female' ? 'bg-pink-50 text-pink-600' : 'bg-blue-50 text-blue-600'
                                                            }`}>
                                                            {student.gender}
                                                        </span>
                                                    </td>
                                                    <td className="px-10 py-6 whitespace-nowrap">
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`text-sm font-black ${getStatusColor(status.percentage)}`}>
                                                                    {status.percentage}%
                                                                </div>
                                                                <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.1em]">
                                                                    ({status.filled}/{status.total})
                                                                </div>
                                                                <div className="w-px h-3 bg-gray-100"></div>
                                                                {status.is_editable ? (
                                                                    <button
                                                                        onClick={() => handleEditStudent(student.id, filters.subject_id)}
                                                                        className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest transition-colors"
                                                                    >
                                                                        {status.percentage === 100 ? 'REVIEW' : 'ENTER'}
                                                                    </button>
                                                                ) : (
                                                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-1.5">
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                                        </svg>
                                                                        LOCKED
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="w-32 h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full transition-all duration-700 ease-out ${getStatusColor(status.percentage).replace('text-', 'bg-')}`}
                                                                    style={{ width: `${status.percentage}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-6 whitespace-nowrap">
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex items-center justify-between w-32">
                                                                <div className={`text-[9px] font-black uppercase tracking-widest ${getStatusColor(student.completion_percentage)} opacity-80`}>
                                                                    {getStatusText(student.completion_percentage)}
                                                                </div>
                                                                <div className="text-[10px] font-black text-gray-900">
                                                                    {student.completion_percentage}%
                                                                </div>
                                                            </div>
                                                            <div className="w-32 h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full transition-all duration-1000 ease-out ${getStatusColor(student.completion_percentage).replace('text-', 'bg-')}`}
                                                                    style={{ width: `${student.completion_percentage}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-6 whitespace-nowrap text-right">
                                                        <button
                                                            onClick={() => router.get(route('teacher.students.show', student.id))}
                                                            className="inline-flex items-center px-6 py-2.5 bg-white border border-gray-100 text-gray-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm hover:shadow-md active:translate-y-0.5"
                                                        >
                                                            REPORT
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Enhanced Pagination Footer */}
                            <div className="px-10 py-8 bg-gray-50/50 border-t border-gray-100">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                        Page <span className="text-gray-900">{currentPage}</span> of <span className="text-gray-900">{totalPages || 1}</span>
                                        <span className="mx-3 text-gray-200">|</span>
                                        Showing <span className="text-gray-900">{filteredStudents.length}</span> Total Students
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-gray-400 disabled:opacity-30 hover:bg-gray-50 transition-all font-black text-[10px] uppercase tracking-widest"
                                            >
                                                PREV
                                            </button>
                                            <div className="flex items-center gap-1.5 px-2">
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`w-10 h-10 rounded-xl font-black text-[10px] transition-all ${currentPage === page
                                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                                            : 'text-gray-400 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {String(page).padStart(2, '0')}
                                                    </button>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-gray-400 disabled:opacity-30 hover:bg-gray-50 transition-all font-black text-[10px] uppercase tracking-widest"
                                            >
                                                NEXT
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto bg-white rounded-[3rem] border border-gray-100 p-32 text-center shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-50/20 rounded-full -ml-16 -mb-16 blur-3xl"></div>

                            <div className="w-24 h-24 bg-gray-50/80 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-sm border border-gray-50 group hover:scale-110 transition-transform duration-500">
                                <svg className="w-10 h-10 text-gray-200 group-hover:text-blue-200 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight tracking-wide">No Class <span className="text-blue-600">Selected</span></h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] max-w-xs mx-auto leading-loose opacity-60">
                                Please select a grade, section, and subject above to view results.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </TeacherLayout>
    );
}
