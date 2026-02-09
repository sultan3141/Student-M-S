import { Head, Link } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { MagnifyingGlassIcon, UserCircleIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Index({ students }) {
    return (
        <TeacherLayout>
            <Head title="My Students" />

            <div className="py-8 bg-gray-50/50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                                STUDENT <span className="text-blue-600 uppercase">Directory</span>
                            </h1>
                            <div className="mt-2 flex items-center text-sm font-medium">
                                <Link href={route('teacher.dashboard')} className="text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest text-[10px] font-black">
                                    Dashboard
                                </Link>
                                <svg className="mx-2 h-3 w-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="text-gray-600 uppercase tracking-widest text-[10px] font-black">Student List</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full sm:w-72 pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl leading-5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xl shadow-gray-200/40"
                                    placeholder="SEARCH STUDENTS..."
                                />
                            </div>
                            <Link
                                href={route('teacher.students.manage-results')}
                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:translate-y-[-2px]"
                            >
                                <ClipboardDocumentCheckIcon className="w-4 h-4 mr-2" />
                                Manage Results
                            </Link>
                        </div>
                    </div>

                    {/* Students Table Card */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Student Information</th>
                                        <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Class / Section</th>
                                        <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Academic Perf.</th>
                                        <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Attendance</th>
                                        <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                        <th scope="col" className="relative px-8 py-5">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-50">
                                    {students.map((student) => (
                                        <tr key={student.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-12 w-12 flex-shrink-0">
                                                        <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-lg font-black group-hover:rotate-6 transition-transform">
                                                            {student.name.charAt(0)}
                                                        </div>
                                                    </div>
                                                    <div className="ml-5">
                                                        <div className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{student.name}</div>
                                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">ID: #{student.id + 1000}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <span className="px-3 py-1.5 inline-flex text-[10px] font-black uppercase tracking-widest rounded-xl bg-gray-100 text-gray-700">
                                                    {student.class}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-sm font-black text-gray-900 tracking-tight">{student.average_score}%</div>
                                                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-600 rounded-full"
                                                            style={{ width: `${student.average_score}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap text-xs font-bold text-gray-500 uppercase">
                                                {student.attendance}% Rate
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <span className={`px-4 py-1.5 inline-flex text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm
                                                    ${student.status === 'Excellent' ? 'bg-green-100 text-green-700' :
                                                        student.status === 'Critical' ? 'bg-red-100 text-red-700' :
                                                            'bg-blue-100 text-blue-700'}`}>
                                                    {student.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap text-right">
                                                <Link
                                                    href={route('teacher.students.show', student.id)}
                                                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <ChevronRightIcon className="h-5 w-5" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
