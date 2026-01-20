import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head } from '@inertiajs/react';

export default function Reports() {
    return (
        <SuperAdminLayout>
            <Head title="Reports & Analytics" />

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reports & Analytics</h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="text-center py-12">
                    <p className="text-gray-500">Reports and analytics functionality will be implemented here.</p>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
