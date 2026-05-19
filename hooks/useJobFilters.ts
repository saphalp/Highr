import { US_STATES } from "@/constants/discover";
import { JobPostingRow } from "@/components/JobPostingCard";
import { useState } from "react";

function getNumberFromSalary(salary: string | number | undefined | null): number {
  if (!salary) return 0;
  if (typeof salary === "number") return salary;
  const salaryText = salary.toLowerCase();
  const numbers = salaryText.match(/\d+/g);
  if (!numbers) return 0;
  const firstNumber = Number(numbers[0]);
  return salaryText.includes("k") ? firstNumber * 1000 : firstNumber;
}

export function useJobFilters() {
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [minPay, setMinPay] = useState("");

  const locationSuggestions =
    filterLocation.trim().length === 0
      ? []
      : US_STATES.filter((state) =>
          state.toLowerCase().startsWith(filterLocation.toLowerCase()),
        ).slice(0, 6);

  const jobMatchesFilters = (job: JobPostingRow): boolean => {
    const search = searchText.toLowerCase().trim();
    const selectedLocation = filterLocation.toLowerCase().trim();

    const jobName = job.job_name?.toLowerCase() ?? "";
    const companyName = job.company_name?.toLowerCase() ?? "";
    const location = job.location?.toLowerCase() ?? "";
    const description = job.description?.toLowerCase() ?? "";

    const matchesSearch =
      search === "" ||
      jobName.includes(search) ||
      companyName.includes(search) ||
      location.includes(search) ||
      description.includes(search);

    const matchesLocation =
      selectedLocation === "" || location.includes(selectedLocation);

    const jobSkills = Array.isArray(job.skills)
      ? job.skills.map((skill) => String(skill).toLowerCase())
      : [];

    const matchesSkills =
      selectedSkills.length === 0 ||
      selectedSkills.some((skill) => {
        const s = skill.toLowerCase();
        return jobSkills.some((js) => js.includes(s) || s.includes(js));
      });

    const minPayNumber = Number(minPay);
    const jobPayNumber = getNumberFromSalary(job.salary);
    const matchesPay =
      minPay.trim() === "" ||
      (!Number.isNaN(minPayNumber) && jobPayNumber >= minPayNumber);

    return matchesSearch && matchesLocation && matchesSkills && matchesPay;
  };

  const reset = () => {
    setSearchText("");
    setFilterLocation("");
    setSelectedSkills([]);
    setMinPay("");
  };

  return {
    filterVisible,
    setFilterVisible,
    searchText,
    setSearchText,
    filterLocation,
    setFilterLocation,
    selectedSkills,
    setSelectedSkills,
    minPay,
    setMinPay,
    locationSuggestions,
    jobMatchesFilters,
    reset,
  };
}
