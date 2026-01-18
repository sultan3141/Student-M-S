import React from 'react';

export default function Filters({ academicYears, filters, onFilterChange }) {
    return (
        <div className="bg-white p-4 shadow rounded mb-6 flex gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Academic Year</label>
                <select
                    value={filters.academic_year_id || ''}
                    onChange={e => onFilterChange('academic_year_id', e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="">All Years</option>
                    {academicYears.map(year => (
                        <option key={year.id} value={year.id}>{year.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Semester</label>
                <select
                    value={filters.semester || ''}
                    onChange={e => onFilterChange('semester', e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="">All Semesters</option>
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                </select>
            </div>
        </div>
    );
}
