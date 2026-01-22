import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import {
    DocumentTextIcon,
    CalculatorIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    UserIcon,
    AcademicCapIcon,
    ChartBarIcon,
    SparklesIcon,
    TrophyIcon
} from '@heroicons/react/24/outline';

export default function EnterMarks({ assessment, students }) {
    const [studentMarks, setStudentMarks] = useState({});
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

    const { data, setData, post, processing, errors } = useForm({
        marks: [],
    });

    // Initialize student marks
    useEffect(() => {
        const initialMarks = {};
        students.forEach(student => {
            initialMarks[student.id] = {
                student_id: student.id,
                component_scores: assessment.components.reduce((acc, component) => {
                    acc[component.id] = student.component_scores[component.id] || '';
                    return acc;
                }, {}),
                total_score: student.total_score || 0,
            };
        });
        setStudentMarks(initialMarks);
    }, [students, assessment.components]);

    // Calculate total score for a student
    const calculateTotalScore = (studentId) => {
        const studentData = studentMarks[studentId];
        if (!studentData) return 0;

        let total = 0;
        assessment.components.forEach(component => {
            const score = parseFloat(studentData.component_scores[component.id]) || 0;
            const weightedScore = (score * component.max_weight) / 100;
            total += weightedScore;
        });

        return Math.round(total * 100) / 100;
    };

    // Update component score
    const updateComponentScore = (studentId, componentId, score) => {
        const newMarks = { ...studentMarks };
        if (!newMarks[studentId]) {
            newMarks[studentId] = {
                student_id: studentId,
                component_scores: {},
                total_score: 0,
            };
        }

        newMarks[studentId].component_scores[componentId] = score;
        newMarks[studentId].total_score = calculateTotalScore(studentId);
        
        setStudentMarks(newMarks);
    };

    // Validate component score
    const isValidScore = (score) => {
        const numScore = parseFloat(score);
        return !isNaN(numScore) && numScore >= 0 && numScore <= 100;
    };

    // Get validation status for student
    const getStudentStatus = (studentId) => {
        const studentData = studentMarks[studentId];
        if (!studentData) return 'incomplete';

        let hasAllScores = true;
        let hasValidScores = true;

        assessment.components.forEach(component => {
            const score = studentData.component_scores[component.id];
            if (!score || score === '') {
                hasAllScores = false;
            } else if (!isValidScore(score)) {
                hasValidScores = false;
            }
        });

        if (!hasAllScores) return 'incomplete';
        if (!hasValidScores) return 'invalid';
        return 'complete';
    };

    // Get score color based on value
    const getScoreColor = (score) => {
        if (score >= 90) return 'text-emerald-600 bg-emerald-50';
        if (score >= 80) return 'text-blue-600 bg-blue-50';
        if (score >= 70) return 'text-yellow-600 bg-yellow-50';
        if (score >= 60) return 'text-orange-600 bg-orange-50';
        return 'text-red-600 bg-red-50';
    };

    // Submit marks
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const marksArray = Object.values(studentMarks).map(mark => ({
            ...mark,
            total_score: calculateTotalScore(mark.student_id),
        }));

        setData('marks', marksArray);
        
        post(route('teacher.custom-assessments.store-marks', assessment.id));
    };

    // Get completion stats
    const getCompletionStats = () => {
        let complete = 0;
        let incomplete = 0;
        let invalid = 0;

        students.forEach(student => {
            const status = getStudentStatus(student.id);
            if (status === 'complete') complete++;
            else if (status === 'invalid') invalid++;
            else incomplete++;
        });

        return { complete, incomplete, invalid, total: students.length };
    };

    const stats = getCompletionStats();

    return (
        <TeacherLayout>
            <Head title={`Enter Marks - ${assessment.name}`} />

            {/* Beautiful Header with Gradient */}
            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 shadow-2xl mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>
                
                <div className="relative max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                <ChartBarIcon className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                                    📊 Enter Student Marks
                                </h1>
                                <p className="text-indigo-100 text-lg">
                                    {assessment.name} • {assessment.subject_name} • {assessment.section_name}
                                </p>
                            </div>
                        </div>
                        
                        {/* View Toggle */}
                        <div className="hidden md:flex bg-white/20 backdrop-blur-sm rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('cards')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    viewMode === 'cards' 
                                        ? 'bg-white text-indigo-600 shadow-lg' 
                                        : 'text-white hover:bg-white/20'
                                }`}
                            >
                                Card View
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    viewMode === 'table' 
                                        ? 'bg-white text-indigo-600 shadow-lg' 
                                        : 'text-white hover:bg-white/20'
                                }`}
                            >
                                Table View
                            </button>
                        </div>
                    </div>
                    
                    {/* Enhanced Progress Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
                            <div className="flex items-center justify-center mb-2">
                                <CheckCircleIcon className="w-6 h-6 text-emerald-300 mr-2" />
                                <div className="text-3xl font-bold text-white">{stats.complete}</div>
                            </div>
                            <div className="text-indigo-100 text-sm font-medium">Complete</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
                            <div className="flex items-center justify-center mb-2">
                                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-300 mr-2" />
                                <div className="text-3xl font-bold text-white">{stats.incomplete}</div>
                            </div>
                            <div className="text-indigo-100 text-sm font-medium">Incomplete</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
                            <div className="flex items-center justify-center mb-2">
                                <ExclamationTriangleIcon className="w-6 h-6 text-red-300 mr-2" />
                                <div className="text-3xl font-bold text-white">{stats.invalid}</div>
                            </div>
                            <div className="text-indigo-100 text-sm font-medium">Invalid</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
                            <div className="flex items-center justify-center mb-2">
                                <UserIcon className="w-6 h-6 text-blue-300 mr-2" />
                                <div className="text-3xl font-bold text-white">{stats.total}</div>
                            </div>
                            <div className="text-indigo-100 text-sm font-medium">Total Students</div>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Assessment Components Overview */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <DocumentTextIcon className="w-5 h-5 mr-2 text-blue-600" />
                            Assessment Components
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {assessment.components.map((component) => (
                                <div key={component.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-blue-900">{component.name}</h4>
                                        <span className="text-2xl font-bold text-blue-600">{component.max_weight}%</span>
                                    </div>
                                    {component.description && (
                                        <p className="text-blue-700 text-sm">{component.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Marks Entry - Card View */}
                {viewMode === 'cards' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {students.map((student) => {
                            const status = getStudentStatus(student.id);
                            const totalScore = calculateTotalScore(student.id);
                            
                            return (
                                <div key={student.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                                    {/* Student Header */}
                                    <div className={`px-6 py-4 ${
                                        status === 'complete' ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-200' :
                                        status === 'invalid' ? 'bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-200' :
                                        'bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200'
                                    }`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{student.name}</h3>
                                                    <p className="text-sm text-gray-600">ID: {student.student_id}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-2xl font-bold px-3 py-1 rounded-lg ${getScoreColor(totalScore)}`}>
                                                    {totalScore.toFixed(1)}%
                                                </div>
                                                {status === 'complete' && <CheckCircleIcon className="w-6 h-6 text-emerald-500 mx-auto mt-1" />}
                                                {status === 'invalid' && <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mx-auto mt-1" />}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Component Scores */}
                                    <div className="p-6 space-y-4">
                                        {assessment.components.map((component) => (
                                            <div key={component.id} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm font-medium text-gray-700">
                                                        {component.name}
                                                    </label>
                                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                        {component.max_weight}%
                                                    </span>
                                                </div>
                                                <div className="relative">
                                                    <TextInput
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        step="0.1"
                                                        value={studentMarks[student.id]?.component_scores[component.id] || ''}
                                                        onChange={(e) => updateComponentScore(student.id, component.id, e.target.value)}
                                                        className="w-full text-center text-lg font-semibold border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                                                        placeholder="0-100"
                                                    />
                                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                                                        /100
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Marks Entry - Table View */}
                {viewMode === 'table' && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                            Student
                                        </th>
                                        {assessment.components.map((component) => (
                                            <th key={component.id} className="px-4 py-4 text-center text-sm font-semibold text-gray-900 border-b border-gray-200">
                                                <div>{component.name}</div>
                                                <div className="text-xs text-blue-600 font-normal">({component.max_weight}%)</div>
                                            </th>
                                        ))}
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 border-b border-gray-200">
                                            Total Score
                                        </th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 border-b border-gray-200">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {students.map((student) => {
                                        const status = getStudentStatus(student.id);
                                        const totalScore = calculateTotalScore(student.id);
                                        
                                        return (
                                            <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                                            {student.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">{student.name}</div>
                                                            <div className="text-sm text-gray-500">ID: {student.student_id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                
                                                {assessment.components.map((component) => (
                                                    <td key={component.id} className="px-4 py-4 text-center">
                                                        <TextInput
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            step="0.1"
                                                            value={studentMarks[student.id]?.component_scores[component.id] || ''}
                                                            onChange={(e) => updateComponentScore(student.id, component.id, e.target.value)}
                                                            className="w-20 text-center border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
                                                            placeholder="0-100"
                                                        />
                                                    </td>
                                                ))}
                                                
                                                <td className="px-6 py-4 text-center">
                                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-bold ${getScoreColor(totalScore)}`}>
                                                        {totalScore.toFixed(1)}%
                                                    </div>
                                                </td>
                                                
                                                <td className="px-6 py-4 text-center">
                                                    {status === 'complete' && (
                                                        <CheckCircleIcon className="w-6 h-6 text-emerald-500 mx-auto" />
                                                    )}
                                                    {status === 'invalid' && (
                                                        <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mx-auto" />
                                                    )}
                                                    {status === 'incomplete' && (
                                                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full mx-auto"></div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <InputError message={errors.marks} className="mt-2" />

                {/* Enhanced Submit Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <SecondaryButton 
                                type="button" 
                                onClick={() => window.history.back()}
                                className="px-6 py-3"
                            >
                                Cancel
                            </SecondaryButton>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                            <div className="text-right">
                                <div className="text-sm text-gray-600">Progress</div>
                                <div className="text-lg font-semibold text-gray-900">
                                    {stats.complete} of {stats.total} students complete
                                </div>
                                <div className="w-48 bg-gray-200 rounded-full h-2 mt-1">
                                    <div 
                                        className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${(stats.complete / stats.total) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                            
                            <PrimaryButton 
                                type="submit" 
                                disabled={processing || stats.complete === 0}
                                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg font-semibold shadow-lg"
                            >
                                {processing ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Saving...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <SparklesIcon className="w-5 h-5 mr-2" />
                                        Save All Marks
                                    </div>
                                )}
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </form>
        </TeacherLayout>
    );
}