import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ArrowLeftIcon, DocumentTextIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function CreateDocumentTemplate({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: 'General',
        description: '',
        template_content: '',
        is_active: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('director.documents.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={null}
        >
            <Head title="Create Template" />

            <div className="min-h-screen bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                    {/* Modern Header */}
                    <div className="mb-10">
                        <Link
                            href={route('director.documents.index', { tab: 'templates' })}
                            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black mb-4 transition-colors"
                        >
                            <ArrowLeftIcon className="w-4 h-4 mr-2" />
                            Back to Workspace
                        </Link>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">New Document Template</h1>
                        <p className="text-gray-500 mt-2 text-lg">Create a reusable HTML template for official school documents.</p>
                    </div>

                    {/* Form Container */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8">
                        <form onSubmit={submit} className="space-y-8">

                            {/* Section 1: Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-2">
                                        Template Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g. Annual Report Certificate"
                                        required
                                        autoFocus
                                    />
                                    {errors.name && <p className="mt-2 text-sm text-red-600 font-medium">{errors.name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="type" className="block text-sm font-bold text-gray-900 mb-2">
                                        Template Type
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="type"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none appearance-none bg-white"
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                        >
                                            <option value="General">General Document</option>
                                            <option value="Certificate">Certificate / Award</option>
                                            <option value="Letter">Formal Letter</option>
                                            <option value="Report">Academic Report</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                    {errors.type && <p className="mt-2 text-sm text-red-600 font-medium">{errors.type}</p>}
                                </div>
                            </div>

                            {/* Section 2: Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-bold text-gray-900 mb-2">
                                    Description <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <textarea
                                    id="description"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none resize-none"
                                    rows="2"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Briefly describe what this template is used for..."
                                />
                                {errors.description && <p className="mt-2 text-sm text-red-600 font-medium">{errors.description}</p>}
                            </div>

                            {/* Section 3: Editor */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="template_content" className="block text-sm font-bold text-gray-900">
                                        HTML Content
                                    </label>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Code Editor</span>
                                </div>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3 flex items-start gap-3">
                                    <div className="p-1 bg-blue-100 rounded text-blue-600 mt-0.5">
                                        <DocumentTextIcon className="w-4 h-4" />
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <span className="font-bold text-gray-900">Variables available:</span>{' '}
                                        <code className="bg-white border border-gray-200 px-1.5 py-0.5 rounded text-pink-600 font-mono text-xs">{`{{student_name}}`}</code>{' '}
                                        <code className="bg-white border border-gray-200 px-1.5 py-0.5 rounded text-pink-600 font-mono text-xs">{`{{grade}}`}</code>{' '}
                                        <code className="bg-white border border-gray-200 px-1.5 py-0.5 rounded text-pink-600 font-mono text-xs">{`{{date}}`}</code>
                                    </div>
                                </div>
                                <textarea
                                    id="template_content"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all font-mono text-sm leading-relaxed resize-y min-h-[400px]"
                                    value={data.template_content}
                                    onChange={(e) => setData('template_content', e.target.value)}
                                    placeholder="<html><body>...</body></html>"
                                    required
                                />
                                {errors.template_content && <p className="mt-2 text-sm text-red-600 font-medium">{errors.template_content}</p>}
                            </div>

                            {/* Section 4: Status */}
                            <div className="flex items-center">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-900">Set as active template</span>
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
                                <Link
                                    href={route('director.documents.index', { tab: 'templates' })}
                                    className="px-6 py-3 text-sm font-semibold text-gray-700 hover:text-black transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-8 py-3 bg-black border border-transparent rounded-xl font-bold text-sm text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Saving...' : 'Create Template'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
