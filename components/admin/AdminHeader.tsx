"use client";

import { useState } from "react";

function BellIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21c.8-4 3.3-6 7.5-6s6.7 2 7.5 6" />
    </svg>
  );
}

export default function AdminHeader() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="fixed left-[240px] right-0 top-0 z-40 h-[72px] border-b border-[#e5e7eb] bg-white">
      <div className="flex h-full items-center justify-between px-7">
        {/* Left */}
        <div>
          <h1 className="text-[17px] font-semibold tracking-[-0.02em] text-[#17233a]">
            The Backstore Admin
          </h1>

          <p className="mt-[1px] text-[12px] text-[#71809a]">
            Manage your store efficiently
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">
          {/* Notification */}
          <div className="relative">
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#17233a] transition-colors hover:bg-[#f4f6f8]"
            >
              <BellIcon />

              {/* Notification indicator */}
              <span className="absolute right-[7px] top-[6px] h-[7px] w-[7px] rounded-full bg-[#ff2d32]" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-[48px] w-[300px] overflow-hidden rounded-[14px] border border-[#e5e7eb] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.10)]">
                <div className="border-b border-[#edf0f3] px-4 py-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[14px] font-semibold text-[#17233a]">
                      Notifications
                    </h3>

                    <span className="rounded-full bg-[#fff0f0] px-2 py-1 text-[10px] font-semibold text-[#ff2d32]">
                      1 New
                    </span>
                  </div>
                </div>

                <div className="px-4 py-4">
                  <div className="flex gap-3">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#ff2d32]" />

                    <div>
                      <p className="text-[13px] font-medium text-[#17233a]">
                        New cancellation request
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-[#71809a]">
                        A customer has requested an order cancellation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#edf0f3] px-4 py-3">
                  <button
                    type="button"
                    className="text-[12px] font-semibold text-[#17233a] hover:underline"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-[#e5e7eb]" />

          {/* Admin profile */}
          <div className="flex items-center gap-3">
            <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full border-2 border-[#52627a] text-[#52627a]">
              <UserIcon />
            </div>

            <div className="hidden leading-tight sm:block">
              <p className="text-[13px] font-semibold text-[#17233a]">Admin</p>

              <p className="mt-1 text-[10px] text-[#71809a]">administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
