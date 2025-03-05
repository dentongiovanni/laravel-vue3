<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Department;

class DepartmentController extends Controller
{
 
    public function index()
    {
        return response()->json(Department::all());
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name'        => 'required|string|unique:departments,name',
            'description' => 'nullable|string',
        ]);

        $department = Department::create($validatedData);
        return response()->json($department, 201);
    }

  
    public function show(Department $department)
    {
        return response()->json($department);
    }

 
    public function update(Request $request, Department $department)
    {
        $validatedData = $request->validate([
            'name'        => 'required|string|unique:departments,name,' . $department->id,
            'description' => 'nullable|string',
        ]);

        $department->update($validatedData);
        return response()->json($department);
    }


    public function destroy(Department $department)
    {
        $department->delete();
        return response()->json(null, 204);
    }
}
