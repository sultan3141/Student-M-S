import { Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium border border-amber-200">
                            Administrator
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Stat Card 1 */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-amber-500">
                        <div className="p-6">
                            <div className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Users</div>
                            <div className="mt-2 text-3xl font-bold text-gray-900">1,248</div>
                        </div>
                    </div>
                    
                    {/* Stat Card 2 */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-amber-500">
                        <div className="p-6">
                            <div className="text-gray-500 text-sm font-medium uppercase tracking-wide">System Status</div>
                            <div className="mt-2 text-3xl font-bold text-emerald-600">Healthy</div>
                        </div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-amber-500">
                        <div className="p-6">
                            <div className="text-gray-500 text-sm font-medium uppercase tracking-wide">Pending Requests</div>
                            <div className="mt-2 text-3xl font-bold text-amber-600">12</div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-white overflow-hidden shadow-sm rounded-lg">
                    <div className="p-6 text-gray-900">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button className="p-4 bg-slate-50 rounded-lg border hover:bg-slate-100 transition-colors text-left group">
                                <div className="font-semibold text-slate-700 group-hover:text-amber-600">Manage Users</div>
                                <div className="text-sm text-slate-500">View and edit accounts</div>
                            </button>
                            <button className="p-4 bg-slate-50 rounded-lg border hover:bg-slate-100 transition-colors text-left group">
                                <div className="font-semibold text-slate-700 group-hover:text-amber-600">System Logs</div>
                                <div className="text-sm text-slate-500">Check activity</div>
                            </button>
                            <button className="p-4 bg-slate-50 rounded-lg border hover:bg-slate-100 transition-colors text-left group">
                                <div className="font-semibold text-slate-700 group-hover:text-amber-600">Settings</div>
                                <div className="text-sm text-slate-500">Global configurations</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
