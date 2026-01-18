import { useState, useEffect } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    CalendarIcon,
    ChartBarIcon,
    CheckCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

export default function SubjectAssessmentSelector({
    sectionId,
    gradeName,
    sectionName,
    semester,
    onSemesterChange,
    onBack
}) {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingAssessments, setLoadingAssessments] = useState(false);

    useEffect(() => {
        fetchSubjects();
    }, [sectionId]);

    useEffect(() => {
        if (selectedSubject) {
            fetchAssessments();
        }
    }, [selectedSubject, semester]);

    const fetchSubjects = async () => {
        try {
            const response = await axios.get(`/teacher/marks/wizard/subjects/${sectionId}`);
            setSubjects(response.data);
            if (response.data.length > 0) {
                setSelectedSubject(response.data[0]);
            }
        } catch (error) {
            console.error('Error fetching subjects:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAssessments = async () => {
        if (!selectedSubject) return;

        setLoadingAssessments(true);
        try {
            const response = await axios.get(
                `/teacher/marks/wizard/assessments/${selectedSubject.id}/${semester}`
            );
            setAssessments(response.data);
        } catch (error) {
            console.error('Error fetching assessments:', error);
        } finally {
            setLoadingAssessments(false);
        }
    };

    const handleAssessmentSelect = (assessment) => {
        // Navigate to mark entry page
        router.visit(`/teacher/marks/enter?assessment_id=${assessment.id}`);
    };

    const getWeightColor = (weight) => {
        if (weight >= 40) return 'bg-red-100 text-red-700 border-red-300';
        if (weight >= 25) return 'bg-amber-100 text-amber-700 border-amber-300';
        return 'bg-blue-100 text-blue-700 border-blue-300';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
                >
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back to Sections
                </button>

                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    📝 Select Subject & Assessment
                </h2>
                <p className="text-gray-600">
                    {gradeName} - {sectionName}
                </p>
            </div>

            {/* Subject Selection */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Subject Selection
                </h3>
                <select
                    value={selectedSubject?.id || ''}
                    onChange={(e) => {
                        const subject = subjects.find(s => s.id === parseInt(e.target.value));
                        setSelectedSubject(subject);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    {subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>
                            {subject.name} ({subject.code})
                        </option>
                    ))}
                </select>
            </div>

            {/* Semester Toggle */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Semester
                </h3>
                <div className="flex space-x-4">
                    <button
                        onClick={() => onSemesterChange(1)}
                        className={`
                            flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200
                            ${semester === 1
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                        `}
                    >
                        Semester 1
                    </button>
                    <button
                        onClick={() => onSemesterChange(2)}
                        className={`
                            flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200
                            ${semester === 2
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                        `}
                    >
                        Semester 2
                    </button>
                </div>
            </div>

            {/* Assessment Type Cards */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Assessment Types
                </h3>

                {loadingAssessments ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {assessments.map(assessment => {
                            const isComplete = assessment.status === 'complete';
                            const progressPercentage = (assessment.marks_entered / assessment.total_students) * 100;

                            return (
                                <button
                                    key={assessment.id}
                                    onClick={() => handleAssessmentSelect(assessment)}
                                    className={`
                                        group relative bg-white border-2 rounded-xl p-5 text-left
                                        transition-all duration-300 hover:shadow-xl hover:scale-105
                                        ${isComplete
                                            ? 'border-green-400 bg-green-50'
                                            : 'border-gray-200 hover:border-blue-400'
                                        }
                                    `}
                                >
                                    {/* Assessment Name */}
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                                        {assessment.type}
                                    </h4>

                                    {/* Weight Badge */}
                                    <div className={`
                                        inline-flex items-center px-3 py-1 rounded-full text-sm font-bold mb-3
                                        border ${getWeightColor(assessment.weight)}
                                    `}>
                                        <ChartBarIcon className="w-4 h-4 mr-1" />
                                        {assessment.weight}% Weight
                                    </div>

                                    {/* Due Date */}
                                    <div className="flex items-center text-sm text-gray-600 mb-3">
                                        <CalendarIcon className="w-4 h-4 mr-2" />
                                        {assessment.due_date || 'No deadline'}
                                    </div>

                                    {/* Progress */}
                                    <div className="mb-2">
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span className="text-gray-600">Progress</span>
                                            <span className="font-semibold text-gray-900">
                                                {assessment.marks_entered}/{assessment.total_students}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-blue-500'
                                                    }`}
                                                style={{ width: `${progressPercentage}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Status Indicator */}
                                    <div className={`
                                        flex items-center space-x-2 mt-4 p-2 rounded-lg
                                        ${isComplete ? 'bg-green-100' : 'bg-gray-100'}
                                    `}>
                                        {isComplete ? (
                                            <>
                                                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                                                <span className="text-sm font-semibold text-green-700">
                                                    Completed
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <ClockIcon className="w-5 h-5 text-gray-600" />
                                                <span className="text-sm font-semibold text-gray-700">
                                                    {assessment.marks_entered === 0 ? 'Enter Marks' : 'Continue'}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {/* Hover Effect */}
                                    <div className="absolute inset-0 rounded-xl bg-blue-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                                </button>
                            );
                        })}
                    </div>
                )}

                {!loadingAssessments && assessments.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-lg mb-2">
                            No assessments found for {selectedSubject?.name} - Semester {semester}
                        </p>
                        <p className="text-gray-400 text-sm">
                            Please create an assessment first.
                        </p>
                    </div>
                )}
            </div>

            {/* Progress Indicators Legend */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Legend:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-600" />
                        <span className="text-gray-600">Completed - All marks entered</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <ClockIcon className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-600">Pending - Some or no marks entered</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
