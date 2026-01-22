import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function SchoolDirectorDashboard({ auth, stats, recentAssessments, gradeStats }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">School Director Dashboard</h2>}
        >
            <Head title="School Director Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-lg p-6 mb-6 text-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-bold">Welcome, {auth.user.name}</h3>
                                <p className="mt-1 opacity-90">
                                    Academic Year: {stats.active_academic_year?.name || 'No Active Year'}
                                </p>
                            </div>
                            <div className="text-right hidden sm:block">
                                <span className="block text-3xl font-bold">{stats.total_students}</span>
                                <span className="block text-sm opacity-75">Total Students</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-t-4 border-blue-500">
                            <h4 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Students</h4>
                            <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total_students}</p>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-t-4 border-green-500">
                            <h4 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Teachers</h4>
                            <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total_teachers}</p>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-t-4 border-purple-500">
                            <h4 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Assessments</h4>
                            <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total_assessments}</p>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-t-4 border-yellow-500">
                            <h4 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Grades</h4>
                            <p className="mt-2 text-3xl font-bold text-gray-900">{gradeStats.length}</p>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Quick Actions */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Management</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        href={route('school-director.teachers')}
                                        className="block bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 text-center transition-colors"
                                    >
                                        <div className="text-blue-600 font-medium">Teachers</div>
                                        <div className="text-2xl font-bold text-blue-800">{stats.total_teachers}</div>
                                    </Link>
                                    <Link
                                        href={route('school-director.assessments')}
                                        className="block bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 text-center transition-colors"
                                    >
                                        <div className="text-green-600 font-medium">Assessments</div>
                                        <div className="text-2xl font-bold text-green-800">{stats.total_assessments}</div>
                                    </Link>
                                    <Link
                                        href={route('school-director.reports')}
                                        className="block bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-4 text-center transition-colors"
                                    >
                                        <div className="text-purple-600 font-medium">Reports</div>
                                        <div className="text-sm text-purple-800">Analytics</div>
                                    </Link>
                                    <Link
                                        href={route('registrar.dashboard')}
                                        className="block bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg p-4 text-center transition-colors"
                                    >
                                        <div className="text-yellow-600 font-medium">Registrar</div>
                                        <div className="text-sm text-yellow-800">Students</div>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Grade Distribution */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Students by Grade</h3>
                                <div className="space-y-3">
                                    {gradeStats.map((grade) => (
                                        <div key={grade.id} className="flex justify-between items-center">
                                            <span className="text-gray-700 font-medium">{grade.name}</span>
                                            <div className="flex items-center">
                                                <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                                                    <div 
                                                        className="bg-indigo-600 h-2 rounded-full" 
                                                        style={{ 
                                                            width: `${stats.total_students > 0 ? (grade.students_count / stats.total_students) * 100 : 0}%` 
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="text-gray-900 font-semibold w-8 text-right">
                                                    {grade.students_count}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Assessments */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Recent Assessments</h3>
                                <Link
                                    href={route('school-director.assessments')}
                                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                >
                                    View All
                                </Link>
                            </div>
                            {recentAssessments.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Assessment
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Subject
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Grade
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Teacher
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {recentAssessments.slice(0, 5).map((assessment) => (
                                                <tr key={assessment.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {assessment.title}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {assessment.assessment_type}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {assessment.subject?.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {assessment.grade?.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {assessment.creator?.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            assessment.status === 'published' ? 'bg-green-100 text-green-800' :
                                                            assessment.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {assessment.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No assessments created yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}