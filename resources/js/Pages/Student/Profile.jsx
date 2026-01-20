import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import StudentLayout from '@/Layouts/StudentLayout';
import { UserCircleIcon, IdentificationIcon, MapPinIcon, PhoneIcon, ShieldCheckIcon, CameraIcon } from '@heroicons/react/24/outline';

export default function ProfileEdit({ auth, student }) {
    const [photoPreview, setPhotoPreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
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

            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                        <p className="text-sm text-gray-500">Manage your personal details and view your academic identity.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Column: Digital ID Card (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* ID Card Component */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden text-white relative">
                            {/* Decorative Circles */}
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-black opacity-10 blur-2xl"></div>

                            <div className="p-8 relative z-10 flex flex-col items-center text-center">
                                {/* School Logo/Brand mockup */}
                                <div className="text-xs font-bold tracking-widest uppercase opacity-70 mb-6">Student Identity Card</div>

                                {/* Photo */}
                                <div className="relative mb-4 group">
                                    <div className="w-32 h-32 rounded-full border-4 border-white/30 p-1 bg-white/10 backdrop-blur-sm shadow-inner">
                                        <img
                                            className="w-full h-full object-cover rounded-full bg-gray-200"
                                            src={photoPreview || (auth.user.profile_photo_path ? `/storage/${auth.user.profile_photo_path}` : `https://ui-avatars.com/api/?name=${auth.user.name}&background=random`)}
                                            alt={auth.user.name}
                                        />
                                    </div>
                                    <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-white text-blue-600 p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
                                        <CameraIcon className="w-5 h-5" />
                                    </label>
                                </div>
                                <input
                                    type="file"
                                    id="photo-upload"
                                    className="hidden"
                                    onChange={handlePhotoChange}
                                    accept="image/*"
                                />
                                {errors.profile_photo && <p className="text-red-300 text-xs mt-1">{errors.profile_photo}</p>}

                                <h2 className="text-xl font-bold text-white">{auth.user.name}</h2>
                                <p className="text-blue-100 font-mono text-sm mt-1">{student?.student_id || 'ID Pending'}</p>

                                <div className="w-full h-px bg-white/20 my-6"></div>

                                <div className="w-full grid grid-cols-2 gap-4 text-left">
                                    <div>
                                        <div className="text-xs text-blue-200 uppercase">Grade</div>
                                        <div className="font-semibold">{student?.grade?.name || '-'}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-blue-200 uppercase">Section</div>
                                        <div className="font-semibold">{student?.section?.name || '-'}</div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="text-xs text-blue-200 uppercase">Gender</div>
                                        <div className="font-semibold capitalize">{student?.gender || '-'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security / Info */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
                                <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                                Account Status
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Account Type</span>
                                    <span className="font-medium text-gray-900">Student</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Status</span>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                        Active
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Joined</span>
                                    <span className="font-medium text-gray-900">{new Date(auth.user.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Edit Form (8 cols) */}
                    <div className="lg:col-span-8">
                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-gray-900">Personal Details</h2>
                                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">Editable</span>
                            </div>

                            <div className="p-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <PhoneIcon className="w-4 h-4 text-gray-400" />
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 shadow-sm transition-all"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                                    </div>

                                    {/* National ID */}
                                    <div className="space-y-2">
                                        <label htmlFor="national_id" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <IdentificationIcon className="w-4 h-4 text-gray-400" />
                                            FAN National ID
                                        </label>
                                        <input
                                            type="text"
                                            id="national_id"
                                            value={data.national_id}
                                            onChange={(e) => setData('national_id', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 shadow-sm transition-all"
                                            placeholder="Enter National ID"
                                            disabled // Often national ID shouldn't be editable by student, but user logic permits it. Keeping enabled based on legacy.
                                        />
                                        {errors.national_id && <p className="text-red-500 text-sm">{errors.national_id}</p>}
                                    </div>

                                    {/* Address */}
                                    <div className="md:col-span-2 space-y-2">
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <MapPinIcon className="w-4 h-4 text-gray-400" />
                                            Residential Address
                                        </label>
                                        <textarea
                                            id="address"
                                            rows="3"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 shadow-sm transition-all resize-none"
                                            placeholder="Full street address..."
                                        />
                                        {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                                    </div>
                                </div>

                                <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800 flex items-start gap-3">
                                    <UserCircleIcon className="w-5 h-5 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold block mb-1">Information Accuracy</span>
                                        Please ensure your contact details are up to date. This information is used for official school communications and emergency contacts.
                                    </div>
                                </div>
                            </div>

                            <div className="px-8 py-5 bg-gray-50 rounded-b-2xl border-t border-gray-100 flex items-center justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
