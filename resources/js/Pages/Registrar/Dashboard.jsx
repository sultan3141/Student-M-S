import React from 'react';
import RegistrarLayout from '@/Layouts/RegistrarLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Dashboard({ auth, stats, recentStudents, grades }) {
    // Quick Registration Form Hook
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        gender: 'Female',
        grade_level: '9',
        parent_name: '',
    });

    const submitQuickReg = (e) => {
        e.preventDefault();
        post(route('registrar.students.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <RegistrarLayout user={auth.user}>
            <Head title="Registrar Command Center" />

            <div className="space-y-6">
                {/* 1. Header & Stats Row */}
                <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
                    <div className="bg-[#228B22] px-6 py-4 border-b border-[#D4AF37] flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <span className="mr-2">📋</span> ENROLLMENT COMMAND DASHBOARD
                        </h2>
                        <div className="text-[#F5F5DC] text-sm">
                            TODAY'S DATE: {new Date().toLocaleDateString()}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                        {/* Stat 1 */}
                        <div className="p-6 text-center hover:bg-green-50 transition-colors">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">NEW TODAY</div>
                            <div className="mt-2 text-3xl font-extrabold text-[#228B22]">{stats.newToday}</div>
                            <div className="text-sm text-gray-600">Students</div>
                            <div className="mt-2 text-xs text-green-600 font-semibold">📈 +{stats.newToday}</div>
                        </div>

                        {/* Stat 2 */}
                        <div className="p-6 text-center hover:bg-yellow-50 transition-colors">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">PENDING FEES</div>
                            <div className="mt-2 text-3xl font-extrabold text-[#D97706]">{stats.pendingPayments}</div>
                            <div className="text-sm text-gray-600">Payments</div>
                            <div className="mt-2 text-xs text-red-500 font-semibold">${stats.pendingAmount} Due</div>
                        </div>

                        {/* Stat 3 */}
                        <div className="p-6 text-center hover:bg-blue-50 transition-colors">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">TOTAL ACTIVE</div>
                            <div className="mt-2 text-3xl font-extrabold text-[#1E40AF]">{stats.totalActive}</div>
                            <div className="text-sm text-gray-600">Students</div>
                            <div className="mt-2 text-xs text-blue-600 font-semibold">🏫 School Wide</div>
                        </div>

                        {/* Actions */}
                        <div className="p-6 flex flex-col justify-center space-y-2 bg-gray-50">
                            <Link href={route('registrar.students.create')} className="w-full bg-[#228B22] text-white px-4 py-2 rounded shadow hover:bg-green-700 text-sm font-bold text-center">
                                View New (+3)
                            </Link>
                            <Link href={route('registrar.payments.index')} className="w-full bg-[#D4AF37] text-white px-4 py-2 rounded shadow hover:bg-yellow-600 text-sm font-bold text-center">
                                Collect Fees
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 2. Quick Registration Widget */}
                    <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-[#E5E7EB] h-full">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-bold text-[#1F2937]">🚀 QUICK REGISTRATION (FR-R01)</h3>
                        </div>
                        <div className="p-4">
                            <form onSubmit={submitQuickReg} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full border-gray-300 rounded shadow-sm focus:border-[#228B22] focus:ring-[#228B22] sm:text-sm"
                                        placeholder="Student Name"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Gender</label>
                                    <div className="flex space-x-4">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="Female"
                                                checked={data.gender === 'Female'}
                                                onChange={e => setData('gender', e.target.value)}
                                                className="text-[#EC4899] focus:ring-[#EC4899]"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Female 👩</span>
                                        </label>
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="Male"
                                                checked={data.gender === 'Male'}
                                                onChange={e => setData('gender', e.target.value)}
                                                className="text-[#3B82F6] focus:ring-[#3B82F6]"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Male 👨</span>
                                        </label>
                                    </div>
                                    {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Grade</label>
                                    <select
                                        value={data.grade_level}
                                        onChange={e => setData('grade_level', e.target.value)}
                                        className="w-full border-gray-300 rounded shadow-sm focus:border-[#228B22] focus:ring-[#228B22] sm:text-sm"
                                    >
                                        {grades?.map(g => (
                                            <option key={g.id} value={g.level}>{g.name}</option>
                                        ))}
                                    </select>
                                    {errors.grade_level && <p className="text-red-500 text-xs mt-1">{errors.grade_level}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Guardian Name</label>
                                    <input
                                        type="text"
                                        value={data.parent_name}
                                        onChange={e => setData('parent_name', e.target.value)}
                                        className="w-full border-gray-300 rounded shadow-sm focus:border-[#228B22] focus:ring-[#228B22] sm:text-sm"
                                        placeholder="Guardian Name"
                                    />
                                    {errors.parent_name && <p className="text-red-500 text-xs mt-1">{errors.parent_name}</p>}
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-[#1E40AF] hover:bg-blue-800 text-white font-bold py-2 px-4 rounded shadow transition-colors"
                                    >
                                        {processing ? 'Generating...' : '✨ Generate Student Account'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* 3. Recent Students Table */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-[#E5E7EB] h-full">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-bold text-[#1F2937]">🆕 RECENTLY ENROLLED</h3>
                            <Link href={route('registrar.students.create')} className="text-xs text-[#228B22] font-bold hover:underline">View All</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentStudents.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500 italic">
                                                No recent registrations found today.
                                            </td>
                                        </tr>
                                    ) : (
                                        recentStudents.map((student) => (
                                            <tr key={student.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{student.student_id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.user?.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {student.grade?.name} - {student.section?.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${student.gender === 'Female' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'}`}>
                                                        {student.gender}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <a href="#" className="text-[#228B22] hover:text-[#1a6b1a]">View</a>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* 4. Gender Distribution & Section Capacity (Visual Placeholder) */}
                <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="font-bold text-gray-700">GENDER DISTRIBUTION:</span>
                        <div className="flex space-x-4">
                            <span className="text-pink-600 font-semibold">👩 612 Female</span>
                            <span className="text-blue-600 font-semibold">👨 635 Male</span>
                        </div>
                        <span className="text-gray-400">|</span>
                        <span className="font-bold text-gray-700">SECTION CAPACITY:</span>
                        <span className="text-green-600 font-semibold">🟢 Optimal</span>
                    </div>
                </div>
            </div>
        </RegistrarLayout>
    );
}
