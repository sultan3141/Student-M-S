import { Link } from '@inertiajs/react';
import DirectorLayout from '@/Layouts/DirectorLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function AuditShow({ log }) {
    const getActionColor = (action) => {
        switch (action) {
            case 'created':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'updated':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'deleted':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'accessed':
                return 'bg-gray-100 text-gray-800 border-gray-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
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

    let description = {};
    try {
        description = JSON.parse(log.description.split(' - ')[1] || '{}');
    } catch (e) {
        // Description is not JSON
    }

    return (
        <DirectorLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <Link
                        href={route('director.audit.index')}
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        Back to Audit Log
                    </Link>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    {/* Action Header */}
                    <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-gray-200">
                        <div className={`px-4 py-3 rounded-lg border-2 text-2xl ${getActionColor(log.action)}`}>
                            {getActionIcon(log.action)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {new Date(log.created_at).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    User
                                </label>
                                <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="text-gray-900 font-medium">
                                        {log.user?.name || 'Unknown User'}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        ID: {log.user_id}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    IP Address
                                </label>
                                <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="text-gray-900 font-mono">{log.ip_address}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Timestamp
                                </label>
                                <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="text-gray-900">
                                        {new Date(log.created_at).toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {new Date(log.created_at).toLocaleString('en-US', { timeZoneName: 'short' })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Action Type
                                </label>
                                <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getActionColor(log.action)}`}>
                                        {getActionIcon(log.action)} {log.action}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Resource
                                </label>
                                <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="text-gray-900 font-mono text-sm">
                                        {log.description.split(' ')[0]} {log.description.split(' ')[1]}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="text-gray-900">
                                        {log.description.includes('200') ? (
                                            <span className="text-green-600 font-medium">✓ Success</span>
                                        ) : (
                                            <span className="text-red-600 font-medium">✗ Failed</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Full Description */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Description
                        </label>
                        <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 font-mono text-sm text-gray-900 break-all">
                            {log.description}
                        </div>
                    </div>

                    {/* Data Changes (if available) */}
                    {Object.keys(description).length > 0 && (
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                Data Changes
                            </label>
                            <div className="space-y-3">
                                {Object.entries(description).map(([key, value]) => (
                                    <div key={key} className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <p className="text-sm font-medium text-gray-700">{key}</p>
                                        <p className="text-gray-900 mt-1 font-mono text-sm">
                                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DirectorLayout>
    );
}