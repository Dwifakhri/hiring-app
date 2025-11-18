/* eslint-disable @typescript-eslint/no-explicit-any */
export const getErrorResponse = (error: any): string => {
  return (
    error?.response?.data?.message || error?.message || 'Internal Server Error'
  );
};
