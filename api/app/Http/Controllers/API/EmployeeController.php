<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\EmployeeStoreRequest;
use App\Http\Requests\EmployeeUpdateRequest;
use App\Models\Employee;

class EmployeeController extends Controller
{
    /**
     * GET /api/employees
     */
    public function index()
    {
        $employees = Employee::with('department')->get();
        return response()->json($employees);
    }

    /**
     * POST /api/employees
     */
    public function store(EmployeeStoreRequest $request)
    {
        $validatedData = $request->validated();

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('employees', 'public');
            $validatedData['thumbnail'] = $path;
        }

        $employee = Employee::create($validatedData);
        $employee->load('department');

        $employee->thumbnail_url = $employee->thumbnail
            ? url('storage/' . $employee->thumbnail)
            : null;

        return response()->json($employee, 201);
    }

    /**
     * GET /api/employees/{employee}
     */
    public function show(Employee $employee)
    {
        $employee->load('department');

        $employee->thumbnail_url = $employee->thumbnail
            ? url('storage/' . $employee->thumbnail)
            : null;

        return response()->json($employee);
    }

    /**
     * PUT/PATCH /api/employees/{employee}
     */
    public function update(EmployeeUpdateRequest $request, Employee $employee)
    {
        $validatedData = $request->validated();

        if ($request->hasFile('thumbnail')) {

            if ($employee->thumbnail) {
                \Storage::disk('public')->delete($employee->thumbnail);
            }

            $path = $request->file('thumbnail')->store('employees', 'public');
            $validatedData['thumbnail'] = $path;
        }

        $employee->update($validatedData);
        $employee->load('department');

        $employee->thumbnail_url = $employee->thumbnail
            ? url('storage/' . $employee->thumbnail)
            : null;

        return response()->json($employee);
    }

    /**
     * DELETE /api/employees/{employee}
     */
    public function destroy(Employee $employee)
    {
        $employee->delete();
        return response()->json(null, 204);
    }
}
