import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import DirectorLayout from '@/Layouts/DirectorLayout';
import { ArrowDownTrayIcon, DocumentTextIcon, ArrowTrendingUpIcon, CurrencyDollarIcon, FunnelIcon } from '@heroicons/react/24/outline';
import ReportsDashboard from '@/Components/Director/ReportsDashboard';

export default function ReportsIndex({ auth, grades, academic_years }) {
    const [selectedGrade, setSelectedGrade] = useState(grades[0]?.id || '');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedSemester, setSelectedSemester] = useState(1);
    const [selectedAcademicYear, setSelectedAcademicYear] = useState(academic_years[0]?.id || '');
    const [paymentStatus, setPaymentStatus] = useState('');

    const sections = grades.find(g => g.id == selectedGrade)?.sections || [];

    const handleExport = (type, format) => {
        let url = '';
        const params = new URLSearchParams();

        if (type === 'students') {
            url = route('director.reports.export.students');
            params.append('grade_id', selectedGrade);
            if (selectedSection) params.append('section_id', selectedSection);
        } else if (type === 'ranks') {
            url = route('director.reports.export.ranks');
            params.append('grade_id', selectedGrade);
            if (selectedSection) params.append('section_id', selectedSection);
            params.append('semester', selectedSemester);
            params.append('academic_year_id', selectedAcademicYear);
        } else if (type === 'payments') {
            url = route('director.reports.export.payments');
            params.append('grade_id', selectedGrade || 'all');
            if (paymentStatus) params.append('status', paymentStatus);
        } else if (type === 'section_cards') {
            url = route('director.reports.export.section-cards');
            if (!selectedSection) {
                alert('Please select a section first.');
                return;
            }
            params.append('section_id', selectedSection);
            params.append('academic_year_id', selectedAcademicYear);
        }

        params.append('format', format);
        window.location.href = `${url}?${params.toString()}`;
    };

    return (
        <DirectorLayout>
            <Head title="Reports Dashboard" />

            <div className="py-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Compact Page Header */}
                    <div className="mb-4 text-center md:text-left">
                        <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight" style={{ color: '#0F172A' }}>
                            📊 Analytics & Insights
                        </h1>
                        <p className="mt-2 text-sm text-gray-500 max-w-2xl">
                            Generate comprehensive reports, track academic performance, and monitor system-wide trends with real-time data synchronization.
                        </p>
                    </div>

                    <div className="mt-8">
                        <ReportsDashboard grades={grades} academic_years={academic_years} />
                    </div>
                </div>
            </div>
        </DirectorLayout>
    );
}
