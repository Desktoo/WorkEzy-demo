import { CheckCircle } from "lucide-react";

export default async function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center gap-6 bg-background py-12 px-4">
      {/* Thank you card */}
      <div className="flex items-center justify-center">
        <div className="max-w-md w-full text-center bg-white border rounded-xl p-8 shadow-sm">
          <CheckCircle className="mx-auto h-14 w-14 text-green-600 mb-4" />

          <h1 className="text-2xl font-semibold mb-2">
            Thank you for applying!
          </h1>

          <p className="text-sm text-muted-foreground">
            Your application has been successfully submitted.
            <br />
            The employer will review your profile and contact you if
            shortlisted.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center">
        <label className="text-base text-gray-400 font-base">
          powered by <span className="font-bold text-black">Work</span>
          <span className="text-[#BE4145] font-bold">Ezy</span>
        </label>
      </div>
    </div>
  );
}
