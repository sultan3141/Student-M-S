import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { CheckCircleIcon, ExclamationCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

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
            case 'saved': return 'text-green-600';
            case 'error': return 'text-red-600';
            case 'below-50': return 'text-orange-600';
            case 'editing': return 'text-blue-600';
            default: return 'text-gray-400';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'saved': return <CheckCircleIcon className="w-5 h-5" />;
            case 'error': return <ExclamationCircleIcon className="w-5 h-5" />;
            case 'below-50': return <ExclamationCircleIcon className="w-5 h-5" />;
            case 'editing': return <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />;
            default: return null;
        }
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Class Average</p>
                    <p className={`text-2xl font-bold ${parseFloat(stats.average) < 50 ? 'text-red-600' : 'text-gray-900'}`}>{stats.average}%</p>
                </div>
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Pass Rate</p>
                    <p className={`text-2xl font-bold ${stats.passRate < 50 ? 'text-red-600' : 'text-green-600'}`}>{stats.passRate}%</p>
                </div>
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Entered</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {localMarks.filter(m => m.mark !== '').length}/{students.length}
                    </p>
                </div>
                <div className="flex items-center justify-end">
                    <button
                        onClick={handleSave}
                        disabled={processing}
                        className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                    >
                        {processing ? <ArrowPathIcon className="w-5 h-5 animate-spin mr-2" /> : <CheckCircleIcon className="w-5 h-5 mr-2" />}
                        Save All
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Student Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Current Mark
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Enter Mark (0-100)
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {localMarks.map((student, index) => (
                            <tr key={student.student_id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 mr-3">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {/* History/Previous marks could go here */}
                                    -
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={student.mark}
                                            onChange={(e) => handleMarkChange(index, e.target.value)}
                                            className={`block w-24 rounded-md shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 ${student.status === 'error' ? 'border-red-300 text-red-900' :
                                                    student.status === 'below-50' ? 'border-orange-300 text-orange-900' :
                                                        'border-gray-300'
                                                }`}
                                            placeholder="-"
                                        />
                                        {student.error && (
                                            <div className="absolute left-28 top-2 text-xs text-red-600 whitespace-nowrap">
                                                {student.error}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className={`flex items-center text-sm ${getStatusColor(student.status)}`}>
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
