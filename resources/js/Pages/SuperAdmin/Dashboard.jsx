import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, Link } from '@inertiajs/react';
import {
    UsersIcon,
    Cog6ToothIcon,
    ShieldCheckIcon,
    ChartBarIcon,
    LockClosedIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function Dashboard({ stats, gradeDistribution }) {
    const coreMenus = [
        {
            name: 'User Management',
            description: 'Create, modify, activate, or deactivate user accounts',
            icon: UsersIcon,
            href: route('super_admin.users.index'),
            color: 'blue',
            stats: [
                { label: 'Total Users', value: stats?.totalStudents || '0' },
                { label: 'Active', value: stats?.maleStudents || '0' },
            ]
        },
        {
            name: 'System Configuration',
            description: 'Configure grading, fees, academic settings, and workflows',
            icon: Cog6ToothIcon,
            href: route('super_admin.config.index'),
            color: 'purple',
            stats: [
                { label: 'Grade Levels', value: '12' },
                { label: 'Semesters', value: '2' },
            ]
        },
        {
            name: 'Security & Audit',
            description: 'Monitor security events and view audit logs',
            icon: ShieldCheckIcon,
            href: route('super_admin.security.audit-logs'),
            color: 'red',
            stats: [
                { label: 'Audit Logs', value: '1,234' },
                { label: 'Security Events', value: '12' },
            ]
        },
        {
            name: 'Data & Backup',
            description: 'Manage backups and export system data',
            icon: ChartBarIcon,
            href: route('super_admin.data.backups'),
            color: 'green',
            stats: [
                { label: 'Backups', value: '15' },
                { label: 'Last Backup', value: 'Today' },
            ]
        },
        {
            name: 'Access Control',
            description: 'Configure role-based permissions and access',
            icon: LockClosedIcon,
            href: route('super_admin.access.index'),
            color: 'yellow',
            stats: [
                { label: 'Roles', value: '6' },
                { label: 'Permissions', value: '24' },
            ]
        },
    ];

    const colorClasses = {
        blue: {
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            border: 'border-blue-100',
            hover: 'hover:bg-blue-100',
        },
        purple: {
            bg: 'bg-purple-50',
            text: 'text-purple-600',
            border: 'border-purple-100',
            hover: 'hover:bg-purple-100',
        },
        red: {
            bg: 'bg-red-50',
            text: 'text-red-600',
            border: 'border-red-100',
            hover: 'hover:bg-red-100',
        },
        green: {
            bg: 'bg-green-50',
            text: 'text-green-600',
            border: 'border-green-100',
            hover: 'hover:bg-green-100',
        },
        yellow: {
            bg: 'bg-yellow-50',
            text: 'text-yellow-600',
            border: 'border-yellow-100',
            hover: 'hover:bg-yellow-100',
        },
    };

    return (
        <SuperAdminLayout>
            <Head title="Super Admin Dashboard" />

            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Super Admin Dashboard</h1>
                <p className="text-gray-600">Comprehensive system control and management</p>
            </div>

            {/* Core Menus Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {coreMenus.map((menu) => {
                    const colors = colorClasses[menu.color];
                    const Icon = menu.icon;

                    return (
                        <Link
                            key={menu.name}
                            href={menu.href}
                            className={`group bg-white rounded-xl shadow-sm border ${colors.border} p-6 transition-all duration-200 hover:shadow-md ${colors.hover}`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <ArrowRightIcon className={`w-5 h-5 ${colors.text} transform group-hover:translate-x-1 transition-transform`} />
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2">{menu.name}</h3>
                            <p className="text-sm text-gray-600 mb-4">{menu.description}</p>

                            <div className="grid grid-cols-2 gap-3">
                                {menu.stats.map((stat, idx) => (
                                    <div key={idx} className="bg-gray-50 rounded-lg p-2">
                                        <div className="text-xs text-gray-500">{stat.label}</div>
                                        <div className="text-sm font-bold text-gray-900">{stat.value}</div>
                                    </div>
                                ))}
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* System Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">System Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-indigo-600">{stats?.totalStudents || 0}</div>
                        <div className="text-sm text-gray-600">Total Students</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{stats?.paidStudents || 0}</div>
                        <div className="text-sm text-gray-600">Paid Students</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                            {stats?.totalRevenue ? `${(stats.totalRevenue / 1000000).toFixed(1)}M` : '0'}
                        </div>
                        <div className="text-sm text-gray-600">Revenue (Birr)</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                            {gradeDistribution ? gradeDistribution.length : 0}
                        </div>
                        <div className="text-sm text-gray-600">Grade Levels</div>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
