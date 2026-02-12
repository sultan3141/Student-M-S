import { Head } from '@inertiajs/react';

export default function DashboardSimple() {
    return (
        <div style={{ padding: '50px', backgroundColor: '#f0f0f0', minHeight: '100vh', textAlign: 'center' }}>
            <Head title="Simple Dashboard" />
            <h1 style={{ color: 'green', fontSize: '30px' }}>Dashboard Simple Loaded Successfully!</h1>
            <p>If you see this, Inertia and React are working correctly.</p>
            <p>The problem is likely in the TeacherLayout or the main Dashboard component.</p>
            <a href="/teacher/dashboard" style={{ marginTop: '20px', display: 'inline-block', padding: '10px 20px', backgroundColor: 'blue', color: 'white' }}>Try Main Dashboard Again</a>
        </div>
    );
}
