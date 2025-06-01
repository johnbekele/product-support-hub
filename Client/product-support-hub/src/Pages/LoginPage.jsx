// LoginPage.jsx
import React, { useState } from 'react';
import { useThomsonReutersTheme } from '../Context/ThomsonReutersThemeContext.jsx';
import UserNavBar from '../Components/UserNavBar.jsx';
import logo from '../assets/img/logo.png';
import logo2 from '../assets/img/logo2.png';
import { useAuth } from '../Context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
const LoginPage = () => {
  const theme = useThomsonReutersTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Example validation
    if (!identifier || !password) {
      setError('Please enter username/email and password.');
      return;
    }
    setError('');
    // TODO: Implement login API call here
    alert(`Logging in with identifier: ${identifier}`);
    login(identifier, password)
      .then(() => {
        // Redirect or show success message
        navigate('/');
      })
      .catch((err) => {
        // Handle error
        setError(err.message || 'Login failed. Please try again.');
      });
  };

  const headerStyle = {
    backgroundColor: theme.components.header.backgroundColor,
    color: theme.components.header.color,
    padding: theme.spacing.md,
  };

  return (
    <>
      <header style={headerStyle} className="flex flex-row items-center gap-4">
        <img className="w-44" src={logo} alt="" />
        <div className="flex flex-row items-center gap-4">
          <div className="text-md font-sans w-44 text-stone-50 ">
            Product Support Hub
          </div>
        </div>
        <div style={{ width: '80%' }} className="flex justify-end "></div>
      </header>
      <div
        style={{
          fontFamily: theme.typography.fontFamily,
          backgroundColor: theme.components.body.backgroundColor,
          color: theme.components.body.color,
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: theme.spacing.lg,
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: theme.components.body.backgroundColor,
            border: `1px solid ${theme.colors.mediumGray}`,
            padding: theme.spacing.xl,
            borderRadius: '8px',
            boxShadow: `0 2px 12px rgba(0,0,0,0.15)`,
            width: '100%',
            maxWidth: '400px',
            boxSizing: 'border-box',
          }}
        >
          {/* Header: Logo + Description */}
          <div className="flex flex-col items-centergap-0">
            <img src={logo2} alt="Thomson Reuters Logo" style={{}} />
          </div>

          {/* Error Message */}
          {error && (
            <p
              style={{
                color: 'red',
                marginBottom: theme.spacing.md,
                fontWeight: theme.typography.fontWeight.medium,
              }}
            >
              {error}
            </p>
          )}

          {/* Username / Email Label and Input */}
          <label htmlFor="identifier" className="text-gray-400">
            Username or Email
          </label>
          <input
            type="text"
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter username or email"
            style={{
              width: '100%',
              padding: theme.spacing.sm,
              fontSize: theme.typography.fontSize.normal,
              borderRadius: '4px',
              border: `1px solid ${theme.colors.mediumGray}`,
              marginBottom: theme.spacing.md,
              boxSizing: 'border-box',
              outlineColor: theme.colors.primary,
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = theme.colors.primary)}
            onBlur={(e) =>
              (e.target.style.borderColor = theme.colors.mediumGray)
            }
          />

          {/* Password Label and Input */}
          <label htmlFor="password" className="text-gray-400">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            style={{
              width: '100%',
              padding: theme.spacing.sm,
              fontSize: theme.typography.fontSize.normal,
              borderRadius: '4px',
              border: `1px solid ${theme.colors.mediumGray}`,
              marginBottom: theme.spacing.lg,
              boxSizing: 'border-box',
              outlineColor: theme.colors.primary,
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = theme.colors.primary)}
            onBlur={(e) =>
              (e.target.style.borderColor = theme.colors.mediumGray)
            }
          />
          <br />
          <br />
          {/* Login Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: theme.components.button.primary.backgroundColor,
              color: theme.components.button.primary.color,
              padding: theme.spacing.md,
              fontWeight: theme.typography.fontWeight.bold,
              fontSize: theme.typography.fontSize.normal,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              boxShadow: `0 2px 6px rgba(0,0,0,0.15)`,
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                theme.components.button.primary.hoverBackgroundColor)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor =
                theme.components.button.primary.backgroundColor)
            }
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
