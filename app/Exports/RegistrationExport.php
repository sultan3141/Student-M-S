<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class RegistrationExport implements FromCollection, WithHeadings, WithStyles
{
    protected $registrations;

    public function __construct($registrations)
    {
        $this->registrations = $registrations;
    }

    public function collection()
    {
        return $this->registrations->map(function ($registration) {
            return [
                'Student Name' => $registration->student->user->name ?? 'N/A',
                'Student ID' => $registration->student->student_id,
                'Grade' => $registration->student->grade->name ?? 'N/A',
                'Status' => ucfirst($registration->status),
                'Registration Date' => $registration->created_at->format('M d, Y'),
                'Academic Year' => $registration->academic_year->name ?? 'N/A',
            ];
        });
    }

    public function headings(): array
    {
        return [
            'Student Name',
            'Student ID',
            'Grade',
            'Status',
            'Registration Date',
            'Academic Year',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => '2563EB']],
                'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
            ],
        ];
    }
}
