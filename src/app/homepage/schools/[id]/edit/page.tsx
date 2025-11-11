'use client';
import { notFound } from "next/navigation";
import { getSchoolById, getAllSchools } from "@/lib/api/schoolApi";
import EditSchoolClient from "./EditSchoolClient";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const [school, setSchool] = useState(null);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        if (params.id) {
          const [schoolData, allSchools] = await Promise.all([
            getSchoolById(params.id),
            getAllSchools(),
          ]);

          if (!schoolData) {
            notFound();
            return;
          }
          
          setSchool(schoolData);
          setSchools(allSchools);
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!school) {
    return notFound();
  }

  return <EditSchoolClient initialSchool={school} schoolList={schools} />;
}
