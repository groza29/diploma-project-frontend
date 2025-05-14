import React, { useEffect, useState } from 'react';
import { Dialog, IconButton, MenuItem, Button, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { OptionType } from '../../models/OptionType';

type DropdownOption = { label: string; value: string | number | boolean };

type FilterPanelProps = {
  open: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  type: 'user' | 'post';
  dateStatus?: boolean;
  statusOptions?: DropdownOption[];
  ratingOptions?: DropdownOption[];
  countryOptions?: DropdownOption[];
  countyOptions?: DropdownOption[];
  cityOptions?: DropdownOption[];
  jobsOptions?: DropdownOption[];

  countrySelected?: DropdownOption | null;
  countySelected?: DropdownOption | null;
  citySelected?: DropdownOption | null;
  jobSelected?: DropdownOption | null;
  nameSearched?: string;
};

const FilterPanel: React.FC<FilterPanelProps> = ({
  open,
  onClose,
  onApply,
  type,
  statusOptions = [],
  ratingOptions = [],
  countryOptions = [],
  countyOptions = [],
  cityOptions = [],
  jobsOptions = [],
  countrySelected,
  citySelected,
  jobSelected,
  nameSearched,
  countySelected,
}) => {
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);
  const [searchText, setSearchText] = useState(nameSearched || '');
  const [status, setStatus] = useState<string | boolean>('');
  const [rating, setRating] = useState<number | ''>('');
  const [country, setCountry] = useState(countrySelected?.value ?? '');
  const [county, setCounty] = useState(countySelected?.value ?? '');
  const [city, setCity] = useState(citySelected?.value ?? '');
  const [job, setJob] = useState(jobSelected?.value ?? '');

  const handleReset = () => {
    setFromDate(null);
    setToDate(null);
    setSearchText('');
    setStatus('');
    setRating('');
    setCountry('');
    setCounty('');
    setCity('');
    setJob('');
  };

  const handleApply = () => {
    onApply({
      fromDate: fromDate?.valueOf() ?? null,
      toDate: toDate?.valueOf() ?? null,
      searchText,
      status,
      rating,
      country,
      county,
      city,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Filter {type === 'user' ? 'Users' : 'Posts'}</h2>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="space-y-4">
            {/* Date Range */}
            {type === 'post' && (
              <div className="flex justify-between gap-2">
                <DatePicker
                  label="From"
                  value={fromDate}
                  onChange={(newValue) => setFromDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                />
                <DatePicker
                  label="To"
                  value={toDate}
                  onChange={(newValue) => setToDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                />
              </div>
            )}

            {/* Text search */}
            <TextField
              label={type === 'user' ? 'Name' : 'Title'}
              fullWidth
              size="small"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            {/* Status dropdown */}
            {statusOptions.length > 0 && (
              <TextField
                label="Status"
                select
                fullWidth
                size="small"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {statusOptions.map((opt) => (
                  <MenuItem key={String(opt.value)} value={String(opt.value)}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
            {/* Jobs dropdown */}
            {jobsOptions.length > 0 && (
              <TextField
                label="Jobs"
                select
                fullWidth
                size="small"
                value={job}
                onChange={(e) => setJob(e.target.value)}
              >
                {jobsOptions.map((opt) => (
                  <MenuItem key={String(opt.value)} value={String(opt.value)}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
            {/* User-specific filters */}
            {type === 'user' && (
              <>
                {ratingOptions.length > 0 && (
                  <TextField
                    label="Rating"
                    select
                    fullWidth
                    size="small"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    {ratingOptions.map((opt) => (
                      <MenuItem key={String(opt.value)} value={String(opt.value)}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}

                {countryOptions.length > 0 && (
                  <TextField
                    label="Country"
                    select
                    fullWidth
                    size="small"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    {countryOptions.map((opt) => (
                      <MenuItem key={String(opt.value)} value={String(opt.value)}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}

                {countyOptions.length > 0 && (
                  <TextField
                    label="County"
                    select
                    fullWidth
                    size="small"
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                  >
                    {countyOptions.map((opt) => (
                      <MenuItem key={String(opt.value)} value={String(opt.value)}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}

                {cityOptions.length > 0 && (
                  <TextField
                    label="City"
                    select
                    fullWidth
                    size="small"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    {cityOptions.map((opt) => (
                      <MenuItem key={String(opt.value)} value={String(opt.value)}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </>
            )}
          </div>
        </LocalizationProvider>

        <div className="flex justify-between mt-6 px-1">
          <Button onClick={handleReset}>Reset</Button>
          <Button onClick={handleApply} color="primary">
            Apply Now
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default FilterPanel;
