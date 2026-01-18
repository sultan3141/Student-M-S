import { useState, useEffect } from 'react';
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    FireIcon,
    TrophyIcon,
    EllipsisVerticalIcon
} from '@heroicons/react/24/outline';

export default function ModernMarkTable({ students, data, setData, maxScore = 100 }) {
    const [localMarks, setLocalMarks] = useState({});
    const [focusedRow, setFocusedRow] = useState(null);
    const [savedRows, setSavedRows] = useState(new Set());

    useEffect(() => {
        // Initialize local marks from data
        const marks = {};
        students.forEach(student => {
            marks[student.id] = data.marks?.find(m => m.student_id === student.id)?.marks_obtained || '';
        });
        setLocalMarks(marks);
    }, [students, data.marks]);

    const handleMarkChange = (studentId, value) => {
        setLocalMarks(prev => ({
            ...prev,
            [studentId]: value
        }));
    };

    const handleMarkBlur = (studentId) => {
        const mark = localMarks[studentId];

        // Validate
        if (mark !== '' && (isNaN(mark) || mark < 0 || mark > maxScore)) {
            alert(`Please enter a valid mark between 0 and ${maxScore}`);
            return;
        }

        // Update parent data
        const updatedMarks = [...(data.marks || [])];
        const existingIndex = updatedMarks.findIndex(m => m.student_id === studentId);

        if (existingIndex >= 0) {
            updatedMarks[existingIndex].marks_obtained = mark;
        } else {
            updatedMarks.push({ student_id: studentId, marks_obtained: mark });
        }

        setData('marks', updatedMarks);

        // Mark as saved (simulate auto-save)
        if (mark !== '') {
            setSavedRows(prev => new Set([...prev, studentId]));
        }
    };

    const getStatusInfo = (studentId, mark, previousMark) => {
        if (savedRows.has(studentId) && mark !== '') {
            return {
                icon: CheckCircleIcon,
                text: 'Saved',
                color: 'text-green-600',
                bgColor: 'bg-green-50'
            };
        }
        if (focusedRow === studentId) {
            return {
                icon: null,
                text: 'Editing',
                color: 'text-blue-600',
                bgColor: 'bg-blue-50'
            };
        }
        if (mark === '' || mark === null || mark === undefined) {
            return {
                icon: null,
                text: 'Empty',
                color: 'text-gray-400',
                bgColor: 'bg-gray-50'
            };
        }
        if (parseFloat(mark) < 40) {
            return {
                icon: ExclamationTriangleIcon,
                text: 'Very Low',
                color: 'text-red-600',
                bgColor: 'bg-red-50'
            };
        }
        if (parseFloat(mark) < 50) {
            return {
                icon: ExclamationTriangleIcon,
                text: 'Low',
                color: 'text-orange-600',
                bgColor: 'bg-orange-50'
            };
        }
        if (parseFloat(mark) >= 85) {
            return {
                icon: TrophyIcon,
                text: 'High',
                color: 'text-green-600',
                bgColor: 'bg-green-50'
            };
        }
        return {
            icon: null,
            text: 'Average',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        };
    };

    const handleKeyDown = (e, currentIndex) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const nextIndex = currentIndex + 1;
            if (nextIndex < students.length) {
                const nextInput = document.getElementById(`mark-input-${students[nextIndex].id}`);
                nextInput?.focus();
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = currentIndex + 1;
            if (nextIndex < students.length) {
                const nextInput = document.getElementById(`mark-input-${students[nextIndex].id}`);
                nextInput?.focus();
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIndex = currentIndex - 1;
            if (prevIndex >= 0) {
                const prevInput = document.getElementById(`mark-input-${students[prevIndex].id}`);
                prevInput?.focus();
            }
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                #
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                Student
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                                Mark (0-{maxScore})
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {students.map((student, index) => {
                            const mark = localMarks[student.id];
                            const status = getStatusInfo(student.id, mark, student.previous_mark);
                            const StatusIcon = status.icon;

                            return (
                                <tr
                                    key={student.id}
                                    className={`
                                        transition-colors duration-150
                                        ${focusedRow === student.id ? 'bg-blue-50' : 'hover:bg-gray-50'}
                                    `}
                                >
                                    {/* Row Number */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {index + 1}
                                    </td>

                                    {/* Student Info */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {student.name}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    ID: {student.student_id}
                                                </div>
                                                {student.previous_mark && (
                                                    <div className="text-xs text-gray-400">
                                                        Last: {student.previous_mark}%
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Mark Input */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <input
                                            id={`mark-input-${student.id}`}
                                            type="number"
                                            min="0"
                                            max={maxScore}
                                            value={mark || ''}
                                            onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                            onFocus={() => setFocusedRow(student.id)}
                                            onBlur={() => {
                                                setFocusedRow(null);
                                                handleMarkBlur(student.id);
                                            }}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            className={`
                                                w-24 px-3 py-2 text-center text-lg font-semibold
                                                border-2 rounded-lg transition-all duration-200
                                                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                                ${focusedRow === student.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-300'
                                                }
                                                ${mark === '' ? 'text-gray-400' : 'text-gray-900'}
                                            `}
                                            placeholder="--"
                                        />
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className={`
                                            inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold
                                            ${status.bgColor} ${status.color}
                                        `}>
                                            {StatusIcon && <StatusIcon className="w-4 h-4" />}
                                            <span>{status.text}</span>
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <EllipsisVerticalIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {students.length === 0 && (
                <div className="text-center py-12 bg-gray-50">
                    <p className="text-gray-500 text-lg">No students found in this section.</p>
                </div>
            )}
        </div>
    );
}
