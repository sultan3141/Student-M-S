import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from 'recharts';

export default function StudentDonutChart({ data, title }) {
    const COLORS = {
        Male: '#3B82F6',    // Blue
        Female: '#EC4899',  // Pink
    };

    const total = data.male + data.female;

    const chartData = [
        { name: 'Male', value: data.male, percent: data.malePercent },
        { name: 'Female', value: data.female, percent: data.femalePercent },
    ];

    const renderLabel = (entry) => {
        return `${entry.value} (${entry.percent}%)`;
    };

    return (
        <div className="executive-card">
            <h3 className="text-lg font-semibold text-navy-900 mb-4" style={{ color: '#0F172A' }}>
                {title}
            </h3>

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={renderLabel}
                        labelLine={{ stroke: '#9CA3AF', strokeWidth: 1 }}
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
                        formatter={(value, name) => [`${value} students`, name]}
                    />
                    <Legend
                        iconType="circle"
                        wrapperStyle={{ paddingTop: '10px' }}
                    />
                </PieChart>
            </ResponsiveContainer>

            {/* Center Stats */}
            <div className="mt-4 text-center pt-4 border-t border-gray-200">
                <div className="text-3xl font-bold text-navy-900" style={{ color: '#0F172A' }}>
                    {total}
                </div>
                <div className="text-xs text-gray-600 mt-1">Total Students</div>
                <div className="mt-2 flex justify-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.Male }}></div>
                        <span className="font-medium">{data.male}</span>
                        <span className="text-gray-500">({data.malePercent}%)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.Female }}></div>
                        <span className="font-medium">{data.female}</span>
                        <span className="text-gray-500">({data.femalePercent}%)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
