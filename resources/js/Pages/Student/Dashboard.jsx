import { Head } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';

export default function StudentDashboard({ auth, student, subjects, academicYear, promotionStatus, stats }) {
    return (
        <StudentLayout auth={auth} title="Student Dashboard" student={student}>
            <Head title="Student Dashboard" />

            {/* Promotion Banner - Original Functionality */}
            {promotionStatus && promotionStatus.eligible && (
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 mb-6 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="text-5xl">🎉</div>
                            <div>
                                <h3 className="text-2xl font-bold">Congratulations!</h3>
                                <p className="text-blue-100 mt-1">
                                    You're eligible for promotion to Grade {promotionStatus.next_grade} with {promotionStatus.average}% average
                                </p>
                            </div>
                        </div>
                        <a
                            href={route('student.registration.form')}
                            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition shadow"
                        >
                            Register Now →
                        </a>
                    </div>
                </div>
            )}

            {/* Quick Stats Cards - Original Functionality */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Current Grade</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{stats.current_grade}</p>
                            <p className="text-xs text-gray-400 mt-1">Academic Year {academicYear?.year || 'N/A'}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">GPA</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{stats.gpa.toFixed(2)}</p>
                            <p className="text-xs text-gray-400 mt-1">Out of 4.0</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Class Rank</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{stats.rank || 'N/A'}</p>
                            <p className="text-xs text-gray-400 mt-1">In your section</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Attendance</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{stats.attendance_rate}%</p>
                            <p className="text-xs text-gray-400 mt-1">This academic year</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Assignments</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{stats.pending_assignments}</p>
                            <p className="text-xs text-red-500 mt-1">Pending submission</p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* My Courses Section - Original Functionality */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-green-600 text-white px-6 py-4 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg flex items-center">
                            <span className="mr-2">📚</span> My Courses
                        </h3>
                        <p className="text-green-100 text-sm mt-1">Academic Year {academicYear?.year || 'N/A'}</p>
                    </div>
                    <div className="bg-green-700 px-4 py-2 rounded-lg">
                        <span className="font-semibold">{subjects?.length || 0} Courses</span>
                    </div>
                </div>
                <div className="p-6">
                    {subjects && subjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {subjects.map((subject) => (
                                <div key={subject.id} className="border-2 border-gray-200 rounded-lg p-5 hover:border-green-500 hover:shadow-md transition cursor-pointer">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-800 text-lg">{subject.name}</h4>
                                            <p className="text-sm text-gray-500 mt-1">{subject.code}</p>
                                        </div>
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                            3 Credits
                                        </span>
                                    </div>
                                    <div className="pt-3 border-t border-gray-100">
                                        <p className="text-xs text-gray-400">Teacher: Not Assigned</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="text-7xl mb-4">📖</div>
                            <p className="text-gray-500 text-lg font-medium">No courses assigned yet</p>
                            <p className="text-gray-400 text-sm mt-2">Courses will appear here once you're registered</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions & Student Info - Original Functionality */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-purple-600 text-white px-6 py-4">
                        <h3 className="font-bold text-lg flex items-center">
                            <span className="mr-2">⚡</span> Quick Actions
                        </h3>
                    </div>
                    <div className="p-6 space-y-3">
                        <a
                            href={route('student.records')}
                            className="block w-full text-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition shadow"
                        >
                            📊 View Grades
                        </a>
                        <a
                            href={route('student.grade-audit')}
                            className="block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow"
                        >
                            📖 Grade Audit
                        </a>
                        <a
                            href={route('student.profile.edit')}
                            className="block w-full text-center px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition shadow"
                        >
                            👤 Update Profile
                        </a>
                        <button className="block w-full text-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition">
                            📄 Download Transcript
                        </button>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg shadow-lg p-6 text-white">
                    <h4 className="font-bold text-lg mb-4 flex items-center">
                        <span className="mr-2">ℹ️</span> Student Information
                    </h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-green-500/30">
                            <span className="text-green-100">Student ID:</span>
                            <span className="font-semibold">{student?.student_id || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-green-500/30">
                            <span className="font-semibold">{student?.section?.name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-green-500/30">
                            <span className="text-green-100">Class Teacher:</span>
                            <span className="font-semibold">{student?.section?.class_teacher?.user?.name || 'Not Assigned'}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-green-500/30">
                            <span className="text-green-100">Gender:</span>
                            <span className="font-semibold capitalize">{student?.gender || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-green-100">DOB:</span>
                            <span className="font-semibold">{student?.dob || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
