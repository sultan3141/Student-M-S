import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function SystemConfiguration({ config }) {
    const [activeTab, setActiveTab] = useState('grading');

    const tabs = [
        { id: 'grading', name: 'Grading System', icon: '📊' },
        { id: 'fees', name: 'Fee Structure', icon: '💰' },
        { id: 'academic', name: 'Academic Settings', icon: '📚' },
        { id: 'workflows', name: 'Workflows', icon: '⚙️' },
        { id: 'permissions', name: 'Role Permissions', icon: '🔑' },
    ];

    return (
        <SuperAdminLayout>
            <Head title="System Configuration" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">System Configuration</h1>
                <p className="text-gray-600">Configure global system defaults and settings</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-4 px-6" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-3 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {/* Grading System Tab */}
                    {activeTab === 'grading' && (
                        <div>
                            <h3 className="text-lg font-bold mb-4">Grading Scale</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min %</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max %</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">GPA</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {config?.grading?.scales?.map((scale, idx) => (
                                            <tr key={idx}>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{scale.grade}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{scale.min}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{scale.max}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{scale.gpa}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <h3 className="text-lg font-bold mt-8 mb-4">Assessment Types</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {config?.grading?.assessmentTypes?.map((type, idx) => (
                                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-gray-900">{type.name}</span>
                                            <span className="text-indigo-600 font-bold">{type.percentage}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Fee Structure Tab */}
                    {activeTab === 'fees' && (
                        <div>
                            <h3 className="text-lg font-bold mb-4">Fee Structures by Grade</h3>
                            <div className="space-y-4">
                                {config?.fees?.structures?.map((structure, idx) => (
                                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-bold text-gray-900 mb-3">{structure.grade}</h4>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <div className="text-xs text-gray-500">Tuition</div>
                                                <div className="text-lg font-bold text-gray-900">{structure.tuition.toLocaleString()} Birr</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500">Registration</div>
                                                <div className="text-lg font-bold text-gray-900">{structure.registration.toLocaleString()} Birr</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500">Activities</div>
                                                <div className="text-lg font-bold text-gray-900">{structure.activities.toLocaleString()} Birr</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Academic Settings Tab */}
                    {activeTab === 'academic' && (
                        <div>
                            <h3 className="text-lg font-bold mb-4">Academic Year: {config?.academic?.currentYear}</h3>
                            <div className="space-y-4">
                                {config?.academic?.semesters?.map((semester, idx) => (
                                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-bold text-gray-900 mb-2">{semester.name}</h4>
                                        <div className="flex space-x-4 text-sm text-gray-600">
                                            <div>Start: <span className="font-medium">{semester.start}</span></div>
                                            <div>End: <span className="font-medium">{semester.end}</span></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <h3 className="text-lg font-bold mt-6 mb-4">Grade Levels</h3>
                            <div className="grid grid-cols-6 gap-2">
                                {config?.academic?.gradeLevels?.map((grade) => (
                                    <div key={grade} className="bg-indigo-50 text-indigo-700 font-bold text-center py-2 rounded-lg">
                                        Grade {grade}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Workflows Tab */}
                    {activeTab === 'workflows' && (
                        <div>
                            <h3 className="text-lg font-bold mb-4">System Workflows</h3>
                            <div className="space-y-3">
                                {config?.workflows && Object.entries(config.workflows).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center border border-gray-200 rounded-lg p-4">
                                        <span className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${value === 'auto' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {value.toUpperCase()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Role Permissions Tab */}
                    {activeTab === 'permissions' && (
                        <div>
                            <h3 className="text-lg font-bold mb-4">Role-Based Permissions</h3>
                            <div className="space-y-4">
                                {config?.rolePermissions && Object.entries(config.rolePermissions).map(([role, permissions]) => (
                                    <div key={role} className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-bold text-gray-900 mb-3 capitalize">{role}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {permissions.map((permission) => (
                                                <span key={permission} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                                                    {permission.replace(/_/g, ' ')}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SuperAdminLayout>
    );
}
