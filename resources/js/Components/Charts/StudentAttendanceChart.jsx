import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

export default function StudentAttendanceChart({ attendanceRate, recentAttendance }) {
    const COLORS = {
        Present: '#10B981',   // Green
        Absent: '#EF4444',    // Red
        Late: '#F59E0B',      // Amber
        Excused: '#8B5CF6',   // Purple
    };

    // Calculate attendance breakdown
    const presentCount = recentAttendance?.filter(r => r.status === 'Present').length || 0;
    const absentCount = recentAttendance?.filter(r => r.status === 'Absent').length || 0;
    const lateCount = recentAttendance?.filter(r => r.status === 'Late').length || 0;
    const excusedCount = recentAttendance?.filter(r => r.status === 'Excused').length || 0;
    const total = presentCount + absentCount + lateCount + excusedCount;

    const chartData = [
        { name: 'Present', value: presentCount },
        { name: 'Absent', value: absentCount },
        { name: 'Late', value: lateCount },
        { name: 'Excused', value: excusedCount },
    ].filter(item => item.value > 0); // Only show non-zero values

    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text 
                x={x} 
                y={y} 
                fill="white" 
                textAnchor={x > cx ? 'start' : 'end'} 
                dominantBaseline="central"
                className="text-xs font-bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
                Attendance Overview
            </h3>

            {total > 0 ? (
                <>
                    <div className="relative">
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={3}
                                    dataKey="value"
                                    label={renderCustomLabel}
                                    labelLine={false}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#FFFFFF',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    }}
                                    formatter={(value) => [`${value} days`, '']}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Center Stats */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <div className="text-4xl font-bold text-slate-900">
                                {attendanceRate}%
                            </div>
                            <div className="text-xs text-slate-500 mt-1">Attendance</div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        {chartData.map((item, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <div 
                                    className="w-4 h-4 rounded-full flex-shrink-0" 
                                    style={{ backgroundColor: COLORS[item.name] }}
                                ></div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium text-slate-700 truncate">{item.name}</div>
                                    <div className="text-xs text-slate-500">{item.value} days</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-[300px]">
                    <div className="text-6xl mb-4">📅</div>
                    <p className="text-sm font-medium text-slate-400">No attendance records yet</p>
                    <p className="text-xs text-slate-300 mt-1">Attendance tracking will appear here</p>
                </div>
            )}
        </div>
    );
}
