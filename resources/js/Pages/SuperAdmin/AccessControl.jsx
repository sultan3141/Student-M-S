import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head } from '@inertiajs/react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function AccessControl({ roles, modules, permissionMatrix }) {
    return (
        <SuperAdminLayout>
            <Head title="Access Control" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Access Control</h1>
                <p className="text-gray-600">Configure role-based permissions and access control</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="text-3xl font-bold text-indigo-600 mb-1">{roles?.length || 6}</div>
                    <div className="text-sm text-gray-600">Total Roles</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="text-3xl font-bold text-purple-600 mb-1">{Object.keys(modules || {}).length}</div>
                    <div className="text-sm text-gray-600">Modules</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                        {Object.values(modules || {}).flat().length}
                    </div>
                    <div className="text-sm text-gray-600">Total Permissions</div>
                </div>
            </div>

            {/* Permission Matrix */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Permission Matrix</h3>
                    <p className="text-sm text-gray-500 mt-1">Overview of role-based access control</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50">
                                    Role
                                </th>
                                {Object.keys(modules || {}).map((module) => (
                                    <th key={module} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        {module}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {roles?.map((role) => (
                                <tr key={role.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white capitalize">
                                        {role.name}
                                    </td>
                                    {Object.entries(modules || {}).map(([moduleName, permissions]) => {
                                        const hasAccess = role.permissions?.some(p =>
                                            permissions.includes(p.name)
                                        );
                                        return (
                                            <td key={moduleName} className="px-6 py-4 text-center">
                                                {hasAccess ? (
                                                    <CheckIcon className="w-5 h-5 text-green-600 mx-auto" />
                                                ) : (
                                                    <XMarkIcon className="w-5 h-5 text-gray-300 mx-auto" />
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detailed Role Permissions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Detailed Role Permissions</h3>
                <div className="space-y-4">
                    {roles?.map((role) => (
                        <div key={role.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="font-bold text-gray-900 capitalize">{role.name}</h4>
                                <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">
                                    Edit Permissions
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {role.permissions?.map((permission) => (
                                    <span
                                        key={permission.id}
                                        className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                                    >
                                        {permission.name.replace(/_/g, ' ')}
                                    </span>
                                ))}
                                {(!role.permissions || role.permissions.length === 0) && (
                                    <span className="text-sm text-gray-500 italic">No permissions assigned</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </SuperAdminLayout>
    );
}
