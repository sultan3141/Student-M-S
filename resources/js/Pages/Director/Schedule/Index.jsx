import React, { useState, useEffect } from 'react';
import DirectorLayout from '@/Layouts/DirectorLayout';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import SchoolSchedule from '@/Components/Director/SchoolSchedule';
import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    DocumentArrowDownIcon,
    FunnelIcon,
    ChevronRightIcon,
    ArrowLeftIcon,
    FolderIcon,
    AcademicCapIcon,
    ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

export default function ScheduleIndex() {
    const { grades } = usePage().props;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [scheduleData, setScheduleData] = useState([]);
    const [createMode, setCreateMode] = useState('table'); // 'single' or 'table'
    const [bulkGradeId, setBulkGradeId] = useState('');
    const [bulkSectionId, setBulkSectionId] = useState('');
    const [periods, setPeriods] = useState([
        { start_time: '08:10', end_time: '08:30', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
        { start_time: '08:30', end_time: '09:15', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
        { start_time: '09:20', end_time: '10:05', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
        { start_time: '10:10', end_time: '10:55', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
        { start_time: '11:00', end_time: '11:45', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
        { start_time: '11:50', end_time: '12:35', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
        { start_time: '13:25', end_time: '14:10', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
        { start_time: '14:15', end_time: '15:00', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
    ]);

    const [editingSchedule, setEditingSchedule] = useState(null);
    const [isEditPeriodModalOpen, setIsEditPeriodModalOpen] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState({ start: '', end: '', activity: '', oldStart: '', oldEnd: '' });

    // Form state for creating/editing schedule
    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        grade_id: '',
        section_id: '',
        day_of_week: 'Monday',
        start_time: '',
        end_time: '',
        activity: '',
        // For bulk creation
        monday_activity: '',
        tuesday_activity: '',
        wednesday_activity: '',
        thursday_activity: '',
        friday_activity: '',
    });

    // Fetch schedule when section is selected
    const fetchSchedule = () => {
        if (selectedSection) {
            axios.get(route('director.schedule.section', selectedSection))
                .then(response => {
                    setScheduleData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching schedule:', error);
                    setScheduleData([]);
                });
        } else {
            setScheduleData([]);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, [selectedSection]);

    const openCreateModal = () => {
        setEditingSchedule(null);
        setCreateMode('table'); // Default to table mode
        setBulkGradeId(selectedGrade || '');
        setBulkSectionId(selectedSection || '');
        // Reset periods
        setPeriods([
            { start_time: '08:10', end_time: '08:30', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
            { start_time: '08:30', end_time: '09:15', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
            { start_time: '09:20', end_time: '10:05', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
            { start_time: '10:10', end_time: '10:55', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
            { start_time: '11:00', end_time: '11:45', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
            { start_time: '11:50', end_time: '12:35', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
            { start_time: '13:25', end_time: '14:10', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
            { start_time: '14:15', end_time: '15:00', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
        ]);
        reset();
        setData({
            grade_id: selectedGrade || '',
            section_id: selectedSection || '',
            day_of_week: 'Monday',
            start_time: '',
            end_time: '',
            activity: '',
            monday_activity: '',
            tuesday_activity: '',
            wednesday_activity: '',
            thursday_activity: '',
            friday_activity: '',
        });
        setIsCreateModalOpen(true);
    };

    const openEditModal = (schedule) => {
        setEditingSchedule(schedule);
        setCreateMode('single'); // Edit mode is always single
        setData({
            grade_id: schedule.grade_id,
            section_id: schedule.section_id,
            day_of_week: schedule.day_of_week,
            start_time: schedule.start_time?.substring(0, 5), // Format HH:mm
            end_time: schedule.end_time?.substring(0, 5),
            activity: schedule.activity,
            monday_activity: '',
            tuesday_activity: '',
            wednesday_activity: '',
            thursday_activity: '',
            friday_activity: '',
        });
        setIsCreateModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this schedule?')) {
            destroy(route('director.schedule.destroy', id), {
                onSuccess: () => {
                    fetchSchedule();
                },
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingSchedule) {
            put(route('director.schedule.update', editingSchedule.id), {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    fetchSchedule();
                    setEditingSchedule(null);
                    reset();
                },
            });
        } else {
            post(route('director.schedule.store'), {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    fetchSchedule();
                    reset();
                },
            });
        }
    };

    const openEditPeriodModal = (slot) => {
        // Find existing activity if any
        let existingActivity = '';
        Object.values(scheduleData).forEach(daySchedule => {
            if (Array.isArray(daySchedule)) {
                daySchedule.forEach(item => {
                    if (item.start_time?.substring(0, 5) === slot.start &&
                        item.end_time?.substring(0, 5) === slot.end) {
                        existingActivity = item.activity;
                    }
                });
            }
        });

        setSelectedPeriod({
            start: slot.start,
            end: slot.end,
            activity: existingActivity,
            oldStart: slot.start,
            oldEnd: slot.end
        });
        setIsEditPeriodModalOpen(true);
    };

    const handleEditPeriodSubmit = (e) => {
        e.preventDefault();

        // Find all items in the period
        const itemsToUpdate = [];
        Object.values(scheduleData).forEach(daySchedule => {
            if (Array.isArray(daySchedule)) {
                daySchedule.forEach(item => {
                    if (item.start_time?.substring(0, 5) === selectedPeriod.oldStart &&
                        item.end_time?.substring(0, 5) === selectedPeriod.oldEnd) {
                        itemsToUpdate.push(item);
                    }
                });
            }
        });

        if (itemsToUpdate.length === 0) {
            setIsEditPeriodModalOpen(false);
            return;
        }

        // Update all items
        Promise.all(
            itemsToUpdate.map(item =>
                axios.put(route('director.schedule.update', item.id), {
                    grade_id: item.grade_id,
                    section_id: item.section_id,
                    day_of_week: item.day_of_week,
                    start_time: selectedPeriod.start,
                    end_time: selectedPeriod.end,
                    activity: selectedPeriod.activity
                })
            )
        ).then(() => {
            setIsEditPeriodModalOpen(false);
            fetchSchedule();
            alert('Period and subjects updated successfully!');
        }).catch(error => {
            console.error('Error updating period:', error);
            alert('Error updating period. Please check the logs.');
        });
    };

    const handleExport = (format) => {
        const params = new URLSearchParams();
        if (selectedGrade) params.append('grade_id', selectedGrade);
        if (selectedSection) params.append('section_id', selectedSection);

        window.location.href = route(`director.schedule.export-${format}`) + '?' + params.toString();
    };

    // Filter sections based on selected grade
    const filteredSections = grades.find(g => g.id == data.grade_id)?.sections || [];
    const viewFilteredSections = grades.find(g => g.id == selectedGrade)?.sections || [];

    return (
        <DirectorLayout>
            <Head title="School Schedule" />

            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-navy-900" style={{ color: '#0F172A' }}>
                            📅 School Program Schedule
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            {selectedSection ? 'Manage and view class schedules' : 'Select a class to manage its schedule'}
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        {selectedSection && (
                            <button
                                onClick={() => {
                                    setSelectedSection('');
                                    setSelectedGrade('');
                                }}
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-200"
                            >
                                <ArrowLeftIcon className="h-5 w-5" />
                                <span>Back to All Classes</span>
                            </button>
                        )}
                        <button
                            onClick={() => handleExport('pdf')}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                            <DocumentArrowDownIcon className="h-5 w-5" />
                            <span>Export PDF</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Class Directory View (When no section is selected) */}
            {!selectedSection && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {grades.map(grade => (
                            <div key={grade.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex items-center space-x-2">
                                    <FolderIcon className="h-5 w-5 text-blue-500" />
                                    <h3 className="font-bold text-gray-800">{grade.name}</h3>
                                </div>
                                <div className="p-5">
                                    <div className="grid grid-cols-2 gap-3">
                                        {grade.sections?.map(section => (
                                            <button
                                                key={section.id}
                                                onClick={() => {
                                                    setSelectedGrade(grade.id);
                                                    setSelectedSection(section.id);
                                                }}
                                                className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <AcademicCapIcon className="h-4 w-4 text-gray-400 group-hover:text-blue-500" />
                                                    <div className="flex flex-col items-start">
                                                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{section.name}</span>
                                                    </div>
                                                </div>
                                                <ChevronRightIcon className="h-4 w-4 text-gray-300 group-hover:text-blue-400" />
                                            </button>
                                        ))}
                                        {(!grade.sections || grade.sections.length === 0) && (
                                            <p className="text-xs text-gray-400 italic col-span-2">No sections available</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Schedule Management View */}
            {selectedSection && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-2xl font-bold mb-6 text-center">
                            CLASS SCHEDULE - {grades.find(g => g.id == selectedGrade)?.name} {viewFilteredSections.find(s => s.id == selectedSection)?.name}
                        </h3>

                        {/* Add New Period Button */}
                        <div className="mb-4 flex justify-end">
                            <button
                                onClick={() => {
                                    setEditingSchedule(null);
                                    setCreateMode('single');
                                    setData({
                                        grade_id: selectedGrade,
                                        section_id: selectedSection,
                                        day_of_week: 'Monday',
                                        start_time: '',
                                        end_time: '',
                                        activity: '',
                                        monday_activity: '',
                                        tuesday_activity: '',
                                        wednesday_activity: '',
                                        thursday_activity: '',
                                        friday_activity: '',
                                    });
                                    setIsCreateModalOpen(true);
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                + Add Time Period
                            </button>
                        </div>

                        {/* Dynamic Table Format Schedule */}
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border-2 border-gray-600">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border-2 border-gray-600 px-6 py-3 text-center font-bold text-gray-700">TIME</th>
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                                            <th key={day} className="border-2 border-gray-600 px-6 py-3 text-center font-bold text-gray-700">
                                                {day}
                                            </th>
                                        ))}
                                        <th className="border-2 border-gray-600 px-4 py-3 text-center font-bold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(() => {
                                        // Get all unique time slots across all days
                                        const allSlots = [];
                                        Object.values(scheduleData).forEach(daySchedule => {
                                            if (Array.isArray(daySchedule)) {
                                                daySchedule.forEach(item => {
                                                    const timeKey = `${item.start_time?.substring(0, 5)}-${item.end_time?.substring(0, 5)}`;
                                                    if (!allSlots.find(s => s.timeKey === timeKey)) {
                                                        allSlots.push({
                                                            timeKey,
                                                            start: item.start_time?.substring(0, 5),
                                                            end: item.end_time?.substring(0, 5)
                                                        });
                                                    }
                                                });
                                            }
                                        });

                                        // Sort by start time
                                        allSlots.sort((a, b) => a.start.localeCompare(b.start));

                                        if (allSlots.length === 0) {
                                            return (
                                                <tr>
                                                    <td colSpan="7" className="border-2 border-gray-600 px-4 py-8 text-center text-gray-500">
                                                        <div className="text-lg mb-2">No schedule created yet</div>
                                                        <div className="text-sm">Click "Add Time Period" to create your first schedule entry</div>
                                                    </td>
                                                </tr>
                                            );
                                        }

                                        return allSlots.map((slot, idx) => (
                                            <tr key={slot.timeKey}>
                                                <td className="border-2 border-gray-600 px-4 py-4 text-center font-semibold bg-gray-100 text-gray-700">
                                                    {slot.start} - {slot.end}
                                                </td>
                                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => {
                                                    const daySchedule = scheduleData[day] || [];
                                                    const item = Array.isArray(daySchedule)
                                                        ? daySchedule.find(i =>
                                                            i.start_time?.substring(0, 5) === slot.start &&
                                                            i.end_time?.substring(0, 5) === slot.end
                                                        )
                                                        : null;

                                                    return (
                                                        <td
                                                            key={day}
                                                            className="border-2 border-gray-600 px-4 py-4 text-center relative group cursor-pointer hover:bg-blue-50 transition-colors min-h-[60px]"
                                                            onClick={() => {
                                                                if (item) {
                                                                    openEditModal(item);
                                                                } else {
                                                                    // Open modal to add activity for this cell
                                                                    setEditingSchedule(null);
                                                                    setCreateMode('single');
                                                                    setData({
                                                                        grade_id: selectedGrade,
                                                                        section_id: selectedSection,
                                                                        day_of_week: day,
                                                                        start_time: slot.start,
                                                                        end_time: slot.end,
                                                                        activity: '',
                                                                        monday_activity: '',
                                                                        tuesday_activity: '',
                                                                        wednesday_activity: '',
                                                                        thursday_activity: '',
                                                                        friday_activity: '',
                                                                    });
                                                                    setIsCreateModalOpen(true);
                                                                }
                                                            }}
                                                        >
                                                            {item ? (
                                                                <>
                                                                    <div className="font-semibold text-gray-900 text-base">{item.activity}</div>

                                                                    {/* Delete button on hover */}
                                                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDelete(item.id);
                                                                            }}
                                                                            className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 font-medium"
                                                                        >
                                                                            ✕
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <span className="text-gray-300 text-sm group-hover:text-blue-500">Click to add</span>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                                <td className="border-2 border-gray-600 px-2 py-2 text-center bg-gray-50">
                                                    <div className="flex flex-col space-y-2 items-center">
                                                        <button
                                                            onClick={() => openEditPeriodModal(slot)}
                                                            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 font-medium w-full"
                                                            title="Edit this time period for all days"
                                                        >
                                                            Edit Period
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm(`Delete all entries for time slot ${slot.start} - ${slot.end}?`)) {
                                                                    // Delete all entries for this time slot
                                                                    const itemsToDelete = [];
                                                                    Object.values(scheduleData).forEach(daySchedule => {
                                                                        if (Array.isArray(daySchedule)) {
                                                                            daySchedule.forEach(item => {
                                                                                if (item.start_time?.substring(0, 5) === slot.start &&
                                                                                    item.end_time?.substring(0, 5) === slot.end) {
                                                                                    itemsToDelete.push(item.id);
                                                                                }
                                                                            });
                                                                        }
                                                                    });

                                                                    // Delete all items
                                                                    Promise.all(
                                                                        itemsToDelete.map(id =>
                                                                            axios.delete(route('director.schedule.destroy', id))
                                                                        )
                                                                    ).then(() => {
                                                                        fetchSchedule();
                                                                    });
                                                                }
                                                            }}
                                                            className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 font-medium w-full"
                                                            title="Delete this time period"
                                                        >
                                                            Delete Period
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ));
                                    })()}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>💡 How to use:</strong> Click "Add Time Period" to create a new time slot.
                                Click on any cell to add/edit subjects. Click "Delete Period" to remove an entire time row.
                                Once saved, this schedule will be visible to all students, parents, and teachers in this class.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal - Flexible cell editor */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            {editingSchedule ? 'Edit Schedule Entry' : 'Add Schedule Entry'}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                {/* Time Period */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <h3 className="font-semibold text-blue-900 mb-3">Time Period</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                            <input
                                                type="time"
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                value={data.start_time}
                                                onChange={e => setData('start_time', e.target.value)}
                                                required
                                            />
                                            {errors.start_time && <div className="text-red-500 text-xs mt-1">{errors.start_time}</div>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                            <input
                                                type="time"
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                value={data.end_time}
                                                onChange={e => setData('end_time', e.target.value)}
                                                required
                                            />
                                            {errors.end_time && <div className="text-red-500 text-xs mt-1">{errors.end_time}</div>}
                                        </div>
                                    </div>
                                </div>

                                {/* Day Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Day of Week
                                    </label>
                                    <select
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={data.day_of_week}
                                        onChange={e => setData('day_of_week', e.target.value)}
                                        required
                                    >
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                    {errors.day_of_week && <div className="text-red-500 text-sm mt-1">{errors.day_of_week}</div>}
                                </div>

                                {/* Subject/Activity */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject / Activity
                                    </label>
                                    <input
                                        type="text"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg px-4 py-3"
                                        value={data.activity}
                                        onChange={e => setData('activity', e.target.value)}
                                        placeholder="e.g. Mathematics, English, P.E."
                                        required
                                        autoFocus
                                    />
                                    {errors.activity && <div className="text-red-500 text-sm mt-1">{errors.activity}</div>}
                                </div>

                                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : (editingSchedule ? 'Update' : 'Add')}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Period Modal */}
            {isEditPeriodModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Edit Time Period</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Updating this will change the time for all subjects in this row.
                        </p>

                        <form onSubmit={handleEditPeriodSubmit}>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                        <input
                                            type="time"
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            value={selectedPeriod.start}
                                            onChange={e => setSelectedPeriod({ ...selectedPeriod, start: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                        <input
                                            type="time"
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            value={selectedPeriod.end}
                                            onChange={e => setSelectedPeriod({ ...selectedPeriod, end: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject / Activity (For All Days)</label>
                                    <input
                                        type="text"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                        placeholder="e.g. Mathematics, Break, Lunch"
                                        value={selectedPeriod.activity}
                                        onChange={e => setSelectedPeriod({ ...selectedPeriod, activity: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditPeriodModalOpen(false)}
                                        className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Update All Entries
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Quick Links */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                    href={route('director.dashboard')}
                    className="executive-card hover:shadow-lg transition-shadow cursor-pointer"
                >
                    <div className="text-3xl mb-2">📊</div>
                    <h3 className="font-bold text-gray-900 mb-1">Back to Dashboard</h3>
                    <p className="text-sm text-gray-600">View overall school metrics</p>
                </Link>

                <Link
                    href={route('director.students.index')}
                    className="executive-card hover:shadow-lg transition-shadow cursor-pointer"
                >
                    <div className="text-3xl mb-2">👥</div>
                    <h3 className="font-bold text-gray-900 mb-1">Student Directory</h3>
                    <p className="text-sm text-gray-600">Manage student information</p>
                </Link>

                <Link
                    href={route('director.teachers.index')}
                    className="executive-card hover:shadow-lg transition-shadow cursor-pointer"
                >
                    <div className="text-3xl mb-2">👨‍🏫</div>
                    <h3 className="font-bold text-gray-900 mb-1">Teacher Management</h3>
                    <p className="text-sm text-gray-600">Manage teacher assignments</p>
                </Link>
            </div>
        </DirectorLayout>
    );
}
