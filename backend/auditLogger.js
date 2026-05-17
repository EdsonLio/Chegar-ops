const accessLogs = [];

export function logAccess({ username, role, action, ip }) {
  accessLogs.unshift({
    id: crypto.randomUUID(),
    username,
    role,
    action,
    ip,
    createdAt: new Date().toISOString()
  });

  return accessLogs[0];
}

export function getAccessLogs() {
  return accessLogs.slice(0, 200);
}
