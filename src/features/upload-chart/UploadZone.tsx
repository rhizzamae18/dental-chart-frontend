import { useState, useCallback, useRef } from "react";
import { useAppStore } from "@/shared/store/useAppStore";
import { Upload, FileText, Images } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import {
  createDentalRecord,
  uploadPage1,
  uploadPage2,
  uploadPage3,
  uploadPage4,
} from "@/shared/lib/api";

import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

type UploadMode = "pdf" | "images";

const PAGE_LABELS = [
  {
    page: 1,
    title: "Patient Information & Medical History",
    description: "Personal details, medical conditions, medications",
  },
  {
    page: 2,
    title: "Dental Chart & Clinical Findings",
    description: "Tooth diagram, periodontal, occlusion, appliances, TMD",
  },
  {
    page: 3,
    title: "Informed Consent & Treatment",
    description: "Treatment consent, procedure consent, signatures",
  },
  {
    page: 4,
    title: "Treatment Records",
    description: "Treatment history, procedures, notes",
  },
];

// Helper function to convert mm/dd/yy to YYYY-MM-DD format
const convertDateFormat = (
  dateStr: string | null | undefined
): string | null => {
  if (!dateStr) return null;

  try {
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      let [month, day, year] = parts;

      // Convert 2-digit year to 4-digit
      if (year.length === 2) {
        const currentYear = new Date().getFullYear();
        const currentCentury = Math.floor(currentYear / 100) * 100;
        const yearNum = parseInt(year);

        if (yearNum > currentYear % 100) {
          year = String(currentCentury - 100 + yearNum);
        } else {
          year = String(currentCentury + yearNum);
        }
      }

      month = month.padStart(2, "0");
      day = day.padStart(2, "0");

      return `${year}-${month}-${day}`;
    }

    return dateStr;
  } catch (error) {
    console.error("Date conversion error:", error);
    return dateStr;
  }
};

// Helper function to flatten nested extracted data to match form field keys
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function flattenExtractedData(data: any): Record<string, unknown> {
  const flattened: Record<string, unknown> = {};

  // Field key mapping: API key -> Form key
  const fieldMapping: Record<string, string> = {
    homeNo: "homePhone",
    officeNo: "officePhone",
    cellMobileNo: "mobileNumber",
    faxNo: "faxNumber",
    emailAddress: "email",
    parentGuardianName: "guardianName",
    parentOccupation: "guardianOccupation",
    physicianOfficeNumber: "physicianPhone",
    underMedicalTreatment: "underTreatment",
    medicalConditionBeingTreated: "treatmentCondition",
    seriousIllnessSurgery: "seriousIllness",
    illnessOrOperationDetails: "illnessDetails",
    takingMedication: "medications",
    medicationDetails: "medicationList",
    useTobacco: "tobacco",
    useAlcoholDrugs: "substanceUse",
  };

  // Flatten patient data
  if (data.patient) {
    Object.keys(data.patient).forEach((key) => {
      let value = data.patient[key];

      // Convert date fields to YYYY-MM-DD format
      if (key === "birthdate" || key === "effectiveDate") {
        value = convertDateFormat(value);
      }

      const mappedKey = fieldMapping[key] || key;
      flattened[mappedKey] = value;
    });
  }

  // Flatten dental history
  if (data.dentalHistory) {
    Object.keys(data.dentalHistory).forEach((key) => {
      let value = data.dentalHistory[key];

      // Convert date fields to YYYY-MM-DD format
      if (key === "lastDentalVisit") {
        value = convertDateFormat(value);
      }

      const mappedKey = fieldMapping[key] || key;
      flattened[mappedKey] = value;
    });

    // --- Propagate Patient Info to Headers of Other Pages ---
    const fullName = `${data.patient.lastName}, ${data.patient.firstName} ${
      data.patient.middleName || ""
    }`.trim();
    const age = data.patient.age;
    const gender =
      data.patient.sex === "Male" || data.patient.sex === "M" ? "M" : "F";

    // Page 2: Dental Chart Header
    flattened["chartPatientName"] = fullName;
    flattened["chartAge"] = age;
    flattened["chartGender"] = gender;

    // Page 4: Treatment Record Header
    flattened["treatmentPatientName"] = fullName;
    flattened["treatmentAge"] = age;
    flattened["treatmentGender"] = gender;
  }

  // Flatten medical history (excluding nested objects)
  if (data.medicalHistory) {
    Object.keys(data.medicalHistory).forEach((key) => {
      if (
        key !== "allergies" &&
        key !== "forWomenOnly" &&
        key !== "medicalConditions"
      ) {
        const mappedKey = fieldMapping[key] || key;
        flattened[mappedKey] = data.medicalHistory[key];
      }
    });

    // Flatten allergies - convert Yes/No to boolean for checkboxes
    if (data.medicalHistory.allergies) {
      Object.keys(data.medicalHistory.allergies).forEach((key) => {
        const value = data.medicalHistory.allergies[key];
        // Convert "Yes" to true, everything else to false
        flattened[`allergy_${key}`] = value === "Yes";
      });
    }

    // Flatten forWomenOnly
    if (data.medicalHistory.forWomenOnly) {
      Object.keys(data.medicalHistory.forWomenOnly).forEach((key) => {
        flattened[`women_${key}`] = data.medicalHistory.forWomenOnly[key];
      });
    }

    // Flatten medical conditions
    if (data.medicalHistory.medicalConditions) {
      Object.keys(data.medicalHistory.medicalConditions).forEach((key) => {
        flattened[`condition_${key}`] =
          data.medicalHistory.medicalConditions[key];
      });
    }
  }

  // Flatten dental chart data (Page 2)
  if (data.ToothFinding && Array.isArray(data.ToothFinding)) {
    // Store raw JSON if needed
    flattened["toothFindings"] = JSON.stringify(data.ToothFinding);

    // Aggregate tooth numbers for text fields
    const conditions: Record<string, string[]> = {
      presentTeeth: [],
      decayedTeeth: [],
      missingTeeth: [],
      impactedTeeth: [],
      rootFragments: [],
      extractionCaries: [],
      extractionOther: [],
    };

    const restorations: Record<string, string[]> = {
      amalgamFilling: [],
      compositeFilling: [],
      jacketCrown: [],
      inlayImplant: [],
      sealants: [],
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.ToothFinding.forEach((tooth: any) => {
      const num = tooth.toothNumber;

      // Conditions
      if (tooth.condition === "PRESENT") conditions.presentTeeth.push(num);
      if (tooth.condition === "DECAYED") conditions.decayedTeeth.push(num);
      if (
        tooth.condition === "MISSING_CARIES" ||
        tooth.condition === "MISSING_OTHER"
      )
        conditions.missingTeeth.push(num);
      if (tooth.condition === "IMPACTED") conditions.impactedTeeth.push(num);
      if (tooth.condition === "ROOT_FRAGMENT")
        conditions.rootFragments.push(num);

      // Surgeries (Extractions)
      if (tooth.surgeries) {
        if (tooth.surgeries.includes("EXTRACTION_CARIES"))
          conditions.extractionCaries.push(num);
        if (tooth.surgeries.includes("EXTRACTION_OTHER"))
          conditions.extractionOther.push(num);
      }

      // Restorations
      if (tooth.restorations) {
        if (tooth.restorations.includes("AM"))
          restorations.amalgamFilling.push(num);
        if (tooth.restorations.includes("CO"))
          restorations.compositeFilling.push(num);
        if (tooth.restorations.includes("JC"))
          restorations.jacketCrown.push(num);
        if (
          tooth.restorations.includes("IN") ||
          tooth.restorations.includes("IMP")
        )
          restorations.inlayImplant.push(num);
        if (tooth.restorations.includes("S")) restorations.sealants.push(num);
      }
    });

    // Join with commas and assign to flattened data
    Object.keys(conditions).forEach((key) => {
      if (conditions[key].length > 0)
        flattened[key] = conditions[key].join(", ");
    });
    Object.keys(restorations).forEach((key) => {
      if (restorations[key].length > 0)
        flattened[key] = restorations[key].join(", ");
    });
  }

  // Periodontal (RadioFields: present/absent)
  if (data.periodontal) {
    Object.keys(data.periodontal).forEach((key) => {
      const val = data.periodontal[key];
      flattened[key] =
        val === true ? "present" : val === false ? "absent" : "unknown";
    });
  }

  // Occlusion
  if (data.occlusion) {
    if (data.occlusion.molarClass)
      flattened["occlusionClass"] = data.occlusion.molarClass; // Map molarClass -> occlusionClass
    if (data.occlusion.overjet) flattened["overjet"] = "Present"; // Boolean -> Text
    if (data.occlusion.overbite) flattened["overbite"] = "Present";
    if (data.occlusion.midlineDeviation)
      flattened["midlineDeviation"] = "Present";
    if (data.occlusion.crossbite) flattened["crossbite"] = "Present";
  }

  // Appliances
  if (data.appliances) {
    if (data.appliances.orthodontic) flattened["orthodontic"] = "Present";
    if (data.appliances.stayplate) flattened["stayplate"] = "Present";
    if (data.appliances.others)
      flattened["otherAppliances"] = data.appliances.others;
  }

  // TMD (RadioFields: present/absent)
  if (data.tmd) {
    Object.keys(data.tmd).forEach((key) => {
      const val = data.tmd[key];
      flattened[key] =
        val === true ? "present" : val === false ? "absent" : "unknown";
    });
  }

  // --- Page 3: Informed Consent & Signatures ---

  // Treatment Consent
  if (data.treatment?.initial)
    flattened["treatmentInitial"] = data.treatment.initial;

  // Procedures Consent
  if (data.drugsMedication?.initial)
    flattened["drugsInitial"] = data.drugsMedication.initial;
  if (data.changesInPlan?.initial)
    flattened["planChangesInitial"] = data.changesInPlan.initial;
  if (data.radiograph?.initial)
    flattened["radiographInitial"] = data.radiograph.initial;
  if (data.removalOfTeeth?.initial)
    flattened["removalInitial"] = data.removalOfTeeth.initial;
  if (data.crownsBridges?.initial)
    flattened["crownsInitial"] = data.crownsBridges.initial;
  if (data.endodontics?.initial)
    flattened["rootCanalInitial"] = data.endodontics.initial;
  if (data.periodontal?.initial)
    flattened["periodontalInitial"] = data.periodontal.initial;
  if (data.fillings?.initial)
    flattened["fillingsInitial"] = data.fillings.initial;
  if (data.dentures?.initial)
    flattened["denturesInitial"] = data.dentures.initial;

  // Signatures
  if (data.patientSignature)
    flattened["patientSignature"] = data.patientSignature;
  if (data.dentistSignature)
    flattened["dentistSignature"] = data.dentistSignature;

  // Date (Convert MM/DD/YY or similar to YYYY-MM-DD for input type="date")
  if (data.date) {
    // Attempt simple parsing if format is commonly MM/DD/YY or MM/DD/YYYY
    const dateStr = String(data.date).trim();
    // Try to parse using Date object
    const pDate = new Date(dateStr);
    if (!isNaN(pDate.getTime())) {
      // Format to YYYY-MM-DD
      flattened["signatureDate"] = pDate.toISOString().split("T")[0];
    } else {
      // Fallback: just store raw string if parsing fails (though type="date" won't show it)
      flattened["signatureDate"] = dateStr;
    }
  }

  // --- Page 4: Treatment Records ---
  // IMPORTANT: Keep the entire treatmentRecord array for PDF generation
  if (
    data.treatmentRecord &&
    Array.isArray(data.treatmentRecord) &&
    data.treatmentRecord.length > 0
  ) {
    // Preserve the full array for PDF table
    flattened["treatmentRecord"] = data.treatmentRecord;

    // Also flatten the last record for form fields (backward compatibility)
    const record = data.treatmentRecord[data.treatmentRecord.length - 1];

    if (record.toothQuantity) flattened["toothNumbers"] = record.toothQuantity;
    if (record.procedure) flattened["procedure"] = record.procedure;
    if (record.dentist) flattened["dentistName"] = record.dentist;
    if (record.amountCharged)
      flattened["amountCharged"] = String(record.amountCharged);
    if (record.amountPaid) flattened["amountPaid"] = String(record.amountPaid);
    if (record.balance) flattened["balance"] = String(record.balance);

    // Dates helper
    const formatDate = (d: string | null) => {
      if (!d) return "";
      try {
        return new Date(d).toISOString().split("T")[0];
      } catch {
        return d;
      }
    };

    if (record.date) flattened["treatmentDate"] = formatDate(record.date);
    if (record.nextAppointment)
      flattened["nextAppointment"] = formatDate(record.nextAppointment);
  }

  return flattened;
}

export const UploadZone = () => {
  const setAppState = useAppStore((state) => state.setAppState);
  const setUploadMode = useAppStore((state) => state.setUploadMode);
  const setSeparatedPages = useAppStore((state) => state.setSeparatedPages);
  const setExtractedData = useAppStore((state) => state.setExtractedData);
  // const setPatientId = useAppStore((state) => state.setPatientId);
  // const setDentalChartId = useAppStore((state) => state.setDentalChartId);
  const setDentalRecordId = useAppStore((state) => state.setDentalRecordId);

  const [isDragging, setIsDragging] = useState(false);
  const [localUploadMode, setLocalUploadMode] = useState<UploadMode>("pdf");
  const uploadZoneRef = useRef<HTMLDivElement>(null);

  // Scroll to upload zone when mode is selected
  const handleModeChange = (mode: UploadMode) => {
    setLocalUploadMode(mode);

    // Smooth scroll to upload zone after a short delay
    setTimeout(() => {
      uploadZoneRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  // NEW: Process all 4 pages sequentially
  const processAllPages = useCallback(
    async (pageImages: string[]) => {
      try {
        console.log(`Processing ${pageImages.length} pages...`);
        const allExtractedData: Record<string, unknown> = {};
        // let currentDentalRecordId: string | null = null;
        // let currentDentalChartId: string | null = null;

        const recordRes = await createDentalRecord();
        const dentalRecordId = recordRes.recordId;

        if (!dentalRecordId) {
          throw new Error("Failed to create dental record");
        }

        setDentalRecordId(dentalRecordId);

        // Process each page sequentially
        for (let i = 0; i < Math.min(pageImages.length, 4); i++) {
          const pageNum = i + 1;
          console.log(`Processing Page ${pageNum}...`);
          setAppState("loading"); // Keep showing loading

          // Convert page image to File
          const pageBlob = await (await fetch(pageImages[i])).blob();
          const imageFile = new File([pageBlob], `page${pageNum}.png`, {
            type: "image/png",
          });

          let result;

          // Call appropriate API based on page number
          if (pageNum === 1) {
            console.log("Uploading Page 1...");
            result = await uploadPage1(imageFile, dentalRecordId);
            if (result.success && result.dentalRecordId) {
              console.log(`Page 1 success! dentalRecordId: ${dentalRecordId}`);
            }
          } else if (pageNum === 2 && dentalRecordId) {
            console.log(
              `Uploading Page 2 with dentalRecordId: ${dentalRecordId}...`
            );
            result = await uploadPage2(imageFile, dentalRecordId);
            if (result.success && result.dentalRecordId) {
              console.log(`Page 2 success! dentalRecordId: ${dentalRecordId}`);
            }
          } else if (pageNum === 3 && dentalRecordId) {
            console.log(
              `Uploading Page 3 with dentalRecordId: ${dentalRecordId}...`
            );
            result = await uploadPage3(imageFile, dentalRecordId);
            console.log(`Page 3 ${result?.success ? "success" : "failed"}!`);
          } else if (pageNum === 4 && dentalRecordId) {
            console.log(
              `Uploading Page 4 with dentalRecordId: ${dentalRecordId}...`
            );
            result = await uploadPage4(imageFile, dentalRecordId);
            console.log(`Page 4 ${result?.success ? "success" : "failed"}!`);
          }

          // Merge extracted data from this page
          if (result?.success && result.extractedData) {
            console.log(
              `Merging data from Page ${pageNum}:`,
              result.extractedData
            );
            Object.assign(allExtractedData, result.extractedData);
          } else if (result && !result.success) {
            if (result?.success) {
              console.log(`Page ${pageNum} completed (no extractable data)`);
            } else {
              console.error(`Page ${pageNum} failed`, result?.error);
            }
            // Continue to next page even if one fails
          }
        }

        console.log(
          "All pages processed! Total extracted data:",
          allExtractedData
        );

        // Flatten all extracted data and set to store
        const flattenedData = flattenExtractedData(allExtractedData);
        console.log("Flattened data:", flattenedData);
        setExtractedData(flattenedData);
        setAppState("verification");
      } catch (error) {
        console.error("Error processing pages:", error);
        alert("Failed to process some pages. Please try again.");
        setAppState("empty");
      }
    },
    [setAppState, setExtractedData]
  );

  const handleFile = useCallback(
    async (file: File) => {
      if (!file) return;

      // Check if it's an image or PDF (basic validation)
      if (!file.type.match("image.*") && !file.type.match("application/pdf")) {
        alert("Please upload an image or PDF file.");
        return;
      }

      // Validate based on upload mode
      if (localUploadMode === "pdf" && !file.type.match("application/pdf")) {
        alert("Please upload a PDF file in PDF mode.");
        return;
      }

      if (localUploadMode === "images" && !file.type.match("image.*")) {
        alert("Please upload image files in Images mode.");
        return;
      }

      console.log("File received:", file.name); // Debugging

      // Set upload mode and process file
      if (localUploadMode === "pdf") {
        setUploadMode("pdf");
        setAppState("loading");

        try {
          // Process PDF and extract pages
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
          const maxPages = Math.min(pdf.numPages, 4);
          const pageImages: string[] = [];

          for (let i = 1; i <= maxPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.2 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            if (context) {
              await page.render({
                canvasContext: context,
                viewport: viewport,
                canvas,
              }).promise;
              const imageUrl = canvas.toDataURL("image/png");
              pageImages.push(imageUrl);
            }
          }

          setSeparatedPages(pageImages);

          // NEW: Process all pages sequentially
          await processAllPages(pageImages);
        } catch (error) {
          console.error("PDF processing error:", error);
          alert("Failed to process PDF. Please try again.");
          setAppState("empty");
        }
      } else {
        setUploadMode("images");

        // For image mode, read the file and send to backend
        const reader = new FileReader();
        reader.onload = async (e) => {
          const imageUrl = e.target?.result as string;
          setSeparatedPages([imageUrl]);
          setAppState("loading");

          try {
            // NEW: Process all pages (for now just 1 image, but supports multiple)
            await processAllPages([imageUrl]);
          } catch (error) {
            console.error("Image upload error:", error);
            alert("Failed to upload image. Please try again.");
            setAppState("empty");
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [
      localUploadMode,
      setUploadMode,
      setAppState,
      setSeparatedPages,
      processAllPages,
    ]
  );

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      if (!files || files.length === 0) return;

      // PDF Mode: Expect single file
      if (localUploadMode === "pdf") {
        if (files.length > 1) {
          alert("Please upload only ONE PDF file.");
          return;
        }
        const file = files[0];
        if (!file.type.match("application/pdf")) {
          alert("Please upload a valid PDF file.");
          return;
        }
        await handleFile(file); // Reuse existing single-file PDF handler
        return;
      }

      // Images Mode: Handle multiple files
      if (localUploadMode === "images") {
        const imageFiles = Array.from(files).filter((f) =>
          f.type.match("image.*")
        );

        if (imageFiles.length !== 4) {
          alert(
            `Please upload exactly 4 images for the complete dental chart (found ${imageFiles.length}).`
          );
          return;
        }

        // Sort by name ensures Page 1 -> Page 2 order if named correctly
        imageFiles.sort((a, b) => a.name.localeCompare(b.name));

        setAppState("loading");
        setUploadMode("images");

        try {
          const imageUrls: string[] = [];
          for (const file of imageFiles) {
            const url = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve(e.target?.result as string);
              reader.readAsDataURL(file);
            });
            imageUrls.push(url);
          }

          setSeparatedPages(imageUrls);
          await processAllPages(imageUrls);
        } catch (error) {
          console.error("Image processing error:", error);
          alert("Failed to process images.");
          setAppState("empty");
        }
      }
    },
    [
      localUploadMode,
      setUploadMode,
      setAppState,
      setSeparatedPages,
      processAllPages,
      handleFile,
    ]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto mt-6 sm:mt-10 space-y-6">
      {/* Upload Mode Selector */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-primary mb-4 text-center">
          Choose Upload Method
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* PDF Mode */}
          <button
            onClick={() => handleModeChange("pdf")}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              localUploadMode === "pdf"
                ? "border-primary bg-primary-light shadow-md"
                : "border-gray-200 hover:border-primary hover:bg-gray-50"
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  localUploadMode === "pdf" ? "bg-primary" : "bg-gray-200"
                }`}
              >
                <FileText
                  className={`w-6 h-6 ${
                    localUploadMode === "pdf" ? "text-white" : "text-gray-600"
                  }`}
                />
              </div>
              <div className="text-center">
                <p className="font-bold text-primary">Single PDF File</p>
                <p className="text-xs text-text-secondary mt-1">
                  Upload one 4-page PDF document
                </p>
              </div>
            </div>
          </button>

          {/* Images Mode */}
          <button
            onClick={() => handleModeChange("images")}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              localUploadMode === "images"
                ? "border-primary bg-primary-light shadow-md"
                : "border-gray-200 hover:border-primary hover:bg-gray-50"
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  localUploadMode === "images" ? "bg-primary" : "bg-gray-200"
                }`}
              >
                <Images
                  className={`w-6 h-6 ${
                    localUploadMode === "images"
                      ? "text-white"
                      : "text-gray-600"
                  }`}
                />
              </div>
              <div className="text-center">
                <p className="font-bold text-primary">4 Separate Images</p>
                <p className="text-xs text-text-secondary mt-1">
                  Upload 4 individual image files
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Page Information Guide */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-primary mb-4 text-center">
          {localUploadMode === "pdf"
            ? "Your PDF should contain these 4 pages:"
            : "Upload all 4 page images at once:"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PAGE_LABELS.map((pageInfo) => (
            <div
              key={pageInfo.page}
              className="flex gap-3 p-3 rounded-lg bg-bg-secondary border border-gray-100"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                {pageInfo.page}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-primary text-sm">
                  {pageInfo.title}
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  {pageInfo.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Upload Zone */}
      <div
        ref={uploadZoneRef}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`
            relative border-2 border-dashed rounded-xl py-16 sm:py-24 transition-all duration-200 ease-in-out
            flex flex-col items-center justify-center cursor-pointer bg-white
            ${
              isDragging
                ? "border-accent bg-accent-light scale-[1.02]"
                : "border-border-default hover:border-primary"
            }
          `}
      >
        <input
          type="file"
          accept={localUploadMode === "pdf" ? "application/pdf" : "image/*"}
          multiple={localUploadMode === "images"} // ENABLE MULTIPLE FOR IMAGES
          onChange={onFileInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="w-16 h-16 sm:w-20 sm:h-20 text-accent flex items-center justify-center mb-4">
          <Upload className="w-12 h-12 sm:w-16 sm:h-16" strokeWidth={1.5} />
        </div>

        <p className="text-base sm:text-lg font-medium text-primary px-4 text-center">
          {isDragging
            ? "Drop it like it's hot! 🔥"
            : "Click to upload or drag and drop"}
        </p>
        <p className="text-xs sm:text-sm text-text-secondary mt-2">
          {localUploadMode === "pdf"
            ? "PDF file (max. 10MB)"
            : "PNG, JPG, or SVG (max. 10MB per file)"}
        </p>
      </div>
    </div>
  );
};
