import React, { useState, useEffect, useCallback } from 'react';
import RegistrarLayout from '@/Layouts/RegistrarLayout';
import { Head, useForm, Link, router, usePage } from '@inertiajs/react';
import { ClipboardDocumentIcon, EyeIcon, EyeSlashIcon, TrashIcon } from '@heroicons/react/24/outline';
import { debounce } from 'lodash';

export default function Index({ students, grades, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedGrade, setSelectedGrade] = useState(filters.grade_id || '');
    const [showCredentials, setShowCredentials] = useState({});
    const [isSearching, setIsSearching] = useState(false);
    const { flash } = usePage().props;

    // Debounced search function
    const performSearch = useCallback(
        debounce((query, gradeId) => {
            router.get(route('registrar.students.index'), {
                search: query,
                grade_id: gradeId
            }, {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsSearching(false)
            });
        }, 500),
        []
    );

    // Effect to trigger search when searchTerm or selectedGrade changes
    useEffect(() => {
        if (searchTerm !== (filters.search || '') || selectedGrade !== (filters.grade_id || '')) {
            setIsSearching(true);
            performSearch(searchTerm, selectedGrade);
        }
    }, [searchTerm, selectedGrade]);

    const handleSearch = (e) => {
        e.preventDefault();
        performSearch.flush(); // Execute search immediately on enter
    };

    const handleGradeFilter = (gradeId) => {
        setSelectedGrade(gradeId);
    };

    const toggleCredentials = (studentId) => {
        setShowCredentials(prev => ({
            ...prev,
            [studentId]: !prev[studentId]
        }));
    };

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        alert(`${type} copied to clipboard!`);
    };

    const handleDeleteStudent = (studentId, studentName) => {
        console.log('Delete button clicked for:', studentId, studentName);

        if (window.confirm(`Are you sure you want to delete student "${studentName}"? This action cannot be undone and will remove all their data.`)) {
            console.log('Deletion confirmed, sending request...');
            router.delete(route('registrar.students.destroy', studentId), {
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Delete successful');
                    // Success message will be shown via flash
                },
                onError: (errors) => {
                    console.error('Delete failed:', errors);
                    alert('Failed to delete student. Check console for details.');
                }
            });
        } else {
            console.log('Deletion cancelled');
        }
    };

    return (
        <RegistrarLayout user={null}>
            <Head title="Student Management" />

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

                {/* Header & Controls */}
                <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
                    <div className="bg-[#228B22] px-6 py-4 border-b border-[#D4AF37] flex flex-col md:flex-row justify-between items-center">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <span className="mr-2">🎓</span> STUDENT MANAGEMENT
                        </h2>
                        <div className="mt-4 md:mt-0 flex items-center space-x-3 w-full md:w-auto">
                            <form onSubmit={handleSearch} className="flex flex-1 md:flex-initial relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full md:w-64 border-gray-300 rounded-l-md shadow-sm focus:border-[#228B22] focus:ring-[#228B22] text-sm pr-10"
                                    placeholder="Search Name, ID, Username..."
                                />
                                {isSearching && (
                                    <div className="absolute right-12 top-1/2 -translate-y-1/2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#228B22] border-t-transparent"></div>
                                    </div>
                                )}
                                <button type="submit" className="bg-[#1E40AF] text-white px-4 py-2 rounded-r-md hover:bg-blue-800 transition-colors">
                                    🔍
                                </button>
                            </form>
                            <Link href={route('registrar.students.create')} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md font-bold transition-colors whitespace-nowrap flex items-center">
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                New Student
                            </Link>
                        </div>
                    </div>

                    {/* Grade Filter */}
                    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">Filter by Grade:</span>
                            <button
                                onClick={() => handleGradeFilter('')}
                                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${!selectedGrade ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                            >
                                All Grades
                            </button>
                            {grades.map(grade => (
                                <button
                                    key={grade.id}
                                    onClick={() => handleGradeFilter(grade.id)}
                                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${selectedGrade == grade.id ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                                >
                                    {grade.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Students List */}
                <div className="space-y-4">
                    {students.data.length === 0 ? (
                        <div className="bg-white p-12 text-center rounded-lg border border-dashed border-gray-300 text-gray-500">
                            No students found. Try a different search or register a new student.
                        </div>
                    ) : (
                        students.data.map((student) => (
                            <div key={student.id} className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6 hover:border-[#228B22] transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start space-x-4 flex-1">
                                        <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                                            🎓
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="font-bold text-[#1F2937] text-lg">{student.user?.name}</h3>
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">
                                                    {student.student_id}
                                                </span>
                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">
                                                    {student.grade?.name}
                                                </span>
                                                {student.section && (
                                                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded">
                                                        {student.section.name}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="text-sm text-gray-500 space-y-1">
                                                <p>👤 Username: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{student.user?.username}</code></p>
                                                <p>📧 Email: {student.user?.email || 'No email'}</p>
                                                <p>👨‍👩‍👧‍👦 Parents: {student.parents?.length || 0} linked</p>
                                            </div>

                                            {/* Login Credentials Section */}
                                            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-xs font-bold text-blue-900 uppercase">Student Portal Login</p>
                                                    <button
                                                        onClick={() => toggleCredentials(student.id)}
                                                        className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                                                    >
                                                        {showCredentials[student.id] ? (
                                                            <>
                                                                <EyeSlashIcon className="w-4 h-4 mr-1" />
                                                                Hide
                                                            </>
                                                        ) : (
                                                            <>
                                                                <EyeIcon className="w-4 h-4 mr-1" />
                                                                Show
                                                            </>
                                                        )}
                                                    </button>
                                                </div>

                                                {showCredentials[student.id] && (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between bg-white p-2 rounded border border-blue-100">
                                                            <div>
                                                                <p className="text-[10px] text-gray-500 uppercase">Username</p>
                                                                <p className="text-sm font-mono font-bold text-gray-900">{student.user?.username}</p>
                                                            </div>
                                                            <button
                                                                onClick={() => copyToClipboard(student.user?.username, 'Username')}
                                                                className="text-blue-600 hover:text-blue-800"
                                                                title="Copy username"
                                                            >
                                                                <ClipboardDocumentIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <div className="flex items-center justify-between bg-white p-2 rounded border border-blue-100">
                                                            <div>
                                                                <p className="text-[10px] text-gray-500 uppercase">Password</p>
                                                                <p className="text-sm font-mono text-gray-600">password</p>
                                                            </div>
                                                            <button
                                                                onClick={() => copyToClipboard('password', 'Password')}
                                                                className="text-blue-600 hover:text-blue-800"
                                                                title="Copy password"
                                                            >
                                                                <ClipboardDocumentIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <p className="text-[10px] text-gray-500 italic mt-1">
                                                            ⚠️ Default password is "password" - Advise students to change it after first login
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col space-y-2 ml-4">
                                        <Link
                                            as="button"
                                            method="delete"
                                            href={route('registrar.students.destroy', student.id)}
                                            preserveScroll
                                            onBefore={() => window.confirm(`⚠️ WARNING: Delete "${student.user?.name}"?\n\nThis will permanently remove:\n- Student account\n- All academic records\n- Parent relationships\n\nThis action CANNOT be undone!`)}
                                            className="flex items-center justify-center px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded transition-colors w-full"
                                        >
                                            <TrashIcon className="w-4 h-4 mr-1" />
                                            Delete
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {students.links && (
                    <div className="flex justify-center mt-6">
                        {students.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`px-3 py-1 mx-1 rounded border text-sm ${link.active ? 'bg-[#228B22] text-white border-[#228B22]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}

                {/* Statistics */}
                <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Student Statistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">{students.total}</p>
                            <p className="text-sm text-blue-800">Total Students</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">{students.data.filter(s => s.parents?.length > 0).length}</p>
                            <p className="text-sm text-green-800">With Parents</p>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <p className="text-2xl font-bold text-yellow-600">{students.data.filter(s => !s.parents?.length).length}</p>
                            <p className="text-sm text-yellow-800">No Parents</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <p className="text-2xl font-bold text-purple-600">{grades.length}</p>
                            <p className="text-sm text-purple-800">Total Grades</p>
                        </div>
                    </div>
                </div>
            </div>
        </RegistrarLayout>
    );
}