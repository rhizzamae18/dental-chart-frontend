import { FormField } from '../FormField';

export const ConsentProceduresForm = () => {
  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold text-gray-800 mb-4">
        Procedures Consent
      </h4>

      <div className="space-y-3">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700">
            <strong>DRUGS & MEDICATIONS:</strong> Consent for antibiotics, analgesics, and other medications.
          </p>
        </div>

        <FormField 
          label="Initial - Drugs & Medications" 
          fieldKey="drugsInitial" 
          placeholder="Patient initials"
        />
      </div>

      <div className="space-y-3">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700">
            <strong>CHANGES IN TREATMENT PLAN:</strong> I understand that during treatment it may be necessary to change procedures.
          </p>
        </div>

        <FormField 
          label="Initial - Treatment Plan Changes" 
          fieldKey="planChangesInitial" 
          placeholder="Patient initials"
        />
      </div>

      <div className="space-y-3">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700">
            <strong>RADIOGRAPH:</strong> I understand that x-rays may be necessary as part of diagnostic aid.
          </p>
        </div>

        <FormField 
          label="Initial - Radiograph Consent" 
          fieldKey="radiographInitial" 
          placeholder="Patient initials"
        />
      </div>

      <div className="space-y-3">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700">
            <strong>REMOVAL OF TEETH:</strong> I understand alternatives to removing teeth including risks.
          </p>
        </div>

        <FormField 
          label="Initial - Tooth Removal" 
          fieldKey="removalInitial" 
          placeholder="Patient initials"
        />
      </div>

      <div className="space-y-3">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700">
            <strong>CROWNS & BRIDGES:</strong> Preparing a tooth may irritate the nerve tissue.
          </p>
        </div>

        <FormField 
          label="Initial - Crowns & Bridges" 
          fieldKey="crownsInitial" 
          placeholder="Patient initials"
        />
      </div>

      <div className="space-y-3">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700">
            <strong>ENDODONTICS (ROOT CANAL):</strong> I understand there is no guarantee that root canal treatment will save the tooth.
          </p>
        </div>

        <FormField 
          label="Initial - Root Canal" 
          fieldKey="rootCanalInitial" 
          placeholder="Patient initials"
        />
      </div>

      <div className="space-y-3">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700">
            <strong>PERIODONTAL DISEASE:</strong> I understand treatment alternatives to correct periodontal disease.
          </p>
        </div>

        <FormField 
          label="Initial - Periodontal" 
          fieldKey="periodontalInitial" 
          placeholder="Patient initials"
        />
      </div>

      <div className="space-y-3">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700">
            <strong>FILLINGS:</strong> I understand care must be exercised in chewing on fillings.
          </p>
        </div>

        <FormField 
          label="Initial - Fillings" 
          fieldKey="fillingsInitial" 
          placeholder="Patient initials"
        />
      </div>

      <div className="space-y-3">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700">
            <strong>DENTURES:</strong> I understand that wearing dentures can be difficult.
          </p>
        </div>

        <FormField 
          label="Initial - Dentures" 
          fieldKey="denturesInitial" 
          placeholder="Patient initials"
        />
      </div>
    </div>
  );
};