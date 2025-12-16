import { FormField } from '../FormField';

export const DentalHistoryForm = () => {
  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold text-gray-800 mb-4">
        Dental History
      </h4>

      <FormField
        label="Previous Dentist"
        fieldKey="previousDentist"
        placeholder="Dr. Name"
      />

      <FormField
        label="Last Dental Visit"
        fieldKey="lastDentalVisit"
        type="date"
      />
    </div>
  );
};