// Libraries
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

// Features
import { loginFetch } from '@Features/user/redux/userSlice';

// Assets
import space from '@Backgrounds/space.webp';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Types
import { RootState } from '@Types/rootState.type';

// Components
import { Button } from '@Components/Button/Button';

// Styles
import styles from './login.module.css';

const Login: FC<ChildrenNever> = () => {
  const [formError, setFormError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const loginError = useSelector((state: RootState) => state.user.login.error);
  const isLoginLoading = useSelector((state: RootState) => state.user.login.isLoading);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  useEffect(() => {
    setFormError(loginError);
  }, [loginError]);

  function handleLogin(): void {
    dispatch(loginFetch({
      username: getValues('username'),
      password: getValues('password'),
    }));
  }

  function handleTooglePasswordVisible(): void {
    setIsPasswordVisible((value) => !value);
  }

  return (
    <>
      <div className={styles.overlay} style={{ backgroundImage: `url(${space})` }} />
      <div className={styles.wrapper}>
        <Button onClick={() => navigate('/')} className={styles.closeBtn}>←</Button>
        <form className={styles.loginForm} onSubmit={handleSubmit(handleLogin)}>
          <span
            className={`${styles.formErrorDefault} ${formError ? styles.formError : ''}`}
          >
            {formError || 'Error'}
          </span>
          <label htmlFor="loginName" className={styles.label}>
            <span
              className={`${styles.inputErrorDefault} ${errors.username ? styles.inputError : ''}`}
            >
              {errors.username?.message || 'Error'}
            </span>
            <div className={styles.inputBtnContainer}>
              <div className={styles.empty} />
              <input
                type="text"
                id="loginName"
                placeholder="Username"
                className={errors.username ? styles.invalidInput : ''}
                onFocus={() => setFormError('')}
                {...register('username', {
                  required: {
                    value: true,
                    message: 'You must fill this field',
                  },
                })}
              />
              <div className={styles.empty} />
            </div>
          </label>
          <label htmlFor="loginPassword" className={styles.label}>
            <span
              className={`${styles.inputErrorDefault} ${errors.password ? styles.inputError : ''}`}
            >
              {errors.password?.message || 'Error'}
            </span>
            <div className={styles.inputBtnContainer}>
              <div className={styles.empty} />
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                id="loginPassword"
                className={errors.password ? styles.invalidInput : ''}
                placeholder="Password"
                onFocus={() => setFormError('')}
                {...register('password', {
                  required: {
                    value: true,
                    message: 'You must fill this field',
                  },
                })}
              />
              <Button className={styles.changePasswordVisibility} onClick={handleTooglePasswordVisible}>
                {isPasswordVisible ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
              </Button>
            </div>
          </label>
          <div className={styles.btnContainer}>
            <Button type="submit" disabled={isLoginLoading} className={styles.signIn}>
              Sign In
            </Button>
          </div>
          <p className={styles.registration}>
            {'Don\'t have an account? '}
            <Link to="/registration">Sign Up</Link>
          </p>
        </form>
      </div>
    </>
  );
};

export { Login };
