import React, { useState, useRef } from 'react'
import '../style/home.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import { AppNavbar } from '../../../shared/components/AppNavbar.jsx'

const Home = () => {

    const { loading, generateReport, reports } = useInterview()
    const [ jobDescription, setJobDescription ] = useState('')
    const [ selfDescription, setSelfDescription ] = useState('')
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[ 0 ]
        const data = await generateReport({ jobDescription, selfDescription, resumeFile })
        if (data?._id) {
            navigate(`/interview/${data._id}`)
        }
    }

    if (loading) {
        return (
            <>
                <AppNavbar />
                <main className="loading-screen flex min-h-[calc(100vh-3.5rem)] w-full max-w-full flex-col items-center justify-center gap-3 bg-[#0d1117] px-4 py-8">
                    <h1 className="text-center text-lg font-semibold text-[#e6edf3] sm:text-xl md:text-2xl">Loading your interview plan...</h1>
                </main>
            </>
        )
    }

    return (
        <>
            <AppNavbar />
            <div className="home-page flex w-full max-w-full flex-col items-center gap-6 px-4 py-6 sm:gap-8 sm:py-8 md:px-6 md:py-10 xl:gap-10 xl:px-8 xl:py-12">

                <header className="page-header px-1">
                    <h1 className="text-xl font-bold sm:text-2xl md:text-3xl xl:text-4xl">
                        Create Your Custom <span className="highlight">Interview Plan</span>
                    </h1>
                    <p className="mt-2 text-sm sm:text-base md:text-lg">Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
                </header>

                <div className="interview-card w-full max-w-full min-w-0">
                    <div className="interview-card__body flex min-h-[380px] flex-col xl:min-h-[520px] xl:flex-row">
                        <div className="panel panel--left p-4 md:p-5 xl:p-6">
                            <div className="panel__header min-w-0 flex-wrap gap-y-1">
                                <span className="panel__icon shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                                </span>
                                <h2 className="min-w-0 text-sm sm:text-base">Target Job Description</h2>
                                <span className="badge badge--required shrink-0">Required</span>
                            </div>
                            <textarea
                                onChange={(e) => { setJobDescription(e.target.value) }}
                                className="panel__textarea min-h-[160px] w-full max-w-full sm:min-h-[200px] xl:min-h-0 xl:flex-1"
                                placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                                maxLength={5000}
                                value={jobDescription}
                            />
                            <div className="char-counter">{jobDescription.length} / 5000 chars</div>
                        </div>

                        <div className="h-px w-full shrink-0 bg-[#2a3348] xl:hidden" aria-hidden />

                        <div className="panel-divider hidden w-px shrink-0 self-stretch xl:block" aria-hidden />

                        <div className="panel panel--right p-4 md:p-5 xl:p-6">
                            <div className="panel__header">
                                <span className="panel__icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                </span>
                                <h2 className="text-sm sm:text-base">Your Profile</h2>
                            </div>

                            <div className="upload-section">
                                <label className="section-label">
                                    Upload Resume
                                    <span className="badge badge--best">Best Results</span>
                                </label>
                                <label className="dropzone w-full max-w-full min-w-0" htmlFor="resume">
                                    <span className="dropzone__icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                    </span>
                                    <p className="dropzone__title text-center text-sm sm:text-base">Click to upload or drag &amp; drop</p>
                                    <p className="dropzone__subtitle">PDF or DOCX (Max 5MB)</p>
                                    <input ref={resumeInputRef} hidden type="file" id="resume" name="resume" accept=".pdf,.docx" />
                                </label>
                            </div>

                            <div className="or-divider"><span>OR</span></div>

                            <div className="self-description">
                                <label className="section-label" htmlFor="selfDescription">Quick Self-Description</label>
                                <textarea
                                    onChange={(e) => { setSelfDescription(e.target.value) }}
                                    id="selfDescription"
                                    name="selfDescription"
                                    className="panel__textarea panel__textarea--short w-full max-w-full"
                                    placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                                    value={selfDescription}
                                />
                            </div>

                            <div className="info-box min-w-0">
                                <span className="info-box__icon shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" stroke="#1a1f27" strokeWidth="2" /><line x1="12" y1="16" x2="12.01" y2="16" stroke="#1a1f27" strokeWidth="2" /></svg>
                                </span>
                                <p className="min-w-0 break-words text-xs sm:text-sm">Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
                            </div>
                        </div>
                    </div>

                    <div className="interview-card__footer flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4 xl:px-6">
                        <span className="footer-info text-center sm:text-left">AI-Powered Strategy Generation &bull; Approx 30s</span>
                        <button
                            onClick={handleGenerateReport}
                            type="button"
                            className="generate-btn w-full justify-center sm:w-auto sm:shrink-0"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                            Generate My Interview Strategy
                        </button>
                    </div>
                </div>

                {reports.length > 0 && (
                    <section className="recent-reports w-full max-w-full min-w-0 px-0">
                        <h2 className="mb-3 text-lg font-semibold sm:text-xl md:mb-4">My Recent Interview Plans</h2>
                        <ul className="reports-list grid w-full grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                            {reports.map(report => (
                                <li key={report._id} className="report-item" onClick={() => navigate(`/interview/${report._id}`)}>
                                    <h3 className="break-words">{report.title || 'Untitled Position'}</h3>
                                    <p className="report-meta text-sm text-[#7d8590]">Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                    <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                <footer className="page-footer flex w-full max-w-4xl flex-wrap justify-center gap-x-6 gap-y-2 px-2 pb-8">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Help Center</a>
                </footer>
            </div>
        </>
    )
}

export default Home
