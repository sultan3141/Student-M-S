import { useState, useEffect } from 'react';
import DirectorLayout from '@/Layouts/DirectorLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import {
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';

export default function AcademicOverview({ overviewData = [], heatMapData = [] }) {
    const [performanceData, setPerformanceData] = useState(overviewData);
    const [heatMapDataState, setHeatMapData] = useState(heatMapData);
    const [loading, setLoading] = useState(false);

    // Removed useEffect and axios loading since data is passed as props

    const getScoreColor = (score) => {
        if (score >= 90) return 'bg-emerald-500';
        if (score >= 80) return 'bg-blue-500';
        if (score >= 70) return 'bg-amber-500';
        if (score >= 60) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const getScoreTextColor = (score) => {
        if (score >= 90) return 'text-emerald-600';
        if (score >= 80) return 'text-blue-600';
        if (score >= 70) return 'text-amber-600';
        if (score >= 60) return 'text-orange-600';
        return 'text-red-600';
    };

    return (
        <DirectorLayout>
            <Head title="Academic Command Center" />

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-navy-900" style={{ color: '#0F172A' }}>
                    📊 Academic Command Center
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                    Real-time performance metrics and analytics across all grades
                </p>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading analytics...</p>
                </div>
            ) : (
                <>
                    {/* Performance Metrics Table */}
                    <div className="executive-card mb-6">
                        <h2 className="text-xl font-semibold text-navy-900 mb-4" style={{ color: '#0F172A' }}>
                            Real-Time Performance Metrics
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">GRADE</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">AVG SCORE</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">PASS RATE</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">TOP SECTION</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">TREND</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {performanceData.map((grade, index) => (
                                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-4 font-medium text-gray-900">{grade.grade}</td>
                                            <td className="py-4 px-4">
                                                <span className={`font-semibold ${getScoreTextColor(grade.avgScore)}`}>
                                                    {grade.avgScore}%
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`${getScoreColor(grade.passRate)} h-2 rounded-full transition-all`}
                                                            style={{ width: `${grade.passRate}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">{grade.passRate}%</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-600">{grade.topSection}</td>
                                            <td className="py-4 px-4">
                                                {grade.trend === 'up' ? (
                                                    <div className="flex items-center text-emerald-600">
                                                        <ArrowTrendingUpIcon className="h-5 w-5 mr-1" />
                                                        <span className="text-sm font-medium">Improving</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center text-gray-400">
                                                        <ArrowTrendingDownIcon className="h-5 w-5 mr-1" />
                                                        <span className="text-sm font-medium">Stable</span>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Subject Heat Map */}
                    <div className="executive-card">
                        <h2 className="text-xl font-semibold text-navy-900 mb-4" style={{ color: '#0F172A' }}>
                            Subject Performance Heat Map
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">SUBJECT</th>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => (
                                            <th key={g} className="text-center py-3 px-2 text-xs font-semibold text-gray-700">G{g}</th>
                                        ))}
                                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">SCHOOL AVG</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {heatMapDataState.map((subject, index) => (
                                        <tr key={index} className="border-b border-gray-100">
                                            <td className="py-4 px-4 font-medium text-gray-900">{subject.subject}</td>
                                            <td className="py-4 px-4 font-medium text-gray-900">{subject.subject}</td>
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => {
                                                const score = subject[`grade_${grade}`] || 0;
                                                return (
                                                    <td key={grade} className="py-4 px-4 text-center">
                                                        <div
                                                            className={`inline-flex items-center justify-center w-16 h-8 rounded ${getScoreColor(score)} 
                                                                      bg-opacity-20 border-2 border-current`}
                                                            style={{ borderColor: getScoreColor(score).replace('bg-', '') }}
                                                        >
                                                            <span className={`font-semibold ${getScoreTextColor(score)}`}>
                                                                {score}
                                                            </span>
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                            <td className="py-4 px-4 text-center">
                                                <span className={`font-bold text-lg ${getScoreTextColor(subject.school_avg)}`}>
                                                    {subject.school_avg}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Legend */}
                        <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
                            <div className="flex items-center space-x-1">
                                <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                                <span>90-100%</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                <span>80-89%</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className="w-4 h-4 bg-amber-500 rounded"></div>
                                <span>70-79%</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                                <span>60-69%</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className="w-4 h-4 bg-red-500 rounded"></div>
                                <span>&lt;60%</span>
                            </div>
                        </div>
                    </div>

                    {/* Alert Panel */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-2xl">⚠️</span>
                                <span className="font-semibold text-amber-800">Below Target</span>
                            </div>
                            <p className="text-sm text-amber-700">0 sections below 70%</p>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-2xl">🎯</span>
                                <span className="font-semibold text-emerald-800">Top Performers</span>
                            </div>
                            <p className="text-sm text-emerald-700">{performanceData.length} grades excelling</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-2xl">📈</span>
                                <span className="font-semibold text-blue-800">Improving</span>
                            </div>
                            <p className="text-sm text-blue-700">
                                {performanceData.filter(g => g.trend === 'up').length} grades trending up
                            </p>
                        </div>
                    </div>
                </>
            )}
        </DirectorLayout>
    );
}
