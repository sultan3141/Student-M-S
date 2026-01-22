import React, { useState } from 'react';
import DirectorLayout from '@/Layouts/DirectorLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Compose({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        recipient_type: '',
        recipient_ids: [],
        subject: '',
        message: '',
        schedule_type: 'now',
        scheduled_at: '',
    });

    const recipientTypes = [
        { id: 'all_parents', name: 'All Parents' },
        { id: 'all_teachers', name: 'All Teachers' },
        { id: 'grade_9', name: 'Grade 9 Families' },
        { id: 'grade_10', name: 'Grade 10 Families' },
        { id: 'grade_11', name: 'Grade 11 Families' },
        { id: 'grade_12', name: 'Grade 12 Families' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('director.announcements.send'));
    };

    return (
        <DirectorLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Compose Announcement</h2>}
        >
            <Head title="Compose Announcement" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                {/* Recipient Type */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        To:
                                    </label>
                                    <select
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={data.recipient_type}
                                        onChange={e => setData('recipient_type', e.target.value)}
                                        required
                                    >
                                        <option value="">Select Recipient Group</option>
                                        {recipientTypes.map(type => (
                                            <option key={type.id} value={type.id}>{type.name}</option>
                                        ))}
                                    </select>
                                    {errors.recipient_type && <div className="text-red-500 text-xs mt-1">{errors.recipient_type}</div>}
                                </div>

                                {/* Subject */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Subject:
                                    </label>
                                    <input
                                        type="text"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={data.subject}
                                        onChange={e => setData('subject', e.target.value)}
                                        required
                                    />
                                    {errors.subject && <div className="text-red-500 text-xs mt-1">{errors.subject}</div>}
                                </div>

                                {/* Message */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Message:
                                    </label>
                                    <textarea
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-48"
                                        value={data.message}
                                        onChange={e => setData('message', e.target.value)}
                                        required
                                    ></textarea>
                                    {errors.message && <div className="text-red-500 text-xs mt-1">{errors.message}</div>}
                                </div>

                                {/* Schedule */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Schedule:
                                    </label>
                                    <div className="flex gap-4">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                className="form-radio"
                                                name="schedule_type"
                                                value="now"
                                                checked={data.schedule_type === 'now'}
                                                onChange={e => setData('schedule_type', e.target.value)}
                                            />
                                            <span className="ml-2">Send Now</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                className="form-radio"
                                                name="schedule_type"
                                                value="scheduled"
                                                checked={data.schedule_type === 'scheduled'}
                                                onChange={e => setData('schedule_type', e.target.value)}
                                            />
                                            <span className="ml-2">Schedule for later</span>
                                        </label>
                                    </div>
                                </div>

                                {data.schedule_type === 'scheduled' && (
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Date & Time:
                                        </label>
                                        <input
                                            type="datetime-local"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            value={data.scheduled_at}
                                            onChange={e => setData('scheduled_at', e.target.value)}
                                            required={data.schedule_type === 'scheduled'}
                                        />
                                        {errors.scheduled_at && <div className="text-red-500 text-xs mt-1">{errors.scheduled_at}</div>}
                                    </div>
                                )}

                                <div className="flex items-center justify-end mt-4">
                                    <Link
                                        href={route('director.announcements.index')}
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        disabled={processing}
                                    >
                                        {processing ? 'Sending...' : (data.schedule_type === 'now' ? 'Send Announcement' : 'Schedule Announcement')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </DirectorLayout>
    );
}
