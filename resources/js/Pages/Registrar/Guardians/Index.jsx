import React, { useState } from 'react';
import RegistrarLayout from '@/Layouts/RegistrarLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';

export default function Index({ guardians, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

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

    return (
        <RegistrarLayout user={null}>
            <Head title="Guardian Management Hub" />

            <div className="space-y-6">

                {/* Header & Controls */}
                {/* Header & Controls */}
                <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
                    <div className="bg-[#228B22] px-6 py-4 border-b border-[#D4AF37] flex flex-col md:flex-row justify-between items-center">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <span className="mr-2">👨👩👧</span> GUARDIAN MANAGEMENT HUB
                        </h2>
                        <form onSubmit={handleSearch} className="mt-4 md:mt-0 flex w-full md:w-auto">
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
                                        <div className="flex items-start space-x-4">
                                            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-xl">
                                                👨
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-[#1F2937] text-lg">{guardian.user?.name}</h3>
                                                <div className="text-sm text-gray-500 space-y-1">
                                                    <p>📞 {guardian.phone || 'No phone'}</p>
                                                    <p>📧 {guardian.user?.email}</p>
                                                    <p>🏠 {guardian.address || 'No address'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setData('guardian_id', guardian.id)}
                                            className="text-xs bg-[#228B22] text-white px-2 py-1 rounded hover:bg-green-700"
                                        >
                                            Select to Link
                                        </button>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Linked Students:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {guardian.students.length > 0 ? guardian.students.map(student => (
                                                <span key={student.id} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100 flex items-center">
                                                    🎓 {student.user?.name || student.student_id} <span className="ml-1 text-gray-400">({student.student_id})</span>
                                                </span>
                                            )) : (
                                                <span className="text-xs text-gray-400 italic">No students linked yet.</span>
                                            )}
                                        </div>
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
                                    <p>Select a guardian from the list to populate the ID, then enter the Student ID to create a relationship.</p>
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
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Student ID (Search)</label>
                                    <input
                                        type="text"
                                        value={data.student_id}
                                        onChange={e => setData('student_id', e.target.value)} // Ideally autocomplete this
                                        className="w-full border-gray-300 rounded shadow-sm focus:border-[#228B22] focus:ring-[#228B22] text-sm"
                                        placeholder="Enter Student Database ID (e.g. 1)"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">Temporary: Use Database ID for now (will upgrade to search)</p>
                                    {errors.student_id && <p className="text-red-500 text-xs mt-1">{errors.student_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Relationship</label>
                                    <select
                                        value={data.relationship}
                                        onChange={e => setData('relationship', e.target.value)}
                                        className="w-full border-gray-300 rounded shadow-sm focus:border-[#228B22] focus:ring-[#228B22] text-sm"
                                    >
                                        <option value="Father">Father</option>
                                        <option value="Mother">Mother</option>
                                        <option value="Guardian">Legal Guardian</option>
                                        <option value="Relative">Relative</option>
                                    </select>
                                </div>

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
