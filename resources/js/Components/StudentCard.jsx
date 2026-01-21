import { UserCircleIcon } from '@heroicons/react/24/solid';
import { memo } from 'react';

const StudentCard = memo(({ student, isSelected = false, onClick }) => {
    const getInitials = (name) => {
        if (!name) return 'ST';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const studentName = student.user?.name || student.first_name + ' ' + student.last_name || 'Unknown Student';

    return (
        <button
            onClick={onClick}
            className={`
                w-full p-5 rounded-lg border-2 transition-all duration-200 text-left
                ${isSelected
                    ? 'border-indigo-600 bg-indigo-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                }
            `}
        >
            <div className="flex items-center space-x-4">
                <div className={`
                    flex items-center justify-center w-12 h-12 rounded-full
                    ${isSelected ? 'bg-indigo-600' : 'bg-indigo-500'}
                `}>
                    <span className="text-white font-semibold text-lg">
                        {getInitials(studentName)}
                    </span>
                </div>
                <div className="flex-1">
                    <h3 className={`font-semibold ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                        {studentName}
                    </h3>
                    <p className="text-sm text-gray-600">
                        {student.grade?.name || 'N/A'} - Section {student.section?.name || 'N/A'}
                    </p>
                </div>
            </div>
        </button>
    );
});

StudentCard.displayName = 'StudentCard';

export default StudentCard;
