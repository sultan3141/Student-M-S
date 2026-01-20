import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';

export default function PerformanceTrendChart({ data }) {
    return (
        <div className="executive-card">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
                Academic Performance Momentum
            </h3>

            {data && data.length > 0 ? (
                <div className="space-y-6">
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis
                                dataKey="year"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }}
                                dy={10}
                            />
                            <YAxis
                                domain={[0, 100]}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94A3B8', fontSize: 11 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1E293B',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: '#FFF'
                                }}
                                itemStyle={{ color: '#60A5FA' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="average"
                                stroke="#3B82F6"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorAvg)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>

                    <div className="grid grid-cols-1 gap-2">
                        {data.map((perf, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                                        {perf.year.split('-')[0]}
                                    </div>
                                    <span className="text-sm font-bold text-gray-700">{perf.year}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-black text-blue-700">{perf.average}%</span>
                                    <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest">Yearly Avg</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14" />
                        </svg>
                    </div>
                    <h4 className="text-sm font-bold text-gray-500 mb-1">No Historical Data</h4>
                    <p className="text-xs text-gray-400">Complete your first academic year to see performance trends.</p>
                </div>
            )}
        </div>
    );
}
