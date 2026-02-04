import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';

export default function SemesterStatusGrid({ currentSemester }) {
    if (!currentSemester || !currentSemester.details) return null;

    const semesters = currentSemester.details;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[1, 2].map((semNum) => {
                const info = semesters[semNum];
                const isOpen = info?.status === 'open';

                return (
                    <div
                        key={semNum}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isOpen
                                ? 'bg-green-50 border-green-200 shadow-sm'
                                : 'bg-gray-50 border-gray-200 opacity-75'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isOpen ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'
                                }`}>
                                {isOpen ? <LockOpenIcon className="w-5 h-5" /> : <LockClosedIcon className="w-5 h-5" />}
                            </div>
                            <div>
                                <h3 className={`font-bold ${isOpen ? 'text-green-900' : 'text-gray-700'}`}>
                                    Semester {semNum}
                                </h3>
                                <p className={`text-xs font-medium ${isOpen ? 'text-green-700' : 'text-gray-500'}`}>
                                    {isOpen ? 'Open for Mark Entry' : 'Closed & Locked'}
                                </p>
                            </div>
                        </div>

                        {isOpen && (
                            <span className="px-2.5 py-1 bg-white text-green-700 text-xs font-bold rounded-md shadow-sm border border-green-100">
                                ACTIVE
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
