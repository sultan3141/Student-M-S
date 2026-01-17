import { Head } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import MarkEntryTable from '@/Components/Marks/MarkEntryTable';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Entry({ classId, subject, assessmentType, students, semester, academicYear }) {
    return (
        <TeacherLayout>
            <Head title={`Enter Marks - ${subject}`} />

            <div className="mb-8">
                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span>Marks</span>
                    <ChevronRightIcon className="w-4 h-4 mx-2" />
                    <span>{subject}</span>
                    <ChevronRightIcon className="w-4 h-4 mx-2" />
                    <span className="font-semibold text-gray-900">{assessmentType.name}</span>
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">Enter Marks</h1>
                        <p className="text-gray-600 mt-1">
                            {subject} • Semester {semester} • {academicYear}
                        </p>
                    </div>
                    <div className="flex items-center space-x-3 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                        <span className="text-blue-700 font-medium">{assessmentType.name}</span>
                        <span className="px-2 py-0.5 bg-blue-200 text-blue-900 text-xs font-bold rounded-full">
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
