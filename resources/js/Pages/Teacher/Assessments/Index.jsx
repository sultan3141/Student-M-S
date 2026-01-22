import { Head, Link } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import {
    PlusIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    DocumentTextIcon,
    AcademicCapIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

export default function Index({ assessments }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'draft':
                return 'bg-yellow-100 text-yellow-800';
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <TeacherLayout>
            <Head title="My Assessments" />

            {/* Header */}
            <div className="bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] shadow-lg mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                                📝 My Assessments
                            </h1>
                            <p className="text-blue-100 text-lg">
                                Create and manage your custom assessments
                            </p>
                        </div>
                        <Link href={route('teacher.custom-assessments.create')}>
                            <PrimaryButton className="bg-white text-blue-600 hover:bg-blue-50">
                                <PlusIcon className="w-5 h-5 mr-2" />
                                Create Assessment
                            </PrimaryButton>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Assessments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assessments.map((assessment) => (
                    <div key={assessment.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                        {assessment.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {assessment.subject_name} • {assessment.section_name}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(assessment.status)}`}>
                                    {assessment.status}
                                </span>
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                                <span className="flex items-center">
                                    <AcademicCapIcon className="w-4 h-4 mr-1" />
                                    Semester {assessment.semester}
                                </span>
                                <span className="flex items-center">
                                    <DocumentTextIcon className="w-4 h-4 mr-1" />
                                    {assessment.components_count} Components
                                </span>
                            </div>
                        </div>

                        {/* Assessment Components Preview */}
                        <div className="p-4 bg-gray-50">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Components:</h4>
                            <div className="space-y-1">
                                {assessment.components.slice(0, 3).map((component, index) => (
                                    <div key={index} className="flex justify-between text-xs text-gray-600">
                                        <span>{component.name}</span>
                                        <span>{component.max_weight}%</span>
                                    </div>
                                ))}
                                {assessment.components.length > 3 && (
                                    <div className="text-xs text-gray-500">
                                        +{assessment.components.length - 3} more...
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="p-4 border-t border-gray-200">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <div className="text-lg font-bold text-blue-600">{assessment.students_count}</div>
                                    <div className="text-xs text-gray-500">Students</div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-green-600">{assessment.completion_rate}%</div>
                                    <div className="text-xs text-gray-500">Complete</div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <Link 
                                    href={route('teacher.custom-assessments.show', assessment.id)}
                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                    <EyeIcon className="w-4 h-4 mr-1" />
                                    View Details
                                </Link>
                                
                                <div className="flex items-center space-x-2">
                                    <Link 
                                        href={route('teacher.custom-assessments.enter-marks', assessment.id)}
                                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                    >
                                        <ChartBarIcon className="w-4 h-4 mr-1" />
                                        Enter Marks
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {assessments.length === 0 && (
                <div className="text-center py-12">
                    <DocumentTextIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments yet</h3>
                    <p className="text-gray-500 mb-6">Create your first assessment to start managing student marks.</p>
                    <Link href={route('teacher.custom-assessments.create')}>
                        <PrimaryButton>
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Create Your First Assessment
                        </PrimaryButton>
                    </Link>
                </div>
            )}
        </TeacherLayout>
    );
}
