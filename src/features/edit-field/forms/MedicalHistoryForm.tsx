import { FormField } from '../FormField';
import { RadioField } from '../RadioField';
import { CheckboxField } from '../CheckboxField';

export const MedicalHistoryForm = () => {
    return (
        <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-800 mb-4">
                Medical History
            </h4>

            <FormField
                label="Name of Physician"
                fieldKey="physicianName"
                placeholder="Dr. Name"
            />

            <FormField
                label="Specialty (if applicable)"
                fieldKey="physicianSpecialty"
                placeholder="Specialty"
            />

            <FormField
                label="Office Address"
                fieldKey="physicianAddress"
                type="textarea"
                placeholder="Physician's office address"
            />

            <FormField
                label="Office Number"
                fieldKey="physicianPhone"
                placeholder="Contact number"
            />

            <div className="border-t border-gray-200 pt-4 mt-6">
                <h5 className="text-sm font-semibold text-gray-700 mb-3">
                    Health Questions
                </h5>

                <RadioField
                    label="Are you in good health?"
                    fieldKey="goodHealth"
                    options={[
                        { label: "Yes", value: "Yes" },
                        { label: "No", value: "No" },
                    ]}
                    layout='vertical'
                />

                <RadioField
                    label="Are you under medical treatment now?"
                    fieldKey="underTreatment"
                    options={[
                        { label: "Yes", value: "Yes" },
                        { label: "No", value: "No" },
                    ]}
                    layout='vertical'
                />

                <FormField
                    label="If so, what is the condition being treated?"
                    fieldKey="treatmentCondition"
                    type="textarea"
                    placeholder="Describe condition..."
                />

                <RadioField
                    label="Have you ever had serious illness or surgical operation?"
                    fieldKey="seriousIllness"
                    options={[
                        { label: "Yes", value: "Yes" },
                        { label: "No", value: "No" },
                    ]}
                    layout='vertical'
                />

                <FormField
                    label="If so, what illness or operation?"
                    fieldKey="illnessDetails"
                    type="textarea"
                    placeholder="Describe illness or operation..."
                />

                <RadioField
                    label="Have you ever been hospitalized?"
                    fieldKey="hospitalized"
                    options={[
                        { label: "Yes", value: "Yes" },
                        { label: "No", value: "No" },
                    ]}
                    layout='vertical'
                />

                <FormField
                    label="If so, when and why?"
                    fieldKey="hospitalizationDetails"
                    type="textarea"
                    placeholder="When and why were you hospitalized..."
                />

                <RadioField
                    label="Are you taking any prescription/non-prescription medication?"
                    fieldKey="medications"
                    options={[
                        { label: "Yes", value: "Yes" },
                        { label: "No", value: "No" },
                    ]}
                    layout='vertical'
                />

                <FormField
                    label="If so, please specify"
                    fieldKey="medicationsList"
                    type="textarea"
                    placeholder="List medications..."
                />

                <RadioField
                    label="Do you use tobacco products?"
                    fieldKey="tobacco"
                    options={[
                        { label: "Yes", value: "Yes" },
                        { label: "No", value: "No" },
                    ]}
                    layout='vertical'
                />

                <RadioField
                    label="Do you use alcohol, cocaine or other dangerous drugs?"
                    fieldKey="substanceUse"
                    options={[
                        { label: "Yes", value: "Yes" },
                        { label: "No", value: "No" },
                    ]}
                    layout='vertical'
                />
            </div>

            <div className="border-t border-gray-200 pt-4 mt-6">
                <h5 className="text-sm font-semibold text-gray-700 mb-3">
                    Allergies
                </h5>

                <h6 className="text-sm font-medium text-gray-700 mb-3">
                    Are you allergic to any of the following?
                </h6>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-4">
                    <CheckboxField label="Local Anesthetic" fieldKey="allergy_localAnesthetic" />
                    <CheckboxField label="Penicillin" fieldKey="allergy_penicillin" />
                    <CheckboxField label="Antibiotics" fieldKey="allergy_antibiotics" />
                    <CheckboxField label="Sulfa Drugs" fieldKey="allergy_sulfaDrugs" />
                    <CheckboxField label="Aspirin" fieldKey="allergy_aspirin" />
                    <CheckboxField label="Latex" fieldKey="allergy_latex" />
                </div>

                <FormField
                    label="Other Allergies (please specify)"
                    fieldKey="allergy_others"
                    type="textarea"
                    placeholder="List any other allergies..."
                />

                <FormField
                    label="Bleeding Time"
                    fieldKey="bleedingTime"
                    placeholder="Enter bleeding time"
                />
            </div>

            <div className="border-t border-gray-200 pt-4 mt-6">
                <h5 className="text-sm font-semibold text-gray-700 mb-3">
                    For Women Only
                </h5>

                <RadioField
                    label="Are you pregnant?"
                    fieldKey="women_pregnant"
                    options={[
                        { label: "Yes", value: "Yes" },
                        { label: "No", value: "No" },
                        { label: "N/A", value: "N/A" },
                    ]}
                    layout='vertical'
                />

                <RadioField
                    label="Are you nursing?"
                    fieldKey="women_nursing"
                    options={[
                        { label: "Yes", value: "Yes" },
                        { label: "No", value: "No" },
                    ]}
                    layout='vertical'
                />

                <RadioField
                    label="Are you taking birth control pills?"
                    fieldKey="women_takingBirthControl"
                    options={[
                        { label: "Yes", value: "Yes" },
                        { label: "No", value: "No" },
                    ]}
                    layout='vertical'
                />
            </div>

            <div className="border-t border-gray-200 pt-4 mt-6">
                <h5 className="text-sm font-semibold text-gray-700 mb-3">
                    Medical Conditions
                </h5>

                <FormField
                    label="Blood Type"
                    fieldKey="bloodType"
                    placeholder="A+, A–, B+, B–, AB+, AB–, O+, O–"
                />

                <FormField
                    label="Blood Pressure"
                    fieldKey="bloodPressure"
                    placeholder="e.g., 120/80"
                />

                <h6 className="text-sm font-medium text-gray-700 mb-3">
                    Do you have or have you had any of the following?
                </h6>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    <CheckboxField label="High Blood Pressure" fieldKey="condition_highBloodPressure" />
                    <CheckboxField label="Low Blood Pressure" fieldKey="condition_lowBloodPressure" />
                    <CheckboxField label="Epilepsy/Convulsions" fieldKey="condition_epilepsyConvulsions" />
                    <CheckboxField label="AIDS/HIV Infection" fieldKey="condition_aidsHivInfection" />
                    <CheckboxField label="Sexually Transmitted Disease" fieldKey="condition_sexuallyTransmittedDisease" />
                    <CheckboxField label="Stomach Troubles/Ulcers" fieldKey="condition_stomachTroublesUlcers" />
                    <CheckboxField label="Fainting/Seizure" fieldKey="condition_faintingSeizure" />
                    <CheckboxField label="Rapid Weight Loss" fieldKey="condition_rapidWeightLoss" />
                    <CheckboxField label="Radiation Therapy" fieldKey="condition_radiationTherapy" />
                    <CheckboxField label="Joint Replacement/Implant" fieldKey="condition_jointReplacementImplant" />
                    <CheckboxField label="Heart Surgery" fieldKey="condition_heartSurgery" />
                    <CheckboxField label="Heart Attack" fieldKey="condition_heartAttack" />
                    <CheckboxField label="Thyroid Problem" fieldKey="condition_thyroidProblem" />
                    <CheckboxField label="Heart Disease" fieldKey="condition_heartDisease" />
                    <CheckboxField label="Heart Murmur" fieldKey="condition_heartMurmur" />
                    <CheckboxField label="Hepatitis/Liver Disease" fieldKey="condition_hepatitisLiverDisease" />
                    <CheckboxField label="Rheumatic Fever" fieldKey="condition_rheumaticFever" />
                    <CheckboxField label="Hay Fever/Allergies" fieldKey="condition_hayFeverAllergies" />
                    <CheckboxField label="Respiratory Problems" fieldKey="condition_respiratoryProblems" />
                    <CheckboxField label="Hepatitis/Jaundice" fieldKey="condition_hepatitisJaundice" />
                    <CheckboxField label="Tuberculosis" fieldKey="condition_tuberculosis" />
                    <CheckboxField label="Swollen Ankles" fieldKey="condition_swollenAnkles" />
                    <CheckboxField label="Kidney Disease" fieldKey="condition_kidneyDisease" />
                    <CheckboxField label="Diabetes" fieldKey="condition_diabetes" />
                    <CheckboxField label="Chest Pain" fieldKey="condition_chestPain" />
                    <CheckboxField label="Stroke" fieldKey="condition_stroke" />
                    <CheckboxField label="Cancer/Tumors" fieldKey="condition_cancerTumors" />
                    <CheckboxField label="Anemia" fieldKey="condition_anemia" />
                    <CheckboxField label="Angina" fieldKey="condition_angina" />
                    <CheckboxField label="Asthma" fieldKey="condition_asthma" />
                    <CheckboxField label="Emphysema" fieldKey="condition_emphysema" />
                    <CheckboxField label="Bleeding Problems" fieldKey="condition_bleedingProblems" />
                    <CheckboxField label="Blood Diseases" fieldKey="condition_bloodDiseases" />
                    <CheckboxField label="Head Injuries" fieldKey="condition_headInjuries" />
                    <CheckboxField label="Arthritis/Rheumatism" fieldKey="condition_arthritisRheumatism" />
                </div>

                <FormField
                    label="Others (please specify)"
                    fieldKey="condition_other"
                    type="textarea"
                    placeholder="Any other medical conditions..."
                />
            </div>
        </div>
    );
};