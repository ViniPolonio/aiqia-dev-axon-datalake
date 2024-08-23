<?php

namespace App\Http\Requests\SyncConfig;

use Illuminate\Foundation\Http\FormRequest;

class SyncControlConfigCreateRequest extends FormRequest
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
            'process_name'  => 'bail|required|string|max:255',
            'active'        => 'bail|integer',
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
            'process_name.required'      => 'The Process name is required.',
            'process_name.string'        => 'The Process name must be a string.',
            'process_name.max'           => 'The Process name may not be greater than 255 characters.',
        ];
    }
}
