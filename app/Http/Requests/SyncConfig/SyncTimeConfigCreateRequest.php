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
            'active'                => 'bail|integer',
            'data_type'             => 'bail|required',
            'data_value'            => 'bail|required',
        ];
    }

    public function messages(): array
    {
        return [
            'interval_type.required'    => 'The interval_type is required',
            'interval_type.integer'     => 'The interval_type is required',

            'interval_value.required'   => 'The interval value is required',
            'interval_value.integer'    => 'The interval value is required',
            
            'sync_table_config_id.required' => 'The sync table config ID field is required.',
            'sync_table_config_id.exists'   => 'The sync table config id is not exists',

            'data_type.required'            => 'The data_type is required',
            'data_value.required'           => 'The data_value is required',
        ];
    }
}
