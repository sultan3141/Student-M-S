import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    ExclamationTriangleIcon,
    PlusIcon,
    ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';

export default function DeclareResult({ grades, currentSemester = 1, initialStep = 1, initialGradeId = null, initialSectionId = null, initialSubjectId = null, initialStudentId = null, initialShowClosed = false }) {
    console.log('DeclareResult Props:', { initialStep, initialGradeId, initialSectionId, initialSubjectId });

    const [step, setStep] = useState(initialStep);
    const [loading, setLoading] = useState(false);

    // Selection State
    const [selectedGrade, setSelectedGrade] = useState(() => {
        if (!initialGradeId) return null;
        return grades.find(g => g.id === parseInt(initialGradeId)) || null;
    });
    const [selectedSection, setSelectedSection] = useState(() => {
        const grade = grades.find(g => g.id === parseInt(initialGradeId));
        return grade?.sections?.find(s => s.id === parseInt(initialSectionId)) || null;
    });
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [fetchedStudents, setFetchedStudents] = useState([]);
    const [fetchedAssessments, setFetchedAssessments] = useState([]);
    const [semesterStatuses, setSemesterStatuses] = useState({}); // { semester: isOpen }
    const [showClosed, setShowClosed] = useState(initialShowClosed);

    // Form Data
    const { data, setData, post, processing, errors } = useForm({
        grade_id: initialGradeId || '',
        section_id: initialSectionId || '',
        subject_id: initialSubjectId || '',
        semester: currentSemester || 1,
        student_ids: initialStudentId ? [parseInt(initialStudentId)] : [],
        marks: {}, // Structure: { studentId: { assessmentId: mark } }
    });

    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const [savedMarks, setSavedMarks] = useState({});

    useEffect(() => {
        // Handle grade and section selection from sidebar/URL
        if (initialGradeId && initialSectionId) {
            const grade = grades.find(g => g.id === parseInt(initialGradeId));
            if (grade) {
                const section = grade.sections?.find(s => s.id === parseInt(initialSectionId));
                if (section) {
                    setSelectedGrade(grade);
                    setSelectedSection(section);
                    setData(d => ({
                        ...d,
                        grade_id: grade.id,
                        section_id: section.id
                    }));
                    fetchStudents(grade.id, section.id);
                    fetchSubjects(grade.id, section.id);
                    // Start at Step 1: Select Students
                    setStep(1);
                }
            }
        }

        const initializeStep3 = async () => {
            if (initialStep == 3 && initialGradeId && initialSectionId && initialSubjectId) {
                const grade = grades.find(g => g.id === parseInt(initialGradeId));
                const section = grade?.sections?.find(s => s.id === parseInt(initialSectionId));

                if (grade && section) {
                    setSelectedGrade(grade);
                    setSelectedSection(section);
                    const studentsData = await fetchStudents(initialGradeId, initialSectionId);
                    const subjectsData = await fetchSubjects(initialGradeId, initialSectionId);
                    const subject = subjectsData.find(s => s.id === parseInt(initialSubjectId));
                    if (subject) setSelectedSubject(subject);
                    await fetchAssessments(initialGradeId, initialSectionId, initialSubjectId, studentsData, initialShowClosed);
                    setStep(3);
                }
            }
        };

        initializeStep3();
    }, []);

    // --- Step 1: Student Selection Logic ---

    const fetchStudents = async (gradeId, sectionId) => {
        setLoading(true);
        try {
            const response = await fetch(`/teacher/declare-result/students?grade_id=${gradeId}&section_id=${sectionId}`);
            const data = await response.json();
            setFetchedStudents(data);
            // Default select all? Or none? User prompt implies selection.
        } catch (error) {
            console.error(error);
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
            console.error(error);
            return [];
        }
    };

    const fetchAssessments = async (gradeId, sectionId, subjectId, studentsList = null, isShowClosed = showClosed) => {
        setLoading(true);
        try {
            const response = await fetch(`/teacher/declare-result/assessments?grade_id=${gradeId}&section_id=${sectionId}&subject_id=${subjectId}&show_closed=${isShowClosed ? 1 : 0}`);
            const assessmentsData = await response.json();
            setFetchedAssessments(assessmentsData);

            // Fetch status for relevant semesters
            const uniqueSemesters = [...new Set(assessmentsData.map(a => a.semester))];
            const statusMap = {};

            for (const sem of uniqueSemesters) {
                if (!sem) continue;
                try {
                    const statusRes = await fetch(`/teacher/declare-result/check-status?grade_id=${gradeId}&semester=${sem}`);
                    const statusJson = await statusRes.json();
                    statusMap[sem] = statusJson.is_open;
                } catch (e) {
                    console.error("Failed to check status for sem " + sem, e);
                    statusMap[sem] = true; // Default open on error? Or closed to be safe? Open avoids blocking if API fails.
                }
            }
            setSemesterStatuses(statusMap); // Need to add this state

            // Set the selected subject and students
            const studentsToUse = studentsList || fetchedStudents;
            if (studentsToUse.length > 0) {
                const idsToSelect = (initialStep === 5 && initialStudentId)
                    ? [parseInt(initialStudentId)]
                    : studentsToUse.map(s => s.id);

                setSelectedStudentIds(idsToSelect);
                setData('student_ids', idsToSelect);

                // Fetch existing marks
                const marksResponse = await fetch(`/teacher/declare-result/existing-marks?grade_id=${gradeId}&section_id=${sectionId}&subject_id=${subjectId}&student_ids=${idsToSelect.join(',')}`);
                const existingMarks = await marksResponse.json();

                if (existingMarks && Object.keys(existingMarks).length > 0) {
                    setData('marks', existingMarks);
                    setSavedMarks(existingMarks);
                }
            }

            // More robust subject selection
            const findAndSetSubject = () => {
                const subject = (subjects.length > 0 ? subjects : (studentsList ? [] : subjects)).find(s => s.id === parseInt(subjectId));
                if (subject) {
                    setSelectedSubject(subject);
                    return true;
                }
                return false;
            };

            if (!findAndSetSubject()) {
                setTimeout(findAndSetSubject, 200);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // --- Step 3: Student Selection ---
    const toggleStudent = (studentId) => {
        setSelectedStudentIds(prev => {
            if (prev.includes(studentId)) {
                return prev.filter(id => id !== studentId);
            } else {
                return [...prev, studentId];
            }
        });
    };

    const toggleAllStudents = () => {
        if (selectedStudentIds.length === fetchedStudents.length) {
            setSelectedStudentIds([]);
        } else {
            setSelectedStudentIds(fetchedStudents.map(s => s.id));
        }
    };

    const handleStudentsConfirmed = async () => {
        if (selectedStudentIds.length === 0) {
            alert('Please select at least one student.');
            return;
        }
        
        // Directly fetch assessments and go to step 2 (marks entry)
        setLoading(true);
        try {
            const response = await fetch(`/teacher/declare-result/assessments?grade_id=${selectedGrade.id}&section_id=${selectedSection.id}&subject_id=${selectedSubject.id}&show_closed=${showClosed ? 1 : 0}`);
            const assessmentsData = await response.json();
            setFetchedAssessments(assessmentsData);

            // Fetch existing marks for selected students
            const marksResponse = await fetch(`/teacher/declare-result/existing-marks?grade_id=${selectedGrade.id}&section_id=${selectedSection.id}&subject_id=${selectedSubject.id}&student_ids=${selectedStudentIds.join(',')}`);
            const existingMarks = await marksResponse.json();

            if (existingMarks && Object.keys(existingMarks).length > 0) {
                setData('marks', existingMarks);
                setSavedMarks(existingMarks);
            } else {
                setSavedMarks({});
            }

            setStep(2); // Go directly to step 2 (marks entry)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // --- Step 2: Subject Selection ---
    const handleSubjectSelect = async (subject) => {
        setSelectedSubject(subject);
        setData('subject_id', subject.id);

        // Fetch Assessments
        setLoading(true);
        try {
            const response = await fetch(`/teacher/declare-result/assessments?grade_id=${selectedGrade.id}&section_id=${selectedSection.id}&subject_id=${subject.id}&show_closed=${showClosed ? 1 : 0}`);
            const assessmentsData = await response.json();
            setFetchedAssessments(assessmentsData);

            // Fetch existing marks for selected students
            const marksResponse = await fetch(`/teacher/declare-result/existing-marks?grade_id=${selectedGrade.id}&section_id=${selectedSection.id}&subject_id=${subject.id}&student_ids=${selectedStudentIds.join(',')}`);
            const existingMarks = await marksResponse.json();

            // Pre-fill marks if they exist
            if (existingMarks && Object.keys(existingMarks).length > 0) {
                setData('marks', existingMarks);
                setSavedMarks(existingMarks);
            } else {
                setSavedMarks({});
            }

            setStep(3);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // --- Step 3: Marks Entry ---
    const handleMarkChange = (studentId, assessmentId, value) => {
        // Validation: Check Max Mark
        const assessment = fetchedAssessments.find(a => a.id === assessmentId);
        const maxScore = assessment ? (assessment.total_marks || assessment.max_score || 0) : 100;

        if (assessment && Number(value) > maxScore) {
            // Optional: Clamp or show UI hint
        }

        setData('marks', {
            ...data.marks,
            [studentId]: {
                ...(data.marks[studentId] || {}),
                [assessmentId]: value
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Pass the additional fields as part of the post data
        post(route('teacher.declare-result.store'), {
            onSuccess: () => {
                setSavedMarks(data.marks);
            },
            // Note: In Inertia useForm, the data is already tracked. 
            // If we need extra fields not in useForm, we should use transform() or setData.
            // But here we can just update the data before posting if they are missing.
        });
    };

    const getStepTitle = () => {
        switch (step) {
            case 1: return "Select Students";
            case 2: return "Enter Marks";
            default: return "";
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    return (
        <TeacherLayout>
            <Head title="Declare Result" />

            {/* Professional Header */}
            <div className="bg-white border-b border-gray-200 mb-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                Declare Result
                            </h1>
                            <p className="text-sm text-gray-600">
                                {selectedSection && selectedSubject ? `Step ${step} of 2: ${getStepTitle()}` : 'Select grade, section, and subject to begin'}
                            </p>
                        </div>
                        {step > 1 && (
                            <button
                                onClick={handleBack}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium border border-gray-300"
                            >
                                ← Back
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">

                {/* Clean Selection Dashboard */}
                <div className="bg-white rounded-lg border border-gray-200 mb-6">
                    {/* Header */}
                    <div className="border-b border-gray-200 px-6 py-4">
                        <h2 className="text-lg font-semibold text-gray-900">Class Selection</h2>
                        <p className="text-sm text-gray-600 mt-1">Select grade, section, and subject to view students</p>
                    </div>

                    {/* Selection Form */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Grade Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Grade
                                </label>
                                <select
                                    value={selectedGrade?.id || ''}
                                    onChange={(e) => {
                                        const gradeId = parseInt(e.target.value);
                                        const grade = grades.find(g => g.id === gradeId);
                                        setSelectedGrade(grade || null);
                                        setSelectedSection(null);
                                        setSelectedSubject(null);
                                        setFetchedStudents([]);
                                        setSubjects([]);
                                        setData('grade_id', gradeId);
                                        setData('section_id', '');
                                        setData('subject_id', '');
                                        setStep(1);
                                    }}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                >
                                    <option value="">Select Grade</option>
                                    {grades.map(grade => (
                                        <option key={grade.id} value={grade.id}>
                                            {grade.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Section Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Section
                                </label>
                                <select
                                    value={selectedSection?.id || ''}
                                    onChange={(e) => {
                                        const sectionId = parseInt(e.target.value);
                                        const section = selectedGrade?.sections?.find(s => s.id === sectionId);
                                        setSelectedSection(section || null);
                                        setSelectedSubject(null);
                                        setData('section_id', sectionId);
                                        setData('subject_id', '');
                                        
                                        if (section && selectedGrade) {
                                            fetchStudents(selectedGrade.id, sectionId);
                                            fetchSubjects(selectedGrade.id, sectionId);
                                            setStep(1);
                                        }
                                    }}
                                    disabled={!selectedGrade}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
                                >
                                    <option value="">Select Section</option>
                                    {selectedGrade?.sections?.map(section => (
                                        <option key={section.id} value={section.id}>
                                            Section {section.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Subject Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject
                                </label>
                                <select
                                    value={selectedSubject?.id || ''}
                                    onChange={(e) => {
                                        const subjectId = parseInt(e.target.value);
                                        const subject = subjects.find(s => s.id === subjectId);
                                        setSelectedSubject(subject || null);
                                        setData('subject_id', subjectId);
                                        
                                        if (subject && selectedGrade && selectedSection) {
                                            // Move to step 2 (subject selection complete, ready for student selection)
                                            setStep(1);
                                        }
                                    }}
                                    disabled={!selectedSection || subjects.length === 0}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
                                >
                                    <option value="">Select Subject</option>
                                    {subjects.map(subject => (
                                        <option key={subject.id} value={subject.id}>
                                            {subject.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Selected Info */}
                        {selectedGrade && selectedSection && selectedSubject && (
                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-900">
                                    <span className="font-medium">Selected:</span> {selectedGrade.name} - Section {selectedSection.name} - {selectedSubject.name}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Clean Empty State */}
                {!selectedSection && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                        <div className="w-16 h-16 bg-gray-200 text-gray-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <ClipboardDocumentCheckIcon className="w-10 h-10" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Class Selected</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Please select a grade, section, and subject above to view students and begin entering marks.
                        </p>
                    </div>
                )}

                {/* Show message when section is selected but no subject */}
                {selectedSection && !selectedSubject && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 text-center">
                        <div className="w-14 h-14 bg-amber-200 text-amber-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 mb-2">Select a Subject</h3>
                        <p className="text-sm text-gray-600">
                            Please select a subject from the dropdown above to continue.
                        </p>
                    </div>
                )}

                {/* Step 1: Student Selection */}
                {selectedSection && selectedSubject && step === 1 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-[#1E293B]">
                        <div className="mb-8 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Select Students</h2>
                                <p className="text-gray-500 font-medium">{selectedGrade?.name} - Section {selectedSection?.name}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setSelectedStudentIds(fetchedStudents.map(s => s.id))}
                                    className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg transition-colors"
                                >
                                    Select All
                                </button>
                                <button
                                    onClick={() => setSelectedStudentIds([])}
                                    className="text-sm font-bold text-gray-600 hover:text-gray-700 bg-gray-50 px-4 py-2 rounded-lg transition-colors"
                                >
                                    Clear Selection
                                </button>
                            </div>
                        </div>
                        <div className="overflow-hidden border border-gray-200 rounded-xl">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-16">Select</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID Number</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Gender</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {fetchedStudents.map(student => (
                                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStudentIds.includes(student.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) setSelectedStudentIds([...selectedStudentIds, student.id]);
                                                        else setSelectedStudentIds(selectedStudentIds.filter(id => id !== student.id));
                                                    }}
                                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{student.user?.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{student.student_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap capitalize text-sm font-medium text-gray-600">{student.gender}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleStudentsConfirmed}
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-base font-bold transition-colors shadow-lg shadow-blue-200"
                            >
                                Continue ({selectedStudentIds.length})
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Marks Entry */}
                {step === 2 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">Enter Marks</h2>
                                    <p className="text-gray-500 font-medium">Results for {selectedSubject?.name}</p>
                                </div>
                                <div className="flex flex-wrap gap-6 text-sm">
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Grade & Section</span>
                                        <span className="text-gray-900 font-bold">{selectedGrade?.name} - {selectedSection?.name}</span>
                                    </div>
                                    <div className="h-10 w-px bg-gray-200 hidden md:block"></div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Academic Year</span>
                                        <span className="text-gray-900 font-bold">2025/26</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {fetchedAssessments.length === 0 ? (
                            <div className="p-16 text-center">
                                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ClipboardDocumentCheckIcon className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">No Assessments Found</h3>
                                <p className="text-gray-500 mb-6 max-w-sm mx-auto">You need to create assessments for this subject before you can enter marks.</p>
                                <button
                                    onClick={() => {
                                        const url = `/teacher/assessments-simple/create?grade_id=${selectedGrade?.id}&subject_id=${selectedSubject?.id}&section_id=${selectedSection?.id}`;
                                        window.location.href = url;
                                    }}
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                                >
                                    <PlusIcon className="w-5 h-5 mr-2" />
                                    Create Assessment First
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="overflow-x-auto custom-scrollbar">
                                    <table className="w-full text-sm text-left">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-100">
                                                <th className="px-8 py-5 font-bold text-gray-600 uppercase tracking-widest text-[10px] sticky left-0 bg-gray-50 z-10 w-80">Student Details</th>
                                                {fetchedAssessments.map(assessment => (
                                                    <th key={assessment.id} className="px-6 py-5 min-w-[160px]">
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-900 font-bold text-sm mb-1">{assessment.name}</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-bold uppercase">Max: {assessment.total_marks}</span>
                                                                <span className="text-[9px] text-gray-400 font-bold uppercase">Sem {assessment.semester}</span>
                                                            </div>
                                                        </div>
                                                    </th>
                                                ))}
                                                <th className="px-8 py-5 font-bold text-gray-600 uppercase tracking-widest text-[10px]">Total Score</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {fetchedStudents.filter(s => selectedStudentIds.includes(s.id)).map(student => (
                                                <tr key={student.id} className="hover:bg-blue-50/30 transition-colors group">
                                                    <td className="px-8 py-5 sticky left-0 bg-white z-10 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)] border-r border-gray-50 group-hover:bg-blue-50/30">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors uppercase">
                                                                {student.user?.name?.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-gray-900">{student.user?.name}</div>
                                                                <div className="text-xs text-gray-500 font-medium">{student.student_id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    {fetchedAssessments.map(assessment => (
                                                        <td key={assessment.id} className="px-6 py-5">
                                                            <div className="relative max-w-[120px]">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    max={assessment.total_marks}
                                                                    step="0.5"
                                                                    value={data.marks[student.id]?.[assessment.id] || ''}
                                                                    onChange={(e) => handleMarkChange(student.id, assessment.id, e.target.value)}
                                                                    className={`w-full h-11 px-4 border border-gray-200 rounded-xl font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 text-base ${(semesterStatuses[assessment.semester] === false || savedMarks[student.id]?.[assessment.id] !== undefined) ? 'bg-gray-100 cursor-not-allowed text-gray-400' : 'bg-white'}`}
                                                                    placeholder={`0.0`}
                                                                    disabled={semesterStatuses[assessment.semester] === false || savedMarks[student.id]?.[assessment.id] !== undefined}
                                                                />
                                                                {savedMarks[student.id]?.[assessment.id] !== undefined && (
                                                                    <div className="absolute -right-1 -top-1 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-[10px] shadow-sm ring-2 ring-white">
                                                                        ✔
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    ))}
                                                    <td className="px-8 py-5">
                                                        {(() => {
                                                            const studentMarks = data.marks[student.id] || {};
                                                            const totalObtained = fetchedAssessments.reduce((sum, assessment) => sum + (Number(studentMarks[assessment.id]) || 0), 0);
                                                            const totalMax = fetchedAssessments.reduce((sum, assessment) => sum + (Number(assessment.total_marks) || 0), 0);
                                                            const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
                                                            return (
                                                                <div className="flex flex-col">
                                                                    <span className="text-lg font-black text-gray-900">{totalObtained} <span className="text-gray-400 font-normal text-sm">/ {totalMax}</span></span>
                                                                    <div className="w-20 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                                                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${percentage}%` }}></div>
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

                                <div className="p-8 bg-gray-50 border-t border-gray-100 flex flex-col items-end gap-6">
                                    {Object.keys(errors).length > 0 && (
                                        <div className="w-full bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
                                            <p className="font-bold flex items-center gap-2 mb-2">
                                                <ExclamationTriangleIcon className="w-5 h-5" />
                                                Validation Errors
                                            </p>
                                            <ul className="list-disc list-inside space-y-1">
                                                {Object.entries(errors).map(([key, error]) => (
                                                    <li key={key} className="font-medium">{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-bold transition-all shadow-sm"
                                        >
                                            Back to Subjects
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-10 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 font-black transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <ClipboardDocumentCheckIcon className="w-5 h-5" />
                                                    Submit Results
                                                </>
                                            )}
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
