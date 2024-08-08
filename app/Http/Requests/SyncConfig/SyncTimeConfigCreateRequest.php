<?php

namespace App\Http\Requests\SyncConfig;

use Illuminate\Foundation\Http\FormRequest;

class SyncTimeConfigCreateRequest extends FormRequest
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
            'interval_type'         => 'bail|required|integer',
            'interval_value'        => 'bail|required|integer',
            'sync_table_config_id'  => 'bail|required',
            'active'                => 'bail|required|integer', 
        ];
    }

    public function messages(): array
    {
        return [
            'interval_type.required'    => 'The interval_type is required',
            'interval_type.integer'     => 'The interval_type is required',

            'interval_value.required'   => 'The interval value is required',
            'interval_value.integer'    => 'The interval value is required',
            
            'oracle_name.required'        => 'The Oracle name is required.',
            'oracle_name.integer'         => 'The Oracle name must be an integer.',

            'mysql_name.required'         => 'The MySQL name is required.',
            'mysql_name.integer'          => 'The MySQL name must be an integer.',
            
            'field_check_name.required'   => 'The field check name is required.',
            'field_check_name.integer'    => 'The field check name must be an integer.',
            
            'sync_table_config_id.required' => 'The sync table config ID field is required.',

            'sync_table_config_id.exists'   => 'The syc table config id is not exists',

            'uniq_fields_name.required'   => 'The unique fields name is required.',
            'uniq_fields_name.integer'    => 'The unique fields name must be an integer.',
            
            'active.required'             => 'The active status is required.',
            'active.integer'              => 'The active status must be an integer.',
        ];
    }
}
