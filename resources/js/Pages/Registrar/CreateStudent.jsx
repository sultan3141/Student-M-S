import React, { useState, useEffect } from 'react';
import RegistrarLayout from '@/Layouts/RegistrarLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';

export default function CreateStudent() {
    const { grades } = usePage().props;

    // Form Mode: single (default), bulk (future)
    const [mode, setMode] = useState('single');

    // Parent Logic
    const [parentMode, setParentMode] = useState('new'); // 'new' | 'existing'
    const [parentSearchQuery, setParentSearchQuery] = useState('');
    const [parentSearchResults, setParentSearchResults] = useState([]);
    const [selectedParent, setSelectedParent] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        gender: 'Female',
        dob: '',
        grade_id: grades && grades.length > 0 ? grades[0].id : '',
        previous_school: '',

        parent_mode: 'new', // Syncs with local state on submit
        parent_id: '',
        parent_name: '',
        parent_email: '',
        parent_phone: '',
    });

    // Update form data when local parent mode changes
    useEffect(() => {
        setData('parent_mode', parentMode);
    }, [parentMode]);

    // Parent Search Debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (parentSearchQuery.length > 2) {
                searchParents();
            } else {
                setParentSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [parentSearchQuery]);

    const searchParents = async () => {
        try {
            const response = await axios.get(route('registrar.parents.search'), {
                params: { query: parentSearchQuery }
            });
            setParentSearchResults(response.data);
        } catch (error) {
            console.error("Parent search failed", error);
        }
    };

    const selectParent = (parent) => {
        setSelectedParent(parent);
        setData('parent_id', parent.id);
        setParentSearchQuery(parent.name); // Visual confirmation
        setParentSearchResults([]); // Hide list
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('registrar.students.store'), {
            onSuccess: () => {
                reset();
                setSelectedParent(null);
                setParentSearchQuery('');
                // Success message handled by layout flash
            },
        });
    };

    return (
        <RegistrarLayout user={usePage().props.auth.user}>
            <Head title="Student Registration Portal" />

            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6 flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-[#1F2937] flex items-center">
                            <span className="mr-2">👤</span> STUDENT REGISTRATION PORTAL
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Enrollment for {new Date().getFullYear()}-{new Date().getFullYear() + 1} Academic Year</p>
                    </div>
                </div>

                {mode === 'single' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Form Section */}
                        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
                            <div className="bg-[#1E40AF] px-6 py-3 border-b border-blue-800">
                                <h3 className="font-bold text-white">NEW STUDENT ENTRY</h3>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">

                                {/* 1. Personal Details */}
                                <div>
                                    <h4 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wide mb-3 border-b border-gray-100 pb-2">1. Student Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-gray-700">Full Name <span className="text-red-500">*</span></label>
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
                                            <label className="block text-sm font-bold text-gray-700">Gender <span className="text-red-500">*</span></label>
                                            <select
                                                value={data.gender}
                                                onChange={e => setData('gender', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#228B22] focus:border-[#228B22]"
                                            >
                                                <option value="Female">Female</option>
                                                <option value="Male">Male</option>
                                            </select>
                                            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700">Date of Birth</label>
                                            <input
                                                type="date"
                                                value={data.dob}
                                                onChange={e => setData('dob', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#228B22] focus:border-[#228B22]"
                                            />
                                            {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Guardian Details (Dynamic Mode) */}
                                <div>
                                    <div className="flex justify-between items-center mb-3 border-b border-gray-100 pb-2">
                                        <h4 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wide">2. Guardian Information</h4>
                                        <div className="flex space-x-2 text-xs">
                                            <button
                                                type="button"
                                                onClick={() => { setParentMode('new'); setData('parent_id', ''); }}
                                                className={`px-3 py-1 rounded-full border ${parentMode === 'new' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'text-gray-500 hover:bg-gray-50'}`}
                                            >
                                                Create New
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setParentMode('existing'); setData('parent_name', ''); }}
                                                className={`px-3 py-1 rounded-full border ${parentMode === 'existing' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'text-gray-500 hover:bg-gray-50'}`}
                                            >
                                                Link Existing
                                            </button>
                                        </div>
                                    </div>

                                    {parentMode === 'new' ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md border border-gray-200">
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700">Guardian Name <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text"
                                                    value={data.parent_name}
                                                    onChange={e => setData('parent_name', e.target.value)}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#228B22] focus:border-[#228B22]"
                                                />
                                                {errors.parent_name && <p className="text-red-500 text-xs mt-1">{errors.parent_name}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Email (Login ID) <span className="text-red-500">*</span></label>
                                                <input
                                                    type="email"
                                                    value={data.parent_email}
                                                    onChange={e => setData('parent_email', e.target.value)}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#228B22] focus:border-[#228B22]"
                                                />
                                                {errors.parent_email && <p className="text-red-500 text-xs mt-1">{errors.parent_email}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                                <input
                                                    type="text"
                                                    value={data.parent_phone}
                                                    onChange={e => setData('parent_phone', e.target.value)}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#228B22] focus:border-[#228B22]"
                                                />
                                                {errors.parent_phone && <p className="text-red-500 text-xs mt-1">{errors.parent_phone}</p>}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                                            <label className="block text-sm font-medium text-blue-900 mb-1">Search Parent by Name or Email</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={parentSearchQuery}
                                                    onChange={e => { setParentSearchQuery(e.target.value); setSelectedParent(null); }}
                                                    className="block w-full border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 pl-10"
                                                    placeholder="Start typing..."
                                                />
                                                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>

                                                {parentSearchResults.length > 0 && !selectedParent && (
                                                    <div className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-1 border border-gray-200 max-h-48 overflow-y-auto">
                                                        {parentSearchResults.map(p => (
                                                            <div
                                                                key={p.id}
                                                                onClick={() => selectParent(p)}
                                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-50 last:border-0"
                                                            >
                                                                <div className="font-bold text-sm text-gray-800">{p.name}</div>
                                                                <div className="text-xs text-gray-500">{p.email} • {p.phone}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            {selectedParent && (
                                                <div className="mt-2 text-sm text-green-700 font-medium">
                                                    ✓ Selected: {selectedParent.name}
                                                </div>
                                            )}
                                            {errors.parent_id && <p className="text-red-500 text-xs mt-1">Please select a valid parent.</p>}
                                        </div>
                                    )}
                                </div>

                                {/* 3. Academic Placement */}
                                <div>
                                    <h4 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wide mb-3 border-b border-gray-100 pb-2">3. Academic Placement</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700">Target Class <span className="text-red-500">*</span></label>
                                            <select
                                                value={data.grade_id}
                                                onChange={e => setData('grade_id', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#228B22] focus:border-[#228B22]"
                                            >
                                                {grades && grades.map(g => (
                                                    <option key={g.id} value={g.id}>{g.name}</option>
                                                ))}
                                                {(!grades || grades.length === 0) && <option value="">No Classes Defined</option>}
                                            </select>
                                            {errors.grade_id && <p className="text-red-500 text-xs mt-1">{errors.grade_id}</p>}
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
                                        Reset
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-[#228B22] hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md shadow-md transition-colors"
                                    >
                                        {processing ? 'Processing...' : 'Complete Enrollment'}
                                    </button>
                                </div>

                            </form>
                        </div>

                        {/* Info / Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                                <h4 className="font-bold text-[#1E40AF] mb-2">Registration Summary</h4>
                                <ul className="space-y-3 text-sm text-blue-800">
                                    <li className="flex items-start">
                                        <span className="mr-2">📝</span>
                                        <div>
                                            <span className="font-bold">Mode:</span> {parentMode === 'new' ? 'New Family Enrollment' : 'Existing Family Add-on'}
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">👤</span>
                                        <div>
                                            <span className="font-bold">Student:</span> {data.name || '...'}
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </RegistrarLayout>
    );
}
