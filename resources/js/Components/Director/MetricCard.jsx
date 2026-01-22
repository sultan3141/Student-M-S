import { Link } from '@inertiajs/react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

export default function MetricCard({
    title,
    value,
    subtitle,
    trend,
    trendValue,
    badge,
    badgeType = 'success',
    icon,
    iconBgColor = 'bg-blue-500',
    actionLabel,
    actionLink,
    link,
}) {
    const CardWrapper = link ? Link : 'div';
    const cardProps = link ? { href: link } : {};

    const badgeColors = {
        success: 'badge-success',
        warning: 'badge-warning',
        danger: 'badge-danger',
    };

    return (
        <CardWrapper
            {...cardProps}
            className="executive-card animate-fadeInUp group cursor-pointer"
        >
            {/* Header with Icon */}
            <div className="flex items-center justify-between mb-4">
                <div className={`${iconBgColor} p-3 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                </div>
                {badge && (
                    <span className={badgeColors[badgeType]}>
                        {badge}
                    </span>
                )}
            </div>

            {/* Title */}
            <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>

            {/* Main Value */}
            <div className="flex items-baseline space-x-2 mb-1">
                <p className="text-3xl font-bold text-navy-900" style={{ color: '#0F172A' }}>
                    {value}
                </p>
                {trend && (
                    <div className={`flex items-center space-x-1 ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                        {trend === 'up' ? (
                            <ArrowUpIcon className="h-4 w-4" />
                        ) : (
                            <ArrowDownIcon className="h-4 w-4" />
                        )}
                        <span className="text-sm font-semibold">{trendValue}</span>
                    </div>
                )}
            </div>

            {/* Subtitle */}
            <p className="text-xs text-gray-500 mb-3">{subtitle}</p>

            {/* Action Button */}
            {actionLabel && actionLink && (
                <Link
                    href={actionLink}
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 
                             transition-colors duration-200 group-hover:underline"
                >
                    {actionLabel} →
                </Link>
            )}

            {/* View Link */}
            {link && !actionLabel && (
                <div className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200">
                    View Details →
                </div>
            )}
        </CardWrapper>
    );
}
