import ParentLayout from '@/Layouts/ParentLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    UsersIcon,
    BookOpenIcon,
    AcademicCapIcon,
    ClockIcon,
    ExclamationCircleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function Dashboard({ children: propChildren }) {
    // Mock child data - in a real app this would come from props
    // The previous layout passed 'auth' but we can get it from usePage in layout or here
    const { auth } = usePage().props;

    const myChildren = [
        { id: 1, name: "Alice Johnson", grade: "10th Grade", gpa: "3.8", attendance: "98%", status: "Excellent" },
        { id: 2, name: "Bob Johnson", grade: "8th Grade", gpa: "3.2", attendance: "92%", status: "Good" }
    ];

    return (
        <ParentLayout>
            <Head title="Parent Dashboard" />

            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl shadow-lg p-8 mb-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>

                <h1 className="text-3xl font-bold mb-2 relative z-10">Overview</h1>
                <p className="text-purple-100 text-lg relative z-10">
                    Here is what is happening with your children’s education today.
                </p>
            </div>

            {/* Children Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {myChildren.map((child) => (
                    <div key={child.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xl">
                                    {child.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{child.name}</h3>
                                    <p className="text-sm text-gray-500">{child.grade}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${child.status === 'Excellent' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                {child.status}
                            </span>
                        </div>

                        <div className="p-6 grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">GPA</p>
                                <p className="text-xl font-bold text-gray-900">{child.gpa}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Attendance</p>
                                <p className="text-xl font-bold text-gray-900">{child.attendance}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Assignments</p>
                                <p className="text-xl font-bold text-gray-900">2 Due</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                            <button className="w-full py-2 text-sm text-purple-600 font-bold hover:text-purple-800 transition-colors">
                                View Full Report &rarr;
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity / Notifications */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Updates</h3>
                <div className="space-y-6">
                    <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <AcademicCapIcon className="w-4 h-4" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">Math Test Results Released</p>
                            <p className="text-sm text-gray-500 mt-0.5">Alice scored 92% on Algebra II Midterm.</p>
                            <p className="text-xs text-gray-400 mt-2">2 hours ago</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <ExclamationCircleIcon className="w-4 h-4" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">Fee Payment Due</p>
                            <p className="text-sm text-gray-500 mt-0.5">Tuition for Term 2 is due next week.</p>
                            <p className="text-xs text-gray-400 mt-2">Yesterday</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircleIcon className="w-4 h-4" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">Attendance Perfect Streak</p>
                            <p className="text-sm text-gray-500 mt-0.5">Bob has achieved 100% attendance this month!</p>
                            <p className="text-xs text-gray-400 mt-2">3 days ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </ParentLayout>
    );
}
