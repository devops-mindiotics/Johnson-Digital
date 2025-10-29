// app/homepage/schools/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import { cookies } from 'next/headers';
import { getSchoolById, getAllSchools } from "@/lib/api/schoolApi";
import EditSchoolClient from "./EditSchoolClient";
import AuthCookieSetter from '@/lib/AuthCookieSetter';

function getApiContext() {
  const cookieStore = cookies();
  const tenantData = cookieStore.get("contextInfo")?.value;
  const token = cookieStore.get("contextJWT")?.value;

  if (!tenantData || !token) {
    return null;
  }

  const decodedTenantData = decodeURIComponent(tenantData);
  const tenantId = JSON.parse(decodedTenantData).tenantId;
  if (!tenantId) throw new Error("Tenant ID not found in cookies.");
  return { tenantId, token };
}

export default async function Page({ params }: { params: { id: string } }) {
  const apiContext = getApiContext();

  if (!apiContext) {
    return <AuthCookieSetter />;
  }

  const schoolData = await getSchoolById(params.id, apiContext);

  if (!schoolData || !schoolData.data) {
    notFound();
  }

  // Assuming getAllSchools returns a flat array of school objects
  const allSchools = await getAllSchools(apiContext); 

  return <EditSchoolClient initialSchool={schoolData.data} schoolList={allSchools} />;
}
