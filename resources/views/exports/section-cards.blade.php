<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <style>
        @page {
            margin: 20px;
        }

        body {
            font-family: 'DejaVu Sans', 'Helvetica', 'Arial', sans-serif;
            font-size: 9px;
            color: #222;
            margin: 0;
            padding: 0;
        }

        .page-break {
            page-break-after: always;
        }

        .arabic {
            direction: rtl;
            font-size: 11px;
        }

        .text-center {
            text-align: center;
        }

        .font-bold {
            font-weight: bold;
        }

        .underline {
            text-decoration: underline;
        }

        .header-container {
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }

        .school-name-or {
            font-size: 15px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .school-name-en {
            font-size: 13px;
            font-weight: bold;
        }

        .school-name-ar {
            font-size: 18px;
            font-weight: bold;
            margin: 2px 0;
        }

        .contact-info {
            font-size: 8px;
            color: #555;
        }

        .report-title-box {
            background-color: #f0f0f0;
            border: 1px solid #333;
            padding: 4px 10px;
            display: inline-block;
            margin: 10px 0;
            font-size: 12px;
            font-weight: bold;
        }

        .student-meta-table {
            width: 100%;
            margin-bottom: 15px;
            border-collapse: collapse;
        }

        .student-meta-table td {
            padding: 3px 0;
            vertical-align: top;
        }

        .label {
            color: #444;
        }

        .value {
            font-weight: bold;
            border-bottom: 1px dotted #000;
            padding: 0 5px;
        }

        .marks-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        .marks-table th,
        .marks-table td {
            border: 1px solid #000;
            padding: 4px;
            text-align: center;
        }

        .marks-table th {
            background-color: #e9ecef;
            font-weight: bold;
            font-size: 8px;
        }

        .subject-column {
            text-align: left !important;
            width: 42%;
            padding-left: 8px !important;
            border-right: 2px solid #000 !important;
        }

        .summary-row {
            background-color: #f8f9fa;
            font-weight: bold;
        }

        .final-row {
            background-color: #e2e3e5;
            font-weight: bold;
            font-size: 10px;
        }

        .remarks-container {
            width: 100%;
            margin-top: 10px;
        }

        .remarks-title {
            text-decoration: underline;
            font-weight: bold;
            margin-bottom: 3px;
            display: block;
        }

        .remark-box {
            border: 1px solid #ccc;
            padding: 5px;
            min-height: 25px;
            margin-bottom: 8px;
            background: #fdfdfd;
        }

        .signature-line {
            border-top: 1px solid #000;
            width: 140px;
            margin: 0 auto;
            padding-top: 3px;
            font-size: 8px;
        }
    </style>
</head>

<body>
    @foreach($studentsData as $data)
        <div class="card-page {{ !$loop->last ? 'page-break' : '' }}">
            @include('exports._card_content', $data)
        </div>
    @endforeach
</body>

</html>