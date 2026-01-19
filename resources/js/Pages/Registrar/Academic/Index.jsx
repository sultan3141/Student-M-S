import React from 'react';
import RegistrarLayout from '@/Layouts/RegistrarLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ currentYear, nextYear, promotionStats }) {

    const { post, processing } = useForm({
        mode: 'execute',
    });

    const handlePromote = () => {
        if (confirm('Are you sure you want to run the promotion engine? This will move passing students to the next grade.')) {
            post(route('registrar.academic.promote'));
        }
    };

    return (
        <RegistrarLayout user={null}>
            <Head title="Academic Year Manager" />

            <div className="space-y-6">

                {/* Header & Status */}
                <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
                    <div className="bg-[#228B22] px-6 py-4 border-b border-[#D4AF37] flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <span className="mr-2">🎓</span> ACADEMIC YEAR MANAGER
                        </h2>
                        <span className="px-3 py-1 bg-white text-green-800 rounded-full text-xs font-bold border border-green-200">
                            ● SYSTEM HEALTHY
                        </span>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Current Year Card */}
                        <div className="bg-[#228B22] rounded-lg p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl">25</div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-green-200">Current Academic Year</h3>
                            <div className="text-3xl font-extrabold mt-2">{currentYear?.name || '2025-2026'}</div>
                            <div className="mt-4 flex space-x-4 text-xs font-medium">
                                <span className="px-2 py-1 bg-green-700 rounded">Start: {currentYear?.start_date || 'Sep 1, 2025'}</span>
                                <span className="px-2 py-1 bg-green-700 rounded">End: {currentYear?.end_date || 'Jun 30, 2026'}</span>
                            </div>
                            <div className="mt-6">
                                <span className="text-xs uppercase bg-white text-[#228B22] px-2 py-1 rounded font-bold">In Session</span>
                            </div>
                        </div>

                        {/* Next Year Card (Preview) */}
                        <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300 relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl text-gray-400">26</div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Next Academic Year</h3>
                            <div className="text-3xl font-bold mt-2 text-gray-400">{nextYear?.name || '2026-2027 (Planned)'}</div>
                            <div className="mt-6 flex space-x-2">
                                <button className="text-xs bg-[#1E40AF] text-white px-3 py-1 rounded hover:bg-blue-800">Configure Calendar</button>
                                <button className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300">Open Registration</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Promotion Engine */}
                <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
                    <div className="bg-[#D4AF37] px-6 py-4 border-b border-yellow-600 flex justify-between items-center">
                        <h3 className="font-bold text-white flex items-center">
                            🚀 YEAR-END PROMOTION ENGINE
                        </h3>
                        <div className="text-xs text-yellow-100">
                            Auto-promotes students with Avg &gt; 50%
                        </div>
                    </div>

                    <div className="p-6">
                        <table className="min-w-full divide-y divide-gray-200 mb-6">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Transition</th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-green-600 uppercase">Passed (Auto)</th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-yellow-600 uppercase">Borderline (Review)</th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-red-600 uppercase">Repeat</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {Object.entries(promotionStats).map(([grade, stats], index) => {
                                    // Hacky next grade logic for display
                                    const nextGrade = grade.includes('9') ? 'Grade 10' :
                                        grade.includes('10') ? 'Grade 11' :
                                            grade.includes('11') ? 'Grade 12' : 'Graduate';
                                    return (
                                        <tr key={grade}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">
                                                {grade} ➔ {nextGrade}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900 bg-green-50">
                                                {stats.eligible} students
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900 bg-yellow-50">
                                                {stats.borderline} students
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900 bg-red-50">
                                                {stats.repeat} students
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <div className="bg-gray-100 p-4 rounded text-center">
                            <p className="text-sm text-gray-600 mb-4">
                                ⚠️ <strong>Caution:</strong> Running promotion will permanently update student records for the new academic year.
                                Ensure all marks are final before proceeding.
                            </p>
                            <button
                                onClick={handlePromote}
                                disabled={processing}
                                className="bg-[#1E40AF] hover:bg-blue-800 text-white font-bold py-3 px-8 rounded shadow text-sm uppercase tracking-wide transition-colors"
                            >
                                {processing ? 'Processing...' : 'Run Promotion Cycle'}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </RegistrarLayout>
    );
}
