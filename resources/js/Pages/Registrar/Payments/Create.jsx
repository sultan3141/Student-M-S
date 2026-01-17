import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function CreatePayment({ auth, academicYear }) {
    const { data, setData, post, processing, errors } = useForm({
        student_search: '',
        amount: '',
        type: 'Monthly',
        status: 'Paid',
        academic_year_id: academicYear?.id || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('registrar.payments.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Record Manual Payment</h2>}
        >
            <Head title="Record Payment" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6 bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
                                <p className="text-sm text-blue-700">
                                    Current Academic Year: <strong>{academicYear?.name || 'None Active'}</strong>
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="student_search" value="Student ID" />
                                    <TextInput
                                        id="student_search"
                                        name="student_search"
                                        value={data.student_search}
                                        className="mt-1 block w-full"
                                        placeholder="e.g. 2025-9-1234"
                                        isFocused={true}
                                        onChange={(e) => setData('student_search', e.target.value)}
                                        required
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Enter the exact Student ID found on the dashboard.</p>
                                    <InputError message={errors.student_search} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="type" value="Payment Type" />
                                        <select
                                            id="type"
                                            name="type"
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            required
                                        >
                                            <option value="Monthly">Monthly Fee</option>
                                            <option value="Semester">Semester Fee</option>
                                            <option value="Annual">Annual Fee</option>
                                        </select>
                                        <InputError message={errors.type} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="status" value="Payment Status" />
                                        <select
                                            id="status"
                                            name="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            required
                                        >
                                            <option value="Paid">Paid (Cash)</option>
                                            <option value="Partial">Partial</option>
                                            <option value="Pending">Pending</option>
                                        </select>
                                        <InputError message={errors.status} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="amount" value="Amount Received ($)" />
                                    <TextInput
                                        id="amount"
                                        type="number"
                                        name="amount"
                                        value={data.amount}
                                        className="mt-1 block w-full"
                                        placeholder="0.00"
                                        onChange={(e) => setData('amount', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.amount} className="mt-2" />
                                </div>

                                <input type="hidden" name="academic_year_id" value={data.academic_year_id} />

                                <div className="flex items-center justify-end">
                                    <Link
                                        href={route('registrar.payments.index')}
                                        className="text-sm text-gray-600 underline hover:text-indigo-600 mr-4"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton className="bg-emerald-600 hover:bg-emerald-700" disabled={processing}>
                                        Record Payment
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
