import { t } from "@lingui/macro";
import { GithubLogo, GoogleLogo, LinkedinLogo, FacebookLogo } from "@phosphor-icons/react";
import { Button } from "@reactive-resume/ui";

import { useAuthProviders } from "@/client/services/auth/providers";

export const SocialAuth = () => {
  const { providers } = useAuthProviders();

  if (!providers || providers.length === 0) return null;

  // for some reason the Github button did not show up when running local mode
  // remember to remove ! when deployed
  return (
    <div className="grid grid-cols-2 gap-4">
      {!providers.includes("github") && (
        <Button asChild size="lg" className="w-full !bg-[#222] !text-white hover:!bg-[#222]/80">
          <a href="/api/auth/github">
            <GithubLogo className="mr-3 size-4" />
            {t`GitHub`}
          </a>
        </Button>
      )}

      {providers.includes("google") && (
        <Button
          asChild
          size="lg"
          className="w-full !bg-[#4285F4] !text-white hover:!bg-[#4285F4]/80"
        >
          <a href="/api/auth/google">
            <GoogleLogo className="mr-3 size-4" />
            {t`Google`}
          </a>
        </Button>
      )}

    {providers.includes("linkedin") && (
        <Button
          asChild
          size="lg"
          className="w-full !bg-[#0a66c2] !text-white hover:!bg-[#0a66c2]/80"
        >
          <a href="/api/auth/linkedin">
            <LinkedinLogo className="mr-3 size-4" />
            {t`Linkedin`}
          </a>
        </Button>
      )}

    {providers.includes("facebook") && (
        <Button
          asChild
          size="lg"
          className="w-full !bg-[#1877F2] !text-white hover:!bg-[#1877F2]/80"
        >
          <a href="/api/auth/facebook">
            <FacebookLogo className="mr-3 size-4" />
            {t`Facebook`}
          </a>
        </Button>
      )}
    </div>
  );
};
