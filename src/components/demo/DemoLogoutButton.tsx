"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { DEMO_COOKIE, DEMO_EMAIL_COOKIE, DEMO_ITEMS_KEY, DEMO_OUTFITS_KEY } from "@/lib/demo/constants";
import { removeKey } from "@/lib/demo/storage";

function clearCookie(name: string) {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function DemoLogoutButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={() => {
        clearCookie(DEMO_COOKIE);
        clearCookie(DEMO_EMAIL_COOKIE);
        removeKey(DEMO_ITEMS_KEY);
        removeKey(DEMO_OUTFITS_KEY);
        router.push("/");
        router.refresh();
      }}
    >
      Logout
    </Button>
  );
}



