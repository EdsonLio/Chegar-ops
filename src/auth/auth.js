const STORAGE_KEY = 'chegar_auth_session';

const USERS = [
  {
    username: 'admin',
    password: 'admin123',
    role: 'administrator'
  },
  {
    username: 'operations',
    password: 'ops123',
    role: 'operations'
  }
];

export function login(username, password) {
  const user = USERS.find(
    item => item.username === username && item.password === password
  );

  if (!user) {
    throw new Error('Credenciais inválidas');
  }

  const session = {
    username: user.username,
    role: user.role,
    loginAt: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));

  return session;
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getSession() {
  const session = localStorage.getItem(STORAGE_KEY);

  return session ? JSON.parse(session) : null;
}
