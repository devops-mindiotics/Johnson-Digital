'use client';
import { notFound } from "next/navigation";
import { getSchoolById, getAllSchools } from "@/lib/api/schoolApi";
import EditSchoolClient from "./EditSchoolClient";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const [school, setSchool] = useState(null);
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const allSchools = await getAllSchools();
        setSchools(allSchools);
      } catch (error) {
        console.error("Failed to fetch schools:", error);
      }
    };
    fetchSchools();
  }, []);

  useEffect(() => {
    const fetchSchool = async () => {
      if (params.id) {
        try {
          const schoolData = await getSchoolById(params.id);
          if (!schoolData || !schoolData.data) {
            notFound();
          }
          setSchool(schoolData.data);
        } catch (error) {
          console.error("Failed to fetch school data:", error);
        }
      }
    };
    fetchSchool();
  }, [params.id]);

  if (!school) {
    return <div>Loading...</div>
  }

  return <EditSchoolClient initialSchool={school} schoolList={schools} />;
}
