<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;
use App\Models\Department;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Fetch departments to assign employees
        $hrDept = Department::where('name', 'Human Resources')->first();
        $engDept = Department::where('name', 'Engineering')->first();
        $salesDept = Department::where('name', 'Sales')->first();

        Employee::create([
            'first_name'    => 'John',
            'last_name'     => 'Doe',
            'email'         => 'john.doe@example.com',
            'phone'         => '1234567890',
            'hire_date'     => now()->subYears(2)->format('Y-m-d'),
            'department_id' => $hrDept ? $hrDept->id : null,
            'status'        => 'active'
        ]);

        Employee::create([
            'first_name'    => 'Jane',
            'last_name'     => 'Smith',
            'email'         => 'jane.smith@example.com',
            'phone'         => '2345678901',
            'hire_date'     => now()->subYear()->format('Y-m-d'),
            'department_id' => $engDept ? $engDept->id : null,
            'status'        => 'active'
        ]);

        Employee::create([
            'first_name'    => 'Emily',
            'last_name'     => 'Jones',
            'email'         => 'emily.jones@example.com',
            'phone'         => '3456789012',
            'hire_date'     => now()->subMonths(8)->format('Y-m-d'),
            'department_id' => $salesDept ? $salesDept->id : null,
            'status'        => 'active'
        ]);
    }
}
