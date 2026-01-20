import React from 'react';
import RegistrarLayout from '@/Layouts/RegistrarLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ logs }) {

    // Helper for severity styles
    const getSeverityStyles = (severity) => {
        switch (severity) {
            case 'success': return 'bg-green-100 text-green-800 border-green-200';
            case 'danger': return 'bg-red-100 text-red-800 border-red-200';
            case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    const getIcon = (description) => {
        if (description.includes('Payment')) return '💰';
        if (description.includes('Student')) return '🎓';
        if (description.includes('Login')) return '🔐';
        return '📝';
    };

    return (
        <RegistrarLayout user={null}>
            <Head title="System Audit Logs" />

            <div className="space-y-6">

                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-[#1F2937] flex items-center">
                        <span className="mr-2">🛡️</span> SYSTEM AUDIT LOGS
                    </h2>
                    <div className="flex space-x-2">
                        <button className="text-xs bg-white border border-gray-300 px-3 py-1 rounded hover:bg-gray-50 text-gray-600">
                            Export Logs (CSV)
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-bold text-gray-700 text-sm uppercase">Recent Activity Stream</h3>
                        <span className="text-xs text-gray-500">Real-time tracking of sensitive actions</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-[#f8fafc]">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Timestamp</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User (Causer)</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Details</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                            {log.created_at}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {log.causer_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold border flex items-center w-fit ${getSeverityStyles(log.severity)}`}>
                                                <span className="mr-1">{getIcon(log.description)}</span> {log.description}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {log.subject_type} <span className="text-gray-400">#{log.subject_id}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-mono text-gray-500">
                                            {JSON.stringify(log.properties)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Placeholder */}
                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-center">
                        <span className="text-xs text-gray-400">Showing last 20 records</span>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
                    <div className="text-xl mr-3">ℹ️</div>
                    <div>
                        <h4 className="font-bold text-blue-800 text-sm">Security Policy</h4>
                        <p className="text-xs text-blue-700 mt-1">
                            Logs are retained for 365 days in compliance with Islamic School Data Privacy Policy.
                            Sensitive actions like grade changes and fee adjustments are flagged for Director review.
                        </p>
                    </div>
                </div>

            </div>
        </RegistrarLayout>
    );
}
