import { useState, useEffect } from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, router, Link, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import axios from 'axios';

export default function CreateSimple({ grades, academicYear, currentSemester }) {
    const { errors } = usePage().props;
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const initialGradeId = urlParams.get('grade_id');
    const initialSubjectId = urlParams.get('subject_id');

    const [selectedGradeId, setSelectedGradeId] = useState(initialGradeId || '');
    const [selectedSubjectId, setSelectedSubjectId] = useState(initialSubjectId || '');
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [assessmentTypes, setAssessmentTypes] = useState([]);

    // State for multiple assessments
    const [assessments, setAssessments] = useState([
        { name: '', total_marks: '', assessment_type_id: '', due_date: '', description: '' }
    ]);

    // Load subjects when grade changes
    useEffect(() => {
        if (selectedGradeId) {
            const fetchSubjects = async () => {
                setLoading(true);
                try {
                    const response = await axios.get(route('teacher.assessments-simple.subjects-for-class'), {
                        params: { grade_id: selectedGradeId }
                    });
                    setSubjects(response.data.subjects);
                } catch (error) {
                    console.error('Error fetching subjects:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchSubjects();
        } else {
            setSubjects([]);
            setSelectedSubjectId('');
        }
    }, [selectedGradeId]);

    // Load assessment types when subject changes
    useEffect(() => {
        if (selectedGradeId && selectedSubjectId) {
            const fetchTypes = async () => {
                try {
                    const response = await axios.get(route('teacher.assessments-simple.types-for-class'), {
                        params: {
                            grade_id: selectedGradeId,
                            subject_id: selectedSubjectId
                        }
                    });
                    setAssessmentTypes(response.data);
                } catch (error) {
                    console.error('Error fetching assessment types:', error);
                    setAssessmentTypes([]);
                }
            };
            fetchTypes();
        } else {
            setAssessmentTypes([]);
        }
    }, [selectedGradeId, selectedSubjectId]);

    const addAssessmentRow = () => {
        setAssessments([...assessments, { name: '', total_marks: '', assessment_type_id: '', due_date: '', description: '' }]);
    };

    const removeAssessmentRow = (index) => {
        const newAssessments = assessments.filter((_, i) => i !== index);
        setAssessments(newAssessments);
    };

    const updateAssessmentRow = (index, field, value) => {
        const newAssessments = [...assessments];
        newAssessments[index][field] = value;
        setAssessments(newAssessments);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedGradeId || !selectedSubjectId) {
            alert('Please select a grade and subject.');
            return;
        }

        router.post(route('teacher.assessments-simple.store'), {
            grade_id: selectedGradeId,
            subject_id: selectedSubjectId,
            assessments: assessments
        });
    };

    const selectedGrade = grades.find(g => g.id == selectedGradeId);
    const selectedSubject = subjects.find(s => s.id == selectedSubjectId);

    return (
        <TeacherLayout>
            <Head title="Create Assessment" />

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-10">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                        <Link href={route('teacher.dashboard')} className="hover:text-blue-600 transition-colors">
                            Dashboard
                        </Link>
                        <span className="text-gray-300">/</span>
                        <Link href={route('teacher.assessments-simple.index')} className="hover:text-blue-600 transition-colors">
                            Assessments
                        </Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-gray-900 uppercase">Create</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        NEW <span className="text-blue-600 uppercase">Assessment</span>
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white border border-gray-100 rounded-xl shadow-sm text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        {academicYear?.name} • SEM {currentSemester}
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {/* Class Selection Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8 transition-all hover:shadow-md">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Class Selection</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Grade</label>
                            <div className="relative group">
                                <select
                                    value={selectedGradeId}
                                    onChange={(e) => setSelectedGradeId(e.target.value)}
                                    className="w-full pl-5 pr-12 py-4 bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 rounded-2xl text-xs font-black text-gray-700 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">Select Grade</option>
                                    {grades.map(grade => (
                                        <option key={grade.id} value={grade.id}>{grade.name}</option>
                                    ))}
                                </select>
                                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            {errors.grade_id && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-1 ml-1">{errors.grade_id}</p>}
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Subject</label>
                            <div className="relative group">
                                <select
                                    value={selectedSubjectId}
                                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                                    disabled={!selectedGradeId || loading}
                                    className={`w-full pl-5 pr-12 py-4 bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 rounded-2xl text-xs font-black text-gray-700 transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${errors.subject_id ? 'border-red-500' : ''}`}
                                >
                                    <option value="">{loading ? 'Loading...' : 'Select Subject'}</option>
                                    {subjects.map(subject => (
                                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                                    ))}
                                </select>
                                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            {errors.subject_id && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-1 ml-1">{errors.subject_id}</p>}
                        </div>
                    </div>

                    {selectedGrade && selectedSubject && (
                        <div className="mt-8 flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-widest bg-blue-50/50 px-5 py-3 rounded-2xl border border-blue-100">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            Selected: {selectedGrade.name} • {selectedSubject.name}
                        </div>
                    )}
                </div>

                {/* Assessment Details Form (when selected) */}
                {selectedGradeId && selectedSubjectId && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-lg font-bold text-gray-900">Assessment Details</h2>
                            <button
                                type="button"
                                onClick={addAssessmentRow}
                                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 text-sm bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Add Another
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {assessments.map((assessment, index) => (
                                <div key={index} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
                                    <div className="px-8 py-5 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] font-black text-white">
                                                {index + 1}
                                            </div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">ASSESSMENT DETAIL</span>
                                        </div>
                                        {assessments.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeAssessmentRow(index)}
                                                className="text-[10px] font-black text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest flex items-center gap-1.5"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    <div className="p-10 space-y-10">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                            {/* Type */}
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Assessment Type</label>
                                                <div className="relative group">
                                                    <select
                                                        value={assessment.assessment_type_id || ''}
                                                        onChange={(e) => {
                                                            const typeId = e.target.value;
                                                            updateAssessmentRow(index, 'assessment_type_id', typeId);
                                                            if (typeId) {
                                                                const type = assessmentTypes.find(t => t.id == typeId);
                                                                if (type && !assessment.name) {
                                                                    updateAssessmentRow(index, 'name', type.name);
                                                                }
                                                            }
                                                        }}
                                                        className="w-full pl-5 pr-12 py-4 bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 rounded-2xl text-xs font-black text-gray-700 transition-all appearance-none cursor-pointer"
                                                    >
                                                        <option value="">Custom / No Type</option>
                                                        {assessmentTypes.map(type => (
                                                            <option key={type.id} value={type.id}>
                                                                {type.name} ({type.weight || type.weight_percentage}%)
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>

                                            {/* Name */}
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Assessment Name *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={assessment.name}
                                                    onChange={(e) => updateAssessmentRow(index, 'name', e.target.value)}
                                                    className={`w-full px-5 py-4 bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 rounded-2xl text-xs font-black text-gray-700 transition-all placeholder:text-gray-300 ${errors[`assessments.${index}.name`] ? 'border-red-500' : ''}`}
                                                    placeholder="e.g. Midterm Exam"
                                                />
                                                {errors[`assessments.${index}.name`] && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-1 ml-1">{errors[`assessments.${index}.name`]}</p>}
                                            </div>

                                            {/* Total Marks */}
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Total Marks *</label>
                                                <input
                                                    type="number"
                                                    required
                                                    min="1"
                                                    value={assessment.total_marks}
                                                    onChange={(e) => updateAssessmentRow(index, 'total_marks', e.target.value)}
                                                    className={`w-full px-5 py-4 bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 rounded-2xl text-xs font-black text-gray-700 transition-all placeholder:text-gray-300 ${errors[`assessments.${index}.total_marks`] ? 'border-red-500' : ''}`}
                                                    placeholder="100"
                                                />
                                                {errors[`assessments.${index}.total_marks`] && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-1 ml-1">{errors[`assessments.${index}.total_marks`]}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                            {/* Due Date */}
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Due Date</label>
                                                <input
                                                    type="date"
                                                    value={assessment.due_date}
                                                    onChange={(e) => updateAssessmentRow(index, 'due_date', e.target.value)}
                                                    className={`w-full px-5 py-4 bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 rounded-2xl text-xs font-black text-gray-700 transition-all ${errors[`assessments.${index}.due_date`] ? 'border-red-500' : ''}`}
                                                />
                                                {errors[`assessments.${index}.due_date`] && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-1 ml-1">{errors[`assessments.${index}.due_date`]}</p>}
                                            </div>

                                            {/* Description */}
                                            <div className="md:col-span-2 space-y-3">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Description (Optional)</label>
                                                <input
                                                    type="text"
                                                    value={assessment.description}
                                                    onChange={(e) => updateAssessmentRow(index, 'description', e.target.value)}
                                                    className={`w-full px-5 py-4 bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 rounded-2xl text-xs font-black text-gray-700 transition-all placeholder:text-gray-300 ${errors[`assessments.${index}.description`] ? 'border-red-500' : ''}`}
                                                    placeholder="Short notes about this assessment..."
                                                />
                                                {errors[`assessments.${index}.description`] && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-1 ml-1">{errors[`assessments.${index}.description`]}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {errors.error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {errors.error}
                                </div>
                            )}

                            <div className="flex justify-end gap-5 pt-8">
                                <Link
                                    href={route('teacher.assessments-simple.index')}
                                    className="px-8 py-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 hover:text-gray-600 text-[10px] font-black transition-all border border-gray-100 uppercase tracking-widest"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    className="px-10 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 text-[10px] font-black transition-all shadow-lg shadow-blue-200 uppercase tracking-widest"
                                >
                                    Create Assessment{assessments.length > 1 ? 's' : ''}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Initial State Helper */}
                {!selectedGradeId && (
                    <div className="bg-white rounded-[2rem] border border-gray-100 py-32 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                            <svg className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-wide">Get Started</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] max-w-xs mx-auto">
                            Select a grade and subject above to begin creating assessments.
                        </p>
                    </div>
                )}
            </div>
        </TeacherLayout>
    );
}
