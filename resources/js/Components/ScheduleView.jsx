import React from 'react';

export default function ScheduleView({ schedule, grade, section }) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                    Weekly Schedule
                    {grade && section && (
                        <span className="ml-2 text-sm font-normal text-gray-500">
                            ({grade.name} - {section.name})
                        </span>
                    )}
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {days.map(day => (
                    <div key={day} className="border rounded-lg p-3 bg-gray-50/50">
                        <h3 className="font-semibold text-md mb-3 text-center text-gray-700 border-b pb-2">{day}</h3>
                        <div className="space-y-3">
                            {schedule[day] && schedule[day].length > 0 ? (
                                schedule[day].map((item) => (
                                    <div key={item.id} className="bg-white p-3 rounded shadow-sm border-l-4 border-indigo-500 hover:shadow-md transition-shadow">
                                        <div className="font-bold text-gray-800 text-sm">
                                            {item.start_time.substring(0, 5)} - {item.end_time.substring(0, 5)}
                                        </div>
                                        <div className="text-indigo-600 font-medium text-sm mt-1">{item.activity}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-400 text-xs py-4 italic">
                                    No classes
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
