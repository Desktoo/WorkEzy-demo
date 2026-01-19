"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Link as LinkIcon } from "lucide-react";
import toast from "react-hot-toast";

export function ShareableLinkCard({ applyUrl }: { applyUrl: string }) {
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(applyUrl);
    toast.success("Link copied to clipboard");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <LinkIcon className="h-5 w-5" />
          Shareable Application Link
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Share this link with candidates to apply for this job.
        </p>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-2">
          <Input readOnly value={applyUrl} />
          <Button variant="outline" size="icon" onClick={copyToClipboard}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.open(applyUrl, "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
