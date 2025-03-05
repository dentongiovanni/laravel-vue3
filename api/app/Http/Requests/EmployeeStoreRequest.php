<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeStoreRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

   
    public function rules(): array
    {
        return [
            'first_name'    => 'required|string',
            'last_name'     => 'required|string',
            'email'         => 'required|email|unique:employees,email',
            'phone'         => 'nullable|string',
            'hire_date'     => 'nullable|date',
            'department_id' => 'nullable|exists:departments,id',
            'status'        => 'required|string',
            'thumbnail'     => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ];
    }
}
