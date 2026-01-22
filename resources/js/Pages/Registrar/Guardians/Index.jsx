import React, { useState } from 'react';
import RegistrarLayout from '@/Layouts/RegistrarLayout';
import { Head, useForm, Link, router, usePage } from '@inertiajs/react';
import { ClipboardDocumentIcon, EyeIcon, EyeSlashIcon, KeyIcon } from '@heroicons/react/24/outline';

export default function Index({ guardians, students, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [showCredentials, setShowCredentials] = useState({});
    const { flash } = usePage().props;

    // Form for quick linking
    const { data, setData, post, processing, errors, reset } = useForm({
        student_id: '',
        guardian_id: '',
        relationship: 'Father',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('registrar.guardians.index'), { search: searchTerm }, { preserveState: true });
    };

    const handleLinkSubmit = (e) => {
        e.preventDefault();
        post(route('registrar.guardians.link'), {
            onSuccess: () => reset(),
        });
    };

    const toggleCredentials = (guardianId) => {
        setShowCredentials(prev => ({
            ...prev,
            [guardianId]: !prev[guardianId]
        }));
    };

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        alert(`${type} copied to clipboard!`);
    };

    const handleResetPassword = (guardianId) => {
        if (confirm('Are you sure you want to reset this guardian\'s password? A new password will be generated.')) {
            router.post(route('registrar.guardians.reset-password', guardianId));
        }
    };

    return (
        <RegistrarLayout user={null}>
            <Head title="Guardian Management Hub" />

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

                {/* Success Message with Credentials */}
                {flash?.credentials && (
                    <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 shadow-lg">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-3 flex-1">
                                <h3 className="text-lg font-bold text-green-800 mb-2">✅ Guardian Account Created Successfully!</h3>
                                <div className="bg-white border border-green-200 rounded p-4 space-y-2">
                                    <p className="text-sm font-bold text-gray-700">Guardian: {flash.credentials.name}</p>
                                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                        <span className="text-sm text-gray-600">Username:</span>
                                        <div className="flex items-center space-x-2">
                                            <code className="bg-blue-100 text-blue-800 px-3 py-1 rounded font-mono font-bold">{flash.credentials.username}</code>
                                            <button onClick={() => copyToClipboard(flash.credentials.username, 'Username')} className="text-blue-600 hover:text-blue-800">
                                                <ClipboardDocumentIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                        <span className="text-sm text-gray-600">Password:</span>
                                        <div className="flex items-center space-x-2">
                                            <code className="bg-red-100 text-red-800 px-3 py-1 rounded font-mono font-bold">{flash.credentials.password}</code>
                                            <button onClick={() => copyToClipboard(flash.credentials.password, 'Password')} className="text-red-600 hover:text-red-800">
                                                <ClipboardDocumentIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-yellow-700 bg-yellow-50 p-2 rounded mt-2">
                                        ⚠️ <strong>Important:</strong> Please save these credentials and provide them to the guardian. This password will not be shown again!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header & Controls */}
                <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
                    <div className="bg-[#228B22] px-6 py-4 border-b border-[#D4AF37] flex flex-col md:flex-row justify-between items-center">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <span className="mr-2">👨👩👧</span> GUARDIAN MANAGEMENT HUB
                        </h2>
                        <div className="mt-4 md:mt-0 flex items-center space-x-3 w-full md:w-auto">
                            <form onSubmit={handleSearch} className="flex flex-1 md:flex-initial">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full md:w-64 border-gray-300 rounded-l-md shadow-sm focus:border-[#228B22] focus:ring-[#228B22] text-sm"
                                    placeholder="Search Name, Phone, Email..."
                                />
                                <button type="submit" className="bg-[#1E40AF] text-white px-4 py-2 rounded-r-md hover:bg-blue-800 transition-colors">
                                    🔍
                                </button>
                            </form>
                            <Link href={route('registrar.guardians.create')} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md font-bold transition-colors whitespace-nowrap flex items-center">
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                New Guardian
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Guardian Directory (List) */}
                    <div className="lg:col-span-2 space-y-4">
                        {guardians.data.length === 0 ? (
                            <div className="bg-white p-12 text-center rounded-lg border border-dashed border-gray-300 text-gray-500">
                                No guardians found. Try a different search or register a new family.
                            </div>
                        ) : (
                            guardians.data.map((guardian) => (
                                <div key={guardian.id} className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-4 hover:border-[#228B22] transition-colors relative">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-start space-x-4 flex-1">
                                            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-xl">
                                                👨
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-[#1F2937] text-lg">{guardian.user?.name}</h3>
                                                <div className="text-sm text-gray-500 space-y-1">
                                                    <p>📞 {guardian.phone || 'No phone'}</p>
                                                    <p>📧 {guardian.user?.email || 'No email'}</p>
                                                    <p>🏠 {guardian.address || 'No address'}</p>
                                                </div>

                                                {/* Login Credentials Section */}
                                                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-xs font-bold text-blue-900 uppercase">Parent Portal Login</p>
                                                        <button
                                                            onClick={() => toggleCredentials(guardian.id)}
                                                            className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                                                        >
                                                            {showCredentials[guardian.id] ? (
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

                                                    {showCredentials[guardian.id] && (
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between bg-white p-2 rounded border border-blue-100">
                                                                <div>
                                                                    <p className="text-[10px] text-gray-500 uppercase">Username</p>
                                                                    <p className="text-sm font-mono font-bold text-gray-900">{guardian.user?.username || 'N/A'}</p>
                                                                </div>
                                                                <button
                                                                    onClick={() => copyToClipboard(guardian.user?.username, 'Username')}
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
                                                                ⚠️ Default password is "password" - Advise parents to change it after first login
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setData('guardian_id', guardian.id)}
                                            className="text-xs bg-[#228B22] text-white px-3 py-2 rounded hover:bg-green-700 ml-4"
                                        >
                                            Select to Link
                                        </button>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-xs font-bold text-gray-500 uppercase">Linked Students ({guardian.students?.length || 0}):</p>
                                        </div>

                                        {guardian.students && guardian.students.length > 0 ? (
                                            <div className="space-y-2">
                                                {guardian.students.map((student, index) => (
                                                    <div key={student.id} className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-200">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-blue-600 font-bold text-xs">#{index + 1}</span>
                                                            <div>
                                                                <p className="text-sm font-medium text-blue-900">
                                                                    {student.user?.name || 'Unknown Student'}
                                                                </p>
                                                                <p className="text-xs text-blue-600">
                                                                    ID: {student.student_id} | DB ID: {student.id}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <Link
                                                            as="button"
                                                            method="post"
                                                            href={route('registrar.guardians.unlink')}
                                                            data={{
                                                                guardian_id: guardian.id,
                                                                student_id: student.id
                                                            }}
                                                            preserveScroll
                                                            onBefore={() => window.confirm(`Are you sure you want to unlink "${student.user?.name || student.student_id}" from "${guardian.user?.name}"?`)}
                                                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded transition-colors inline-block"
                                                        >
                                                            ✕ Unlink
                                                        </Link>
                                                    </div>
                                                ))}

                                                <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                                                    <p className="text-xs text-green-700">
                                                        <strong>Guardian:</strong> {guardian.user?.name} has {guardian.students.length} student{guardian.students.length !== 1 ? 's' : ''} linked.
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-gray-50 rounded border border-gray-200 text-center">
                                                <p className="text-xs text-gray-500 italic">No students linked to this guardian yet.</p>
                                                <p className="text-xs text-gray-400 mt-1">Use the linking form on the right to add students.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Pagination */}
                        {guardians.links && (
                            <div className="flex justify-center mt-6">
                                {guardians.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 mx-1 rounded border text-sm ${link.active ? 'bg-[#228B22] text-white border-[#228B22]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Linking Tool (Sidebar) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] sticky top-24">
                            <div className="bg-[#D4AF37] px-4 py-3 border-b border-yellow-600 rounded-t-lg">
                                <h3 className="font-bold text-white text-sm">🔗 QUICK LINKING TOOL</h3>
                            </div>
                            <form onSubmit={handleLinkSubmit} className="p-4 space-y-4">
                                <div className="p-3 bg-yellow-50 text-yellow-800 text-xs rounded border border-yellow-100 mb-4">
                                    <p><strong>Rules:</strong> Each student can only be linked to ONE parent. Each parent can have multiple students. Select a guardian from the list, then enter an available student ID.</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Guardian ID (System)</label>
                                    <input
                                        type="text"
                                        value={data.guardian_id}
                                        readOnly
                                        className="w-full bg-gray-100 border-gray-300 rounded shadow-sm text-gray-500 cursor-not-allowed text-sm"
                                        placeholder="Select from list..."
                                    />
                                    {errors.guardian_id && <p className="text-red-500 text-xs mt-1">{errors.guardian_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Student Registration ID</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={data.student_id}
                                            onChange={e => setData('student_id', e.target.value)}
                                            className={`w-full border-gray-300 rounded shadow-sm focus:border-[#228B22] focus:ring-[#228B22] text-sm ${errors.student_id ? 'border-red-500' : ''}`}
                                            placeholder="Enter Student Registration ID (e.g. 0001/26)"
                                            list="students-list"
                                        />
                                        <datalist id="students-list">
                                            {students.map(student => (
                                                <option key={student.id} value={student.student_id}>
                                                    {student.student_id} - {student.name}
                                                </option>
                                            ))}
                                        </datalist>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">Only students not already linked to any parent are shown in dropdown</p>
                                    {errors.student_id && <p className="text-red-500 text-xs mt-1">{errors.student_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Relationship</label>
                                    <select
                                        value={data.relationship}
                                        onChange={e => setData('relationship', e.target.value)}
                                        className={`w-full border-gray-300 rounded shadow-sm focus:border-[#228B22] focus:ring-[#228B22] text-sm ${errors.relationship ? 'border-red-500' : ''}`}
                                    >
                                        <option value="Father">Father</option>
                                        <option value="Mother">Mother</option>
                                        <option value="Guardian">Legal Guardian</option>
                                        <option value="Relative">Relative</option>
                                    </select>
                                    {errors.relationship && <p className="text-red-500 text-xs mt-1">{errors.relationship}</p>}
                                </div>

                                {/* General form errors */}
                                {Object.keys(errors).length > 0 && (
                                    <div className="bg-red-50 border border-red-200 rounded p-3">
                                        <p className="text-red-800 text-xs font-bold mb-1">Please fix the following errors:</p>
                                        <ul className="text-red-700 text-xs space-y-1">
                                            {Object.entries(errors).map(([field, message]) => (
                                                <li key={field}>• {message}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={processing || !data.guardian_id}
                                    className={`w-full font-bold py-2 px-4 rounded shadow transition-colors ${!data.guardian_id ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-[#1E40AF] hover:bg-blue-800 text-white'}`}
                                >
                                    {processing ? 'Linking...' : 'Link Student to Guardian'}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </RegistrarLayout>
    );
}
