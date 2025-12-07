const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const auth = {
  async login(email, password) {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    const res = await fetch(`${API_URL}/token`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || "Login failed");
    }

    const data = await res.json();
    if (typeof window !== "undefined") {
        localStorage.setItem("token", data.access_token);
    }
    return data;
  },

  async register(email, password, firstName, lastName) {
    const params = new URLSearchParams({
        email: email,
        password: password,
        first_name: firstName || "",
        last_name: lastName || ""
    });
    const res = await fetch(`${API_URL}/register?${params.toString()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Registration failed");
    }
    return await res.json();
  },

  logout() {
    if (typeof window !== "undefined") {
        localStorage.removeItem("token");
    }
    window.location.href = "/login";
  },

  getToken() {
    if (typeof window !== "undefined") {
        return localStorage.getItem("token");
    }
    return null;
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};
