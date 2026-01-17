import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function CreateStudent({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        gender: '',
        grade_level: '',
        parent_name: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('registrar.students.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Register New Student</h2>}
        >
            <Head title="Register Student" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Full Name" />
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        autoComplete="name"
                                        isFocused={true}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="gender" value="Gender" />
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={data.gender}
                                        onChange={(e) => setData('gender', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    <InputError message={errors.gender} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="grade_level" value="Grade Level" />
                                    <select
                                        id="grade_level"
                                        name="grade_level"
                                        value={data.grade_level}
                                        onChange={(e) => setData('grade_level', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="">Select Grade</option>
                                        <option value="9">Grade 9</option>
                                        <option value="10">Grade 10</option>
                                        <option value="11">Grade 11</option>
                                        <option value="12">Grade 12</option>
                                    </select>
                                    <InputError message={errors.grade_level} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="parent_name" value="Parent/Guardian Name" />
                                    <TextInput
                                        id="parent_name"
                                        name="parent_name"
                                        value={data.parent_name}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('parent_name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.parent_name} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end">
                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        Register Student
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
