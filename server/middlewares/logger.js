export const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const color = statusCode >= 400 ? '\x1b[31m' : statusCode >= 300 ? '\x1b[33m' : '\x1b[32m';
    console.log(`[API] ${req.method} ${req.originalUrl} -> ${color}${statusCode}\x1b[0m (${duration}ms)`);
  });
  next();
};
