import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
<<<<<<< HEAD
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
=======
    Cell,
} from 'recharts';

export default function StudentGlobalBarChart({ total, male, female }) {
    // Robust null guards
    const totalCount = total || 0;
    const maleCount = male || 0;
    const femaleCount = female || 0;

    const data = [
        {
            category: 'Total',
            count: totalCount,
            fill: 'url(#colorTotal)',
            color: '#10B981', // Emerald 500
        },
        {
            category: 'Male',
            count: maleCount,
            fill: 'url(#colorMale)',
            color: '#3B82F6', // Blue 500
        },
        {
            category: 'Female',
            count: femaleCount,
            fill: 'url(#colorFemale)',
            color: '#EF4444', // Red 500
>>>>>>> c3c2e32 (Final sync: Integrated all premium Teacher/Parent portal components and configurations)
        },
    ];

    return (
<<<<<<< HEAD
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
=======
        <div className="executive-card overflow-hidden transition-all hover:shadow-xl duration-300 border-none bg-white/70 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-black text-navy-900 tracking-tight" style={{ color: '#0F172A' }}>
                        School Population Analytics
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Global Enrollment Data</p>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
            </div>

            <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.9} />
                                <stop offset="95%" stopColor="#059669" stopOpacity={0.8} />
                            </linearGradient>
                            <linearGradient id="colorMale" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.9} />
                                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.8} />
                            </linearGradient>
                            <linearGradient id="colorFemale" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.9} />
                                <stop offset="95%" stopColor="#DC2626" stopOpacity={0.8} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis
                            dataKey="category"
                            tick={{ fill: '#64748B', fontSize: 11, fontWeight: 700 }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            tick={{ fill: '#94A3B8', fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(4px)',
                                border: 'none',
                                borderRadius: '12px',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                                padding: '12px'
                            }}
                            cursor={{ fill: '#F8FAFC', radius: 4 }}
                            itemStyle={{ fontWeight: 700, fontSize: '13px' }}
                            labelStyle={{ color: '#0F172A', fontWeight: 800, marginBottom: '4px' }}
                            formatter={(value) => [`${value}`, 'Students']}
                        />
                        <Bar
                            dataKey="count"
                            radius={[6, 6, 0, 0]}
                            barSize={44}
                            animationDuration={1500}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`bar-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Premium Summary Grid */}
            <div className="mt-6 grid grid-cols-3 gap-0 border-t border-gray-50 pt-2">
                <div className="text-center py-3">
                    <div className="text-2xl font-black text-emerald-600 leading-none">{totalCount}</div>
                    <div className="text-[9px] uppercase tracking-widest text-gray-400 font-extrabold mt-1">Total</div>
                </div>
                <div className="text-center border-x border-gray-50 py-3 bg-gray-50/30">
                    <div className="text-2xl font-black text-blue-600 leading-none">{maleCount}</div>
                    <div className="text-[9px] uppercase tracking-widest text-gray-400 font-extrabold mt-1">Male</div>
                </div>
                <div className="text-center py-3">
                    <div className="text-2xl font-black text-red-600 leading-none">{femaleCount}</div>
                    <div className="text-[9px] uppercase tracking-widest text-gray-400 font-extrabold mt-1">Female</div>
>>>>>>> c3c2e32 (Final sync: Integrated all premium Teacher/Parent portal components and configurations)
                </div>
            </div>
        </div>
    );
}
