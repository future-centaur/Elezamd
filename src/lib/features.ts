export const FEATURES = {
  VOICE: process.env.NEXT_PUBLIC_FEATURE_VOICE === "true",
  TIDY: process.env.NEXT_PUBLIC_FEATURE_TIDY === "true",
  SHARE_LINK: process.env.NEXT_PUBLIC_FEATURE_SHARE_LINK !== "false",
};
