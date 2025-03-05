<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    // Define fillable fields for mass assignment
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'hire_date',
        'department_id',
        'status',
        'thumbnail',
    ];

    protected $appends = ['thumbnail_url'];

    /**
     * Get the department that the employee belongs to.
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }


    public function getThumbnailUrlAttribute()
    {
        return $this->thumbnail
            ? url('storage/' . $this->thumbnail)
            : null;
    }
}
