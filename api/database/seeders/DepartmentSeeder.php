<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Department::create([
            'name' => 'Human Resources',
            'description' => 'Handles HR related tasks.'
        ]);

        Department::create([
            'name' => 'Engineering',
            'description' => 'Handles software development and engineering tasks.'
        ]);

        Department::create([
            'name' => 'Sales',
            'description' => 'Manages sales and client relationships.'
        ]);
    }
}
