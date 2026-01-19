import { Card, CardContent } from "@/components/ui/card";

export function NoJobFoundCard() {
  return (
    <Card className="w-full max-w-3xl">
      <CardContent className="p-6 md:p-8 space-y-3">
        <h2 className="text-xl font-bold">Job Not Found</h2>
        <p className="text-muted-foreground">
          The job you are trying to apply for is no longer available or the link
          is invalid.
        </p>
      </CardContent>
    </Card>
  );
}
