import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import ClassPerformanceAnalytics from '@/Components/Analytics/ClassPerformanceAnalytics';
import {
    ChartBarSquareIcon,
    ChevronDownIcon,
    AcademicCapIcon
} from '@heroicons/react/24/outline';

export default function AnalyticsIndex({ classes }) {
    const [selectedClass, setSelectedClass] = useState(classes[0]);

    return (
        <TeacherLayout>
            <Head title="Performance Analytics" />

            {/* Premium Header / Hero */}
            <div className="bg-gradient-to-br from-[#1E293B] to-[#334155] shadow-lg mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden group">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                </div>

                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-indigo-500/20 rounded-2xl backdrop-blur-md border border-indigo-400/30">
                                <ChartBarSquareIcon className="w-5 h-5 text-indigo-400" />
                            </div>
                            <span className="text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px]">Neural Intelligence</span>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight leading-none">
                            PERFORMANCE <span className="text-indigo-400">ANALYTICS</span>
                        </h1>
                        <p className="mt-4 text-slate-400 font-medium max-w-xl">
                            Deep dive into class and student performance metrics with high-fidelity data visualization.
                        </p>
                    </div>

                    <div className="relative group/select">
                        <label className="absolute -top-3 left-6 px-2 bg-[#1E293B] text-[10px] font-black text-indigo-400 uppercase tracking-widest z-20">
                            Active Lens
                        </label>
                        <div className="relative">
                            <select
                                className="appearance-none block w-full md:w-72 pl-8 pr-12 py-5 bg-white/5 border-2 border-white/10 rounded-[28px] text-white text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400/50 transition-all cursor-pointer backdrop-blur-md"
                                value={selectedClass.id}
                                onChange={(e) => setSelectedClass(classes.find(c => c.id == e.target.value))}
                            >
                                {classes.map(cls => (
                                    <option key={cls.id} value={cls.id} className="bg-slate-800 text-white">
                                        {cls.name} • {cls.subject}
                                    </option>
                                ))}
                            </select>
                            <ChevronDownIcon className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 pointer-events-none group-hover/select:translate-y-[-2px] transition-transform" />
                            <AcademicCapIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400/50 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pb-12">
                <div className="bg-white/50 backdrop-blur-sm rounded-[48px] border-2 border-gray-100/50 p-2 shadow-sm">
                    <div className="bg-white rounded-[42px] border-2 border-gray-50 overflow-hidden shadow-inner">
                        <ClassPerformanceAnalytics classId={selectedClass.id} />
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
