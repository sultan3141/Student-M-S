import ParentLayout from '@/Layouts/ParentLayout';
import { Head } from '@inertiajs/react';
import {
    ChatBubbleLeftRightIcon,
    CalendarIcon,
    UserIcon,
    PaperClipIcon,
    MegaphoneIcon
} from '@heroicons/react/24/outline';

export default function Index({ announcements }) {
    return (
        <ParentLayout>
            <Head title="School Announcements" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-[#1E3A8A] flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <MegaphoneIcon className="h-8 w-8 text-[#1D4ED8]" />
                        </div>
                        Communication Center
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Stay updated with important news and academic notices from Darul-Ulum School.
                    </p>
                </div>

                {/* Announcements List */}
                <div className="space-y-6">
                    {announcements?.data?.map((announcement) => (
                        <div
                            key={announcement.id}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
                                                {announcement.recipient_type === 'all_parents' ? 'For Parents' :
                                                    announcement.recipient_type === 'all_students' ? 'School News' :
                                                        announcement.recipient_type.startsWith('grade_') ? 'Grade Notice' : 'Specific Message'}
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                                <CalendarIcon className="h-3.5 w-3.5" />
                                                {new Date(announcement.sent_at).toLocaleDateString(undefined, {
                                                    weekday: 'short',
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-black text-[#1E3A8A] mb-3 tracking-tight">
                                            {announcement.subject}
                                        </h3>

                                        <div className="text-gray-600 text-sm mb-6 leading-relaxed whitespace-pre-wrap">
                                            {announcement.message}
                                        </div>

                                        <div className="flex items-center justify-between pt-5 border-t border-gray-50 bg-gray-50/50 -mx-6 -mb-6 px-6 py-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                                                    <UserIcon className="h-4 w-4 text-[#1D4ED8]" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">From</p>
                                                    <p className="text-xs font-bold text-gray-900 mt-0.5">{announcement.sender?.name || 'School Administration'}</p>
                                                </div>
                                            </div>

                                            {announcement.attachments && announcement.attachments.length > 0 && (
                                                <div className="flex gap-2">
                                                    {announcement.attachments.map((file, idx) => (
                                                        <a
                                                            key={idx}
                                                            href={file.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#1D4ED8] hover:text-[#1E40AF] bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm transition-all hover:scale-105 active:scale-95"
                                                        >
                                                            <PaperClipIcon className="h-3 w-3" />
                                                            Files
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
                        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 shadow-sm">
                            <div className="bg-blue-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <MegaphoneIcon className="h-10 w-10 text-blue-200" />
                            </div>
                            <h3 className="text-xl font-black text-[#1E3A8A] tracking-tight">No Communications Yet</h3>
                            <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto font-medium">
                                Important news and updates from school administration will appear here.
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {announcements?.links && announcements.links.length > 3 && (
                        <div className="flex justify-center mt-12">
                            <nav className="inline-flex rounded-xl shadow-sm bg-white p-1 border border-gray-100">
                                {announcements.links.map((link, key) => (
                                    <a
                                        key={key}
                                        href={link.url}
                                        className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${link.active
                                            ? 'bg-[#1D4ED8] text-white'
                                            : 'text-gray-500 hover:bg-gray-50'
                                            } ${!link.url && 'opacity-30 cursor-not-allowed hidden'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </ParentLayout>
    );
}
