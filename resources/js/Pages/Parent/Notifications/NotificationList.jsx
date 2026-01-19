import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function NotificationList({ notifications }) {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <Head title="Notifications" />

            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    <Link href={route('parent.dashboard')} className="text-indigo-600 hover:text-indigo-900">
                        &larr; Back to Dashboard
                    </Link>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <li key={notification.id} className="p-4 hover:bg-gray-50">
                                    <div className="flex space-x-3">
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-medium">{notification.data?.title || 'Notification'}</h3>
                                                <p className="text-sm text-gray-500">{new Date(notification.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <p className="text-sm text-gray-500">{notification.data?.body || 'No content'}</p>
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="p-4 text-center text-gray-500">No notifications.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
