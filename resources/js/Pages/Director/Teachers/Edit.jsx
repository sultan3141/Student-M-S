import { useForm } from '@inertiajs/react';
import DirectorLayout from '@/Layouts/DirectorLayout';
import { Head, Link } from '@inertiajs/react';
import {
    UserIcon,
    AcademicCapIcon,
    PhoneIcon,
    MapPinIcon,
    BuildingOfficeIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Edit({ teacher }) {
    const { data, setData, put, processing, errors } = useForm({
        name: teacher.user?.name || '',
        qualification: teacher.qualification || '',
        specialization: teacher.specialization || '',
        phone: teacher.phone || '',
        address: teacher.address || '',
        department: teacher.department || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('director.teachers.update', teacher.id));
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to remove this teacher? This action cannot be undone.')) {
            // In a real app, use router.delete()
            window.location.href = route('director.teachers.destroy', teacher.id);
        }
    };

    return (
        <DirectorLayout>
            <Head title={`Edit ${teacher.user?.name || 'Teacher'}`} />

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
                            Edit Teacher Profile
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Update information for {teacher.user?.name} ({teacher.employee_id})
                        </p>
                    </div>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                        <TrashIcon className="h-5 w-5" />
                        <span>Remove Teacher</span>
                    </button>
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
                            {/* Employee ID (Read Only) */}
                            <div>
                                <InputLabel value="Employee ID" />
                                <div className="mt-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500">
                                    {teacher.employee_id}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
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
                                <span>Save Changes</span>
                            </span>
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </DirectorLayout>
    );
}
