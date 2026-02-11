import React from 'react';
import ParentLayout from '@/Layouts/ParentLayout';
import { Head } from '@inertiajs/react';
import { CalendarDaysIcon, ClockIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

export default function Schedule({ student = {}, schedule = {} }) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    return (
        <ParentLayout>
            <Head title={`Schedule - ${student.first_name} ${student.last_name}`} />

            <div className="space-y-8">
                {/* Premium Header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#3b82f6] rounded-3xl p-8 text-white shadow-2xl border border-white/10">
                    <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-3">
                            <CalendarDaysIcon className="h-8 w-8 text-blue-100" />
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase">
                                Weekly Schedule
                            </h1>
                        </div>
                        <p className="text-blue-100 text-sm font-medium">
                            {student.first_name} {student.last_name} • {student.grade?.name} {student.section?.name}
                        </p>
                    </div>
                </div>

                {/* Weekly Timeline View */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {days.map((day) => {
                        const daySchedule = schedule[day] || [];
                        const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day;

                        return (
                            <div
                                key={day}
                                className={`bg-white rounded-3xl p-6 shadow-sm border transition-all ${isToday ? 'border-indigo-200 ring-2 ring-indigo-100' : 'border-gray-100'
                                    }`}
                            >
                                {/* Day Header */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">
                                            {day}
                                        </h2>
                                        {isToday && (
                                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-[8px] font-black uppercase tracking-widest rounded-full">
                                                Today
                                            </span>
                                        )}
                                    </div>
                                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${isToday ? 'bg-indigo-600' : 'bg-gray-200'} rounded-full`} style={{ width: '100%' }}></div>
                                    </div>
                                </div>

                                {/* Schedule Items */}
                                <div className="space-y-3">
                                    {daySchedule.length > 0 ? (
                                        daySchedule.map((item, index) => {
                                            const isBreak = item.type === 'break' ||
                                                item.activity?.toLowerCase().includes('break') ||
                                                item.activity?.toLowerCase().includes('lunch');

                                            return (
                                                <div
                                                    key={index}
                                                    className={`group p-4 rounded-2xl border transition-all ${isBreak
                                                        ? 'bg-amber-50/50 border-amber-100 hover:bg-amber-50'
                                                        : 'bg-gray-50/50 border-gray-100 hover:bg-white hover:shadow-md'
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-3 mb-2">
                                                        <div className={`p-2 rounded-lg ${isBreak ? 'bg-amber-100 text-amber-600' : 'bg-indigo-50 text-indigo-600'
                                                            }`}>
                                                            {isBreak ? (
                                                                <ClockIcon className="w-4 h-4" />
                                                            ) : (
                                                                <AcademicCapIcon className="w-4 h-4" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className={`font-bold text-sm truncate ${isBreak ? 'text-amber-800' : 'text-gray-900'
                                                                }`}>
                                                                {item.activity}
                                                            </h3>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                                {item.start_time?.substring(0, 5)} - {item.end_time?.substring(0, 5)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <CalendarDaysIcon className="w-6 h-6 text-gray-300" />
                                            </div>
                                            <p className="text-xs text-gray-400 font-medium">No classes</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Info Footer */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                            <CalendarDaysIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-blue-900 mb-1">Weekly Class Schedule</h3>
                            <p className="text-xs text-blue-700 leading-relaxed">
                                This is your child's complete weekly schedule. Classes are organized by day with time slots clearly marked.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ParentLayout>
    );
}
