import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function TeacherDashboard({ auth, recentAssessments, stats, assessmentsNeedingMarks }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Teacher Dashboard</h2>}
        >
            <Head title="Teacher Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-6 mb-6 text-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-bold">Welcome back, {auth.user.name}!</h3>
                                <p className="mt-1 opacity-90">Create assessments and upload marks for your students</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-t-4 border-green-500">
                            <h4 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Assessments</h4>
                            <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total_assessments}</p>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-t-4 border-blue-500">
                            <h4 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Published</h4>
                            <p className="mt-2 text-3xl font-bold text-gray-900">{stats.published_assessments}</p>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-t-4 border-yellow-500">
                            <h4 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Drafts</h4>
                            <p className="mt-2 text-3xl font-bold text-gray-900">{stats.draft_assessments}</p>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-t-4 border-purple-500">
                            <h4 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Marks Uploaded</h4>
                            <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total_marks_uploaded}</p>
                        </div>
                    </div>

                    {/* Action Required Section */}
                    {assessmentsNeedingMarks.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                            <div className="flex items-center mb-4">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="ml-3 text-lg font-medium text-yellow-800">Action Required</h3>
                            </div>
                            <p className="text-yellow-700 mb-4">The following assessments are published but don't have marks uploaded yet:</p>
                            <div className="space-y-2">
                                {assessmentsNeedingMarks.map((assessment) => (
                                    <div key={assessment.id} className="flex justify-between items-center bg-white p-3 rounded-md">
                                        <div>
                                            <p className="font-medium text-gray-900">{assessment.title}</p>
                                            <p className="text-sm text-gray-600">{assessment.subject?.name} - {assessment.grade?.name}</p>
                                        </div>
                                        <Link
                                            href={route('marks.upload', assessment.id)}
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                        >
                                            Upload Marks
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Quick Actions */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Assessment Management</h3>
                                <div className="space-y-3">
                                    <Link
                                        href={route('assessments.create')}
                                        className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-md text-center font-medium transition-colors"
                                    >
                                        Create New Assessment
                                    </Link>
                                    <Link
                                        href={route('assessments.index')}
                                        className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-md text-center font-medium transition-colors"
                                    >
                                        Manage Assessments
                                    </Link>
                                </div>
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        <strong>Workflow:</strong> Create assessments → Publish → Upload marks → Students can view results
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Assessments */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Recent Assessments</h3>
                                    {recentAssessments.length > 0 && (
                                        <Link
                                            href={route('assessments.index')}
                                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                        >
                                            View All
                                        </Link>
                                    )}
                                </div>
                                {recentAssessments.length > 0 ? (
                                    <div className="space-y-3">
                                        {recentAssessments.map((assessment) => (
                                            <div key={assessment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900 truncate">{assessment.title}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {assessment.subject?.name} - {assessment.grade?.name}
                                                    </p>
                                                    <div className="flex items-center mt-1 space-x-2">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            assessment.status === 'published' ? 'bg-green-100 text-green-800' :
                                                            assessment.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {assessment.status}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {assessment.assessment_type}
                                                        </span>
                                                        {assessment.marks && assessment.marks.length > 0 && (
                                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                                {assessment.marks.length} marks
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col space-y-1 ml-4">
                                                    <Link
                                                        href={route('assessments.show', assessment.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link
                                                        href={route('marks.upload', assessment.id)}
                                                        className={`text-sm font-medium ${
                                                            assessment.marks && assessment.marks.length > 0
                                                                ? 'text-blue-600 hover:text-blue-900'
                                                                : 'text-green-600 hover:text-green-900'
                                                        }`}
                                                    >
                                                        {assessment.marks && assessment.marks.length > 0 ? 'Update Marks' : 'Upload Marks'}
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="text-gray-400 mb-4">
                                            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                            </svg>
                                        </div>
                                        <p className="text-gray-500 text-sm mb-4">No assessments created yet.</p>
                                        <Link
                                            href={route('assessments.create')}
                                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700"
                                        >
                                            Create Your First Assessment
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}