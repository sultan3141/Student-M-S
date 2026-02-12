import DirectorLayout from '@/Layouts/DirectorLayout';
import { Head, Link } from '@inertiajs/react';

export default function Transcript({ auth, student, academicYear, schoolInfo }) {
    // ...
    return (
        <DirectorLayout>
            <Head title={`Transcript - ${student.user.name}`} />

            {/* Print Friendly Header (Floating in Layout) */}
            <div className="mb-6 flex justify-between items-center print:hidden border-b pb-4">
                <h2 className="font-bold text-2xl text-slate-900" style={{ color: '#0F172A' }}>
                    🎓 Student Transcript
                </h2>
                <button
                    onClick={() => window.print()}
                    className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg"
                >
                    🖨️ Print Transcript
                </button>
            </div>

            <div className="py-12 print:py-0 print:m-0">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 print:max-w-full print:px-0">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg print:shadow-none">
                        <div className="p-8 text-gray-900 print:text-black">

                            {/* Header */}
                            <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
                                <h1 className="text-3xl font-bold uppercase tracking-wide">{schoolInfo.name}</h1>
                                <p className="text-sm mt-1">{schoolInfo.address}</p>
                                <p className="text-sm">Tel: {schoolInfo.phone}</p>
                                <h2 className="text-xl font-semibold mt-4 uppercase border-4 border-double border-gray-800 inline-block px-4 py-1">Official Academic Transcript</h2>
                            </div>

                            {/* Student Info */}
                            <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
                                <div>
                                    <p><strong className="uppercase text-gray-600">Student Name:</strong> <span className="text-lg font-bold block">{student.user.name}</span></p>
                                    <p className="mt-2"><strong className="uppercase text-gray-600">Student ID:</strong> {student.student_id}</p>
                                    <p className="mt-2"><strong className="uppercase text-gray-600">Date of Birth:</strong> {student.dob || 'N/A'}</p>
                                </div>
                                <div className="text-right">
                                    <p><strong className="uppercase text-gray-600">Academic Year:</strong> {academicYear?.name}</p>
                                    <p className="mt-2"><strong className="uppercase text-gray-600">Grade / Section:</strong> {student.grade?.name} - {student.section?.name}</p>
                                    <p className="mt-2 text-indigo-800 font-bold text-lg"><strong className="uppercase text-gray-600 text-sm font-normal">GPA:</strong> {gpa}</p>
                                </div>
                            </div>

                            {/* Marks Table */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold mb-2 uppercase border-b border-gray-400">Academic Performance</h3>
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 print:bg-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 border">Subject</th>
                                            <th className="px-4 py-3 border text-center">Assessment</th>
                                            <th className="px-4 py-3 border text-center">Term</th>
                                            <th className="px-4 py-3 border text-center">Max Score</th>
                                            <th className="px-4 py-3 border text-center">Obtained</th>
                                            <th className="px-4 py-3 border text-center">Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {student.marks.length > 0 ? (
                                            student.marks.map(mark => (
                                                <tr key={mark.id}>
                                                    <td className="px-4 py-2 border font-medium">{mark.subject.name}</td>
                                                    <td className="px-4 py-2 border text-center">{mark.assessment_type}</td>
                                                    <td className="px-4 py-2 border text-center">{mark.semester}</td>
                                                    <td className="px-4 py-2 border text-center">{mark.max_score}</td>
                                                    <td className="px-4 py-2 border text-center font-bold">{mark.score_obtained}</td>
                                                    <td className="px-4 py-2 border text-center">
                                                        {mark.score_obtained >= 90 ? 'A' :
                                                            mark.score_obtained >= 80 ? 'B' :
                                                                mark.score_obtained >= 70 ? 'C' :
                                                                    mark.score_obtained >= 60 ? 'D' : 'F'}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-4 py-8 text-center text-gray-500 italic border">
                                                    No academic records found for this period.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Attendance Summary */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold mb-2 uppercase border-b border-gray-400">Attendance Summary</h3>
                                <div className="flex justify-between max-w-xs text-sm">
                                    <p><strong>Present:</strong> {student.attendances.filter(a => a.status === 'Present').length} days</p>
                                    <p><strong>Absent:</strong> {student.attendances.filter(a => a.status === 'Absent').length} days</p>
                                    <p><strong>Late:</strong> {student.attendances.filter(a => a.status === 'Late').length} days</p>
                                </div>
                            </div>

                            {/* Footer / Signatures */}
                            <div className="mt-16 pt-8 border-t border-gray-800 flex justify-between text-sm">
                                <div className="text-center w-1/3">
                                    <div className="border-b border-gray-400 mb-2 h-8"></div>
                                    <p className="uppercase text-xs text-gray-500">Class Teacher Signature</p>
                                </div>
                                <div className="text-center w-1/3">
                                    <p className="italic text-xs text-gray-400">Generated on {new Date().toLocaleDateString()}</p>
                                </div>
                                <div className="text-center w-1/3">
                                    <div className="border-b border-gray-400 mb-2 h-8"></div>
                                    <p className="uppercase text-xs text-gray-500">Principal Signature & Seal</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </DirectorLayout>
    );
}
