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
      const data = await response.json();
      console.log('Login successful', data.userId);
      localStorage.setItem('user', JSON.stringify(data.userId));
      return data;
    } else {
      const errorData = await response.json();
      console.log('Login failed', errorData);
      throw new Error(errorData.message || 'Login failed');
    }
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
};

export { AuthService };
