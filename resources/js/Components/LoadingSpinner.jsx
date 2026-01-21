export default function LoadingSpinner({ size = 'md', className = '' }) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div className={`inline-block ${sizeClasses[size]} ${className}`}>
            <div className="animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600 h-full w-full"></div>
        </div>
    );
}
