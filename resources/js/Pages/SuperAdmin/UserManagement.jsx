import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    MagnifyingGlassIcon,
    PencilIcon,
    TrashIcon,
    KeyIcon,
    PlusIcon
} from '@heroicons/react/24/outline';

export default function UserManagement({ users, roles, stats, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedRole, setSelectedRole] = useState(filters.role || 'all');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('super_admin.users.index'), { search: searchTerm, role: selectedRole }, { preserveState: true });
    };

    const handleRoleFilter = (role) => {
        setSelectedRole(role);
        router.get(route('super_admin.users.index'), { search: searchTerm, role: role }, { preserveState: true });
    };

    const handleDelete = (userId) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(route('super_admin.users.destroy', userId));
        }
    };

    const getRoleBadgeColor = (roleName) => {
        const colors = {
            'admin': 'bg-red-100 text-red-700',
            'super_admin': 'bg-purple-100 text-purple-700',
            'registrar': 'bg-green-100 text-green-700',
            'teacher': 'bg-blue-100 text-blue-700',
            'student': 'bg-yellow-100 text-yellow-700',
            'parent': 'bg-pink-100 text-pink-700',
        };
        return colors[roleName] || 'bg-gray-100 text-gray-700';
    };

    return (
        <SuperAdminLayout>
            <Head title="User & Role Management" />

            <h2 className="text-2xl font-bold text-gray-900 mb-6">User & Role Management</h2>

            {/* Search and Filter Bar */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search by name, ID, or email...</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Search..."
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-64">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
                        <select
                            value={selectedRole}
                            onChange={(e) => handleRoleFilter(e.target.value)}
                            className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="all">All Roles</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.name}>{role.name}</option>
                            ))}
                        </select>
                    </div>
                    <Link
                        href={route('super_admin.users.create')}
                        className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center whitespace-nowrap"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Add New User
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <div className="text-3xl font-bold text-blue-900 mb-1">{stats.total}</div>
                    <div className="text-sm font-medium text-blue-700">Total Users</div>
                </div>
                <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                    <div className="text-3xl font-bold text-green-900 mb-1">{stats.active}</div>
                    <div className="text-sm font-medium text-green-700">Active</div>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                    <div className="text-3xl font-bold text-purple-900 mb-1">{stats.teachers}</div>
                    <div className="text-sm font-medium text-purple-700">Teachers</div>
                </div>
                <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                    <div className="text-3xl font-bold text-amber-900 mb-1">{stats.staff}</div>
                    <div className="text-sm font-medium text-amber-700">Staff</div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User ID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Login</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.data.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {user.username || `USR${user.id}`}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.roles[0]?.name)}`}>
                                            {user.roles[0]?.name || 'No Role'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-12-22</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                                        <Link
                                            href={route('super_admin.users.edit', user.id)}
                                            className="inline-flex items-center text-blue-600 hover:text-blue-800"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </Link>
                                        <button className="inline-flex items-center text-amber-600 hover:text-amber-800">
                                            <KeyIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="inline-flex items-center text-red-600 hover:text-red-800"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {users.links && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing {users.from} to {users.to} of {users.total} results
                        </div>
                        <div className="flex space-x-2">
                            {users.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium ${link.active
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                        }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </SuperAdminLayout>
    );
}
