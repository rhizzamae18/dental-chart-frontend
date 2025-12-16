import { FormField } from '../FormField';
import { RadioField } from '../RadioField';

export const ClinicalFindingsForm = () => {
  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold text-gray-800 mb-4">
        Clinical Findings
      </h4>

      <div className="border-b border-gray-200 pb-4">
        <h5 className="text-sm font-semibold text-gray-700 mb-3">
          Periodontal Screening
        </h5>
        
        {/* ✅ Changed to RadioField */}
        <RadioField 
          label="Gingivitis" 
          fieldKey="gingivitis" 
          options={[
            { label: "Present", value: "present" },
            { label: "Absent", value: "absent" },
            { label: "Unknown", value: "unknown" }
          ]}
        />

        <FormField 
          label="If present, describe location and severity" 
          fieldKey="gingivitisDetails" 
          placeholder="e.g., Generalized mild, localized severe..."
        />

        {/* ✅ Changed to RadioField */}
        <RadioField 
          label="Early Periodontitis" 
          fieldKey="earlyPeriodontitis" 
          options={[
            { label: "Present", value: "present" },
            { label: "Absent", value: "absent" },
            { label: "Unknown", value: "unknown" }
          ]}
        />

        <FormField 
          label="If present, describe location and severity" 
          fieldKey="earlyPeriodontitisDetails" 
          placeholder="Location and severity..."
        />

        {/* ✅ Changed to RadioField */}
        <RadioField 
          label="Moderate Periodontitis" 
          fieldKey="moderatePeriodontitis" 
          options={[
            { label: "Present", value: "present" },
            { label: "Absent", value: "absent" },
            { label: "Unknown", value: "unknown" }
          ]}
        />

        <FormField 
          label="If present, describe location and severity" 
          fieldKey="moderatePeriodontitisDetails" 
          placeholder="Location and severity..."
        />

        {/* ✅ Changed to RadioField */}
        <RadioField 
          label="Advanced Periodontitis" 
          fieldKey="advancedPeriodontitis" 
          options={[
            { label: "Present", value: "present" },
            { label: "Absent", value: "absent" },
            { label: "Unknown", value: "unknown" }
          ]}
        />

        <FormField 
          label="If present, describe location and severity" 
          fieldKey="advancedPeriodontitisDetails" 
          placeholder="Location and severity..."
        />
      </div>

      <div className="border-b border-gray-200 pb-4">
        <h5 className="text-sm font-semibold text-gray-700 mb-3">
          Occlusion
        </h5>
        
        <FormField 
          label="Class (Molar)" 
          fieldKey="occlusionClass" 
          placeholder="Class I, II, III..."
        />

        <FormField 
          label="Overjet" 
          fieldKey="overjet" 
          placeholder="Measurement in mm..."
        />

        <FormField 
          label="Overbite" 
          fieldKey="overbite" 
          placeholder="Measurement or percentage..."
        />

        <FormField 
          label="Midline Deviation" 
          fieldKey="midlineDeviation" 
          placeholder="Left/Right, measurement..."
        />

        <FormField 
          label="Crossbite" 
          fieldKey="crossbite" 
          placeholder="Location..."
        />
      </div>

      <div className="border-b border-gray-200 pb-4">
        <h5 className="text-sm font-semibold text-gray-700 mb-3">
          Appliances
        </h5>
        
        <FormField 
          label="Orthodontic" 
          fieldKey="orthodontic" 
          placeholder="Type of orthodontic appliance..."
        />

        <FormField 
          label="Stayplate" 
          fieldKey="stayplate" 
          placeholder="Location..."
        />

        <FormField 
          label="Others" 
          fieldKey="otherAppliances" 
          placeholder="Other appliances..."
        />
      </div>

      <div>
        <h5 className="text-sm font-semibold text-gray-700 mb-3">
          TMD (Temporomandibular Disorder)
        </h5>
        
        {/* ✅ Changed to RadioField */}
        <RadioField 
          label="Clenching" 
          fieldKey="clenching" 
          options={[
            { label: "Present", value: "present" },
            { label: "Absent", value: "absent" },
            { label: "Unknown", value: "unknown" }
          ]}
        />

        <FormField 
          label="If present, describe frequency" 
          fieldKey="clenchingDetails" 
          placeholder="e.g., Frequent, occasional, during sleep..."
        />

        {/* ✅ Changed to RadioField */}
        <RadioField 
          label="Clicking" 
          fieldKey="clicking" 
          options={[
            { label: "Present", value: "present" },
            { label: "Absent", value: "absent" },
            { label: "Unknown", value: "unknown" }
          ]}
        />

        <FormField 
          label="If present, describe location" 
          fieldKey="clickingDetails" 
          placeholder="e.g., Left TMJ, right TMJ, bilateral..."
        />

        {/* ✅ Changed to RadioField */}
        <RadioField 
          label="Trismus (Limited Jaw Opening)" 
          fieldKey="trismus" 
          options={[
            { label: "Present", value: "present" },
            { label: "Absent", value: "absent" },
            { label: "Unknown", value: "unknown" }
          ]}
        />

        <FormField 
          label="If present, describe severity" 
          fieldKey="trismusDetails" 
          placeholder="e.g., Mild, moderate, severe..."
        />

        {/* ✅ Changed to RadioField */}
        <RadioField 
          label="Muscle Spasm" 
          fieldKey="muscleSpasm" 
          options={[
            { label: "Present", value: "present" },
            { label: "Absent", value: "absent" },
            { label: "Unknown", value: "unknown" }
          ]}
        />

        <FormField 
          label="If present, describe location" 
          fieldKey="muscleSpasmDetails" 
          placeholder="e.g., Masseter, temporalis, pterygoid..."
        />
      </div>
    </div>
  );
};