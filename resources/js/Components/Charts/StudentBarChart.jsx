import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

export default function StudentInstructorBarChart({ studentCount, instructorCount }) {
    const data = [
        {
            category: 'Students',
            count: studentCount,
            fill: '#3B82F6', // Blue
        },
        {
            category: 'Instructors',
            count: instructorCount,
            fill: '#10B981', // Green
        },
    ];

    return (
        <div className="executive-card">
            <h3 className="text-lg font-semibold text-navy-900 mb-4" style={{ color: '#0F172A' }}>
                Students vs Instructors
            </h3>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                        dataKey="category"
                        tick={{ fill: '#6B7280', fontSize: 14, fontWeight: 600 }}
                        tickLine={{ stroke: '#9CA3AF' }}
                    />
                    <YAxis
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                        tickLine={{ stroke: '#9CA3AF' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                        labelStyle={{ color: '#0F172A', fontWeight: 600 }}
                        formatter={(value) => [`${value}`, 'Count']}
                    />
                    <Bar
                        dataKey="count"
                        radius={[12, 12, 0, 0]}
                        label={{ position: 'top', fill: '#0F172A', fontWeight: 600 }}
                    >
                        {data.map((entry, index) => (
                            <Bar key={`bar-${index}`} dataKey="count" fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            {/* Stats Summary */}
            <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{studentCount}</div>
                    <div className="text-sm text-gray-600 mt-1">Total Students</div>
                </div>
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <div className="text-3xl font-bold text-emerald-600">{instructorCount}</div>
                    <div className="text-sm text-gray-600 mt-1">Total Instructors</div>
                </div>
            </div>
        </div>
    );
}
