import { Head } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';

export default function DashboardTest() {
    return (
        <TeacherLayout>
            <Head title="Teacher Dashboard Test" />
            <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard Test</h1>
                <p className="mt-4 text-gray-600">If you can see this, the layout is working!</p>
            </div>
        </TeacherLayout>
    );
}
