import { FormField } from '../FormField';

export const ConsentTreatmentForm = () => {
  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold text-gray-800 mb-4">
        Treatment Consent
      </h4>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-700 mb-2">
          <strong>TREATMENT TO BE DONE:</strong> I understand and consent to have any treatment done by the dentist.
        </p>
      </div>

      <FormField 
        label="Treatment Description" 
        fieldKey="treatmentDescription" 
        type="textarea"
        placeholder="Describe the treatment to be performed..."
      />

      <FormField 
        label="Risks & Benefits Explained" 
        fieldKey="risksExplained" 
        type="textarea"
        placeholder="Patient understands risks and benefits..."
      />

      <FormField 
        label="Initial - Treatment Consent" 
        fieldKey="treatmentInitial" 
        placeholder="Patient initials"
      />
    </div>
  );
};