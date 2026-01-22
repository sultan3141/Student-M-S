import { AcademicCapIcon } from '@heroicons/react/24/outline';

export default function GradeStep({ data, setData, grades }) {
    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h3 className="text-lg font-medium text-gray-900">Select Grade Level</h3>
                <p className="text-sm text-gray-500">Choose the grade you want to enter marks for</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {grades.map((grade) => (
                    <button
                        key={grade.id}
                        onClick={() => setData('grade_id', grade.id)}
                        className={`
                            relative flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200
                            ${data.grade_id === grade.id
                                ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200'
                                : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200 hover:bg-gray-50'}
                        `}
                    >
                        <div className={`p-3 rounded-full mb-3 ${data.grade_id === grade.id ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                            <AcademicCapIcon className="h-8 w-8" />
                        </div>
                        <span className="font-bold text-lg">{grade.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
