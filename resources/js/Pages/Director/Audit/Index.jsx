import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import DirectorLayout from '@/Layouts/DirectorLayout';
import { ArrowDownTrayIcon, FunnelIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function AuditIndex({ logs, users, actions, filters }) {
    const [selectedFilters, setSelectedFilters] = useState(filters);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...selectedFilters, [key]: value };
        setSelectedFilters(newFilters);
        router.get(route('director.audit.index'), newFilters);
    };

    const handleExport = () => {
        router.get(route('director.audit.export'), selectedFilters);
    };

    const getActionColor = (action) => {
        switch (action) {
            case 'created':
                return 'bg-green-100 text-green-800';
            case 'updated':
                return 'bg-blue-100 text-blue-800';
            case 'deleted':
                return 'bg-red-100 text-red-800';
            case 'accessed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getActionIcon = (action) => {
        switch (action) {
            case 'created':
                return '✨';
            case 'updated':
                return '✏️';
            case 'deleted':
                return '🗑️';
            case 'accessed':
                return '👁️';
            default:
                return '📝';
        }
    };

    return (
        <DirectorLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Audit Log</h1>
                        <p className="text-gray-600 mt-1">Track all Director actions and changes</p>
                    </div>
                    <button
                        onClick={handleExport}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                        Export CSV
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <FunnelIcon className="h-5 w-5 text-gray-400" />
                        <h3 className="font-semibold text-gray-900">Filters</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* User Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                User
                            </label>
                            <select
                                value={selectedFilters.user_id || ''}
                                onChange={(e) => handleFilterChange('user_id', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">All Users</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Action Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Action
                            </label>
                            <select
                                value={selectedFilters.action || ''}
                                onChange={(e) => handleFilterChange('action', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">All Actions</option>
                                {actions.map((action) => (
                                    <option key={action} value={action}>
                                        {action.charAt(0).toUpperCase() + action.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date From */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                From Date
                            </label>
                            <input
                                type="date"
                                value={selectedFilters.date_from || ''}
                                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Date To */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                To Date
                            </label>
                            <input
                                type="date"
                                value={selectedFilters.date_to || ''}
                                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Audit Logs Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date & Time</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">User</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">IP Address</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {logs.data.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {new Date(log.created_at).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {log.user?.name || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                                            {getActionIcon(log.action)} {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                        {log.description}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {log.ip_address}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <Link
                                            href={route('director.audit.show', log.id)}
                                            className="text-indigo-600 hover:text-indigo-700 font-medium"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {logs.links && (
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-center space-x-2">
                            {logs.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        link.active
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {logs.data.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No audit logs found</p>
                        </div>
                    )}
                </div>
            </div>
        </DirectorLayout>
    );
}
