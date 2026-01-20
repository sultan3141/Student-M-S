import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function FeesFinance() {
    const [activeTab, setActiveTab] = useState('structure');

    const feeStructure = [
        { grade: 'Grade 1-8', tuition: '7,500 Birr', registration: '500 Birr', books: '1,600 Birr', uniform: '1,500 Birr', total: '10,500 Birr', frequency: 'Annual' },
        { grade: 'Grade 9-10', tuition: '9,000 Birr', registration: '500 Birr', books: '1,500 Birr', uniform: '1,500 Birr', total: '12,500 Birr', frequency: 'Annual' },
        { grade: 'Grade 11-12', tuition: '10,500 Birr', registration: '500 Birr', books: '2,000 Birr', uniform: '1,500 Birr', total: '14,500 Birr', frequency: 'Annual' },
    ];

    const paymentPlans = [
        {
            name: 'One-Time Payment',
            description: 'Pay full amount at once',
            discount: '5% discount applied',
            color: 'green'
        },
        {
            name: 'Semester Plan',
            description: 'Pay in 2 installments',
            discount: '50% at start of each semester',
            color: 'blue'
        },
        {
            name: 'Monthly Plan',
            description: 'Pay in 10 installments',
            discount: 'Total monthly payments',
            color: 'purple'
        },
    ];

    return (
        <SuperAdminLayout>
            <Head title="Fees & Finance Management" />

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Fees & Finance Management</h2>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('structure')}
                        className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'structure'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Fee Structure
                    </button>
                    <button
                        onClick={() => setActiveTab('tracking')}
                        className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'tracking'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Payment Tracking
                    </button>
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'pending'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Pending Dues
                    </button>
                    <button
                        onClick={() => setActiveTab('receipts')}
                        className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'receipts'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Receipts
                    </button>
                </div>

                {activeTab === 'structure' && (
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Academic Year 2024/2025 Fee Structure</h3>
                                <p className="text-sm text-gray-500 mt-1">Configure fees for different grade levels</p>
                            </div>
                            <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                                + Add Fee Category
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Grade Level</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tuition</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Registration</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Books</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Uniform</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Frequency</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {feeStructure.map((fee, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{fee.grade}</td>
                                            <td className="px-6 py-4 text-gray-700">{fee.tuition}</td>
                                            <td className="px-6 py-4 text-gray-700">{fee.registration}</td>
                                            <td className="px-6 py-4 text-gray-700">{fee.books}</td>
                                            <td className="px-6 py-4 text-gray-700">{fee.uniform}</td>
                                            <td className="px-6 py-4 font-bold text-gray-900">{fee.total}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                                    {fee.frequency}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-8">
                            <h4 className="font-bold text-gray-900 mb-4">Available Payment Plans</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {paymentPlans.map((plan, index) => (
                                    <div key={index} className={`p-6 bg-${plan.color}-50 border border-${plan.color}-100 rounded-xl`}>
                                        <h5 className={`font-bold text-${plan.color}-900 mb-2`}>{plan.name}</h5>
                                        <p className={`text-sm text-${plan.color}-700 mb-1`}>{plan.description}</p>
                                        <p className={`text-xs text-${plan.color}-600`}>{plan.discount}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'tracking' && (
                    <div className="p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Tracking</h3>
                        <p className="text-gray-500">Payment tracking functionality will be implemented here.</p>
                    </div>
                )}

                {activeTab === 'pending' && (
                    <div className="p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Pending Dues</h3>
                        <p className="text-gray-500">Pending dues management will be implemented here.</p>
                    </div>
                )}

                {activeTab === 'receipts' && (
                    <div className="p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Receipts</h3>
                        <p className="text-gray-500">Receipt generation and management will be implemented here.</p>
                    </div>
                )}
            </div>
        </SuperAdminLayout>
    );
}
