import { TextGen } from './text_gen';
import { Menus } from './menus';
import { AuthService } from './auth';

const AuthForms = {
  showLogin: () => {
    const loginText = TextGen.generateWord('login');
    TextGen.titleText(loginText);

    TextGen.formInput('email', 'loginEmail', 120);
    TextGen.formInput('password', 'loginPassword', 200);
    TextGen.formButton('login', 'loginButton', 280, async () => {
      try {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        await AuthService.login(email, password);
        // Clear login form and show game
        document.getElementById('menus').innerHTML = '';
        const renders = document.createElement('div');
        renders.id = 'renders';
        renders.setAttribute(
          'style',
          'height: 100%; width: 100%; position: absolute; display: block;'
        );
        menus.appendChild(renders);
        Menus.addEndScreen();
        Menus.startScreen();
      } catch (error) {
        console.error('Login failed:', error);
      }
    });

    TextGen.formButton('register', 'registerButton', 330, () => {
      document.getElementById('menus').innerHTML = '';
      const renders = document.createElement('div');
      renders.id = 'renders';
      renders.setAttribute(
        'style',
        'height: 100%; width: 100%; position: absolute; display: block;'
      );
      menus.appendChild(renders);
      AuthForms.showRegister();
    });
  },

  showRegister: () => {
    const registerText = TextGen.generateWord('register');
    TextGen.titleText(registerText);

    TextGen.formInput('email', 'registerEmail', 120);
    TextGen.formInput('password', 'registerPassword', 200);
    TextGen.formButton('register', 'registerSubmit', 280, async () => {
      try {
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        await AuthService.register(email, password);
        // Redirect to login
        document.getElementById('menus').innerHTML = '';
        const renders = document.createElement('div');
        renders.id = 'renders';
        renders.setAttribute(
          'style',
          'height: 100%; width: 100%; position: absolute; display: block;'
        );
        menus.appendChild(renders);
        AuthForms.showLogin();
      } catch (error) {
        console.error('Registration failed:', error);
      }
    });
  },
};

export { AuthForms };
