import React from 'react';
import DirectorLayout from '@/Layouts/DirectorLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ auth, students, grades, filters }) {
    const { data, setData, get, processing } = useForm({
        search: filters.search || '',
        grade_id: filters.grade_id || '',
        section_id: filters.section_id || '',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        get(route('director.students.index'), { preserveState: true });
    };

    return (
        <DirectorLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Student Directory</h2>}
        >
            <Head title="Students" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="mb-6 bg-white p-4 rounded-lg shadow">
                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input
                                type="text"
                                placeholder="Search Name or ID..."
                                className="border rounded px-3 py-2"
                                value={data.search}
                                onChange={e => setData('search', e.target.value)}
                            />

                            <select
                                className="border rounded px-3 py-2"
                                value={data.grade_id}
                                onChange={e => setData('grade_id', e.target.value)}
                            >
                                <option value="">All Grades</option>
                                {grades.map(grade => (
                                    <option key={grade.id} value={grade.id}>{grade.name}</option>
                                ))}
                            </select>

                            <select
                                className="border rounded px-3 py-2"
                                value={data.section_id}
                                onChange={e => setData('section_id', e.target.value)}
                            >
                                <option value="">All Sections</option>
                                {/* Populate sections dynamically if needed, or filter plain here */}
                            </select>

                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                disabled={processing}
                            >
                                Filter Results
                            </button>
                        </form>
                    </div>

                    {/* Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="overflow-x-auto">
                                <table className="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Student
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Grade/Section
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Parent
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.data.map((student) => (
                                            <tr key={student.id}>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <span className="text-gray-900 whitespace-no-wrap font-mono">{student.student_id}</span>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <div className="flex items-center">
                                                        <div className="ml-3">
                                                            <p className="text-gray-900 whitespace-no-wrap font-bold">
                                                                {student.user?.name || 'N/A'}
                                                            </p>
                                                            <p className="text-gray-600 whitespace-no-wrap text-xs">
                                                                {student.user?.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{student.grade?.name}</p>
                                                    <p className="text-gray-600 text-xs">{student.section?.name}</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    {student.parents && student.parents.length > 0 ? (
                                                        <div className="font-medium text-gray-900">{student.parents[0].user?.name}</div>
                                                    ) : (
                                                        <span className="text-gray-400 italic">Not Assigned</span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <div className="flex space-x-3">
                                                        <Link
                                                            href={route('director.students.show', student.id)}
                                                            className="text-blue-600 hover:text-blue-900 font-bold"
                                                        >
                                                            View
                                                        </Link>
                                                        {student.parents && student.parents.length > 0 && (
                                                            <Link
                                                                href={route('director.parents.show', student.parents[0].id)}
                                                                className="text-emerald-600 hover:text-emerald-900 font-bold"
                                                            >
                                                                Parent
                                                            </Link>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {students.links && (
                                <div className="mt-4 flex justify-center">
                                    {students.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            className={`px-3 py-1 mx-1 rounded border text-sm ${link.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DirectorLayout>
    );
}
