import { Link } from '@inertiajs/react';
import {
    UserCircleIcon,
    AcademicCapIcon,
    ChartBarIcon,
    EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function TeacherCard({ teacher }) {
    const [showMenu, setShowMenu] = useState(false);

    const performance = teacher.performance || {};
    const status = teacher.user ? 'active' : 'inactive';

    const getPerformanceColor = (score) => {
        if (score >= 85) return 'text-emerald-600 bg-emerald-50';
        if (score >= 75) return 'text-blue-600 bg-blue-50';
        return 'text-amber-600 bg-amber-50';
    };

    const getPerformanceLabel = (score) => {
        if (score >= 85) return 'Excellent';
        if (score >= 75) return 'Good';
        return 'Needs Improvement';
    };

    return (
        <div className="executive-card hover:shadow-xl transition-all duration-300 group">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 
                                  flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {teacher.user?.name?.charAt(0) || 'T'}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {teacher.user?.name || 'Unknown'}
                        </h3>
                        <p className="text-xs text-gray-500">{teacher.employee_id}</p>
                    </div>
                </div>

                {/* Status Badge */}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${status === 'active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                    {status === 'active' ? '✓ Active' : 'Inactive'}
                </span>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4">
                {teacher.specialization && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <AcademicCapIcon className="h-4 w-4" />
                        <span>{teacher.specialization}</span>
                    </div>
                )}
                {teacher.department && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <UserCircleIcon className="h-4 w-4" />
                        <span>{teacher.department}</span>
                    </div>
                )}
                {teacher.assignments && teacher.assignments.length > 0 && (
                    <div className="text-xs text-gray-500">
                        Teaching {teacher.assignments.length} class{teacher.assignments.length !== 1 ? 'es' : ''}
                    </div>
                )}
            </div>

            {/* Performance Metrics */}
            {performance.avgClassScore !== undefined && (
                <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600">PERFORMANCE</span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${getPerformanceColor(performance.avgClassScore)
                            }`}>
                            {getPerformanceLabel(performance.avgClassScore)}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <div className="text-gray-500">Avg. Score</div>
                            <div className="font-semibold text-gray-900">{performance.avgClassScore?.toFixed(1)}%</div>
                        </div>
                        <div>
                            <div className="text-gray-500">Pass Rate</div>
                            <div className="font-semibold text-gray-900">{performance.passRate?.toFixed(1)}%</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-2">
                <Link
                    href={`/director/teachers/${teacher.id}`}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium 
                             hover:bg-blue-700 transition-colors text-center"
                >
                    View Profile
                </Link>
                <Link
                    href={`/director/teachers/${teacher.id}/edit`}
                    className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium 
                             hover:bg-gray-50 transition-colors"
                >
                    Edit
                </Link>
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-10">
                            <Link
                                href={`/director/teachers/${teacher.id}/performance`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Performance Details
                            </Link>
                            <Link
                                href={`/director/teachers/${teacher.id}`}
                                method="delete"
                                as="button"
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                Remove Teacher
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
