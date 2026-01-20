import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head } from '@inertiajs/react';

export default function AttendanceManagement() {
    return (
        <SuperAdminLayout>
            <Head title="Attendance Management" />

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Attendance Management</h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="text-center py-12">
                    <p className="text-gray-500">Attendance management functionality will be implemented here.</p>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
