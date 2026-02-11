import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    ExclamationTriangleIcon,
    PlusIcon,
    ClipboardDocumentCheckIcon,
    AcademicCapIcon,
    UserGroupIcon,
    CheckCircleIcon,
    ArrowPathIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

const classNames = (...classes) => classes.filter(Boolean).join(' ');

export default function DeclareResult({
    grades = [],
    currentSemester = 1,
    initialStep = 1,
    initialGradeId = null,
    initialSectionId = null,
    initialSubjectId = null,
    initialStudentId = null,
    initialShowClosed = false
}) {
    const [step, setStep] = useState(initialStep);
    const [loading, setLoading] = useState(false);

    // Selection State
    const [selectedGrade, setSelectedGrade] = useState(() => {
        if (!initialGradeId || !grades) return null;
        return grades.find(g => g.id === parseInt(initialGradeId)) || null;
    });
    const [selectedSection, setSelectedSection] = useState(() => {
        if (!grades) return null;
        const grade = grades.find(g => g.id === parseInt(initialGradeId));
        return grade?.sections?.find(s => s.id === parseInt(initialSectionId)) || null;
    });
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [fetchedStudents, setFetchedStudents] = useState([]);
    const [fetchedAssessments, setFetchedAssessments] = useState([]);
    const [semesterStatuses, setSemesterStatuses] = useState({});
    const [showClosed, setShowClosed] = useState(initialShowClosed);
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const [savedMarks, setSavedMarks] = useState({});

    // Form Data
    const { data, setData, post, processing, errors } = useForm({
        grade_id: initialGradeId || '',
        section_id: initialSectionId || '',
        subject_id: initialSubjectId || '',
        semester: currentSemester || 1,
        student_ids: initialStudentId ? [parseInt(initialStudentId)] : [],
        marks: {}, // Structure: { studentId: { assessmentId: mark } }
        is_finalized: false
    });

    // --- Initialization Logic ---
    useEffect(() => {
        if (initialGradeId && initialSectionId) {
            const grade = grades.find(g => g.id === parseInt(initialGradeId));
            if (grade) {
                const section = grade.sections?.find(s => s.id === parseInt(initialSectionId));
                if (section) {
                    setSelectedGrade(grade);
                    setSelectedSection(section);
                    setData(d => ({ ...d, grade_id: grade.id, section_id: section.id }));
                    fetchStudents(grade.id, section.id);
                    fetchSubjects(grade.id, section.id);
                }
            }
        }

        if (initialStep == 3 && initialSubjectId) {
            // Special case for direct deep links to mark entry
            // This is handled in the fetch logic below if initial params exist
        }
    }, []);

    // --- Data Fetching ---
    const fetchStudents = async (gradeId, sectionId) => {
        setLoading(true);
        try {
            const response = await fetch(`/teacher/declare-result/students?grade_id=${gradeId}&section_id=${sectionId}`);
            const data = await response.json();
            setFetchedStudents(data);
            setSelectedStudentIds(data.map(s => s.id));
            return data;
        } catch (error) {
            console.error('Error fetching students:', error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const fetchSubjects = async (gradeId, sectionId) => {
        try {
            const response = await fetch(`/teacher/declare-result/subjects?grade_id=${gradeId}&section_id=${sectionId}`);
            const data = await response.json();
            setSubjects(data);
            return data;
        } catch (error) {
            console.error('Error fetching subjects:', error);
            return [];
        }
    };

    const fetchAssessments = async (subjectId) => {
        setLoading(true);
        try {
            const response = await fetch(`/teacher/declare-result/assessments?grade_id=${selectedGrade.id}&section_id=${selectedSection.id}&subject_id=${subjectId}&show_closed=${showClosed ? 1 : 0}`);
            const assessmentsData = await response.json();
            setFetchedAssessments(assessmentsData);

            // Check semester locking status
            const uniqueSemesters = [...new Set(assessmentsData.map(a => a.semester))];
            const statusMap = {};
            for (const sem of uniqueSemesters) {
                if (!sem) continue;
                try {
                    const statusRes = await fetch(`/teacher/declare-result/check-status?grade_id=${selectedGrade.id}&semester=${sem}`);
                    const statusJson = await statusRes.json();
                    statusMap[sem] = statusJson.is_open;
                } catch (e) {
                    statusMap[sem] = true;
                }
            }
            setSemesterStatuses(statusMap);

            // Fetch existing marks
            if (selectedStudentIds.length > 0) {
                const marksRes = await fetch(`/teacher/declare-result/existing-marks?grade_id=${selectedGrade.id}&section_id=${selectedSection.id}&subject_id=${subjectId}&student_ids=${selectedStudentIds.join(',')}`);
                const existingMarks = await marksRes.json();
                if (existingMarks && Object.keys(existingMarks).length > 0) {
                    setData('marks', existingMarks);
                    setSavedMarks(existingMarks);
                } else {
                    setData('marks', {});
                    setSavedMarks({});
                }
            }
        } catch (error) {
            console.error('Error fetching assessments:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- Action Handlers ---
    const handleStudentsConfirmed = () => {
        if (selectedStudentIds.length === 0) {
            alert('Please select at least one student.');
            return;
        }
        setData('student_ids', selectedStudentIds);
        setStep(2);
    };

    const handleSubjectSelect = async (subject) => {
        setSelectedSubject(subject);
        setData('subject_id', subject.id);
        await fetchAssessments(subject.id);
        setStep(3);
    };

    const handleMarkChange = (studentId, assessmentId, value) => {
        const assessment = fetchedAssessments.find(a => a.id === assessmentId);
        const maxScore = assessment?.total_marks || 100;

        let numericValue = value === '' ? '' : parseFloat(value);
        if (numericValue !== '' && numericValue > maxScore) numericValue = maxScore;
        if (numericValue !== '' && numericValue < 0) numericValue = 0;

        setData('marks', {
            ...data.marks,
            [studentId]: {
                ...(data.marks[studentId] || {}),
                [assessmentId]: numericValue
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('teacher.declare-result.store'), {
            onSuccess: () => {
                setSavedMarks(data.marks);
                alert('Results saved successfully.');
            },
            preserveScroll: true
        });
    };

    const getStepTitle = () => {
        switch (step) {
            case 1: return "Enrollment Verification";
            case 2: return "Subject Binding";
            case 3: return "Data Entry";
            default: return "";
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    return (
        <TeacherLayout>
            <Head title="Declare Result | Teacher Portal" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 min-h-screen">
                {/* Minimalist Professional Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        <Link href={route('teacher.dashboard')} className="hover:text-blue-600 transition-colors">Dashboard</Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-gray-900 border-b border-gray-100 uppercase tracking-tighter">Declare Result</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight uppercase">
                                Result <span className="text-blue-600">Declaration</span>
                            </h1>
                            <p className="mt-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                {selectedSection ? `Phase 0${step} &bull; ${getStepTitle()}` : 'Identify Cohort to Begin'}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {step > 1 && (
                                <button
                                    onClick={handleBack}
                                    className="px-6 py-3 bg-white border border-gray-100 text-gray-400 rounded-xl hover:text-blue-600 text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm"
                                >
                                    &larr; Go Back
                                </button>
                            )}
                            <div className="px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 italic">
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                Semester {currentSemester}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Visualizer - Minimal Size */}
                <div className="flex items-center justify-between gap-1 mb-4 max-w-2xl mx-auto">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-1 flex-1">
                            <div className={classNames(
                                "flex items-center gap-1.5 px-2 py-1.5 rounded-md border transition-all duration-300 w-full",
                                step === s ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-700" :
                                    step > s ? "bg-gradient-to-r from-green-500 to-emerald-500 border-green-600" : "bg-white border-gray-300"
                            )}>
                                <div className={classNames(
                                    "w-5 h-5 rounded flex items-center justify-center text-[10px] font-black flex-shrink-0",
                                    step >= s ? "bg-white text-blue-600" : "bg-gray-200 text-gray-500"
                                )}>
                                    {step > s ? "✓" : `0${s}`}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className={classNames(
                                        "text-[7px] font-bold uppercase tracking-wide leading-none",
                                        step >= s ? "text-blue-100" : "text-gray-500"
                                    )}>Step {s}</span>
                                    <span className={classNames(
                                        "text-[9px] font-black uppercase tracking-tight truncate leading-none mt-0.5",
                                        step >= s ? "text-white" : "text-gray-700"
                                    )}>
                                        {s === 1 ? "Students" : s === 2 ? "Subject" : "Marks"}
                                    </span>
                                </div>
                            </div>
                            {s < 3 && <ChevronRightIcon className={classNames(
                                "w-3 h-3 flex-shrink-0",
                                step > s ? "text-green-500" : step === s ? "text-blue-500" : "text-gray-300"
                            )} />}
                        </div>
                    ))}
                </div>

                {/* Class Configuration Card */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        Class Configuration
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Grade Selection */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Grade Level</label>
                            <select
                                value={selectedGrade?.id || ''}
                                onChange={(e) => {
                                    const grade = grades.find(g => g.id === parseInt(e.target.value));
                                    setSelectedGrade(grade);
                                    setSelectedSection(null);
                                    setSubjects([]);
                                    setSelectedSubject(null);
                                    setStep(1);
                                }}
                                className="w-full text-sm font-bold text-gray-700 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 focus:border-blue-500 focus:ring-0 cursor-pointer"
                            >
                                <option value="">Select Grade</option>
                                {grades.map(grade => (
                                    <option key={grade.id} value={grade.id}>{grade.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Section Selection */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Section</label>
                            <select
                                value={selectedSection?.id || ''}
                                onChange={(e) => {
                                    const section = selectedGrade?.sections?.find(s => s.id === parseInt(e.target.value));
                                    setSelectedSection(section);
                                    if (selectedGrade && section) {
                                        fetchStudents(selectedGrade.id, section.id);
                                        fetchSubjects(selectedGrade.id, section.id);
                                    }
                                    setStep(1);
                                }}
                                disabled={!selectedGrade}
                                className="w-full text-sm font-bold text-gray-700 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 focus:border-blue-500 focus:ring-0 disabled:opacity-50 cursor-pointer"
                            >
                                <option value="">Select Section</option>
                                {selectedGrade?.sections?.map(section => (
                                    <option key={section.id} value={section.id}>{section.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Subject Selection */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subject</label>
                            <select
                                value={selectedSubject?.id || ''}
                                onChange={(e) => {
                                    const subject = subjects.find(s => s.id === parseInt(e.target.value));
                                    handleSubjectSelect(subject);
                                }}
                                disabled={!selectedSection || subjects.length === 0}
                                className="w-full text-sm font-bold text-gray-700 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 focus:border-blue-500 focus:ring-0 disabled:opacity-50 cursor-pointer"
                            >
                                <option value="">Select Subject</option>
                                {subjects.map(subject => (
                                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Reset Button */}
                        <div className="flex items-end">
                            <button
                                onClick={() => window.location.href = route('teacher.declare-result.index')}
                                className="w-full py-2.5 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-gray-100 transition-colors"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- Step 1: Student Selection --- */}
                {selectedSection && step === 1 && (
                    <div className="bg-white rounded-[2rem] border border-gray-100 p-10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
                            <div>
                                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 italic">Phase 01: Enrollment</h2>
                                <h3 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Verify <span className="text-blue-600">Students</span></h3>
                                <div className="mt-3 flex items-center gap-3">
                                    <span className="px-4 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-[9px] font-bold text-gray-400 uppercase tracking-widest italic">{selectedGrade?.name}</span>
                                    <span className="px-4 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-[9px] font-bold text-gray-400 uppercase tracking-widest italic">Section {selectedSection?.name}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedStudentIds(fetchedStudents.map(s => s.id))}
                                    className="px-5 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest"
                                >
                                    Select All
                                </button>
                                <button
                                    onClick={() => setSelectedStudentIds([])}
                                    className="px-5 py-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 hover:text-gray-600 transition-all text-[10px] font-bold uppercase tracking-widest"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        <div className="overflow-hidden border border-gray-100 rounded-3xl">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-8 py-5 text-left text-[9px] font-bold text-gray-400 uppercase tracking-widest">Include</th>
                                        <th className="px-8 py-5 text-left text-[9px] font-bold text-gray-400 uppercase tracking-widest">Student Core Identity</th>
                                        <th className="px-8 py-5 text-left text-[9px] font-bold text-gray-400 uppercase tracking-widest">Universal ID</th>
                                        <th className="px-8 py-5 text-left text-[9px] font-bold text-gray-400 uppercase tracking-widest">Gender</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-50">
                                    {fetchedStudents.map(student => (
                                        <tr key={student.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-8 py-5">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStudentIds.includes(student.id)}
                                                    onChange={() => {
                                                        if (selectedStudentIds.includes(student.id)) setSelectedStudentIds(selectedStudentIds.filter(id => id !== student.id));
                                                        else setSelectedStudentIds([...selectedStudentIds, student.id]);
                                                    }}
                                                    className="w-5 h-5 text-blue-600 border-gray-200 rounded-lg focus:ring-blue-500/20 transition-all cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center font-bold text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all uppercase text-xs">
                                                        {student.user?.name?.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900 uppercase tracking-tight">{student.user?.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap text-[11px] font-bold text-gray-500 uppercase tracking-widest">{student.student_id}</td>
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <span className="px-3 py-1 bg-gray-50 rounded-lg text-[9px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-600 transition-colors italic border border-gray-100/50">
                                                    {student.gender}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-10 flex justify-end">
                            <button
                                onClick={handleStudentsConfirmed}
                                className="px-10 py-5 bg-blue-600 text-white rounded-[1.25rem] hover:bg-blue-700 text-[11px] font-bold uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-200 flex items-center gap-3 group"
                            >
                                Continue To Subject Binding
                                <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                )}

                {/* --- Step 2: Subject Selection --- */}
                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-10 text-center lg:text-left">
                            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 italic">Phase 02: Binding</h2>
                            <h3 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Select <span className="text-blue-600">Assigned Subject</span></h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">{selectedStudentIds.length} Students Selected for Deployment</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {subjects.map(subject => (
                                <button
                                    key={subject.id}
                                    onClick={() => handleSubjectSelect(subject)}
                                    className="group relative p-8 rounded-[2rem] bg-white border border-gray-100 transition-all duration-300 hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-50 hover:-translate-y-1 overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRightIcon className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                                        <AcademicCapIcon className="w-6 h-6 text-gray-400 group-hover:text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight mb-2 group-hover:text-blue-600 transition-colors">
                                        {subject.name}
                                    </h3>
                                    <span className="px-3 py-1 bg-gray-50 rounded-lg text-[9px] font-bold text-gray-400 uppercase tracking-widest italic group-hover:bg-blue-50 group-hover:text-blue-600/60 transition-colors">
                                        {subject.code}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- Step 3: Marks Entry --- */}
                {step === 3 && (
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-10 border-b border-gray-50 bg-gray-50/20">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                <div>
                                    <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 italic">Phase 03: Data Entry</h2>
                                    <h3 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Bulk Marks <span className="text-blue-600">Sync</span></h3>
                                    <div className="mt-4 flex flex-wrap gap-3">
                                        <span className="px-4 py-1.5 bg-white border border-gray-100 rounded-xl text-[9px] font-bold text-blue-600 uppercase tracking-widest italic shadow-sm">{selectedSubject?.name}</span>
                                        <span className="px-4 py-1.5 bg-white border border-gray-100 rounded-xl text-[9px] font-bold text-gray-400 uppercase tracking-widest italic shadow-sm">{selectedGrade?.name} &bull; Section {selectedSection?.name}</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-white border border-gray-100 rounded-2xl flex items-center gap-6 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                            <UserGroupIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none">Cohort</p>
                                            <p className="text-[11px] font-black text-gray-900 uppercase">{selectedStudentIds.length} Enrolled</p>
                                        </div>
                                    </div>
                                    <div className="w-px h-8 bg-gray-100"></div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                            <ClipboardDocumentCheckIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none">Activities</p>
                                            <p className="text-[11px] font-black text-gray-900 uppercase">{fetchedAssessments.length} Tasks</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {fetchedAssessments.length === 0 ? (
                            <div className="p-24 text-center">
                                <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-[2rem] flex items-center justify-center mx-auto mb-8 animate-bounce">
                                    <ExclamationTriangleIcon className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 uppercase tracking-tight mb-2">No Assessments Found</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] max-w-xs mx-auto mb-10 leading-loose">
                                    Target subject requires configured assessment schemes before mark injection is possible.
                                </p>
                                <Link
                                    href={route('teacher.assessments-simple.create', {
                                        grade_id: selectedGrade?.id,
                                        subject_id: selectedSubject?.id,
                                        section_id: selectedSection?.id
                                    })}
                                    className="inline-flex items-center px-8 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-gray-100"
                                >
                                    <PlusIcon className="w-4 h-4 mr-2" />
                                    Configure Assessment Structure
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="overflow-x-auto custom-scrollbar">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest sticky left-0 bg-white/80 backdrop-blur-md z-10 border-r border-gray-100">Student Identity</th>
                                                {fetchedAssessments.map(assessment => (
                                                    <th key={assessment.id} className="px-8 py-6 min-w-[180px]">
                                                        <div className="flex flex-col gap-1.5">
                                                            <span className="text-[11px] font-black text-gray-900 uppercase tracking-tight truncate">{assessment.name}</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[8px] font-black uppercase tracking-widest border border-blue-100/50">Max: {assessment.total_marks || assessment.max_score}</span>
                                                                {semesterStatuses[assessment.semester] === false && (
                                                                    <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-[8px] font-black uppercase tracking-widest italic animate-pulse">LOCKED</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </th>
                                                ))}
                                                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic text-right bg-white/80 backdrop-blur-md sticky right-0 z-10 border-l border-gray-100">Synthesis</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {fetchedStudents.filter(s => selectedStudentIds.includes(s.id)).map(student => (
                                                <tr key={student.id} className="hover:bg-blue-50/10 transition-colors group">
                                                    <td className="px-10 py-6 sticky left-0 bg-white z-10 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.02)] border-r border-gray-50 group-hover:bg-blue-50/30 transition-colors">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center font-bold text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all uppercase text-xs">
                                                                {student.user?.name?.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-gray-900 uppercase tracking-tight text-sm leading-none mb-1">{student.user?.name}</div>
                                                                <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-none">{student.student_id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    {fetchedAssessments.map(assessment => {
                                                        const isLocked = semesterStatuses[assessment.semester] === false;
                                                        const isSaved = savedMarks[student.id]?.[assessment.id] !== undefined;

                                                        return (
                                                            <td key={assessment.id} className="px-8 py-6">
                                                                <div className="relative max-w-[120px]">
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        max={assessment.total_marks || assessment.max_score}
                                                                        step="0.5"
                                                                        value={data.marks[student.id]?.[assessment.id] || ''}
                                                                        onChange={(e) => handleMarkChange(student.id, assessment.id, e.target.value)}
                                                                        className={classNames(
                                                                            "w-full h-12 px-4 rounded-xl font-bold text-sm tracking-tight transition-all text-center",
                                                                            isLocked || isSaved ? "bg-gray-50 text-gray-300 border-gray-100 border italic cursor-not-allowed" :
                                                                                "bg-white border border-gray-100 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 text-gray-900 placeholder-gray-100"
                                                                        )}
                                                                        placeholder="0.0"
                                                                        disabled={isLocked || isSaved}
                                                                    />
                                                                    {isSaved && (
                                                                        <div className="absolute -right-2 top-1/2 -translate-y-1/2">
                                                                            <CheckCircleIcon className="w-5 h-5 text-emerald-500 bg-white rounded-full p-0.5" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        );
                                                    })}
                                                    <td className="px-10 py-6 text-right bg-white group-hover:bg-blue-50/30 sticky right-0 z-10 border-l border-gray-100 transition-colors">
                                                        {(() => {
                                                            const studentMarks = data.marks[student.id] || {};
                                                            const totalObtained = fetchedAssessments.reduce((sum, assessment) => sum + (Number(studentMarks[assessment.id]) || 0), 0);
                                                            const totalMax = fetchedAssessments.reduce((sum, assessment) => sum + (Number(assessment.total_marks || assessment.max_score) || 0), 0);
                                                            const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
                                                            return (
                                                                <div className="flex flex-col items-end">
                                                                    <span className="text-base font-black text-gray-900 tracking-tighter leading-none mb-1">
                                                                        {totalObtained} <span className="text-[10px] text-gray-300 font-bold uppercase ml-0.5 italic">/ {totalMax}</span>
                                                                    </span>
                                                                    <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                                                                        <div
                                                                            className={classNames(
                                                                                "h-full rounded-full transition-all duration-500",
                                                                                percentage > 75 ? "bg-emerald-500" : percentage > 40 ? "bg-blue-500" : "bg-red-500"
                                                                            )}
                                                                            style={{ width: `${percentage}%` }}
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="p-10 bg-gray-50/50 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-10">
                                    <div className="flex-1 max-w-xl">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
                                                <ExclamationTriangleIcon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">Integrity Validation</h4>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed tracking-wider italic">
                                                    Ensure all student scores are entered correctly. Submitting values will commit them to the academic ledger for review.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="px-8 py-4 bg-white border border-gray-100 text-gray-400 hover:text-blue-600 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm"
                                        >
                                            &larr; Subjects
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-10 py-5 bg-blue-600 text-white rounded-[1.25rem] hover:bg-blue-700 disabled:opacity-50 text-[11px] font-bold uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-200 flex items-center gap-3 group"
                                        >
                                            {processing ? (
                                                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <ClipboardDocumentCheckIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            )}
                                            Commit Marks To Ledger
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </TeacherLayout>
    );
}
