export default function QuickStats({ stats, title = "Quick Stats" }) {
    const getStatColor = (index) => {
        const colors = [
            'border-blue-500 text-blue-600',
            'border-green-500 text-green-600',
            'border-purple-500 text-purple-600',
            'border-yellow-500 text-yellow-600',
            'border-red-500 text-red-600',
            'border-indigo-500 text-indigo-600'
        ];
        return colors[index % colors.length];
    };

    if (!stats || stats.length === 0) {
        return null;
    }

    return (
        <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={stat.label} className={`bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-t-4 ${getStatColor(index).split(' ')[0]}`}>
                        <h4 className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                            {stat.label}
                        </h4>
                        <p className={`mt-2 text-3xl font-bold ${getStatColor(index).split(' ')[1]}`}>
                            {stat.value}
                        </p>
                        {stat.subtitle && (
                            <p className="mt-1 text-sm text-gray-600">
                                {stat.subtitle}
                            </p>
                        )}
                        {stat.trend && (
                            <div className={`mt-2 flex items-center text-sm ${
                                stat.trend.direction === 'up' ? 'text-green-600' : 
                                stat.trend.direction === 'down' ? 'text-red-600' : 
                                'text-gray-600'
                            }`}>
                                {stat.trend.direction === 'up' && (
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {stat.trend.direction === 'down' && (
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {stat.trend.value}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}