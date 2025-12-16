import { FormField } from '../FormField';
import { SignatureUpload } from '../SignatureUpload';

export const SignaturesForm = () => {
  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold text-gray-800 mb-4">
        Signatures
      </h4>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> I understand that dentistry is not an exact science and that no guarantees can be made.
          I authorize the dentist to proceed with treatment and perform dental restorations & treatments as explained.
        </p>
      </div>

      <FormField
        label="Patient / Parent / Guardian Signature"
        fieldKey="patientSignature"
        placeholder="Signature or name"
      />

      {/* Dentist E-Signature Upload */}
      <SignatureUpload
        label="Dentist E-Signature"
        fieldKey="dentistSignature"
      />

      <FormField
        label="Date Signed"
        fieldKey="signatureDate"
        type="date"
      />

      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <FormField
          label="Additional Notes"
          fieldKey="consentNotes"
          type="textarea"
          placeholder="Any additional consent notes or disclaimers..."
        />
      </div>
    </div>
  );
};