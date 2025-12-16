import { useAppStore } from '@/shared/store/useAppStore';

interface FormFieldProps {
  label: string;        // "Patient Name"
  fieldKey: string;     // "patientName" (key in the data)
  type?: 'text' | 'number' | 'date' | 'textarea';
  placeholder?: string;
  required?: boolean;   // Whether the field is required
}

export const FormField = ({
  label,
  fieldKey,
  type = 'text',
  placeholder,
  required = false
}: FormFieldProps) => {

  // Read from store
  const extractedData = useAppStore((state) => state.extractedData);
  const formData = useAppStore((state) => state.formData);
  const updateFormData = useAppStore((state) => state.updateFormData);

  // Get the value: use edited value if exists, otherwise use extracted value
  // Convert to string to ensure compatibility with HTML input elements
  const rawValue = formData[fieldKey] ?? extractedData?.[fieldKey] ?? '';
  const value = String(rawValue);

  // Debug: log when value is found
  if (extractedData?.[fieldKey] && fieldKey === 'lastName') {
    console.log('🔍 FormField Debug:', { fieldKey, extractedValue: extractedData[fieldKey], formValue: formData[fieldKey], finalValue: value });
  }

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateFormData(fieldKey, e.target.value);
  };

  return (
    <div className="mb-4">
      {/* Label */}
      <label className="block text-sm font-medium text-text-secondary mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input or Textarea */}
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={4}
          required={required}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition ${type === 'number' ? 'no-spinner' : ' '}`}
        />
      )}
    </div>
  );
};