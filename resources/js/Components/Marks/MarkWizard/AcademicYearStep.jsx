export default function AcademicYearStep({ data, setData, years }) {
    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700">
                            Please select the academic year for this mark entry.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-xs">
                <label htmlFor="academic_year" className="block text-sm font-medium text-gray-700">
                    Academic Year
                </label>
                <select
                    id="academic_year"
                    value={data.academic_year_id}
                    onChange={(e) => setData('academic_year_id', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                    <option value="">Select Year</option>
                    {years.map((year) => (
                        <option key={year.id} value={year.id}>
                            {year.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
