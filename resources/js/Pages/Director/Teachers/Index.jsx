import { useState } from 'react';
import DirectorLayout from '@/Layouts/DirectorLayout';
import { Head, Link, router } from '@inertiajs/react';
import TeacherCard from '@/Components/Director/TeacherCard';
import {
    MagnifyingGlassIcon,
    PlusIcon,
    FunnelIcon,
    ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

export default function Index({ teachers, filters }) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/director/teachers', { search: searchQuery, status: statusFilter });
    };

    const handleFilterChange = (newStatus) => {
        setStatusFilter(newStatus);
        router.get('/director/teachers', { search: searchQuery, status: newStatus });
    };

    return (
        <DirectorLayout>
            <Head title="Teacher Management" />

            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-navy-900" style={{ color: '#0F172A' }}>
                        👨‍🏫 Teacher Management
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Manage faculty, track performance, and oversee assignments
                    </p>
                </div>
                <Link
                    href="/director/teachers/create"
                    className="btn-executive flex items-center space-x-2"
                >
                    <PlusIcon className="h-5 w-5" />
                    <span>Add Teacher</span>
                </Link>
            </div>

            {/* Action Bar */}
            <div className="executive-card mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-md">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name, subject, grade..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg 
                                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </form>

                    {/* Filters */}
                    <div className="flex items-center space-x-3">
                        <FunnelIcon className="h-5 w-5 text-gray-400" />
                        <div className="flex space-x-2">
                            {['all', 'active', 'inactive'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => handleFilterChange(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === status
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Export */}
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg 
                                     text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <ArrowDownTrayIcon className="h-5 w-5" />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">{teachers?.total || 0}</div>
                    <div className="text-xs text-gray-600">Total Teachers</div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                    <div className="text-2xl font-bold text-emerald-600">
                        {teachers?.data?.filter(t => t.user).length || 0}
                    </div>
                    <div className="text-xs text-gray-600">Active</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <div className="text-2xl font-bold text-amber-600">0</div>
                    <div className="text-xs text-gray-600">On Leave</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">0</div>
                    <div className="text-xs text-gray-600">Pending Review</div>
                </div>
            </div>

            {/* Teacher Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachers?.data?.map((teacher) => (
                    <TeacherCard key={teacher.id} teacher={teacher} />
                ))}
            </div>

            {/* Pagination */}
            {teachers?.links && (
                <div className="mt-6 flex items-center justify-center space-x-2">
                    {teachers.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${link.active
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {(!teachers?.data || teachers.data.length === 0) && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">👨‍🏫</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No teachers found</h3>
                    <p className="text-gray-600 mb-4">Get started by adding your first teacher</p>
                    <Link href="/director/teachers/create" className="btn-executive inline-flex items-center space-x-2">
                        <PlusIcon className="h-5 w-5" />
                        <span>Add Teacher</span>
                    </Link>
                </div>
            )}
        </DirectorLayout>
    );
}
