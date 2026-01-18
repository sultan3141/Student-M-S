import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    UserGroupIcon,
    CalendarIcon,
    HomeIcon,
    ClockIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const statusConfig = {
    complete: {
        icon: CheckCircleIcon,
        color: 'green',
        text: 'Complete',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-500',
        textColor: 'text-green-700'
    },
    partial: {
        icon: ClockIcon,
        color: 'amber',
        text: 'Partial',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-500',
        textColor: 'text-amber-700'
    },
    pending: {
        icon: ExclamationTriangleIcon,
        color: 'orange',
        text: 'Pending',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-500',
        textColor: 'text-orange-700'
    }
};

export default function SectionSelector({ gradeId, gradeName, onSelectSection, onBack }) {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredSection, setHoveredSection] = useState(null);

    useEffect(() => {
        fetchSections();
    }, [gradeId]);

    const fetchSections = async () => {
        try {
            const response = await axios.get(`/teacher/marks/wizard/sections/${gradeId}`);
            setSections(response.data);
        } catch (error) {
            console.error('Error fetching sections:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
                >
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back to Grades
                </button>

                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    📚 Select Section - {gradeName}
                </h2>
                <p className="text-gray-600">
                    Available sections for {gradeName}
                </p>
            </div>

            {/* Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section) => {
                    const status = statusConfig[section.status] || statusConfig.pending;
                    const StatusIcon = status.icon;
                    const isHovered = hoveredSection === section.id;

                    return (
                        <button
                            key={section.id}
                            onClick={() => onSelectSection(section)}
                            onMouseEnter={() => setHoveredSection(section.id)}
                            onMouseLeave={() => setHoveredSection(null)}
                            className={`
                                relative bg-white rounded-xl p-6 shadow-md
                                transition-all duration-300 ease-in-out
                                transform hover:scale-105 hover:shadow-2xl
                                border-l-4 ${status.borderColor}
                                text-left
                            `}
                        >
                            {/* Status Badge */}
                            <div className={`
                                absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold
                                flex items-center space-x-1
                                ${status.bgColor} ${status.textColor}
                            `}>
                                <StatusIcon className="w-4 h-4" />
                                <span>{status.text}</span>
                            </div>

                            {/* Section Name */}
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 pr-20">
                                {section.name}
                            </h3>

                            {/* Section Details */}
                            <div className="space-y-3">
                                {/* Student Count */}
                                <div className="flex items-center text-gray-600">
                                    <UserGroupIcon className="w-5 h-5 mr-3 text-blue-500" />
                                    <span className="font-medium">{section.student_count} Students</span>
                                </div>

                                {/* Schedule */}
                                <div className="flex items-center text-gray-600">
                                    <CalendarIcon className="w-5 h-5 mr-3 text-green-500" />
                                    <span className="text-sm">{section.schedule}</span>
                                </div>

                                {/* Room */}
                                <div className="flex items-center text-gray-600">
                                    <HomeIcon className="w-5 h-5 mr-3 text-purple-500" />
                                    <span className="text-sm">{section.room}</span>
                                </div>

                                {/* Last Updated */}
                                <div className="flex items-center text-gray-500">
                                    <ClockIcon className="w-5 h-5 mr-3 text-gray-400" />
                                    <span className="text-xs">
                                        📊 Last Updated: {section.last_updated}
                                    </span>
                                </div>
                            </div>

                            {/* Select Button */}
                            <div className={`
                                mt-6 py-2 px-4 rounded-lg text-center font-semibold
                                transition-all duration-300
                                ${isHovered
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-blue-50 text-blue-600 border-2 border-blue-200'
                                }
                            `}>
                                {section.status === 'complete' ? 'View →' : 'Select →'}
                            </div>

                            {/* Hover Glow */}
                            {isHovered && (
                                <div className="absolute inset-0 rounded-xl bg-blue-500 opacity-10 -z-10"></div>
                            )}
                        </button>
                    );
                })}
            </div>

            {sections.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-lg">No sections found for this grade.</p>
                </div>
            )}

            {/* Legend */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Status Indicators:</h4>
                <div className="flex flex-wrap gap-4">
                    {Object.entries(statusConfig).map(([key, config]) => {
                        const Icon = config.icon;
                        return (
                            <div key={key} className="flex items-center space-x-2">
                                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.textColor} flex items-center space-x-1`}>
                                    <Icon className="w-4 h-4" />
                                    <span>{config.text}</span>
                                </div>
                                <span className="text-xs text-gray-500">
                                    {key === 'complete' && 'All marks submitted'}
                                    {key === 'partial' && 'Some marks pending'}
                                    {key === 'pending' && 'No marks entered'}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
