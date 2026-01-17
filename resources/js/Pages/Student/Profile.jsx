import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import StudentLayout from '@/Layouts/StudentLayout';

export default function ProfileEdit({ auth, student }) {
    const [activeTab, setActiveTab] = useState('personal');
    const [photoPreview, setPhotoPreview] = useState(null);

    const { data, setData, put, processing, errors } = useForm({
        phone: student?.phone || '',
        address: student?.address || '',
        profile_photo: null,
    });

    const { data: passwordData, setData: setPasswordData, put: updatePassword, processing: passwordProcessing, errors: passwordErrors, reset: resetPassword } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
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
        put(route('student.profile.update'));
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        updatePassword(route('student.password.update'), {
            onSuccess: () => {
                resetPassword();
                alert('Password changed successfully!');
            }
        });
    };

    const tabs = [
        { id: 'personal', name: 'Personal', icon: '👤' },
        { id: 'educational', name: 'Educational', icon: '🎓' },
        { id: 'school', name: 'School', icon: '🏫' },
        { id: 'family', name: 'Family', icon: '👨‍👩‍👧' },
        { id: 'emergency', name: 'Emergency', icon: '🚨' },
        { id: 'cost-sharing', name: 'Cost-Sharing', icon: '💰' },
        { id: 'documents', name: 'Documents', icon: '📄' },
        { id: 'agreement', name: 'Agreement', icon: '📝' },
        { id: 'help', name: 'HELP', icon: '❓' },
    ];

    return (
        <StudentLayout auth={auth} title="Edit Profile" student={student}>
            <Head title="Edit Profile" />

            {/* Student Name Banner */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 text-center mb-6 shadow-lg">
                <h1 className="text-3xl font-bold">{auth.user.name}</h1>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-t-lg shadow-lg overflow-hidden">
                <div className="flex overflow-x-auto border-b">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium whitespace-nowrap transition ${activeTab === tab.id
                                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.name}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="p-8">
                    {activeTab === 'personal' && (
                        <div>
                            <h3 className="text-xl font-bold text-blue-600 mb-6 border-b pb-2">BASIC INFORMATION</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Read-only fields */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                                        <input
                                            type="text"
                                            value={auth.user.name.split(' ')[0] || ''}
                                            readOnly
                                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Father Name</label>
                                        <input
                                            type="text"
                                            value={auth.user.name.split(' ')[1] || ''}
                                            readOnly
                                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">G/Father Name</label>
                                        <input
                                            type="text"
                                            value={auth.user.name.split(' ')[2] || ''}
                                            readOnly
                                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">DOB-GC*</label>
                                        <input
                                            type="text"
                                            value={student?.dob || 'N/A'}
                                            readOnly
                                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                                        <select
                                            value={student?.gender || 'M'}
                                            disabled
                                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none"
                                        >
                                            <option value="M">M</option>
                                            <option value="F">F</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Place of Birth</label>
                                        <input
                                            type="text"
                                            value={student?.address || 'N/A'}
                                            readOnly
                                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">National ID (FAN)</label>
                                        <input
                                            type="text"
                                            value={student?.student_id || 'N/A'}
                                            readOnly
                                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Health Status</label>
                                        <select
                                            disabled
                                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none"
                                        >
                                            <option>Normal</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Marital Status</label>
                                        <select
                                            disabled
                                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none"
                                        >
                                            <option>Single</option>
                                        </select>
                                    </div>

                                    {/* Editable fields */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter phone"
                                        />
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                                        <input
                                            type="text"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter address"
                                        />
                                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                    </div>
                                </div>

                                <div className="mt-6 flex space-x-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <Link
                                        href={route('student.dashboard')}
                                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                                    >
                                        Cancel
                                    </Link>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'educational' && (
                        <div>
                            <h3 className="text-xl font-bold text-blue-600 mb-6 border-b pb-2">EDUCATIONAL INFORMATION</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Grade</label>
                                    <input
                                        type="text"
                                        value={student?.grade?.name || 'N/A'}
                                        readOnly
                                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Section</label>
                                    <input
                                        type="text"
                                        value={student?.section?.name || 'N/A'}
                                        readOnly
                                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Student ID</label>
                                    <input
                                        type="text"
                                        value={student?.student_id || 'N/A'}
                                        readOnly
                                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Placeholder for other tabs */}
                    {activeTab !== 'personal' && activeTab !== 'educational' && (
                        <div className="text-center py-12 text-gray-500">
                            <div className="text-5xl mb-4">🚧</div>
                            <p className="text-lg">This section is under development</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Password Change Section */}
            <div className="bg-white rounded-lg shadow-lg mt-6 overflow-hidden">
                <div className="bg-red-500 text-white px-6 py-4">
                    <h3 className="font-bold text-lg">Change Password</h3>
                </div>
                <form onSubmit={handlePasswordSubmit} className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                            <input
                                type="password"
                                value={passwordData.current_password}
                                onChange={(e) => setPasswordData('current_password', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                required
                            />
                            {passwordErrors.current_password && <p className="text-red-500 text-xs mt-1">{passwordErrors.current_password}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                            <input
                                type="password"
                                value={passwordData.password}
                                onChange={(e) => setPasswordData('password', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                required
                            />
                            {passwordErrors.password && <p className="text-red-500 text-xs mt-1">{passwordErrors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                value={passwordData.password_confirmation}
                                onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            type="submit"
                            disabled={passwordProcessing}
                            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50"
                        >
                            {passwordProcessing ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </StudentLayout>
    );
}
