import { Head, Link, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout'; // Can be Guest or part of main layout if logged in?
// Usually admissions are public. Let's use a simple layout or GuestLayout.

export default function CreateAdmission({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        student_name: '',
        student_email: '',
        parent_name: '',
        parent_email: '',
        parent_phone: '',
        previous_school: '',
        grade_applying_for: '9',
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admissions.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <GuestLayout>
            <Head title="Admission Application" />

            <div className="mb-4 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Student Admission</h2>
                <p className="text-gray-600">Apply for the upcoming academic year.</p>
            </div>

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600 text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                {/* Student Info */}
                <div>
                    <InputLabel htmlFor="student_name" value="Student Full Name" />
                    <TextInput
                        id="student_name"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.student_name}
                        onChange={(e) => setData('student_name', e.target.value)}
                        required
                    />
                    <InputError message={errors.student_name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="student_email" value="Student Email (Optional)" />
                    <TextInput
                        id="student_email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.student_email}
                        onChange={(e) => setData('student_email', e.target.value)}
                    />
                    <InputError message={errors.student_email} className="mt-2" />
                </div>

                {/* Parent Info */}
                <div>
                    <InputLabel htmlFor="parent_name" value="Parent/Guardian Name" />
                    <TextInput
                        id="parent_name"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.parent_name}
                        onChange={(e) => setData('parent_name', e.target.value)}
                        required
                    />
                    <InputError message={errors.parent_name} className="mt-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="parent_email" value="Parent Email" />
                        <TextInput
                            id="parent_email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.parent_email}
                            onChange={(e) => setData('parent_email', e.target.value)}
                            required
                        />
                        <InputError message={errors.parent_email} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="parent_phone" value="Parent Phone" />
                        <TextInput
                            id="parent_phone"
                            type="tel"
                            className="mt-1 block w-full"
                            value={data.parent_phone}
                            onChange={(e) => setData('parent_phone', e.target.value)}
                            required
                        />
                        <InputError message={errors.parent_phone} className="mt-2" />
                    </div>
                </div>

                {/* Academic Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="grade" value="Grade Applying For" />
                        <select
                            id="grade"
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            value={data.grade_applying_for}
                            onChange={(e) => setData('grade_applying_for', e.target.value)}
                            required
                        >
                            <option value="9">Grade 9</option>
                            <option value="10">Grade 10</option>
                            <option value="11">Grade 11</option>
                            <option value="12">Grade 12</option>
                        </select>
                        <InputError message={errors.grade_applying_for} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="previous_school" value="Previous School" />
                        <TextInput
                            id="previous_school"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.previous_school}
                            onChange={(e) => setData('previous_school', e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="notes" value="Additional Notes (Medical, etc.)" />
                    <textarea
                        id="notes"
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        value={data.notes}
                        onChange={(e) => setData('notes', e.target.value)}
                        rows="3"
                    ></textarea>
                </div>

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="ml-4" disabled={processing}>
                        Submit Application
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
