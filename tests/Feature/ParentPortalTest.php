<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Student;
use App\Models\ParentProfile;
use App\Models\Grade;
use App\Models\Section;
use App\Models\AcademicYear;
use App\Models\Subject;
use App\Models\AssessmentType;
use App\Models\Mark;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ParentPortalTest extends TestCase
{
    use RefreshDatabase;

    protected $parentUser;
    protected $student;
    protected $otherStudent;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->seed(\Database\Seeders\ParentPortalSeeder::class);
        
        $this->parentUser = User::where('email', 'parent@example.com')->first();
        $this->student = Student::first();
        
        // Create another student/parent for isolation test
        $otherParentUser = User::factory()->create();
        $otherProfile = ParentProfile::create(['user_id' => $otherParentUser->id]);
        $this->otherStudent = Student::factory()->create();
        $otherProfile->students()->attach($this->otherStudent->id);
    }

    public function test_parent_can_view_dashboard()
    {
        $response = $this->actingAs($this->parentUser)
             ->get('/parent/dashboard');

        $response->assertStatus(200);
    }

    public function test_parent_can_view_own_student_profile()
    {
        $response = $this->actingAs($this->parentUser)
             ->get('/parent/student/' . $this->student->id);

        $response->assertStatus(200);
    }

    public function test_parent_cannot_view_other_student_profile()
    {
        $response = $this->actingAs($this->parentUser)
             ->get('/parent/student/' . $this->otherStudent->id);

        $response->assertStatus(404); // or 403 based on findOrFail in controller
    }

    public function test_parent_can_view_marks()
    {
        $response = $this->actingAs($this->parentUser)
             ->get('/parent/student/' . $this->student->id . '/marks');

        $response->assertStatus(200);
    }

    public function test_parent_can_view_progress()
    {
        $response = $this->actingAs($this->parentUser)
             ->get('/parent/student/' . $this->student->id . '/progress');

        $response->assertStatus(200);
    }

    public function test_parent_can_access_settings()
    {
        $response = $this->actingAs($this->parentUser)
             ->get('/parent/settings/password');

        $response->assertStatus(200);
    }

    public function test_parent_can_change_password()
    {
        $response = $this->actingAs($this->parentUser)
            ->post('/parent/settings/password', [
                'current_password' => 'password',
                'password' => 'newpassword123',
                'password_confirmation' => 'newpassword123',
            ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();
        
        $this->assertTrue(Hash::check('newpassword123', $this->parentUser->fresh()->password));
    }
}
