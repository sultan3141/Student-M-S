import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/solid';
import TeacherLayout from '@/Layouts/TeacherLayout';
import AcademicYearStep from '@/Components/Marks/MarkWizard/AcademicYearStep';
import GradeStep from '@/Components/Marks/MarkWizard/GradeStep';
import MarkEntryTable from '@/Components/Marks/MarkWizard/MarkEntryTable';
import axios from 'axios';

export default function Create({ assignments, currentAcademicYear, assessmentTypes }) {
    const [step, setStep] = useState(1);
    const [students, setStudents] = useState([]);

    // Derived state for filtered options based on assignments
    const availableGrades = [...new Map(assignments.map(a => [a.grade.id, a.grade])).values()];

    const { data, setData, post, processing, errors } = useForm({
        academic_year_id: currentAcademicYear,
        grade_id: '',
        section_id: '',
        subject_id: '',
        semester: '1',
        assessment_type_id: '', // Changed to ID
        marks: [], // Array of {student_id, score}
    });

    const steps = [
        { id: 1, name: 'Academic Year' },
        { id: 2, name: 'Grade' },
        { id: 3, name: 'Section' },
        { id: 4, name: 'Subject' },
        { id: 5, name: 'Details' }, // Semester & Assessment Type combined for brevity
        { id: 6, name: 'Enter Marks' },
    ];

    const fetchStudents = async () => {
        if (data.section_id && data.subject_id) {
            try {
                const response = await axios.get(route('teacher.marks.students'), {
                    params: {
                        section_id: data.section_id,
                        subject_id: data.subject_id
                    }
                });
                setStudents(response.data);
            } catch (error) {
                console.error('Failed to fetch students', error);
            }
        }
    };

    const nextStep = () => {
        if (step === 5) {
            fetchStudents();
        }
        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    const submit = (e) => {
        e.preventDefault();
        post(route('teacher.marks.store'));
    };

    // Filter logic for current step
    const currentAssignments = assignments.filter(a => {
        if (step > 2 && data.grade_id && a.grade_id != data.grade_id) return false;
        if (step > 3 && data.section_id && a.section_id != data.section_id) return false;
        return true;
    });

    const getAvailableSections = () => {
        return [...new Map(currentAssignments.map(a => [a.section.id, a.section])).values()];
    };

    const getAvailableSubjects = () => {
        return [...new Map(currentAssignments.map(a => [a.subject.id, a.subject])).values()];
    };

    return (
        <TeacherLayout>
            <Head title="Mark Entry" />

            <div className="max-w-4xl mx-auto">
                {/* Wizard Progress */}
                <nav aria-label="Progress" className="mb-8">
                    <ol role="list" className="flex items-center">
                        {steps.map((s, index) => (
                            <li key={s.name} className={`relative ${index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                                {s.id < step ? (
                                    <>
                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                            <div className="h-0.5 w-full bg-blue-600" />
                                        </div>
                                        <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-900">
                                            <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </>
                                ) : s.id === step ? (
                                    <>
                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                            <div className="h-0.5 w-full bg-gray-200" />
                                        </div>
                                        <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-600 bg-white" aria-current="step">
                                            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                            <div className="h-0.5 w-full bg-gray-200" />
                                        </div>
                                        <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400">
                                            <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" />
                                        </div>
                                    </>
                                )}
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-max text-xs font-medium text-gray-500">
                                    {s.name}
                                </div>
                            </li>
                        ))}
                    </ol>
                </nav>

                {/* Wizard Content */}
                <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6 mt-12">
                    {step === 1 && (
                        <AcademicYearStep
                            data={data}
                            setData={setData}
                            years={[{ id: 2026, name: '2025-2026' }]} // Dynamic in real app
                        />
                    )}

                    {step === 2 && (
                        <GradeStep
                            data={data}
                            setData={setData}
                            grades={availableGrades}
                        />
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Select Section</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {getAvailableSections().map(section => (
                                    <button
                                        key={section.id}
                                        onClick={() => setData('section_id', section.id)}
                                        className={`p-4 border rounded-lg text-left ${data.section_id == section.id ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'hover:bg-gray-50'}`}
                                    >
                                        <span className="font-bold block">{section.name}</span>
                                        <span className="text-sm text-gray-500">Gender: {section.gender}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Select Subject</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {getAvailableSubjects().map(subject => (
                                    <button
                                        key={subject.id}
                                        onClick={() => setData('subject_id', subject.id)}
                                        className={`p-6 border rounded-lg flex flex-col items-center justify-center gap-2 ${data.subject_id == subject.id ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'hover:bg-gray-50'}`}
                                    >
                                        <span className="text-3xl">📚</span>
                                        <span className="font-medium text-center">{subject.name}</span>
                                        <span className="text-xs text-gray-400">{subject.code}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Semester</label>
                                <div className="mt-2 flex gap-4">
                                    {['1', '2'].map(sem => (
                                        <button
                                            key={sem}
                                            onClick={() => setData('semester', sem)}
                                            className={`flex-1 py-3 px-4 border rounded-md ${data.semester === sem ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                        >
                                            Semester {sem}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Assessment Type</label>
                                <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {assessmentTypes.map(type => (
                                        <button
                                            key={type.id}
                                            onClick={() => setData('assessment_type_id', type.id)}
                                            className={`py-2 px-3 text-sm font-medium border rounded-md ${data.assessment_type_id === type.id ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                        >
                                            {type.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 6 && (
                        <MarkEntryTable
                            data={data}
                            setData={setData}
                            students={students}
                        />
                    )}

                    {/* Navigation Buttons */}
                    <div className="mt-8 pt-5 border-t border-gray-200 flex justify-between">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={step === 1}
                            className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none ${step === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <ChevronLeftIcon className="-ml-1 mr-2 h-5 w-5" />
                            Back
                        </button>

                        {step < 6 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Next
                                <ChevronRightIcon className="ml-2 -mr-1 h-5 w-5" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={submit}
                                disabled={processing}
                                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                {processing ? 'Saving...' : 'Submit Marks'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
