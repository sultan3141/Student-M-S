import { useState, useEffect } from 'react';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon, TrophyIcon } from '@heroicons/react/24/solid';

export default function LiveRankingPreview({ classId, subject, initialData = null }) {
    const [rankings, setRankings] = useState(initialData?.rankings || []);
    const [stats, setStats] = useState(initialData?.stats || {});
    const [loading, setLoading] = useState(!initialData);

    useEffect(() => {
        if (!initialData) {
            fetchRankings();
        }
    }, [classId, subject]);

    const fetchRankings = async () => {
        try {
            setLoading(true);
            const response = await fetch(route('teacher.rankings.live', {
                classId,
                subject,
                semester: '1',
                academic_year: '2024-2025'
            }));
            const data = await response.json();
            setRankings(data.rankings);
            setStats(data.stats);
        } catch (error) {
            console.error('Failed to fetch rankings:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (position) => {
        switch (position) {
            case 1: return <span className="text-2xl">🥇</span>;
            case 2: return <span className="text-xl">🥈</span>;
            case 3: return <span className="text-xl">🥉</span>;
            default: return <span className="font-bold text-gray-500">#{position}</span>;
        }
    };

    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'up': return <ArrowUpIcon className="w-4 h-4 text-green-500" />;
            case 'down': return <ArrowDownIcon className="w-4 h-4 text-red-500" />;
            default: return <MinusIcon className="w-4 h-4 text-gray-400" />;
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading rankings...</div>;

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-white flex items-center">
                    <TrophyIcon className="w-5 h-5 mr-2 text-yellow-300" />
                    Live Ranking Preview
                </h2>
                <span className="text-xs font-semibold text-indigo-100 bg-white/20 px-2 py-1 rounded-lg">
                    {subject}
                </span>
            </div>

            <div className="p-6">
                <div className="mb-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Top 5 in Class</h3>
                    <div className="space-y-3">
                        {rankings.map((rank, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100 hover:border-gray-200">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 flex justify-center">
                                        {getRankIcon(rank.rank_position)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{rank.student?.user?.name || 'Unknown Student'}</p>
                                        <div className="flex items-center text-xs text-gray-500">
                                            {getTrendIcon(rank.trend)}
                                            <span className="ml-1 capitalize">{rank.trend}</span> since last exam
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-black text-indigo-600">{Number(rank.average_score).toFixed(1)}%</div>
                                </div>
                            </div>
                        ))}
                        {rankings.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">No marks entered yet.</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                    <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase">Class Avg</p>
                        <p className="text-xl font-bold text-gray-900">{stats.class_average}%</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase">Highest</p>
                        <p className="text-xl font-bold text-green-600">{stats.highest_score}%</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase">Pass Rate (≥50%)</p>
                        <p className="text-xl font-bold text-blue-600">
                            {Math.round((stats.above_80 + (stats.total_students - stats.above_80 - stats.below_50)) / (stats.total_students || 1) * 100)}%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
