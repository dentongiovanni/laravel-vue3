<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        
        $employeeId = $this->route('employee')->id ?? null;

        return [
            'first_name'    => 'sometimes|required|string',
            'last_name'     => 'sometimes|required|string',
            'email'         => 'sometimes|required|email|unique:employees,email,' . $employeeId,
            'phone'         => 'nullable|string',
            'hire_date'     => 'nullable|date',
            'department_id' => 'nullable|exists:departments,id',
            'status'        => 'sometimes|required|string',
            'thumbnail'     => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ];
    }
}
