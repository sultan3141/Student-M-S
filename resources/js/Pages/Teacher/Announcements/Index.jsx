import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head } from '@inertiajs/react';
import {
    ChatBubbleLeftRightIcon,
    CalendarIcon,
    UserIcon,
    PaperClipIcon
} from '@heroicons/react/24/outline';

export default function Index({ announcements }) {
    return (
        <TeacherLayout>
            <Head title="Announcements" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-600" />
                        Communication Center
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Stay updated with the latest announcements from the school administration.
                    </p>
                </div>

                {/* Announcements List */}
                <div className="space-y-6">
                    {announcements?.data?.map((announcement) => (
                        <div
                            key={announcement.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                Announcement
                                            </span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <CalendarIcon className="h-3 w-3" />
                                                {new Date(announcement.sent_at).toLocaleDateString(undefined, {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {announcement.subject}
                                        </h3>

                                        <div className="prose prose-sm text-gray-600 mb-4">
                                            {announcement.message}
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <UserIcon className="h-4 w-4" />
                                                <span>From: {announcement.sender?.name || 'Administration'}</span>
                                            </div>

                                            {announcement.attachments && announcement.attachments.length > 0 && (
                                                <div className="flex gap-2">
                                                    {announcement.attachments.map((file, idx) => (
                                                        <a
                                                            key={idx}
                                                            href={file.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                                                        >
                                                            <PaperClipIcon className="h-3 w-3" />
                                                            Attachment {idx + 1}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Empty State */}
                    {(!announcements?.data || announcements.data.length === 0) && (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-semibold text-gray-900">No announcements</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                You haven't received any announcements yet.
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {announcements?.links && announcements.links.length > 3 && (
                        <div className="flex justify-center mt-8">
                            <div className="flex gap-1">
                                {announcements.links.map((link, key) => (
                                    <a
                                        key={key}
                                        href={link.url}
                                        className={`px-3 py-1 rounded-md text-sm ${link.active
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                            } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </TeacherLayout>
    );
}
