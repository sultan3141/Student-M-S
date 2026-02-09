import { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import UpdatePasswordForm from '@/Components/Security/UpdatePasswordForm';
import { UserCircleIcon, KeyIcon } from '@heroicons/react/24/outline';

<<<<<<< HEAD
export default function Edit({ mustVerifyEmail, status, teacher, initialTab = 'profile' }) {
    const user = usePage().props.auth.user;
    const [activeTab, setActiveTab] = useState(initialTab); // profile, password
=======
export default function Edit({ mustVerifyEmail, status, teacher }) {
    const user = usePage().props.auth.user;
    const [activeTab, setActiveTab] = useState('profile'); // profile, password
>>>>>>> c3c2e32 (Final sync: Integrated all premium Teacher/Parent portal components and configurations)

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        phone: teacher.phone || '',
        address: teacher.address || '',
        bio: teacher.bio || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('teacher.profile.update'));
    };

    return (
        <TeacherLayout>
            <Head title="Profile" />

            <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <div className="px-4 sm:px-0">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
                            <p className="mt-1 text-sm text-gray-600">
                                Update your account's profile information and email address.
                            </p>

                            <div className="mt-4 flex flex-col space-y-1">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <UserCircleIcon className="mr-3 h-5 w-5" />
                                    Profile Details
                                </button>
                                <button
                                    onClick={() => setActiveTab('password')}
                                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'password' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <KeyIcon className="mr-3 h-5 w-5" />
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 md:mt-0 md:col-span-2">
                        {activeTab === 'profile' && (
                            <form onSubmit={submit} className="shadow sm:rounded-md sm:overflow-hidden">
                                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                                    <div className="grid grid-cols-6 gap-6">
                                        {/* Name */}
                                        <div className="col-span-6 sm:col-span-4">
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            />
                                            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                                        </div>

                                        {/* Email */}
                                        <div className="col-span-6 sm:col-span-4">
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            />
                                            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                                        </div>

                                        {/* Phone */}
                                        <div className="col-span-6 sm:col-span-3">
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                                            <input
                                                type="text"
                                                name="phone"
                                                id="phone"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            />
                                        </div>

                                        {/* Address */}
                                        <div className="col-span-6">
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                                            <textarea
                                                id="address"
                                                name="address"
                                                rows={3}
                                                value={data.address}
                                                onChange={(e) => setData('address', e.target.value)}
                                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                                            />
                                        </div>

                                        {/* Bio */}
                                        <div className="col-span-6">
                                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                                            <div className="mt-1">
                                                <textarea
                                                    id="bio"
                                                    name="bio"
                                                    rows={3}
                                                    value={data.bio}
                                                    onChange={(e) => setData('bio', e.target.value)}
                                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                                                    placeholder="Brief description about yourself"
                                                />
                                            </div>
                                            <p className="mt-2 text-sm text-gray-500">
                                                Brief description for your teacher profile.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </form>
                        )}


                        {activeTab === 'password' && (
                            <div className="bg-white shadow sm:rounded-md overflow-hidden p-6">
                                <UpdatePasswordForm />
                            </div>
                        )}


                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
