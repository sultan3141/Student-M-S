import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ProgressOverview({ student, averages, overall }) {
    const data = {
        labels: averages.map(a => a.subject),
        datasets: [
            {
                label: 'Average Score',
                data: averages.map(a => a.average),
                backgroundColor: 'rgba(79, 70, 229, 0.6)',
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 1,
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
                text: 'Subject Performance',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
            },
        },
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <Head title={`${student.user?.name} - Progress`} />

            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Academic Progress: {student.user?.name}</h1>
                    <Link href={route('parent.dashboard')} className="text-indigo-600 hover:text-indigo-900 font-semibold">
                        &larr; Back to Dashboard
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                        <dt className="text-sm font-medium text-gray-500 truncate">Overall Average</dt>
                        <dd className="mt-1 text-3xl font-semibold text-indigo-600">{overall}%</dd>
                    </div>
                    {/* Add more cards for attendance or behaviour if/when available */}
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                    <Bar options={options} data={data} />
                </div>
            </div>
        </div>
    );
}
