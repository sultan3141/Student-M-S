import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function RegistrarDashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Registrar Dashboard</h2>}
        >
            <Head title="Registrar Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-emerald-500">
                            <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Students</div>
                            <div className="mt-2 text-3xl font-bold text-gray-900">1,240</div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-blue-500">
                            <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">New Registrations</div>
                            <div className="mt-2 text-3xl font-bold text-gray-900">45</div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-purple-500">
                            <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">Pending Payments</div>
                            <div className="mt-2 text-3xl font-bold text-gray-900">12</div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-rose-500">
                            <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">Incomplete Profiles</div>
                            <div className="mt-2 text-3xl font-bold text-gray-900">8</div>
                        </div>
                    </div>

                    {/* Main Actions Area */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-800">Quick Actions</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Link
                                    href={route('registrar.students.create')}
                                    className="block p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl hover:shadow-md transition-all duration-300 group"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-indigo-500 rounded-lg text-white group-hover:scale-110 transition-transform">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                                        </div>
                                        <span className="text-indigo-600 font-medium text-sm">New Student</span>
                                    </div>
                                    <h4 className="font-bold text-gray-800 mb-1">Register Student</h4>
                                    <p className="text-gray-600 text-sm">Create a new student account with minimal details.</p>
                                </Link>

                                <Link
                                    href={route('registrar.payments.index')}
                                    className="block p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl hover:shadow-md transition-all duration-300 group"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-emerald-500 rounded-lg text-white group-hover:scale-110 transition-transform">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                        </div>
                                        <span className="text-emerald-600 font-medium text-sm">Payments</span>
                                    </div>
                                    <h4 className="font-bold text-gray-800 mb-1">Fee Collection</h4>
                                    <p className="text-gray-600 text-sm">Record manual fee payments and track balances.</p>
                                </Link>

                                <Link
                                    href="#"
                                    className="block p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl hover:shadow-md transition-all duration-300 group"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-purple-500 rounded-lg text-white group-hover:scale-110 transition-transform">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                                        </div>
                                        <span className="text-purple-600 font-medium text-sm">Overview</span>
                                    </div>
                                    <h4 className="font-bold text-gray-800 mb-1">Generate Reports</h4>
                                    <p className="text-gray-600 text-sm">View enrollment stats, gender distribution, and more.</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
