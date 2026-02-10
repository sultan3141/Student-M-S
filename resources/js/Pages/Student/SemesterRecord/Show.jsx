import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import { ArrowLeftIcon, TrophyIcon, ChartBarIcon, BeakerIcon, DocumentTextIcon, XMarkIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

export default function SemesterRecordShow({ student, semester, academic_year, subject_records, semester_average, rank, total_students, semester_status }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    // Safety check
    if (!student || !academic_year) {
        return (
            <StudentLayout>
                <Head title="Semester Record" />
                <div className="max-w-7xl mx-auto p-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-800 font-medium">Unable to load semester record. Please try again.</p>
                        <Link href={route('student.academic.semesters')} className="mt-4 inline-block text-blue-600 hover:text-blue-800">
                            Back to Semesters
                        </Link>
                    </div>
                </div>
            </StudentLayout>
        );
    }

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

            <div className="max-w-7xl mx-auto space-y-5 pb-8">
                {/* Navigation */}
                <div>
                    <Link
                        href={route('student.academic.semesters')}
                        className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-2 group"
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-semibold">Back to All Semesters</span>
                    </Link>
                </div>

                {/* Subject Performance Table */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="p-1.5 bg-blue-100 rounded-lg">
                                <ChartBarIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900">Subject Mastery</h3>
                                <p className="text-gray-600 text-xs font-medium">Performance in each subject</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-1.5">
                            <div className={`h-2 w-2 rounded-full ${semester_status === 'open' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                            <span className="text-xs font-bold text-gray-700">
                                {semester_status === 'open' ? 'Live Period' : 'Verified'}
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Subject</th>
                                    <th scope="col" className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Mark out of 100</th>
                                    <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {subject_records && subject_records.length > 0 ? (
                                    <>
                                        {subject_records.map((record, index) => (
                                            <tr key={index} className="hover:bg-blue-50 transition-colors">
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-gray-900">{record.subject.name}</span>
                                                        <span className="text-xs text-gray-600 font-mono">{record.subject.code}</span>
                                                        {record.graded_assessments < record.total_assessments && (
                                                            <span className="text-xs text-yellow-700 font-semibold mt-0.5">
                                                                {record.graded_assessments}/{record.total_assessments} graded
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                                    {record.graded_assessments > 0 ? (
                                                        <span className="text-base font-bold text-blue-600">
                                                            {record.total_score} / {record.total_max_score}
                                                        </span>
                                                    ) : (
                                                        <span className="text-sm text-gray-500 font-semibold">Not Graded</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-right">
                                                    <button
                                                        onClick={() => openModal(record)}
                                                        className="px-3 py-1.5 bg-blue-600 rounded-lg font-bold text-xs text-white uppercase hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}

                                        {/* Total Row */}
                                        <tr className="bg-gray-100/80 font-bold border-t-2 border-gray-300">
                                            <td className="px-4 py-3 text-sm text-gray-900 uppercase tracking-wider">Total Marks</td>
                                            <td className="px-4 py-3 text-center text-lg text-blue-700">
                                                {subject_records.reduce((acc, curr) => acc + (curr.total_score || 0), 0)} / {subject_records.reduce((acc, curr) => acc + (curr.total_max_score || 0), 0)}
                                            </td>
                                            <td className="px-4 py-3"></td>
                                        </tr>

                                        {/* Average Row */}
                                        <tr className="bg-blue-50/50 font-bold">
                                            <td className="px-4 py-3 text-sm text-gray-900 uppercase tracking-wider">Average Percentage</td>
                                            <td className="px-4 py-3 text-center text-lg text-blue-700">
                                                {semester_average}%
                                            </td>
                                            <td className="px-4 py-3"></td>
                                        </tr>

                                        {/* Rank Row */}
                                        <tr className="bg-amber-50/30 font-bold">
                                            <td className="px-4 py-3 text-sm text-gray-900 uppercase tracking-wider">Class Rank</td>
                                            <td className="px-4 py-3 text-center text-lg text-amber-600">
                                                #{rank} <span className="text-xs text-gray-400 font-bold whitespace-nowrap">/ {total_students}</span>
                                            </td>
                                            <td className="px-4 py-3"></td>
                                        </tr>
                                    </>
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-4 py-8 text-center">
                                            <div className="mx-auto w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                                                <BeakerIcon className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <p className="text-gray-600 text-sm font-medium">No academic records found for this semester.</p>
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
                                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-xl bg-white p-4 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="div"
                                        className="flex items-center justify-between mb-4"
                                    >
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {selectedRecord?.subject.name}
                                            </h3>
                                            <div className="flex items-center mt-0.5 space-x-1.5">
                                                <span className="text-xs text-gray-700 font-mono bg-gray-100 px-1.5 py-0.5 rounded">{selectedRecord?.subject.code}</span>
                                                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                                <span className="text-xs font-bold text-blue-600">{selectedRecord?.average}% Average</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={closeModal}
                                            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                                        >
                                            <XMarkIcon className="w-5 h-5" />
                                        </button>
                                    </Dialog.Title>

                                    <div className="mt-2">
                                        <div className="overflow-hidden rounded-lg border border-gray-200">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead>
                                                    <tr className="bg-gray-50">
                                                        <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase">Assessment</th>
                                                        <th className="px-3 py-2 text-center text-xs font-bold text-gray-700 uppercase">Max Score</th>
                                                        <th className="px-3 py-2 text-right text-xs font-bold text-gray-700 uppercase">Score</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 bg-white">
                                                    {selectedRecord?.marks.length > 0 ? (
                                                        selectedRecord.marks.map((mark, mIndex) => (
                                                            <tr key={mIndex} className="hover:bg-blue-50">
                                                                <td className="px-3 py-2 text-sm font-semibold text-gray-900">
                                                                    {mark.assessment_name}
                                                                </td>
                                                                <td className="px-3 py-2 text-sm text-gray-700 font-semibold text-center">
                                                                    {mark.max_score}
                                                                </td>
                                                                <td className="px-3 py-2 text-right">
                                                                    {mark.is_submitted ? (
                                                                        <span className={`font-bold text-sm ${mark.score >= mark.max_score * 0.9 ? 'text-green-600' : 'text-gray-900'}`}>
                                                                            {mark.score}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-gray-900 font-bold text-sm">
                                                                            0
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="3" className="px-3 py-6 text-center text-gray-600 text-sm font-medium">
                                                                No assessments recorded yet.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex justify-end">
                                        <button
                                            type="button"
                                            className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
