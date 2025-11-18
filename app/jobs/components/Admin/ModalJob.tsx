import { useMemo, useState } from 'react';
import { IconButton, Modal, Box, Typography } from '@mui/material/';
import { X } from 'react-feather';
import AppInputForm from '@/components/AppInputForm';
import AppSelect from '@/components/AppSelect';
import AppTextArea from '@/components/AppTextArea';
import FieldRequirementRow, { FieldRequirement } from './FieldRequirementRow';
import AppButton from '@/components/AppButton';
import { useJobsStore } from '@/store/jobs';
import { useStatusStore } from '@/store/status';
import { getErrorResponse } from '@/utils/getErrorResponse';

const jobTypes = [
  { value: 'full_time', label: 'Full-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' },
];

const jobRequirementsConfig = {
  full_name: '',
  photo_profile: '',
  gender: '',
  domicile: '',
  email: '',
  phone: '',
  linkedin: '',
  birth: '',
};

const jobRequirementsOptions: Array<{
  label: string;
  value: string;
  disabled?: FieldRequirement[];
}> = [
  { label: 'Full Name', value: 'full_name', disabled: ['optional', 'off'] },
  {
    label: 'Photo Profile',
    value: 'photo_profile',
    disabled: ['optional', 'off'],
  },
  { label: 'Gender', value: 'gender' },
  { label: 'Domicile', value: 'domicile' },
  { label: 'Email', value: 'email', disabled: ['optional', 'off'] },
  { label: 'Phone Number', value: 'phone' },
  { label: 'Linkedin Link', value: 'linkedin' },
  { label: 'Date of Birth', value: 'birth' },
];

export default function ModalJobs({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { createJob, isLoadingAction } = useJobsStore();
  const { setStatus } = useStatusStore();
  const [form, setForm] = useState({
    jobName: '',
    company: '',
    location: '',
    numberCandidate: '',
    minimumSalary: '',
    maximumSalary: '',
    jobType: '',
    jobDescription: '',
    jobRequirements: jobRequirementsConfig,
  });
  const [salaryError, setSalaryError] = useState('');

  const disabledSubmit = useMemo(() => {
    const basicEmpty =
      !form.jobName.trim() ||
      !form.company.trim() ||
      !form.location.trim() ||
      !form.numberCandidate.trim() ||
      !form.minimumSalary.trim() ||
      !form.maximumSalary.trim() ||
      !form.jobType.trim() ||
      !form.jobDescription.trim();
    const requirementEmpty = Object.values(form.jobRequirements).some(
      (value) => !value
    );
    const hasSalaryError = !!salaryError;
    return basicEmpty || requirementEmpty || hasSalaryError;
  }, [form, salaryError]);

  const handleClose = (_event: object, reason: string) => {
    if (reason === 'backdropClick') {
      return;
    }
    if (reason === 'escapeKeyDown') {
      return;
    }
    onClose();
  };

  // Type assertion for the event
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // Prevent negative numbers for number fields
    if (
      (name === 'numberCandidate' ||
        name === 'minimumSalary' ||
        name === 'maximumSalary') &&
      value !== '' &&
      Number(value) < 0
    ) {
      return;
    }

    setForm((prev) => {
      const updatedForm = { ...prev, [name]: value };

      // Validate salary range
      if (name === 'minimumSalary' || name === 'maximumSalary') {
        const minSalary = name === 'minimumSalary' ? value : prev.minimumSalary;
        const maxSalary = name === 'maximumSalary' ? value : prev.maximumSalary;

        if (minSalary && maxSalary) {
          if (Number(minSalary) > Number(maxSalary)) {
            setSalaryError(
              'Minimum salary cannot be greater than maximum salary'
            );
          } else {
            setSalaryError('');
          }
        } else {
          setSalaryError('');
        }
      }

      return updatedForm;
    });
  };
  const handleChangeSelect = (newValue: string) => {
    setForm((prev) => ({ ...prev, jobType: newValue }));
  };

  const handleFieldRequirementChange = (
    fieldName: string,
    value: FieldRequirement
  ) => {
    setForm((prev) => ({
      ...prev,
      jobRequirements: {
        ...prev.jobRequirements,
        [fieldName]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const jobData = {
        job_name: form.jobName,
        job_type: form.jobType,
        job_description: form.jobDescription,
        number_candidates: Number(form.numberCandidate),
        salary_min: Number(form.minimumSalary),
        salary_max: Number(form.maximumSalary),
        company: 'Rakamin Academy', // Default value, can be customized
        location: 'Jakarta, Indonesia', // Default value, can be customized
        profile_config: {
          gender: form.jobRequirements.gender,
          domicile: form.jobRequirements.domicile,
          phone: form.jobRequirements.phone,
          linkedin: form.jobRequirements.linkedin,
          birth: form.jobRequirements.birth,
        },
      };

      await createJob(jobData);

      onClose();
      setStatus({ status: 'success', message: 'Job created successfully' });
      // Reset form
      setForm({
        jobName: '',
        numberCandidate: '',
        minimumSalary: '',
        maximumSalary: '',
        jobType: '',
        jobDescription: '',
        company: '',
        location: '',
        jobRequirements: jobRequirementsConfig,
      });
    } catch (error) {
      const message = getErrorResponse(error);
      setStatus({ status: 'error', message: message });
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableEscapeKeyDown
      >
        <form onSubmit={handleSubmit}>
          <Box sx={modalStyle}>
            <ModalHeader title="Job Opening" onClose={() => onClose()} />
            <Box
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                overflowY: 'auto',
                flex: 1,
              }}
            >
              <AppInputForm
                name="jobName"
                label="Job Name"
                value={form.jobName}
                onChange={handleChange}
                required
                starRequired
                placeholder="Ex. Front End Engineer"
              />
              <AppInputForm
                name="company"
                label="Company"
                value={form.company}
                onChange={handleChange}
                required
                starRequired
                placeholder="Deluxe Digital"
              />
              <AppInputForm
                name="location"
                label="Location"
                value={form.location}
                onChange={handleChange}
                required
                starRequired
                placeholder="Jakarta, Indonesia"
              />
              <AppSelect
                name="jobType"
                label="Job Type"
                required
                starRequired
                items={jobTypes}
                value={form.jobType}
                onChange={handleChangeSelect}
              />

              <AppTextArea
                name="jobDescription"
                label="Job Description"
                placeholder="Ex."
                value={form.jobDescription}
                onChange={handleChange}
                required
                starRequired
              />
              <AppInputForm
                name="numberCandidate"
                label="Number of Candidate Needed"
                type="number"
                value={form.numberCandidate}
                onChange={handleChange}
                required
                starRequired
                placeholder="Ex. 2"
              />
              <Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <AppInputForm
                    name="minimumSalary"
                    label="Minimum Estimated Salary"
                    type="number"
                    value={form.minimumSalary}
                    onChange={handleChange}
                    placeholder="Ex. 50000"
                    inputAdornment="number"
                  />
                  <Box
                    sx={{ width: 40, height: 2, bgcolor: 'divider', mt: 3 }}
                  />
                  <AppInputForm
                    name="maximumSalary"
                    label="Maximum Estimated Salary"
                    type="number"
                    value={form.maximumSalary}
                    onChange={handleChange}
                    placeholder="Ex. 80000"
                    inputAdornment="number"
                  />
                </Box>
                {salaryError && (
                  <Typography
                    variant="caption"
                    sx={{ color: 'error.main', mt: 0.5, display: 'block' }}
                  >
                    {salaryError}
                  </Typography>
                )}
              </Box>
              <Box
                sx={{
                  borderWidth: '1px',
                  borderColor: 'divider',
                  borderRadius: '8px',
                  p: '16px',
                }}
              >
                <Typography
                  id="modal-modal-title"
                  variant="subtitle2"
                  sx={{ fontWeight: 700 }}
                >
                  Minimum Profile Information Required
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    mt: 2,
                  }}
                >
                  {jobRequirementsOptions.map((option, i) => (
                    <FieldRequirementRow
                      key={option.value}
                      field={{
                        field: option.value,
                        label: option.label,
                        value: form.jobRequirements[
                          option.value as keyof typeof form.jobRequirements
                        ] as FieldRequirement,
                      }}
                      disabled={option.disabled}
                      onFieldChange={handleFieldRequirementChange}
                      isLastIndex={i === jobRequirementsOptions.length - 1}
                    />
                  ))}
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                py: 2,
                px: 5,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
                borderTop: '1px solid',
                borderTopColor: 'divider',
                flexShrink: 0,
              }}
            >
              <AppButton
                label="Publish Job"
                fullWidth={false}
                loading={isLoadingAction}
                disabled={disabledSubmit || isLoadingAction}
                type="submit"
              />
            </Box>
          </Box>
        </form>
      </Modal>
    </>
  );
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'calc(100% - 32px)', // Take up full width minus 32px margin on each side (64px total)
  maxWidth: 900,
  maxHeight: 'calc(100vh - 64px)', // Max height with margins
  bgcolor: 'background.paper',
  borderRadius: '10px', // Added rounded corners
  boxShadow: 0,
  p: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const ModalHeader = ({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      py: 2,
      px: 3,
      borderBottom: '1px solid #eee', // Separator line
      flexShrink: 0,
    }}
  >
    <Typography id="modal-modal-title" variant="h6" component="h2">
      {title}
    </Typography>
    <IconButton onClick={onClose} size="small" sx={{ mr: 1.2 }}>
      <X />
    </IconButton>
  </Box>
);
