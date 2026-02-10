/**
 * Student Donut Chart Component
 * Visualizes academic assessment distribution using dynamic data.
 */
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from 'recharts';
import { ChartBarIcon } from '@heroicons/react/24/outline';

/**
 * Functional component for the dynamic assessment donut chart.
 * @param {Object} props - The component props.
 * @returns {JSX.Element} The rendered chart component.
 */
export default function StudentDonutChart({ data, title = "Assessment Distribution" }) {
    const COLORS = [
        '#6366F1', // Indigo
        '#10B981', // Emerald
        '#F59E0B', // Amber
        '#EF4444', // Red
        '#8B5CF6', // Purple
        '#EC4899', // Pink
    ];

    // Handle dynamic data from assessmentDistribution
    const chartData = (data?.labels || []).map((label, index) => ({
        name: label,
        value: data?.values?.[index] || 0,
        percentage: data?.percentages?.[index] || 0
    })).filter(item => item.value > 0);

    const total = data?.total || 0;

    return (
        <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden" style={{ minHeight: '400px' }}>
            {/* Red Premium Header */}
            <div className="flex items-center justify-between px-4 py-2" style={{ backgroundColor: '#D33724' }}>
                <h3 className="text-white text-base font-normal">
                    Donut Chart [ {title} ]
                </h3>
                <div className="flex items-center space-x-2 text-white opacity-80">
                    <button className="hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                    </button>
                    <button className="hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="p-6">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Legend
                                verticalAlign="top"
                                align="center"
                                iconType="rect"
                                iconSize={12}
                                wrapperStyle={{ paddingBottom: '20px' }}
                                formatter={(value) => (
                                    <span className="text-xs text-gray-600 ml-1">{value}</span>
                                )}
                            />
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={110}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                }}
                                formatter={(value, name, props) => {
                                    const percent = props.payload.percentage;
                                    return [`${value} (${percent}%)`, name];
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                        <ChartBarIcon className="w-12 h-12 mb-2 opacity-20" />
                        <p className="text-sm">No assessment data available</p>
                    </div>
                )}
            </div>
        </div>
    );
}
