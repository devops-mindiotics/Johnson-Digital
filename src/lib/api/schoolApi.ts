import apiClient from "./client";
import { setTokens, setJWT } from "@/lib/utils/token";
import type { SchoolCreateResponse } from "@/types/school/schoolCreateResponse";
import { API_BASE_URL } from "@/lib/utils/constants";
import { saveRoles } from "@/lib/utils/getRole";
import axios from "axios";

export async function createSchool(
  tenantId: string,
  schoolPayload: any
): Promise<SchoolCreateResponse> {
  try {
    const token = localStorage.getItem("sessionJWT");

    if (!token) throw new Error("User not authenticated");

    const response = await axios.post(
      `${API_BASE_URL}/tenants/${tenantId}/schools`,
      schoolPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (err: any) {
    console.error("❌ createSchool error:", err.response?.data || err.message);
    throw err;
  }
}
