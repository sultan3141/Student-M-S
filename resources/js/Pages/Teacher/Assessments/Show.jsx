import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import {
    DocumentTextIcon,
    ChartBarIcon,
    UserGroupIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    PencilIcon,
    ArrowDownTrayIcon,
    EyeIcon
} from '@heroicons/react/24/outline';

export default function Show({ assessment, students }) {
    const [selectedTab, setSelectedTab] = useState('overview');

    // Calculate statistics
    const getStatistics = () => {
        const completed = students.filter(s => s.status === 'completed').length;
        const pending = students.filter(s => s.status === 'pending').length;
        const totalScore = students
            .filter(s => s.total_score !== null)
            .reduce((sum, s) => sum + s.total_score, 0);
        const averageScore = completed > 0 ? totalScore / completed : 0;
        const highPerformers = students.filter(s => s.total_score >= 80).length;
        const lowPerformers = students.filter(s => s.total_score < 60 && s.total_score !== null).length;

        return {
            completed,
            pending,
            total: students.length,
            averageScore: averageScore.toFixed(1),
            highPerformers,
            lowPerformers,
            completionRate: students.length > 0 ? ((completed / students.length) * 100).toFixed(1) : 0
        };
    };

    const stats = getStatistics();

    // Get component statistics
    const getComponentStats = () => {
        return assessment.components.map(component => {
            const scores = students
                .filter(s => s.component_scores[component.id] !== undefined)
                .map(s => parseFloat(s.component_scores[component.id]) || 0);
            
            const average = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
            const max = scores.length > 0 ? Math.max(...scores) : 0;
            const min = scores.length > 0 ? Math.min(...scores) : 0;

            return {
                ...component,
                average: average.toFixed(1),
                max,
                min,
                completed: scores.length
            };
        });
    };

    const componentStats = getComponentStats();

    const tabs = [
        { id: 'overview', name: 'Overview', icon: ChartBarIcon },
        { id: 'students', name: 'Student Scores', icon: UserGroupIcon },
        { id: 'components', name: 'Component Analysis', icon: DocumentTextIcon },
    ];

    return (
        <TeacherLayout>
            <Head title={`${assessment.name} - Details`} />

            {/* Header */}
            <div className="bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] shadow-lg mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                                📊 {assessment.name}
                            </h1>
                            <p className="text-blue-100 text-lg">
                                {assessment.subject_name} • {assessment.section_name} • Semester {assessment.semester}
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Link href={route('teacher.custom-assessments.enter-marks', assessment.id)}>
                                <PrimaryButton className="bg-white text-blue-600 hover:bg-blue-50">
                                    <PencilIcon className="w-5 h-5 mr-2" />
                                    Enter/Edit Marks
                                </PrimaryButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                    <div className="text-sm text-gray-600">Total Students</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                    <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-purple-600">{stats.averageScore}%</div>
                    <div className="text-sm text-gray-600">Average Score</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-emerald-600">{stats.highPerformers}</div>
                    <div className="text-sm text-gray-600">High Performers</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-red-600">{stats.lowPerformers}</div>
                    <div className="text-sm text-gray-600">Need Support</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6" aria-label="Tabs">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setSelectedTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                        selectedTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <Icon className="w-5 h-5 inline mr-2" />
                                    {tab.name}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-6">
                    {/* Overview Tab */}
                    {selectedTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Assessment Components */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Structure</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {assessment.components.map((component) => (
                                        <div key={component.id} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                            <h4 className="font-semibold text-blue-900">{component.name}</h4>
                                            <p className="text-blue-700 text-lg font-bold">{component.max_weight}%</p>
                                            {component.description && (
                                                <p className="text-blue-600 text-sm mt-1">{component.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Progress Chart */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Progress</h3>
                                <div className="bg-gray-200 rounded-full h-4 mb-2">
                                    <div
                                        className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                                        style={{ width: `${stats.completionRate}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-gray-600 text-center">
                                    {stats.completionRate}% Complete ({stats.completed} of {stats.total} students)
                                </p>
                            </div>

                            {/* Score Distribution */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                                        <div className="text-2xl font-bold text-green-600">
                                            {students.filter(s => s.total_score >= 90).length}
                                        </div>
                                        <div className="text-sm text-green-700">Excellent (90-100)</div>
                                    </div>
                                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {students.filter(s => s.total_score >= 80 && s.total_score < 90).length}
                                        </div>
                                        <div className="text-sm text-blue-700">Good (80-89)</div>
                                    </div>
                                    <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                        <div className="text-2xl font-bold text-yellow-600">
                                            {students.filter(s => s.total_score >= 60 && s.total_score < 80).length}
                                        </div>
                                        <div className="text-sm text-yellow-700">Satisfactory (60-79)</div>
                                    </div>
                                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                                        <div className="text-2xl font-bold text-red-600">
                                            {students.filter(s => s.total_score < 60 && s.total_score !== null).length}
                                        </div>
                                        <div className="text-sm text-red-700">Needs Support (&lt;60)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Students Tab */}
                    {selectedTab === 'students' && (
                        <div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Student
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total Score
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {students.map((student) => (
                                            <tr key={student.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {student.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            ID: {student.student_id}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    {student.total_score !== null ? (
                                                        <span className={`text-lg font-bold ${
                                                            student.total_score >= 80 ? 'text-green-600' :
                                                            student.total_score >= 60 ? 'text-blue-600' :
                                                            student.total_score >= 40 ? 'text-yellow-600' : 'text-red-600'
                                                        }`}>
                                                            {student.total_score.toFixed(1)}%
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    {student.status === 'completed' ? (
                                                        <CheckCircleIcon className="w-6 h-6 text-green-500 mx-auto" />
                                                    ) : (
                                                        <ClockIcon className="w-6 h-6 text-yellow-500 mx-auto" />
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                        <EyeIcon className="w-4 h-4 inline mr-1" />
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Components Tab */}
                    {selectedTab === 'components' && (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {componentStats.map((component) => (
                                    <div key={component.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-lg font-semibold text-gray-900">{component.name}</h4>
                                            <span className="text-sm font-medium text-blue-600">{component.max_weight}% Weight</span>
                                        </div>
                                        
                                        <div className="grid grid-cols-3 gap-4 mb-4">
                                            <div className="text-center">
                                                <div className="text-xl font-bold text-green-600">{component.average}%</div>
                                                <div className="text-xs text-gray-600">Average</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-xl font-bold text-blue-600">{component.max}%</div>
                                                <div className="text-xs text-gray-600">Highest</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-xl font-bold text-red-600">{component.min}%</div>
                                                <div className="text-xs text-gray-600">Lowest</div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-200 rounded-full h-2 mb-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${(component.completed / students.length) * 100}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-600 text-center">
                                            {component.completed} of {students.length} students completed
                                        </p>

                                        {component.description && (
                                            <p className="text-sm text-gray-600 mt-3 italic">{component.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </TeacherLayout>
    );
}