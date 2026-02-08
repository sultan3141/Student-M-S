<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Official Transcript - {{ $student->user->name }}</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: #333;
            line-height: 1.5;
            margin: 0;
            padding: 0;
            font-size: 12px;
        }
        .container {
            padding: 30px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #000;
            margin-bottom: 30px;
            padding-bottom: 15px;
        }
        .header h1 {
            text-transform: uppercase;
            margin: 0;
            font-size: 24px;
            letter-spacing: 2px;
        }
        .header p {
            margin: 2px 0;
            font-size: 10px;
            color: #666;
        }
        .transcript-title {
            text-align: center;
            margin: 20px 0;
        }
        .transcript-title h2 {
            display: inline-block;
            border: 4px double #000;
            padding: 5px 20px;
            text-transform: uppercase;
            font-size: 18px;
            margin: 0;
        }
        .info-grid {
            width: 100%;
            margin-bottom: 30px;
        }
        .info-grid td {
            vertical-align: top;
            padding-bottom: 10px;
        }
        .label {
            text-transform: uppercase;
            font-size: 9px;
            font-weight: bold;
            color: #777;
            display: block;
        }
        .value {
            font-size: 13px;
            font-weight: bold;
        }
        .academic-year-section {
            margin-bottom: 40px;
            page-break-inside: avoid;
        }
        .year-title {
            background: #f0f0f0;
            padding: 8px 15px;
            font-weight: bold;
            font-size: 14px;
            border-left: 5px solid #000;
            margin-bottom: 15px;
        }
        .semester-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .semester-table th {
            background: #eee;
            text-align: left;
            padding: 10px;
            border: 1px solid #ddd;
            font-size: 10px;
            text-transform: uppercase;
        }
        .semester-table td {
            padding: 8px 10px;
            border: 1px solid #ddd;
        }
        .sem-header {
            font-weight: bold;
            margin-bottom: 5px;
            color: #444;
        }
        .summary-row {
            background: #f9f9f9;
            font-weight: bold;
        }
        .footer {
            margin-top: 50px;
            width: 100%;
        }
        .signature-box {
            text-align: center;
            width: 30%;
        }
        .signature-line {
            border-bottom: 1px solid #000;
            margin-bottom: 5px;
            height: 30px;
        }
        .signature-label {
            font-size: 9px;
            text-transform: uppercase;
            color: #666;
        }
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 100px;
            color: rgba(0,0,0,0.03);
            z-index: -1;
            text-transform: uppercase;
            white-space: nowrap;
        }
    </style>
</head>
<body>
    <div class="watermark">Official Transcript</div>

    <div class="container">
        <div class="header">
            <h1>{{ strtoupper($schoolInfo['name']) }}</h1>
            <p>{{ $schoolInfo['address'] }}</p>
            <p>Tel: {{ $schoolInfo['phone'] }} | Email: {{ $schoolInfo['email'] }}</p>
        </div>

        <div class="transcript-title">
            <h2>Official Academic Transcript</h2>
        </div>

        <table class="info-grid whitespace-nowrap">
            <tr>
                <td width="60%">
                    <span class="label">Student Full Name</span>
                    <span class="value">{{ strtoupper($student->user->name) }}</span>
                </td>
                <td width="40%" align="right">
                    <span class="label">Student ID</span>
                    <span class="value">{{ $student->student_id }}</span>
                </td>
            </tr>
            <tr>
                <td>
                    <span class="label">Gender / Date of Birth</span>
                    <span class="value">{{ $student->gender }} / {{ $student->dob ?? 'N/A' }}</span>
                </td>
                <td align="right">
                    <span class="label">Current Grade / Section</span>
                    <span class="value">{{ $student->grade->name }} / {{ $student->section->name }}</span>
                </td>
            </tr>
        </table>

        @forelse($academicRecords as $year)
            <div class="academic-year-section">
                <div class="year-title">Academic Year: {{ $year['year_name'] }}</div>
                
                @foreach($year['semesters'] as $semesterNum => $data)
                    <div class="sem-header">Semester {{ $semesterNum }}</div>
                    <table class="semester-table">
                        <thead>
                            <tr>
                                <th width="40%">Subject</th>
                                <th width="20%" style="text-align: center;">Assessment</th>
                                <th width="15%" style="text-align: center;">Max</th>
                                <th width="15%" style="text-align: center;">Obtained</th>
                                <th width="10%" style="text-align: center;">Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($data['marks'] as $mark)
                                <tr>
                                    <td>{{ $mark->subject->name }}</td>
                                    <td align="center" style="font-size: 9px; color: #555;">{{ $mark->assessment_type }}</td>
                                    <td align="center">{{ $mark->max_score }}</td>
                                    <td align="center"><strong>{{ $mark->score_obtained }}</strong></td>
                                    <td align="center">
                                        @php
                                            $score = $mark->score_obtained;
                                            if ($score >= 90) echo 'A';
                                            elseif ($score >= 80) echo 'B';
                                            elseif ($score >= 70) echo 'C';
                                            elseif ($score >= 60) echo 'D';
                                            else echo 'F';
                                        @endphp
                                    </td>
                                </tr>
                            @endforeach
                            <tr class="summary-row">
                                <td colspan="3" align="right">Semester Average / Rank</td>
                                <td align="center"><strong>{{ $data['average'] ?? 'N/A' }}%</strong></td>
                                <td align="center">#{{ $data['rank'] ?? 'N/A' }}</td>
                            </tr>
                        </tbody>
                    </table>
                @endforeach
            </div>
        @empty
            <div style="text-align: center; padding: 50px; color: #999;">
                No academic history recorded for this student.
            </div>
        @endforelse

        <div class="footer">
            <table width="100%">
                <tr>
                    <td class="signature-box">
                        <div class="signature-line"></div>
                        <span class="signature-label">Registrar Signature</span>
                    </td>
                    <td width="40%"></td>
                    <td class="signature-box">
                        <div class="signature-line"></div>
                        <span class="signature-label">Principal Signature & Seal</span>
                    </td>
                </tr>
            </table>
            <div style="text-align: center; margin-top: 30px; font-size: 8px; color: #999;">
                This transcript is generated electronically on {{ $generatedAt }}. Any alterations render this document void.
            </div>
        </div>
    </div>
</body>
</html>
