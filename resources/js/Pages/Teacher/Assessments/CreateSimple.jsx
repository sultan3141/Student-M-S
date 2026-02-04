import { useState, useEffect } from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import axios from 'axios';

export default function CreateSimple({ grades, academicYear }) {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const initialGradeId = urlParams.get('grade_id');
    const initialSubjectId = urlParams.get('subject_id');

    const [step, setStep] = useState(initialGradeId && initialSubjectId ? 3 : 1);
    const [selectedGrade, setSelectedGrade] = useState(() => {
        if (initialGradeId) {
            return grades.find(g => g.id === parseInt(initialGradeId)) || null;
        }
        return null;
    });
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);

    // State for multiple assessments
    const [assessments, setAssessments] = useState([
        { name: '', total_marks: '', assessment_type_id: '' }
    ]);
    const [assessmentTypes, setAssessmentTypes] = useState([]);
    const [formData, setFormData] = useState({
        grade_id: initialGradeId || '',
        subject_id: initialSubjectId || '',
    });

    // Auto-load subjects and assessment types if URL parameters are provided
    useEffect(() => {
        const initializeFromParams = async () => {
            if (initialGradeId && initialSubjectId && selectedGrade) {
                setLoading(true);
                try {
                    // Fetch subjects for the grade
                    const subjectsResponse = await axios.get(route('teacher.assessments-simple.subjects-for-class'), {
                        params: { grade_id: initialGradeId }
                    });
                    setSubjects(subjectsResponse.data.subjects);

                    // Fetch assessment types for the subject
                    const typesResponse = await axios.get(route('teacher.assessments-simple.types-for-class'), {
                        params: {
                            grade_id: initialGradeId,
                            subject_id: initialSubjectId
                        }
                    });
                    setAssessmentTypes(typesResponse.data);
                } catch (error) {
                    console.error('Error loading data from URL params:', error);
                    setAssessmentTypes([]);
                } finally {
                    setLoading(false);
                }
            }
        };

        initializeFromParams();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Step 1: Select Grade
    const handleGradeSelect = async (grade) => {
        setSelectedGrade(grade);
        setFormData(prev => ({ ...prev, grade_id: grade.id }));

        // Fetch subjects
        setLoading(true);
        try {
            const response = await axios.get(route('teacher.assessments-simple.subjects-for-class'), {
                params: {
                    grade_id: grade.id,
                }
            });
            setSubjects(response.data.subjects);
            setStep(2);
        } catch (error) {
            console.error('Error fetching subjects:', error);
            alert('Failed to load subjects. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Select Subject
    const handleSubjectSelect = async (subjectId) => {
        setFormData(prev => ({ ...prev, subject_id: subjectId }));

        // Fetch assessment types for this class
        setLoading(true);
        try {
            const response = await axios.get(route('teacher.assessments-simple.types-for-class'), {
                params: {
                    grade_id: selectedGrade.id,
                    subject_id: subjectId
                }
            });
            setAssessmentTypes(response.data);
            setStep(3);
        } catch (error) {
            console.error('Error fetching assessment types:', error);
            // Continue even if types fail to load
            setAssessmentTypes([]);
            setStep(3);
        } finally {
            setLoading(false);
        }
    };

    // Add new assessment row
    const addAssessmentRow = () => {
        setAssessments([...assessments, { name: '', total_marks: '', assessment_type_id: '' }]);
    };

    // Remove assessment row
    const removeAssessmentRow = (index) => {
        const newAssessments = assessments.filter((_, i) => i !== index);
        setAssessments(newAssessments);
    };

    // Update assessment row
    const updateAssessmentRow = (index, field, value) => {
        const newAssessments = [...assessments];
        newAssessments[index][field] = value;
        setAssessments(newAssessments);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('teacher.assessments-simple.store'), {
            ...formData,
            assessments: assessments
        });
    };

    const handleBack = () => {
        if (step === 3) {
            setStep(2);
            setFormData(prev => ({ ...prev, subject_id: '' }));
        } else if (step === 2) {
            setStep(1);
            setSubjects([]);
            setSelectedGrade(null);
            setFormData(prev => ({ ...prev, grade_id: '' }));
        }
    };

    const getStepTitle = () => {
        switch (step) {
            case 1: return 'Select Grade';
            case 2: return 'Select Subject';
            case 3: return 'Assessment Details';
            default: return '';
        }
    };

    return (
        <TeacherLayout>
            <Head title="Create Assessment" />

            {/* Header */}
            <div className="bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] shadow-lg mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Create Assessment
                            </h1>
                            <p className="text-blue-100">
                                Step {step} of 3: {getStepTitle()}
                            </p>
                        </div>
                        {step > 1 && (
                            <button
                                onClick={handleBack}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                            >
                                ← Back
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {/* Step 1: Grade Selection */}
                {step === 1 && (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Select a Grade</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {grades && grades.length > 0 ? (
                                grades.map((grade) => (
                                    <button
                                        key={grade.id}
                                        onClick={() => handleGradeSelect(grade)}
                                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-left border-2 border-transparent hover:border-blue-500 group"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {grade.name}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Level {grade.level}
                                        </p>
                                    </button>
                                ))
                            ) : (
                                <div className="col-span-full bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                                    <p className="text-yellow-800">
                                        No grades available.
                                    </p>
                                </div>
                            )}
                        </div>
                        <p className="mt-4 text-sm text-gray-500 italic">
                            Note: This will create an assessment for ALL sections you teach in the selected grade.
                        </p>
                    </div>
                )}

                {/* Step 2: Subject Selection */}
                {step === 2 && !loading && (
                    <div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <p className="text-blue-900">
                                <span className="font-semibold">Selected Grade:</span> {selectedGrade?.name}
                            </p>
                        </div>

                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Select a Subject</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {subjects && subjects.length > 0 ? (
                                subjects.map((subject) => (
                                    <button
                                        key={subject.id}
                                        onClick={() => handleSubjectSelect(subject.id)}
                                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-left border-2 border-transparent hover:border-green-500"
                                    >
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                            {subject.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Code: <span className="font-mono">{subject.code}</span>
                                        </p>
                                    </button>
                                ))
                            ) : (
                                <div className="col-span-full bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                                    <p className="text-yellow-800">
                                        No subjects available for this grade.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600">Loading subjects...</p>
                    </div>
                )}

                {/* Step 3: Assessment Entry Form */}
                {step === 3 && (
                    <div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-blue-900">
                                        <span className="font-semibold">Grade:</span> {selectedGrade?.name}
                                    </p>
                                    <p className="text-blue-900 mt-1">
                                        <span className="font-semibold">Subject:</span> {subjects.find(s => s.id === formData.subject_id)?.name}
                                    </p>
                                </div>
                                <div className="bg-blue-100 px-3 py-1 rounded-full">
                                    <span className="text-xs text-blue-800 font-medium">Applied to all sections</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Assessments</h2>
                                <button
                                    type="button"
                                    onClick={addAssessmentRow}
                                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Add Another
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {assessments.map((assessment, index) => (
                                    <div key={index} className="p-6 bg-gray-50 rounded-xl border border-gray-200 relative">
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => removeAssessmentRow(index)}
                                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Assessment Type (Optional)
                                                </label>
                                                <select
                                                    value={assessment.assessment_type_id || ''}
                                                    onChange={(e) => {
                                                        const typeId = e.target.value;
                                                        updateAssessmentRow(index, 'assessment_type_id', typeId);

                                                        // Auto-fill name if type is selected and name is empty or matches another type
                                                        if (typeId) {
                                                            const type = assessmentTypes.find(t => t.id == typeId);
                                                            if (type && (!assessment.name || assessmentTypes.some(t => t.name === assessment.name))) {
                                                                updateAssessmentRow(index, 'name', type.name);
                                                            }
                                                        }
                                                    }}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="">-- Custom / No Type --</option>
                                                    {assessmentTypes.map(type => (
                                                        <option key={type.id} value={type.id}>
                                                            {type.name} ({type.weight || type.weight_percentage}%)
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Assessment Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={assessment.name}
                                                    onChange={(e) => updateAssessmentRow(index, 'name', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="e.g., Midterm Exam"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Total Marks *
                                                </label>
                                                <input
                                                    type="number"
                                                    required
                                                    min="1"
                                                    value={assessment.total_marks}
                                                    onChange={(e) => updateAssessmentRow(index, 'total_marks', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="e.g., 100"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <PrimaryButton type="submit">
                                        Create {assessments.length} Assessment{assessments.length > 1 ? 's' : ''}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </TeacherLayout>
    );
}
