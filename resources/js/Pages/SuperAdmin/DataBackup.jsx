import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { ServerIcon, ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function DataBackup({ backups, scheduledBackups }) {
    const { post, processing } = useForm();

    const handleCreateBackup = () => {
        post(route('super_admin.data.backup.create'));
    };

    return (
        <SuperAdminLayout>
            <Head title="Data & Backup" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Data Oversight & Backup</h1>
                <p className="text-gray-600">Manage system backups and export data</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <button
                    onClick={handleCreateBackup}
                    disabled={processing}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 text-left disabled:opacity-50"
                >
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                        <ServerIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Create Backup</h3>
                    <p className="text-sm text-gray-600">Create a new database backup</p>
                </button>

                <a
                    href={route('super_admin.data.export')}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 text-left"
                >
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                        <ArrowDownTrayIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Export Data</h3>
                    <p className="text-sm text-gray-600">Export system data to Excel/CSV</p>
                </a>

                <a
                    href={route('super_admin.data.reports')}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 text-left"
                >
                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                        <ArrowPathIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Global Reports</h3>
                    <p className="text-sm text-gray-600">Generate system-wide reports</p>
                </a>
            </div>

            {/* Scheduled Backups */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Scheduled Backups</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Status</div>
                        <div className={`font-bold ${scheduledBackups?.enabled ? 'text-green-600' : 'text-red-600'}`}>
                            {scheduledBackups?.enabled ? 'Enabled' : 'Disabled'}
                        </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Frequency</div>
                        <div className="font-bold text-gray-900 capitalize">{scheduledBackups?.frequency || 'N/A'}</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Time</div>
                        <div className="font-bold text-gray-900">{scheduledBackups?.time || 'N/A'}</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Retention</div>
                        <div className="font-bold text-gray-900">{scheduledBackups?.retention_days || 0} days</div>
                    </div>
                </div>
            </div>

            {/* Backup History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Backup History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Filename</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {backups?.map((backup) => (
                                <tr key={backup.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {backup.filename}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{backup.size}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{backup.created_at}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${backup.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {backup.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <button className="text-blue-600 hover:text-blue-800 font-medium mr-3">
                                            Download
                                        </button>
                                        <button className="text-yellow-600 hover:text-yellow-800 font-medium">
                                            Restore
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
