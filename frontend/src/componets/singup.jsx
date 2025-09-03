import React, { useState } from 'react'
import './signup.css'
import bgImage from '../assets/singup-bg-image.jpg'
import logoImage from '../assets/logo-images(1).png'

export default function Signup({ onSwitchToLogin, onSignup }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        birthday: ''
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [otpSent, setOtpSent] = useState(false)
    const [otp, setOtp] = useState('')
    const [verifying, setVerifying] = useState(false)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const response = await fetch('http://localhost:5000/api/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (response.ok) {
                setMessage('OTP sent to your email successfully!')
                setOtpSent(true)
            } else {
                setMessage(data.message || 'Something went wrong')
            }
        } catch (error) {
            setMessage('Failed to send OTP. Please try again.')
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleOtpVerification = async (e) => {
        e.preventDefault()
        setVerifying(true)
        setMessage('')

        try {
            const response = await fetch('http://localhost:5000/api/users/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    otp: otp
                })
            })

            const data = await response.json()

            if (response.ok) {
                setMessage('Account verified successfully! You can now login.')
                // Call onSignup with user data
                const userData = {
                    email: formData.email,
                    name: formData.name
                };

                if (onSignup) {
                    setTimeout(() => {
                        onSignup(userData);
                    }, 1000);
                } else {
                    // Reset form or redirect to login
                    setTimeout(() => {
                        setFormData({ name: '', email: '', birthday: '' })
                        setOtp('')
                        setOtpSent(false)
                    }, 2000)
                }
            } else {
                setMessage(data.message || 'Invalid OTP')
            }
        } catch (error) {
            setMessage('Failed to verify OTP. Please try again.')
            console.error('Error:', error)
        } finally {
            setVerifying(false)
        }
    }

    const resetForm = () => {
        setFormData({ name: '', email: '', birthday: '' })
        setOtp('')
        setOtpSent(false)
        setMessage('')
    }

    return (
        <div className="signup-container">
            <div className="signup-form-section">
                <div className="logo-section">
                    <img src={logoImage} alt="HD Logo" className="h-[30px] w-[30px]" />
                    <div className="logo-text">HD</div>
                </div>

                <div className="form-container">
                    <h2 className="form-title">Sign up</h2>
                    <p className="form-subtitle">Sign up to enjoy the feature of HD</p>

                    {!otpSent ? (
                        <form onSubmit={handleSubmit} className="signup-form">
                            {/* Name */}
                            <div className="input-group">
                                <label htmlFor="name">Your Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Jonas Khanwald"
                                    required
                                    className="form-input"
                                />
                            </div>

                            {/* Date of Birth */}
                            <div className="input-group">
                                <label htmlFor="birthday">Date of Birth</label>
                                <input
                                    type="date"
                                    id="birthday"
                                    name="birthday"
                                    value={formData.birthday}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                />
                            </div>

                            {/* Email */}
                            <div className="input-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="jonas_kahnwald@gmail.com"
                                    required
                                    className="form-input"
                                />
                            </div>

                            {/* Get OTP */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="submit-button"
                            >
                                {loading ? 'Sending OTP...' : 'Get OTP'}
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
                                <h3>Verify Your Email</h3>
                                <p>We've sent a 6-digit code to <strong>{formData.email}</strong></p>
                            </div>

                            <form onSubmit={handleOtpVerification} className="otp-form">
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
                                    {verifying ? 'Verifying...' : 'Verify & Create Account'}
                                </button>

                                <div className="otp-actions">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="secondary-button"
                                    >
                                        Back to Sign Up
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleSubmit}
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
                        Already have an account?{' '}
                        <button type="button" onClick={onSwitchToLogin} className="link-button">
                            Sign in
                        </button>
                    </p>
                </div>
            </div>

            <div className="image-section">
                <img src={bgImage} alt="Signup background" className="background-image rounded-lg" />
            </div>
        </div>
    )
}
