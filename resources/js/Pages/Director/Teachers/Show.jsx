import DirectorLayout from '@/Layouts/DirectorLayout';
import { Head, Link } from '@inertiajs/react';
import {
    UserIcon,
    AcademicCapIcon,
    PhoneIcon,
    MapPinIcon,
    BuildingOfficeIcon,
    ArrowLeftIcon,
    PencilSquareIcon,
    EnvelopeIcon,
    KeyIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Show({ teacher, performance }) {
    const [showCredentials, setShowCredentials] = useState(false);

    return (
        <DirectorLayout>
            <Head title={`${teacher.user?.name || 'Teacher Profile'}`} />

            <div className="max-w-6xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <Link
                            href={route('director.teachers.index')}
                            className="text-sm text-gray-500 hover:text-blue-600 flex items-center mb-2 transition-colors"
                        >
                            <ArrowLeftIcon className="h-4 w-4 mr-1" />
                            Back to Directory
                        </Link>
                        <h1 className="text-3xl font-bold text-navy-900" style={{ color: '#0F172A' }}>
                            Teacher Profile
                        </h1>
                    </div>
                    <Link
                        href={route('director.teachers.edit', teacher.id)}
                        className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2"
                    >
                        <PencilSquareIcon className="h-5 w-5" />
                        <span>Edit Profile</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Profile Card */}
                    <div className="lg:col-span-1 border-r border-gray-200 pr-6">
                        <div className="executive-card text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

                            <div className="relative pt-12">
                                <div className="w-24 h-24 mx-auto bg-white rounded-full p-2 mb-4 shadow-lg">
                                    <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold uppercase border-2 border-white shadow-sm">
                                        {teacher.user?.name?.charAt(0)}
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">{teacher.user?.name}</h2>
                                <p className="text-blue-600 font-medium">{teacher.specialization || 'Teacher'}</p>
                                <p className="text-sm text-gray-500 mt-1">{teacher.employee_id}</p>

                                <div className="mt-6 flex justify-center space-x-3">
                                    <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                                        <EnvelopeIcon className="h-6 w-6" />
                                    </button>
                                    <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors">
                                        <PhoneIcon className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 border-t border-gray-100 pt-6 text-left space-y-4">
                                {/* Login Credentials Section */}
                                {teacher.username && (
                                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-2">
                                                <KeyIcon className="h-5 w-5 text-blue-600" />
                                                <span className="text-sm font-bold text-blue-900">LOGIN CREDENTIALS</span>
                                            </div>
                                            <button
                                                onClick={() => setShowCredentials(!showCredentials)}
                                                className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-3 py-1 bg-white rounded-md border border-blue-300 hover:border-blue-400 transition-colors"
                                            >
                                                {showCredentials ? 'Hide' : 'Show'}
                                            </button>
                                        </div>
                                        {showCredentials && (
                                            <div className="space-y-2">
                                                <div className="bg-white p-3 rounded border border-blue-100">
                                                    <div className="text-xs text-gray-600 mb-1">Username</div>
                                                    <div className="font-mono font-bold text-gray-900 text-sm">
                                                        {teacher.username}
                                                    </div>
                                                </div>
                                                <div className="bg-white p-3 rounded border border-blue-100">
                                                    <div className="text-xs text-gray-600 mb-1">Password</div>
                                                    <div className="text-xs text-gray-500 italic">
                                                        Set during account creation (cannot be retrieved)
                                                    </div>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
                                                    <span className="font-semibold">⚠️ Security Note:</span> Passwords are encrypted and cannot be viewed. Teacher must use password reset if forgotten.
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-start space-x-3">
                                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Department</p>
                                        <p className="text-sm text-gray-600">{teacher.department || 'Not Assigned'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <AcademicCapIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Qualification</p>
                                        <p className="text-sm text-gray-600">{teacher.qualification || 'Not Specified'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Contact</p>
                                        <p className="text-sm text-gray-600">{teacher.phone || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Address</p>
                                        <p className="text-sm text-gray-600 line-clamp-2">{teacher.address || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Stats & Assignments */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Performance Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="executive-card bg-blue-50 border-blue-200">
                                <div className="text-3xl font-bold text-blue-700">{performance?.avgClassScore || 0}%</div>
                                <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mt-1">Avg. Class Score</div>
                            </div>
                            <div className="executive-card bg-emerald-50 border-emerald-200">
                                <div className="text-3xl font-bold text-emerald-700">{performance?.passRate || 0}%</div>
                                <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mt-1">Pass Rate</div>
                            </div>
                            <div className="executive-card bg-purple-50 border-purple-200">
                                <div className="text-3xl font-bold text-purple-700">{performance?.totalStudents || 0}</div>
                                <div className="text-xs font-semibold text-purple-600 uppercase tracking-wide mt-1">Students Taught</div>
                            </div>
                        </div>

                        {/* Recent Activity / Assignments */}
                        <div className="executive-card">
                            <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center">
                                <AcademicCapIcon className="h-5 w-5 text-gold-500 mr-2" />
                                Current Assignments
                            </h3>

                            {teacher.assignments && teacher.assignments.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 text-gray-700 font-semibold uppercase text-xs">
                                            <tr>
                                                <th className="px-4 py-3 rounded-l-lg">Subject</th>
                                                <th className="px-4 py-3">Grade</th>
                                                <th className="px-4 py-3 rounded-r-lg">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {teacher.assignments.map((assignment, index) => (
                                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-3 font-medium text-gray-900">
                                                        {assignment.subject?.name || 'Unknown Subject'}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600">
                                                        {assignment.grade?.name || `Grade ${assignment.grade?.level || '?'}`}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                                                            View Performance
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    <AcademicCapIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500 font-medium">No active assignments</p>
                                    <p className="text-xs text-gray-400">Assign subjects to see them here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DirectorLayout>
    );
}
