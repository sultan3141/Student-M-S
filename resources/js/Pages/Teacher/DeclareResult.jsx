import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function DeclareResult({ grades, initialStep = 1, initialGradeId = null, initialSectionId = null, initialSubjectId = null, initialStudentId = null }) {
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

    // Form Data
    const { data, setData, post, processing, errors } = useForm({
        grade_id: initialGradeId || '',
        section_id: initialSectionId || '',
        subject_id: initialSubjectId || '',
        student_ids: initialStudentId ? [parseInt(initialStudentId)] : [],
        marks: {}, // Structure: { studentId: { assessmentId: mark } }
    });

    const [selectedStudentIds, setSelectedStudentIds] = useState([]);

    // Initialize with URL parameters if step is 5
    useEffect(() => {
        const initializeStep5 = async () => {
            console.log('useEffect triggered:', { initialStep, initialGradeId, initialSectionId, initialSubjectId });

            if (initialStep === 5 && initialGradeId && initialSectionId && initialSubjectId) {
                console.log('Initializing step 5...');
                const grade = grades.find(g => g.id === parseInt(initialGradeId));
                const section = grade?.sections?.find(s => s.id === parseInt(initialSectionId));

                console.log('Found grade and section:', { grade, section });

                if (grade && section) {
                    setSelectedGrade(grade);
                    setSelectedSection(section);

                    // Fetch students first and wait for response
                    const studentsResponse = await fetch(`/teacher/declare-result/students?grade_id=${initialGradeId}&section_id=${initialSectionId}`);
                    const studentsData = await studentsResponse.json();
                    setFetchedStudents(studentsData);
                    console.log('Students loaded:', studentsData.length);

                    // Fetch subjects
                    const subjectsResponse = await fetch(`/teacher/declare-result/subjects?grade_id=${initialGradeId}&section_id=${initialSectionId}`);
                    const subjectsData = await subjectsResponse.json();
                    setSubjects(subjectsData);
                    console.log('Subjects loaded:', subjectsData.length);

                    // Set the selected subject
                    const subject = subjectsData.find(s => s.id === parseInt(initialSubjectId));
                    if (subject) {
                        setSelectedSubject(subject);
                        console.log('Subject selected:', subject);
                    }

                    // Then fetch assessments with students data
                    await fetchAssessments(initialGradeId, initialSectionId, initialSubjectId, studentsData);
                    console.log('Step 5 initialization complete');
                }
            }
        };

        initializeStep5();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- Step 1: Grade Selection ---
    const handleGradeSelect = (grade) => {
        setSelectedGrade(grade);
        setData('grade_id', grade.id);
        setStep(2);
    };

    // --- Step 2: Section Selection ---
    const handleSectionSelect = (section) => {
        setSelectedSection(section);
        setData('section_id', section.id);
        fetchStudents(selectedGrade.id, section.id);
        fetchSubjects(selectedGrade.id, section.id);
        setStep(3);
    };

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

    const fetchAssessments = async (gradeId, sectionId, subjectId, studentsList = null) => {
        setLoading(true);
        try {
            const response = await fetch(`/teacher/declare-result/assessments?grade_id=${gradeId}&section_id=${sectionId}&subject_id=${subjectId}`);
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

            // Use provided students list or fallback to state
            const studentsToUse = studentsList || fetchedStudents;

            // For step 5 initialization, select based on initialStudentId or select all
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
                }
            }

            // Set the selected subject from subjects state
            setTimeout(() => {
                setSelectedSubject(prev => {
                    const subject = subjects.find(s => s.id === parseInt(subjectId));
                    return subject || prev;
                });
            }, 100);
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

    const handleStudentsConfirmed = () => {
        if (selectedStudentIds.length === 0) {
            alert('Please select at least one student.');
            return;
        }
        setStep(4);
    };

    // --- Step 4: Subject Selection ---
    const handleSubjectSelect = async (subject) => {
        setSelectedSubject(subject);
        setData('subject_id', subject.id);

        // Fetch Assessments
        setLoading(true);
        try {
            const response = await fetch(`/teacher/declare-result/assessments?grade_id=${selectedGrade.id}&section_id=${selectedSection.id}&subject_id=${subject.id}`);
            const assessmentsData = await response.json();
            setFetchedAssessments(assessmentsData);

            // Fetch existing marks for selected students
            const marksResponse = await fetch(`/teacher/declare-result/existing-marks?grade_id=${selectedGrade.id}&section_id=${selectedSection.id}&subject_id=${subject.id}&student_ids=${selectedStudentIds.join(',')}`);
            const existingMarks = await marksResponse.json();

            // Pre-fill marks if they exist
            if (existingMarks && Object.keys(existingMarks).length > 0) {
                setData('marks', existingMarks);
            }

            setStep(5);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // --- Step 5: Marks Entry ---
    const handleMarkChange = (studentId, assessmentId, value) => {
        // Validation: Check Max Mark
        const assessment = fetchedAssessments.find(a => a.id === assessmentId);
        if (assessment && Number(value) > assessment.max_marks) {
            // value = assessment.max_marks; // Strict clamping or just text? 
            // Let's just allow it but show error or rely on text input min/max
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
        post(route('teacher.declare-result.store'), {
            onSuccess: () => {
                alert('Results declared successfully!');
                // Reset or Redirect? Controller redirects to index.
            }
        });
    };

    const getStepTitle = () => {
        switch (step) {
            case 1: return "Select Class";
            case 2: return "Select Section";
            case 3: return "Select Students";
            case 4: return "Select Subject";
            case 5: return "Enter Marks";
            default: return "";
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    return (
        <TeacherLayout>
            <Head title="Declare Result" />

            {/* Header */}
            <div className="bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] shadow-sm mb-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-white mb-1">
                                Declare Result
                            </h1>
                            <p className="text-blue-100 text-sm">
                                Step {step} of 5: {getStepTitle()}
                            </p>
                        </div>
                        {step > 1 && (
                            <button
                                onClick={handleBack}
                                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-md transition-colors text-sm"
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
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 mb-1">Select Grade</h2>
                            <p className="text-gray-600 text-sm">Choose the grade to declare results</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            {grades.map(grade => (
                                <button
                                    key={grade.id}
                                    onClick={() => handleGradeSelect(grade)}
                                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-md transition-all text-left group"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">{grade.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{grade.sections?.length || 0} Sections</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Section Selection */}
                {step === 2 && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 mb-1">Select Section</h2>
                            <p className="text-gray-600 text-sm">{selectedGrade?.name}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            {selectedGrade?.sections?.map(section => (
                                <button
                                    key={section.id}
                                    onClick={() => handleSectionSelect(section)}
                                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-md transition-all text-left group"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">Section {section.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1">Click to select</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Student Selection */}
                {step === 3 && (
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-gray-900">Select Students</h3>
                                <p className="text-xs text-gray-500 mt-0.5">{selectedGrade?.name} - Section {selectedSection?.name}</p>
                            </div>
                            <button
                                onClick={handleStudentsConfirmed}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                            >
                                Continue ({selectedStudentIds.length})
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="p-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedStudentIds.length === fetchedStudents.length && fetchedStudents.length > 0}
                                                onChange={toggleAllStudents}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </th>
                                        <th className="px-6 py-3">ID</th>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Roll No</th>
                                        <th className="px-6 py-3">Gender</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fetchedStudents.map(student => (
                                        <tr key={student.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="w-4 p-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStudentIds.includes(student.id)}
                                                    onChange={() => toggleStudent(student.id)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{student.student_id}</td>
                                            <td className="px-6 py-4">{student.user?.name}</td>
                                            <td className="px-6 py-4">-</td>
                                            <td className="px-6 py-4 capitalize">{student.gender}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Step 4: Subject Selection */}
                {step === 4 && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 mb-1">Select Subject</h2>
                            <p className="text-gray-600 text-sm">{selectedGrade?.name} - Section {selectedSection?.name}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            {subjects.map(subject => (
                                <button
                                    key={subject.id}
                                    onClick={() => handleSubjectSelect(subject)}
                                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-md transition-all text-left group"
                                >
                                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600">{subject.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{subject.code}</p>
                                </button>
                            ))}
                            {subjects.length === 0 && (
                                <div className="col-span-full p-6 text-center text-gray-500 text-sm">
                                    No subjects found for this class and section.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 5: Marks Entry */}
                {step === 5 && (
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div><span className="font-semibold">Class:</span> {selectedGrade?.name} - Section {selectedSection?.name}</div>
                                <div><span className="font-semibold">Subject:</span> {selectedSubject?.name}</div>
                            </div>
                        </div>

                        {fetchedAssessments.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-gray-500 mb-4">No assessments found for this subject.</p>
                                <button
                                    onClick={() => {
                                        const url = `/teacher/assessments-simple/create?grade_id=${selectedGrade.id}&subject_id=${selectedSubject.id}`;
                                        window.location.href = url;
                                    }}
                                    className="text-blue-600 hover:underline"
                                >
                                    Create Assessment First
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                            <tr>
                                                <th className="px-6 py-3 min-w-[200px] sticky left-0 bg-gray-100 z-10">Student</th>
                                                {fetchedAssessments.map(assessment => (
                                                    <th key={assessment.id} className="px-6 py-3 min-w-[150px]">
                                                        <div className="flex flex-col">
                                                            <span>{assessment.name}</span>
                                                            <span className="text-[10px] text-gray-500 font-normal">Max: {assessment.total_marks}</span>
                                                        </div>
                                                    </th>
                                                ))}
                                                <th className="px-6 py-3 min-w-[100px]">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fetchedStudents.filter(s => selectedStudentIds.includes(s.id)).map(student => (
                                                <tr key={student.id} className="bg-white border-b hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-medium text-gray-900 sticky left-0 bg-white z-10 shadow-sm border-r">
                                                        {student.user?.name}
                                                        <div className="text-xs text-gray-500 font-normal">{student.student_id}</div>
                                                    </td>
                                                    {fetchedAssessments.map(assessment => (
                                                        <td key={assessment.id} className="px-6 py-4">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max={assessment.total_marks}
                                                                step="0.5"
                                                                value={data.marks[student.id]?.[assessment.id] || ''}
                                                                onChange={(e) => handleMarkChange(student.id, assessment.id, e.target.value)}
                                                                className={`w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm ${semesterStatuses[assessment.semester] === false ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                                                placeholder={`/${assessment.total_marks}`}
                                                                disabled={semesterStatuses[assessment.semester] === false}
                                                            />
                                                        </td>
                                                    ))}
                                                    <td className="px-6 py-4 font-bold text-gray-700">
                                                        {(() => {
                                                            const studentMarks = data.marks[student.id] || {};
                                                            const totalObtained = fetchedAssessments.reduce((sum, assessment) => {
                                                                const mark = studentMarks[assessment.id];
                                                                return sum + (Number(mark) || 0);
                                                            }, 0);
                                                            const totalMax = fetchedAssessments.reduce((sum, assessment) => sum + (Number(assessment.total_marks) || 0), 0);
                                                            return `${totalObtained} / ${totalMax}`;
                                                        })()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="p-4 border-t border-gray-200 flex flex-col items-end gap-2">
                                    {/* Error Display */}
                                    {Object.keys(errors).length > 0 && (
                                        <div className="w-full bg-red-50 text-red-600 p-3 rounded-md text-sm mb-2">
                                            <p className="font-semibold">Please correct the following errors:</p>
                                            <ul className="list-disc list-inside mt-1">
                                                {Object.entries(errors).map(([key, error]) => (
                                                    <li key={key}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
                                    >
                                        {processing ? 'Saving...' : 'Save Results'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </TeacherLayout>
    );
}
