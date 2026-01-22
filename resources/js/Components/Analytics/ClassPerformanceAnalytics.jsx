import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement);

/**
 * ClassPerformanceAnalytics Component
 * Renders interactive charts for class performance analysis using Chart.js.
 * Displays:
 * - Key Metrics Grid (Average, Pass Rate, Top Performer)
 * - Score Distribution Bar Chart
 * - Historical Trend Line Chart
 */
export default function ClassPerformanceAnalytics({ classId }) {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(route('teacher.analytics.class', { classId }));
            const result = await response.json();
            setData(result);
        };
        fetchData();
    }, [classId]);

    if (!data) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading analytics...</div>;

    const distributionData = {
        labels: ['90-100%', '80-89%', '70-79%', '60-69%', '50-59%', '0-49%'],
        datasets: [{
            label: 'Number of Students',
            data: [
                data.distribution['90-100'],
                data.distribution['80-89'],
                data.distribution['70-79'],
                data.distribution['60-69'],
                data.distribution['50-59'],
                data.distribution['0-49']
            ],
            backgroundColor: ['#10B981', '#34D399', '#60A5FA', '#FBBF24', '#FCD34D', '#EF4444'],
            borderRadius: 6,
        }]
    };

    const trendData = {
        labels: data.trends.dates,
        datasets: [{
            label: 'Class Average Trend',
            data: data.trends.scores,
            borderColor: '#6366F1',
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            tension: 0.4,
            fill: true
        }]
    };

    return (
        <div className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Class Average</p>
                    <p className="text-2xl font-bold text-gray-900">{data.metrics.classAverage}%</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Pass Rate</p>
                    <p className="text-2xl font-bold text-green-600">{data.metrics.passRate}%</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Top Performer</p>
                    <p className="text-lg font-bold text-indigo-600 truncate">{data.metrics.topPerformer.name}</p>
                    <p className="text-xs text-indigo-400">{data.metrics.topPerformer.score}%</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-xs font-semibold text-red-500 uppercase">Needs Attention</p>
                    <p className="text-2xl font-bold text-red-600">{data.metrics.needsAttention} <span className="text-sm font-normal text-gray-500">students</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Distribution Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Performance Distribution</h3>
                    <div className="h-64">
                        <Bar options={{ maintainAspectRatio: false }} data={distributionData} />
                    </div>
                </div>

                {/* Trend Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Average Score Trend</h3>
                    <div className="h-64">
                        <Line options={{ maintainAspectRatio: false }} data={trendData} />
                    </div>
                </div>
            </div>
        </div>
    );
}
