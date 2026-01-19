import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import StudentLayout from '@/Layouts/StudentLayout';

export default function ProfileEdit({ auth, student }) {
    const [photoPreview, setPhotoPreview] = useState(null);

    const { data, setData, post, processing, errors, hasErrors } = useForm({
        _method: 'PATCH',
        phone: student?.phone || '',
        address: student?.address || '',
        national_id: student?.national_id || '',
        profile_photo: null,
    });

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('profile_photo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('student.profile.update'), {
            forceFormData: true,
        });
    };

    return (
        <StudentLayout auth={auth} title="Profile Settings" student={student}>
            <Head title="Profile Settings" />

            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                        <p className="text-gray-500 mt-1">Manage your personal information and view official academic details.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Official Info (Non-Editable) */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Official Academic Record</h3>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Photo Display */}
                                <div className="flex justify-center">
                                    <div className="relative">
                                        {photoPreview ? (
                                            <img className="h-32 w-32 object-cover rounded-full border-4 border-white shadow-lg" src={photoPreview} alt="Profile" />
                                        ) : auth.user.profile_photo_path ? (
                                            <img className="h-32 w-32 object-cover rounded-full border-4 border-white shadow-lg" src={`/storage/${auth.user.profile_photo_path}`} alt="Profile" />
                                        ) : (
                                            <div className="h-32 w-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-bold border-4 border-white shadow-lg">
                                                {auth.user.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Student ID</label>
                                        <div className="text-lg font-mono font-bold text-gray-900 mt-1">{student?.student_id || 'N/A'}</div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Full Name</label>
                                        <div className="text-gray-900 font-medium bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">{auth.user.name}</div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Grade & Section</label>
                                        <div className="text-gray-900 font-medium bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                                            {student?.grade?.name || 'N/A'} — {student?.section?.name || 'N/A'}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Gender</label>
                                        <div className="text-gray-900 font-medium bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">{student?.gender || 'N/A'}</div>
                                    </div>
                                </div>

                                <div className="text-xs text-center text-gray-400">
                                    These fields are managed by the administration and cannot be edited.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Editable Info */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-blue-600 px-8 py-6">
                                <h3 className="text-lg font-bold text-white">Edit Personal Information</h3>
                                <p className="text-blue-100 text-sm mt-1">Update your contact details and profile photo</p>
                            </div>

                            <div className="p-8 space-y-6">
                                {/* Profile Photo Upload */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Photo Details</label>
                                    <div className="flex items-center space-x-4">
                                        <div className="grow">
                                            <input
                                                type="file"
                                                id="photo-upload"
                                                onChange={handlePhotoChange}
                                                accept="image/jpeg,image/png,image/gif"
                                                className="block w-full text-sm text-gray-500
                                                    file:mr-4 file:py-2.5 file:px-4
                                                    file:rounded-full file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-blue-50 file:text-blue-700
                                                    hover:file:bg-blue-100
                                                    cursor-pointer"
                                            />
                                            <p className="mt-2 text-xs text-gray-500 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                Max size 1MB. Formats: JPG, PNG, GIF
                                            </p>
                                        </div>
                                    </div>
                                    {errors.profile_photo && <p className="text-red-500 text-sm mt-2 font-medium">{errors.profile_photo}</p>}
                                </div>

                                <div className="border-t border-gray-100 my-6"></div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="national_id" className="block text-sm font-semibold text-gray-700">FAN National ID</label>
                                        <input
                                            type="text"
                                            id="national_id"
                                            value={data.national_id}
                                            onChange={(e) => setData('national_id', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-gray-400"
                                            placeholder="e.g. 1234567890"
                                        />
                                        {errors.national_id && <p className="text-red-500 text-sm mt-1">{errors.national_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-gray-400"
                                            placeholder="e.g. +1 234 567 8900"
                                        />
                                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label htmlFor="address" className="block text-sm font-semibold text-gray-700">Residential Address</label>
                                        <input
                                            type="text"
                                            id="address"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-gray-400"
                                            placeholder="Street, City, Postal Code"
                                        />
                                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-8 py-5 border-t border-gray-100 flex items-center justify-between">
                                <p className="text-sm text-gray-500">
                                    Last updated: <span className="font-medium text-gray-900">{new Date().toLocaleDateString()}</span>
                                </p>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30"
                                >
                                    {processing ? 'Saving Changes...' : 'Save Profile'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
