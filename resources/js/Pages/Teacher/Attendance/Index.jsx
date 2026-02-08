import React, { useState, useEffect } from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import {
    ClockIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    CalendarIcon,
    AcademicCapIcon,
    UserGroupIcon,
    BookOpenIcon
} from '@heroicons/react/24/outline';

export default function Index({ auth, schedule, todayDate, stats }) {
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    
    const [grades, setGrades] = useState([]);
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);
    
    const [loading, setLoading] = useState(false);
    
    // Load grades on mount
    useEffect(() => {
        axios.get(route('teacher.attendance.grades'))
            .then(response => setGrades(response.data))
            .catch(error => console.error('Error loading grades:', error));
    }, []);
    
    // Load sections when grade changes
    useEffect(() => {
        if (selectedGrade) {
            setLoading(true);
            axios.get(route('teacher.attendance.sections'), {
                params: { grade_id: selectedGrade }
            })
            .then(response => {
                setSections(response.data);
                setSelectedSection('');
                setSubjects([]);
                setSelectedSubject('');
            })
            .catch(error => console.error('Error loading sections:', error))
            .finally(() => setLoading(false));
        } else {
            setSections([]);
            setSubjects([]);
            setSelectedSection('');
            setSelectedSubject('');
        }
    }, [selectedGrade]);
    
    // Load subjects when section changes
    useEffect(() => {
        if (selectedSection) {
            setLoading(true);
            axios.get(route('teacher.attendance.subjects'), {
                params: { section_id: selectedSection }
            })
            .then(response => {
                setSubjects(response.data);
                setSelectedSubject('');
            })
            .catch(error => console.error('Error loading subjects:', error))
            .finally(() => setLoading(false));
        } else {
            setSubjects([]);
            setSelectedSubject('');
        }
    }, [selectedSection]);
    
    const handleTakeAttendance = () => {
        if (selectedGrade && selectedSection && selectedSubject) {
            router.get(route('teacher.attendance.create'), {
                grade_id: selectedGrade,
                section_id: selectedSection,
                subject_id: selectedSubject,
            });
        }
    };
    
    return (
        <TeacherLayout>
            <Head title="Attendance Dashboard" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">📅 Attendance Management</h1>
                        <p className="mt-1 text-sm text-gray-500">{todayDate}</p>
                    </div>
                    
                    <Link
                        href={route('teacher.attendance.history')}
                        className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <CalendarIcon className="w-5 h-5 mr-2" />
                        View History
                    </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-green-50 text-green-600">
                                <CheckCircleIcon className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Classes Completed</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.todayCompleted} / {stats.totalClasses}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                                <CalendarIcon className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Weekly Rate</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.weekRate}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-orange-50 text-orange-600">
                                <ExclamationCircleIcon className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Pending Actions</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.totalClasses - stats.todayCompleted}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cascading Selection for Taking Attendance */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <ClockIcon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="ml-3 text-lg font-semibold text-gray-900">Take Attendance</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Grade Selection */}
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <AcademicCapIcon className="w-4 h-4 mr-1.5 text-blue-600" />
                                1. Select Grade
                            </label>
                            <select
                                value={selectedGrade}
                                onChange={(e) => setSelectedGrade(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                <option value="">Choose Grade</option>
                                {grades.map(grade => (
                                    <option key={grade.id} value={grade.id}>{grade.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Section Selection */}
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <UserGroupIcon className="w-4 h-4 mr-1.5 text-blue-600" />
                                2. Select Section
                            </label>
                            <select
                                value={selectedSection}
                                onChange={(e) => setSelectedSection(e.target.value)}
                                disabled={!selectedGrade || loading}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="">Choose Section</option>
                                {sections.map(section => (
                                    <option key={section.id} value={section.id}>{section.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Subject Selection */}
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <BookOpenIcon className="w-4 h-4 mr-1.5 text-blue-600" />
                                3. Select Subject
                            </label>
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                disabled={!selectedSection || loading}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="">Choose Subject</option>
                                {subjects.map(subject => (
                                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Action Button */}
                        <div className="flex items-end">
                            <button
                                onClick={handleTakeAttendance}
                                disabled={!selectedGrade || !selectedSection || !selectedSubject || loading}
                                className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
                            >
                                {loading ? 'Loading...' : 'Take Attendance →'}
                            </button>
                        </div>
                    </div>
                    
                    <div className="mt-4 flex items-start text-sm text-blue-700 bg-blue-100 rounded-lg p-3">
                        <ExclamationCircleIcon className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                        <p>Select grade, section, and subject to mark attendance. Once saved, attendance cannot be edited.</p>
                    </div>
                </div>

                {/* Today's Classes */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-lg font-medium text-gray-900">Today's Schedule</h3>
                    </div>

                    {schedule.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {schedule.map((cls) => (
                                <div key={cls.section_id} className="p-6 transition-colors hover:bg-gray-50/50">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                                        <div className="flex items-start">
                                            <div className={`p-2 rounded-lg ${cls.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                                <ClockIcon className="w-6 h-6" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="flex items-center space-x-2">
                                                    <h4 className="text-lg font-semibold text-gray-900">{cls.subject_name}</h4>
                                                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                                                        {cls.grade_name} - {cls.section_name}
                                                    </span>
                                                </div>
                                                <div className="mt-1 flex items-center text-sm text-gray-500 space-x-4">
                                                    <span>{cls.student_count} Students</span>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {cls.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-gray-500">
                            <ClockIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                            <p className="text-lg font-medium">No classes scheduled for today.</p>
                            <p className="text-sm">Enjoy your free day!</p>
                        </div>
                    )}
                </div>
            </div>
        </TeacherLayout>
    );
}
