import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import DirectorLayout from '@/Layouts/DirectorLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import {
    PlusIcon,
    TrashIcon,
    AcademicCapIcon,
    UserGroupIcon,
    BookOpenIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

export default function TeacherAssignments({ teachers, grades, subjects, academicYears }) {
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedGradeSections, setSelectedGradeSections] = useState([]);
    const [confirmingDeletion, setConfirmingDeletion] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        teacher_id: '',
        subject_id: '',
        grade_id: '',
        section_id: '',
        academic_year_id: academicYears[0]?.id || '',
    });

    const handleGradeChange = async (gradeId) => {
        setData('grade_id', gradeId);
        setData('section_id', ''); // Reset section when grade changes
        
        if (gradeId) {
            try {
                const response = await axios.get(`/director/grades/${gradeId}/sections`);
                setSelectedGradeSections(response.data);
            } catch (error) {
                console.error('Error fetching sections:', error);
                setSelectedGradeSections([]);
            }
        } else {
            setSelectedGradeSections([]);
        }
    };

    const handleAssign = (e) => {
        e.preventDefault();
        post(route('director.teacher.assign'), {
            onSuccess: () => {
                reset();
                setShowAssignModal(false);
                setSelectedGradeSections([]);
            },
        });
    };

    const handleDelete = (assignmentId) => {
        if (confirmingDeletion === assignmentId) {
            // Perform deletion
            router.delete(route('director.teacher.assignment.remove', assignmentId), {
                onSuccess: () => setConfirmingDeletion(null),
            });
        } else {
            setConfirmingDeletion(assignmentId);
        }
    };

    return (
        <DirectorLayout>
            <Head title="Teacher Assignments" />

            {/* Header */}
            <div className="bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] shadow-lg mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-10">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                        👨‍🏫 Teacher Assignments
                    </h1>
                    <p className="text-blue-100 text-lg">
                        Bind teachers to specific grades, sections, and subjects
                    </p>
                </div>
            </div>

            {/* Add Assignment Button */}
            <div className="mb-6">
                <PrimaryButton onClick={() => setShowAssignModal(true)}>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Assign Teacher
                </PrimaryButton>
            </div>

            {/* Teachers List */}
            <div className="space-y-6">
                {teachers.map((teacher) => (
                    <div key={teacher.id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{teacher.name}</h3>
                                <p className="text-gray-600">{teacher.email}</p>
                                {teacher.employee_id && (
                                    <p className="text-sm text-gray-500">ID: {teacher.employee_id}</p>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Assignments</p>
                                <p className="text-2xl font-bold text-blue-600">{teacher.assignments.length}</p>
                            </div>
                        </div>

                        {/* Assignments */}
                        {teacher.assignments.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {teacher.assignments.map((assignment) => (
                                    <div key={assignment.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center mb-2">
                                                    <BookOpenIcon className="w-5 h-5 text-blue-500 mr-2" />
                                                    <span className="font-semibold text-gray-900">{assignment.subject}</span>
                                                </div>
                                                <div className="flex items-center mb-1">
                                                    <AcademicCapIcon className="w-4 h-4 text-gray-500 mr-2" />
                                                    <span className="text-sm text-gray-600">{assignment.grade}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <UserGroupIcon className="w-4 h-4 text-gray-500 mr-2" />
                                                    <span className="text-sm text-gray-600">{assignment.section}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(assignment.id)}
                                                className={`ml-2 p-1 rounded transition-colors ${
                                                    confirmingDeletion === assignment.id
                                                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                        : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                                                }`}
                                                title={confirmingDeletion === assignment.id ? 'Click again to confirm' : 'Remove assignment'}
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <AcademicCapIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>No assignments yet</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Assignment Modal */}
            <Modal show={showAssignModal} onClose={() => setShowAssignModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Assign Teacher to Class
                    </h2>

                    <form onSubmit={handleAssign} className="space-y-4">
                        {/* Teacher Selection */}
                        <div>
                            <InputLabel htmlFor="teacher_id" value="Teacher" />
                            <select
                                id="teacher_id"
                                value={data.teacher_id}
                                onChange={(e) => setData('teacher_id', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            >
                                <option value="">Select Teacher</option>
                                {teachers.map((teacher) => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.name} ({teacher.email})
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.teacher_id} className="mt-2" />
                        </div>

                        {/* Subject Selection */}
                        <div>
                            <InputLabel htmlFor="subject_id" value="Subject" />
                            <select
                                id="subject_id"
                                value={data.subject_id}
                                onChange={(e) => setData('subject_id', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            >
                                <option value="">Select Subject</option>
                                {subjects.map((subject) => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject.name} ({subject.code})
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.subject_id} className="mt-2" />
                        </div>

                        {/* Grade Selection */}
                        <div>
                            <InputLabel htmlFor="grade_id" value="Grade" />
                            <select
                                id="grade_id"
                                value={data.grade_id}
                                onChange={(e) => handleGradeChange(e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            >
                                <option value="">Select Grade</option>
                                {grades.map((grade) => (
                                    <option key={grade.id} value={grade.id}>
                                        {grade.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.grade_id} className="mt-2" />
                        </div>

                        {/* Section Selection */}
                        <div>
                            <InputLabel htmlFor="section_id" value="Section" />
                            <select
                                id="section_id"
                                value={data.section_id}
                                onChange={(e) => setData('section_id', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                                disabled={!data.grade_id}
                            >
                                <option value="">Select Section</option>
                                {selectedGradeSections.map((section) => (
                                    <option key={section.id} value={section.id}>
                                        {section.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.section_id} className="mt-2" />
                        </div>

                        {/* Academic Year Selection */}
                        <div>
                            <InputLabel htmlFor="academic_year_id" value="Academic Year" />
                            <select
                                id="academic_year_id"
                                value={data.academic_year_id}
                                onChange={(e) => setData('academic_year_id', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            >
                                <option value="">Select Academic Year</option>
                                {academicYears.map((year) => (
                                    <option key={year.id} value={year.id}>
                                        {year.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.academic_year_id} className="mt-2" />
                        </div>

                        <InputError message={errors.assignment} className="mt-2" />

                        <div className="flex items-center justify-end space-x-3 pt-4">
                            <SecondaryButton onClick={() => setShowAssignModal(false)}>
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton type="submit" disabled={processing}>
                                {processing ? 'Assigning...' : 'Assign Teacher'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </DirectorLayout>
    );
}