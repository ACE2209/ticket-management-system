/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = "http://localhost:8080/api";
const REFRESH_URL = `${BASE_URL}/auth/refresh`;

/**
 * 🧩 Lấy token từ localStorage
 */
function getAccessToken() {
  return localStorage.getItem("access_token");
}

function getRefreshToken() {
  return localStorage.getItem("refresh_token");
}

/**
 * 🧩 Hàm refresh access token nếu hết hạn
 */
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(REFRESH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) {
      console.warn("❌ Refresh token invalid or expired");
      localStorage.clear();
      return null;
    }

    const data = await res.json();

    const newAccess = data.data?.access_token || data.access_token;
    const newRefresh = data.data?.refresh_token || data.refresh_token;

    if (newAccess) localStorage.setItem("access_token", newAccess);
    if (newRefresh) localStorage.setItem("refresh_token", newRefresh);

    console.log("🔄 Token refreshed!");
    return newAccess;
  } catch (err) {
    console.error("⚠️ Error refreshing token:", err);
    return null;
  }
}

/**
 * ✅ Hàm fetch có tự động xử lý token + refresh khi 401
 */

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  base: string = BASE_URL
): Promise<any> {
  let token = getAccessToken();

  let res = await fetch(`${base}${endpoint}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });

  // Nếu token hết hạn
  if (res.status === 401) {
    console.log("🔁 Token expired, refreshing...");
    token = await refreshAccessToken();
    // Nếu không có token mới thì chuyển về trang đăng nhập
    if (!token) {
      window.location.href = "/sign_auth/signin";
      throw new Error("Unauthorized - cannot refresh token");
    }

    // Gọi lại request sau khi refresh
    res = await fetch(`${base}${endpoint}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }
  // Nếu vẫn không thành công thì báo lỗi
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API error ${res.status}: ${errText}`);
  }

  return res.json();
}
