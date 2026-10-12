import { OAuthCallback } from "@/components/oauth-callback";

/**
 * Muse AI's agent ("Rumi") registered itself with this exact callback path
 * (found live 2026-10-12), so the same paste-back page answers here too.
 */
export default function RumiOAuthCallbackPage(): React.ReactElement {
  return <OAuthCallback />;
}
