export default function PerformanceChart({ marks }) {
    // Calculate simple distribution if marks provided
    const distribution = [0, 0, 0, 0, 0]; // F, D, C, B, A ranges

    if (marks && marks.length) {
        marks.forEach(m => {
            const score = parseFloat(m.score);
            if (score >= 90) distribution[4]++;
            else if (score >= 80) distribution[3]++;
            else if (score >= 70) distribution[2]++;
            else if (score >= 60) distribution[1]++;
            else distribution[0]++;
        });
    }

    const max = Math.max(...distribution, 1);

    return (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Mark Distribution</h3>
            <div className="flex items-end space-x-2 h-40">
                {distribution.map((count, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center group">
                        <div
                            className="w-full bg-blue-500 rounded-t-md transition-all duration-500 group-hover:bg-blue-600 relative"
                            style={{ height: `${(count / max) * 100}%` }}
                        >
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                {count}
                            </span>
                        </div>
                        <span className="text-xs text-gray-500 mt-2 font-medium">
                            {['<60', '60-70', '70-80', '80-90', '90+'][index]}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
