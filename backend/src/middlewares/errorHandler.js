export function notFound(req, res) {
  res.status(404).json({
    error: 'Ruta no encontrada',
    method: req.method,
    path: req.originalUrl
  });
}

export function errorHandler(error, _req, res, _next) {
  console.error('[SecureDesk error]', error.message);

  const status = Number(error.statusCode ?? error.status ?? 500);
  const safeStatus = status >= 400 && status <= 599 ? status : 500;

  res.status(safeStatus).json({
    error: safeStatus === 500 ? 'Error interno del servidor' : error.message
  });
}
