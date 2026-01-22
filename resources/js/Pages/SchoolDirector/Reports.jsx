import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function SchoolDirectorReports({ auth, assessmentsByType, assessmentsByGrade }) {
    const totalAssessments = assessmentsByType.reduce((sum, item) => sum + item.count, 0);

    const getTypeColor = (type) => {
        switch (type) {
            case 'Final': return 'bg-red-500';
            case 'Midterm': return 'bg-blue-500';
            case 'Test': return 'bg-purple-500';
            case 'Assignment': return 'bg-orange-500';
            default: return 'bg-gray-500';
        }
    };

    const getGradeColor = (index) => {
        const colors = ['bg-indigo-500', 'bg-green-500', 'bg-yellow-500', 'bg-pink-500'];
        return colors[index % colors.length];
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Assessment Reports</h2>
                    <Link
                        href={route('school-director.dashboard')}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>
            }
        >
            <Head title="Assessment Reports" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-t-4 border-blue-500">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Assessments</h3>
                            <p className="text-3xl font-bold text-blue-600">{totalAssessments}</p>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-t-4 border-green-500">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Assessment Types</h3>
                            <p className="text-3xl font-bold text-green-600">{assessmentsByType.length}</p>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-t-4 border-purple-500">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Grades Covered</h3>
                            <p className="text-3xl font-bold text-purple-600">{assessmentsByGrade.length}</p>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-t-4 border-yellow-500">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Avg per Grade</h3>
                            <p className="text-3xl font-bold text-yellow-600">
                                {assessmentsByGrade.length > 0 ? Math.round(totalAssessments / assessmentsByGrade.length) : 0}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Assessment Types Distribution */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-6">Assessments by Type</h3>
                                {assessmentsByType.length > 0 ? (
                                    <div className="space-y-4">
                                        {assessmentsByType.map((item, index) => {
                                            const percentage = totalAssessments > 0 ? (item.count / totalAssessments) * 100 : 0;
                                            return (
                                                <div key={item.assessment_type} className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`w-4 h-4 rounded ${getTypeColor(item.assessment_type)}`}></div>
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {item.assessment_type}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                                            <div 
                                                                className={`h-2 rounded-full ${getTypeColor(item.assessment_type)}`}
                                                                style={{ width: `${percentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <div className="text-sm text-gray-600 w-16 text-right">
                                                            {item.count} ({percentage.toFixed(1)}%)
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No assessment data available.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Assessment by Grade Distribution */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-6">Assessments by Grade</h3>
                                {assessmentsByGrade.length > 0 ? (
                                    <div className="space-y-4">
                                        {assessmentsByGrade.map((item, index) => {
                                            const percentage = totalAssessments > 0 ? (item.count / totalAssessments) * 100 : 0;
                                            return (
                                                <div key={item.grade_id} className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`w-4 h-4 rounded ${getGradeColor(index)}`}></div>
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {item.grade?.name || `Grade ${item.grade_id}`}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                                            <div 
                                                                className={`h-2 rounded-full ${getGradeColor(index)}`}
                                                                style={{ width: `${percentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <div className="text-sm text-gray-600 w-16 text-right">
                                                            {item.count} ({percentage.toFixed(1)}%)
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No grade data available.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Detailed Tables */}
                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Assessment Types Table */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Assessment Types Breakdown</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Count
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Percentage
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {assessmentsByType.map((item) => {
                                                const percentage = totalAssessments > 0 ? (item.count / totalAssessments) * 100 : 0;
                                                return (
                                                    <tr key={item.assessment_type}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className={`w-3 h-3 rounded mr-3 ${getTypeColor(item.assessment_type)}`}></div>
                                                                <span className="text-sm font-medium text-gray-900">
                                                                    {item.assessment_type}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {item.count}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {percentage.toFixed(1)}%
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Grades Table */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Grades Breakdown</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Grade
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Assessments
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Percentage
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {assessmentsByGrade.map((item, index) => {
                                                const percentage = totalAssessments > 0 ? (item.count / totalAssessments) * 100 : 0;
                                                return (
                                                    <tr key={item.grade_id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className={`w-3 h-3 rounded mr-3 ${getGradeColor(index)}`}></div>
                                                                <span className="text-sm font-medium text-gray-900">
                                                                    {item.grade?.name || `Grade ${item.grade_id}`}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {item.count}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {percentage.toFixed(1)}%
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}