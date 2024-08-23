<?php

namespace App\Http\Requests\SyncConfig;

use Illuminate\Foundation\Http\FormRequest;

class SyncControlTimeConfigUpdateRequest extends FormRequest
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
            'data_type'               => 'bail|integer|max:255',
            'data_value'              => 'bail|integer|max:255',
            'sync_control_config_id'  => 'bail|required', 
            'active'                  => 'bail|integer',
            'interval_type'           => 'bail|integer',
            'interval_value'          => 'bail|integer',
        ];
    }

    public function messages(): array
    {
        return [
            'data_type.integer'    => 'The type field must be a string.',
            'data_type.max'        => 'The type field may not be greater than 255 characters.',
            'data_value.integer'   => 'The value field must be a string.',
            'data_value.max'       => 'The value field may not be greater than 255 characters.',
            'sync_table_config_id.required' => 'The sync table config ID field is required.',
            'active.integer'          => 'The active status field must be integer.',
            'interval_type.integer'   => 'The interval_type must be a integer',
            'interval_value.integer'  => 'The interval_value must be a integer',
        ];
    }
}
