import StudentLayout from '@/Layouts/StudentLayout';
import { Head } from '@inertiajs/react';

export default function Courses({ auth, student, courses, academicYear }) {
    return (
        <StudentLayout auth={auth} title="My Courses" student={student}>
            <Head title="My Courses" />

            <div className="max-w-6xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
                        <p className="text-gray-600 mt-2">Enrolled subjects for Academic Year {academicYear?.name || 'N/A'}</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm font-medium text-gray-600">
                        Total Credits: {courses.reduce((sum, course) => sum + course.credit_hours, 0)}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                            {/* Course Header */}
                            <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:h-3 transition-all duration-300"></div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">
                                        {course.code.substring(0, 2)}
                                    </div>
                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-semibold">
                                        {course.credit_hours} Credits
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-1">{course.name}</h3>
                                <p className="text-sm text-gray-500 mb-6 font-mono">{course.code}</p>

                                <div className="border-t border-gray-100 pt-4 mt-auto">
                                    <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">Instructor</p>
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs mr-3">
                                            {course.teacher.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{course.teacher}</p>
                                            {course.teacher_email && (
                                                <p className="text-xs text-gray-500">{course.teacher_email}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {courses.length === 0 && (
                        <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
                            <div className="text-5xl mb-4">📚</div>
                            <h3 className="text-lg font-medium text-gray-900">No Courses Found</h3>
                            <p className="text-gray-500 mt-1">You are not enrolled in any courses for this academic year.</p>
                        </div>
                    )}
                </div>
            </div>
        </StudentLayout>
    );
}
