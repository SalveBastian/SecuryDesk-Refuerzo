export function validate(schema, target = 'body') {
  return function validateRequest(req, res, next) {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: result.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message
        }))
      });
    }

    req[target] = result.data;
    return next();
  };
}
