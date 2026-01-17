import { Head, Link, useForm } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import {
    AcademicCapIcon,
    ClipboardDocumentCheckIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

/**
 * Marks Index Page
 * Allows teachers to select a class and assessment type to begin entering marks.
 * Matches data provided by TeacherMarkController::index.
 */
export default function Index({ classes, assessmentTypes }) {
    const [selectedAssessment, setSelectedAssessment] = useState(assessmentTypes[0]?.id || '');

    return (
        <TeacherLayout>
            <Head title="Mark Management" />

            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900">Mark Management</h1>
                <p className="text-gray-600 mt-1">Select a class to enter or view marks.</p>
            </div>

            {/* Assessment Selection */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 max-w-xl">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Assessment Type</label>
                <select
                    value={selectedAssessment}
                    onChange={(e) => setSelectedAssessment(e.target.value)}
                    className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    {assessmentTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name} ({type.weight_percentage}%)</option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">
                    Choose the assessment you are currently grading.
                </p>
            </div>

            {/* Class Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                    <div key={cls.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                                    <AcademicCapIcon className="w-8 h-8 text-indigo-600" />
                                </div>
                                <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                    {cls.subject}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{cls.name}</h3>
                            <p className="text-gray-500 text-sm mb-6">42 Students Enrolled</p>

                            <Link
                                href={route('teacher.marks.create', {
                                    class_id: cls.id,
                                    assessment_type_id: selectedAssessment,
                                    subject: cls.subject
                                })}
                                className="flex items-center justify-center w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                            >
                                <ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" />
                                Enter Marks
                                <ArrowRightIcon className="w-4 h-4 ml-2 opacity-70" />
                            </Link>
                        </div>
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                            <span>Last updated: 2 days ago</span>
                            <span className="font-medium text-green-600">Active</span>
                        </div>
                    </div>
                ))}
            </div>

            {classes.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No classes assigned yet.</p>
                </div>
            )}
        </TeacherLayout>
    );
}
