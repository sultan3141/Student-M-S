/**
 * StatsCard Component
 * Displays a single metric with a gradient background, icon, and optional trend indicator.
 * Supports hover animations and customizable color themes (blue, green, purple, orange).
 */
export default function StatsCard({ title, value, icon: Icon, color = 'blue', trend }) {
    const colors = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-600' },
        green: { bg: 'bg-green-50', text: 'text-green-600', icon: 'text-green-600' },
        purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'text-purple-600' },
        orange: { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'text-orange-600' },
    };

    const theme = colors[color] || colors.blue;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
                    <div className="flex items-baseline mt-2">
                        <p className="text-3xl font-bold text-gray-900">{value}</p>
                        {trend && (
                            <span className={`ml-2 text-sm font-semibold ${trend > 0 ? 'text-green-600' : 'text-red-600'} bg-green-50 px-2 py-0.5 rounded-full`}>
                                {trend > 0 ? '+' : ''}{trend}%
                            </span>
                        )}
                    </div>
                </div>
                <div className={`p-4 rounded-xl ${theme.bg}`}>
                    <Icon className={`w-6 h-6 ${theme.icon}`} />
                </div>
            </div>
        </div>
    );
}
