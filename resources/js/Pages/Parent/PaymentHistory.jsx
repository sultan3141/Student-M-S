import ParentLayout from '@/Layouts/ParentLayout';
import { Head } from '@inertiajs/react';
import { BanknotesIcon, CheckCircleIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function PaymentHistory({ student, payments = [] }) {
    // Calculate total paid
    const totalPaid = payments.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0);

    return (
        <ParentLayout>
            <Head title="Payment History" />

            <div className="space-y-8">
                {/* Premium Header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#3b82f6] rounded-3xl p-8 text-white shadow-2xl border border-white/10">
                    <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-3">
                            <BanknotesIcon className="h-8 w-8 text-blue-100" />
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase">
                                Payment History
                            </h1>
                        </div>
                        <p className="text-blue-100 text-sm font-medium">
                            {student?.user?.name || 'Student'} • Transaction Records
                        </p>
                    </div>
                </div>

                {/* Balance Summary Card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Payment Summary</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-green-100 rounded-xl text-green-600">
                                    <CheckCircleIcon className="h-5 w-5" />
                                </div>
                                <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Total Paid</span>
                            </div>
                            <p className="text-3xl font-black text-green-700">{totalPaid.toLocaleString()} <span className="text-lg font-bold">Birr</span></p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                                    <DocumentTextIcon className="h-5 w-5" />
                                </div>
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Transactions</span>
                            </div>
                            <p className="text-3xl font-black text-blue-700">{payments.length}</p>
                        </div>
                        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-100">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-gray-100 rounded-xl text-gray-600">
                                    <ClockIcon className="h-5 w-5" />
                                </div>
                                <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Last Payment</span>
                            </div>
                            <p className="text-sm font-bold text-gray-700">
                                {payments.length > 0
                                    ? new Date(payments[0].transaction_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                    : 'No payments yet'
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Transaction List */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Transaction History</h2>
                    </div>

                    {payments && payments.length > 0 ? (
                        <div className="divide-y divide-gray-50">
                            {payments.map((payment, index) => (
                                <div
                                    key={payment.id}
                                    className="p-8 hover:bg-gray-50/50 transition-colors group"
                                >
                                    <div className="flex items-center justify-between gap-6">
                                        {/* Left: Date & Description */}
                                        <div className="flex items-center gap-6 flex-1">
                                            <div className="flex-shrink-0">
                                                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                                                    <BanknotesIcon className="h-7 w-7" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-base font-bold text-gray-900 mb-1">
                                                    {payment.type || 'Tuition Payment'}
                                                </h3>
                                                <div className="flex items-center gap-3 text-xs">
                                                    <span className="font-bold text-gray-400 uppercase tracking-widest">
                                                        {new Date(payment.transaction_date).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                                    <span className="font-bold text-gray-400 uppercase tracking-widest">
                                                        Receipt: {payment.receipt_no || `RCP-${new Date(payment.transaction_date).getFullYear()}-${String(payment.id).padStart(3, '0')}`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Amount */}
                                        <div className="flex-shrink-0 text-right">
                                            <div className="text-2xl font-black text-green-600 mb-1">
                                                {parseFloat(payment.amount).toLocaleString()} <span className="text-sm font-bold">Birr</span>
                                            </div>
                                            <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 text-[9px] font-black uppercase tracking-widest rounded-full border border-green-100">
                                                <CheckCircleIcon className="h-3 w-3 mr-1" />
                                                Completed
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="p-16 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <DocumentTextIcon className="h-10 w-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">No Payment History</h3>
                            <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                                No payments have been recorded for this student yet. Transactions will appear here once processed.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </ParentLayout>
    );
}
