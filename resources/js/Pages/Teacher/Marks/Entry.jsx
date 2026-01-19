import { Head } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import MarkEntryTable from '@/Components/Marks/MarkEntryTable';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Entry({ classId, subject, assessmentType, students, semester, academicYear }) {
    return (
        <TeacherLayout>
            <Head title={`Enter Marks - ${subject}`} />

            {/* Header Area with Gradient */}
            <div className="bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] shadow-md mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-blue-100/80 mb-4">
                    <span className="hover:text-white transition-colors cursor-pointer">Marks</span>
                    <ChevronRightIcon className="w-4 h-4 mx-2 text-white/50" />
                    <span className="hover:text-white transition-colors cursor-pointer">{subject}</span>
                    <ChevronRightIcon className="w-4 h-4 mx-2 text-white/50" />
                    <span className="font-semibold text-white">{assessmentType.name}</span>
                </div>

                {/* Header Content */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Enter Marks</h1>
                        <p className="text-blue-100 mt-1">
                            {subject} • Semester {semester} • {academicYear}
                        </p>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 shadow-lg">
                        <span className="text-white font-medium">{assessmentType.name}</span>
                        <span className="px-2 py-0.5 bg-white text-[#1E40AF] text-xs font-bold rounded-full">
                            {assessmentType.weight_percentage}% Weight
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <MarkEntryTable
                    students={students}
                    subject={subject}
                    assessmentType={assessmentType}
                    semester={semester}
                    academicYear={academicYear}
                />
            </div>
        </TeacherLayout>
    );
}
