/**
 * StatsCard Component
 * Displays a single metric with a gradient background, icon, and optional trend indicator.
 * Supports hover animations and customizable color themes (blue, green, purple, orange).
 */
export default function StatsCard({ title, value, icon: Icon, color = 'blue', trend }) {
    const gradients = {
        blue: 'from-blue-500 via-blue-600 to-indigo-600',
        green: 'from-green-500 via-emerald-600 to-teal-600',
        purple: 'from-purple-500 via-purple-600 to-pink-600',
        orange: 'from-orange-500 via-orange-600 to-red-600',
    };

    const iconBgColors = {
        blue: 'bg-blue-500/20',
        green: 'bg-green-500/20',
        purple: 'bg-purple-500/20',
        orange: 'bg-orange-500/20',
    };

    const iconColors = {
        blue: 'text-blue-600',
        green: 'text-green-600',
        purple: 'text-purple-600',
        orange: 'text-orange-600',
    };

    return (
        <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:-translate-y-1">
            <div className={`absolute inset-0 bg-gradient-to-br ${gradients[color]} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

            <div className="relative p-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">{title}</p>
                        <div className="flex items-baseline mt-2">
                            <p className="text-4xl font-black text-gray-900">{value}</p>
                            {trend && (
                                <span className={`ml-2 text-sm font-semibold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                                </span>
                            )}
                        </div>
                    </div>
                    <div className={`flex items-center justify-center w-14 h-14 rounded-2xl ${iconBgColors[color]} transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                        <Icon className={`w-7 h-7 ${iconColors[color]}`} />
                    </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-full bg-gray-100">
                    <div className={`h-1.5 bg-gradient-to-r ${gradients[color]} transform origin-left scale-x-75 group-hover:scale-x-100 transition-transform duration-500`}></div>
                </div>
            </div>
        </div>
    );
}
