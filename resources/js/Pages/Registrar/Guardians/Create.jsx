import React from 'react';
import RegistrarLayout from '@/Layouts/RegistrarLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        phone: '',
        email: '',
        address: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('registrar.guardians.store'));
    };

    return (
        <RegistrarLayout>
            <Head title="Create New Guardian" />

            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
                    <div className="bg-[#228B22] px-6 py-4">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <span className="mr-2">👨👩</span> CREATE NEW GUARDIAN ACCOUNT
                        </h2>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-blue-700">
                                <strong>Automatic Account Creation:</strong> A username and password will be automatically generated for this guardian. You'll see the credentials after creation - make sure to save them!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 uppercase mb-2">
                                Guardian Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-[#228B22] focus:ring-[#228B22]"
                                placeholder="e.g., John Doe"
                                required
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            <p className="text-xs text-gray-500 mt-1">This will be used to generate the username (e.g., "John Doe" → "parent_john_doe")</p>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 uppercase mb-2">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-[#228B22] focus:ring-[#228B22]"
                                placeholder="e.g., +251-911-123456"
                                required
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 uppercase mb-2">
                                Email Address (Optional)
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-[#228B22] focus:ring-[#228B22]"
                                placeholder="e.g., parent@example.com"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 uppercase mb-2">
                                Home Address (Optional)
                            </label>
                            <textarea
                                value={data.address}
                                onChange={e => setData('address', e.target.value)}
                                rows={3}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-[#228B22] focus:ring-[#228B22]"
                                placeholder="e.g., 123 Main Street, Addis Ababa"
                            />
                            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                            <Link
                                href={route('registrar.guardians.index')}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`px-6 py-2 rounded-md font-bold text-white transition-colors ${
                                    processing
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-[#228B22] hover:bg-green-700'
                                }`}
                            >
                                {processing ? 'Creating...' : 'Create Guardian Account'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* What Happens Next */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-bold text-yellow-900 mb-2">📋 What Happens Next:</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800">
                        <li>A unique username will be generated (e.g., "parent_john_doe")</li>
                        <li>A random 8-character password will be created</li>
                        <li>The guardian account will be created with "parent" role</li>
                        <li>You'll see the login credentials on the next page</li>
                        <li>Save the credentials and provide them to the guardian</li>
                        <li>Link students to this guardian from the Guardian Management page</li>
                    </ol>
                </div>
            </div>
        </RegistrarLayout>
    );
}
