import PricingCard from "@/components/cards/PricingCard";
import { prisma } from "@/lib/prisma";

export default async function PricingPage() {
  const plans = await prisma.plan.findMany({
    select: {
      id: true,
      name: true,
      price: true,
    },
    orderBy: {
      price: "asc",
    },
  });

  // Optional: map plans by name for safety
  const standardPlan = plans.find(p => p.name === "Standard");
  const premiumPlan = plans.find(p => p.name === "Premium");

  return (
    <div className="w-full min-h-screen my-5">
      {/* Header */}
      <div className="border-b pb-4 mb-10 px-4">
        <h1 className="text-2xl font-bold">Pricing</h1>
      </div>

      {/* Cards */}
      <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
        {/* Standard Plan */}
        {standardPlan && (
          <PricingCard
            planId={standardPlan.id}
            title={standardPlan.name}
            price={standardPlan.price}
            durationText="job post"
            description="Everything you need to start posting a job and find candidates."
            features={[
              {
                label: "Job post active for 15 days",
                available: true,
                highlight: true,
              },
              {
                label: "Receive up to 30 relevant candidates",
                available: true,
                highlight: true,
              },
              {
                label: "Instant Hiring Poster",
                available: true,
              },
              {
                label: "AI Voice Screening",
                available: false,
              },
            ]}
          />
        )}

        {/* Premium Plan */}
        {premiumPlan && (
          <PricingCard
            planId={premiumPlan.id}
            title={premiumPlan.name}
            price={premiumPlan.price}
            durationText="job post"
            description="Supercharge your hiring with our AI-powered screening technology."
            primary
            recommended
            features={[
              {
                label: "Job post active for 15 days",
                available: true,
                highlight: true,
              },
              {
                label: "Receive up to 30 relevant candidates",
                available: true,
                highlight: true,
              },
              {
                label: "Instant Hiring Poster",
                available: true,
              },
              {
                label: "AI Voice Screening (10 Credits)",
                available: true,
                highlight: true,
              },
              {
                label: "Get Verified Shortlists",
                available: true,
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}
