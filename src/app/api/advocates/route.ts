import { Advocate } from "@/model/advocate.model";
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";
import { parseRequestSearchParams } from "../parse-request.util";
import { AdvocateFilters } from "./advocate-filters";

export async function GET(request: Request) {
  // Uncomment this line to use a database
  // const data = await db.select().from(advocates);

  const filters = getFilters(request);
  const data = applyFilters(advocateData, filters);

  return Response.json({ data });
}

function getFilters(request: Request): AdvocateFilters {
  const searchParams = parseRequestSearchParams(request);
  return {
    name: searchParams.get("name") ?? "",
    location: searchParams.get("location") ?? "",
    specialty: searchParams.get("specialty") ?? "",
    experience: searchParams.get("experience") ?? "",
  };
}

/**
 * In the real world you'd do this part in database, but due to time constraints I have not set up the database, so I'm doing this bit in code.
 */
function applyFilters(
  data: Advocate[],
  { name, location, specialty, experience }: AdvocateFilters
): Advocate[] {
  const nameFilter = (advocate: Advocate) =>
    `${advocate.firstName} ${advocate.lastName}`.includes(name);
  const locationFilter = (advocate: Advocate) =>
    advocate.city.includes(location);
  const specialtyFilter = (advocate: Advocate) =>
    advocate.specialties.some((advocateSpecialty) =>
      advocateSpecialty.includes(specialty)
    );
  const experienceFilter = (advocate: Advocate) => {
    const parsedExperienceValue = +experience;
    const yearsOfExperience = Number.isNaN(parsedExperienceValue)
      ? 0
      : parsedExperienceValue;
    return advocate.yearsOfExperience >= yearsOfExperience;
  };

  return data.filter(
    (advocate) =>
      nameFilter(advocate) &&
      locationFilter(advocate) &&
      specialtyFilter(advocate) &&
      experienceFilter(advocate)
  );
}
