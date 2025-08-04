const logger = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: (message: string, meta?: Record<string, any>) => {
    console.log(`[INFO] ${new Date().toISOString()} ${message}`, meta || '');
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn: (message: string, meta?: Record<string, any>) => {
    console.warn(`[WARN] ${new Date().toISOString()} ${message}`, meta || '');
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: (message: string, meta?: Record<string, any>) => {
    console.error(`[ERROR] ${new Date().toISOString()} ${message}`, meta || '');
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug: (message: string, meta?: Record<string, any>) => {
    console.debug(`[DEBUG] ${new Date().toISOString()} ${message}`, meta || '');
  },
};

export default logger;
