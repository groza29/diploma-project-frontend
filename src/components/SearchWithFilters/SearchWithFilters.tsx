import { useState, useEffect } from 'react';
import TuneIcon from '@mui/icons-material/Tune';
import FilterPanel from './FilterPanel';
import { OptionType } from '../../models/OptionType';

interface SearchWithFiltersProps {
  dateStatus?: boolean;
  type: 'user' | 'post';
  statusOptions?: OptionType[];
  ratingOptions?: OptionType[];
  countryOptions: OptionType[];
  countyOptions: OptionType[];
  cityOptions: OptionType[];
  jobsOptions: OptionType[];

  countrySelected?: OptionType | null;
  countySelected?: OptionType | null;
  citySelected?: OptionType | null;
  jobSelected?: OptionType | null;
  nameSearched?: string;
  onApplyFilters?: (filters: any) => void;
}

const SearchWithFilters: React.FC<SearchWithFiltersProps> = ({
  dateStatus,
  type,
  statusOptions,
  ratingOptions,
  countryOptions,
  countyOptions,
  cityOptions,
  jobsOptions,
  countrySelected,
  countySelected,
  citySelected,
  jobSelected,
  nameSearched,
  onApplyFilters,
}) => {
  const [open, setOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>({
    countrySelected,
    countySelected,
    citySelected,
    jobSelected,
    nameSearched,
  });

  useEffect(() => {
    // Sync initial props to local filter state on first mount
    setAppliedFilters({
      countrySelected,
      countySelected,
      citySelected,
      jobSelected,
      nameSearched,
    });
  }, [countrySelected, countySelected, citySelected, jobSelected, nameSearched]);

  const handleUserFilter = (filters: any) => {
    setAppliedFilters(filters);
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="flex items-center gap-4 flex-wrap p-4">
        <div className="flex items-center border rounded-full px-4 py-2 bg-white shadow-sm w-full max-w-md">
          <input
            type="text"
            placeholder="Hinted search text"
            className="flex-grow bg-transparent focus:outline-none"
            value={appliedFilters.nameSearched || ''}
            readOnly
          />
          <TuneIcon onClick={() => setOpen(true)} className="cursor-pointer" />
        </div>

        {appliedFilters && (
          <>
            {appliedFilters.countrySelected && (
              <div className="bg-gray-100 px-3 py-1 rounded-full">
                Country: {appliedFilters.countrySelected.label}
              </div>
            )}
            {appliedFilters.countySelected && (
              <div className="bg-gray-100 px-3 py-1 rounded-full">
                County: {appliedFilters.countySelected.label}
              </div>
            )}
            {appliedFilters.citySelected && (
              <div className="bg-gray-100 px-3 py-1 rounded-full">
                City: {appliedFilters.citySelected.label}
              </div>
            )}
            {appliedFilters.jobSelected && (
              <div className="bg-gray-100 px-3 py-1 rounded-full">
                Job: {appliedFilters.jobSelected.label}
              </div>
            )}
            {appliedFilters.nameSearched && (
              <div className="bg-gray-100 px-3 py-1 rounded-full">
                Name: {appliedFilters.nameSearched}
              </div>
            )}
          </>
        )}
      </div>

      <FilterPanel
        open={open}
        onClose={handleClose}
        onApply={handleUserFilter}
        type={type}
        dateStatus={dateStatus}
        statusOptions={statusOptions}
        ratingOptions={ratingOptions}
        countryOptions={countryOptions}
        countyOptions={countyOptions}
        cityOptions={cityOptions}
        jobsOptions={jobsOptions}
        countrySelected={appliedFilters?.countrySelected}
        countySelected={appliedFilters?.countySelected}
        citySelected={appliedFilters?.citySelected}
        jobSelected={appliedFilters?.jobSelected}
        nameSearched={appliedFilters?.nameSearched}
      />
    </>
  );
};

export default SearchWithFilters;
