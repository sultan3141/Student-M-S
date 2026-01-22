<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Mark;
use App\Models\Subject;

class TeacherMarkTest extends TestCase
{
    use RefreshDatabase;

    public function test_teacher_can_view_marks_page()
    {
        $user = User::factory()->create();
        $teacher = Teacher::create(['user_id' => $user->id]);
        
        $response = $this->actingAs($user)->get(route('teacher.marks.index'));

        $response->assertStatus(200);
    }

    public function test_teacher_can_create_marks()
    {
        $user = User::factory()->create();
        $teacher = Teacher::create(['user_id' => $user->id]);
        
        $subject = Subject::factory()->create();
        
        // Setup assignment logic here if strict check matches
        
        $response = $this->actingAs($user)->post(route('teacher.marks.store'), [
            'marks' => [
                ['student_id' => 1, 'score' => 85]
            ],
            'subject_id' => $subject->id,
            'grade_id' => 1,
            'section_id' => 1,
            'academic_year_id' => 1,
            'semester' => '1',
            'assessment_type' => 'Midterm'
        ]);

        $response->assertRedirect(route('teacher.marks.index'));
        $this->assertDatabaseHas('marks', ['score' => 85]);
    }
}
