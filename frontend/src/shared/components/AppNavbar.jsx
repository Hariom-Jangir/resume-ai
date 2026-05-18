import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { useAuth } from '../../features/auth/hooks/useAuth'

export function AppNavbar() {
    const { user, handleLogout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [ menuOpen, setMenuOpen ] = useState(false)

    useEffect(() => {
        setMenuOpen(false)
    }, [ location.pathname ])

    const onLogout = async () => {
        setMenuOpen(false)
        await handleLogout()
        navigate('/login')
    }

    const linkClass =
        'rounded-lg px-3 py-2 text-sm text-[#7d8590] transition-colors hover:bg-[#1c2230] hover:text-[#e6edf3] md:inline-flex md:items-center md:px-3 md:py-2'

    const activeLink = (path) =>
        location.pathname === path
            ? ' bg-[rgba(255,45,120,0.12)] text-[#ff2d78]'
            : ''

    return (
        <header className="sticky top-0 z-50 w-full max-w-full border-b border-[#2a3348] bg-[#161b22]/95 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-5 md:px-6 xl:px-8">
                <Link
                    to={user ? '/' : '/login'}
                    className="shrink-0 text-lg font-bold tracking-tight text-[#e6edf3] sm:text-xl md:text-2xl"
                    onClick={() => setMenuOpen(false)}
                >
                    Prep<span className="text-[#ff2d78]">AI</span>
                </Link>

                {/* Desktop / tablet nav */}
                <nav className="hidden items-center gap-1 md:flex md:gap-2" aria-label="Main">
                    {user ? (
                        <>
                            <Link to="/" className={`${linkClass}${activeLink('/')}`}>
                                Dashboard
                            </Link>
                            <button
                                type="button"
                                onClick={onLogout}
                                className={`${linkClass} border-0 bg-transparent font-[inherit] cursor-pointer`}
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={`${linkClass}${activeLink('/login')}`}>
                                Log in
                            </Link>
                            <Link to="/register" className={`${linkClass}${activeLink('/register')}`}>
                                Register
                            </Link>
                        </>
                    )}
                </nav>

                {/* Mobile menu toggle */}
                <button
                    type="button"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#2a3348] bg-[#1c2230] text-[#e6edf3] md:hidden"
                    aria-expanded={menuOpen}
                    aria-controls="mobile-nav"
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    onClick={() => setMenuOpen((o) => !o)}
                >
                    {menuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="4" x2="20" y1="12" y2="12" />
                            <line x1="4" x2="20" y1="6" y2="6" />
                            <line x1="4" x2="20" y1="18" y2="18" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile menu panel */}
            {menuOpen && (
                <div
                    id="mobile-nav"
                    className="border-t border-[#2a3348] bg-[#161b22] px-4 py-3 md:hidden"
                >
                    <nav className="flex flex-col gap-1" aria-label="Mobile">
                        {user ? (
                            <>
                                <Link to="/" className={`${linkClass} w-full${activeLink('/')}`}>
                                    Dashboard
                                </Link>
                                <button
                                    type="button"
                                    onClick={onLogout}
                                    className={`${linkClass} w-full border-0 bg-transparent text-left font-[inherit] cursor-pointer`}
                                >
                                    Log out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className={`${linkClass} w-full${activeLink('/login')}`}>
                                    Log in
                                </Link>
                                <Link to="/register" className={`${linkClass} w-full${activeLink('/register')}`}>
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    )
}
