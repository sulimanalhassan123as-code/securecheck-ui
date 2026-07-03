import { supabase } from "./supabaseClient";

// Keeps a lightweight cached copy of the signed-in user's identity in
// localStorage so any page (scanner, admin, etc.) can read it instantly
// without an async round-trip to Supabase.

const KEY = "sc_auth_user";

function cacheUser(session) {
  if (!session || !session.user) {
    localStorage.removeItem(KEY);
    return;
  }
  const u = session.user;
  const meta = u.user_metadata || {};
  const identity = {
    id: u.id,
    email: u.email || null,
    name: meta.full_name || meta.name || u.email || "Operator",
    avatarUrl: meta.avatar_url || meta.picture || null,
  };
  localStorage.setItem(KEY, JSON.stringify(identity));
}

// Call once, at app startup (main.jsx), so the cache stays in sync
// with sign-in / sign-out / token refresh events.
export function initAuthSync() {
  supabase.auth.getSession().then(({ data }) => cacheUser(data.session));
  supabase.auth.onAuthStateChange((_event, session) => cacheUser(session));
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function signInWithGoogle(redirectPath = "/dashboard") {
  const redirectTo = `${window.location.origin}${redirectPath}`;
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
}

export async function signOut() {
  await supabase.auth.signOut();
  localStorage.removeItem(KEY);
}
