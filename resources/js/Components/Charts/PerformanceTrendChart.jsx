import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

export default function PerformanceTrendChart({ data }) {
    return (
        <div className="h-full w-full flex flex-col">
            {data && data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="year"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94A3B8', fontSize: 9, fontWeight: 700 }}
                            hide={false}
                        />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0F172A',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#FFF',
                                fontSize: '10px'
                            }}
                            cursor={{ stroke: '#10B981', strokeWidth: 1 }}
                        />
                        <Area
                            type="step"
                            dataKey="average"
                            stroke="#10B981"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorTrend)"
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Evolution Data</span>
                </div>
            )}
        </div>
    );
}
