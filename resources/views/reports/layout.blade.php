<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Report</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #228B22; /* Islamic Green */
            padding-bottom: 10px;
        }
        .school-name {
            font-size: 18px;
            font-weight: bold;
            color: #228B22;
            text-transform: uppercase;
        }
        .report-title {
            font-size: 16px;
            font-weight: bold;
            margin-top: 5px;
            color: #1F2937;
        }
        .meta-info {
            font-size: 10px;
            color: #666;
            margin-top: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
            color: #1F2937;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .footer {
            margin-top: 30px;
            text-align: right;
            font-size: 10px;
            color: #999;
            border-top: 1px solid #eee;
            padding-top: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="school-name">{{ config('app.name', 'Islamic Private School') }}</div>
        <div class="report-title">@yield('title')</div>
        <div class="meta-info">
            Generated on: {{ now()->format('Y-m-d H:i:s') }} | Academic Year: {{ $academicYear ?? 'Current' }}
        </div>
    </div>

    <div class="content">
        @yield('content')
    </div>

    <div class="footer">
        Page <span class="pagenum"></span>
    </div>
</body>
</html>
