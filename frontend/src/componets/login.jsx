import React, { useState } from 'react';
import './login.css';
import bgImage from '../assets/singup-bg-image.jpg'
import logoImage from '../assets/logo-images(1).png'

const Login = ({ onSwitchToSignup, onLogin }) => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [message, setMessage] = useState('');
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/users/request-login-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('OTP sent to your email successfully!');
                setOtpSent(true);
            } else {
                setMessage(data.message || 'Failed to send OTP');
            }
        } catch (error) {
            setMessage('Failed to connect to server. Please try again.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setVerifying(true);
        setMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/users/verify-login-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Login successful!');
                if (onLogin) {
                    onLogin(data.user);
                }
            } else {
                setMessage(data.message || 'Invalid OTP');
            }
        } catch (error) {
            setMessage('Failed to connect to server. Please try again.');
            console.error('Error:', error);
        } finally {
            setVerifying(false);
        }
    };

    const resetForm = () => {
        setEmail('');
        setOtp('');
        setOtpSent(false);
        setMessage('');
    };

    return (
        <div className="login-container">
            <div className="login-form-section">
                <div className="logo-section">
                    <img src={logoImage} alt="HD Logo" className="h-[30px] w-[30px]" />
                    <div className="logo-text">HD</div>
                </div>

                <div className="form-container">
                    <h2 className="form-title">Sign in</h2>
                    <p className="form-subtitle">Please login to continue to your account.</p>

                    {!otpSent ? (
                        <form onSubmit={handleRequestOtp} className="login-form">
                            <div className="input-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div className="checkbox-container">
                                <input
                                    type="checkbox"
                                    id="keepLoggedIn"
                                    checked={keepLoggedIn}
                                    onChange={(e) => setKeepLoggedIn(e.target.checked)}
                                    className="checkbox-input"
                                />
                                <label htmlFor="keepLoggedIn" className="checkbox-label">
                                    Keep me logged in
                                </label>
                            </div>

                            <button type="submit" className="submit-button" disabled={loading}>
                                {loading ? 'Sending OTP...' : 'Send OTP'}
                            </button>
                        </form>
                    ) : (
                        <div className="otp-verification-section">
                            <div className="otp-header">
                                <div className="otp-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8Z" stroke="#4285f4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M7 12L10 15L17 8" stroke="#4285f4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3>Verify Your Login</h3>
                                <p>We've sent a 6-digit code to <strong>{email}</strong></p>
                            </div>

                            <form onSubmit={handleVerifyOtp} className="otp-form">
                                <div className="input-group">
                                    <label htmlFor="otp">Enter Verification Code</label>
                                    <input
                                        type="text"
                                        id="otp"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="000000"
                                        required
                                        className="form-input otp-input"
                                        maxLength="6"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={verifying}
                                    className="submit-button"
                                >
                                    {verifying ? 'Verifying...' : 'Verify & Sign In'}
                                </button>

                                <div className="otp-actions">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="secondary-button"
                                    >
                                        Back to Email
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleRequestOtp}
                                        className="resend-button"
                                        disabled={loading}
                                    >
                                        {loading ? 'Sending...' : 'Resend Code'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {message && (
                        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                            {message}
                        </div>
                    )}

                    <p className="signin-link">
                        Need an account?{' '}
                        <button type="button" onClick={onSwitchToSignup} className="link-button">
                            Create one
                        </button>
                    </p>
                </div>
            </div>

            <div className="image-section">
                <img src={bgImage} alt="Login background" className="background-image rounded-lg" />
            </div>
        </div>
    );
};

export default Login;
