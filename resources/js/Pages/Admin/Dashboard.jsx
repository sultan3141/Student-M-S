import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import {
    UsersIcon,
    ServerStackIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon,
    CurrencyDollarIcon,
    UserPlusIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            {/* System Status Banner */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    <div className="relative">
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                            <ServerStackIcon className="w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">System Operational</h2>
                        <p className="text-sm text-gray-500">All services running normally. Database load: 12%</p>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-lg transition-colors border border-gray-200 flex items-center">
                        <ArrowPathIcon className="w-4 h-4 mr-2" />
                        Refresh
                    </button>
                    <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm shadow-amber-200">
                        View Logs
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <UsersIcon className="w-6 h-6" />
                        </div>
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">+12%</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">1,248</div>
                    <div className="text-sm font-medium text-gray-500">Total Users</div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <UsersIcon className="w-6 h-6" />
                        </div>
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600">0%</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">42</div>
                    <div className="text-sm font-medium text-gray-500">New This Week</div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                            <ExclamationTriangleIcon className="w-6 h-6" />
                        </div>
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700">Action</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">12</div>
                    <div className="text-sm font-medium text-gray-500">Pending Requests</div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <CurrencyDollarIcon className="w-6 h-6" />
                        </div>
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">Good</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">$24k</div>
                    <div className="text-sm font-medium text-gray-500">Fee Collection</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Registrations Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">Recent Registrations</h3>
                        <button className="text-sm font-medium text-amber-600 hover:text-amber-700">View All</button>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[1, 2, 3, 4].map((i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 mr-3">
                                                U{i}
                                            </div>
                                            <span className="font-medium text-gray-900">User Name {i}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold 
                                            ${i % 2 === 0 ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                            {i % 2 === 0 ? 'Teacher' : 'Student'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm text-gray-500">2 mins ago</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Quick Actions Panel */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 bg-gray-50 hover:bg-white hover:shadow-md border border-gray-100 rounded-xl transition-all text-left group">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <UserPlusIcon className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-gray-900">Add User</h4>
                            <p className="text-xs text-gray-500 mt-1">Create new account</p>
                        </button>

                        <button className="p-4 bg-gray-50 hover:bg-white hover:shadow-md border border-gray-100 rounded-xl transition-all text-left group">
                            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Cog6ToothIcon className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-gray-900">Site Config</h4>
                            <p className="text-xs text-gray-500 mt-1">Global settings</p>
                        </button>

                        <button className="p-4 bg-gray-50 hover:bg-white hover:shadow-md border border-gray-100 rounded-xl transition-all text-left group">
                            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <ServerStackIcon className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-gray-900">Backups</h4>
                            <p className="text-xs text-gray-500 mt-1">Manage data</p>
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
