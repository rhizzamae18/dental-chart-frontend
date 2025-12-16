import { FormField } from '../FormField';
import { RadioField } from '../RadioField';

export const PatientInfoForm = () => {
  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold text-gray-800 mb-4">
        Patient Information Record
      </h4>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Last Name"
          fieldKey="lastName"
          placeholder="Enter last name"
        // required

        />
        <FormField
          label="First Name"
          fieldKey="firstName"
          placeholder="Enter first name"
        />
      </div>

      <FormField
        label="Middle Name"
        fieldKey="middleName"
        placeholder="Enter middle name"
      />

      <div className="grid grid-cols-3 gap-4">
        <FormField
          label="Birthdate"
          fieldKey="birthdate"
          type="date"
        />
        <FormField
          label="Age"
          fieldKey="age"
          type="number"
          placeholder="Age"
        />
        <RadioField
          label="Sex"
          fieldKey="sex"
          options={[
            { label: "Male", value: "M" },
            { label: "Female", value: "F" }
          ]}
        />
      </div>

      <FormField
        label="Nickname"
        fieldKey="nickname"
        placeholder="Enter nickname"
      />

      <FormField
        label="Religion"
        fieldKey="religion"
        placeholder="Enter religion"
      />

      <FormField
        label="Nationality"
        fieldKey="nationality"
        placeholder="Enter nationality"
      />

      <FormField
        label="Home Address"
        fieldKey="homeAddress"
        type="textarea"
        placeholder="Enter complete home address"
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Home Number"
          fieldKey="homePhone"
          placeholder="Home phone number"
        />
        <FormField
          label="Office Number"
          fieldKey="officePhone"
          placeholder="Office phone number"
        />
      </div>

      <FormField
        label="Cell/Mobile Number"
        fieldKey="mobileNumber"
        placeholder="Mobile number"
      />

      <FormField
        label="Fax Number"
        fieldKey="faxNumber"
        placeholder="Fax number"
      />

      <FormField
        label="Email Address"
        fieldKey="email"
        placeholder="Email address"
      />

      <FormField
        label="Occupation"
        fieldKey="occupation"
        placeholder="Enter occupation"
      />

      <FormField
        label="Dental Insurance"
        fieldKey="dentalInsurance"
        placeholder="Insurance provider"
      />

      <FormField
        label="Effective Date"
        fieldKey="effectiveDate"
        type="date"
      />

      <h4 className="text-md font-semibold text-gray-800 mt-6 mb-4">
        For Minors
      </h4>

      <FormField
        label="Parent/Guardian's Name"
        fieldKey="guardianName"
        placeholder="Enter guardian's name"
      />

      <FormField
        label="Guardian's Occupation"
        fieldKey="guardianOccupation"
        placeholder="Enter occupation"
      />

      <FormField
        label="Whom may we thank for referring you?"
        fieldKey="referredBy"
        placeholder="Referral source"
      />

      <FormField
        label="What is your reason for dental consultation?"
        fieldKey="consultationReason"
        type="textarea"
        placeholder="Describe your dental concerns..."
      />
    </div>
  );
};