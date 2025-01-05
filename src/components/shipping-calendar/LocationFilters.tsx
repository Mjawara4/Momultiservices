import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LocationFiltersProps {
  uniqueFromLocations: string[];
  uniqueToLocations: string[];
  filterFromLocation: string;
  filterToLocation: string;
  setFilterFromLocation: (value: string) => void;
  setFilterToLocation: (value: string) => void;
}

export const LocationFilters = ({
  uniqueFromLocations,
  uniqueToLocations,
  filterFromLocation,
  filterToLocation,
  setFilterFromLocation,
  setFilterToLocation,
}: LocationFiltersProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      <Select value={filterFromLocation} onValueChange={setFilterFromLocation}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by origin" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Origins</SelectItem>
          {uniqueFromLocations.map((location) => (
            <SelectItem key={location} value={location}>
              {location}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filterToLocation} onValueChange={setFilterToLocation}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by destination" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Destinations</SelectItem>
          {uniqueToLocations.map((location) => (
            <SelectItem key={location} value={location}>
              {location}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};