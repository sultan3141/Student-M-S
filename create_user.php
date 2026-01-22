<?php
try {
    $u = App\Models\User::firstOrCreate(
        ['username' => 'registrar_jane'],
        [
            'name' => 'Jane Registrar',
            'email' => 'registrar@example.com',
            'password' => bcrypt('password')
        ]
    );

    $r = Spatie\Permission\Models\Role::firstOrCreate(['name' => 'registrar', 'guard_name' => 'web']);
    $u->assignRole('registrar');

    echo "USER_CREATED_SUCCESS: " . $u->username;
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage();
}
