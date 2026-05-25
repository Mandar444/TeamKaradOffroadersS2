"use client";

import Link from "next/link";
import { useRegistrationDeadline } from "@/lib/use-registration-deadline";

export default function RegistrationLink(props) {
  const { isRegistrationOpen } = useRegistrationDeadline();

  if (!isRegistrationOpen) {
    return null;
  }

  return <Link {...props} />;
}
