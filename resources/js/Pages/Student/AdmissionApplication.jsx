import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import StudentLayout from '@/Layouts/StudentLayout';

export default function AdmissionApplication({ auth, grades }) {
    const [currentStep, setCurrentStep] = useState(1);

    const { data, setData, post, processing, errors } = useForm({
        full_name: '',
        dob: '',
        gender: '',
        grade_applying: '',
        previous_school: '',
        parent_name: '',
        parent_phone: '',
        parent_email: '',
        address: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('student.admission.store'));
    };

    const nextStep = () => setCurrentStep(currentStep + 1);
    const prevStep = () => setCurrentStep(currentStep - 1);

    return (
        <StudentLayout auth={auth} title="Admission Application">
            <Head title="Admission Application" />

            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Admission Application</h1>
                    <p className="text-gray-600 mt-2">Complete your application for admission to IPSMS</p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className={`flex-1 ${currentStep >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
                                    1
                                </div>
                                <div className="ml-2 text-sm font-medium">Personal Info</div>
                            </div>
                        </div>
                        <div className={`flex-1 ${currentStep >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
                                    2
                                </div>
                                <div className="ml-2 text-sm font-medium">Academic Info</div>
                            </div>
                        </div>
                        <div className={`flex-1 ${currentStep >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
                                    3
                                </div>
                                <div className="ml-2 text-sm font-medium">Parent/Guardian</div>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-lg shadow-md p-8">
                        {/* Step 1: Personal Information */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        value={data.full_name}
                                        onChange={(e) => setData('full_name', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    />
                                    {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                                        <input
                                            type="date"
                                            value={data.dob}
                                            onChange={(e) => setData('dob', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            required
                                        />
                                        {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                                        <select
                                            value={data.gender}
                                            onChange={(e) => setData('gender', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            required
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                        {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                                    <textarea
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        rows="3"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    />
                                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                                    >
                                        Next Step →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Academic Information */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Academic Information</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Grade Applying For *</label>
                                    <select
                                        value={data.grade_applying}
                                        onChange={(e) => setData('grade_applying', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Select Grade</option>
                                        {grades && grades.map((grade) => (
                                            <option key={grade.id} value={grade.id}>{grade.name}</option>
                                        ))}
                                    </select>
                                    {errors.grade_applying && <p className="text-red-500 text-sm mt-1">{errors.grade_applying}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Previous School</label>
                                    <input
                                        type="text"
                                        value={data.previous_school}
                                        onChange={(e) => setData('previous_school', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Enter previous school name"
                                    />
                                    {errors.previous_school && <p className="text-red-500 text-sm mt-1">{errors.previous_school}</p>}
                                </div>

                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                                    >
                                        ← Previous
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                                    >
                                        Next Step →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Parent/Guardian Information */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Parent/Guardian Information</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Parent/Guardian Name *</label>
                                    <input
                                        type="text"
                                        value={data.parent_name}
                                        onChange={(e) => setData('parent_name', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    />
                                    {errors.parent_name && <p className="text-red-500 text-sm mt-1">{errors.parent_name}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                                        <input
                                            type="tel"
                                            value={data.parent_phone}
                                            onChange={(e) => setData('parent_phone', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            required
                                        />
                                        {errors.parent_phone && <p className="text-red-500 text-sm mt-1">{errors.parent_phone}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={data.parent_email}
                                            onChange={(e) => setData('parent_email', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                        {errors.parent_email && <p className="text-red-500 text-sm mt-1">{errors.parent_email}</p>}
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-800">
                                        <strong>Note:</strong> By submitting this application, you confirm that all information provided is accurate and complete.
                                    </p>
                                </div>

                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                                    >
                                        ← Previous
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                                    >
                                        {processing ? 'Submitting...' : 'Submit Application ✓'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </StudentLayout>
    );
}
