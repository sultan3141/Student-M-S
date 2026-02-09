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
            <Head title={`${student.name} - Performance Profile`} />

            <div className="py-8 bg-gray-50/50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs & Actions */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                                <Link href={route('teacher.dashboard')} className="hover:text-blue-600 transition-colors">Directory</Link>
                                <span className="mx-2 text-gray-300">/</span>
                                <span className="text-gray-900">Student Profile</span>
                            </div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                                STUDENT <span className="text-blue-600">PROFILE</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="inline-flex items-center px-6 py-3 bg-white text-gray-700 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all shadow-xl shadow-gray-200/40">
                                <EnvelopeIcon className="w-4 h-4 mr-2 text-blue-500" />
                                Contact Student
                            </button>
                        </div>
                    </div>

                    {/* Profile Header Card */}
                    <div className="relative overflow-hidden bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/60 border border-gray-100 p-8 md:p-12 mb-8 group">
                        <div className="absolute top-0 right-0 -m-16 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-colors duration-700"></div>

                        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <div className="h-32 w-32 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-5xl font-black text-white shadow-2xl shadow-blue-200 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                    {student.name.charAt(0)}
                                </div>
                                <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-green-500 border-4 border-white rounded-2xl shadow-lg flex items-center justify-center">
                                    <AcademicCapIcon className="w-5 h-5 text-white" />
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-4">
                                    <span className="px-4 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                                        Active Student
                                    </span>
                                    <span className="px-4 py-1.5 bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                                        ID: #{student.id + 1000}
                                    </span>
                                </div>
                                <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2 uppercase">{student.name}</h2>
                                <p className="text-lg font-bold text-gray-400 uppercase tracking-widest">{student.class} Student</p>

                                <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-8">
                                    <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                                            <EnvelopeIcon className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Email Address</p>
                                            <p>{student.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                                            <AcademicCapIcon className="w-5 h-5 text-indigo-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Parent Email</p>
                                            <p>{student.parent_email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Average Card */}
                            <div className="flex-shrink-0 w-full md:w-auto">
                                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2rem] text-center shadow-2xl shadow-blue-200 transform md:rotate-3 hover:rotate-0 transition-transform duration-500">
                                    <p className="text-[10px] font-black text-blue-100 uppercase tracking-[0.2em] mb-2">Overall Average</p>
                                    <div className="text-5xl font-black text-white tracking-tighter mb-1">
                                        {student.average || '0'}<span className="text-2xl opacity-50">%</span>
                                    </div>
                                    <div className="mt-4 flex items-center justify-center gap-2">
                                        <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></span>
                                        <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">Top 5% of Class</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                        {/* Performance Chart Card */}
                        <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                                    <ArrowTrendingUpIcon className="w-6 h-6 text-blue-600" />
                                    Performance Analytics
                                </h3>
                                <div className="flex gap-2">
                                    <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                        Personal
                                    </span>
                                    <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                        Class Average
                                    </span>
                                </div>
                            </div>
                            <div className="h-[300px] w-full">
                                <Line data={chartData} options={{ ...chartOptions, maintainAspectRatio: false }} />
                            </div>
                        </div>

                        {/* Subject Breakdown Card */}
                        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3 mb-8">
                                <AcademicCapIcon className="w-6 h-6 text-indigo-600" />
                                Subject Grades
                            </h3>
                            <div className="space-y-4">
                                {subjects.map((subject, idx) => (
                                    <div key={idx} className="group relative bg-gray-50/50 rounded-2xl p-5 border border-gray-100/50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300">
                                        <div className="flex items-center justify-between relative z-10">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{subject.code || 'SUB'}</p>
                                                <h4 className="font-black text-gray-900 tracking-tight uppercase">{subject.subject}</h4>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-black text-gray-900 tracking-tighter">{subject.score}%</div>
                                                <div className="mt-1 w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-600 rounded-full"
                                                        style={{ width: `${subject.score}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
