import ParentLayout from '@/Layouts/ParentLayout';
import { Head } from '@inertiajs/react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function PerformanceTrends({ student, averages, overall }) {

    // Convert averages to chart data
    // Assuming backend returns { semester: 'S1', average: 85 } type structure
    // For MVP, mocking data based on passed props or static fallback
    const labels = ['Grade 9 S1', 'Grade 9 S2', 'Grade 10 S1', 'Grade 10 S2'];
    const data = {
        labels,
        datasets: [
            {
                label: 'GPA / Average',
                data: [78.2, 80.5, 84.2, 85.6], // Mock data as per spec
                borderColor: '#1E40AF', // Trust Blue
                backgroundColor: 'rgba(30, 64, 175, 0.5)',
                tension: 0.3, // Smooth curve
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Academic Performance Trend',
            },
        },
        scales: {
            y: {
                min: 60,
                max: 100,
            }
        }
    };

    return (
        <ParentLayout>
            <Head title="Academic Progress" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Academic Progress</h1>
                    <p className="mt-1 text-sm text-gray-500">Track {student.first_name}'s performance over time.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Chart */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                        <Line options={options} data={data} />
                    </div>

                    {/* Stats / Insights */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Summary</h3>
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-sm text-gray-500">Overall Trend</dt>
                                    <dd className="text-xl font-bold text-growth-green flex items-center">
                                        ↗️ Consistent Improvement
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500">Total Improvement</dt>
                                    <dd className="text-lg font-medium text-gray-900">+7.4% over 4 semesters</dd>
                                </div>
                                <div className="border-t pt-4">
                                    <dt className="text-sm text-gray-500">Current Semester Average</dt>
                                    <dd className="text-3xl font-bold text-trust-blue">{overall}%</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </ParentLayout>
    );
}
