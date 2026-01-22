import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import DirectorLayout from '@/Layouts/DirectorLayout';
import { Head, Link } from '@inertiajs/react';
import {
    UserIcon,
    AcademicCapIcon,
    IdentificationIcon,
    PhoneIcon,
    MapPinIcon,
    BuildingOfficeIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    PlusIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ subjects, grades, sections }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        username: '',
        password: '',
        employee_id: '',
        qualification: '',
        specialization: '',
        phone: '',
        address: '',
        department: '',
    });

    const [assignments, setAssignments] = useState([{ subject_id: '', grade_id: '', section_id: '' }]);

    const addAssignment = () => {
        setAssignments([...assignments, { subject_id: '', grade_id: '', section_id: '' }]);
    };

    const removeAssignment = (index) => {
        const newAssignments = assignments.filter((_, i) => i !== index);
        setAssignments(newAssignments);
    };

    const updateAssignment = (index, field, value) => {
        const newAssignments = [...assignments];
        newAssignments[index][field] = value;
        setAssignments(newAssignments);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('director.teachers.store'), {
            transform: (data) => ({
                ...data,
                subjects: assignments.map(a => a.subject_id).filter(id => id),
                grades: assignments.map(a => a.grade_id).filter(id => id),
                sections: assignments.map(a => a.section_id).filter(id => id),
            })
        });
    };

    return (
        <DirectorLayout>
            <Head title="Add New Teacher" />

            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <Link
                            href={route('director.teachers.index')}
                            className="text-sm text-gray-500 hover:text-blue-600 flex items-center mb-2 transition-colors"
                        >
                            <ArrowLeftIcon className="h-4 w-4 mr-1" />
                            Back to Directory
                        </Link>
                        <h1 className="text-3xl font-bold text-navy-900" style={{ color: '#0F172A' }}>
                            Add New Teacher
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Create a new faculty profile and account
                        </p>
                    </div>
                </div>

                <form onSubmit={submit}>
                    {/* Personal Information */}
                    <div className="executive-card mb-6">
                        <div className="flex items-center space-x-2 text-gold-600 mb-6 pb-4 border-b border-gray-100">
                            <UserIcon className="h-6 w-6" />
                            <h2 className="text-lg font-semibold text-navy-900">Personal Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                                <InputLabel htmlFor="name" value="Full Name" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full bg-gray-50 border-gray-300 focus:border-gold-500 focus:ring-gold-500"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            {/* Phone */}
                            <div>
                                <InputLabel htmlFor="phone" value="Phone Number" />
                                <div className="relative mt-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <TextInput
                                        id="phone"
                                        name="phone"
                                        value={data.phone}
                                        className="pl-10 block w-full bg-gray-50 border-gray-300 focus:border-gold-500 focus:ring-gold-500"
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                </div>
                                <InputError message={errors.phone} className="mt-2" />
                            </div>

                            {/* Address */}
                            <div className="md:col-span-2">
                                <InputLabel htmlFor="address" value="Residential Address" />
                                <div className="relative mt-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <TextInput
                                        id="address"
                                        name="address"
                                        value={data.address}
                                        className="pl-10 block w-full bg-gray-50 border-gray-300 focus:border-gold-500 focus:ring-gold-500"
                                        onChange={(e) => setData('address', e.target.value)}
                                    />
                                </div>
                                <InputError message={errors.address} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    {/* Professional Details */}
                    <div className="executive-card mb-6">
                        <div className="flex items-center space-x-2 text-gold-600 mb-6 pb-4 border-b border-gray-100">
                            <AcademicCapIcon className="h-6 w-6" />
                            <h2 className="text-lg font-semibold text-navy-900">Professional Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Employee ID */}
                            <div>
                                <InputLabel htmlFor="employee_id" value="Employee ID" />
                                <div className="relative mt-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <IdentificationIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <TextInput
                                        id="employee_id"
                                        name="employee_id"
                                        value={data.employee_id}
                                        className="pl-10 block w-full bg-gray-50 border-gray-300 focus:border-gold-500 focus:ring-gold-500"
                                        onChange={(e) => setData('employee_id', e.target.value)}
                                        required
                                    />
                                </div>
                                <InputError message={errors.employee_id} className="mt-2" />
                            </div>

                            {/* Department */}
                            <div>
                                <InputLabel htmlFor="department" value="Department" />
                                <div className="relative mt-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <TextInput
                                        id="department"
                                        name="department"
                                        value={data.department}
                                        className="pl-10 block w-full bg-gray-50 border-gray-300 focus:border-gold-500 focus:ring-gold-500"
                                        onChange={(e) => setData('department', e.target.value)}
                                    />
                                </div>
                                <InputError message={errors.department} className="mt-2" />
                            </div>

                            {/* Qualification */}
                            <div>
                                <InputLabel htmlFor="qualification" value="Qualification" />
                                <TextInput
                                    id="qualification"
                                    name="qualification"
                                    value={data.qualification}
                                    className="mt-1 block w-full bg-gray-50 border-gray-300 focus:border-gold-500 focus:ring-gold-500"
                                    placeholder="e.g. Master's in Education"
                                    onChange={(e) => setData('qualification', e.target.value)}
                                />
                                <InputError message={errors.qualification} className="mt-2" />
                            </div>

                            {/* Specialization */}
                            <div>
                                <InputLabel htmlFor="specialization" value="Specialization" />
                                <TextInput
                                    id="specialization"
                                    name="specialization"
                                    value={data.specialization}
                                    className="mt-1 block w-full bg-gray-50 border-gray-300 focus:border-gold-500 focus:ring-gold-500"
                                    placeholder="e.g. Mathematics, Physics"
                                    onChange={(e) => setData('specialization', e.target.value)}
                                />
                                <InputError message={errors.specialization} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    {/* Account Credentials */}
                    <div className="executive-card mb-6">
                        <div className="flex items-center space-x-2 text-gold-600 mb-6 pb-4 border-b border-gray-100">
                            <IdentificationIcon className="h-6 w-6" />
                            <h2 className="text-lg font-semibold text-navy-900">Account Credentials</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Username */}
                            <div>
                                <InputLabel htmlFor="username" value="Username" />
                                <TextInput
                                    id="username"
                                    name="username"
                                    value={data.username}
                                    className="mt-1 block w-full bg-gray-50 border-gray-300 focus:border-gold-500 focus:ring-gold-500"
                                    onChange={(e) => setData('username', e.target.value)}
                                    required
                                />
                                <InputError message={errors.username} className="mt-2" />
                            </div>

                            {/* Password */}
                            <div>
                                <InputLabel htmlFor="password" value="Initial Password" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full bg-gray-50 border-gray-300 focus:border-gold-500 focus:ring-gold-500"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    {/* Class Assignments */}
                    <div className="executive-card mb-6">
                        <div className="flex items-center justify-between text-gold-600 mb-6 pb-4 border-b border-gray-100">
                            <div className="flex items-center space-x-2">
                                <AcademicCapIcon className="h-6 w-6" />
                                <h2 className="text-lg font-semibold text-navy-900">Class Assignments</h2>
                            </div>
                            <button
                                type="button"
                                onClick={addAssignment}
                                className="text-sm flex items-center text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <PlusIcon className="h-4 w-4 mr-1" />
                                Add Class
                            </button>
                        </div>

                        <div className="space-y-4">
                            {assignments.map((assignment, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-gray-50 p-4 rounded-lg">
                                    {/* Subject */}
                                    <div>
                                        <InputLabel value="Subject" />
                                        <select
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            value={assignment.subject_id}
                                            onChange={(e) => updateAssignment(index, 'subject_id', e.target.value)}
                                        >
                                            <option value="">Select Subject</option>
                                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                                        </select>
                                    </div>

                                    {/* Grade */}
                                    <div>
                                        <InputLabel value="Grade" />
                                        <select
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            value={assignment.grade_id}
                                            onChange={(e) => updateAssignment(index, 'grade_id', e.target.value)}
                                        >
                                            <option value="">Select Grade</option>
                                            {grades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                        </select>
                                    </div>

                                    {/* Section */}
                                    <div>
                                        <InputLabel value="Section" />
                                        <select
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            value={assignment.section_id}
                                            onChange={(e) => updateAssignment(index, 'section_id', e.target.value)}
                                        >
                                            <option value="">Select Section</option>
                                            {sections
                                                .filter(s => !assignment.grade_id || s.grade_id == assignment.grade_id)
                                                .map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>

                                    {/* Remove Action */}
                                    <div className="pb-1">
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => removeAssignment(index)}
                                                className="text-red-600 hover:text-red-800 p-2"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <InputError message={errors.assignments} className="mt-2" />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-4 mb-10">
                        <Link
                            href={route('director.teachers.index')}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </Link>
                        <PrimaryButton
                            className="btn-executive bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500"
                            disabled={processing}
                        >
                            <span className="flex items-center space-x-2">
                                <CheckCircleIcon className="h-5 w-5" />
                                <span>Create Teacher Profile</span>
                            </span>
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </DirectorLayout>
    );
}
