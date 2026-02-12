import React from 'react';
import DirectorLayout from '@/Layouts/DirectorLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ auth, students, grades, academic_years, filters }) {
    const { data, setData, get, processing } = useForm({
        search: filters.search || '',
        grade_id: filters.grade_id || '',
        section_id: filters.section_id || '',
        academic_year_id: filters.academic_year_id || '',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        get(route('director.students.index'), { preserveState: true });
    };

    return (
        <DirectorLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Student Section Table</h2>}
        >
            <Head title="Student Section Table" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="mb-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input
                                type="text"
                                placeholder="Search Name, ID or Email..."
                                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                value={data.search}
                                onChange={e => setData('search', e.target.value)}
                            />

                            <select
                                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                value={data.grade_id}
                                onChange={e => setData('grade_id', e.target.value)}
                            >
                                <option value="">All Grades</option>
                                {grades.map(grade => (
                                    <option key={grade.id} value={grade.id}>{grade.name}</option>
                                ))}
                            </select>

                            <select
                                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                value={data.section_id}
                                onChange={e => setData('section_id', e.target.value)}
                            >
                                <option value="">All Sections</option>
                                {grades.find(g => g.id == data.grade_id)?.sections.map(section => (
                                    <option key={section.id} value={section.id}>{section.name}</option>
                                ))}
                            </select>

                            <select
                                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                value={data.academic_year_id}
                                onChange={e => setData('academic_year_id', e.target.value)}
                            >
                                {academic_years.map(year => (
                                    <option key={year.id} value={year.id}>{year.name} {year.is_current ? '(Current)' : ''}</option>
                                ))}
                            </select>

                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
                                disabled={processing}
                            >
                                Filter Results
                            </button>

                            {data.section_id && (
                                <a
                                    href={route('director.reports.export.section-cards', {
                                        section_id: data.section_id,
                                        academic_year_id: data.academic_year_id,
                                        format: 'pdf'
                                    })}
                                    className="bg-navy-800 text-white px-4 py-2 rounded-lg hover:bg-navy-900 transition-colors font-medium text-sm shadow-sm flex items-center justify-center"
                                    style={{ backgroundColor: '#1E293B' }}
                                >
                                    Download Section Cards
                                </a>
                            )}
                        </form>
                    </div>

                    {/* Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-100">
                        <div className="p-0 bg-white border-b border-gray-200">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Grade/Section</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Parent/Guardian</th>
                                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {students.data.map((student) => (
                                            <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                                                    {student.student_id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div>
                                                            <div className="text-sm font-semibold text-gray-900">
                                                                {student.user?.name || 'N/A'}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {student.user?.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {student.grade?.name} - {student.section?.name}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {student.parents && student.parents.length > 0 ? (
                                                        <div className="font-medium text-gray-900">{student.parents[0].user?.name}</div>
                                                    ) : (
                                                        <span className="text-gray-400 italic">Not Assigned</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                    <div className="flex justify-center space-x-3">
                                                        <Link
                                                            href={route('director.students.show', student.id)}
                                                            className="text-blue-600 hover:text-blue-900 font-bold bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                                                        >
                                                            View
                                                        </Link>
                                                        {student.parents && student.parents.length > 0 && (
                                                            <Link
                                                                href={route('director.parents.show', student.parents[0].id)}
                                                                className="text-emerald-600 hover:text-emerald-900 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-emerald-100"
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
