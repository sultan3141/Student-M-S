import { UserCircleIcon, AcademicCapIcon, BriefcaseIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';

export default function RoleBadge({ role }) {
    const getRoleData = (role) => {
        switch (role) {
            case 'admin':
                return {
                    label: 'Administrator',
                    color: 'bg-amber-500',
                    icon: ShieldCheckIcon,
                    text: 'text-amber-100',
                    border: 'border-amber-400/50',
                    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                };
            case 'teacher':
                return {
                    label: 'Teacher',
                    color: 'bg-blue-600',
                    icon: BriefcaseIcon,
                    text: 'text-blue-100',
                    border: 'border-blue-400/50',
                    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                };
            case 'student':
                return {
                    label: 'Student',
                    color: 'bg-emerald-600',
                    icon: AcademicCapIcon,
                    text: 'text-emerald-100',
                    border: 'border-emerald-400/50',
                    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                };
            case 'parent':
                return {
                    label: 'Parent',
                    color: 'bg-purple-600',
                    icon: UserCircleIcon,
                    text: 'text-purple-100',
                    border: 'border-purple-400/50',
                    glow: 'shadow-[0_0_15px_rgba(147,51,234,0.5)]'
                };
            case 'registrar':
                return {
                    label: 'Registrar',
                    color: 'bg-indigo-600',
                    icon: BriefcaseIcon,
                    text: 'text-indigo-100',
                    border: 'border-indigo-400/50',
                    glow: 'shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                };
            default:
                return null;
        }
    };

    const data = getRoleData(role);

    if (!data) return null;

    const Icon = data.icon;

    return (
        <div className={`mt-4 flex items-center justify-center animate-in fade-in slide-in-from-bottom-2 duration-500`}>
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md bg-white/10 border ${data.border} ${data.glow} transition-all duration-500`}>
                <Icon className={`w-4 h-4 ${data.text}`} />
                <span className={`text-sm font-medium ${data.text} tracking-wide uppercase`}>{data.label} Portal</span>
            </div>
        </div>
    );
}
