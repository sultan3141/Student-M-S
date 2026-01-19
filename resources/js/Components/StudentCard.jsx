import { UserCircleIcon } from '@heroicons/react/24/solid';

export default function StudentCard({ student, isSelected = false, onClick }) {
    const getInitials = (firstName, lastName) => {
        const first = firstName?.charAt(0) || '';
        const last = lastName?.charAt(0) || '';
        return `${first}${last}`.toUpperCase();
    };

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
                        {getInitials(student.first_name, student.last_name)}
                    </span>
                </div>
                <div className="flex-1">
                    <h3 className={`font-semibold ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                        {student.first_name} {student.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                        {student.grade?.name || 'N/A'} - {student.section?.name || 'N/A'}
                    </p>
                </div>
            </div>
        </button>
    );
}
