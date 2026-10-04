function normalizedMetadata(metadata) {
  return Object.fromEntries(
    Object.entries(metadata).filter(([key, value]) => {
      if (value === undefined || value === null) return false;
      return !['password', 'token', 'authorization', 'jwtSecret'].includes(key);
    })
  );
}

export function logSecurityEvent(event, metadata = {}) {
  const record = {
    timestamp: new Date().toISOString(),
    event,
    ...normalizedMetadata(metadata)
  };

  console.info(`[SECURITY] ${JSON.stringify(record)}`);
  return record;
}
