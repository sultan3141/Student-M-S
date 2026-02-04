import RegistrarLayout from '@/Layouts/RegistrarLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function ManageSubjects({ subjects, flash }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        router.delete(route('registrar.admission.subjects.destroy', deleteId), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setDeleteId(null);
            }
        });
    };

    const filteredSubjects = subjects.data?.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <RegistrarLayout>
            <Head title="Manage Subjects" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">MANAGE SUBJECTS</h1>
                            <div className="text-sm text-gray-500 mt-1">
                                Manage › Subjects
                            </div>
                        </div>
                        <Link
                            href={route('registrar.admission.subjects.create')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            + Add Subject
                        </Link>
                    </div>

                    {/* Success Message */}
                    {flash?.success && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                            {flash.success}
                        </div>
                    )}

                    {/* Table Card */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="p-4 border-b">
                            <h2 className="text-lg font-semibold mb-4">View Subjects Info</h2>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Show</span>
                                    <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                                        <option>10</option>
                                        <option>25</option>
                                        <option>50</option>
                                    </select>
                                    <span className="text-sm text-gray-600">entries</span>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Search:"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="border border-gray-300 rounded px-3 py-1 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subject Info</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Grade</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stream</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned Sections</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredSubjects.length > 0 ? (
                                    filteredSubjects.map((subject) => {
                                        return (
                                            <tr key={subject.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-black text-[#1E40AF]">{subject.name}</div>
                                                    <div className="text-[10px] font-mono text-gray-400 mt-0.5">{subject.code}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                                                        {subject.grade?.name || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {subject.stream ? (
                                                        <span className="px-2 py-1 rounded bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
                                                            {subject.stream.name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 italic text-xs">All Streams</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    <span className="text-gray-600 text-xs">
                                                        Auto-assigned to sections
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-right">
                                                    <div className="flex gap-3 justify-end">
                                                        <Link
                                                            href={route('registrar.admission.subjects.edit', subject.id)}
                                                            className="text-gray-400 hover:text-blue-600 transition-colors"
                                                            title="Edit Subject"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </Link>
                                                        <button
                                                            onClick={() => confirmDelete(subject.id)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                            title="Delete Subject"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500 border-b">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-12 h-12 text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                                <p className="font-bold">No subjects found.</p>
                                                <p className="text-xs">Click "+ Add Subject" to create your first academic unit.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {subjects.data && subjects.data.length > 0 && (
                            <div className="px-6 py-4 border-t">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-600">
                                        Showing {subjects.from || 0} to {subjects.to || 0} of {subjects.total || 0} entries
                                    </div>
                                    <div className="flex gap-2">
                                        {subjects.links && subjects.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-1 rounded ${link.active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
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
