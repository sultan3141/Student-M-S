import { Link } from '@inertiajs/react';
import {
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';

export default function AlertBar({ alerts }) {
    const getAlertIcon = (type) => {
        switch (type) {
            case 'danger':
                return <XCircleIcon className="h-5 w-5" />;
            case 'warning':
                return <ExclamationTriangleIcon className="h-5 w-5" />;
            default:
                return <InformationCircleIcon className="h-5 w-5" />;
        }
    };

    const getAlertColors = (type) => {
        switch (type) {
            case 'danger':
                return 'bg-red-50 border-red-200 text-red-800';
            case 'warning':
                return 'bg-amber-50 border-amber-200 text-amber-800';
            default:
                return 'bg-blue-50 border-blue-200 text-blue-800';
        }
    };

    return (
        <div className="space-y-3">
            {alerts.map((alert, index) => (
                <div
                    key={index}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg border ${getAlertColors(alert.type)} 
                               transition-all duration-200 hover:shadow-md`}
                >
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            {getAlertIcon(alert.type)}
                        </div>
                        <p className="text-sm font-medium">
                            {alert.message}
                        </p>
                    </div>
                    {alert.action && (
                        <Link
                            href={alert.action}
                            className="text-sm font-semibold hover:underline whitespace-nowrap ml-4"
                        >
                            View →
                        </Link>
                    )}
                </div>
            ))}
        </div>
    );
}
