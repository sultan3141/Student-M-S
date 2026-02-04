import { CalendarIcon, LockClosedIcon, LockOpenIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function SemesterWidget({ semester, userType = 'teacher' }) {
    if (!semester) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500 text-center">No active semester</p>
            </div>
        );
    }

    const isOpen = semester.status === 'open' || semester.is_open;
    const canInteract = userType === 'teacher' ? semester.can_enter_marks : semester.can_view_results;

    return (
        <div className={`rounded-lg shadow-md overflow-hidden ${
            isOpen ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200' : 
            'bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-200'
        }`}>
            {/* Header */}
            <div className={`px-4 py-3 ${isOpen ? 'bg-green-500' : 'bg-gray-500'}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-5 w-5 text-white" />
                        <h3 className="text-white font-semibold text-sm">
                            Current Semester
                        </h3>
                    </div>
                    <div className="flex items-center space-x-1">
                        {isOpen ? (
                            <LockOpenIcon className="h-4 w-4 text-white" />
                        ) : (
                            <LockClosedIcon className="h-4 w-4 text-white" />
                        )}
                        <span className="text-white text-xs font-medium">
                            {isOpen ? 'OPEN' : 'CLOSED'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
                {/* Academic Year & Semester */}
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Academic Period</p>
                    <p className="text-lg font-bold text-gray-900">
                        Semester {semester.semester} - {semester.academic_year}
                    </p>
                </div>

                {/* Status Message */}
                <div className={`flex items-start space-x-2 p-3 rounded-md ${
                    canInteract ? 'bg-blue-50 border border-blue-200' : 'bg-yellow-50 border border-yellow-200'
                }`}>
                    <div className="flex-shrink-0 mt-0.5">
                        {canInteract ? (
                            <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                    <div className="flex-1">
                        <p className={`text-sm font-medium ${canInteract ? 'text-blue-800' : 'text-yellow-800'}`}>
                            {semester.message}
                        </p>
                    </div>
                </div>

                {/* Timeline Info */}
                <div className="space-y-2">
                    {semester.opened_at && (
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Opened:</span>
                            <span className="text-gray-700 font-medium">{semester.opened_at}</span>
                        </div>
                    )}
                    
                    {semester.closed_at && (
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Closed:</span>
                            <span className="text-gray-700 font-medium">{semester.closed_at}</span>
                        </div>
                    )}

                    {semester.estimated_close_date && isOpen && (
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Est. Close:</span>
                            <span className="text-gray-700 font-medium">{semester.estimated_close_date}</span>
                        </div>
                    )}

                    {semester.estimated_date && !isOpen && (
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Est. Available:</span>
                            <span className="text-gray-700 font-medium">{semester.estimated_date}</span>
                        </div>
                    )}

                    {semester.days_remaining !== undefined && semester.days_remaining >= 0 && (
                        <div className="flex items-center space-x-2 mt-2 p-2 bg-white rounded border border-gray-200">
                            <ClockIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-xs text-gray-600">
                                <span className="font-bold text-gray-900">{semester.days_remaining}</span> days remaining
                            </span>
                        </div>
                    )}
                </div>

                {/* Action Buttons for Teachers */}
                {userType === 'teacher' && canInteract && (
                    <div className="pt-2 border-t border-gray-200">
                        <a
                            href="/teacher/declare-result"
                            className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            Enter Marks
                        </a>
                    </div>
                )}

                {/* Action Buttons for Students */}
                {userType === 'student' && canInteract && (
                    <div className="pt-2 border-t border-gray-200">
                        <a
                            href="/student/academic/semesters"
                            className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            View Results
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
