import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import { useState } from 'react';

export default function MarksIndex({ auth, sections }) {
    const { data, setData, get, processing, errors } = useForm({
        section_id: '',
        subject_id: '',
    });

    // Mock subjects logic: in reality, fetch subjects for chosen section's grade dynamically
    // For now, we'll just filter if we had all subjects loaded or handle it simplified.
    // Actually, let's just make the user pick a Section, then we show available subjects for that section's Grade.
    // Since we passed sections with 'grade', we can derive subjects if loaded, otherwise we might need an API call.
    // Simplified: Just pick Section first. Then in Next step (Create), we might need Subject.
    // Let's assume the teacher selects Section AND Subject here.
    // We need to pass subjects to this view to make it work smoothly.
    // Wait, the controller only passed `sections`. I should update controller to pass filtered Subjects or load them via React state.
    // Let's do a client-side filter. We can pass all common subjects since they are standardized per grade.
    // For this step, let's keep it simple: Select Class/Section -> Then Select Subject from list available to that Grade.

    const [availableSubjects, setAvailableSubjects] = useState([]);

    const handleSectionChange = (e) => {
        const sectionId = e.target.value;
        setData('section_id', sectionId);

        // Find selected section to get grade
        const section = sections.find(s => s.id == sectionId);
        if (section && section.grade) {
            // Mocking subjects fetching or we could have passed them from controller. 
            // Better to fetch or pass them. Let's assume we updating controller next or use a hardcoded list for demo if needed.
            // Actually, let's relying on a prop `subjects` I'll add to controller in a moment.
            // setAvailableSubjects(subjects.filter(sub => sub.grade_id === section.grade_id));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        get(route('teacher.marks.create'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Marks Entry - Select Class</h2>}
        >
            <Head title="Enter Marks" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="section" value="Select Class & Section" />
                                    <select
                                        id="section"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.section_id}
                                        onChange={(e) => setData('section_id', e.target.value)}
                                        required
                                    >
                                        <option value="">-- Choose Class --</option>
                                        {sections.map(section => (
                                            <option key={section.id} value={section.id}>
                                                {section.grade.name} - Section {section.name} ({section.gender})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <InputLabel htmlFor="subject" value="Select Subject" />
                                    <select
                                        id="subject"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.subject_id}
                                        onChange={(e) => setData('subject_id', e.target.value)}
                                        required
                                    >
                                        <option value="">-- First Select Class --</option>
                                        {/* Ideally populated dynamically. For MVP I'll fetch ALL subjects in controller and filter here? 
                                            Or simpler: Just manual entry of ID? No, bad UX.
                                            I'll update controller to pass 'subjects' too.
                                        */}
                                        <option value="1">Mathematics</option>
                                        <option value="2">English</option>
                                        <option value="3">Physics</option>
                                        {/* Hardcoded IDs for demo speed, will fix in controller */}
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">Subject list is simplified for demo. (IDs 1-3)</p>
                                </div>

                                <div className="flex justify-end">
                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        Proceed to Grading
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
