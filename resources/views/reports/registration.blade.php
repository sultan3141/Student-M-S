<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Registration Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #2563EB;
            padding-bottom: 15px;
        }
        .header h1 {
            margin: 0;
            color: #2563EB;
            font-size: 24px;
        }
        .header p {
            margin: 5px 0;
            color: #666;
            font-size: 12px;
        }
        .stats {
            display: flex;
            justify-content: space-around;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }
        .stat-box {
            border: 1px solid #ddd;
            padding: 15px;
            text-align: center;
            width: 22%;
            margin-bottom: 10px;
            border-radius: 5px;
        }
        .stat-box h3 {
            margin: 0;
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
        }
        .stat-box .number {
            font-size: 28px;
            font-weight: bold;
            color: #2563EB;
            margin: 10px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        table thead {
            background-color: #2563EB;
            color: white;
        }
        table th {
            padding: 12px;
            text-align: left;
            font-weight: bold;
            font-size: 11px;
            text-transform: uppercase;
        }
        table td {
            padding: 10px 12px;
            border-bottom: 1px solid #ddd;
            font-size: 11px;
        }
        table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-completed {
            background-color: #d1fae5;
            color: #065f46;
        }
        .status-pending {
            background-color: #fef3c7;
            color: #92400e;
        }
        .status-rejected {
            background-color: #fee2e2;
            color: #991b1b;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 15px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Registration Report</h1>
        <p>Academic Year: {{ $academicYear->name ?? 'N/A' }}</p>
        <p>Generated on: {{ now()->format('M d, Y H:i A') }}</p>
    </div>

    <div class="stats">
        <div class="stat-box">
            <h3>Total Registrations</h3>
            <div class="number">{{ $stats['totalRegistrations'] }}</div>
        </div>
        <div class="stat-box">
            <h3>Completed</h3>
            <div class="number" style="color: #10b981;">{{ $stats['completedRegistrations'] }}</div>
        </div>
        <div class="stat-box">
            <h3>Pending</h3>
            <div class="number" style="color: #f59e0b;">{{ $stats['pendingRegistrations'] }}</div>
        </div>
        <div class="stat-box">
            <h3>Rejected</h3>
            <div class="number" style="color: #ef4444;">{{ $stats['rejectedRegistrations'] }}</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Grade</th>
                <th>Status</th>
                <th>Registration Date</th>
            </tr>
        </thead>
        <tbody>
            @forelse($registrations as $registration)
                <tr>
                    <td>{{ $registration->student->user->name ?? 'N/A' }}</td>
                    <td>{{ $registration->student->student_id }}</td>
                    <td>{{ $registration->student->grade->name ?? 'N/A' }}</td>
                    <td>
                        <span class="status-badge status-{{ $registration->status }}">
                            {{ ucfirst($registration->status) }}
                        </span>
                    </td>
                    <td>{{ $registration->created_at->format('M d, Y') }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" style="text-align: center; color: #999;">No registrations found</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>This is an automatically generated report. For more information, contact the administration.</p>
    </div>
</body>
</html>
