import DirectorLayout from '@/Layouts/DirectorLayout';
import { Head, Link } from '@inertiajs/react';
import { PlusIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function Index({ announcements }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'sent':
                return 'bg-emerald-100 text-emerald-700';
            case 'scheduled':
                return 'bg-blue-100 text-blue-700';
            case 'draft':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-red-100 text-red-700';
        }
    };

    return (
        <DirectorLayout>
            <Head title="Communication Center" />

            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-navy-900" style={{ color: '#0F172A' }}>
                        📢 Communication Command
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Broadcast messages and track engagement with parents and teachers
                    </p>
                </div>
                <Link
                    href="/director/announcements/create"
                    className="btn-executive flex items-center space-x-2"
                >
                    <PlusIcon className="h-5 w-5" />
                    <span>New Announcement</span>
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="executive-card">
                    <div className="text-sm font-medium text-gray-600 mb-2">TOTAL SENT</div>
                    <div className="text-3xl font-bold text-navy-900" style={{ color: '#0F172A' }}>
                        {announcements?.total || 0}
                    </div>
                </div>
                <div className="executive-card">
                    <div className="text-sm font-medium text-gray-600 mb-2">AVG OPEN RATE</div>
                    <div className="text-3xl font-bold text-blue-600">96%</div>
                    <div className="text-xs text-emerald-600 mt-1">↑ +3% vs last month</div>
                </div>
                <div className="executive-card">
                    <div className="text-sm font-medium text-gray-600 mb-2">SCHEDULED</div>
                    <div className="text-3xl font-bold text-amber-600">
                        {announcements?.data?.filter(a => a.status === 'scheduled').length || 0}
                    </div>
                </div>
                <div className="executive-card">
                    <div className="text-sm font-medium text-gray-600 mb-2">TOTAL REACH</div>
                    <div className="text-3xl font-bold text-purple-600">2,334</div>
                    <div className="text-xs text-gray-500 mt-1">Combined audience</div>
                </div>
            </div>

            {/* Announcements List */}
            <div className="executive-card">
                <h2 className="text-xl font-semibold text-navy-900 mb-4" style={{ color: '#0F172A' }}>
                    Recent Broadcasts
                </h2>

                <div className="space-y-4">
                    {announcements?.data?.map((announcement) => (
                        <div
                            key={announcement.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="font-semibold text-gray-900">{announcement.subject}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(announcement.status)}`}>
                                            {announcement.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                        {announcement.message}
                                    </p>
                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                        <span>📅 {new Date(announcement.created_at).toLocaleDateString()}</span>
                                        <span>👥 {announcement.total_recipients} recipients</span>
                                        {announcement.status === 'sent' && (
                                            <>
                                                <span>📖 {announcement.opened_count} opened ({announcement.open_rate}%)</span>
                                                <span>🔗 {announcement.clicked_count} clicked</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 ml-4">
                                    {announcement.status === 'sent' && (
                                        <Link
                                            href={`/director/announcements/${announcement.id}/analytics`}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="View Analytics"
                                        >
                                            <ChartBarIcon className="h-5 w-5 text-gray-600" />
                                        </Link>
                                    )}
                                    <Link
                                        href={`/director/announcements/${announcement.id}`}
                                        className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 
                                                 rounded-lg transition-colors"
                                    >
                                        View
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {(!announcements?.data || announcements.data.length === 0) && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📢</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements yet</h3>
                        <p className="text-gray-600 mb-4">Start communicating with your community</p>
                        <Link
                            href="/director/announcements/create"
                            className="btn-executive inline-flex items-center space-x-2"
                        >
                            <PlusIcon className="h-5 w-5" />
                            <span>Create Announcement</span>
                        </Link>
                    </div>
                )}
            </div>

            {/* Campaign Templates */}
            <div className="mt-6 executive-card">
                <h3 className="text-lg font-semibold text-navy-900 mb-4" style={{ color: '#0F172A' }}>
                    Quick Templates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { name: 'Academic Update', icon: '📚', desc: 'Share term results and progress' },
                        { name: 'Event Announcement', icon: '🎉', desc: 'Notify about upcoming events' },
                        { name: 'Important Notice', icon: '⚠️', desc: 'Critical school information' },
                    ].map((template, index) => (
                        <Link
                            key={index}
                            href={`/director/announcements/create?template=${template.name.toLowerCase().replace(' ', '_')}`}
                            className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md 
                                     transition-all cursor-pointer group"
                        >
                            <div className="text-3xl mb-2">{template.icon}</div>
                            <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-1">
                                {template.name}
                            </h4>
                            <p className="text-xs text-gray-600">{template.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </DirectorLayout>
    );
}
