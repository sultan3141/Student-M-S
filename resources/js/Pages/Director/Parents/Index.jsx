import React, { useState } from 'react';
import DirectorLayout from '@/Layouts/DirectorLayout';
import { Head, Link, router } from '@inertiajs/react';
import { MagnifyingGlassIcon, UserGroupIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function Index({ parents, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('director.parents.index'), {
            search: searchTerm,
            status: filters.status,
        }, { preserveState: true });
    };

    return (
        <DirectorLayout>
            <Head title="Parent Directory" />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-navy-900" style={{ color: '#0F172A' }}>
                        👥 Parent Directory
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Manage and view parent/guardian information
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-6 bg-white p-4 rounded-lg shadow">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Parents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {parents.data.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No parents found</p>
                        </div>
                    ) : (
                        parents.data.map((parent) => (
                            <div key={parent.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
                                <div className="p-6">
                                    {/* Parent Info */}
                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                                            {parent.user?.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Guardian
                                        </p>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                                        {parent.phone && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                {parent.phone}
                                            </div>
                                        )}
                                        {parent.user?.email && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                {parent.user.email}
                                            </div>
                                        )}
                                    </div>

                                    {/* Students Count */}
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600 mb-2">
                                            <span className="font-semibold text-gray-900">{parent.students?.length || 0}</span> Student(s) Linked
                                        </p>
                                        {parent.students && parent.students.length > 0 && (
                                            <div className="space-y-1">
                                                {parent.students.slice(0, 3).map((student) => (
                                                    <div key={student.id} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                                        {student.user?.name} - {student.grade?.name}
                                                    </div>
                                                ))}
                                                {parent.students.length > 3 && (
                                                    <div className="text-xs text-gray-500 italic">
                                                        +{parent.students.length - 3} more
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Button */}
                                    <Link
                                        href={route('director.parents.show', parent.id)}
                                        className="w-full text-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {parents.links && (
                    <div className="flex justify-center mt-8">
                        {parents.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`px-3 py-1 mx-1 rounded border text-sm ${link.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </DirectorLayout>
    );
}
