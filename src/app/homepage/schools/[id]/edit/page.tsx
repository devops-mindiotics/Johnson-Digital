import { notFound } from "next/navigation";
import { getSchoolById, getAllSchools } from "@/lib/api/schoolApi";
import EditSchoolClient from "./EditSchoolClient";

// Generate static params if needed
export async function generateStaticParams() {
  const schools = await getAllSchools();
  return schools.map((school: any) => ({ id: school.id }));
}

// Server component page
export default async function EditSchoolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<JSX.Element> {
  // Await params as required by Next.js 15
  const { id } = await params;

  // Fetch school data and all schools
  const [school, schools] = await Promise.all([
    getSchoolById(id),
    getAllSchools(),
  ]);

  if (!school) {
    notFound();
  }

  // Pass data to client component
  return <EditSchoolClient initialSchool={school} schoolList={schools} />;
}
