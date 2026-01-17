import { Head } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import LiveRankingPreview from '@/Components/Rankings/LiveRankingPreview';

export default function RankingIndex({ classes }) {
    return (
        <TeacherLayout>
            <Head title="Class Rankings" />

            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900">Class Rankings</h1>
                <p className="text-gray-600 mt-1">Real-time performance standings and statistics</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {classes.map(cls => (
                    <LiveRankingPreview
                        key={cls.id}
                        classId={cls.id}
                        subject={cls.subject}
                    />
                ))}
            </div>
        </TeacherLayout>
    );
}
