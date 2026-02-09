/**
 * User Distribution Bar Chart
 * Compares headcount across different school roles.
 */
import React from 'react';
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

export default function UserDistributionBarChart({ data, title = "Instructor - Student" }) {
    // Expected data format: [{ name: 'Instructor', value: 100 }, ...]

    return (
        <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden" style={{ minHeight: '400px' }}>
            {/* Blue Premium Header */}
            <div className="flex items-center justify-between px-4 py-2" style={{ backgroundColor: '#007BFF' }}>
                <h3 className="text-white text-base font-normal">
                    Bar Chart [ {title} ]
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
                <ResponsiveContainer width="100%" height={320}>
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="name"
                            axisLine={{ stroke: '#9CA3AF' }}
                            tickLine={false}
                            tick={{ fill: '#4B5563', fontSize: 13 }}
                        />
                        <YAxis
                            axisLine={{ stroke: '#9CA3AF' }}
                            tickLine={false}
                            tick={{ fill: '#4B5563', fontSize: 12 }}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E5E7EB',
                                borderRadius: '4px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            }}
                        />
                        <Bar
                            dataKey="value"
                            barSize={100}
                            animationDuration={1500}
                        >
                            {data?.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill="#5998C5" />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
