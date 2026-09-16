"use client";

/**
 * The navbar's account control.
 *
 * `useSession()` is Better Auth's own reactive hook — the session lives in a
 * first-party cookie set by the `auth` service, so it persists across tabs
 * and visits (sign up once, and every later visit is already signed in).
 */

import { LogIn, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient, useSession } from "@/lib/auth/client";

export function SignIn(): React.ReactElement {
  const { data, isPending } = useSession();

  // Hold the space until the session resolves, so the navbar does not jump.
  if (isPending) return <div className="h-8 w-20" aria-hidden />;

  if (data === null || data === undefined) {
    return (
      <Button variant="outline" size="sm" asChild>
        <a href="/sign-in">
          <LogIn className="size-4" aria-hidden />
          Sign in
        </a>
      </Button>
    );
  }

  const label = data.user.name || data.user.email;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={`Signed in as ${label}`}>
          <User className="size-4" aria-hidden />
          <span className="max-w-32 truncate">{label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <span className="block truncate text-sm font-medium">{label}</span>
          {data.user.email !== label ? (
            <span className="text-muted-foreground block truncate text-xs">{data.user.email}</span>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            void authClient.signOut().then(() => window.location.reload());
          }}
        >
          <LogOut className="size-4" aria-hidden />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
