<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => fn () => $request->user() ? [
                'user' => [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'username' => $request->user()->username,
                    'email' => $request->user()->email,
                    'profile_photo_url' => $request->user()->profile_photo_url ?? null,
                ],
            ] : null,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'credentials' => fn () => $request->session()->get('credentials'),
            ],
            'selectedStudentId' => function () use ($request) {
                $id = $request->session()->get('selected_student_id');
                if (!$id && $request->user() && $request->user()->isParent() && $request->user()->parentProfile) {
                    $id = $request->user()->parentProfile->students()->first()?->id;
                    if ($id) {
                        $request->session()->put('selected_student_id', $id);
                    }
                }
                return $id;
            },
            'students' => function () use ($request) {
                if ($request->user() && $request->user()->isParent() && $request->user()->parentProfile) {
                    return $request->user()->parentProfile->students()
                        ->with(['user:id,name', 'grade:id,name', 'section:id,name'])
                        ->get();
                }
                return null;
            },
        ];
    }
}
