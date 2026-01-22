import ParentLayout from '@/Layouts/ParentLayout';
import { Head } from '@inertiajs/react';
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function SchoolContact({ contacts }) {
    return (
        <ParentLayout>
            <Head title="School Contact" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Parent Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500">Welcome, Hassan Ahmed</p>
                </div>

                {/* School Contact Information */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">School Contact Information</h2>

                    {/* School Administration */}
                    <div className="mb-8">
                        <h3 className="text-md font-semibold text-gray-800 mb-4">School Administration</h3>
                        <div className="space-y-4">
                            {/* President */}
                            <div className="border-l-4 border-indigo-500 pl-4 py-2">
                                <p className="text-sm font-medium text-gray-500">President</p>
                                <p className="text-base font-semibold text-gray-900 mt-1">Dr. Ahmed Ibrahim</p>
                                <div className="flex items-center mt-2 text-sm text-gray-600">
                                    <PhoneIcon className="h-4 w-4 mr-2" />
                                    <span>Phone: +251-111-234567</span>
                                </div>
                            </div>

                            {/* Vice President */}
                            <div className="border-l-4 border-indigo-500 pl-4 py-2">
                                <p className="text-sm font-medium text-gray-500">Vice President</p>
                                <p className="text-base font-semibold text-gray-900 mt-1">Mr. Yasin Ahmed</p>
                                <div className="flex items-center mt-2 text-sm text-gray-600">
                                    <PhoneIcon className="h-4 w-4 mr-2" />
                                    <span>Phone: +251-111-234569</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Registration Office */}
                    <div className="mb-8">
                        <h3 className="text-md font-semibold text-gray-800 mb-4">Registration Office</h3>
                        <div className="border-l-4 border-indigo-500 pl-4 py-2">
                            <p className="text-base font-semibold text-gray-900">Registrar Ahmed</p>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <PhoneIcon className="h-4 w-4 mr-2" />
                                    <span>Phone: +251-111-234570</span>
                                </div>
                                <div className="flex items-center">
                                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                                    <span>Email: registrar@school.edu.et</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Teachers Contact - Fatima Hassan's Classes */}
                    <div>
                        <h3 className="text-md font-semibold text-gray-800 mb-4">Teachers Contact - Fatima Hassan's Classes</h3>
                        <div className="space-y-3">
                            {/* Teacher Aisha */}
                            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                                <div>
                                    <p className="text-base font-semibold text-gray-900">Teacher Aisha</p>
                                    <p className="text-sm text-gray-600">Mathematics & Science</p>
                                </div>
                                <span className="text-sm text-gray-700">+251-911-345678</span>
                            </div>

                            {/* Teacher Ibrahim */}
                            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                                <div>
                                    <p className="text-base font-semibold text-gray-900">Teacher Ibrahim</p>
                                    <p className="text-sm text-gray-600">English</p>
                                </div>
                                <span className="text-sm text-gray-700">+251-911-345679</span>
                            </div>

                            {/* Teacher Fatima */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-base font-semibold text-gray-900">Teacher Fatima</p>
                                    <p className="text-sm text-gray-600">Social Studies</p>
                                </div>
                                <span className="text-sm text-gray-700">+251-911-345680</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ParentLayout>
    );
}
