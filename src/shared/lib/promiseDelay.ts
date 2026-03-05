export const promiseDelay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
