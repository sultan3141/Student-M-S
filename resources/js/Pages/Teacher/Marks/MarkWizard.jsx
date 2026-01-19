import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import GradeSelector from '@/Components/Marks/GradeSelector';
import SectionSelector from '@/Components/Marks/SectionSelector';
import SubjectAssessmentSelector from '@/Components/Marks/SubjectAssessmentSelector';
import {
    AcademicCapIcon,
    ChartBarIcon,
    ClockIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

export default function MarkWizard() {
    const [step, setStep] = useState(1); // 1: Grade, 2: Section, 3: Subject/Assessment
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [semester, setSemester] = useState(2); // Default to semester 2

    const [quickStats, setQuickStats] = useState({
        classes_assigned: 3,
        pending_submissions: 12,
        todays_deadline: 2,
        average_completion: 75
    });

    const handleGradeSelect = (grade) => {
        setSelectedGrade(grade);
        setStep(2);
    };

    const handleSectionSelect = (section) => {
        setSelectedSection(section);
        setStep(3);
    };

    const handleBackToGrades = () => {
        setStep(1);
        setSelectedGrade(null);
        setSelectedSection(null);
    };

    const handleBackToSections = () => {
        setStep(2);
        setSelectedSection(null);
    };

    return (
        <TeacherLayout>
            <Head title="Mark Management" />

            {/* Header with Gradient */}
            <div className="bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] shadow-lg mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-10">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                        📊 Mark Management Dashboard
                    </h1>
                    <p className="text-blue-100 text-lg">
                        Streamlined workflow to enter and manage student marks
                    </p>
                </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
                    <div className="flex items-center">
                        <AcademicCapIcon className="w-8 h-8 text-blue-500 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Classes Assigned</p>
                            <p className="text-2xl font-bold text-gray-900">{quickStats.classes_assigned}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-amber-500">
                    <div className="flex items-center">
                        <ClockIcon className="w-8 h-8 text-amber-500 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Pending Submissions</p>
                            <p className="text-2xl font-bold text-gray-900">{quickStats.pending_submissions}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
                    <div className="flex items-center">
                        <ClockIcon className="w-8 h-8 text-red-500 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Today's Deadline</p>
                            <p className="text-2xl font-bold text-gray-900">{quickStats.todays_deadline}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
                    <div className="flex items-center">
                        <ChartBarIcon className="w-8 h-8 text-green-500 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Avg Completion</p>
                            <p className="text-2xl font-bold text-gray-900">{quickStats.average_completion}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Indicator */}
            <div className="mb-8">
                <div className="flex items-center justify-center space-x-4">
                    <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            {step > 1 ? <CheckCircleIcon className="w-6 h-6" /> : '1'}
                        </div>
                        <span className="ml-2 font-medium hidden sm:inline">Grade</span>
                    </div>
                    <div className={`h-1 w-16 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                    <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            {step > 2 ? <CheckCircleIcon className="w-6 h-6" /> : '2'}
                        </div>
                        <span className="ml-2 font-medium hidden sm:inline">Section</span>
                    </div>
                    <div className={`h-1 w-16 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                    <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            3
                        </div>
                        <span className="ml-2 font-medium hidden sm:inline">Subject & Assessment</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-lg shadow-md p-8">
                {step === 1 && (
                    <GradeSelector onSelectGrade={handleGradeSelect} />
                )}

                {step === 2 && selectedGrade && (
                    <SectionSelector
                        gradeId={selectedGrade.id}
                        gradeName={selectedGrade.name}
                        onSelectSection={handleSectionSelect}
                        onBack={handleBackToGrades}
                    />
                )}

                {step === 3 && selectedSection && (
                    <SubjectAssessmentSelector
                        sectionId={selectedSection.id}
                        gradeName={selectedGrade.name}
                        sectionName={selectedSection.name}
                        semester={semester}
                        onSemesterChange={setSemester}
                        onBack={handleBackToSections}
                    />
                )}
            </div>
        </TeacherLayout>
    );
}
