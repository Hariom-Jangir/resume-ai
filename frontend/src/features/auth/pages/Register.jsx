import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import '../auth.form.scss'
import { useAuth } from '../hooks/useAuth'
import { AppNavbar } from '../../../shared/components/AppNavbar.jsx'

const Register = () => {

    const navigate = useNavigate()
    const [ username, setUsername ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const { loading, handleRegister } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const result = await handleRegister({ username, email, password })
        if (result?.success) {
            navigate('/')
            return
        }
        window.alert(result?.message || 'Registration failed. Please try again.')
    }

    if (loading) {
        return (
            <>
                <AppNavbar />
                <main className="loading-screen">
                    <h1>Loading...</h1>
                </main>
            </>
        )
    }

    return (
        <>
            <AppNavbar />
            <main className="auth-page">
                <div className="auth-card">
                    <h1 className="auth-card__title">Register</h1>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <input
                                onChange={(e) => { setUsername(e.target.value) }}
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Enter username"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                onChange={(e) => { setEmail(e.target.value) }}
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter email address"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                onChange={(e) => { setPassword(e.target.value) }}
                                type="password"
                                id="password"
                                name="password"
                                autoComplete="new-password"
                                placeholder="Enter password"
                                required
                            />
                        </div>

                        <button type="submit" className="button primary-button button--block">Register</button>
                    </form>

                    <p className="auth-card__footer">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </div>
            </main>
        </>
    )
}

export default Register
