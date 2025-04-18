import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTelegram, faVk, faGoogle, faYandex } from '@fortawesome/free-brands-svg-icons';
import { registerUser, loginUser } from '../../API/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import './authoriz_regPage.css';

const Authorization = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginData, setLoginData] = useState({ login: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const toggleForm = () => setIsSignUp(!isSignUp);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const validateLoginForm = () => {
    if (!loginData.login.trim()) throw new Error('Введите логин или email');
    if (!loginData.password.trim()) throw new Error('Введите пароль');
    if (loginData.password.length < 6) throw new Error('Пароль должен содержать минимум 6 символов');
  };

  const validateRegisterForm = () => {
    if (!registerData.name.trim()) throw new Error('Введите имя');
    if (!registerData.email.trim() || !/^\S+@\S+\.\S+$/.test(registerData.email)) {
      throw new Error('Введите корректный email');
    }
    if (!registerData.password.trim() || registerData.password.length < 6) {
      throw new Error('Пароль должен содержать минимум 6 символов');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      validateLoginForm();
      const response = await loginUser(loginData);

      if (!response?.data?.accessToken) {
        throw new Error(response?.data?.message || 'Не получили токен от сервера');
      }

      toast.success('Авторизация успешна! Добро пожаловать!');
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('userRole', response.data.role || 'user');
      
      navigate('/personal_account/settings');
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      toast.error(error.message || 'Ошибка авторизации. Проверьте данные.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      validateRegisterForm();
      const response = await registerUser(registerData);

      if (!response?.data?.accessToken) {
        throw new Error(response?.data?.message || 'Не получили токен от сервера');
      }

      toast.success('Регистрация успешна! Вход выполнен.');
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('userRole', response.data.role || 'user');
      navigate('/personal_account');
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      toast.error(error.message || 'Ошибка регистрации. Проверьте данные.');
    } finally {
      setIsLoading(false);
    }
  };

  const socialLinks = [
    { icon: faTelegram, url: 'https://telegram.org' },
    { icon: faVk, url: 'https://vk.com' },
    { icon: faGoogle, url: 'https://google.com' },
    { icon: faYandex, url: 'https://yandex.ru' },
  ];

  return (
    <div className="auth-container">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className={`container ${isSignUp ? 'active' : ''}`} id="container">
        <div className={`form-container ${isSignUp ? 'sign-up' : 'sign-in'}`}>
          {isSignUp ? (
            <form onSubmit={handleRegisterSubmit}>
              <h1 className="heading">Создать аккаунт</h1>
              <div className="social-icons">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="icon"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Login with ${social.icon.iconName}`}
                  >
                    <FontAwesomeIcon icon={social.icon} />
                  </a>
                ))}
              </div>
              <span>или зарегистрироваться через Email и пароль</span>
              <input
                type="text"
                name="name"
                placeholder="Имя"
                value={registerData.name}
                onChange={handleRegisterChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={registerData.email}
                onChange={handleRegisterChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Пароль (минимум 6 символов)"
                value={registerData.password}
                onChange={handleRegisterChange}
                minLength="6"
                required
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit}>
              <h1 className="heading">Авторизация</h1>
              <div className="social-icons">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="icon"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Login with ${social.icon.iconName}`}
                  >
                    <FontAwesomeIcon icon={social.icon} />
                  </a>
                ))}
              </div>
              <span>или войти через логин и пароль</span>
              <input
                type="text"
                name="login"
                placeholder="Логин (email или имя)"
                value={loginData.login}
                onChange={handleLoginChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Пароль"
                value={loginData.password}
                onChange={handleLoginChange}
                required
              />
              <button
                type="button"
                onClick={() => toast.info('Функция восстановления пароля пока недоступна')}
                className="forgot-password"
              >
                Забыли пароль?
              </button>
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Вход...' : 'Войти'}
              </button>
            </form>
          )}
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>С возвращением!</h1>
              <p>Введите свои данные для входа</p>
              <button className="hidden" onClick={toggleForm}>
                Войти
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Привет, друг!</h1>
              <p>Зарегистрируйтесь для использования сайта</p>
              <button className="hidden" onClick={toggleForm}>
                Зарегистрироваться
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authorization;