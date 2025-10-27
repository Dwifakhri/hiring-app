import Box from '@mui/material/Box';
import { MenuItem, FormLabel, FormControl } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface SelectItem {
  value: string | number;
  label: string;
}

interface ReusableSelectProps {
  name: string;
  label?: string;
  value: string;
  items: SelectItem[];
  required?: boolean;
  starRequired?: boolean;
  onChange: (newValue: string) => void;
}

export default function ReusableSelect({
  name,
  label = '',
  value,
  items,
  required = false,
  starRequired = false,
  onChange,
}: ReusableSelectProps) {
  const handleSelectChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  const selectId = `reusable-select-${label.replace(/\s/g, '-')}`;
  const labelId = `${selectId}-label`;

  return (
    <Box width="100%">
      <FormControl fullWidth>
        <FormLabel
          htmlFor={selectId}
          className="mb-2"
          sx={{
            '&.Mui-focused': {
              color: 'inherit',
            },
          }}
        >
          {label}
          {starRequired && <span style={{ color: 'red' }}>*</span>}
        </FormLabel>
        <Select
          name={name}
          labelId={labelId}
          id={selectId}
          defaultValue=""
          value={value}
          required={required}
          onChange={handleSelectChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          sx={{
            fontSize: '14px',
            height: '40px',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                boxShadow: 'none',
              },
            },
          }}
          slotProps={{
            notchedOutline: {
              sx: {
                borderWidth: '2px',
                borderColor: 'divider',
                borderRadius: '8px',
              },
            },
          }}
        >
          <MenuItem value="" hidden>
            Select {label}
          </MenuItem>
          {items.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
