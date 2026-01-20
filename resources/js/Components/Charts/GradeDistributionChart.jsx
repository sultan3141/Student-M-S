import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

export default function GradeDistributionChart({ data }) {
    // Colors for grades 9, 10, 11, 12
    const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'];

    return (
        <div className="executive-card">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
                Grade-Level Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#F1F5F9" />
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: '#F8FAFC' }}
                        contentStyle={{
                            backgroundColor: '#FFFFFF',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            padding: '12px'
                        }}
                        labelStyle={{ color: '#1E293B', fontWeight: 700, marginBottom: '4px' }}
                        itemStyle={{ color: '#3B82F6', fontSize: '13px' }}
                    />
                    <Bar
                        dataKey="count"
                        radius={[0, 8, 8, 0]}
                        barSize={32}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            <div className="mt-6 grid grid-cols-2 gap-3">
                {data.map((item, index) => (
                    <div key={item.name} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-2 h-8 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <div>
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.name}</div>
                            <div className="text-sm font-bold text-gray-900">{item.count} Students</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
