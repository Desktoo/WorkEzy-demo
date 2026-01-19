import { uploadFile } from "@/lib/supabase/upload";
import axios from "axios";
import { EmployerRegistrationFormValues } from "@/lib/validations/frontend/employer.schema";

type EmployerRegistrationPayload = Omit<
  EmployerRegistrationFormValues,
  "companyLogo" | "panCard" | "gstCertificate"
> & {
  companyLogo: string | null;
  panCard: string | null;
  gstCertificate: string | null;
};

type EmployerUpdatePayload = Partial<
  Omit<
    EmployerRegistrationFormValues,
    "companyLogo" | "panCard" | "gstCertificate"
  >
> & {
  companyLogo?: string | null;
  panCard?: string | null;
  gstCertificate?: string | null;
};

export async function submitEmployerRegistration(
  data: EmployerRegistrationFormValues
): Promise<void> {
  try {
    // -------------------------------
    // Upload company logo
    // -------------------------------
    const companyLogo =
      data.companyLogo instanceof File
        ? await uploadFile(data.companyLogo, {
            bucket: "WorkEzy-Storage",
            folder: "employer/logos",
            fileCategory: "image",
            maxSizeMB: 2,
          })
        : null;

    // -------------------------------
    // Upload PAN card
    // -------------------------------
    const panCard =
      data.panCard instanceof File
        ? await uploadFile(data.panCard, {
            bucket: "WorkEzy-Storage",
            folder: "employer/pan-cards",
            fileCategory: "document",
            makePublic: false,
          })
        : null;

    // -------------------------------
    // Upload GST certificate
    // -------------------------------
    const gstCertificate =
      data.gstCertificate instanceof File
        ? await uploadFile(data.gstCertificate, {
            bucket: "WorkEzy-Storage",
            folder: "employer/gst-certificates",
            fileCategory: "document",
            makePublic: false,
          })
        : null;

    // -------------------------------
    // Build backend-safe payload
    // -------------------------------
    const payload: EmployerRegistrationPayload = {
      ...data,
      companyLogo: companyLogo?.url ?? null,
      panCard: panCard?.path ?? null,
      gstCertificate: gstCertificate?.path ?? null,
    };

    console.log("Employer registration payload →", payload);

    // -------------------------------
    // Backend API call
    // -------------------------------
    await axios.post("/api/employer", payload);
  } catch (error: unknown) {
    // -------------------------------
    // Axios-specific error logging
    // -------------------------------
    if (axios.isAxiosError(error)) {
      console.error("Employer registration API error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      throw new Error(
        error.response?.data?.message ||
          "Failed to submit employer registration"
      );
    }

    // -------------------------------
    // Upload or unknown error
    // -------------------------------
    console.error("Employer registration error:", error);
    throw error instanceof Error
      ? error
      : new Error("Unknown employer registration error");
  }
}



export async function updateEmployerProfile(
  data: EmployerRegistrationFormValues
): Promise<void> {
  try {
    const payload: EmployerUpdatePayload = {};

    /* -------------------------------
     Company Logo (optional)
    -------------------------------- */
    if (data.companyLogo instanceof File) {
      const uploadedLogo = await uploadFile(data.companyLogo, {
        bucket: "WorkEzy-Storage",
        folder: "employer/logos",
        fileCategory: "image",
        maxSizeMB: 2,
      });

      payload.companyLogo = uploadedLogo?.url ?? null;
    }

    /* -------------------------------
     PAN Card (optional)
    -------------------------------- */
    if (data.panCard instanceof File) {
      const uploadedPan = await uploadFile(data.panCard, {
        bucket: "WorkEzy-Storage",
        folder: "employer/pan-cards",
        fileCategory: "document",
        makePublic: false,
      });

      payload.panCard = uploadedPan?.path ?? null;
    }

    /* -------------------------------
     GST Certificate (optional)
    -------------------------------- */
    if (data.gstCertificate instanceof File) {
      const uploadedGst = await uploadFile(data.gstCertificate, {
        bucket: "WorkEzy-Storage",
        folder: "employer/gst-certificates",
        fileCategory: "document",
        makePublic: false,
      });

      payload.gstCertificate = uploadedGst?.path ?? null;
    }

    /* -------------------------------
     Copy remaining non-file fields
    -------------------------------- */
    const nonFileFields = [
      "fullName",
      "email",
      "gender",
      "designation",
      "companyName",
      "industry",
      "numOfEmployees",
      "socialMedia",
      "city",
      "state",
    ] as const;

    nonFileFields.forEach((key) => {
      payload[key] = data[key];
    });

    payload.country = "India";

    console.log("Employer update payload →", payload);

    /* -------------------------------
     PATCH API call
    -------------------------------- */
    await axios.patch("/api/employer", payload);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Employer update API error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      throw new Error(
        error.response?.data?.message ||
          "Failed to update employer profile"
      );
    }

    console.error("Employer update error:", error);

    throw error instanceof Error
      ? error
      : new Error("Unknown employer update error");
  }
}
