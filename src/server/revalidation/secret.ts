interface SecretEnv {
  NEXT_REVALIDATE_TAGS_SECRET?: string;
  PAYLOAD_SECRET: string;
}

export const REVALIDATE_SECRET_HEADER = "x-revalidate-secret";

// A dedicated secret when set, else Payload's own.
export const revalidateSecret = (source: SecretEnv): string =>
  source.NEXT_REVALIDATE_TAGS_SECRET ?? source.PAYLOAD_SECRET;
