import { useState, useEffect } from 'react';
import RegistrarLayout from '@/Layouts/RegistrarLayout';
import { Head, router } from '@inertiajs/react';

export default function PromotionIndex({ grades, registrationStatus }) {
    const [selectedGradeId, setSelectedGradeId] = useState('');
    const [selectedSectionId, setSelectedSectionId] = useState('');
    const [processingId, setProcessingId] = useState(null);
    const [isOpen, setIsOpen] = useState(registrationStatus.is_open);

    // Get current grade and its sections
    const currentGrade = grades.find(g => g.id === parseInt(selectedGradeId));
    const sections = currentGrade?.sections || [];

    // Get current section
    const currentSection = sections.find(s => s.id === parseInt(selectedSectionId));

    // Reset section when grade changes
    useEffect(() => {
        setSelectedSectionId('');
    }, [selectedGradeId]);

    const handlePromote = (studentId) => {
        if (!isOpen) return;

        setProcessingId(studentId);
        router.post(`/registrar/promotion/${studentId}/promote`, {}, {
            preserveScroll: true,
            onFinish: () => setProcessingId(null),
            onSuccess: () => {
                // Success is handled by standard Inertia flash messages
            },
            onError: (errors) => {
                alert(Object.values(errors).join('\n') || 'Promotion failed');
            }
        });
    };

    return (
        <RegistrarLayout>
            <Head title="Student Promotion" />

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-navy-900" style={{ color: '#0F172A' }}>
                    🎓 Student Promotion
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                    Register eligible students for the next grade level.
                </p>
            </div>

            {/* Registration Status Banner */}
            <div className={`mb-8 p-6 rounded-xl border-2 transition-all ${isOpen
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <span className="text-3xl">{isOpen ? '🟢' : '🔴'}</span>
                        <div>
                            <h2 className={`text-xl font-bold ${isOpen ? 'text-emerald-800' : 'text-red-800'}`}>
                                Registration is {isOpen ? 'OPEN' : 'CLOSED'}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {isOpen
                                    ? "Promotion is currently active. You can promote eligible students."
                                    : "Registration is currently closed by the Director"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Selection Row */}
            <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Select Grade</label>
                    <select
                        value={selectedGradeId}
                        onChange={(e) => setSelectedGradeId(e.target.value)}
                        className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all font-medium py-3"
                    >
                        <option value="">-- Choose Grade --</option>
                        {grades.map((grade) => (
                            <option key={grade.id} value={grade.id}>{grade.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Select Section</label>
                    <select
                        value={selectedSectionId}
                        onChange={(e) => setSelectedSectionId(e.target.value)}
                        disabled={!selectedGradeId}
                        className={`w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all font-medium py-3 ${!selectedGradeId ? 'bg-gray-50 opacity-60' : ''
                            }`}
                    >
                        <option value="">-- Choose Section --</option>
                        {sections.map((section) => (
                            <option key={section.id} value={section.id}>Section {section.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Student Table */}
            {currentSection ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-navy-900">
                            {currentGrade.name} - Section {currentSection.name}
                            <span className="ml-3 text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                                {currentSection.students.length} Students
                            </span>
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-white">
                                    <th className="px-6 py-4">Student Name</th>
                                    <th className="px-6 py-4">Student ID</th>
                                    <th className="px-6 py-4 text-center">Final Avg</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentSection.students.length > 0 ? (
                                    currentSection.students.map((student) => (
                                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-navy-900">{student.name}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-mono text-gray-600">
                                                {student.student_id}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${student.average >= 50
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {student.average}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handlePromote(student.id)}
                                                    disabled={!isOpen || !student.is_eligible || student.is_promoted || processingId === student.id}
                                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${isOpen && student.is_eligible && !student.is_promoted
                                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-95'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                >
                                                    {processingId === student.id ? 'Registering...' : student.is_promoted ? 'Registered' : 'Register'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                            <div className="text-4xl mb-2">🤷‍♂️</div>
                                            <div className="text-gray-500 font-medium italic text-lg">No students found in this section.</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="text-5xl mb-4 opacity-40">📝</div>
                    <h3 className="text-xl font-bold text-gray-400">Please select both Grade and Section</h3>
                    <p className="text-gray-400 max-w-xs mx-auto mt-2">Choose the target class and section above to view the student list for promotion.</p>
                </div>
            )}

            {!isOpen && (
                <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm flex items-center space-x-3">
                    <span className="text-xl">⚠️</span>
                    <p>Registration is currently closed by the Director</p>
                </div>
            )}
        </RegistrarLayout>
    );
}
