import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import DirectorLayout from '@/Layouts/DirectorLayout';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function DocumentsIndex({ templates }) {
    const { flash } = usePage().props;
    const [deleteId, setDeleteId] = useState(null);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this template?')) {
            router.delete(route('director.documents.destroy', id));
        }
    };

    return (
        <DirectorLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Documents Management</h1>
                        <p className="text-gray-600 mt-1">Create and manage document templates</p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => document.getElementById('exportModal').showModal()}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export Data
                        </button>
                        <button
                            onClick={() => document.getElementById('batchModal').showModal()}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Generate Batch
                        </button>
                        <Link
                            href={route('director.documents.create')}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            New Template
                        </Link>
                    </div>
                </div>

                {/* Success Message */}
                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
                        {flash.success}
                    </div>
                )}

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.length > 0 ? (
                        templates.map((template) => (
                            <div
                                key={template.id}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {template.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Type: {template.type}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {template.is_default && (
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                Default
                                            </span>
                                        )}
                                        {template.is_active && (
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {template.description && (
                                    <p className="text-gray-600 text-sm mb-4">
                                        {template.description}
                                    </p>
                                )}

                                <div className="flex space-x-2">
                                    <Link
                                        href={route('director.documents.preview', template.id)}
                                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition text-sm"
                                    >
                                        <EyeIcon className="h-4 w-4 mr-1" />
                                        Preview
                                    </Link>
                                    <Link
                                        href={route('director.documents.edit', template.id)}
                                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition text-sm"
                                    >
                                        <PencilIcon className="h-4 w-4 mr-1" />
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(template.id)}
                                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm"
                                    >
                                        <TrashIcon className="h-4 w-4 mr-1" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 mb-4">No document templates yet</p>
                            <Link
                                href={route('director.documents.create')}
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                            >
                                <PlusIcon className="h-5 w-5 mr-2" />
                                Create First Template
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Batch Generation Modal */}
            <dialog id="batchModal" className="modal p-0 rounded-lg shadow-xl w-full max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Batch Document Generation</h3>
                    <form method="post" action={route('director.documents.generate-batch')} className="space-y-4">
                        <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')} />

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select Template</label>
                            <select name="template_id" required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select Grade</label>
                            <select name="grade_id" required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                {/* Ideally fetch grades, hardcoding for now or need to pass as prop */}
                                <option value="1">Grade 9</option>
                                <option value="2">Grade 10</option>
                                <option value="3">Grade 11</option>
                                <option value="4">Grade 12</option>
                            </select>
                        </div>

                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm">
                                Generate Zip
                            </button>
                            <button type="button" onClick={() => document.getElementById('batchModal').close()} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>

            {/* Export Data Modal */}
            <dialog id="exportModal" className="modal p-0 rounded-lg shadow-xl w-full max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Export Data</h3>
                    <form method="get" action={route('director.documents.export-data')} className="space-y-4">

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Export Type</label>
                            <select name="type" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                <option value="students">Students List</option>
                                <option value="teachers">Teachers List</option>
                                <option value="marks">Academic Marks</option>
                                <option value="fees">Fee Payments</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Filter by Grade (Optional)</label>
                            <select name="grade_id" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                <option value="">All Grades</option>
                                <option value="1">Grade 9</option>
                                <option value="2">Grade 10</option>
                                <option value="3">Grade 11</option>
                                <option value="4">Grade 12</option>
                            </select>
                        </div>

                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:col-start-2 sm:text-sm">
                                Download CSV
                            </button>
                            <button type="button" onClick={() => document.getElementById('exportModal').close()} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </DirectorLayout >
    );
}
