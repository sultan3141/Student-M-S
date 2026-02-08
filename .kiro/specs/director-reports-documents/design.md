# Director Reports & Documents - Design Document

## Architecture Overview

This feature provides comprehensive reporting and document management capabilities for school directors through two main modules: Document Templates and Reports Dashboard.

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Director Dashboard                        │
├─────────────────────────────────────────────────────────────┤
│  Navigation: Documents | Reports                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┴───────────────────┐
        ↓                                       ↓
┌──────────────────────┐           ┌──────────────────────────┐
│ DirectorDocuments    │           │ DirectorReportController │
│ Controller           │           │                          │
├──────────────────────┤           ├──────────────────────────┤
│ • index()            │           │ • index()                │
│ • create()           │           │ • exportStudentList()    │
│ • store()            │           │ • exportRankList()       │
│ • edit()             │           │ • exportPaymentStatus()  │
│ • update()           │           │                          │
│ • destroy()          │           │                          │
└──────────────────────┘           └──────────────────────────┘
        ↓                                       ↓
┌──────────────────────┐           ┌──────────────────────────┐
│ DocumentTemplate     │           │ PDF/Excel Export         │
│ Model                │           │ Services                 │
└──────────────────────┘           └──────────────────────────┘
```

## Database Schema

### Existing Table: `document_templates`

```sql
CREATE TABLE document_templates (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    INDEX idx_type (type),
    INDEX idx_created (created_at)
);
```

**Fields:**
- `name`: Template name (e.g., "Student Certificate", "Admission Letter")
- `type`: Template category (Certificate, Letter, Form, Report, Other)
- `content`: HTML content with optional placeholders

### Data Sources for Reports

**Student List Report:**
- `students` table: name, student_id, contact info
- `grades` table: grade name
- `sections` table: section name
- `users` table: email, phone

**Rank List Report:**
- `rankings` table: rank, total_marks, average
- `students` table: student details
- `semester_results` table: semester performance
- `marks` table: individual subject scores

**Payment Status Report:**
- `payments` table: amount, status, dates
- `students` table: student details
- `grades` and `sections`: class information

## Backend Implementation

### Controller: `DirectorDocumentsController`

**Location:** `app/Http/Controllers/DirectorDocumentsController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\DocumentTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DirectorDocumentsController extends Controller
{
    /**
     * Display list of all document templates
     */
    public function index()
    {
        $templates = DocumentTemplate::latest()->get();
        
        return Inertia::render('Director/Documents/Index', [
            'templates' => $templates
        ]);
    }
    
    /**
     * Show create template form
     */
    public function create()
    {
        return Inertia::render('Director/Documents/Create');
    }
    
    /**
     * Store new template
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:document_templates',
            'type' => 'required|string|max:100',
            'content' => 'required|string',
        ]);
        
        DocumentTemplate::create($validated);
        
        return redirect()->route('director.documents.index')
            ->with('success', 'Template created successfully!');
    }
    
    /**
     * Show edit template form
     */
    public function edit(DocumentTemplate $template)
    {
        return Inertia::render('Director/Documents/Edit', [
            'template' => $template
        ]);
    }
    
    /**
     * Update existing template
     */
    public function update(Request $request, DocumentTemplate $template)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:document_templates,name,' . $template->id,
            'type' => 'required|string|max:100',
            'content' => 'required|string',
        ]);
        
        $template->update($validated);
        
        return redirect()->route('director.documents.index')
            ->with('success', 'Template updated successfully!');
    }
    
    /**
     * Delete template
     */
    public function destroy(DocumentTemplate $template)
    {
        $template->delete();
        
        return redirect()->route('director.documents.index')
            ->with('success', 'Template deleted successfully!');
    }
}
```

### Controller: `DirectorReportController`

**Location:** `app/Http/Controllers/DirectorReportController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Payment;
use App\Models\Ranking;
use App\Models\Grade;
use App\Models\Section;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\StudentListExport;
use App\Exports\RankListExport;
use App\Exports\PaymentStatusExport;

class DirectorReportController extends Controller
{
    /**
     * Display reports dashboard
     */
    public function index()
    {
        $grades = Grade::orderBy('name')->get();
        $sections = Section::orderBy('name')->get();
        
        return Inertia::render('Director/Reports/Index', [
            'grades' => $grades,
            'sections' => $sections
        ]);
    }
    
    /**
     * Export student list report
     */
    public function exportStudentList(Request $request)
    {
        $format = $request->format; // 'pdf' or 'excel'
        $gradeId = $request->grade_id;
        $sectionId = $request->section_id;
        
        $query = Student::with(['grade', 'section', 'user'])
            ->orderBy('name');
            
        if ($gradeId) {
            $query->where('grade_id', $gradeId);
        }
        
        if ($sectionId) {
            $query->where('section_id', $sectionId);
        }
        
        $students = $query->get();
        
        if ($format === 'pdf') {
            $pdf = PDF::loadView('reports.student-list', [
                'students' => $students,
                'grade' => $gradeId ? Grade::find($gradeId) : null,
                'section' => $sectionId ? Section::find($sectionId) : null,
                'date' => now()->format('Y-m-d H:i:s')
            ]);
            
            return $pdf->download('student_list_' . now()->format('YmdHis') . '.pdf');
        }
        
        // Excel export
        return Excel::download(
            new StudentListExport($students),
            'student_list_' . now()->format('YmdHis') . '.xlsx'
        );
    }
    
    /**
     * Export rank list report
     */
    public function exportRankList(Request $request)
    {
        $format = $request->format;
        $gradeId = $request->grade_id;
        $sectionId = $request->section_id;
        $semester = $request->semester ?? 1;
        
        $query = Ranking::with(['student.grade', 'student.section'])
            ->where('semester', $semester)
            ->orderBy('rank');
            
        if ($gradeId) {
            $query->whereHas('student', function($q) use ($gradeId) {
                $q->where('grade_id', $gradeId);
            });
        }
        
        if ($sectionId) {
            $query->whereHas('student', function($q) use ($sectionId) {
                $q->where('section_id', $sectionId);
            });
        }
        
        $rankings = $query->get();
        
        if ($format === 'pdf') {
            $pdf = PDF::loadView('reports.rank-list', [
                'rankings' => $rankings,
                'semester' => $semester,
                'grade' => $gradeId ? Grade::find($gradeId) : null,
                'section' => $sectionId ? Section::find($sectionId) : null,
                'date' => now()->format('Y-m-d H:i:s')
            ]);
            
            return $pdf->download('rank_list_' . now()->format('YmdHis') . '.pdf');
        }
        
        return Excel::download(
            new RankListExport($rankings),
            'rank_list_' . now()->format('YmdHis') . '.xlsx'
        );
    }
    
    /**
     * Export payment status report
     */
    public function exportPaymentStatus(Request $request)
    {
        $format = $request->format;
        $status = $request->status; // 'paid', 'pending', 'overdue'
        $gradeId = $request->grade_id;
        $sectionId = $request->section_id;
        
        $query = Payment::with(['student.grade', 'student.section'])
            ->orderBy('due_date');
            
        if ($status) {
            $query->where('status', $status);
        }
        
        if ($gradeId) {
            $query->whereHas('student', function($q) use ($gradeId) {
                $q->where('grade_id', $gradeId);
            });
        }
        
        if ($sectionId) {
            $query->whereHas('student', function($q) use ($sectionId) {
                $q->where('section_id', $sectionId);
            });
        }
        
        $payments = $query->get();
        
        // Calculate summary statistics
        $summary = [
            'total_paid' => $payments->where('status', 'paid')->sum('amount'),
            'total_pending' => $payments->where('status', 'pending')->sum('amount'),
            'total_overdue' => $payments->where('status', 'overdue')->sum('amount'),
        ];
        
        if ($format === 'pdf') {
            $pdf = PDF::loadView('reports.payment-status', [
                'payments' => $payments,
                'summary' => $summary,
                'status' => $status,
                'grade' => $gradeId ? Grade::find($gradeId) : null,
                'section' => $sectionId ? Section::find($sectionId) : null,
                'date' => now()->format('Y-m-d H:i:s')
            ]);
            
            return $pdf->download('payment_status_' . now()->format('YmdHis') . '.pdf');
        }
        
        return Excel::download(
            new PaymentStatusExport($payments, $summary),
            'payment_status_' . now()->format('YmdHis') . '.xlsx'
        );
    }
}
```

### Model: `DocumentTemplate`

**Location:** `app/Models/DocumentTemplate.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentTemplate extends Model
{
    protected $fillable = [
        'name',
        'type',
        'content',
    ];
    
    /**
     * Get templates by type
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }
    
    /**
     * Search templates by name
     */
    public function scopeSearch($query, $search)
    {
        return $query->where('name', 'like', "%{$search}%");
    }
}
```

## Frontend Implementation

### Component Structure

```
resources/js/Pages/Director/
├── Documents/
│   ├── Index.jsx       # List all templates
│   ├── Create.jsx      # Create new template
│   └── Edit.jsx        # Edit existing template
└── Reports/
    └── Index.jsx       # Reports dashboard with export options
```

### Documents Index Page

**Location:** `resources/js/Pages/Director/Documents/Index.jsx`

```jsx
import DirectorLayout from '@/Layouts/DirectorLayout';
import { Head, Link, router } from '@inertiajs/react';
import { DocumentTextIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function DocumentTemplatesIndex({ auth, templates }) {
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this template?')) {
            router.delete(route('director.documents.destroy', id));
        }
    };
    
    return (
        <DirectorLayout user={auth.user}>
            <Head title="Document Templates" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Document Templates</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Manage custom HTML templates for school documents
                            </p>
                        </div>
                        <Link
                            href={route('director.documents.create')}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Create Template
                        </Link>
                    </div>
                    
                    {/* Templates Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {templates.map((template) => (
                                    <tr key={template.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                                                <span className="font-medium text-gray-900">
                                                    {template.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {template.type}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(template.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={route('director.documents.edit', template.id)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                >
                                                    <PencilIcon className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(template.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {templates.length === 0 && (
                            <div className="text-center py-12">
                                <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">No templates found</p>
                                <Link
                                    href={route('director.documents.create')}
                                    className="text-blue-600 hover:text-blue-800 mt-2 inline-block"
                                >
                                    Create your first template
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DirectorLayout>
    );
}
```

### Reports Dashboard

**Location:** `resources/js/Pages/Director/Reports/Index.jsx`

```jsx
import DirectorLayout from '@/Layouts/DirectorLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { 
    DocumentTextIcon, 
    ArrowDownTrayIcon, 
    ArrowTrendingUpIcon, 
    CurrencyDollarIcon 
} from '@heroicons/react/24/outline';

export default function ReportsIndex({ auth, grades, sections }) {
    const [filters, setFilters] = useState({
        grade_id: '',
        section_id: '',
        status: '',
        semester: '1'
    });
    
    const handleExport = (reportType, format) => {
        const params = new URLSearchParams(filters);
        params.append('format', format);
        
        window.location.href = route(`director.reports.export-${reportType}`) + '?' + params.toString();
    };
    
    const reportTypes = [
        {
            id: 'student-list',
            title: 'Student List',
            description: 'Comprehensive student roster with contact information',
            icon: DocumentTextIcon,
            color: 'blue',
            filters: ['grade_id', 'section_id']
        },
        {
            id: 'rank-list',
            title: 'Rank List',
            description: 'Academic ranking based on semester performance',
            icon: ArrowTrendingUpIcon,
            color: 'green',
            filters: ['grade_id', 'section_id', 'semester']
        },
        {
            id: 'payment-status',
            title: 'Payment Status',
            description: 'Financial overview with payment tracking',
            icon: CurrencyDollarIcon,
            color: 'orange',
            filters: ['grade_id', 'section_id', 'status']
        }
    ];
    
    return (
        <DirectorLayout user={auth.user}>
            <Head title="Reports" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports Dashboard</h1>
                    
                    {/* Report Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {reportTypes.map((report) => {
                            const Icon = report.icon;
                            return (
                                <div key={report.id} className="bg-white rounded-lg shadow p-6">
                                    <div className={`w-12 h-12 bg-${report.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                                        <Icon className={`w-6 h-6 text-${report.color}-600`} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {report.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        {report.description}
                                    </p>
                                    
                                    {/* Filters */}
                                    <div className="space-y-3 mb-4">
                                        {report.filters.includes('grade_id') && (
                                            <select
                                                value={filters.grade_id}
                                                onChange={(e) => setFilters({...filters, grade_id: e.target.value})}
                                                className="w-full px-3 py-2 border rounded text-sm"
                                            >
                                                <option value="">All Grades</option>
                                                {grades.map(g => (
                                                    <option key={g.id} value={g.id}>{g.name}</option>
                                                ))}
                                            </select>
                                        )}
                                        
                                        {report.filters.includes('section_id') && (
                                            <select
                                                value={filters.section_id}
                                                onChange={(e) => setFilters({...filters, section_id: e.target.value})}
                                                className="w-full px-3 py-2 border rounded text-sm"
                                            >
                                                <option value="">All Sections</option>
                                                {sections.map(s => (
                                                    <option key={s.id} value={s.id}>{s.name}</option>
                                                ))}
                                            </select>
                                        )}
                                        
                                        {report.filters.includes('status') && (
                                            <select
                                                value={filters.status}
                                                onChange={(e) => setFilters({...filters, status: e.target.value})}
                                                className="w-full px-3 py-2 border rounded text-sm"
                                            >
                                                <option value="">All Status</option>
                                                <option value="paid">Paid</option>
                                                <option value="pending">Pending</option>
                                                <option value="overdue">Overdue</option>
                                            </select>
                                        )}
                                        
                                        {report.filters.includes('semester') && (
                                            <select
                                                value={filters.semester}
                                                onChange={(e) => setFilters({...filters, semester: e.target.value})}
                                                className="w-full px-3 py-2 border rounded text-sm"
                                            >
                                                <option value="1">Semester 1</option>
                                                <option value="2">Semester 2</option>
                                            </select>
                                        )}
                                    </div>
                                    
                                    {/* Export Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleExport(report.id, 'pdf')}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                        >
                                            <ArrowDownTrayIcon className="w-4 h-4" />
                                            PDF
                                        </button>
                                        <button
                                            onClick={() => handleExport(report.id, 'excel')}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                                        >
                                            <ArrowDownTrayIcon className="w-4 h-4" />
                                            Excel
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </DirectorLayout>
    );
}
```

## Routes

**Location:** `routes/web.php`

```php
// Director Document Templates
Route::prefix('director')->middleware(['auth', 'role:director'])->group(function () {
    Route::get('/documents', [DirectorDocumentsController::class, 'index'])
        ->name('director.documents.index');
    Route::get('/documents/create', [DirectorDocumentsController::class, 'create'])
        ->name('director.documents.create');
    Route::post('/documents', [DirectorDocumentsController::class, 'store'])
        ->name('director.documents.store');
    Route::get('/documents/{template}/edit', [DirectorDocumentsController::class, 'edit'])
        ->name('director.documents.edit');
    Route::put('/documents/{template}', [DirectorDocumentsController::class, 'update'])
        ->name('director.documents.update');
    Route::delete('/documents/{template}', [DirectorDocumentsController::class, 'destroy'])
        ->name('director.documents.destroy');
    
    // Reports
    Route::get('/reports', [DirectorReportController::class, 'index'])
        ->name('director.reports.index');
    Route::get('/reports/export-student-list', [DirectorReportController::class, 'exportStudentList'])
        ->name('director.reports.export-student-list');
    Route::get('/reports/export-rank-list', [DirectorReportController::class, 'exportRankList'])
        ->name('director.reports.export-rank-list');
    Route::get('/reports/export-payment-status', [DirectorReportController::class, 'exportPaymentStatus'])
        ->name('director.reports.export-payment-status');
});
```

## Navigation Integration

**Location:** `resources/js/Layouts/DirectorLayout.jsx`

Add to navigation array:

```jsx
{ 
    name: 'Reports', 
    href: route('director.reports.index'), 
    icon: ChartBarIcon, 
    active: url.startsWith('/director/reports') 
},
{ 
    name: 'Documents', 
    href: route('director.documents.index'), 
    icon: DocumentTextIcon, 
    active: url.startsWith('/director/documents') 
}
```

## Security Considerations

1. **Authorization**: Only directors can access these features
2. **Input Sanitization**: HTML content sanitized to prevent XSS
3. **SQL Injection**: Use Eloquent ORM with parameter binding
4. **File Security**: Generated files stored temporarily and cleaned up
5. **Audit Logging**: All template changes and report generations logged

## Performance Optimization

1. **Query Optimization**: Eager load relationships to avoid N+1
2. **Caching**: Cache grade/section lists for filter dropdowns
3. **Pagination**: Limit large result sets
4. **Async Processing**: Consider queue for very large reports (future)
5. **Database Indexing**: Index frequently queried columns

## Testing Strategy

### Unit Tests
- DocumentTemplate model CRUD operations
- Report query builders
- Export service methods

### Feature Tests
- Template creation/update/delete
- Report generation with filters
- PDF/Excel export functionality
- Access control enforcement

### Integration Tests
- Complete template management workflow
- End-to-end report generation
- File download verification

## Monitoring

- Track report generation times
- Monitor export file sizes
- Log failed exports
- Track feature usage by directors
