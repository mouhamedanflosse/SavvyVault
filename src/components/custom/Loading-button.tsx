import React from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

export default function Afs_Button({
  loading,
  label,
  className
}: {
  loading: boolean;
  label: string;
  className? : string
}) {
  return (
    <Button className={className} disabled={loading} type="submit">
      {loading ? <Loader2 className="animate-spin" /> : label}
    </Button>
  );
}
