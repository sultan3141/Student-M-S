import React, { useState } from 'react';
import RegistrarLayout from '@/Layouts/RegistrarLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function Index({ payments, stats, filters }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        student_search: '',
        amount: '',
        type: 'Monthly',
        status: 'Paid',
        academic_year_id: 1, // Defaulting to 1 for now, ideally passed from prop
        notes: '',
    });

    const [paymentMode, setPaymentMode] = useState('Cash'); // Cash, Bank, Mobile

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('registrar.payments.store'), {
            onSuccess: () => reset(),
        });
    };

    // Helper to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    return (
        <RegistrarLayout user={null}> {/* User handled by layout hook usually */}
            <Head title="Fee Collection Center" />

            <div className="space-y-6">

                {/* Header & Stats */}
                <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
                    <div className="bg-[#228B22] px-6 py-4 border-b border-[#D4AF37] flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <span className="mr-2">💰</span> MANUAL FEE COLLECTION CENTER
                        </h2>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setPaymentMode('Cash')}
                                className={`px-3 py-1 rounded text-xs font-bold ${paymentMode === 'Cash' ? 'bg-[#D4AF37] text-black' : 'bg-blue-800 text-blue-200'}`}
                            >
                                ● Cash
                            </button>
                            <button
                                onClick={() => setPaymentMode('Bank')}
                                className={`px-3 py-1 rounded text-xs font-bold ${paymentMode === 'Bank' ? 'bg-[#D4AF37] text-black' : 'bg-blue-800 text-blue-200'}`}
                            >
                                ○ Bank Deposit
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                        <div className="p-4 text-center">
                            <span className="text-gray-500 text-xs font-bold uppercase">Collected Today</span>
                            <div className="text-2xl font-bold text-[#228B22]">{formatCurrency(stats.todayCollected)}</div>
                        </div>
                        <div className="p-4 text-center">
                            <span className="text-gray-500 text-xs font-bold uppercase">Pending Transactions</span>
                            <div className="text-2xl font-bold text-[#D97706]">{stats.pendingCount}</div>
                        </div>
                        <div className="p-4 text-center">
                            <span className="text-gray-500 text-xs font-bold uppercase">Month Total</span>
                            <div className="text-2xl font-bold text-[#1E40AF]">{formatCurrency(stats.monthlyCollected)}</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Quick Payment Entry Form */}
                    <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <h3 className="font-bold text-[#1F2937] text-sm md:text-base">QUICK PAYMENT ENTRY</h3>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Student Search</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={data.student_search}
                                        onChange={e => setData('student_search', e.target.value)}
                                        className="w-full pl-8 border-gray-300 rounded shadow-sm focus:border-[#228B22] focus:ring-[#228B22] text-sm"
                                        placeholder="Enter Student ID (e.g. 2025-9-1234)"
                                    />
                                    <span className="absolute left-2.5 top-2 text-gray-400">🔍</span>
                                </div>
                                {errors.student_search && <p className="text-red-500 text-xs mt-1">{errors.student_search}</p>}
                            </div>

                            <div className="p-3 bg-blue-50 rounded border border-blue-100 text-xs text-blue-800">
                                <p><strong>Fee Info:</strong> Annual Fee ($1,200)</p>
                                <p className="mt-1">Assuming current student for now. Enter ID above to link payment.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Amount ($)</label>
                                <input
                                    type="number"
                                    value={data.amount}
                                    onChange={e => setData('amount', e.target.value)}
                                    className="w-full border-gray-300 rounded shadow-sm focus:border-[#228B22] focus:ring-[#228B22] text-xl font-bold text-right"
                                    placeholder="0.00"
                                />
                                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Payment For</label>
                                    <select
                                        value={data.type}
                                        onChange={e => setData('type', e.target.value)}
                                        className="w-full border-gray-300 rounded shadow-sm focus:border-[#228B22] focus:ring-[#228B22] text-sm"
                                    >
                                        <option value="Monthly">Monthly Tuition</option>
                                        <option value="Semester">Semester Fee</option>
                                        <option value="Annual">Annual Fee</option>
                                        <option value="Books">Books/Materials</option>
                                        <option value="Uniform">Uniform</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Status</label>
                                    <select
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value)}
                                        className="w-full border-gray-300 rounded shadow-sm focus:border-[#228B22] focus:ring-[#228B22] text-sm"
                                    >
                                        <option value="Paid">Paid ✅</option>
                                        <option value="Pending">Pending ⏳</option>
                                        <option value="Partial">Partial 🌓</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#228B22] hover:bg-green-700 text-white font-bold py-3 px-4 rounded shadow-md transition-colors flex justify-center items-center"
                            >
                                {processing ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    <>
                                        <span className="mr-2">🖨️</span> Record & Print Receipt
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Transaction History */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-bold text-[#1F2937] text-sm md:text-base">RECENT TRANSACTIONS</h3>
                            <button className="text-xs text-blue-600 font-bold hover:underline">View All History</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {payments.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-gray-500 italic">
                                                No payments recorded recently. Use the form to add one.
                                            </td>
                                        </tr>
                                    ) : (
                                        payments.data.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {payment.student?.user?.name || 'Unknown'}
                                                    <span className="block text-xs text-gray-500">{payment.student?.student_id}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.type}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(payment.transaction_date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${payment.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                                            payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                                        {payment.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                                                    {formatCurrency(payment.amount)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </RegistrarLayout>
    );
}
