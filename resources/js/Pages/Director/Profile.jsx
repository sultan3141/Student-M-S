import { useState } from 'react';
import DirectorLayout from '@/Layouts/DirectorLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import {
    UserCircleIcon,
    KeyIcon,
    PhotoIcon,
    ArrowLeftIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function Profile({ status }) {
    const { auth } = usePage().props;
    const user = auth.user;

    // Profile Info Form
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        photo: null,
        _method: 'PUT',
    });

    // Password Form
    const {
        data: passwordData,
        setData: setPasswordData,
        put: updatePassword,
        processing: passwordProcessing,
        errors: passwordErrors,
        recentlySuccessful: passwordRecentlySuccessful
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [photoPreview, setPhotoPreview] = useState(null);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setData('photo', file);

        const reader = new FileReader();
        reader.onload = (e) => {
            setPhotoPreview(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const submitProfile = (e) => {
        e.preventDefault();
        post('/director/profile/update', {
            preserveScroll: true,
        });
    };

    const submitPassword = (e) => {
        e.preventDefault();
        updatePassword('/director/password/update', {
            preserveScroll: true,
            onSuccess: () => setPasswordData({
                current_password: '',
                password: '',
                password_confirmation: '',
            }),
        });
    };

    return (
        <DirectorLayout>
            <Head title="Director Profile" />

            <div className="max-w-4xl mx-auto">
                {/* Header & Back Button */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-navy-900" style={{ color: '#0F172A' }}>
                            👤 Director Profile
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage your account settings and preferences
                        </p>
                    </div>
                    <Link
                        href="/director/dashboard"
                        className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Link>
                </div>

                {/* Profile Information Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex items-center space-x-3">
                            <UserCircleIcon className="h-6 w-6 text-blue-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                        </div>
                    </div>
                    <div className="p-6">
                        <form onSubmit={submitProfile}>
                            {/* Photo Upload Section */}
                            <div className="mb-6 flex items-center space-x-6">
                                <div className="shrink-0 relative">
                                    {(photoPreview || user.profile_photo_url || user.profile_photo_path) ? (
                                        <img
                                            src={photoPreview || (user.profile_photo_path ? `/storage/${user.profile_photo_path}` : null) || `https://ui-avatars.com/api/?name=${user.name}&color=7F9CF5&background=EBF4FF`}
                                            alt={user.name}
                                            className="h-24 w-24 object-cover rounded-full border-4 border-gray-100 shadow-sm"
                                        />
                                    ) : (
                                        <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                                            <PhotoIcon className="h-12 w-12" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Profile Photo
                                    </label>
                                    <div className="flex items-center space-x-3">
                                        <label className="cursor-pointer px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                            <span>Select New Photo</span>
                                            <input
                                                type="file"
                                                className="sr-only"
                                                onChange={handlePhotoChange}
                                                accept="image/*"
                                            />
                                        </label>
                                        {photoPreview && (
                                            <button
                                                type="button"
                                                className="text-sm text-red-600 hover:text-red-800"
                                                onClick={() => {
                                                    setPhotoPreview(null);
                                                    setData('photo', null);
                                                }}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">JPG, GIF or PNG. 1MB Max.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                    {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                    />
                                    {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                                </div>
                            </div>

                            <div className="flex items-center justify-end">
                                {recentlySuccessful && (
                                    <div className="flex items-center text-green-600 mr-3 text-sm">
                                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                                        Saved
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800 shadow-lg transition-all disabled:opacity-50"
                                    style={{ backgroundColor: '#0F172A' }}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Password Update Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex items-center space-x-3">
                            <KeyIcon className="h-6 w-6 text-amber-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
                        </div>
                    </div>
                    <div className="p-6">
                        <form onSubmit={submitPassword}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        value={passwordData.current_password}
                                        onChange={e => setPasswordData('current_password', e.target.value)}
                                    />
                                    {passwordErrors.current_password && <div className="text-red-500 text-sm mt-1">{passwordErrors.current_password}</div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        value={passwordData.password}
                                        onChange={e => setPasswordData('password', e.target.value)}
                                    />
                                    {passwordErrors.password && <div className="text-red-500 text-sm mt-1">{passwordErrors.password}</div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        value={passwordData.password_confirmation}
                                        onChange={e => setPasswordData('password_confirmation', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end">
                                {passwordRecentlySuccessful && (
                                    <div className="flex items-center text-green-600 mr-3 text-sm">
                                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                                        Updated
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={passwordProcessing}
                                    className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 shadow-md transition-all disabled:opacity-50"
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DirectorLayout>
    );
}
