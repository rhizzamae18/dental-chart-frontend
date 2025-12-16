import { useAppStore } from '@/shared/store/useAppStore';

interface CheckboxFieldProps {
    label: string;
    fieldKey: string;
}

export const CheckboxField = ({ label, fieldKey }: CheckboxFieldProps) => {
    const extractedData = useAppStore((state) => state.extractedData);
    const formData = useAppStore((state) => state.formData);
    const updateFormData = useAppStore((state) => state.updateFormData);

    // Get the value: use edited value if exists, otherwise use extracted value
    const isChecked = formData[fieldKey] !== undefined
        ? Boolean(formData[fieldKey])
        : Boolean(extractedData?.[fieldKey]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateFormData(fieldKey, e.target.checked);
    };

    return (
        <div className="flex items-center gap-2">
            <input
                type="checkbox"
                id={fieldKey}
                checked={isChecked}
                onChange={handleChange}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
            />
            <label
                htmlFor={fieldKey}
                className="text-sm font-medium text-gray-700 cursor-pointer select-none"
            >
                {label}
            </label>
        </div>
    );
};
