import React from 'react';
import ParentLayout from '@/Layouts/ParentLayout';
import { Head, router } from '@inertiajs/react';
import { UserGroupIcon, CheckCircleIcon, AcademicCapIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

export default function Children({ students, selectedStudentId }) {
    const handleStudentSelect = (studentId) => {
        router.post(route('parent.children.select'), {
            student_id: studentId
        }, {
            preserveScroll: true,
        });
    };

    return (
        <ParentLayout>
            <Head title="My Children" />

            <div className="space-y-8">
                {/* Premium Header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#3b82f6] rounded-3xl p-8 text-white shadow-2xl border border-white/10">
                    <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-3">
                            <UserGroupIcon className="h-8 w-8 text-blue-100" />
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase">
                                My Children
                            </h1>
                        </div>
                        <p className="text-blue-100 text-sm font-medium">
                            Select a child to view their academic records and attendance
                        </p>
                    </div>
                </div>

                {students && students.length > 0 ? (
                    <>
                        {/* Student Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {students.map((student) => {
                                const isSelected = selectedStudentId == student.id;

                                return (
                                    <div
                                        key={student.id}
                                        onClick={() => handleStudentSelect(student.id)}
                                        className={`relative group cursor-pointer bg-white rounded-3xl p-8 shadow-sm border transition-all duration-300 ${isSelected
                                                ? 'border-indigo-200 ring-4 ring-indigo-100 shadow-xl'
                                                : 'border-gray-100 hover:border-indigo-100 hover:shadow-lg hover:-translate-y-1'
                                            }`}
                                    >
                                        {/* Selected Badge */}
                                        {isSelected && (
                                            <div className="absolute top-4 right-4 z-10">
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-full shadow-lg">
                                                    <CheckCircleSolid className="h-4 w-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Avatar */}
                                        <div className="flex flex-col items-center mb-6">
                                            <div className={`relative mb-4 transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-105'
                                                }`}>
                                                <div className={`w-24 h-24 rounded-full p-1 ${isSelected
                                                        ? 'bg-gradient-to-tr from-indigo-500 to-blue-500'
                                                        : 'bg-gradient-to-tr from-gray-200 to-gray-300 group-hover:from-indigo-400 group-hover:to-blue-400'
                                                    } shadow-xl transition-all`}>
                                                    <img
                                                        src={student.user?.profile_photo_url || `https://ui-avatars.com/api/?name=${student.user?.name}&background=random&color=fff&size=200`}
                                                        alt={student.user?.name}
                                                        className="w-full h-full rounded-full object-cover border-4 border-white"
                                                    />
                                                </div>
                                                {/* Status Indicator */}
                                                <div className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-4 border-white ${isSelected ? 'bg-green-500' : 'bg-gray-300'
                                                    } shadow-lg`}></div>
                                            </div>

                                            {/* Student Info */}
                                            <h3 className="text-xl font-black text-gray-900 text-center mb-2 uppercase tracking-tight">
                                                {student.user?.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="px-3 py-1 bg-gray-50 text-gray-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-gray-100">
                                                    {student.grade?.name}
                                                </span>
                                                <span className="px-3 py-1 bg-gray-50 text-gray-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-gray-100">
                                                    {student.section?.name}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Student Details */}
                                        <div className="space-y-3 pt-6 border-t border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Student ID</span>
                                                <span className="text-sm font-black text-gray-900">{student.student_id}</span>
                                            </div>
                                            {student.user?.email && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</span>
                                                    <span className="text-xs font-bold text-gray-600 truncate max-w-[150px]">{student.user.email}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Button */}
                                        <button
                                            className={`mt-6 w-full py-3 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all ${isSelected
                                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                                    : 'bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-100'
                                                }`}
                                        >
                                            {isSelected ? 'Currently Selected' : 'Select Child'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Help Card */}
                        {selectedStudentId && (
                            <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-green-100 rounded-xl text-green-600">
                                        <CheckCircleIcon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-green-900 mb-1">Child Selected Successfully</h3>
                                        <p className="text-xs text-green-700 leading-relaxed">
                                            You can now view their academic records, attendance, schedule, and payment history using the sidebar navigation.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    /* Empty State */
                    <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <UserGroupIcon className="h-12 w-12 text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-3 uppercase tracking-tight">No Children Linked</h2>
                        <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed mb-8">
                            We couldn't find any children linked to your account. Please contact the school Registrar if this is an error.
                        </p>
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-400 rounded-2xl text-xs font-bold uppercase tracking-widest">
                            <AcademicCapIcon className="h-5 w-5" />
                            Contact Registrar
                        </div>
                    </div>
                )}
            </div>
        </ParentLayout>
    );
}
