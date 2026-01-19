import { prisma } from "@/lib/prisma";
import { candidateBackendSchema, candidateBackendPatchSchema } from "@/lib/validations/backend/candidateApplyBackend.schema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = candidateBackendSchema.parse(body);

    console.log("this is the data before going to DB", validatedData)

    const candidate = await prisma.candidate.create({
      data: validatedData,
    });

    return NextResponse.json({ success: true, candidate }, { status: 201 });
  } catch (error: unknown) {
    console.log("this is the error: ", error)
    console.error("Employer POST error:", error);

    if (error instanceof ZodError) {
      console.error("Zod validation issues:", error.issues);

      return NextResponse.json(
        {
          success: false,
          message: "Invalid input data",
          issues: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create employer" },
      { status: 500 }
    );
  }
}

// export async function PATCH(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const candidateId = params.id;
//     const body = await req.json();

//     const validatedData =
//       candidateBackendPatchSchema.parse(body);

//     if (Object.keys(validatedData).length === 0) {
//       return NextResponse.json(
//         { message: "No fields provided to update" },
//         { status: 400 }
//       );
//     }

//     // 🔐 Check permission
//     const candidate = await prisma.candidate.findUnique({
//       where: { id: candidateId },
//       select: { canUpdateDetails: true },
//     });

//     if (!candidate?.canUpdateDetails) {
//       return NextResponse.json(
//         { message: "You can update details only once" },
//         { status: 403 }
//       );
//     }

//     // ✅ Update + lock further updates
//     const updatedCandidate = await prisma.candidate.update({
//       where: { id: candidateId },
//       data: {
//         ...validatedData,
//         canUpdateDetails: false,
//       },
//     });

//     return NextResponse.json(
//       { success: true, candidate: updatedCandidate },
//       { status: 200 }
//     );
//   } catch (error) {
//     if (error instanceof ZodError) {
//       return NextResponse.json(
//         { message: "Invalid input", issues: error.issues },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { message: "Failed to update candidate" },
//       { status: 500 }
//     );
//   }
// }

