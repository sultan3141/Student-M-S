import { useEffect, useState, useMemo } from 'react';
import { ChartBarIcon, TrophyIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

export default function PerformancePreview({ marks, maxScore = 100 }) {
    const stats = useMemo(() => {
        const validMarks = marks.filter(m => m !== null && m !== undefined && m !== '').map(Number);

        if (validMarks.length === 0) {
            return {
                average: 0,
                highest: 0,
                lowest: 0,
                passRate: 0,
                stdDeviation: 0,
                distribution: {
                    '0-49': 0,
                    '50-59': 0,
                    '60-69': 0,
                    '70-79': 0,
                    '80-89': 0,
                    '90-100': 0
                },
                totalEntered: 0
            };
        }

        const average = validMarks.reduce((a, b) => a + b, 0) / validMarks.length;
        const highest = Math.max(...validMarks);
        const lowest = Math.min(...validMarks);
        const passed = validMarks.filter(m => m >= 50).length;
        const passRate = (passed / validMarks.length) * 100;

        // Standard Deviation
        const variance = validMarks.reduce((acc, mark) => acc + Math.pow(mark - average, 2), 0) / validMarks.length;
        const stdDeviation = Math.sqrt(variance);

        // Distribution
        const distribution = {
            '0-49': validMarks.filter(m => m >= 0 && m < 50).length,
            '50-59': validMarks.filter(m => m >= 50 && m < 60).length,
            '60-69': validMarks.filter(m => m >= 60 && m < 70).length,
            '70-79': validMarks.filter(m => m >= 70 && m < 80).length,
            '80-89': validMarks.filter(m => m >= 80 && m < 90).length,
            '90-100': validMarks.filter(m => m >= 90 && m <= 100).length
        };

        return {
            average: average.toFixed(2),
            highest,
            lowest,
            passRate: passRate.toFixed(1),
            stdDeviation: stdDeviation.toFixed(1),
            distribution,
            totalEntered: validMarks.length
        };
    }, [marks]);

    const maxCount = Math.max(...Object.values(stats.distribution));

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <ChartBarIcon className="w-6 h-6 mr-2 text-blue-600" />
                📈 Performance Preview
            </h3>

            {stats.totalEntered === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <ChartBarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                        Enter marks to see live statistics and distribution
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                            <p className="text-xs text-blue-600 font-semibold mb-1">Average</p>
                            <p className="text-2xl font-bold text-blue-900">{stats.average}%</p>
                        </div>

                        <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                            <p className="text-xs text-green-600 font-semibold mb-1 flex items-center">
                                <TrophyIcon className="w-3 h-3 mr-1" />
                                Highest
                            </p>
                            <p className="text-2xl font-bold text-green-900">{stats.highest}%</p>
                        </div>

                        <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                            <p className="text-xs text-red-600 font-semibold mb-1 flex items-center">
                                <ArrowTrendingDownIcon className="w-3 h-3 mr-1" />
                                Lowest
                            </p>
                            <p className="text-2xl font-bold text-red-900">{stats.lowest}%</p>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                            <p className="text-xs text-purple-600 font-semibold mb-1">Pass Rate</p>
                            <p className="text-2xl font-bold text-purple-900">{stats.passRate}%</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-500">
                            <p className="text-xs text-gray-600 font-semibold mb-1">Std Dev</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.stdDeviation}</p>
                        </div>
                    </div>

                    {/* Distribution Chart */}
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-4">Distribution</h4>
                        <div className="space-y-3">
                            {Object.entries(stats.distribution).map(([range, count]) => {
                                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                                const color = (() => {
                                    if (range === '0-49') return 'bg-red-500';
                                    if (range === '50-59') return 'bg-orange-500';
                                    if (range === '60-69') return 'bg-yellow-500';
                                    if (range === '70-79') return 'bg-blue-500';
                                    if (range === '80-89') return 'bg-green-500';
                                    return 'bg-emerald-500';
                                })();

                                return (
                                    <div key={range} className="flex items-center space-x-3">
                                        <div className="w-20 text-sm font-semibold text-gray-700">
                                            {range}
                                        </div>
                                        <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                                            <div
                                                className={`${color} h-full rounded-full transition-all duration-500 ease-out flex items-center px-3`}
                                                style={{ width: `${percentage}%` }}
                                            >
                                                {count > 0 && (
                                                    <span className="text-white text-sm font-bold">
                                                        {count}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-16 text-right text-sm text-gray-600">
                                            {count > 0 ? `${((count / stats.totalEntered) * 100).toFixed(0)}%` : ''}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold">Summary:</span> {stats.totalEntered} marks entered •
                            Average: <span className="font-bold text-blue-700">{stats.average}%</span> •
                            Pass Rate: <span className="font-bold text-green-700">{stats.passRate}%</span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
