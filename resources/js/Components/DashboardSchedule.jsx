import React from 'react';

const DashboardSchedule = ({ schedule }) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    // Get all unique time slots across all days
    const allSlots = [];
    if (schedule) {
        Object.values(schedule).forEach(daySchedule => {
            if (Array.isArray(daySchedule)) {
                daySchedule.forEach(item => {
                    const timeKey = `${item.start_time}-${item.end_time}`;
                    if (!allSlots.find(s => s.timeKey === timeKey)) {
                        allSlots.push({
                            timeKey,
                            start: item.start_time,
                            end: item.end_time
                        });
                    }
                });
            }
        });
    }

    // Sort by start time
    allSlots.sort((a, b) => a.start.localeCompare(b.start));

    if (allSlots.length === 0) {
        return (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                <div className="text-4xl mb-3">📅</div>
                <h3 className="text-lg font-bold text-gray-900">No Weekly Schedule</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto mt-1">
                    Your class schedule hasn't been posted by the administration yet.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-navy-900 to-blue-900 p-4 md:p-6 text-white" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tight">Weekly Timetable</h2>
                        <p className="text-blue-200 text-xs font-medium uppercase tracking-widest mt-1">Class Program</p>
                    </div>
                    <div className="hidden md:block">
                        <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20">
                            Status: Active
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-4 md:p-6 overflow-x-auto">
                <table className="w-full border-collapse border border-gray-100 min-w-[700px]">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="border border-gray-100 px-4 py-3 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest w-24">Time</th>
                            {days.map(day => (
                                <th key={day} className="border border-gray-100 px-4 py-3 text-center text-[10px] font-black text-gray-700 uppercase tracking-widest">
                                    {day}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {allSlots.map((slot, idx) => (
                            <tr key={slot.timeKey} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}>
                                <td className="border border-gray-100 px-4 py-4 text-center">
                                    <div className="text-[10px] font-black text-navy-900 tracking-tight">{slot.start}</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{slot.end}</div>
                                </td>
                                {days.map(day => {
                                    const daySchedule = schedule[day] || [];
                                    const item = daySchedule.find(i =>
                                        i.start_time === slot.start &&
                                        i.end_time === slot.end
                                    );

                                    return (
                                        <td
                                            key={day}
                                            className={`border border-gray-100 px-3 py-4 text-center transition-colors hover:bg-blue-50/50 group ${item ? 'min-w-[120px]' : ''}`}
                                        >
                                            {item ? (
                                                <div className="space-y-1">
                                                    <div className={`inline-flex px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${item.type === 'break'
                                                            ? 'bg-amber-100 text-amber-700'
                                                            : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {item.type || 'Class'}
                                                    </div>
                                                    <div className="font-bold text-gray-800 text-sm tracking-tight leading-tight group-hover:text-blue-600">
                                                        {item.activity}
                                                    </div>
                                                    {item.location && (
                                                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-1">
                                                            <span>📍</span> {item.location}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="w-4 h-0.5 bg-gray-100 mx-auto rounded-full"></div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Academic Class</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Break / Activity</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSchedule;
