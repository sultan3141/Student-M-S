import { useState, useEffect } from 'react';

export default function SystemStatus({ stats }) {
    const [status, setStatus] = useState('healthy');

    useEffect(() => {
        // Determine system status based on various metrics
        const assessmentCompletionRate = stats.published_assessments > 0 
            ? (stats.assessments_with_marks / stats.published_assessments) * 100 
            : 0;

        if (assessmentCompletionRate < 50) {
            setStatus('warning');
        } else if (assessmentCompletionRate < 25) {
            setStatus('critical');
        } else {
            setStatus('healthy');
        }
    }, [stats]);

    const getStatusColor = () => {
        switch (status) {
            case 'healthy': return 'bg-green-100 text-green-800 border-green-200';
            case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'critical': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'healthy':
                return (
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                );
            case 'warning':
                return (
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                );
            case 'critical':
                return (
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const getStatusMessage = () => {
        switch (status) {
            case 'healthy':
                return 'All systems operational. Assessment workflow is running smoothly.';
            case 'warning':
                return 'Some assessments are pending mark uploads. Consider reviewing published assessments.';
            case 'critical':
                return 'Many assessments lack marks. Immediate attention required for mark uploads.';
            default:
                return 'System status unknown.';
        }
    };

    return (
        <div className={`rounded-lg border p-4 ${getStatusColor()}`}>
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    {getStatusIcon()}
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium">
                        System Status: {status.charAt(0).toUpperCase() + status.slice(1)}
                    </h3>
                    <p className="text-sm mt-1">
                        {getStatusMessage()}
                    </p>
                </div>
            </div>
            
            {/* Quick metrics */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                    <div className="font-medium">Total Assessments</div>
                    <div>{stats.total_assessments || 0}</div>
                </div>
                <div>
                    <div className="font-medium">Published</div>
                    <div>{stats.published_assessments || 0}</div>
                </div>
                <div>
                    <div className="font-medium">With Marks</div>
                    <div>{stats.assessments_with_marks || 0}</div>
                </div>
                <div>
                    <div className="font-medium">Completion Rate</div>
                    <div>
                        {stats.published_assessments > 0 
                            ? Math.round((stats.assessments_with_marks / stats.published_assessments) * 100)
                            : 0
                        }%
                    </div>
                </div>
            </div>
        </div>
    );
}