import { useState, useEffect } from 'react';
import axios from 'axios';
import { AcademicCapIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const gradeColors = {
    9: {
        primary: '#8B5CF6', // Purple
        light: '#EDE9FE',
        dark: '#6D28D9',
        text: '#5B21B6'
    },
    10: {
        primary: '#3B82F6', // Blue
        light: '#DBEAFE',
        dark: '#1E40AF',
        text: '#1E3A8A'
    },
    11: {
        primary: '#10B981', // Green
        light: '#D1FAE5',
        dark: '#047857',
        text: '#065F46'
    },
    12: {
        primary: '#F59E0B', // Amber
        light: '#FEF3C7',
        dark: '#D97706',
        text: '#92400E'
    }
};

export default function GradeSelector({ onSelectGrade }) {
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredGrade, setHoveredGrade] = useState(null);

    useEffect(() => {
        fetchGrades();
    }, []);

    const fetchGrades = async () => {
        try {
            const response = await axios.get('/teacher/marks/wizard/grades');
            setGrades(response.data);
        } catch (error) {
            console.error('Error fetching grades:', error);
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
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    🎓 Select Grade Level
                </h2>
                <p className="text-gray-600">
                    Choose the grade you're teaching this semester
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {grades.map((grade) => {
                    const colors = gradeColors[grade.level] || gradeColors[10];
                    const isHovered = hoveredGrade === grade.id;

                    return (
                        <button
                            key={grade.id}
                            onClick={() => onSelectGrade(grade)}
                            onMouseEnter={() => setHoveredGrade(grade.id)}
                            onMouseLeave={() => setHoveredGrade(null)}
                            className={`
                                relative overflow-hidden rounded-xl p-6 
                                transition-all duration-300 ease-in-out
                                transform hover:scale-105 hover:shadow-2xl
                                ${isHovered ? 'shadow-2xl' : 'shadow-md'}
                            `}
                            style={{
                                backgroundColor: isHovered ? colors.primary : colors.light,
                                borderLeft: `4px solid ${colors.primary}`,
                                borderRight: `4px solid ${colors.primary}`,
                            }}
                        >
                            {/* Background Icon */}
                            <div
                                className="absolute top-0 right-0 w-24 h-24 transform translate-x-6 -translate-y-6 opacity-10"
                            >
                                <AcademicCapIcon className="w-full h-full" style={{ color: colors.dark }} />
                            </div>

                            {/* Content */}
                            <div className="relative z-10">
                                <div className={`text-5xl font-black mb-3 transition-colors duration-300`}
                                    style={{ color: isHovered ? 'white' : colors.text }}>
                                    {grade.level}
                                </div>

                                <h3 className={`text-xl font-bold mb-2 transition-colors duration-300`}
                                    style={{ color: isHovered ? 'white' : colors.text }}>
                                    Grade {grade.level}
                                </h3>

                                <p className={`text-sm mb-4 transition-colors duration-300`}
                                    style={{ color: isHovered ? 'rgba(255,255,255,0.9)' : colors.text }}>
                                    {grade.level === 9 && '🧪 Science Focus'}
                                    {grade.level === 10 && '📐 Math Focus'}
                                    {grade.level === 11 && '🔬 Physics Focus'}
                                    {grade.level === 12 && '🎓 Advanced Studies'}
                                </p>

                                {/* Section Count */}
                                <div className={`
                                    flex items-center justify-center space-x-2 p-2 rounded-lg
                                    transition-colors duration-300
                                    ${isHovered ? 'bg-white/20' : 'bg-white'}
                                `}>
                                    <UserGroupIcon className={`w-5 h-5`}
                                        style={{ color: isHovered ? 'white' : colors.primary }} />
                                    <span className={`font-semibold transition-colors duration-300`}
                                        style={{ color: isHovered ? 'white' : colors.text }}>
                                        {grade.section_count} {grade.section_count === 1 ? 'Section' : 'Sections'}
                                    </span>
                                </div>

                                {/* Select Button */}
                                <div className="mt-4">
                                    <div className={`
                                        py-2 px-4 rounded-lg font-semibold text-center
                                        transition-all duration-300
                                        ${isHovered ? 'bg-white shadow-lg transform scale-105' : 'bg-transparent border-2'}
                                    `}
                                        style={{
                                            color: isHovered ? colors.primary : colors.text,
                                            borderColor: isHovered ? 'transparent' : colors.primary
                                        }}>
                                        Select →
                                    </div>
                                </div>
                            </div>

                            {/* Glow Effect on Hover */}
                            {isHovered && (
                                <div
                                    className="absolute inset-0 rounded-xl opacity-30 blur-xl"
                                    style={{ backgroundColor: colors.primary }}
                                ></div>
                            )}
                        </button>
                    );
                })}
            </div>

            {grades.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No grades assigned to you yet.</p>
                </div>
            )}
        </div>
    );
}
