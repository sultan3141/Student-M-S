import { Head } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { EnvelopeIcon, AcademicCapIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function Show({ student, history, subjects }) {
    const chartData = {
        labels: history.map(h => h.assessment),
        datasets: [
            {
                label: 'Student Score',
                data: history.map(h => h.score),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Class Average',
                data: history.map(h => h.average),
                borderColor: 'rgb(156, 163, 175)',
                borderDash: [5, 5],
                tension: 0.4,
            }
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: false },
        },
        scales: {
            y: { min: 0, max: 100 }
        }
    };

    return (
        <TeacherLayout>
            <Head title={`${student.name} - Performance`} />

            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600">
                        {student.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
                        <p className="text-gray-500">Class {student.class} • ID: #{student.id + 1000}</p>
                        <div className="flex flex-wrap gap-4 mt-4">
                            <a href={`mailto:${student.email}`} className="flex items-center text-sm text-gray-600 hover:text-blue-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                                <EnvelopeIcon className="w-4 h-4 mr-2" />
                                {student.email}
                            </a>
                            <a href={`mailto:${student.parent_email}`} className="flex items-center text-sm text-gray-600 hover:text-blue-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                                <EnvelopeIcon className="w-4 h-4 mr-2" />
                                Parent: {student.parent_email}
                            </a>
                        </div>
                    </div>
                    <div className="text-center bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <p className="text-sm text-blue-600 font-semibold uppercase">Overall Average</p>
                        <p className="text-3xl font-black text-blue-800 mt-1">{student.average || '0'}%</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Performance Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center">
                            <ArrowTrendingUpIcon className="w-5 h-5 mr-2 text-blue-600" />
                            Performance Trend
                        </h2>
                    </div>
                    <Line data={chartData} options={chartOptions} />
                </div>

                {/* Subject Breakdown */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                        <AcademicCapIcon className="w-5 h-5 mr-2 text-purple-600" />
                        Subject Grades
                    </h2>
                    <div className="space-y-4">
                        {subjects.map((subject, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="font-medium text-gray-800">{subject.subject}</span>
                                <div className="flex items-center space-x-3">
                                    <span className="text-lg font-bold text-gray-800">{subject.score}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
