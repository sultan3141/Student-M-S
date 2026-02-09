import React from 'react';
import { Head } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import PerformanceChart from '@/Components/Dashboard/PerformanceChart';
import {
    ChartBarIcon,
    ArrowDownTrayIcon,
    AcademicCapIcon,
    UserGroupIcon,
    ArrowTrendingUpIcon,
    PresentationChartLineIcon
} from '@heroicons/react/24/outline';

export default function Index({ statistics, subjectPerformance, classPassRate }) {
    return (
        <TeacherLayout>
            <Head title="Academic Reports" />

            {/* Premium Header / Hero */}
            <div className="bg-gradient-to-br from-[#1E293B] to-[#334155] shadow-lg mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden group">
                {/* Decorative background pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl transform translate-x-1/3 translate-y-1/3"></div>
                </div>

                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-500/20 rounded-xl backdrop-blur-md border border-blue-400/30">
                                <PresentationChartLineIcon className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="text-blue-400 font-black uppercase tracking-[0.2em] text-[10px]">Analytics Portal</span>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight leading-none">
                            ACADEMIC <span className="text-blue-500">REPORTS</span>
                        </h1>
                        <p className="mt-4 text-blue-100/60 font-medium max-w-lg">
                            Performance analytics and score distribution across all assigned classes. Use these insights to drive student success.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white px-6 py-4 rounded-2xl font-black text-sm transition-all flex items-center gap-3 shadow-xl group/btn">
                            <ArrowDownTrayIcon className="w-5 h-5 group-hover/btn:translate-y-0.5 transition-transform" />
                            EXPORT ANALYTICS
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Top Analytics Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Score Statistics - Large Card */}
                    <div className="lg:col-span-12 xl:col-span-7 bg-white p-8 rounded-[32px] border-2 border-gray-50 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Global Performance</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Weighted averages across sections</p>
                            </div>
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                <ArrowTrendingUpIcon className="h-6 w-6" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="relative group overflow-hidden">
                                <div className="absolute inset-0 bg-blue-500/5 group-hover:scale-110 transition-transform rounded-2xl"></div>
                                <div className="p-6 relative text-center">
                                    <div className="text-4xl font-black text-blue-600 mb-1 leading-none">{statistics?.average_score?.toFixed(1) || '0.0'}</div>
                                    <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Avg Grade</div>
                                </div>
                            </div>
                            <div className="relative group overflow-hidden">
                                <div className="absolute inset-0 bg-green-500/5 group-hover:scale-110 transition-transform rounded-2xl"></div>
                                <div className="p-6 relative text-center">
                                    <div className="text-4xl font-black text-green-600 mb-1 leading-none">{statistics?.high_performers || 0}</div>
                                    <div className="text-[10px] font-black text-green-400 uppercase tracking-widest">High (80+)</div>
                                </div>
                            </div>
                            <div className="relative group overflow-hidden">
                                <div className="absolute inset-0 bg-amber-500/5 group-hover:scale-110 transition-transform rounded-2xl"></div>
                                <div className="p-6 relative text-center">
                                    <div className="text-4xl font-black text-amber-500 mb-1 leading-none">{statistics?.passing_students || 0}</div>
                                    <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Passing</div>
                                </div>
                            </div>
                            <div className="relative group overflow-hidden">
                                <div className="absolute inset-0 bg-red-500/5 group-hover:scale-110 transition-transform rounded-2xl"></div>
                                <div className="p-6 relative text-center">
                                    <div className="text-4xl font-black text-red-600 mb-1 leading-none">{statistics?.failing_students || 0}</div>
                                    <div className="text-[10px] font-black text-red-400 uppercase tracking-widest">Low (&lt;60)</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between items-center px-4">
                            <div className="flex items-center gap-8">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Min. Score</span>
                                    <span className="text-lg font-black text-gray-700">{statistics?.min_score || 0}</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Max. Score</span>
                                    <span className="text-lg font-black text-gray-700">{statistics?.max_score || 0}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                <ChartBarIcon className="w-4 h-4" />
                                Interactive Stats
                            </div>
                        </div>
                    </div>

                    {/* Subject Performance - Visual List */}
                    <div className="lg:col-span-12 xl:col-span-5 bg-white p-8 rounded-[32px] border-2 border-gray-50 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Subject Matrix</h3>
                        </div>
                        <div className="space-y-6">
                            {subjectPerformance.map((subject, idx) => (
                                <div key={idx} className="space-y-3">
                                    <div className="flex justify-between items-end px-1">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-indigo-600 font-black text-xs">
                                                {subject.name.substring(0, 1)}
                                            </div>
                                            <span className="text-sm font-black text-gray-700 uppercase tracking-tight">{subject.name}</span>
                                        </div>
                                        <span className="text-sm font-black text-indigo-600 leading-none">{parseFloat(subject.average_score).toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-50 rounded-full h-4 overflow-hidden p-1 border border-gray-100">
                                        <div
                                            className="bg-indigo-600 h-full rounded-full transition-all duration-1000"
                                            style={{ width: `${subject.average_score}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Class Pass Rate Grid */}
                <div className="bg-white p-8 rounded-[40px] border-2 border-gray-50 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                <UserGroupIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-1">Pass Rate by Class</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Section specific success metrics</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {classPassRate.map((cls, idx) => {
                            const rate = parseFloat(cls.pass_rate);
                            const palette = rate >= 70 ? 'bg-green-50 text-green-600 border-green-100' : rate >= 50 ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-red-50 text-red-600 border-red-100';

                            return (
                                <div key={idx} className={`p-6 rounded-[28px] border-2 transition-all hover:scale-[1.03] duration-300 shadow-sm ${palette}`}>
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-3">{cls.class_name}</div>
                                    <div className="flex items-end gap-1 mb-4">
                                        <span className="text-4xl font-black leading-none">{rate.toFixed(1)}</span>
                                        <span className="text-lg font-black opacity-60">%</span>
                                    </div>
                                    <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden mb-2">
                                        <div
                                            className={`h-full rounded-full ${rate >= 70 ? 'bg-green-600' : rate >= 50 ? 'bg-amber-500' : 'bg-red-600'}`}
                                            style={{ width: `${rate}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-[9px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${rate >= 70 ? 'bg-green-600' : rate >= 50 ? 'bg-amber-500' : 'bg-red-600'}`}></div>
                                        {rate >= 70 ? 'Exceptional' : rate >= 50 ? 'Average' : 'Critical'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
