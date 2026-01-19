import StudentLayout from '@/Layouts/StudentLayout';
import { Head } from '@inertiajs/react';

export default function Password() {
    return (
        <StudentLayout>
            <Head title="Change Password" />
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Change Password</h1>
                <p className="text-gray-500">Update your account password.</p>
                {/* Password update form will be implemented later */}
            </div>
        </StudentLayout>
    );
}
