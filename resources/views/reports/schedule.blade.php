<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>School Schedule</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: #1e293b;
        }

        h1 {
            text-align: center;
            color: #0f172a;
            margin-bottom: 5px;
            font-size: 24px;
        }

        .meta {
            margin-bottom: 30px;
            text-align: center;
            font-size: 14px;
            color: #64748b;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            table-layout: fixed;
        }

        th {
            background-color: #f1f5f9;
            border: 1px solid #cbd5e1;
            padding: 12px 8px;
            text-align: center;
            font-size: 11px;
            font-weight: bold;
            color: #334155;
            text-transform: uppercase;
        }

        td {
            border: 1px solid #cbd5e1;
            padding: 10px 6px;
            text-align: center;
            font-size: 11px;
            height: 40px;
            word-wrap: break-word;
        }

        .time-cell {
            background-color: #f8fafc;
            font-weight: bold;
            color: #475569;
            width: 80px;
        }

        .activity-cell {
            font-weight: 500;
        }

        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 10px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
        }
    </style>
</head>

<body>
    <h1>School Schedule</h1>

    <div class="meta">
        <p><strong>Generated on:</strong> {{ now()->format('F j, Y, g:i a') }}</p>
        @if(isset($grade))
            <p><strong>Grade:</strong> {{ $grade->name }}</p>
        @endif
        @if(isset($section))
            <p><strong>Section:</strong> {{ $section->name }}</p>
        @endif
    </div>

    <table class="timetable">
        <thead>
            <tr>
                <th class="time-col">TIME</th>
                @foreach($days as $day)
                    <th>{{ strtoupper($day) }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @forelse($timetable as $timeSlot => $dayActivities)
                <tr>
                    <td class="time-cell">{{ $timeSlot }}</td>
                    @foreach($days as $day)
                        <td class="activity-cell">
                            {{ $dayActivities[$day] ?: '-' }}
                        </td>
                    @endforeach
                </tr>
            @empty
                <tr>
                    <td colspan="6" style="text-align: center;">No schedule entries found.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>© {{ date('Y') }} Student Management System</p>
    </div>
</body>

</html>