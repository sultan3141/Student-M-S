import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';

export default function StudentPerformanceChart({ marks, currentAverage, currentRank }) {
    // Prepare data for the chart
    const chartData = marks && marks.length > 0
        ? marks.slice(0, 6).map(mark => ({
<<<<<<< HEAD
            subject: mark.subject.length > 12 ? mark.subject.substring(0, 10) + '...' : mark.subject,
            score: mark.percentage,
            fullSubject: mark.subject,
=======
            subject: (mark.subject || 'Unknown').length > 12 ? (mark.subject || 'Unknown').substring(0, 10) + '...' : (mark.subject || 'Unknown'),
            score: mark.percentage || 0,
            fullSubject: mark.subject || 'Unknown',
>>>>>>> c3c2e32 (Final sync: Integrated all premium Teacher/Parent portal components and configurations)
        }))
        : [];

    // Color bars based on score
    const getBarColor = (score) => {
        if (score >= 90) return '#10B981'; // Green
        if (score >= 75) return '#3B82F6'; // Blue
        if (score >= 60) return '#F59E0B'; // Yellow
        return '#EF4444'; // Red
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Academic Performance</h3>
                    <p className="text-xs text-slate-500">Recent subject analytics</p>
                </div>
            </div>

            <div className="min-h-[300px]">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis
                                dataKey="subject"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748B', fontSize: 11 }}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                            />
                            <YAxis
                                domain={[0, 100]}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748B', fontSize: 11 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                }}
                                formatter={(value, name, props) => [`${value}%`, props.payload.fullSubject]}
                            />
                            <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[300px]">
                        <div className="text-6xl mb-4">📊</div>
                        <p className="text-sm font-medium text-slate-400">No performance data yet</p>
                        <p className="text-xs text-slate-300 mt-1">Scores will appear here</p>
                    </div>
                )}
            </div>

            {/* Quick Summary */}
            {chartData.length > 0 && (
                <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                            <span className="text-lg">⭐</span>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">Average</div>
                            <div className="text-sm font-bold text-slate-900">{currentAverage.toFixed(1)}%</div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                            <span className="text-lg">🏆</span>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">Rank</div>
                            <div className="text-sm font-bold text-slate-900">#{currentRank}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
