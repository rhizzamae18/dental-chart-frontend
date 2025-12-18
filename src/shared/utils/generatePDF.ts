import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import pdaLogo from '@/assets/images/logo/logo.png';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateDentalChartPDF = (formData: Record<string, any>, extractedData: Record<string, any>) => {
  // Merge extracted and form data, prioritizing form data
  const data = { ...extractedData, ...formData };

  // Helper to get data value safely with fallback for API field names
  const getData = (key: string) => {
    // Field mapping for API keys
    const fieldMap: Record<string, string[]> = {
      'homeNumber': ['homeNumber', 'homeNo', 'homePhone'],
      'officeNumber': ['officeNumber', 'officeNo', 'officePhone'],
      'mobileNumber': ['mobileNumber', 'cellMobileNo', 'cellphone'],
      'faxNumber': ['faxNumber', 'faxNo'],
      'email': ['email', 'emailAddress'],
      'guardianName': ['guardianName', 'parentGuardianName'],
      'guardianOccupation': ['guardianOccupation', 'parentOccupation'],
      // Medical history questions
      'goodHealth': ['goodHealth'],
      'underTreatment': ['underTreatment', 'underMedicalTreatment'],
      'treatmentCondition': ['treatmentCondition', 'medicalConditionBeingTreated'],
      'seriousIllness': ['seriousIllness', 'seriousIllnessSurgery'],
      'illnessDetails': ['illnessDetails', 'illnessOrOperationDetails'],
      'hospitalized': ['hospitalized'],
      'hospitalizationDetails': ['hospitalizationDetails'],
      'takingMedication': ['takingMedication', 'medications'],
      'medications': ['medications', 'takingMedication'],
      'medicationsList': ['medicationsList', 'medicationDetails'],
      'tobacco': ['tobacco', 'useTobacco'],
      'dangerousDrugs': ['dangerousDrugs', 'substanceUse', 'useAlcoholDrugs'],
      // Allergies
      'allergyAnesthetic': ['allergyAnesthetic', 'allergy_localAnesthetic', 'localAnesthetic'],
      'allergyPenicillin': ['allergyPenicillin', 'allergy_penicillin', 'penicillin'],
      'allergyAntibiotics': ['allergyAntibiotics', 'allergy_antibiotics', 'antibiotics'],
      'allergyAspirin': ['allergyAspirin', 'allergy_aspirin', 'aspirin'],
      'allergyLatex': ['allergyLatex', 'allergy_latex', 'latex'],
      'allergySulfa': ['allergySulfa', 'allergy_sulfaDrugs', 'sulfaDrugs'],
      'allergyOthers': ['allergyOthers', 'allergy_others', 'others'],
      // Women's health
      'pregnant': ['pregnant', 'women_pregnant'],
      'nursing': ['nursing', 'women_nursing'],
      'birthControl': ['birthControl', 'women_takingBirthControl', 'takingBirthControl', 'women_birthControl'],
    };

    // Check if we have a mapping for this key
    const possibleKeys = fieldMap[key] || [key];
    for (const k of possibleKeys) {
      if (data[k] !== undefined && data[k] !== null && data[k] !== '') {
        return data[k];
      }
    }
    return '';
  };

  // Helper to check if value is yes/true
  const isYes = (key: string) => {
    const value = getData(key);
    return value === 'yes' || value === 'Yes' || value === 'YES' || value === true || value === 'true';
  };

  // Helper to check if value is no/false
  const isNo = (key: string) => {
    const value = getData(key);
    return value === 'no' || value === 'No' || value === 'NO' || value === false || value === 'false';
  };

  const doc = new jsPDF('p', 'mm', 'letter');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 13;

  // Helper to draw PDA header for Page 1
  const drawPDAHeaderPage1 = () => {
    // Add PDA Logo (top-left) - circular
    try {
      doc.addImage(pdaLogo, 'PNG', margin + 5, 12, 28, 28);
    } catch (error) {
      // Fallback: Draw circle placeholder
      doc.setDrawColor(150, 100, 180);
      doc.setLineWidth(1.5);
      doc.circle(margin + 19, 26, 13);
    }

    // "PHILIPPINE DENTAL ASSOCIATION" text
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PHILIPPINE DENTAL ASSOCIATION', margin + 45, 20);

    // Blue rounded rectangle for "DENTAL CHART"
    doc.setFillColor(52, 152, 219);
    doc.roundedRect(margin + 45, 25, 70, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('DENTAL CHART', margin + 80, 31, { align: 'center' });

    // Photo box (top-right)
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(pageWidth - margin - 48, 12, 48, 28);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text('(Photo)', pageWidth - margin - 24, 27, { align: 'center' });

    doc.setTextColor(0, 0, 0);
  };

  // Helper for Yes/No checkboxes
  const drawYesNoCheckbox = (x: number, y: number, yesChecked: boolean, noChecked: boolean) => {
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.3);

    // Yes checkbox
    doc.rect(x, y, 3, 3);
    if (yesChecked) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('X', x + 0.5, y + 2.3);
    }
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Yes', x + 4, y + 2.3);

    // No checkbox
    doc.rect(x + 12, y, 3, 3);
    if (noChecked) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('X', x + 12.5, y + 2.3);
    }
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('No', x + 16, y + 2.3);
  };

  // Helper for parenthesis checkbox
  const drawParenCheckbox = (label: string, checked: boolean, x: number, y: number) => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('(', x, y);
    if (checked) {
      doc.setFont('helvetica', 'bold');
      doc.text('X', x + 1, y);
    }
    doc.setFont('helvetica', 'normal');
    doc.text(')', x + 2.5, y);
    doc.text(label, x + 4.5, y);
  };

  // ============================
  // PAGE 1: PATIENT INFORMATION RECORD
  // ============================
  drawPDAHeaderPage1();
  let yPos = 46;

  // Section title
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('PATIENT INFORMATION RECORD', margin, yPos);
  yPos += 6;

  // Name row
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Name:', margin, yPos);

  // Draw underlines for name fields  
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  const nameStartX = margin + 13;
  const nameWidth1 = 50;
  const nameWidth2 = 52;
  // nameWidth3 reserved for future use
  // const nameWidth3 = 45;

  doc.line(nameStartX, yPos + 1, nameStartX + nameWidth1, yPos + 1);
  doc.line(nameStartX + nameWidth1 + 3, yPos + 1, nameStartX + nameWidth1 + nameWidth2 + 3, yPos + 1);
  doc.line(nameStartX + nameWidth1 + nameWidth2 + 6, yPos + 1, pageWidth - margin, yPos + 1);

  // Write actual names
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  const lastName = getData('lastName');
  const firstName = getData('firstName');
  const middleName = getData('middleName');
  doc.text(lastName, nameStartX + 2, yPos - 0.5);
  doc.text(firstName, nameStartX + nameWidth1 + 5, yPos - 0.5);
  doc.text(middleName, nameStartX + nameWidth1 + nameWidth2 + 8, yPos - 0.5);

  // Labels below underlines
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('(Last)', nameStartX + 18, yPos + 4);
  doc.text('(First)', nameStartX + nameWidth1 + 22, yPos + 4);
  doc.text('(Middle)', nameStartX + nameWidth1 + nameWidth2 + 16, yPos + 4);
  yPos += 8;

  // Birthdate, Age, Sex, Nickname row
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);

  doc.text('Birthdate(mm/dd/yy):', margin, yPos);
  doc.line(margin + 37, yPos + 1, margin + 70, yPos + 1);
  doc.text(getData('birthdate'), margin + 38, yPos - 0.5);

  doc.text('Age:', margin + 75, yPos);
  doc.line(margin + 85, yPos + 1, margin + 94, yPos + 1);
  doc.text(getData('age').toString(), margin + 86, yPos - 0.5);

  doc.text('Sex: M/F', margin + 99, yPos);
  const sexValue = getData('sex').toString().toUpperCase();
  doc.rect(margin + 116, yPos - 3, 3, 3);
  if (sexValue === 'M' || sexValue === 'MALE') {
    doc.setFont('helvetica', 'bold');
    doc.text('X', margin + 116.5, yPos - 0.5);
    doc.setFont('helvetica', 'normal');
  }
  doc.rect(margin + 122, yPos - 3, 3, 3);
  if (sexValue === 'F' || sexValue === 'FEMALE') {
    doc.setFont('helvetica', 'bold');
    doc.text('X', margin + 122.5, yPos - 0.5);
    doc.setFont('helvetica', 'normal');
  }

  doc.text('Nickname:', margin + 129, yPos);
  doc.line(margin + 147, yPos + 1, pageWidth - margin, yPos + 1);
  doc.text(getData('nickname'), margin + 148, yPos - 0.5);
  yPos += 6;

  // Religion, Nationality row
  doc.text('Religion:', margin, yPos);
  doc.line(margin + 20, yPos + 1, margin + 85, yPos + 1);
  doc.text(getData('religion'), margin + 21, yPos - 0.5);

  doc.text('Nationality:', margin + 90, yPos);
  doc.line(margin + 109, yPos + 1, pageWidth - margin, yPos + 1);
  doc.text(getData('nationality'), margin + 110, yPos - 0.5);
  yPos += 6;

  // Home Address and Home No row
  doc.text('Home Address:', margin, yPos);
  doc.line(margin + 29, yPos + 1, margin + 125, yPos + 1);
  doc.text(getData('homeAddress'), margin + 30, yPos - 0.5);

  doc.text('Home No.:', margin + 130, yPos);
  doc.line(margin + 150, yPos + 1, pageWidth - margin, yPos + 1);
  doc.text(getData('homeNumber'), margin + 151, yPos - 0.5);
  yPos += 6;

  // Occupation and Office No row
  doc.text('Occupation:', margin, yPos);
  doc.line(margin + 25, yPos + 1, margin + 95, yPos + 1);
  doc.text(getData('occupation'), margin + 26, yPos - 0.5);

  doc.text('Office No.:', margin + 100, yPos);
  doc.line(margin + 120, yPos + 1, pageWidth - margin, yPos + 1);
  doc.text(getData('officeNumber'), margin + 121, yPos - 0.5);
  yPos += 6;

  // Dental Insurance and Fax No row
  doc.text('Dental Insurance:', margin, yPos);
  doc.line(margin + 35, yPos + 1, margin + 95, yPos + 1);
  doc.text(getData('dentalInsurance'), margin + 36, yPos - 0.5);

  doc.text('Fax No.:', margin + 100, yPos);
  doc.line(margin + 118, yPos + 1, pageWidth - margin, yPos + 1);
  doc.text(getData('faxNumber'), margin + 119, yPos - 0.5);
  yPos += 6;

  // Effective Date and Cell/Mobile No row
  doc.text('Effective Date:', margin, yPos);
  doc.line(margin + 32, yPos + 1, margin + 95, yPos + 1);
  doc.text(getData('effectiveDate'), margin + 33, yPos - 0.5);

  doc.text('Cell/Mobile No.:', margin + 100, yPos);
  doc.line(margin + 130, yPos + 1, pageWidth - margin, yPos + 1);
  doc.text(getData('mobileNumber'), margin + 131, yPos - 0.5);
  yPos += 8;

  // For minors section (including Email Address)
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text('For minors:', margin, yPos);
  doc.text('Email Add.:', margin + 100, yPos);
  doc.line(margin + 122, yPos + 1, pageWidth - margin, yPos + 1);
  doc.text(getData('email'), margin + 123, yPos - 0.5);
  yPos += 6;

  // For minors section
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('For minors:', margin, yPos);
  yPos += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text("Parent/ Guardian's Name:", margin, yPos);
  doc.line(margin + 48, yPos + 1, pageWidth - margin, yPos + 1);
  doc.text(getData('guardianName'), margin + 49, yPos - 0.5);
  yPos += 6;

  doc.text('Occupation:', margin, yPos);
  doc.line(margin + 25, yPos + 1, pageWidth - margin, yPos + 1);
  doc.text(getData('guardianOccupation'), margin + 26, yPos - 0.5);
  yPos += 6;

  doc.text('Whom may we thank for referring you?', margin, yPos);
  doc.line(margin + 72, yPos + 1, pageWidth - margin, yPos + 1);
  doc.text(getData('referredBy'), margin + 73, yPos - 0.5);
  yPos += 6;

  doc.text('What is your reason for dental consultation?', margin, yPos);
  doc.line(margin + 88, yPos + 1, pageWidth - margin, yPos + 1);
  doc.text(getData('consultationReason'), margin + 89, yPos - 0.5);
  yPos += 8;

  // Dental History Section
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('DENTAL HISTORY', margin, yPos);
  yPos += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Previous Dentist: Dr.', margin, yPos);
  doc.line(margin + 40, yPos + 1, margin + 105, yPos + 1);
  doc.text(getData('previousDentist'), margin + 41, yPos - 0.5);

  doc.text('Last Dental visit:', margin + 110, yPos);
  doc.line(margin + 137, yPos + 1, pageWidth - margin, yPos + 1);
  doc.text(getData('lastDentalVisit'), margin + 138, yPos - 0.5);
  yPos += 8;

  // Medical History Section
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('MEDICAL HISTORY', margin, yPos);
  yPos += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Name of Physician: Dr.', margin, yPos);
  doc.line(margin + 45, yPos + 1, margin + 105, yPos + 1);
  doc.text(getData('physicianName'), margin + 46, yPos - 0.5);

  doc.text('Specialty, if applicable:', margin + 110, yPos);
  doc.line(margin + 147, yPos + 1, pageWidth - margin, yPos + 1);
  doc.text(getData('physicianSpecialty'), margin + 148, yPos - 0.5);
  yPos += 6;

  doc.text('Office Address:', margin, yPos);
  doc.line(margin + 30, yPos + 1, margin + 105, yPos + 1);
  doc.text(getData('physicianAddress'), margin + 31, yPos - 0.5);

  doc.text('Office Number:', margin + 110, yPos);
  doc.line(margin + 137, yPos + 1, pageWidth - margin, yPos + 1);
  doc.text(getData('physicianPhone'), margin + 138, yPos - 0.5);
  yPos += 8;

  // Medical Questions 1-5 (Page 1 only)
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);

  // Question 1
  doc.text('1. Are you in good health?', margin, yPos);
  drawYesNoCheckbox(pageWidth - margin - 27, yPos - 2, isYes('goodHealth'), isNo('goodHealth'));
  yPos += 4.5;

  // Question 2
  doc.text('2. Are you under medical treatment now?', margin, yPos);
  drawYesNoCheckbox(pageWidth - margin - 27, yPos - 2, isYes('underTreatment'), isNo('underTreatment'));
  yPos += 4;
  doc.setFontSize(7);
  doc.text('   If so, what is the condition being treated?', margin, yPos);
  yPos += 4.5;

  // Question 3
  doc.setFontSize(8);
  doc.text('3. Have you ever been hospitalized or had serious illness or surgical operation?', margin, yPos);
  drawYesNoCheckbox(pageWidth - margin - 27, yPos - 2, isYes('seriousIllness'), isNo('seriousIllness'));
  yPos += 4;
  doc.setFontSize(7);
  doc.text('   If so, what illness or operation?', margin, yPos);
  doc.line(margin + 55, yPos + 1, pageWidth - margin, yPos + 1);
  yPos += 4.5;

  // Question 4
  doc.setFontSize(8);
  doc.text('4. Have you been hospitalized?', margin, yPos);
  drawYesNoCheckbox(pageWidth - margin - 27, yPos - 2, isYes('hospitalized'), isNo('hospitalized'));
  yPos += 4;
  doc.setFontSize(7);
  doc.text('   If so, when and why?', margin, yPos);
  doc.line(margin + 40, yPos + 1, pageWidth - margin, yPos + 1);
  yPos += 4.5;

  // Question 5
  doc.setFontSize(8);
  doc.text('5. Are you taking any prescription/non-prescription medication?', margin, yPos);
  drawYesNoCheckbox(pageWidth - margin - 27, yPos - 2, isYes('takingMedication'), isNo('takingMedication'));
  yPos += 4;
  doc.setFontSize(7);
  doc.text('   If so, please specify', margin, yPos);
  doc.line(margin + 40, yPos + 1, pageWidth - margin, yPos + 1);
  yPos += 1;

  // Footer for Page 1
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text('Page 1 of 5', pageWidth / 2, pageHeight - 10, { align: 'center' });

  // ============================
  // PAGE 2: MEDICAL HISTORY CONTINUED
  // ============================
  doc.addPage();
  yPos = margin + 5;

  // Continue Questions 6-13
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);

  // Question 6
  doc.text('6. Do you use tobacco products?', margin, yPos);
  drawYesNoCheckbox(pageWidth - margin - 27, yPos - 2, isYes('tobacco'), isNo('tobacco'));
  yPos += 5;

  // Question 7
  doc.text('7. Do you use alcohol, cocaine or other dangerous drugs?', margin, yPos);
  drawYesNoCheckbox(pageWidth - margin - 27, yPos - 2, isYes('dangerousDrugs'), isNo('dangerousDrugs'));
  yPos += 5;

  // Question 8 - Allergies
  doc.text('8. Are you allergic to any of the following:', margin, yPos);
  yPos += 4;

  const col1X = margin + 5;
  const col2X = margin + 70;
  const col3X = margin + 130;

  doc.setFontSize(7);
  drawParenCheckbox('Local Anesthetic (ex. Lidocaine)', isYes('allergyAnesthetic') || isYes('allergy_anesthetic'), col1X, yPos);
  drawParenCheckbox('Penicillin, Antibiotics', isYes('allergyPenicillin') || isYes('allergy_penicillin'), col2X, yPos);
  yPos += 3.5;
  drawParenCheckbox('Aspirin', isYes('allergyAspirin') || isYes('allergy_aspirin'), col1X, yPos);
  drawParenCheckbox('Latex', isYes('allergyLatex') || isYes('allergy_latex'), col2X, yPos);
  yPos += 3.5;
  doc.text('                                                                             ', col1X, yPos);
  drawParenCheckbox('Sulfa drugs', isYes('allergySulfa') || isYes('allergy_sulfa'), col3X, yPos);
  yPos += 3.5;
  drawParenCheckbox('Others', isYes('allergyOthers') || isYes('allergy_others'), col3X, yPos);
  yPos += 5;

  // Question 9
  doc.setFontSize(8);
  doc.text('9. Bleeding Time:', margin, yPos);
  doc.line(margin + 30, yPos + 1, margin + 60, yPos + 1);
  doc.text(getData('bleedingTime'), margin + 32, yPos - 0.5);
  yPos += 5;

  // Question 10
  doc.text('10. For women only:', margin, yPos);
  yPos += 4;
  doc.text('    Are you pregnant?', margin, yPos);
  drawYesNoCheckbox(pageWidth - margin - 27, yPos - 2, isYes('pregnant'), isNo('pregnant'));
  yPos += 4;
  doc.text('    Are you nursing?', margin, yPos);
  drawYesNoCheckbox(pageWidth - margin - 27, yPos - 2, isYes('nursing'), isNo('nursing'));
  yPos += 4;
  doc.text('    Are you taking birth control pills?', margin, yPos);
  drawYesNoCheckbox(pageWidth - margin - 27, yPos - 2, isYes('birthControl'), isNo('birthControl'));
  yPos += 5;

  doc.text('11.', margin, yPos);
  doc.text('Blood Type:', margin + 6, yPos);
  doc.line(margin + 25, yPos + 1, margin + 50, yPos + 1);
  doc.text(getData('bloodType'), margin + 27, yPos - 0.5);
  yPos += 5;

  doc.text('12.', margin, yPos);
  doc.text('Blood Pressure:', margin + 6, yPos);
  doc.line(margin + 30, yPos + 1, margin + 60, yPos + 1);
  doc.text(getData('bloodPressure'), margin + 32, yPos - 0.5);
  yPos += 6;

  doc.text('13.', margin, yPos);
  doc.text('Do you have or have you had any of the following? Check which apply:', margin + 6, yPos);
  yPos += 4;

  // Medical conditions in 3 columns
  const conditions = [
    { col1: 'High Blood Pressure', col2: 'Heart Disease', col3: 'Cancer/Tumors' },
    { col1: 'Low Blood Pressure', col2: 'Heart Murmur', col3: 'Anemia' },
    { col1: 'Epilepsy/Convulsions', col2: 'Hepatitis/Liver Disease', col3: 'Angina' },
    { col1: 'AIDS or HIV Infection', col2: 'Rheumatic Fever', col3: 'Asthma' },
    { col1: 'Sexually Transmitted Disease', col2: 'Hay Fever/Allergies', col3: 'Emphysema' },
    { col1: 'Stomach Troubles/Ulcers', col2: 'Respiratory Problems', col3: 'Bleeding Problems' },
    { col1: 'Fainting Seizure', col2: 'Hepatitis/Jaundice', col3: 'Blood Diseases' },
    { col1: 'Rapid Weight Loss', col2: 'Tuberculosis', col3: 'Head Injuries' },
    { col1: 'Radiation Therapy', col2: 'Swollen Ankles', col3: 'Arthritis/Rheumatism' },
    { col1: 'Joint Replacement', col2: 'Kidney Disease', col3: 'Other' },
    { col1: 'Heart Surgery', col2: 'Diabetes', col3: '' },
    { col1: 'Heart Attack', col2: 'Chest Pain', col3: '' },
    { col1: 'Thyroid Problem', col2: 'Stroke', col3: '' },
  ];

  doc.setFontSize(6.5);
  const condCol1X = margin + 3;
  const condCol2X = margin + 65;
  const condCol3X = margin + 125;

  // Map display names to actual field keys from AI extraction
  const conditionKeyMap: Record<string, string> = {
    'High Blood Pressure': 'highBloodPressure',
    'Low Blood Pressure': 'lowBloodPressure',
    'Epilepsy/Convulsions': 'epilepsyConvulsions',
    'AIDS or HIV Infection': 'aidsHivInfection',
    'Sexually Transmitted Disease': 'sexuallyTransmittedDisease',
    'Stomach Troubles/Ulcers': 'stomachTroublesUlcers',
    'Fainting Seizure': 'faintingSeizure',
    'Rapid Weight Loss': 'rapidWeightLoss',
    'Radiation Therapy': 'radiationTherapy',
    'Joint Replacement': 'jointReplacementImplant',
    'Heart Surgery': 'heartSurgery',
    'Heart Attack': 'heartAttack',
    'Thyroid Problem': 'thyroidProblem',
    'Heart Disease': 'heartDisease',
    'Heart Murmur': 'heartMurmur',
    'Hepatitis/Liver Disease': 'hepatitisLiverDisease',
    'Rheumatic Fever': 'rheumaticFever',
    'Hay Fever/Allergies': 'hayFeverAllergies',
    'Respiratory Problems': 'respiratoryProblems',
    'Hepatitis/Jaundice': 'hepatitisJaundice',
    'Tuberculosis': 'tuberculosis',
    'Swollen Ankles': 'swollenAnkles',
    'Kidney Disease': 'kidneyDisease',
    'Diabetes': 'diabetes',
    'Chest Pain': 'chestPain',
    'Stroke': 'stroke',
    'Cancer/Tumors': 'cancerTumors',
    'Anemia': 'anemia',
    'Angina': 'angina',
    'Asthma': 'asthma',
    'Emphysema': 'emphysema',
    'Bleeding Problems': 'bleedingProblems',
    'Blood Diseases': 'bloodDiseases',
    'Head Injuries': 'headInjuries',
    'Arthritis/Rheumatism': 'arthritisRheumatism',
    'Other': 'other'
  };

  conditions.forEach((row) => {
    if (row.col1) {
      const key1 = conditionKeyMap[row.col1] || row.col1.replace(/[^a-zA-Z]/g, '').toLowerCase();
      drawParenCheckbox(row.col1, isYes(`condition_${key1}`) || isYes(key1), condCol1X, yPos);
    }
    if (row.col2) {
      const key2 = conditionKeyMap[row.col2] || row.col2.replace(/[^a-zA-Z]/g, '').toLowerCase();
      drawParenCheckbox(row.col2, isYes(`condition_${key2}`) || isYes(key2), condCol2X, yPos);
    }
    if (row.col3) {
      const key3 = conditionKeyMap[row.col3] || row.col3.replace(/[^a-zA-Z]/g, '').toLowerCase();
      drawParenCheckbox(row.col3, isYes(`condition_${key3}`) || isYes(key3), condCol3X, yPos);
    }
    yPos += 3.2;
  });

  yPos += 4;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(pageWidth - 50, yPos, pageWidth - margin, yPos);
  doc.setFontSize(7);
  doc.text('Signature', pageWidth - 32, yPos + 3);

  // Add Page 2 footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Page 2 of 5', pageWidth / 2, pageHeight - 10, { align: 'center' });

  // Continue to Page 3 - INFORMED CONSENT
  doc.addPage();
  yPos = margin + 5;

  // Page 3 Header - Gray rounded header for INFORMED CONSENT
  yPos = margin + 10;
  doc.setFillColor(180, 180, 180);
  doc.roundedRect(margin + 10, yPos, pageWidth - 2 * margin - 20, 12, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMED CONSENT', pageWidth / 2, yPos + 8, { align: 'center' });
  yPos += 18;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');

  // Consent sections - matching PDA template exactly
  const consentSections = [
    {
      title: 'TREATMENT TO BE DONE:',
      text: 'I understand and consent to have any treatment done by the dentist. After the procedure, the risks & benefits & cost have been fully explained. These treatments include, but are not limited to x-rays, cleanings/periodontal therapy, fillings, crowns, bridges & root canal therapy, local anesthetics & surgical cases.',
      initialKey: 'treatmentInitial'
    },
    {
      title: 'DRUGS & MEDICATIONS:',
      text: 'I understand that antibiotics, analgesics & other medications can cause allergic reactions like redness & swelling of tissues, pain, itching, vomiting, and/or anaphylactic shock.',
      initialKey: 'drugsInitial'
    },
    {
      title: 'CHANGES IN TREATMENT PLAN:',
      text: 'I understand that during treatment it may be necessary to change/add procedures because of conditions found while working on the teeth that was not discovered during examination. For example, root canal therapy may be needed following routine restorative procedures. I give my permission to the dentist to make any/all changes and additions as necessary. It is my responsibility to pay all the extra costs related to the procedures performed.',
      initialKey: 'planChangesInitial'
    },
    {
      title: 'RADIOGRAPH:',
      text: 'I understand that an x-ray shot or a radiograph maybe necessary as part of diagnostic aid to come up with tentative diagnosis of my Dental problem and to support judgement, but this is not a perfect instrument, & that by its use, the Dentist cannot accurately predict future events, are subject to unpredictable complications that later, on may lead to sudden change of treatment plan and subject to new charges.',
      initialKey: 'radiographInitial'
    },
    {
      title: 'REMOVAL OF TEETH:',
      text: 'I understand that alternatives to tooth removal (root canal therapy, crowns & periodontal surgery, etc.) & I completely understand that retaining the teeth by any dental specialty, always removes all the infections, if present, & it may be necessary to have further treatment. I understand the risk involved in having teeth removed, such as pain, swelling, spread of infection, dry socket, loss of feeling in my teeth, lips, tongue & surrounding tissue (paresthesia) that can last for an indefinite period of time. I understand that I may need further treatment under a specialist if complications arise during or following treatment.',
      initialKey: 'removalInitial'
    },
    {
      title: 'CROWNS (CAPS) & BRIDGES:',
      text: 'Preparing a tooth may irritate the nerve tissue in the center of the tooth, leaving the tooth extra sensitive to heat, cold & pressure. This sensitivity usually subsides, but where it does not, root canal therapy or tooth extraction may be necessary. It may not be possible to match the color of natural teeth exactly with artificial teeth. I further understand that I may be wearing temporary crowns, which may come off easily & that I must be careful to ensure that they are kept on. If they come off before my next visit or if the tooth structure comes off cement, it is my responsibility to see the dentist immediately for permanent cementation within 20 days from tooth preparation, as excessive days delay may allow for tooth movement, which may necessitate a remake of the crown, bridge or cap. I understand that at times of permanent cementation, if there is need to modify the shape/fit/size/color of my new crown, bridges or cap (including shape, fit, size, & color) will be before permanent cementation.',
      initialKey: 'crownsInitial'
    },
    {
      title: 'ENDODONTICS (ROOT CANAL):',
      text: 'I understand there is no guarantee that a root canal treatment will save a tooth & that complications can occur from the treatment itself, that occasionally metal instruments and/or files are used in their manufacture, and that it may be necessary to have the tooth extracted if complications arise. I also understand that endodontic files & drills are very fragile instruments & stresses vented in their manufacture & calcifications present in teeth can cause them to break apart in the procedure, I am responsible for any additional cost for treatment performed by the endodontist. I understand that a tooth may require removal in spite of all efforts to save it.',
      initialKey: 'rootCanalInitial'
    },
    {
      title: 'PERIODONTAL DISEASE:',
      text: 'I understand that periodontal disease is a serious condition causing gum & bone inflammation &/or loss & that can lead eventually to the loss of my teeth. I understand that various treatment plans to correct the condition depending upon each individual situation or without replacement. I understand that undertaking any dental procedures may have necessary adverse effects on my pre-existing periodontal conditions.',
      initialKey: 'periodontalInitial'
    },
    {
      title: 'FILLINGS:',
      text: 'I understand that care must be exercised in chewing on fillings, especially during the first 24 hours to avoid breakage. I understand that a more extensive restoration than originally planned may sometimes be required due to additional unseen decay. I acknowledge that the newly placed filling or crown, sensitivity is a common, but usually temporary, after-effect of a newly placed filling. I further understand that filling a tooth may irritate the nerve tissue creating sensitivity or requiring further treatment, including root canal treatment or tooth extraction.',
      initialKey: 'fillingsInitial'
    },
    {
      title: 'DENTURES:',
      text: 'I understand that wearing of dentures can be difficult. Sore spots, altered speech & difficulty in eating are common problems. Immediate dentures (placement of denture immediately after extractions) may be painful. Immediate dentures may require considerable adjusting & several relines. A permanent reline will be needed later, when the tissue is completely healed. This is an additional charge. If a remake is required due to my delay of more than 30 days, there will be additional charges. A permanent reline will be needed later, which is not covered in the initial cost of dentures or surgical extractions if alterations are requested or any time that has not been specified or alterations are requested at any time.',
      initialKey: 'denturesInitial'
    }
  ];

  consentSections.forEach((section) => {
    const lineHeight = 2.8;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text(section.title, margin, yPos);
    yPos += 3;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    const lines = doc.splitTextToSize(section.text, pageWidth - 2 * margin);
    doc.text(lines, margin, yPos);

    const paragraphEndY = yPos + lines.length * lineHeight;

    const initials = getData(section.initialKey);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text(
      `Initials: ${initials}` || "______",
      pageWidth - margin - 40,
      paragraphEndY + 3
    );

    yPos = paragraphEndY + 7;
  });

  // Final consent statement
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  const finalConsent = 'I understand that dentistry is not an exact science and that no dentist can properly guarantee accurate results all the time.\n\nI hereby authorize any of the doctors/dental auxiliaries to proceed with & perform the dental restorations & treatments as explained to me. I understand that these are subject to modification depending on undiagnosable circumstances that may arise during the course of treatment. I understand that regardless of my dental insurance coverage I may have, I am responsible for payment of dental fees. I agree to pay any attorney\'s fees, collection fee, or court costs that may be incurred to satisfy any obligation to this office. All treatment were properly explained to me & any untoward circumstances that may arise during the procedure, the attending dentist will not be held liable since it is my free will, with full trust & confidence in him/her, to undergo Dental Treatment under his/her care.';
  const finalLines = doc.splitTextToSize(finalConsent, pageWidth - 2 * margin);
  doc.text(finalLines, margin, yPos);
  yPos += finalLines.length * 2.8 + 5;

  const patientDate = getData('signatureDate');

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(margin, yPos, margin + 70, yPos);
  doc.setFontSize(7);
  doc.text('Patient/Parent/Guardian Signature', margin, yPos + 3.5);

  doc.setFontSize(6.5);
  doc.text(patientDate || "", margin + 85 + 22.5, yPos - 1, {
    align: "center",
  });
  doc.line(margin + 85, yPos, margin + 130, yPos);
  doc.setFontSize(7);
  doc.text('Date', margin + 100, yPos + 3.5);

  yPos += 8;
  doc.line(margin, yPos, margin + 70, yPos);
  doc.text('Dentist Signature', margin, yPos + 3.5);

  doc.setFontSize(6.5);
  doc.text(patientDate || "", margin + 85 + 22.5, yPos - 1, {
    align: "center",
  });
  doc.line(margin + 85, yPos, margin + 130, yPos);
  doc.setFontSize(7);
  doc.text('Date', margin + 100, yPos + 3.5);

  // Add Page 3 footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Page 3 of 5', pageWidth / 2, pageHeight - 10, { align: 'center' });

  // ============================
  // PAGE 4: DENTAL CHART
  // ============================
  doc.addPage();
  yPos = 13;

  // Page 4 Header
  yPos = margin + 10;
  doc.setFillColor(180, 180, 180);
  doc.roundedRect(margin + 10, yPos, pageWidth - 2 * margin - 20, 12, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('DENTAL RECORD CHART', pageWidth / 2, yPos + 8, { align: 'center' });
  yPos += 18;

  // INTRAORAL EXAMINATION
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('INTRAORAL EXAMINATION', margin, yPos);

  // Patient info
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const fullName = `${getData('firstName')} ${getData('middleName')} ${getData('lastName')}`.trim();
  doc.text(`Name: ${fullName}`, pageWidth - 110, yPos);
  yPos += 4;
  doc.text(`Age: ${getData('age') || '___'}`, pageWidth - 110, yPos);
  doc.text(`Gender: M/F ${getData('sex') || '___'}`, pageWidth - 70, yPos);
  doc.text(`Date: ${getData('signatureDate') || new Date().toLocaleDateString()}`, pageWidth - 40, yPos);
  yPos += 8;

  // Dental chart - simplified layout matching template
  const chartStartY = yPos;
  const toothWidth = 7;
  const chartCenterX = pageWidth / 2;

  // Parse tooth findings data
  let toothFindings: any[] = [];
  try {
    const toothFindingsStr = getData('toothFindings');
    if (toothFindingsStr) {
      toothFindings = JSON.parse(toothFindingsStr);
    }
  } catch (e) {
    // Ignore parsing errors
  }

  // Helper function to get tooth data
  const getToothData = (toothNum: string) => {
    return toothFindings.find((t: any) => t.toothNumber === toothNum);
  };

  // Helper function to get tooth display text (priority: surgery > restoration > condition)
  const getToothDisplayText = (toothData: any) => {
    if (!toothData) return '';
    
    // 1st Priority: Check for surgeries (extractions)
    if (toothData.surgeries && Array.isArray(toothData.surgeries) && toothData.surgeries.length > 0) {
      const surgery = toothData.surgeries[0];
      if (surgery === 'EXTRACTION_CARIES') return 'X';
      if (surgery === 'EXTRACTION_OTHER') return 'XO';
    }
    
    // 2nd Priority: Check for restorations
    if (toothData.restorations && Array.isArray(toothData.restorations) && toothData.restorations.length > 0) {
      return toothData.restorations[0]; // AM, CO, JC, etc.
    }
    
    // 3rd Priority: Check for conditions (except PRESENT)
    if (toothData.condition && toothData.condition !== 'PRESENT') {
      const codes: Record<string, string> = {
        'DECAYED': 'D',
        'MISSING_CARIES': 'M',
        'MISSING_OTHER': 'MO',
        'IMPACTED': 'Im',
        'SUPERNUMERARY': 'Sp',
        'ROOT_FRAGMENT': 'Rf',
        'UNERUPTED': 'Un'
      };
      return codes[toothData.condition] || '';
    }
    
    return '';
  };

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('RIGHT', margin + 5, chartStartY + 15);
  doc.text('LEFT', pageWidth - margin - 20, chartStartY + 15);

  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.4);

  let xPos = chartCenterX;
  yPos = chartStartY + 5;

  // 1. Upper deciduous (55-51 and 61-65) - TOP
  const upperDecid = ['55', '54', '53', '52', '51', '61', '62', '63', '64', '65'];
  xPos = chartCenterX - (upperDecid.length * toothWidth / 2);

  // Tooth numbers above circles
  upperDecid.forEach((tooth) => {
    doc.text(tooth, xPos + 3.5, yPos, { align: 'center' });
    xPos += toothWidth;
  });

  yPos += 4;
  xPos = chartCenterX - (upperDecid.length * toothWidth / 2);

  // Circles with conditions
  upperDecid.forEach((tooth) => {
    doc.circle(xPos + 3.5, yPos + 1.5, 2.2);
    
    const toothData = getToothData(tooth);
    const displayText = getToothDisplayText(toothData);
    
    if (displayText) {
      doc.setFontSize(4);
      doc.text(displayText, xPos + 3.5, yPos + 2, { align: 'center' });
      doc.setFontSize(6);
    }
    xPos += toothWidth;
  });

  yPos += 8;

  // 2. Upper permanent (18-11 and 21-28)
  const upperPerm = ['18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28'];
  xPos = chartCenterX - (upperPerm.length * toothWidth / 2);

  // Tooth numbers above circles
  upperPerm.forEach((tooth) => {
    doc.text(tooth, xPos + 3.5, yPos, { align: 'center' });
    xPos += toothWidth;
  });

  yPos += 5;
  xPos = chartCenterX - (upperPerm.length * toothWidth / 2);

  // Circles with conditions
  upperPerm.forEach((tooth) => {
    doc.circle(xPos + 3.5, yPos + 2, 3);
    
    const toothData = getToothData(tooth);
    const displayText = getToothDisplayText(toothData);
    
    if (displayText) {
      doc.setFontSize(5);
      doc.text(displayText, xPos + 3.5, yPos + 2.5, { align: 'center' });
      doc.setFontSize(6);
    }
    xPos += toothWidth;
  });

  yPos += 10;

  // 3. Lower permanent (48-41 and 31-38)
  const lowerPerm = ['48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38'];
  xPos = chartCenterX - (lowerPerm.length * toothWidth / 2);
  
  // Circles with conditions
  lowerPerm.forEach((tooth) => {
    doc.circle(xPos + 3.5, yPos + 2, 3);
    
    const toothData = getToothData(tooth);
    const displayText = getToothDisplayText(toothData);
    
    if (displayText) {
      doc.setFontSize(5);
      doc.text(displayText, xPos + 3.5, yPos + 2.5, { align: 'center' });
      doc.setFontSize(6);
    }
    xPos += toothWidth;
  });

  yPos += 7;
  xPos = chartCenterX - (lowerPerm.length * toothWidth / 2);

  // Tooth numbers below circles
  lowerPerm.forEach((tooth) => {
    doc.text(tooth, xPos + 3.5, yPos, { align: 'center' });
    xPos += toothWidth;
  });

  yPos += 6;

  // 4. Lower deciduous (85-81 and 71-75) - BOTTOM
  const lowerDecid = ['85', '84', '83', '82', '81', '71', '72', '73', '74', '75'];
  xPos = chartCenterX - (lowerDecid.length * toothWidth / 2);

  // Circles with conditions
  lowerDecid.forEach((tooth) => {
    doc.circle(xPos + 3.5, yPos + 1.5, 2.2);
    
    const toothData = getToothData(tooth);
    const displayText = getToothDisplayText(toothData);
    
    if (displayText) {
      doc.setFontSize(4);
      doc.text(displayText, xPos + 3.5, yPos + 2, { align: 'center' });
      doc.setFontSize(6);
    }
    xPos += toothWidth;
  });

  yPos += 5;
  xPos = chartCenterX - (lowerDecid.length * toothWidth / 2);
  
  // Tooth numbers below circles
  lowerDecid.forEach((tooth) => {
    doc.text(tooth, xPos + 3.5, yPos, { align: 'center' });
    xPos += toothWidth;
  });

  yPos += 10;


  // Legend section - 3 columns
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.text('Legend:', margin, 145);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);

  // Column 1: Condition
  let legY = 150;
  const legCol1X = margin + 2;
  doc.setFont('helvetica', 'bold');
  doc.text('Condition', legCol1X, legY);
  legY += 3;
  doc.setFont('helvetica', 'normal');
  const conditionItems = [
    'P - Present Teeth',
    'D - Decayed (Caries indicated for Filling)',
    'M - Missing due to Caries',
    'MO - Missing due to Other Causes',
    'Im - Impacted Tooth',
    'Sp - Supernumerary Tooth',
    'Rf - Root Fragment',
    'Un - Unerupted'
  ];
  conditionItems.forEach((item) => {
    doc.text(item, legCol1X, legY);
    legY += 2.5;
  });

  // Column 2: Restorations & Prosthetics
  legY = 150;
  const legCol2X = margin + 65;
  doc.setFont('helvetica', 'bold');
  doc.text('Restorations & Prosthetics', legCol2X, legY);
  legY += 3;
  doc.setFont('helvetica', 'normal');
  const restorationItems = [
    'Am - Amalgam Filling',
    'Co - Composite Filling',
    'JC - Jacket Crown',
    'Ab - Abutment',
    'Att - Attachment',
    'P - Pontic',
    'In - Inlay',
    'Imp - Implant',
    'S - Sealants',
    'Rm - Removable Denture'
  ];
  restorationItems.forEach((item) => {
    doc.text(item, legCol2X, legY);
    legY += 2.5;
  });

  // Column 3: Surgery
  legY = 150;
  const legCol3X = margin + 130;
  doc.setFont('helvetica', 'bold');
  doc.text('Surgery', legCol3X, legY);
  legY += 3;
  doc.setFont('helvetica', 'normal');
  const surgeryItems = [
    'X - Extraction due to Caries',
    'XO - Extraction due to Other Causes',
    '',
    'X-ray Taken:',
    '  Periapical (Th No.: ___)',
    '  Panoramic',
    '  Cephalometric',
    '  Occlusal (Upper/Lower)',
    '  Others:'
  ];
  surgeryItems.forEach((item) => {
    doc.text(item, legCol3X, legY);
    legY += 2.5;
  });

  // Clinical findings section - 4 columns
  const clinicalY = 175;
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');

  // Column 1: Periodontal Screening
  doc.text('Periodontal Screening:', margin, clinicalY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  let perioY = clinicalY + 3;
  const perioItems = [
    { label: 'Gingivitis', key: 'gingivitis' },
    { label: 'Early Periodontitis', key: 'earlyPeriodontitis' },
    { label: 'Moderate Periodontitis', key: 'moderatePeriodontitis' },
    { label: 'Advanced Periodontitis', key: 'advancedPeriodontitis' }
  ];
  perioItems.forEach((item) => {
    const checked = getData(item.key) === 'present' || getData(item.key) === true;
    doc.text(checked ? '/' : '_____', margin, perioY);
    doc.text(item.label, margin + 8, perioY);
    perioY += 3;
  });

  // Column 2: Occlusion
  const occCol = margin + 50;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.text('Occlusion:', occCol, clinicalY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  let occY = clinicalY + 3;
  const occItems = [
    { label: 'Class (Molar)', key: 'occlusionClass' },
    { label: 'Overjet', key: 'overjet' },
    { label: 'Overbite', key: 'overbite' },
    { label: 'Midline Deviation', key: 'midlineDeviation' },
    { label: 'Crossbite', key: 'crossbite' }
  ];
  occItems.forEach((item) => {
    const checked = getData(item.key) === 'present' || getData(item.key) === true || getData(item.key);
    doc.text(checked ? '/' : '_____', occCol, occY);
    doc.text(item.label, occCol + 8, occY);
    occY += 3;
  });

  // Column 3: Appliances
  const appCol = margin + 100;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.text('Appliances:', appCol, clinicalY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  let appY = clinicalY + 3;
  const appItems = [
    { label: 'Orthodontic', key: 'orthodontic' },
    { label: 'Stayplate', key: 'stayplate' },
    { label: 'Others', key: 'otherAppliances' }
  ];
  appItems.forEach((item) => {
    const checked = getData(item.key) === 'present' || getData(item.key) === true || getData(item.key);
    doc.text(checked ? '/' : '_____', appCol, appY);
    doc.text(item.label, appCol + 8, appY);
    appY += 3;
  });

  // Column 4: TMD
  const tmdCol = margin + 145;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.text('TMD:', tmdCol, clinicalY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  let tmdY = clinicalY + 3;
  const tmdItems = [
    { label: 'Clenching', key: 'clenching' },
    { label: 'Clicking', key: 'clicking' },
    { label: 'Trismus', key: 'trismus' },
    { label: 'Muscle Spasm', key: 'muscleSpasm' }
  ];
  tmdItems.forEach((item) => {
    const checked = getData(item.key) === 'present' || getData(item.key) === true;
    doc.text(checked ? '/' : '_____', tmdCol, tmdY);
    doc.text(item.label, tmdCol + 8, tmdY);
    tmdY += 3;
  });

  // Add Page 4 footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Page 4 of 5', pageWidth / 2, pageHeight - 10, { align: 'center' });

  // ============================
  // PAGE 5: TREATMENT RECORD
  // ============================
  doc.addPage();
  yPos = 13;

  // Patient info header at top
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  const patientFullName = `${getData('lastName') || ''}, ${getData('firstName') || ''}`;
  doc.text(`Name: ${patientFullName}`, margin, yPos);
  doc.text(`Age: ${getData('age') || '___'}`, pageWidth - 80, yPos);
  doc.text(`Gender: M/F ${getData('sex') || '___'}`, pageWidth - 50, yPos);
  yPos += 10;

  // Blue rounded header for TREATMENT RECORD
  doc.setFillColor(52, 152, 219);
  doc.roundedRect(margin + 10, yPos, pageWidth - 2 * margin - 20, 10, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TREATMENT RECORD', pageWidth / 2, yPos + 7, { align: 'center' });
  yPos += 15;

  // Treatment table - populate with actual treatment records
  const tableBody = [];

  console.log('🔍 Checking treatment data...');
  console.log('📦 Full data object:', data);
  console.log('📋 data.treatmentRecord:', data.treatmentRecord);
  console.log('📝 formData keys:', Object.keys(formData));
  console.log('🔬 extractedData keys:', Object.keys(extractedData));

  // First, check if user edited treatment record in form (Page 4 review)
  const hasFormTreatmentData = formData.treatmentDate || formData.toothNumbers || formData.procedure ||
    formData.dentistName || formData.amountCharged || formData.amountPaid;

  if (hasFormTreatmentData) {
    // User edited treatment record in form - use form data (highest priority)
    console.log('✅ Using edited treatment record from form');
    const row = [
      formData.treatmentDate || '',
      formData.toothNumbers || '',
      formData.procedure || '',
      formData.dentistName || '',
      formData.amountCharged !== undefined ? String(formData.amountCharged) : '',
      formData.amountPaid !== undefined ? String(formData.amountPaid) : '',
      formData.balance !== undefined ? String(formData.balance) : '',
      formData.nextAppointment || ''
    ];
    console.log('📊 Form data row:', row);
    tableBody.push(row);
  } else {
    // No form edits - use extracted treatment records from AI
    // Check both data.treatmentRecord and extractedData.treatmentRecord
    const treatmentRecords = data.treatmentRecord || extractedData.treatmentRecord || extractedData.treatmentRecords || [];
    console.log('✅ Using extracted treatment records:', treatmentRecords);

    if (Array.isArray(treatmentRecords) && treatmentRecords.length > 0) {
      treatmentRecords.forEach((record: any) => {
        const row = [
          record.date || '',
          record.toothQuantity || record.toothNumber || record.tooth || '',
          record.procedure || record.treatment || '',
          record.dentist || '',
          record.amountCharged !== undefined && record.amountCharged !== null ? String(record.amountCharged) : '',
          record.amountPaid !== undefined && record.amountPaid !== null ? String(record.amountPaid) : '',
          record.balance !== undefined && record.balance !== null ? String(record.balance) : '',
          record.nextAppointment || record.nextVisit || ''
        ];
        console.log('📊 Adding treatment record row:', row);
        tableBody.push(row);
      });
    } else {
      console.log('⚠️ No treatment records found in data');
    }
  }

  console.log('📋 Final table body:', tableBody);

  // Fill remaining rows to make 30 total
  while (tableBody.length < 30) {
    tableBody.push(['', '', '', '', '', '', '', '']);
  }

  autoTable(doc, {
    startY: yPos,
    head: [['Date', 'Tooth\nNo./s', 'Procedure', 'Dentist/s', 'Amount\ncharged', 'Amount\nPaid', 'Balance', 'Next\nAppt.']],
    body: tableBody,
    theme: 'grid',
    headStyles: {
      fillColor: [220, 220, 220],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
      valign: 'middle',
      lineWidth: 0.4,
      lineColor: [0, 0, 0],
      cellPadding: 2
    },
    styles: {
      fontSize: 7,
      cellPadding: 1.5,
      lineWidth: 0.3,
      lineColor: [150, 150, 150],
      minCellHeight: 7,
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 20, halign: 'center' },     // Date
      1: { cellWidth: 12, halign: 'center' },     // Tooth No
      2: { cellWidth: 50, halign: 'left' },       // Procedure
      3: { cellWidth: 30, halign: 'left' },       // Dentist
      4: { cellWidth: 20, halign: 'right' },      // Amount charged
      5: { cellWidth: 20, halign: 'right' },      // Amount Paid
      6: { cellWidth: 18, halign: 'right' },      // Balance
      7: { cellWidth: 16, halign: 'center' }      // Next Visit
    },
    margin: { left: margin, right: margin }
  });

  // Add Page 5 footer and watermark
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text('Page 5 of 5', pageWidth / 2, pageHeight - 10, { align: 'center' });

  // Add mcml/10 watermark on Page 5 (Treatment Record)
  doc.setFontSize(6);
  doc.setTextColor(180, 180, 180);
  doc.text('mcml/10', pageWidth - margin - 10, pageHeight - 5);

  // Save the PDF with patient name
  const patientLastName = getData('lastName') || 'Patient';
  const patientFirstName = getData('firstName');
  const patientName = patientFirstName ? `${patientLastName}_${patientFirstName}` : patientLastName;
  const fileName = `${patientName.replace(/\s+/g, '_')}_Dental_Chart.pdf`;
  doc.save(fileName);
};