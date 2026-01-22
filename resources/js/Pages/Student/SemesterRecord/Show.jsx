import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import { ArrowLeftIcon, TrophyIcon, ChartBarIcon, BeakerIcon, DocumentTextIcon, XMarkIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

export default function SemesterRecordShow({ student, semester, academic_year, subject_records, semester_average, rank, total_students }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const openModal = (record) => {
        setSelectedRecord(record);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedRecord(null);
    };

    const getGradeColor = (average) => {
        if (average >= 90) return 'text-green-700 bg-green-50 border-green-200';
        if (average >= 80) return 'text-blue-700 bg-blue-50 border-blue-200';
        if (average >= 70) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
        if (average >= 60) return 'text-orange-700 bg-orange-50 border-orange-200';
        return 'text-red-700 bg-red-50 border-red-200';
    };

    const getLetterGrade = (average) => {
        if (average >= 90) return 'A';
        if (average >= 80) return 'B';
        if (average >= 70) return 'C';
        if (average >= 60) return 'D';
        return 'F';
    };

    return (
        <StudentLayout>
            <Head title={`Semester ${semester} - ${academic_year?.name}`} />

            <div className="max-w-7xl mx-auto space-y-8 pb-12">
                {/* Navigation and Header */}
                <div>
                    <Link
                        href={route('student.academic.semesters')}
                        className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-4 group"
                    >
                        <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to All Semesters</span>
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                Semester {semester} Report
                            </h1>
                            <p className="mt-2 text-gray-500 font-medium">{academic_year?.name} Academic Year</p>
                        </div>
                        <div className="flex space-x-2 mt-4 md:mt-0">
                            <span className="px-4 py-2 bg-blue-50 text-blue-800 rounded-lg text-sm font-bold tracking-wide uppercase border border-blue-100">
                                Grade {student.grade.name}
                            </span>
                            <span className="px-4 py-2 bg-gray-50 text-gray-800 rounded-lg text-sm font-bold tracking-wide uppercase border border-gray-100">
                                Section {student.section.name}
                            </span>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Overall Average */}
                    <div className="executive-card bg-gradient-to-br from-blue-900 to-indigo-900 border-blue-800 !p-6 text-white transform hover:scale-[1.02] shadow-xl shadow-blue-900/10 h-full relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ChartBarIcon className="w-24 h-24" />
                        </div>
                        <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Semester Average</p>
                        <div className="flex items-baseline space-x-2 relative z-10">
                            <h2 className="text-5xl font-black">{semester_average}<span className="text-2xl opacity-80">%</span></h2>
                        </div>
                        <div className="mt-4 relative z-10">
                            <span className="bg-white/20 px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter mr-2">
                                GRADE {getLetterGrade(semester_average)}
                            </span>
                            <span className="text-blue-200 text-[10px] font-bold uppercase tracking-widest">all subjects Mastery</span>
                        </div>
                    </div>

                    {/* Class Rank */}
                    <div className="executive-card !p-6 transform hover:scale-[1.02] shadow-blue-200/20 h-full">
                        <div className="flex justify-between items-start h-full">
                            <div>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Class Rank</p>
                                <h2 className="text-4xl font-black text-gray-900">
                                    <span className="text-amber-500 mr-1 opacity-50">#</span>{rank}
                                </h2>
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-2">out of {total_students} students</p>
                            </div>
                            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100 shadow-inner">
                                <TrophyIcon className="w-8 h-8 text-amber-500" />
                            </div>
                        </div>
                    </div>

                    {/* Total Credits */}
                    <div className="executive-card !p-6 transform hover:scale-[1.02] shadow-indigo-200/20 h-full">
                        <div className="flex justify-between items-start h-full">
                            <div>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Credits</p>
                                <h2 className="text-4xl font-black text-gray-900">
                                    {subject_records?.reduce((acc, curr) => acc + (curr.subject.credit_hours || 3), 0)}
                                </h2>
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-2">Credits Earned</p>
                            </div>
                            <div className="bg-indigo-50 p-3 rounded-2xl border border-indigo-100 shadow-inner">
                                <DocumentTextIcon className="w-8 h-8 text-indigo-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subject Performance Table */}
                <div className="executive-card overflow-hidden !p-0">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                                <ChartBarIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Subject Mastery</h3>
                                <p className="text-gray-500 text-[10px] font-medium uppercase tracking-widest">Performance in each subject</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Semester Verified</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead>
                                <tr className="bg-gray-50/30">
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                                    <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Mark out of 100</th>
                                    <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Teacher Name</th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {subject_records && subject_records.length > 0 ? (
                                    subject_records.map((record, index) => (
                                        <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900">{record.subject.name}</span>
                                                    <span className="text-xs text-gray-500 font-mono">{record.subject.code}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className="text-lg font-bold text-blue-600">{record.average}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className="text-sm text-gray-600 font-medium">
                                                    {record.subject.teacher_name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => openModal(record)}
                                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                                <BeakerIcon className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <p className="text-gray-500 text-sm">No academic records found for this semester.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Assessment Details Modal */}
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[60]" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="div"
                                        className="flex items-center justify-between mb-6"
                                    >
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {selectedRecord?.subject.name}
                                            </h3>
                                            <div className="flex items-center mt-1 space-x-2">
                                                <span className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded">{selectedRecord?.subject.code}</span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span className="text-sm font-bold text-blue-600">{selectedRecord?.average}% Average</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={closeModal}
                                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                                        >
                                            <XMarkIcon className="w-6 h-6" />
                                        </button>
                                    </Dialog.Title>

                                    <div className="mt-2">
                                        <div className="overflow-hidden rounded-xl border border-gray-100">
                                            <table className="min-w-full divide-y divide-gray-100">
                                                <thead>
                                                    <tr className="bg-gray-50">
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Assessment</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Weight</th>
                                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Score</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 bg-white">
                                                    {selectedRecord?.marks.length > 0 ? (
                                                        selectedRecord.marks.map((mark, mIndex) => (
                                                            <tr key={mIndex} className="hover:bg-gray-50/50">
                                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                                    {mark.assessment_name}
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-gray-500">
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                                                        {mark.type}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-gray-500 text-center">
                                                                    {Number(mark.weight) > 0 ? `${mark.weight}%` : '-'}
                                                                </td>
                                                                <td className="px-4 py-3 text-right">
                                                                    <div className="inline-flex items-baseline space-x-1 justify-end">
                                                                        <span className={`font-bold ${mark.score >= mark.max_score * 0.9 ? 'text-green-600' : 'text-gray-900'}`}>{mark.score}</span>
                                                                        <span className="text-xs text-gray-400 font-medium">/ {mark.max_score}</span>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="4" className="px-4 py-8 text-center text-gray-500 text-sm italic">
                                                                No assessments recorded yet.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-lg border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
                                            onClick={closeModal}
                                        >
                                            Done
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </StudentLayout>
    );
}
