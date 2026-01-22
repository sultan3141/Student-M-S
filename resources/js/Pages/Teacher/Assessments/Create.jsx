import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function CreateAssessment({ auth, subjects, grades, academicYears }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        subject_id: '',
        grade_id: '',
        academic_year_id: academicYears[0]?.id || '',
        semester: '1',
        assessment_type: 'Test',
        max_score: '100',
        due_date: '',
        status: 'draft'
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('assessments.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Assessment</h2>}
        >
            <Head title="Create Assessment" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="title" value="Assessment Title" />
                                    <TextInput
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={data.title}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="description" value="Description" />
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        rows="3"
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="grade_id" value="Grade" />
                                        <select
                                            id="grade_id"
                                            name="grade_id"
                                            value={data.grade_id}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            onChange={(e) => setData('grade_id', e.target.value)}
                                            required
                                        >
                                            <option value="">Select Grade</option>
                                            {grades.map((grade) => (
                                                <option key={grade.id} value={grade.id}>
                                                    {grade.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.grade_id} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="subject_id" value="Subject" />
                                        <select
                                            id="subject_id"
                                            name="subject_id"
                                            value={data.subject_id}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            onChange={(e) => setData('subject_id', e.target.value)}
                                            required
                                        >
                                            <option value="">Select Subject</option>
                                            {subjects
                                                .filter(subject => subject.grade_id == data.grade_id)
                                                .map((subject) => (
                                                <option key={subject.id} value={subject.id}>
                                                    {subject.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.subject_id} className="mt-2" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <InputLabel htmlFor="semester" value="Semester" />
                                        <select
                                            id="semester"
                                            name="semester"
                                            value={data.semester}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            onChange={(e) => setData('semester', e.target.value)}
                                            required
                                        >
                                            <option value="1">Semester 1</option>
                                            <option value="2">Semester 2</option>
                                        </select>
                                        <InputError message={errors.semester} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="assessment_type" value="Type" />
                                        <select
                                            id="assessment_type"
                                            name="assessment_type"
                                            value={data.assessment_type}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            onChange={(e) => setData('assessment_type', e.target.value)}
                                            required
                                        >
                                            <option value="Test">Test</option>
                                            <option value="Assignment">Assignment</option>
                                            <option value="Midterm">Midterm</option>
                                            <option value="Final">Final</option>
                                        </select>
                                        <InputError message={errors.assessment_type} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="max_score" value="Max Score" />
                                        <TextInput
                                            id="max_score"
                                            type="number"
                                            name="max_score"
                                            value={data.max_score}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('max_score', e.target.value)}
                                            required
                                            min="1"
                                            max="100"
                                        />
                                        <InputError message={errors.max_score} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="due_date" value="Due Date (Optional)" />
                                    <TextInput
                                        id="due_date"
                                        type="datetime-local"
                                        name="due_date"
                                        value={data.due_date}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('due_date', e.target.value)}
                                    />
                                    <InputError message={errors.due_date} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="status" value="Status" />
                                    <select
                                        id="status"
                                        name="status"
                                        value={data.status}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        onChange={(e) => setData('status', e.target.value)}
                                        required
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                    </select>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end">
                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        Create Assessment
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