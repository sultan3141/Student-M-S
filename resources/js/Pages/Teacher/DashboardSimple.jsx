import { Head } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';

export default function DashboardSimple() {
    return (
        <TeacherLayout>
            <Head title="Teacher Dashboard" />
            
            <div className="bg-white rounded-lg shadow p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Teacher Dashboard - Simple Test
                </h1>
                <p className="text-gray-600">
                    If you can see this message, the basic React rendering is working.
                </p>
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
                    <p className="text-green-800 font-semibold">✓ TeacherLayout loaded successfully</p>
                    <p className="text-green-800 font-semibold">✓ Inertia is working</p>
                    <p className="text-green-800 font-semibold">✓ React is rendering</p>
                </div>
            </div>
        </TeacherLayout>
    );
}
