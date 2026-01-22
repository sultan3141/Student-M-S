import { Head } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import ClassPerformanceAnalytics from '@/Components/Analytics/ClassPerformanceAnalytics';
import { useState } from 'react';

export default function AnalyticsIndex({ classes }) {
    const [selectedClass, setSelectedClass] = useState(classes[0]);

    return (
        <TeacherLayout>
            <Head title="Performance Analytics" />

            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Performance Analytics</h1>
                    <p className="text-gray-600 mt-1">Deep dive into class and student performance metrics.</p>
                </div>
                <div>
                    <select
                        className="block w-full md:w-64 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={selectedClass.id}
                        onChange={(e) => setSelectedClass(classes.find(c => c.id == e.target.value))}
                    >
                        {classes.map(cls => (
                            <option key={cls.id} value={cls.id}>{cls.name} - {cls.subject}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-gray-50/50 p-1 rounded-3xl">
                <ClassPerformanceAnalytics classId={selectedClass.id} />
            </div>

        </TeacherLayout>
    );
}
