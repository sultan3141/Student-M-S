import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { CheckCircleIcon, ExclamationCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

/**
 * MarkEntryTable Component
 * Handles the grid input for student marks with real-time validation and status updates.
 * Features:
 * - 0-100 range validation
 * - Visual status indicators (Saved, Editing, Error)
 * - Auto-calculation of class stats
 */
export default function MarkEntryTable({ students, subject, assessmentType, semester, academicYear, className = '' }) {
    // Local state for immediate UI feedback
    const [localMarks, setLocalMarks] = useState(
        students.map(s => ({
            student_id: s.id,
            name: s.name,
            mark: s.mark !== null ? s.mark : '',
            status: s.status || 'pending', // pending, editing, saved, error
            error: null
        }))
    );

    const [stats, setStats] = useState({ average: 0, passRate: 0 });

    const { data, setData, post, processing, recentlySuccessful } = useForm({
        marks: [],
        subject,
        assessment_type_id: assessmentType.id,
        semester,
        academic_year: academicYear
    });

    // Calculate stats whenever marks change
    useEffect(() => {
        const validMarks = localMarks
            .map(m => parseFloat(m.mark))
            .filter(m => !isNaN(m));

        if (validMarks.length > 0) {
            const sum = validMarks.reduce((a, b) => a + b, 0);
            const avg = sum / validMarks.length;
            const passed = validMarks.filter(m => m >= 50).length;
            const rate = (passed / validMarks.length) * 100;

            setStats({
                average: avg.toFixed(1),
                passRate: Math.round(rate)
            });
        }
    }, [localMarks]);

    const handleMarkChange = (index, value) => {
        const newMarks = [...localMarks];
        const numValue = parseFloat(value);

        // Validation
        let status = 'editing';
        let error = null;

        if (value === '') {
            status = 'pending';
        } else if (isNaN(numValue) || numValue < 0 || numValue > 100) {
            status = 'error';
            error = '0-100 only';
        } else {
            status = numValue < 50 ? 'below-50' : 'editing';
        }

        newMarks[index] = { ...newMarks[index], mark: value, status, error };
        setLocalMarks(newMarks);
    };

    const handleSave = () => {
        // Filter out invalid or empty marks
        const marksToSubmit = localMarks
            .filter(m => m.status !== 'error' && m.mark !== '' && m.mark !== null)
            .map(m => ({
                student_id: m.student_id,
                mark: parseFloat(m.mark)
            }));

        setData('marks', marksToSubmit);

        // In a real implementation, we'd trigger the post here in a useEffect or similar 
        // after data state updates, or pass data directly to a wrapper function.
        // For simplicity in this snippet calling post manually with constructed data below.

        post(route('teacher.marks.store'), {
            data: {
                marks: marksToSubmit,
                subject,
                assessment_type_id: assessmentType.id,
                semester,
                academic_year: academicYear
            },
            preserveScroll: true,
            onSuccess: () => {
                const updated = localMarks.map(m => ({
                    ...m,
                    status: (m.mark !== '' && m.mark !== null && m.status !== 'error') ? 'saved' : m.status
                }));
                setLocalMarks(updated);
            }
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'saved': return 'text-[#10B981]';
            case 'error': return 'text-[#EF4444]';
            case 'below-50': return 'text-[#F97316]'; // Orange for warning
            case 'editing': return 'text-[#3B82F6]'; // Blue for editing
            default: return 'text-[#94A3B8]'; // Muted gray
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'saved': return <CheckCircleIcon className="w-5 h-5 text-[#10B981]" />;
            case 'error': return <ExclamationCircleIcon className="w-5 h-5 text-[#EF4444]" />;
            case 'below-50': return <ExclamationCircleIcon className="w-5 h-5 text-[#F97316]" />;
            case 'editing': return <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]" />;
            default: return null;
        }
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gradient-to-r from-[#F1F5F9] to-[#FFFFFF] rounded-xl border border-[#E2E8F0] shadow-sm">
                <div className="pl-2 border-l-4 border-[#3B82F6]">
                    <p className="text-xs font-bold text-[#475569] uppercase tracking-wider">Class Average</p>
                    <p className={`text-2xl font-bold ${parseFloat(stats.average) < 50 ? 'text-[#EF4444]' : 'text-[#1E293B]'}`}>{stats.average}%</p>
                </div>
                <div className="pl-2 border-l-4 border-[#10B981]">
                    <p className="text-xs font-bold text-[#475569] uppercase tracking-wider">Pass Rate</p>
                    <p className={`text-2xl font-bold ${stats.passRate < 50 ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>{stats.passRate}%</p>
                </div>
                <div className="pl-2 border-l-4 border-[#F59E0B]">
                    <p className="text-xs font-bold text-[#475569] uppercase tracking-wider">Entered</p>
                    <p className="text-2xl font-bold text-[#3B82F6]">
                        {localMarks.filter(m => m.mark !== '').length}<span className="text-[#94A3B8] text-lg font-normal">/{students.length}</span>
                    </p>
                </div>
                <div className="flex items-center justify-end">
                    <button
                        onClick={handleSave}
                        disabled={processing}
                        className="flex items-center px-6 py-2.5 bg-[#3B82F6] hover:bg-[#1E40AF] text-white font-bold rounded-lg shadow-[0_4px_6px_-1px_rgba(30,64,175,0.2)] transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? <ArrowPathIcon className="w-5 h-5 animate-spin mr-2" /> : <CheckCircleIcon className="w-5 h-5 mr-2" />}
                        Save All
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#FFFFFF] rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
                <table className="min-w-full divide-y divide-[#E2E8F0]">
                    <thead className="bg-gradient-to-r from-[#F1F5F9] to-[#E2E8F0] border-b border-[#3B82F6]">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[#1E40AF] uppercase tracking-wider border-r border-[#E2E8F0]/50">
                                Student Name
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[#1E40AF] uppercase tracking-wider border-r border-[#E2E8F0]/50">
                                Current Mark
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[#1E40AF] uppercase tracking-wider border-r border-[#E2E8F0]/50">
                                Enter Mark (0-100)
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[#1E40AF] uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-[#E2E8F0]">
                        {localMarks.map((student, index) => (
                            <tr key={student.student_id} className="hover:bg-[#F8FAFC] transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap border-b border-[#E2E8F0]">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-[#F1F5F9] flex items-center justify-center text-sm font-bold text-[#475569] mr-3 ring-1 ring-[#E2E8F0]">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div className="text-sm font-medium text-[#1E293B] group-hover:text-[#3B82F6] transition-colors">{student.name}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#475569] border-b border-[#E2E8F0]">
                                    {/* History/Previous marks could go here */}
                                    -
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-b border-[#E2E8F0]">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={student.mark}
                                            onChange={(e) => handleMarkChange(index, e.target.value)}
                                            className={`block w-24 rounded-md shadow-sm sm:text-sm text-[#1E293B] transition-all duration-200
                                                focus:ring-2 focus:ring-[#F59E0B]/20 focus:border-[#F59E0B] focus:shadow-[0_0_0_4px_rgba(245,158,11,0.1)]
                                                ${student.status === 'error' ? 'border-[#EF4444] text-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20' :
                                                    student.status === 'below-50' ? 'border-[#F97316] text-[#F97316] focus:border-[#F97316]' :
                                                        student.status === 'saved' ? 'border-[#10B981] text-[#10B981] bg-[#10B981]/5' :
                                                            'border-[#E2E8F0]'
                                                }`}
                                            placeholder="-"
                                        />
                                        {student.error && (
                                            <div className="absolute left-28 top-2 text-xs text-[#EF4444] font-medium whitespace-nowrap bg-[#FEF2F2] px-2 py-0.5 rounded border border-[#FECACA]">
                                                {student.error}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-b border-[#E2E8F0]">
                                    <div className={`flex items-center text-sm font-medium ${getStatusColor(student.status)}`}>
                                        {getStatusIcon(student.status)}
                                        <span className="ml-2 capitalize">{student.status === 'below-50' ? 'Low Score' : student.status}</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
