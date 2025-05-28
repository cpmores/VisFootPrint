import React from "react";
import Select from "react-select";

interface OptionType {
  value: string;
  label: string;
}

const options = [
  { value: "1", label: "City" },
  { value: "0", label: "Year" },
];

const options2 = [
  { value: "All", label: "All" },
  { value: "2024", label: "2024" },
  { value: "2020", label: "2020" },
];

interface YearSelectorProps {
  selectedType: string;
  setSelectedType: (value: string) => void;
  selectedYear: string;
  setSelectedYear: (value: string) => void;
  option2: OptionType[];
}

function YearSelector({
  selectedType,
  setSelectedType,
  selectedYear,
  setSelectedYear,
  option2
}: YearSelectorProps) {
  const handleTypeChange = (selectedOption: OptionType | null) => {
    if (selectedOption) {
      setSelectedType(selectedOption.value);
      console.log(`Selected type:`, selectedOption);
      // only for test
      localStorage.setItem("IsCity", selectedOption.value);
    }
  };

  const handleYearChange = (selectedOption: OptionType | null) => {
    if (selectedOption) {
      setSelectedYear(selectedOption.value);
      console.log(`Selected year:`, selectedOption);
      localStorage.setItem("YearChange", selectedOption.value);
    }
  };

  return (
    <div
      style={{
        width: "120px",
        position: "absolute",
        top: "10px",
        right: "10px",
        zIndex: 1000,
      }}
    >
      <Select
        value={options.find((option) => option.value === selectedType)}
        options={options}
        onChange={handleTypeChange}
        isSearchable={false}
        menuPlacement="auto"
      />
      <div style={{ height: "10px" }} />
      <Select
        value={option2.find((option) => option.value === selectedYear)}
        options={option2}
        onChange={handleYearChange}
        isSearchable={false}
        menuPlacement="auto"
      />
    </div>
  );
}

export default YearSelector;