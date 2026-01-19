import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head } from '@inertiajs/react';
import { ShieldCheckIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function SecurityAudit({ auditLogs, securitySettings }) {
    return (
        <SuperAdminLayout>
            <Head title="Security & Audit" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Security & Audit</h1>
                <p className="text-gray-600">Monitor security events and view immutable audit logs</p>
            </div>

            {/* Security Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-3">
                            <ShieldCheckIcon className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">Active</div>
                            <div className="text-sm text-gray-500">System Security</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center mr-3">
                            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">2</div>
                            <div className="text-sm text-gray-500">Security Events (24h)</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                            <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{auditLogs?.length || 0}</div>
                            <div className="text-sm text-gray-500">Audit Log Entries</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Security Policies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Password Requirements</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                            <li>• Minimum length: {securitySettings?.password_min_length || 8} characters</li>
                            <li>• Require uppercase: {securitySettings?.password_require_uppercase ? 'Yes' : 'No'}</li>
                            <li>• Require numbers: {securitySettings?.password_require_numbers ? 'Yes' : 'No'}</li>
                            <li>• Require special chars: {securitySettings?.password_require_special ? 'Yes' : 'No'}</li>
                        </ul>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Session & Access Control</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                            <li>• Session timeout: {securitySettings?.session_timeout || 120} minutes</li>
                            <li>• Two-factor auth: {securitySettings?.enable_2fa ? 'Enabled' : 'Disabled'}</li>
                            <li>• Max login attempts: {securitySettings?.max_login_attempts || 5}</li>
                            <li>• Lockout duration: {securitySettings?.lockout_duration || 15} minutes</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Audit Logs Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Immutable Audit Logs</h3>
                    <p className="text-sm text-gray-500 mt-1">Complete system activity history</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {auditLogs?.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.user}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.action}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{log.details}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.ip}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.timestamp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
