export interface Profile {
  id: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  age_confirmed_18: boolean;
  quiet_mode: boolean;
  digest_frequency: "off" | "daily" | "weekly";
  created_at: string;
  updated_at: string;
}
