"use client";

import { Advocate } from "@/model/advocate.model";
import { ChangeEvent, useEffect, useState } from "react";
import { AdvocateFilters } from "./api/advocates/advocate-filters";
import { Input } from "./ui/input";

export default function Home() {
  const [searchFields, setSearchFields] = useState<
    Pick<AdvocateFilters, "specialty" | "location">
  >({ specialty: "", location: "" });
  const [filters, setFilters] = useState<AdvocateFilters>({
    name: "",
    location: "",
    specialty: "",
    experience: "",
  });

  const advocates = useAdvocates(filters);

  const onSearch = () => {
    setFilters((filters) => ({ ...filters, ...searchFields }));
  };

  const onFilter =
    (key: keyof AdvocateFilters) => (e: ChangeEvent<HTMLInputElement>) => {
      const searchTerm = e.target.value;
      setSearchFields((filters) => ({ ...filters, [key]: searchTerm }));
    };

  const onClearFilter = (key: keyof AdvocateFilters) => () => {
    setSearchFields((filters) => ({ ...filters, [key]: "" }));
  };

  return (
    <main className="p-4 flex flex-col items-start">
      <h1 className="text-gray-100 text-4xl my-8">
        Let&apos;s find your perfect advocate
      </h1>
      <div className="flex w-full items-center justify-center h-[50px] bg-white border-2 border-gray-900 rounded">
        <Input
          value={searchFields.specialty}
          onChange={onFilter("specialty")}
          onClear={onClearFilter("specialty")}
          className="grow"
          placeholder="Specialty"
        />
        <div className="bg-black h-[40px] w-[1px]" />
        <Input
          value={searchFields.location}
          onChange={onFilter("location")}
          onClear={onClearFilter("specialty")}
          className="basis-[30%]"
          placeholder="Location"
        />
      </div>
      <button
        disabled={filters.specialty.length > 0 && filters.location.length > 0}
        onClick={onSearch}
      >
        Search
      </button>
      {advocates.length === 0 && (
        <p className="my-8">No advocates. Please try a different search.</p>
      )}
      {advocates.length > 0 && (
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
      )}
    </main>
  );
}

function useAdvocates(filters: AdvocateFilters): Advocate[] {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);

  useEffect(() => {
    if (!filters.specialty || !filters.location) {
      return;
    }
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
