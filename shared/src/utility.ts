import { AxiosError, AxiosResponse, isAxiosError } from 'axios';
import { z } from 'zod';

export type RI<T extends (...args: any) => any> = Awaited<ReturnType<T>>;

export type MergeTypes<A, B> = {
  [key in keyof A]: key extends keyof B ? B[key] : A[key];
} & B;

export type AxiosErrorWithMessage = AxiosError & {
  response: AxiosResponse<{
    message: string;
  }>;
};

export const isAxiosErrorWithMessage = (
  error: unknown,
): error is AxiosErrorWithMessage => {
  return (
    isAxiosError(error) &&
    !!error.response &&
    z
      .object({
        message: z.string(),
      })
      .safeParse(error.response.data).success
  );
};
