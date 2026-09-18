"use client";

import { useEffect, useState } from "react";
import {
  X,
  UserRound,
  Mail,
  Phone,
  Pencil,
  Check,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Profile {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
}

export default function AccountModal({ isOpen, onClose }: AccountModalProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;

    const loadProfile = async () => {
      try {
        setIsLoading(true);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          if (mounted) {
            toast.error("Please login to view your account.");
            onClose();
          }
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, email, phone, avatar_url")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Failed to load account profile:", error);
          toast.error("Unable to load your profile.");
          return;
        }

        if (!mounted) return;

        const metadata = user.user_metadata ?? {};

        const resolvedProfile: Profile = {
          full_name:
            data?.full_name || metadata.full_name || metadata.name || null,
          email: data?.email || user.email || null,
          phone: data?.phone || metadata.phone || null,
          avatar_url:
            data?.avatar_url || metadata.avatar_url || metadata.picture || null,
        };

        setProfile(resolvedProfile);
        setFullName(resolvedProfile.full_name || "");
        setPhone(resolvedProfile.phone || "");
      } catch (error) {
        console.error("Account profile error:", error);
        if (mounted) {
          toast.error("Something went wrong while loading your account.");
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving) onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSaving, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleSave = async () => {
    if (isSaving) return;

    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      toast.error("Please enter your full name.");
      return;
    }

    try {
      setIsSaving(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Your session has expired. Please login again.");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .update({
          full_name: trimmedName,
          phone: trimmedPhone || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select("full_name, email, phone, avatar_url")
        .single();

      if (error) {
        console.error("Failed to update profile:", error);
        toast.error(error.message || "Unable to update your profile.");
        return;
      }

      setProfile(data);
      setFullName(data.full_name || "");
      setPhone(data.phone || "");
      setIsEditing(false);
      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Something went wrong while updating your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const profileName = profile?.full_name || "Your Name";
  const profileEmail = profile?.email || "No email address";
  const avatarUrl = profile?.avatar_url || null;
  const initials = profileName.trim().charAt(0).toUpperCase() || "U";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="backstore-account-title"
        className="relative w-full max-w-[430px] overflow-hidden rounded-[24px] border border-[#CBCAC8]/15 bg-[#161616] text-[#CBCAC8] shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close account"
          disabled={isSaving}
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#CBCAC8]/10 bg-[#222] text-[#CBCAC8] transition hover:bg-[#DA0D12] hover:text-white disabled:opacity-50"
        >
          <X size={16} />
        </button>

        <div className="border-b border-[#CBCAC8]/10 bg-[#DA0D12] px-6 py-6">
          <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-white/70">
            THE BACKSTORE
          </p>
          <h2
            id="backstore-account-title"
            className="mt-1 text-[24px] font-bold uppercase tracking-[0.04em] text-white"
          >
            My Account
          </h2>
          <p className="mt-1 text-[10px] text-white/70">
            Manage your account details.
          </p>
        </div>

        <div className="max-h-[80vh] overflow-y-auto px-6 py-6">
          <div className="flex items-center gap-4 rounded-2xl border border-[#CBCAC8]/10 bg-[#0d0d0d] p-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#DA0D12]/40 bg-[#DA0D12] text-xl font-bold text-white">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={profileName}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                initials
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-bold text-[#CBCAC8]">
                {profileName}
              </p>
              <p className="mt-1 truncate text-[10px] text-[#666362]">
                {profileEmail}
              </p>
              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#DA0D12]/10 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#DA0D12]">
                <ShieldCheck size={10} />
                Verified account
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex min-h-[180px] items-center justify-center">
              <Loader2 className="animate-spin text-[#DA0D12]" size={24} />
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#CBCAC8]">
                  Personal Details
                </h3>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#CBCAC8]/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#CBCAC8] transition hover:border-[#DA0D12]/40 hover:text-[#DA0D12]"
                  >
                    <Pencil size={11} />
                    Edit
                  </button>
                )}
              </div>

              <div>
                <label
                  htmlFor="backstore-account-name"
                  className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.12em] text-[#666362]"
                >
                  Full Name
                </label>
                <div className="relative">
                  <UserRound
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666362]"
                  />
                  <input
                    id="backstore-account-name"
                    value={fullName}
                    disabled={!isEditing}
                    onChange={(event) => setFullName(event.target.value)}
                    className="h-11 w-full rounded-xl border border-[#CBCAC8]/10 bg-[#0d0d0d] pl-10 pr-3 text-[11px] text-[#CBCAC8] outline-none focus:border-[#DA0D12]/50 disabled:opacity-70"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="backstore-account-email"
                  className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.12em] text-[#666362]"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666362]"
                  />
                  <input
                    id="backstore-account-email"
                    value={profileEmail}
                    disabled
                    className="h-11 w-full rounded-xl border border-[#CBCAC8]/10 bg-[#0d0d0d] pl-10 pr-3 text-[11px] text-[#666362] outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="backstore-account-phone"
                  className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.12em] text-[#666362]"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666362]"
                  />
                  <input
                    id="backstore-account-phone"
                    value={phone}
                    disabled={!isEditing}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Enter your phone number"
                    className="h-11 w-full rounded-xl border border-[#CBCAC8]/10 bg-[#0d0d0d] pl-10 pr-3 text-[11px] text-[#CBCAC8] outline-none focus:border-[#DA0D12]/50 disabled:opacity-70"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => {
                      setFullName(profile?.full_name || "");
                      setPhone(profile?.phone || "");
                      setIsEditing(false);
                    }}
                    className="h-11 flex-1 rounded-xl border border-[#CBCAC8]/10 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#666362] hover:bg-[#CBCAC8]/5 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={handleSave}
                    className="flex h-11 flex-[1.5] items-center justify-center gap-2 rounded-xl bg-[#DA0D12] text-[9px] font-semibold uppercase tracking-[0.1em] text-white hover:bg-[#80060B] disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Check size={14} />
                    )}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
