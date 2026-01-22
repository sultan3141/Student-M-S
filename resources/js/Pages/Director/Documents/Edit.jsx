import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import DirectorLayout from '@/Layouts/DirectorLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function DocumentsEdit({ document, documentTypes }) {
    const { data, setData, put, processing, errors } = useForm({
        name: document.name,
        type: document.type,
        description: document.description || '',
        template_content: document.template_content,
        is_default: document.is_default,
        is_active: document.is_active,
    });

    const [preview, setPreview] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('director.documents.update', document.id));
    };

    const placeholders = [
        '{{student_name}}',
        '{{student_id}}',
        '{{grade}}',
        '{{section}}',
        '{{date}}',
        '{{school_name}}',
    ];

    return (
        <DirectorLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <a
                        href={route('director.documents.index')}
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        Back
                    </a>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Document Template</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Template Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="e.g., Student Transcript"
                                />
                                {errors.name && (
                                    <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                                )}
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Document Type *
                                </label>
                                <select
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    {Object.entries(documentTypes).map(([key, label]) => (
                                        <option key={key} value={key}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                                {errors.type && (
                                    <p className="text-red-600 text-sm mt-1">{errors.type}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Describe this template..."
                                />
                            </div>

                            {/* Template Content */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Template Content *
                                </label>
                                <textarea
                                    value={data.template_content}
                                    onChange={(e) => setData('template_content', e.target.value)}
                                    rows="12"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                                    placeholder="Enter HTML content for the document..."
                                />
                                {errors.template_content && (
                                    <p className="text-red-600 text-sm mt-1">{errors.template_content}</p>
                                )}
                            </div>

                            {/* Checkboxes */}
                            <div className="space-y-3">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.is_default}
                                        onChange={(e) => setData('is_default', e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Set as default template</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Active</span>
                                </label>
                            </div>

                            {/* Submit */}
                            <div className="flex space-x-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
                                >
                                    {processing ? 'Updating...' : 'Update Template'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPreview(!preview)}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                >
                                    {preview ? 'Hide Preview' : 'Show Preview'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Placeholders */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Available Placeholders</h3>
                            <div className="space-y-2">
                                {placeholders.map((placeholder) => (
                                    <div
                                        key={placeholder}
                                        className="p-2 bg-gray-100 rounded text-sm font-mono text-gray-700 cursor-pointer hover:bg-gray-200 transition"
                                        onClick={() => {
                                            setData('template_content', data.template_content + placeholder);
                                        }}
                                    >
                                        {placeholder}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Preview */}
                        {preview && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Preview</h3>
                                <div
                                    className="border border-gray-200 rounded p-4 bg-gray-50 text-sm max-h-96 overflow-y-auto"
                                    dangerouslySetInnerHTML={{
                                        __html: data.template_content || '<p>No content yet...</p>',
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DirectorLayout>
    );
}
