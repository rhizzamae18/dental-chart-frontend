import { FormField } from '../FormField';
import { RadioField } from '../RadioField';

export const DentalChartForm = () => {
    return (
        <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-800 mb-4">
                Intraoral Examination
            </h4>

            <div className="grid grid-cols-3 gap-4">
                <FormField
                    label="Patient Name"
                    fieldKey="chartPatientName"
                    placeholder="Name"
                />
                <FormField
                    label="Age"
                    fieldKey="chartAge"
                    type="number"
                    placeholder="Age"
                />
                <RadioField
                    label="Gender"
                    fieldKey="chartGender"
                    options={[
                        { label: "Male", value: "M" },
                        { label: "Female", value: "F" },
                    ]}
                />
            </div>

            <FormField
                label="Date of Examination"
                fieldKey="examinationDate"
                type="date"
            />

            <div className="border-t border-gray-200 pt-4 mt-6">
                <h5 className="text-sm font-semibold text-gray-700 mb-3">
                    Tooth Conditions & Status
                </h5>

                <FormField
                    label="Present Teeth"
                    fieldKey="presentTeeth"
                    type="textarea"
                    placeholder="List tooth numbers that are present..."
                />

                <FormField
                    label="Decayed (Caries)"
                    fieldKey="decayedTeeth"
                    type="textarea"
                    placeholder="List tooth numbers with decay..."
                />

                <FormField
                    label="Missing Teeth"
                    fieldKey="missingTeeth"
                    type="textarea"
                    placeholder="List tooth numbers that are missing..."
                />

                <FormField
                    label="Impacted Teeth"
                    fieldKey="impactedTeeth"
                    placeholder="List impacted tooth numbers..."
                />

                <FormField
                    label="Root Fragments"
                    fieldKey="rootFragments"
                    placeholder="List tooth numbers with root fragments..."
                />
            </div>

            <div className="border-t border-gray-200 pt-4 mt-6">
                <h5 className="text-sm font-semibold text-gray-700 mb-3">
                    Restorations & Prosthetics
                </h5>

                <FormField
                    label="Amalgam Filling"
                    fieldKey="amalgamFilling"
                    placeholder="Tooth numbers with amalgam..."
                />

                <FormField
                    label="Composite Filling"
                    fieldKey="compositeFilling"
                    placeholder="Tooth numbers with composite..."
                />

                <FormField
                    label="Jacket Crown"
                    fieldKey="jacketCrown"
                    placeholder="Tooth numbers with jacket crown..."
                />

                <FormField
                    label="Attachments"
                    fieldKey="attachments"
                    placeholder="List attachments..."
                />

                <FormField
                    label="Pontic"
                    fieldKey="pontic"
                    placeholder="Bridge pontic locations..."
                />

                <FormField
                    label="Inlay / Implant"
                    fieldKey="inlayImplant"
                    placeholder="Tooth numbers with inlay/implant..."
                />

                <FormField
                    label="Sealants"
                    fieldKey="sealants"
                    placeholder="Tooth numbers with sealants..."
                />

                <FormField
                    label="Removable Denture"
                    fieldKey="removableDenture"
                    placeholder="Upper/Lower/Both..."
                />
            </div>

            <div className="border-t border-gray-200 pt-4 mt-6">
                <h5 className="text-sm font-semibold text-gray-700 mb-3">
                    Surgery & X-rays
                </h5>

                <FormField
                    label="Extraction Due to Caries"
                    fieldKey="extractionCaries"
                    placeholder="Tooth numbers..."
                />

                <FormField
                    label="Extraction Due to Other Causes"
                    fieldKey="extractionOther"
                    placeholder="Tooth numbers and reason..."
                />

                <FormField
                    label="X-ray Taken"
                    fieldKey="xrayTaken"
                    placeholder="Periapical, Panoramic, Cephalometric, Occlusal..."
                />
            </div>
        </div>
    );
};