import { useAppStore } from '@/shared/store/useAppStore';

interface RadioOption {
  label: string;  // What the user sees
  value: string;  // What gets stored
}

interface RadioFieldProps {
  label: string;           // "Sex"
  fieldKey: string;        // "sex"
  options: RadioOption[];  // [{ label: "Male", value: "M" }, ...]
  layout?: 'horizontal' | 'vertical' | 'responsive';  // How to display options
}

export const RadioField = ({
  label,
  fieldKey,
  options,
  layout = 'responsive'
}: RadioFieldProps) => {

  // Read from store
  const extractedData = useAppStore((state) => state.extractedData);
  const formData = useAppStore((state) => state.formData);
  const updateFormData = useAppStore((state) => state.updateFormData);

  // Get the value: use edited value if exists, otherwise use extracted value
  const value = formData[fieldKey] ?? extractedData?.[fieldKey] ?? '';

  // Handle radio change
  const handleChange = (selectedValue: string) => {
    updateFormData(fieldKey, selectedValue);
  };

  const getLayoutClasses = () => {
    if (layout === 'horizontal') {
      return 'flex-row gap-4';
    }
    if (layout === 'vertical') {
      return 'flex-col gap-2';
    }
    // Responsive: vertical on mobile, horizontal on tablet+
    return 'flex-col gap-2 sm:flex-row sm:gap-4'
  }

  return (
    <div className="mb-4">
      {/* Label */}
      <label className="block text-sm font-medium text-text-secondary mb-2">
        {label}
      </label>

      {/* Radio Options */}
      <div className={`flex ${getLayoutClasses()}`}>
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 cursor-pointer group"
          >
            {/* The actual radio input */}
            <input
              type="radio"
              name={fieldKey}  // Groups them together
              value={option.value}
              checked={value === option.value}  // Is this selected?
              onChange={() => handleChange(option.value)}
              className="w-4 h-4 text-primary border-gray-300 focus:ring-primary cursor-pointer accent-primary"
            />

            {/* The label text */}
            <span className="text-sm text-text-secondary group-hover:text-text-primary">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};