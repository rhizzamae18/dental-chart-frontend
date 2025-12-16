import { FormField } from '../FormField';
import { RadioField } from '../RadioField';

export const TreatmentRecordsForm = () => {
    return (
        <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-800 mb-4">
                Treatment Record
            </h4>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <FormField
                    label="Patient Name"
                    fieldKey="treatmentPatientName"
                    placeholder="Name"
                />
                <FormField
                    label="Age"
                    fieldKey="treatmentAge"
                    type="number"
                    placeholder="Age"
                />
                <RadioField
                    label="Gender"
                    fieldKey="treatmentGender"
                    options={[
                        { label: "Male", value: "M" },
                        { label: "Female", value: "F" },
                    ]}
                />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                <p className="text-sm text-blue-800">
                    <strong>Note:</strong> This form records all dental treatments, procedures, and payments.
                    Add entries for each treatment session.
                </p>
            </div>

            <div className="border-t border-gray-200 pt-4">
                <h5 className="text-sm font-semibold text-gray-700 mb-3">
                    Treatment Entry
                </h5>

                <FormField
                    label="Date"
                    fieldKey="treatmentDate"
                    type="date"
                />

                <FormField
                    label="Tooth No./s"
                    fieldKey="toothNumbers"
                    placeholder="e.g., 11, 12, 13 or 11-16"
                />

                <FormField
                    label="Procedure"
                    fieldKey="procedure"
                    type="textarea"
                    placeholder="Describe the dental procedure performed..."
                />

                <FormField
                    label="Dentist/s"
                    fieldKey="dentistName"
                    placeholder="Name of treating dentist"
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        label="Amount Charged"
                        fieldKey="amountCharged"
                        type="number"
                        placeholder="0.00"
                    />

                    <FormField
                        label="Amount Paid"
                        fieldKey="amountPaid"
                        type="number"
                        placeholder="0.00"
                    />
                </div>

                <FormField
                    label="Balance"
                    fieldKey="balance"
                    type="number"
                    placeholder="Remaining balance..."
                />

                <FormField
                    label="Next Appointment"
                    fieldKey="nextAppointment"
                    type="date"
                />
            </div>

            <div className="border-t border-gray-200 pt-4 mt-6">
                <h5 className="text-sm font-semibold text-gray-700 mb-3">
                    Additional Treatment Notes
                </h5>

                <FormField
                    label="Treatment Notes"
                    fieldKey="treatmentNotes"
                    type="textarea"
                    placeholder="Any additional notes about the treatment, patient reactions, follow-up needed, etc..."
                />
            </div>
        </div>
    );
};