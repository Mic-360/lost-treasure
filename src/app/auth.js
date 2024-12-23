const AUTH_API = 'http://localhost:8080/api/auth';

const AuthService = {
  login: async (email, password) => {
    const response = await fetch(`${AUTH_API}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      const data =  response.status;
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    }
    throw new Error('Login failed');
  },

  register: async (email, password) => {
    const response = await fetch(`${AUTH_API}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      return true;
    }
    throw new Error('Registration failed');
  },

  saveProgress: async (level) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    const response = await fetch(`${AUTH_API}/save-progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ level }),
    });
    if (!response.ok) {
      throw new Error('Failed to save progress');
    }
  },
};

export { AuthService };
