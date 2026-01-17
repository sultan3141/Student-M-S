import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function TeacherDashboard({ auth, academicYear }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Teacher Dashboard</h2>}
        >
            <Head title="Teacher Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg p-6 mb-6 text-white">
                        <h3 className="text-2xl font-bold">Welcome, {auth.user.name}</h3>
                        <p className="mt-1 opacity-90">
                            Academic Year: <strong>{academicYear?.name || 'N/A'}</strong>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Quick Actions */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg md:col-span-2">
                            <div className="p-6 text-gray-900">
                                <h3 className="text-lg font-bold mb-4">Academic Management</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Link
                                        href={route('teacher.marks.index')}
                                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center transition-colors"
                                    >
                                        <div className="p-3 bg-blue-100 text-blue-600 rounded-full mr-4">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">Enter Marks</h4>
                                            <p className="text-sm text-gray-500">Input student grades.</p>
                                        </div>
                                    </Link>

                                    <Link
                                        href={route('teacher.attendance.index')}
                                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center transition-colors"
                                    >
                                        <div className="p-3 bg-green-100 text-green-600 rounded-full mr-4">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">Take Attendance</h4>
                                            <p className="text-sm text-gray-500">Record daily class attendance.</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity / Schedule Placeholder */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <h3 className="text-lg font-bold mb-4">Today's Schedule</h3>
                                <p className="text-sm text-gray-500 italic">Schedule feature coming soon...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
