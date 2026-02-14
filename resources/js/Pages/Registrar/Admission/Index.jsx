import RegistrarLayout from '@/Layouts/RegistrarLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ students, flash }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        router.delete(route('registrar.admission.destroy', deleteId), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setDeleteId(null);
            }
        });
    };

    return (
        <RegistrarLayout>
            <Head title="View All Students" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Navigation Tabs */}
                    <div className="mb-6 flex gap-2 flex-wrap">
                        <Link
                            href={route('registrar.admission.index')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            View All Students
                        </Link>
                        <Link
                            href={route('registrar.admission.create')}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                            Student Admission
                        </Link>
                        <Link
                            href={route('registrar.admission.classes')}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                            Manage Classes
                        </Link>
                        <Link
                            href={route('registrar.admission.subjects')}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                            Manage Subjects
                        </Link>
                    </div>

                    {/* Header - Responsive */}
                    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">VIEW ALL STUDENTS</h1>
                            <div className="text-xs sm:text-sm text-gray-500 mt-1">
                                Student › List
                            </div>
                        </div>
                        <Link
                            href={route('registrar.admission.create')}
                            className="w-full sm:w-auto text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 whitespace-nowrap"
                        >
                            + Add Student
                        </Link>
                    </div>

                    {/* Success Message */}
                    {flash?.success && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                            {flash.success}
                        </div>
                    )}

                    {/* Table Card - Responsive */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {/* Controls - Responsive */}
                        <div className="p-3 sm:p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm text-gray-600">Show</span>
                                <select className="border border-gray-300 rounded px-2 py-1 text-xs sm:text-sm">
                                    <option>10</option>
                                    <option>25</option>
                                    <option>50</option>
                                </select>
                                <span className="text-xs sm:text-sm text-gray-600">entries</span>
                            </div>
                            <div className="w-full sm:w-auto">
                                <input
                                    type="text"
                                    placeholder="Search:"
                                    className="w-full border border-gray-300 rounded px-3 py-1 text-xs sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Photo</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll Id</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reg Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {students.data && students.data.length > 0 ? (
                                        students.data.map((student, index) => (
                                            <tr key={student.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                                                <td className="px-6 py-4">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                                                        {student.user?.name?.charAt(0) || 'S'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{student.user?.name || 'N/A'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{student.student_id}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{student.grade?.name || 'N/A'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(student.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                                        active
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <div className="flex gap-2">
                                                        <Link
                                                            href={route('registrar.admission.edit', student.id)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </Link>
                                                        <button
                                                            onClick={() => confirmDelete(student.id)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                                                No students found. Click "+ Add Student" to add your first student.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden">
                            {students.data && students.data.length > 0 ? (
                                <div className="divide-y divide-gray-200">
                                    {students.data.map((student, index) => (
                                        <div key={student.id} className="p-4 hover:bg-gray-50">
                                            <div className="flex items-start gap-3">
                                                {/* Photo */}
                                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                                    {student.user?.name?.charAt(0) || 'S'}
                                                </div>
                                                
                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex-1">
                                                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                                                                {student.user?.name || 'N/A'}
                                                            </h3>
                                                            <p className="text-xs text-gray-500">Roll: {student.student_id}</p>
                                                        </div>
                                                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 whitespace-nowrap ml-2">
                                                            active
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                                                        <div>
                                                            <span className="text-gray-500">Class:</span>
                                                            <span className="ml-1 font-medium text-gray-900">{student.grade?.name || 'N/A'}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Reg Date:</span>
                                                            <span className="ml-1 font-medium text-gray-900">
                                                                {new Date(student.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Actions */}
                                                    <div className="flex gap-2">
                                                        <Link
                                                            href={route('registrar.admission.edit', student.id)}
                                                            className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 text-center"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => confirmDelete(student.id)}
                                                            className="flex-1 px-3 py-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-500 text-sm">
                                    No students found. Click "+ Add Student" to add your first student.
                                </div>
                            )}
                        </div>

                        {/* Pagination - Responsive */}
                        {students.data && students.data.length > 0 && (
                            <div className="px-3 sm:px-6 py-4 border-t">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                                    <div className="text-xs sm:text-sm text-gray-600">
                                        Showing {students.from || 0} to {students.to || 0} of {students.total || 0} entries
                                    </div>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {students.links && students.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
                                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Are you sure?</h3>
                            <p className="text-sm text-gray-500 mb-6">Delete This Data?</p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={handleDelete}
                                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Yes, delete it!
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </RegistrarLayout>
    );
}
