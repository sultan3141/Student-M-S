import React, { useState } from 'react';
import RegistrarLayout from '@/Layouts/RegistrarLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function CreateStudent() {
    const { grades } = usePage().props; // Expecting grades to be shared via middleware or passed
    // If not passed globally, we might need to rely on the controller passing it.
    // Assuming the controller for 'create' passes 'grades'.

    const [mode, setMode] = useState('single'); // 'single', 'bulk'

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        gender: 'Female',
        dob: '',
        parent_name: '',
        parent_phone: '', // Added for more detail in full form
        grade_level: '9',
        previous_school: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('registrar.students.store'), {
            onSuccess: () => {
                reset();
                // Ideally show a success modal or flash message here
            },
        });
    };

    return (
        <RegistrarLayout user={usePage().props.auth.user}>
            <Head title="Student Registration Portal" />

            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header & Mode Selection */}
                <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6 flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-[#1F2937] flex items-center">
                            <span className="mr-2">👤</span> STUDENT REGISTRATION PORTAL
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Enrollment for Academic Year 2025-2026</p>
                    </div>
                    <div className="flex space-x-2 mt-4 md:mt-0">
                        <button
                            onClick={() => setMode('single')}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${mode === 'single' ? 'bg-[#228B22] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            ● Single Entry
                        </button>
                        <button
                            onClick={() => setMode('bulk')}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${mode === 'bulk' ? 'bg-[#228B22] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            ○ Bulk Import
                        </button>
                    </div>
                </div>

                {mode === 'single' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Form Section */}
                        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
                            <div className="bg-[#1E40AF] px-6 py-3 border-b border-blue-800">
                                <h3 className="font-bold text-white">MINIMAL DATA ENTRY</h3>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">

                                {/* 1. Personal Details */}
                                <div>
                                    <h4 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wide mb-3 border-b border-gray-100 pb-2">1. Personal Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#228B22] focus:border-[#228B22]"
                                                placeholder="e.g. Amina Mohammed"
                                            />
                                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Gender <span className="text-red-500">*</span></label>
                                            <select
                                                value={data.gender}
                                                onChange={e => setData('gender', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#228B22] focus:border-[#228B22]"
                                            >
                                                <option value="Female">Female</option>
                                                <option value="Male">Male</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Date of Birth (Optional)</label>
                                            <input
                                                type="date"
                                                value={data.dob}
                                                onChange={e => setData('dob', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#228B22] focus:border-[#228B22]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Guardian Details */}
                                <div>
                                    <h4 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wide mb-3 border-b border-gray-100 pb-2">2. Guardian Assignment</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Guardian Name <span className="text-red-500">*</span></label>
                                            <div className="flex">
                                                <input
                                                    type="text"
                                                    value={data.parent_name}
                                                    onChange={e => setData('parent_name', e.target.value)}
                                                    className="mt-1 block w-full border-gray-300 rounded-l-md shadow-sm focus:ring-[#228B22] focus:border-[#228B22]"
                                                    placeholder="Search existing or type new..."
                                                />
                                                <button type="button" className="mt-1 bg-gray-100 px-3 border border-l-0 border-gray-300 rounded-r-md text-gray-600 hover:bg-gray-200">🔍</button>
                                            </div>
                                            {errors.parent_name && <p className="text-red-500 text-xs mt-1">{errors.parent_name}</p>}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Guardian Phone (Optional for Quick Reg)</label>
                                            <input
                                                type="text"
                                                value={data.parent_phone}
                                                onChange={e => setData('parent_phone', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#228B22] focus:border-[#228B22]"
                                                placeholder="+251..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Academic Placement */}
                                <div>
                                    <h4 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wide mb-3 border-b border-gray-100 pb-2">3. Academic Placement</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Grade Level <span className="text-red-500">*</span></label>
                                            <select
                                                value={data.grade_level}
                                                onChange={e => setData('grade_level', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#228B22] focus:border-[#228B22]"
                                            >
                                                <option value="9">Grade 9</option>
                                                <option value="10">Grade 10</option>
                                                <option value="11">Grade 11</option>
                                                <option value="12">Grade 12</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Previous School</label>
                                            <input
                                                type="text"
                                                value={data.previous_school}
                                                onChange={e => setData('previous_school', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#228B22] focus:border-[#228B22]"
                                                placeholder="Optional"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200 flex items-center justify-end space-x-3">
                                    <button type="button" onClick={() => reset()} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                        Clear Form
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-[#228B22] hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md shadow-md transition-colors"
                                    >
                                        {processing ? 'Processing...' : 'Complete Registration'}
                                    </button>
                                </div>

                            </form>
                        </div>

                        {/* Info / Preview Section */}
                        <div className="space-y-6">
                            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                                <h4 className="font-bold text-[#1E40AF] mb-2">Account Auto-Generation</h4>
                                <ul className="space-y-3 text-sm text-blue-800">
                                    <li className="flex items-start">
                                        <span className="mr-2">✅</span>
                                        <div>
                                            <span className="font-bold">Student Account:</span>
                                            <p className="text-xs mt-1">ID: Generated on submit</p>
                                            <p className="text-xs">User: {data.name ? data.name.split(' ')[0].toLowerCase() + '@ips.edu' : '...'}</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">✅</span>
                                        <div>
                                            <span className="font-bold">Guardian Account:</span>
                                            <p className="text-xs mt-1">User: {data.parent_name ? 'parent.' + data.parent_name.split(' ')[0].toLowerCase() : '...'}</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-yellow-50 rounded-lg p-6 border border-[#D4AF37]">
                                <h4 className="font-bold text-[#D97706] mb-2">Required Documents</h4>
                                <ul className="space-y-2 text-sm text-yellow-800">
                                    <li>○ Birth Certificate</li>
                                    <li>○ Previous Report Card</li>
                                    <li>○ 2 Passport Photos</li>
                                    <li>○ Medical Form</li>
                                </ul>
                                <button className="mt-4 w-full text-xs font-bold text-[#D97706] border border-[#D97706] rounded py-1 hover:bg-yellow-100">
                                    Upload Documents Later
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {mode === 'bulk' && (
                    <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-12 text-center">
                        <div className="mb-4 text-4xl">📦</div>
                        <h3 className="text-lg font-bold text-gray-900">Bulk Import Wizard</h3>
                        <p className="text-gray-500 mb-6">Upload a CSV file to register up to 500 students at once.</p>

                        <div className="max-w-md mx-auto border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-[#228B22] transition-colors cursor-pointer bg-gray-50">
                            <p className="text-sm text-gray-600">Drag and drop your CSV file here, or click to browse.</p>
                        </div>

                        <div className="mt-8 flex justify-center space-x-4">
                            <button className="text-[#1E40AF] font-bold text-sm hover:underline">Download Template</button>
                        </div>
                    </div>
                )}

            </div>
        </RegistrarLayout>
    );
}
