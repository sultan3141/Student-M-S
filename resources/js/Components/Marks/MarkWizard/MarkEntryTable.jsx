import { useState, useRef, useEffect } from 'react';

export default function MarkEntryTable({ data, setData, students }) {
    // Local state for faster UI updates before syncing with parent
    const [marks, setMarks] = useState(data.marks || {});

    // Initialize marks if empty
    useEffect(() => {
        if (Object.keys(marks).length === 0 && students.length > 0) {
            const initialMarks = {};
            students.forEach(student => {
                initialMarks[student.id] = {
                    student_id: student.id,
                    score: ''
                };
            });
            setMarks(initialMarks);
        }
    }, [students]);

    // Sync back to parent form data
    useEffect(() => {
        setData('marks', Object.values(marks));
    }, [marks]);

    const handleScoreChange = (studentId, value) => {
        // Validation: 0-100 only
        if (value !== '' && (isNaN(value) || value < 0 || value > 100)) {
            return;
        }

        setMarks(prev => ({
            ...prev,
            [studentId]: {
                student_id: studentId,
                score: value
            }
        }));
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Enter' || e.key === 'ArrowDown') {
            e.preventDefault();
            const nextInput = document.querySelector(`input[data-index="${index + 1}"]`);
            if (nextInput) nextInput.focus();
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevInput = document.querySelector(`input[data-index="${index - 1}"]`);
            if (prevInput) prevInput.focus();
        }
    };

    return (
        <div className="bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg overflow-hidden">
            <div className="min-w-full divide-y divide-gray-300">
                <div className="bg-gray-50">
                    <div className="grid grid-cols-12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="col-span-1">#</div>
                        <div className="col-span-5">Student</div>
                        <div className="col-span-2">ID</div>
                        <div className="col-span-4">Score (0-100)</div>
                    </div>
                </div>
                <div className="bg-white divide-y divide-gray-200">
                    {students.map((student, index) => (
                        <div key={student.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-gray-50 transition-colors">
                            <div className="col-span-1 text-sm text-gray-500">
                                {index + 1}
                            </div>
                            <div className="col-span-5 flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                    <img
                                        className="h-10 w-10 rounded-full object-cover"
                                        src={student.photo || `https://ui-avatars.com/api/?name=${student.name}&background=random`}
                                        alt=""
                                    />
                                </div>
                                <div className="ml-4">
                                    <div className="font-medium text-gray-900">{student.name}</div>
                                </div>
                            </div>
                            <div className="col-span-2 text-sm text-gray-500 font-mono">
                                {student.student_id_number}
                            </div>
                            <div className="col-span-4">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    data-index={index}
                                    value={marks[student.id]?.score || ''}
                                    onChange={(e) => handleScoreChange(student.id, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className={`
                                        block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                                        ${(marks[student.id]?.score < 0 || marks[student.id]?.score > 100) ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : ''}
                                    `}
                                    placeholder="Enter score"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {students.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                    No students found in this section.
                </div>
            )}
        </div>
    );
}
