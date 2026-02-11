import { Head } from '@inertiajs/react';

export default function DashboardMinimal() {
    return (
        <>
            <Head title="Teacher Dashboard Test" />
            
            <div style={{ padding: '40px', fontFamily: 'Arial' }}>
                <h1 style={{ color: '#1D4ED8', fontSize: '32px', marginBottom: '20px' }}>
                    ✅ React is Working!
                </h1>
                <p style={{ fontSize: '18px', color: '#333' }}>
                    If you can see this message, React and Inertia are working correctly.
                </p>
                <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#10B981', color: 'white', borderRadius: '8px' }}>
                    <strong>Success!</strong> The basic setup is functional.
                </div>
            </div>
        </>
    );
}
