<?php

namespace App\Http\Requests\SyncConfig;

use Illuminate\Foundation\Http\FormRequest;

class SyncTimeConfigUpdateRequest extends FormRequest
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
            'type'                  => 'bail|integer|max:255',
            'value'                 => 'bail|integer|max:255',
            'sync_table_config_id'  => 'bail|required', 
            'active'                => 'bail|integer', 
        ];
    }

    public function messages(): array
    {
        return [
            'type.integer'      => 'The type field must be a string.',
            'type.max'          => 'The type field may not be greater than 255 characters.',
            'value.integer'     => 'The value field must be a string.',
            'value.max'         => 'The value field may not be greater than 255 characters.',
            'sync_table_config_id.required' => 'The sync table config ID field is required.',
            'active.integer'                => 'The active status field must be integer.',
        ];
    }
}
