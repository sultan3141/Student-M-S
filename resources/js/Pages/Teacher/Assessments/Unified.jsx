import { useState, useEffect, useRef } from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, router } from '@inertiajs/react';
import {
    PlusIcon,
    FunnelIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    PencilIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

export default function Unified({ grades, academicYear }) {
    // Selection State
    const [selectedGradeId, setSelectedGradeId] = useState('');
    const [selectedSectionId, setSelectedSectionId] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState('');

    // Data State
    const [students, setStudents] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [marks, setMarks] = useState({}); // { studentId: { assessmentId: score } }
    const [subjects, setSubjects] = useState([]);
    const [assessmentTypes, setAssessmentTypes] = useState([]);

    // UI State
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAssessment, setSelectedAssessment] = useState(null);

    // New Assessment Form
    const [newAssessment, setNewAssessment] = useState({
        name: '',
        total_marks: 10,
        assessment_type_id: '',
        description: ''
    });

    // Edit Assessment Form
    const [editAssessment, setEditAssessment] = useState({
        id: null,
        name: '',
        total_marks: 10,
        assessment_type_id: '',
        description: ''
    });

    // Derived
    const selectedGrade = grades.find(g => g.id === parseInt(selectedGradeId));
    const selectedSection = selectedGrade?.sections.find(s => s.id === parseInt(selectedSectionId));

    // --- Effects ---

    // Load subjects when grade changes
    useEffect(() => {
        if (selectedGradeId) {
            axios.get(route('teacher.assessments-simple.subjects-for-class'), {
                params: { grade_id: selectedGradeId }
            }).then(res => setSubjects(res.data.subjects || []));
        } else {
            setSubjects([]);
        }
    }, [selectedGradeId]);

    // Load assessment types when subject changes
    useEffect(() => {
        if (selectedGradeId && selectedSubjectId) {
            axios.get(route('teacher.assessments-simple.types-for-class'), {
                params: { grade_id: selectedGradeId, subject_id: selectedSubjectId }
            }).then(res => setAssessmentTypes(res.data));
        }
    }, [selectedGradeId, selectedSubjectId]);

    // Load MAIN DATA when all filters are set
    useEffect(() => {
        if (selectedGradeId && selectedSectionId && selectedSubjectId) {
            fetchData();
        } else {
            setStudents([]);
            setAssessments([]);
            setMarks({});
        }
    }, [selectedGradeId, selectedSectionId, selectedSubjectId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(route('teacher.assessments.unified-data'), {
                params: {
                    grade_id: selectedGradeId,
                    section_id: selectedSectionId,
                    subject_id: selectedSubjectId
                }
            });
            setStudents(res.data.students);
            setAssessments(res.data.assessments);
            setMarks(res.data.marks); // Expected format: { studentId: { assessmentId: score } }
        } catch (error) {
            console.error(error);
            alert('Failed to load data.');
        } finally {
            setLoading(false);
        }
    };

    // --- Handlers ---

    const handleMarkChange = (studentId, assessmentId, value) => {
        setMarks(prev => ({
            ...prev,
            [studentId]: {
                ...(prev[studentId] || {}),
                [assessmentId]: value
            }
        }));
    };

    const handleSaveMarks = async () => {
        setSaving(true);
        // Transform marks into the format expected by the store/update endpoint
        // For efficiency, we might want a bulk update endpoint, but let's reuse logic if possible.
        // Actually, existing endpoints are a bit fragmented. 
        // Let's us a specific bulk endpoint or loop.
        // Best approach for "Unified": send ALL marks or changed marks to a dedicated endpoint.

        // Since we don't have a dedicated "bulk save all marks for all assessments" endpoint readily available 
        // without custom logic, and I want to keep this simple, let's create a specialized 
        // API call in the next iteration or use what we have.
        // Wait, `TeacherCustomAssessmentController` has `storeMarks` but that is for ONE assessment.
        // `DeclareResult` uses `teacher.declare-result.store`.

        // Let's use a new endpoint or piggyback? 
        // I will implement a quick loop for now as a "Draft" approach, 
        // OR better: Create a "Bulk Save" in `TeacherAssessmentController` in the next step.
        // For now, let's assume we have a route 'teacher.declare-result.store' which takes 'marks'.
        // Its signature: marks: { studentId: { assessmentId: mark } }

        // Let's try reusing `teacher.declare-result.store` since it matches the structure perfectly!

        try {
            await router.post(route('teacher.declare-result.store'), {
                grade_id: selectedGradeId,
                section_id: selectedSectionId,
                subject_id: selectedSubjectId,
                marks: marks,
                is_finalized: false // Just saving draft
            }, {
                preserveScroll: true,
                onSuccess: () => alert('Marks Saved Successfully!')
            });
        } catch (e) {
            alert('Error saving marks.');
        } finally {
            setSaving(false);
        }
    };

    const handleCreateAssessment = async (e) => {
        e.preventDefault();
        
        // Validate selections
        if (!selectedGradeId || !selectedSectionId || !selectedSubjectId) {
            alert('Please select Grade, Section, and Subject first.');
            return;
        }
        
        try {
            const response = await axios.post(route('teacher.assessments.store'), {
                grade_id: selectedGradeId,
                section_id: selectedSectionId,
                subject_id: selectedSubjectId,
                name: newAssessment.name,
                max_score: newAssessment.total_marks,
                assessment_type_id: newAssessment.assessment_type_id || null,
                description: newAssessment.description
            });
            
            console.log('Assessment created:', response.data);
            setShowCreateModal(false);
            setNewAssessment({ name: '', total_marks: 10, assessment_type_id: '', description: '' });
            fetchData(); // Refresh grid
            alert('Assessment created successfully!');
        } catch (e) {
            console.error('Error creating assessment:', e);
            const errorMessage = e.response?.data?.message || e.response?.data?.error || 'Failed to create assessment. Please try again.';
            alert(errorMessage);
        }
    };

    const handleEditClick = (assessment) => {
        setEditAssessment({
            id: assessment.id,
            name: assessment.name,
            total_marks: assessment.max_score,
            assessment_type_id: assessment.assessment_type_id || '',
            description: assessment.description || ''
        });
        setShowEditModal(true);
    };

    const handleUpdateAssessment = async (e) => {
        e.preventDefault();
        try {
            await axios.put(route('teacher.assessments.update', editAssessment.id), {
                name: editAssessment.name,
                max_score: editAssessment.total_marks,
                assessment_type_id: editAssessment.assessment_type_id || null,
                description: editAssessment.description
            });
            setShowEditModal(false);
            fetchData();
            alert('Assessment updated successfully!');
        } catch (e) {
            console.error(e);
            alert('Failed to update assessment.');
        }
    };

    const handleDeleteClick = (assessment) => {
        setSelectedAssessment(assessment);
        setShowDeleteModal(true);
    };

    const handleDeleteAssessment = async () => {
        try {
            await axios.delete(route('teacher.assessments.destroy', selectedAssessment.id));
            setShowDeleteModal(false);
            setSelectedAssessment(null);
            fetchData();
            alert('Assessment deleted successfully!');
        } catch (e) {
            console.error(e);
            alert('Failed to delete assessment.');
        }
    };

    return (
        <TeacherLayout>
            <Head title="Unified Assessment Manager" />

            <div className="h-[calc(100vh-65px)] flex flex-col pt-6 px-4 max-w-[100vw] overflow-hidden">

                {/* --- HEADER & FILTERS --- */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 flex-shrink-0">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                            Assessment <span className="text-blue-600">Manager</span>
                        </h1>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                            {academicYear?.name} • Unified Interface
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="relative group">
                            <select
                                value={selectedGradeId}
                                onChange={e => { setSelectedGradeId(e.target.value); setSelectedSectionId(''); }}
                                className="pl-4 pr-10 py-2.5 bg-gray-50 border border-transparent hover:border-blue-100 rounded-xl text-xs font-black uppercase tracking-wide cursor-pointer focus:ring-0 w-40 transition-all"
                            >
                                <option value="">Grade...</option>
                                {grades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                            </select>
                        </div>

                        <div className="w-px h-8 bg-gray-100"></div>

                        <div className="relative group">
                            <select
                                value={selectedSectionId}
                                onChange={e => setSelectedSectionId(e.target.value)}
                                disabled={!selectedGradeId}
                                className="pl-4 pr-10 py-2.5 bg-gray-50 border border-transparent hover:border-blue-100 rounded-xl text-xs font-black uppercase tracking-wide cursor-pointer focus:ring-0 w-40 transition-all disabled:opacity-50"
                            >
                                <option value="">Section...</option>
                                {selectedGrade?.sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>

                        <div className="w-px h-8 bg-gray-100"></div>

                        <div className="relative group">
                            <select
                                value={selectedSubjectId}
                                onChange={e => setSelectedSubjectId(e.target.value)}
                                disabled={!selectedSectionId}
                                className="pl-4 pr-10 py-2.5 bg-gray-50 border border-transparent hover:border-blue-100 rounded-xl text-xs font-black uppercase tracking-wide cursor-pointer focus:ring-0 w-48 transition-all disabled:opacity-50"
                            >
                                <option value="">Subject...</option>
                                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* --- MAIN CONTENT AREA --- */}
                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <ArrowPathIcon className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                ) : !selectedSubjectId ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl m-4">
                        <FunnelIcon className="w-12 h-12 mb-4 text-gray-300" />
                        <p className="text-sm font-bold uppercase tracking-widest">Select Grade, Section & Subject to Begin</p>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col min-h-0 bg-white rounded-t-3xl border border-gray-200 shadow-xl shadow-gray-100/50 overflow-hidden relative">

                        {/* Toolbar */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-sm z-20">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    {students.length} Students
                                </span>
                                <span className="text-gray-300">•</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    {assessments.length} Assessments
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-gray-200 flex items-center gap-2 transform active:scale-95"
                                >
                                    <PlusIcon className="w-4 h-4" />
                                    New Assessment
                                </button>
                                <button
                                    onClick={handleSaveMarks}
                                    disabled={saving}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-200 flex items-center gap-2 transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {saving ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <CheckCircleIcon className="w-4 h-4" />}
                                    {saving ? 'Saving...' : 'Save All Marks'}
                                </button>
                            </div>
                        </div>

                        {/* DATA GRID */}
                        <div className="flex-1 overflow-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50/50 sticky top-0 z-10 backdrop-blur-md">
                                    <tr>
                                        <th className="sticky left-0 bg-gray-50 z-20 px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-r border-gray-200 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)] w-60">
                                            Student
                                        </th>
                                        {assessments.map(assess => (
                                            <th key={assess.id} className="px-4 py-4 min-w-[160px] border-b border-gray-100 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black text-gray-900 uppercase tracking-tight truncate max-w-[100px]" title={assess.name}>
                                                            {assess.name}
                                                        </span>
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => handleEditClick(assess)}
                                                                className="p-1 hover:bg-blue-100 rounded text-blue-600 transition-colors"
                                                                title="Edit"
                                                            >
                                                                <PencilIcon className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteClick(assess)}
                                                                className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors"
                                                                title="Delete"
                                                            >
                                                                <TrashIcon className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded-md">
                                                        Max: {assess.max_score}
                                                    </span>
                                                </div>
                                            </th>
                                        ))}

                                        {/* Empty filler column */}
                                        <th className="w-full border-b border-gray-100"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {students.map(student => (
                                        <tr key={student.id} className="hover:bg-blue-50/5 transition-colors group">
                                            <td className="sticky left-0 bg-white group-hover:bg-blue-50/20 z-10 px-6 py-3 border-r border-gray-100 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)] transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-500 uppercase">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-gray-900 uppercase">{student.name}</div>
                                                        <div className="text-[9px] font-bold text-gray-400">{student.student_id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            {assessments.map(assess => {
                                                const score = marks[student.id]?.[assess.id] ?? '';
                                                return (
                                                    <td key={assess.id} className="p-2 text-center border-r border-gray-50 last:border-0">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max={assess.max_score}
                                                            step="0.1"
                                                            value={score}
                                                            onChange={e => handleMarkChange(student.id, assess.id, e.target.value)}
                                                            className="w-20 h-9 text-center bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg text-sm font-bold text-gray-900 transition-all placeholder-gray-300"
                                                            placeholder="-"
                                                        />
                                                    </td>
                                                );
                                            })}
                                            <td></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {students.length === 0 && (
                                <div className="p-12 text-center text-gray-400 italic text-sm">
                                    No students found in this section.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* CREATE MODAL */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-6">New Assessment</h2>
                        <form onSubmit={handleCreateAssessment} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newAssessment.name}
                                    onChange={e => setNewAssessment({ ...newAssessment, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl text-sm font-bold"
                                    placeholder="e.g. Unit Test 3"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Max Marks</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={newAssessment.total_marks}
                                        onChange={e => setNewAssessment({ ...newAssessment, total_marks: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl text-sm font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Type</label>
                                    <select
                                        value={newAssessment.assessment_type_id}
                                        onChange={e => setNewAssessment({ ...newAssessment, assessment_type_id: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl text-xs font-bold"
                                    >
                                        <option value="">(None)</option>
                                        {assessmentTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors shadow-lg shadow-blue-200"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-6">Edit Assessment</h2>
                        <form onSubmit={handleUpdateAssessment} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={editAssessment.name}
                                    onChange={e => setEditAssessment({ ...editAssessment, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl text-sm font-bold"
                                    placeholder="e.g. Unit Test 3"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Max Marks</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={editAssessment.total_marks}
                                        onChange={e => setEditAssessment({ ...editAssessment, total_marks: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl text-sm font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Type</label>
                                    <select
                                        value={editAssessment.assessment_type_id}
                                        onChange={e => setEditAssessment({ ...editAssessment, assessment_type_id: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl text-xs font-bold"
                                    >
                                        <option value="">(None)</option>
                                        {assessmentTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors shadow-lg shadow-blue-200"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE MODAL */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-red-100 rounded-xl">
                                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Delete Assessment</h2>
                                <p className="text-sm text-gray-500 mt-1">This action cannot be undone</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete "<span className="font-bold">{selectedAssessment?.name}</span>"? 
                            All associated marks will also be deleted.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAssessment}
                                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors shadow-lg shadow-red-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </TeacherLayout>
    );
}
