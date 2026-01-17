import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function StudentDashboard({ auth, student, academicYear, subjects }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Student Portal</h2>}
        >
            <Head title="Student Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-lg p-6 mb-6 text-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-bold">Welcome back, {auth.user.name}!</h3>
                                <p className="mt-1 opacity-90">
                                    {academicYear ? `Academic Year: ${academicYear.name}` : 'No Active Academic Year'}
                                </p>
                            </div>
                            <div className="text-right hidden sm:block">
                                <span className="block text-3xl font-bold">{student.grade?.name}</span>
                                <span className="block text-sm opacity-75">Section {student.section?.name}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats / Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-t-4 border-indigo-500">
                            <h4 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Student ID</h4>
                            <p className="mt-2 text-2xl font-bold text-gray-900">{student.student_id}</p>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-t-4 border-purple-500">
                            <h4 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Status</h4>
                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Enrolled
                                </span>
                            </p>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-t-4 border-blue-500">
                            <h4 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Attendance</h4>
                            <p className="mt-2 text-2xl font-bold text-gray-900">98%</p> {/* Placeholder for now */}
                        </div>
                    </div>

                    {/* Navigation / Modules */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Grade Audit */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg hover:shadow-md transition-shadow duration-300">
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                                    </div>
                                    <h4 className="ml-4 text-lg font-bold text-gray-900">Academic Records</h4>
                                </div>
                                <p className="text-gray-600 mb-4 text-sm">View your grades, transcripts, and academic history for all years.</p>
                                <button className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">View Records &rarr;</button>
                            </div>
                        </div>

                        {/* Courses */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg hover:shadow-md transition-shadow duration-300">
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                    </div>
                                    <h4 className="ml-4 text-lg font-bold text-gray-900">My Courses</h4>
                                </div>
                                <div className="space-y-2 mb-4">
                                    {subjects && subjects.length > 0 ? (
                                        subjects.map((subject) => (
                                            <div key={subject.id} className="flex justify-between items-center text-sm border-b border-gray-100 pb-1 last:border-0">
                                                <span className="text-gray-700 font-medium">{subject.name}</span>
                                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{subject.code}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm">No courses assigned yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Profile */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg hover:shadow-md transition-shadow duration-300">
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div className="p-3 rounded-full bg-gray-100 text-gray-600">
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    </div>
                                    <h4 className="ml-4 text-lg font-bold text-gray-900">Profile</h4>
                                </div>
                                <p className="text-gray-600 mb-4 text-sm">Update your personal contact information and photo.</p>
                                <Link href={route('student.profile.edit')} className="text-gray-600 hover:text-gray-900 font-medium text-sm">Manage Profile &rarr;</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
