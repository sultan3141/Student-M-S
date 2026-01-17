import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import { useState } from 'react';

export default function AttendanceIndex({ auth, sections }) {
    const { data, setData, get, processing, errors } = useForm({
        section_id: '',
        date: new Date().toISOString().split('T')[0], // Today as default
    });

    const submit = (e) => {
        e.preventDefault();
        get(route('teacher.attendance.create'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Attendance - Select Class</h2>}
        >
            <Head title="Take Attendance" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="date" value="Attendance Date" />
                                    <input
                                        type="date"
                                        id="date"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <InputLabel htmlFor="section" value="Select Class & Section" />
                                    <select
                                        id="section"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.section_id}
                                        onChange={(e) => setData('section_id', e.target.value)}
                                        required
                                    >
                                        <option value="">-- Choose Class --</option>
                                        {sections.map(section => (
                                            <option key={section.id} value={section.id}>
                                                {section.grade.name} - Section {section.name} ({section.gender})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex justify-end">
                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        Take Attendance
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
