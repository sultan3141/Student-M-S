import { Head, useForm } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import MarkEntryTable from '@/Components/Marks/MarkEntryTable';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Entry({ assessment, students, subject, semester }) {
    const { data, setData, post, processing } = useForm({
        assessment_id: assessment.id,
        marks: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('teacher.marks.store'));
    };

    return (
        <TeacherLayout>
            <Head title={`Enter Marks - ${assessment.name}`} />

            {/* Header Area with Gradient */}
            <div className="bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] shadow-md mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-blue-100/80 mb-4">
                    <span className="hover:text-white transition-colors cursor-pointer">Marks</span>
                    <ChevronRightIcon className="w-4 h-4 mx-2 text-white/50" />
                    <span className="hover:text-white transition-colors cursor-pointer">{subject}</span>
                    <ChevronRightIcon className="w-4 h-4 mx-2 text-white/50" />
                    <span className="font-semibold text-white">{assessment.name}</span>
                </div>

                {/* Header Content */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Enter Marks</h1>
                        <p className="text-blue-100 mt-1">
                            {subject} • Semester {semester}
                        </p>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 shadow-lg">
                        <span className="text-white font-medium">{assessment.name}</span>
                        <span className="px-2 py-0.5 bg-white text-[#1E40AF] text-xs font-bold rounded-full">
                            {assessment.weight}% Weight
                        </span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <MarkEntryTable
                    students={students}
                    data={data}
                    setData={setData}
                    subject={subject}
                    assessmentName={assessment.name}
                    semester={semester}
                />

                <div className="flex justify-end space-x-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : 'Submit All Marks'}
                    </button>
                </div>
            </form>
        </TeacherLayout>
    );
}
