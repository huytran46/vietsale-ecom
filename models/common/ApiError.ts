import { AxiosError } from 'axios';

export type ApiError = AxiosError<{
  success?: boolean;
  message: string;
}>;
