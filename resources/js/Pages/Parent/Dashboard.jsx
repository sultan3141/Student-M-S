import { Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium border border-purple-200">
                            Parent Portal
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Child Card */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg border-t-4 border-purple-500">
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl">
                                    JS
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">John Smith</h3>
                                    <p className="text-sm text-gray-500">Grade 10-A • ID: 2024001</p>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                                    <span className="text-sm font-medium text-slate-600">Attendance</span>
                                    <span className="text-sm font-bold text-emerald-600">98%</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                                    <span className="text-sm font-medium text-slate-600">Current GPA</span>
                                    <span className="text-sm font-bold text-blue-600">3.8</span>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button className="flex-1 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm font-medium">
                                    View Report Card
                                </button>
                                <button className="flex-1 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium">
                                    Message Teacher
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Notices Card */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                         <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">School Notices</h3>
                            <div className="space-y-4">
                                <div className="border-l-4 border-blue-500 pl-4 py-1">
                                    <div className="text-xs text-blue-600 font-semibold uppercase">Today</div>
                                    <div className="text-sm text-gray-800">Parent-Teacher meeting scheduled for next Friday.</div>
                                </div>
                                <div className="border-l-4 border-slate-300 pl-4 py-1">
                                    <div className="text-xs text-slate-500 font-semibold uppercase">Yesterday</div>
                                    <div className="text-sm text-gray-800">School sports day photos are now available in the gallery.</div>
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
