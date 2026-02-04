import RegistrarLayout from '@/Layouts/RegistrarLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ assessmentTypes, flash }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        router.delete(route('registrar.assessment-types.destroy', deleteId), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setDeleteId(null);
            }
        });
    };

    const filteredTypes = assessmentTypes.data?.filter(type =>
        type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type.grade?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type.section?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type.subject?.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <RegistrarLayout>
            <Head title="Assessment Types" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">ASSESSMENT TYPES</h1>
                            <div className="text-sm text-gray-500 mt-1">
                                Manage › Assessment Types
                            </div>
                        </div>
                        <Link
                            href={route('registrar.assessment-types.create')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            + Add Assessment Type
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
                            <h2 className="text-lg font-semibold mb-4">View Assessment Types</h2>
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Section</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight (%)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredTypes.length > 0 ? (
                                    filteredTypes.map((type, index) => (
                                        <tr key={type.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{type.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{type.grade?.name || 'All'}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{type.section?.name || 'All'}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{type.subject?.name || 'All'}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{type.weight || 'N/A'}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={route('registrar.assessment-types.edit', type.id)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>
                                                    <button
                                                        onClick={() => confirmDelete(type.id)}
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
                                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                            No assessment types found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {assessmentTypes.data && assessmentTypes.data.length > 0 && (
                            <div className="px-6 py-4 border-t">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-600">
                                        Showing {assessmentTypes.from || 0} to {assessmentTypes.to || 0} of {assessmentTypes.total || 0} entries
                                    </div>
                                    <div className="flex gap-2">
                                        {assessmentTypes.links && assessmentTypes.links.map((link, index) => (
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
                            <p className="text-sm text-gray-500 mb-6">Delete This Assessment Type?</p>
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
