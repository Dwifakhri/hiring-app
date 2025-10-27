import { Box, Typography, Chip, Stack } from '@mui/material';

export type FieldRequirement = 'mandatory' | 'optional' | 'off';

export interface JobRequirementField {
  disabled?: FieldRequirement[];
  field: string;
  label: string;
  value: FieldRequirement;
}

export default function FieldRequirementRow({
  disabled,
  field,
  onFieldChange,
  isLastIndex,
}: {
  disabled?: FieldRequirement[];
  field: JobRequirementField;
  onFieldChange: (fieldName: string, value: FieldRequirement) => void;
  isLastIndex: boolean;
}) {
  const isDisabled = (option: FieldRequirement) => {
    return disabled ? disabled.includes(option) : false;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '8px',
        alignItems: 'center',
        p: '16px 12px',
        ...(!isLastIndex && { borderBottom: '1px solid' }),
        borderBottomColor: 'divider',
      }}
    >
      <Typography variant="body2">{field.label}</Typography>
      <Stack direction="row" spacing={1}>
        <Chip
          label="Mandatory"
          variant={isDisabled('mandatory') ? 'filled' : 'outlined'}
          color={field.value === 'mandatory' ? 'primary' : 'default'}
          clickable={!isDisabled('mandatory')}
          disabled={isDisabled('mandatory')}
          onClick={() =>
            !isDisabled('mandatory') && onFieldChange(field.field, 'mandatory')
          }
          sx={{
            borderColor: `${
              field.value === 'mandatory' ? 'primary.main' : 'divider'
            }`,
          }}
        />
        <Chip
          label="Optional"
          variant={isDisabled('optional') ? 'filled' : 'outlined'}
          color={field.value === 'optional' ? 'primary' : 'default'}
          clickable={!isDisabled('optional')}
          disabled={isDisabled('optional')}
          onClick={() =>
            !isDisabled('optional') && onFieldChange(field.field, 'optional')
          }
          sx={{
            borderColor: `${
              field.value === 'optional' ? 'primary.main' : 'divider'
            }`,
          }}
        />
        <Chip
          label="Off"
          variant={isDisabled('off') ? 'filled' : 'outlined'}
          color={field.value === 'off' ? 'primary' : 'default'}
          clickable={!isDisabled('off')}
          disabled={isDisabled('off')}
          onClick={() =>
            !isDisabled('off') && onFieldChange(field.field, 'off')
          }
          sx={{
            borderColor: `${
              field.value === 'off' ? 'primary.main' : 'divider'
            }`,
          }}
        />
      </Stack>
    </Box>
  );
}
