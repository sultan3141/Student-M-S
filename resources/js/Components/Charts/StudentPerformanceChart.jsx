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

export default function StudentPerformanceChart({ marks = [], currentAverage, currentRank }) {
    // Prepare data for the chart
    const chartData = marks && marks.length > 0
        ? marks.slice(0, 6).map(mark => ({
            subject: (mark.subject || 'Unknown').length > 12 ? (mark.subject || 'Unknown').substring(0, 10) + '...' : (mark.subject || 'Unknown'),
            score: mark.percentage || 0,
            fullSubject: mark.subject || 'Unknown',
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
        <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
            {/* Navy Premium Header */}
            <div className="flex items-center justify-between px-4 py-2" style={{ backgroundColor: '#1E3A8A' }}>
                <h3 className="text-white text-base font-normal">
                    📊 Academic Performance [ Recent Scores ]
                </h3>
                <div className="flex items-center space-x-2 text-white opacity-80">
                    <button className="hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="p-4">
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

            </div>
        </div>
    );
}
