import React from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

export default function Afs_Button({
  loading,
  label,
}: {
  loading: boolean;
  label: string;
}) {
  return (
    <Button disabled={loading} type="submit">
      {loading ? <Loader2 className="animate-spin" /> : label}
    </Button>
  );
}
