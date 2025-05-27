"use client";

import { Advocate } from "@/model/advocate.model";
import { ChangeEvent, useEffect, useState } from "react";
import { AdvocateFilters } from "./api/advocates/advocate-filters";

export default function Home() {
  const [filters, setFilters] = useState<AdvocateFilters>({
    name: "",
    location: "",
    specialty: "",
    experience: "",
  });

  const advocates = useAdvocates(filters);

  const onFilter =
    (key: keyof AdvocateFilters) => (e: ChangeEvent<HTMLInputElement>) => {
      const searchTerm = e.target.value;
      setFilters((filters) => ({ ...filters, [key]: searchTerm }));
    };

  const onClearFilter = (key: keyof AdvocateFilters) => () => {
    setFilters((filters) => ({ ...filters, [key]: "" }));
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input onChange={onFilter("name")} />
              {filters.name.length > 0 && (
                <button onClick={onClearFilter("name")}>X</button>
              )}
            </td>
            <td>
              <input onChange={onFilter("location")} />
              {filters.location.length > 0 && (
                <button onClick={onClearFilter("location")}>X</button>
              )}
            </td>
            <td />
            <td>
              <input onChange={onFilter("specialty")} />
              {filters.specialty.length > 0 && (
                <button onClick={onClearFilter("specialty")}>X</button>
              )}
            </td>
            <td>
              <input onChange={onFilter("experience")} />
              {filters.experience.length > 0 && (
                <button onClick={onClearFilter("experience")}>X</button>
              )}
            </td>
            <td />
          </tr>
          {advocates.map((advocate) => {
            return (
              <tr key={advocate.phoneNumber}>
                <td>{getAdvocateName(advocate)}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s) => (
                    <div key={s}>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}

function useAdvocates(filters: AdvocateFilters): Advocate[] {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(filters);
    fetch(`/api/advocates?${searchParams}`).then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
      });
    });
  }, [filters]);

  return advocates;
}

function getAdvocateName(advocate: Advocate): string {
  return [advocate.firstName, advocate.lastName].join(" ");
}
