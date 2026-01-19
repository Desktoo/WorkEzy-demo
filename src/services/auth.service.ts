"use client";

import { useSignIn, useSignUp } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

type AuthResult = {
  success: true;
  isNewUser: boolean;
};

export const useAuthService = () => {
  const {
    signIn,
    isLoaded: signInLoaded,
    setActive: setSignInActive,
  } = useSignIn();

  const {
    signUp,
    isLoaded: signUpLoaded,
    setActive: setSignUpActive,
  } = useSignUp();

  /* ----------------------------------
     SEND OTP
     (Clerk decides sign-in vs sign-up)
  ---------------------------------- */
  const sendEmailOtp = async (email: string) => {
    if (!signInLoaded || !signUpLoaded) {
      throw new Error("Clerk not ready");
    }

    try {
      // Try SIGN-IN first
      const attempt = await signIn.create({ identifier: email });

      const emailFactor = attempt.supportedFirstFactors?.find(
        (f) => f.strategy === "email_code"
      );

      if (!emailFactor || !("emailAddressId" in emailFactor)) {
        throw new Error("Email OTP factor missing");
      }

      await signIn.prepareFirstFactor({
        strategy: "email_code",
        emailAddressId: emailFactor.emailAddressId,
      });

      console.log("📨 OTP sent via SIGN-IN");
    } catch (error) {
      // If user doesn't exist → SIGN-UP
      if (
        isClerkAPIResponseError(error) &&
        error.errors?.[0]?.code === "form_identifier_not_found"
      ) {
        await signUp.create({ emailAddress: email });

        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        console.log("📨 OTP sent via SIGN-UP");
      } else {
        throw error;
      }
    }
  };

  /* ----------------------------------
     VERIFY OTP
     (Status-driven, no refs)
  ---------------------------------- */
  const verifyEmailOtp = async (code: string): Promise<AuthResult> => {
  if (!signInLoaded || !signUpLoaded) throw new Error("Clerk not ready");

  try {
    // 1. ALWAYS TRY SIGN-IN FIRST (Existing users)
    // Only proceed if it is actually waiting for a factor
    if (signIn.status === "needs_first_factor") {
      console.log("✅ Verifying fresh SIGN-IN OTP");
      const result = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code,
      });

      if (result.status === "complete") {
        await setSignInActive({ session: result.createdSessionId });
        return { success: true, isNewUser: false };
      }
    }

    // 2. ONLY TRY SIGN-UP IF SIGN-IN IS NOT WAITING
    if (signUp.status === "missing_requirements") {
      console.log("✅ Verifying fresh SIGN-UP OTP");
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === "complete") {
        await setSignUpActive({ session: result.createdSessionId });
        return { success: true, isNewUser: true };
      }
    }

    throw new Error("No active verification session found.");
  } catch (error) {
    if (isClerkAPIResponseError(error)) {
      console.error("CLERK ERROR DETAILS:", error.errors[0].longMessage);
      throw new Error(error.errors[0].longMessage);
    }
    throw error;
  }
};

  return {
    sendEmailOtp,
    verifyEmailOtp,
  };
};
