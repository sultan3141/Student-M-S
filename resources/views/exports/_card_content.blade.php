<!-- HEADER SECTION -->
<div class="header-container text-center">
    <div class="school-name-or">{{ $schoolInfo['name_or'] }}</div>
    <div class="school-name-en">{{ $schoolInfo['name_en'] }}</div>
    <div class="school-name-ar arabic">مدرسة دار العلوم الإسلامية</div>
    <div class="contact-info">
        📞 {{ $schoolInfo['phone'] }} | 📧 {{ $schoolInfo['email'] }} | 📍 {{ $schoolInfo['address'] }}
    </div>
    <div class="report-title-box">
        STUDENT'S REPORT CARD / <span class="arabic">بطاقة تقرير الطالب</span>
    </div>
</div>

<!-- STUDENT METADATA -->
<table class="student-meta-table">
    <tr>
        <td width="55%">
            <span class="label">Maqaa Barataa / Name / <span class="arabic">اسم الطالب</span>:</span><br>
            <span class="value">{{ $student->user->name }}</span>
        </td>
        <td width="20%">
            <span class="label">Saala / Sex / <span class="arabic">الجنس</span>:</span><br>
            <span class="value">{{ $sex }}</span>
        </td>
        <td width="25%">
            <span class="label">Umrii / Age / <span class="arabic">العمر</span>:</span><br>
            <span class="value">{{ $age }}</span>
        </td>
    </tr>
    <tr>
        <td>
            <span class="label">Bara Barnootaa / Year / <span class="arabic">العام الدراسي</span>:</span><br>
            <span class="value">{{ $yearName }}</span>
        </td>
        <td>
            <span class="label">Kutaa / Grade / <span class="arabic">الصف</span>:</span><br>
            <span class="value">{{ $student->grade->name }} ({{ $student->section->name }})</span>
        </td>
        <td>
            <span class="label">ID / <span class="arabic">رقم الهوية</span>:</span><br>
            <span class="value">{{ $student->student_id }}</span>
        </td>
    </tr>
</table>

<!-- ACADEMIC RECORD -->
<table class="marks-table">
    <thead>
        <tr>
            <th class="subject-column">
                Gosa Barnootaa / Subjects<br>
                <span class="arabic">المواد الدراسية</span>
            </th>
            <th>Sem. 1 / <span class="arabic">ف 1</span></th>
            <th>Sem. 2 / <span class="arabic">ف 2</span></th>
            <th>Avg / <span class="arabic">المعدل</span></th>
        </tr>
    </thead>
    <tbody>
        @php
            $trilingualMap = [
                'Holly Quran' => ['or' => 'Qur\'aana', 'en' => 'Qur\'an', 'ar' => 'القرآن الكريم'],
                'Islamic Education' => ['or' => 'Tarbiyaa', 'en' => 'Islamic Education', 'ar' => 'التربية الإسلامية'],
                'Arabic' => ['or' => 'A. Arabaa', 'en' => 'Arabic Language', 'ar' => 'اللغة العربية'],
                'English' => ['or' => 'Ingliffaa', 'en' => 'English', 'ar' => 'الإنجليزية'],
                'Amharic' => ['or' => 'Amaariffaa', 'en' => 'Amharic', 'ar' => 'الأمهرية'],
                'Oromic' => ['or' => 'A. Oromoo', 'en' => 'Oromic', 'ar' => 'الأورومية'],
                'Ethical Education' => ['or' => 'B. Safuu', 'en' => 'Ethical education', 'ar' => 'الأخلاقية'],
                'E. Science' => ['or' => 'Saayinsii N.', 'en' => 'E. Science', 'ar' => 'العلوم العامة'],
                'Mathematics' => ['or' => 'Herrega', 'en' => 'Math.', 'ar' => 'الرياضيات'],
                'PVA' => ['or' => 'Og-Aartii', 'en' => 'PVA', 'ar' => 'الأدب والفن'],
                'HPE' => ['or' => 'B.F.I.Q', 'en' => 'H.P.E', 'ar' => 'الرياضة'],
                'IT' => ['or' => 'Aaytit', 'en' => 'IT', 'ar' => 'الكمبيوتر'],
            ];
            $orderedSubjects = ['Holly Quran', 'Islamic Education', 'Arabic', 'English', 'Amharic', 'Oromic', 'Ethical Education', 'E. Science', 'Mathematics', 'PVA', 'HPE', 'IT'];
            $sem1Res = $semesterResults[1] ?? null;
            $sem2Res = $semesterResults[2] ?? null;
            $totalAvg = ($sem1Res && $sem2Res) ? ($sem1Res['average'] + $sem2Res['average']) / 2 : ($sem1Res['average'] ?? $sem2Res['average'] ?? 0);

            $getSemesterTotal = function ($sem) use ($subjectMarks, $orderedSubjects) {
                $total = 0;
                foreach ($orderedSubjects as $sub) {
                    $actualKey = null;
                    foreach (array_keys($subjectMarks) as $k) {
                        if (stripos($k, $sub) !== false || stripos($sub, $k) !== false) {
                            $actualKey = $k;
                            break;
                        }
                    }
                    if ($actualKey && isset($subjectMarks[$actualKey][$sem])) {
                        $total += $subjectMarks[$actualKey][$sem];
                    }
                }
                return $total > 0 ? $total : '-';
            };
        @endphp

        @foreach($orderedSubjects as $subKey)
            @php
                $labels = $trilingualMap[$subKey] ?? ['or' => $subKey, 'en' => $subKey, 'ar' => ''];
                $actualKey = null;
                foreach (array_keys($subjectMarks) as $k) {
                    if (stripos($k, $subKey) !== false || stripos($subKey, $k) !== false) {
                        $actualKey = $k;
                        break;
                    }
                }
                $marks = $actualKey ? $subjectMarks[$actualKey] : [];
            @endphp
            <tr>
                <td class="subject-column">
                    {{ $labels['or'] }} / {{ $labels['en'] }}<br>
                    <span class="arabic">{{ $labels['ar'] }}</span>
                </td>
                <td>{{ $marks[1] ?? '-' }}</td>
                <td>{{ $marks[2] ?? '-' }}</td>
                <td>{{ isset($marks['final']) ? number_format($marks['final'], 1) : '-' }}</td>
            </tr>
        @endforeach

        <!-- SUMMARY ROWS -->
        <tr class="summary-row">
            <td class="subject-column">Ida'ama / Total / <span class="arabic">المجموع</span></td>
            <td>{{ $getSemesterTotal(1) }}</td>
            <td>{{ $getSemesterTotal(2) }}</td>
            <td>-</td>
        </tr>
        <tr>
            <td class="subject-column">Amala / Conduct / <span class="arabic">السلوك</span></td>
            <td>{{ $sem1Res['conduct'] ?? '-' }}</td>
            <td>{{ $sem2Res['conduct'] ?? '-' }}</td>
            <td>-</td>
        </tr>
        <tr>
            <td class="subject-column">G. Hafe / Absent / <span class="arabic">المواظبة</span></td>
            <td>{{ $sem1Res['absences'] ?? '-' }}</td>
            <td>{{ $sem2Res['absences'] ?? '-' }}</td>
            <td>-</td>
        </tr>
        <tr class="final-row">
            <td class="subject-column">Cuunfaa / Average / <span class="arabic">المعدل</span></td>
            <td>{{ $sem1Res ? number_format($sem1Res['average'], 1) : '-' }}</td>
            <td>{{ $sem2Res ? number_format($sem2Res['average'], 1) : '-' }}</td>
            <td>{{ number_format($totalAvg, 1) }}</td>
        </tr>
        <tr class="summary-row">
            <td class="subject-column">Sadarkaa / Rank / <span class="arabic">الدرجة</span></td>
            <td>{{ $sem1Res['rank'] ?? '-' }}</td>
            <td>{{ $sem2Res['rank'] ?? '-' }}</td>
            <td>-</td>
        </tr>
    </tbody>
</table>

<!-- REMARKS SECTION -->
<div class="remarks-container">
    <span class="remarks-title">Yaada Barsilisaa / Teacher's Remarks / <span class="arabic">ملاحظات
            المعلم</span>:</span>
    <div class="remark-box">
        <strong>Sem 1:</strong>
        {{ $sem1Res['remarks'] ?? '____________________________________________________________________' }}
    </div>
    <div class="remark-box">
        <strong>Sem 2:</strong>
        {{ $sem2Res['remarks'] ?? '____________________________________________________________________' }}
    </div>
</div>

<!-- FOOTER: SIGNATURES ONLY -->
<div style="margin-top: 15px;">
    <table width="100%">
        <tr>
            <td width="33%" class="text-center">
                <div class="signature-line">Teacher / <span class="arabic">المعلم</span></div>
            </td>
            <td width="33%" class="text-center">
                <div class="signature-line">Parent / <span class="arabic">ولي الأمر</span></div>
            </td>
            <td width="34%" class="text-center">
                <div class="signature-line">Director / <span class="arabic">المدير</span></div>
            </td>
        </tr>
    </table>
    <div style="margin-top: 10px; font-size: 8px; color: #666; text-align: center;">
        Promoted to: _____________________________ | Generated on: {{ $generatedAt }}
    </div>
</div>