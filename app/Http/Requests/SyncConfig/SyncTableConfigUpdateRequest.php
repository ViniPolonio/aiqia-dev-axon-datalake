<?php

namespace App\Http\Requests\SyncConfig;

use Illuminate\Foundation\Http\FormRequest;

class SyncTableConfigUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'oracle_name'       => 'bail|string|max:255',
            'mysql_name'        => 'bail|string|max:255',
            'field_check_name'  => 'bail|string|max:255',
            'uniq_fields_name'  => 'bail|string|max:255',
            'active'            => 'bail|integer',
        ];
    }

    /**
     * Get the custom messages for the validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'oracle_name.string'        => 'The Oracle name must be a string.',
            'oracle_name.max'           => 'The Oracle name may not be greater than 255 characters.',

            'mysql_name.string'         => 'The MySQL name must be a string.',
            'mysql_name.max'            => 'The MySQL name may not be greater than 255 characters.',
            
            'field_check_name.string'   => 'The field check name must be a string.',
            'field_check_name.max'      => 'The field check name may not be greater than 255 characters.',
            
            'uniq_fields_name.string'   => 'The unique fields name must be a string.',
            'uniq_fields_name.max'      => 'The unique fields name may not be greater than 255 characters.',
            
            'active.integer'            => 'The active status must be integer.',
        ];
    }
}
