import StudentLayout from '@/Layouts/StudentLayout';
import { Head } from '@inertiajs/react';

export default function Rankings({ auth, student, leaderboard, academicYear }) {
    const currentUserRank = leaderboard.find(item => item.is_current_user);

    return (
        <StudentLayout auth={auth} title="Class Rankings" student={student}>
            <Head title="Class Rankings" />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white text-center shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold mb-2">🏆 Class Leaderboard</h1>
                        <p className="text-purple-100 mb-6">Live rankings for {academicYear?.name || 'Current Year'} • {student?.grade?.name} - {student?.section?.name}</p>

                        {currentUserRank && (
                            <div className="transform scale-110 inline-block bg-white/20 backdrop-blur-sm rounded-xl px-8 py-4 border border-white/30">
                                <p className="text-sm font-medium uppercase tracking-wider text-purple-200">Your Current Rank</p>
                                <p className="text-5xl font-black mt-1">#{currentUserRank.rank}</p>
                                <p className="text-sm mt-1">Avg: {currentUserRank.average}%</p>
                            </div>
                        )}
                    </div>
                    {/* Decorative Circles */}
                    <div className="absolute top-0 left-0 -ml-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 right-0 -mr-10 -mb-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                </div>

                {/* Leaderboard Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800">Top Performers</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4 text-center w-24">Rank</th>
                                    <th className="px-6 py-4 text-left">Student</th>
                                    <th className="px-6 py-4 text-right">Average Score</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {leaderboard.map((item, index) => (
                                    <tr key={index} className={`transition hover:bg-gray-50 ${item.is_current_user ? 'bg-purple-50 hover:bg-purple-100' : ''}`}>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center items-center h-8 w-8 mx-auto rounded-full font-bold text-sm bg-gray-100 text-gray-600">
                                                {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : item.rank}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${item.is_current_user ? 'bg-purple-200 text-purple-700' : 'bg-gray-200 text-gray-600'
                                                    }`}>
                                                    {item.student_name.charAt(0)}
                                                </div>
                                                <span className={`font-medium ${item.is_current_user ? 'text-purple-900' : 'text-gray-900'}`}>
                                                    {item.is_current_user ? 'You' : item.student_name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono font-bold text-gray-700">
                                            {item.average}%
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {index < 3 ? (
                                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 font-bold">Top 3</span>
                                            ) : (
                                                <span className="text-gray-400 text-xs">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {leaderboard.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                            No ranking data available yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
