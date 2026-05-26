import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import '../styles/auth.css'
import './LandingPage.css'
import { useTheme } from '../context/ThemeContext'

const EXPLORER_DATA = {
  frontend: {
    title: 'Frontend Mesh',
    description: 'Connect with UI specialists, React developers, and design engineers building fluid interfaces.',
    skills: ['React', 'TypeScript', 'CSS Grid', 'Next.js', 'Figma', 'Web Accessibility'],
    nodes: [
      { id: 1, name: 'Aisha Khan', role: 'Product Designer', cx: 120, cy: 100, r: 24, initial: 'A' },
      { id: 2, name: 'Ritika Sen', role: 'Frontend Engineer', cx: 320, cy: 120, r: 26, initial: 'R' },
      { id: 3, name: 'Ishita Roy', role: 'UX Researcher', cx: 220, cy: 220, r: 22, initial: 'I' }
    ],
    connections: [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 1 }
    ]
  },
  backend: {
    title: 'Backend Mesh',
    description: 'Link up with database architects, API developers, and systems engineers structuring secure logic.',
    skills: ['Java 21', 'Spring Boot', 'PostgreSQL', 'MongoDB', 'REST APIs', 'JWT Security'],
    nodes: [
      { id: 1, name: 'Rahul Verma', role: 'Backend Engineer', cx: 130, cy: 130, r: 26, initial: 'R' },
      { id: 2, name: 'Karan Bedi', role: 'Cloud Engineer', cx: 310, cy: 90, r: 24, initial: 'K' },
      { id: 3, name: 'Arjun Malhotra', role: 'Full-stack Dev', cx: 210, cy: 210, r: 25, initial: 'A' }
    ],
    connections: [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 1 }
    ]
  },
  devops: {
    title: 'Cloud & DevOps Mesh',
    description: 'Weave networks with reliability specialists, container developers, and automation leaders.',
    skills: ['Docker', 'Kubernetes', 'AWS Cloud', 'CI/CD Pipelines', 'Linux Systems', 'Terraform'],
    nodes: [
      { id: 1, name: 'Karan Bedi', role: 'DevOps Leader', cx: 110, cy: 110, r: 25, initial: 'K' },
      { id: 2, name: 'Mohit Sinha', role: 'SRE Specialist', cx: 300, cy: 130, r: 23, initial: 'M' },
      { id: 3, name: 'Varun Chopra', role: 'Security Architect', cx: 200, cy: 220, r: 26, initial: 'V' }
    ],
    connections: [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 1 }
    ]
  }
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState('login') // 'login' or 'register'

  // Skill explorer state
  const [activeCategory, setActiveCategory] = useState('frontend')
  const activeMesh = EXPLORER_DATA[activeCategory]

  const handleOpenAuth = (tab) => {
    setAuthModalTab(tab)
    setIsAuthModalOpen(true)
  }

  return (
    <div className="landing">
      {/* Animated SVG Mesh Background */}
      <div className="landing__mesh-bg" aria-hidden="true">
        <svg className="mesh-svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle className="mesh-hub hub-1" cx="150" cy="150" r="100" fill="url(#glow)" />
          <circle className="mesh-hub hub-2" cx="650" cy="200" r="120" fill="url(#glow)" />
          <circle className="mesh-hub hub-3" cx="400" cy="450" r="140" fill="url(#glow)" />

          <g stroke="var(--color-border)" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="3 3" className="mesh-grid">
            <line x1="100" y1="100" x2="300" y2="180" />
            <line x1="300" y1="180" x2="250" y2="350" />
            <line x1="250" y1="350" x2="100" y2="100" />
            <line x1="300" y1="180" x2="550" y2="120" />
            <line x1="550" y1="120" x2="680" y2="280" />
            <line x1="680" y1="280" x2="450" y2="400" />
            <line x1="450" y1="400" x2="250" y2="350" />
            <line x1="550" y1="120" x2="450" y2="400" />
          </g>

          <g fill="none" strokeWidth="2.5">
            <circle className="mesh-node node-1" cx="100" cy="100" r="6" stroke="var(--color-primary)" fill="var(--color-surface)" />
            <circle className="mesh-node node-2" cx="300" cy="180" r="8" stroke="var(--color-accent)" fill="var(--color-surface)" />
            <circle className="mesh-node node-3" cx="250" cy="350" r="5" stroke="var(--color-primary)" fill="var(--color-surface)" />
            <circle className="mesh-node node-4" cx="550" cy="120" r="7" stroke="var(--color-primary)" fill="var(--color-surface)" />
            <circle className="mesh-node node-5" cx="680" cy="280" r="9" stroke="var(--color-accent)" fill="var(--color-surface)" />
            <circle className="mesh-node node-6" cx="450" cy="400" r="6" stroke="var(--color-primary)" fill="var(--color-surface)" />
          </g>
        </svg>
      </div>

      <header className="landing__topbar">
        <div className="landing__topbar-inner">
          <div className="landing__topbrand">
            <span className="landing__logo" aria-hidden>
              <svg className="landing__logo-svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="5" r="2.5" fill="currentColor"/>
                <circle cx="5" cy="12" r="2.5" fill="currentColor"/>
                <circle cx="19" cy="12" r="2.5" fill="currentColor"/>
                <circle cx="12" cy="19" r="2.5" fill="currentColor"/>
                <line x1="12" y1="7.5" x2="5" y2="12" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="7.5" x2="19" y2="12" stroke="currentColor" strokeWidth="2"/>
                <line x1="5" y1="12" x2="12" y2="16.5" stroke="currentColor" strokeWidth="2"/>
                <line x1="19" y1="12" x2="12" y2="16.5" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"/>
              </svg>
            </span>
            <span className="landing__brand-title">SkillMesh</span>
          </div>

          <div className="landing__topactions">
            <button
              type="button"
              className="landing__theme-btn"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? '☾' : '☀'}
            </button>

            <div className="landing__top-cta">
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => handleOpenAuth('login')}
              >
                Sign in
              </button>
              <button
                type="button"
                className="btn btn--primary btn--sm"
                onClick={() => handleOpenAuth('register')}
              >
                Get started
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="landing__grid">
        <section className="landing__hero card">
          <div className="landing__hero-inner">
            <p className="landing__kicker">Next-Gen Professional Web</p>
            <h1 className="landing__headline">
              Weave your professional network<span>.</span>
            </h1>
            <p className="landing__subhead">
              Map your expertise, connect with creators, and collaborate in an interactive feed tailored to your professional skills.
            </p>

            <div className="landing__hero-cta">
              <button
                type="button"
                className="btn btn--primary btn--lg"
                onClick={() => handleOpenAuth('register')}
              >
                Create account
              </button>
              <button
                type="button"
                className="btn btn--ghost btn--lg"
                onClick={() => handleOpenAuth('login')}
              >
                Sign in
              </button>
            </div>

            <div className="landing__features-grid">
              <div className="landing__feature-card">
                <div className="landing__feature-icon-wrapper">🌐</div>
                <h3>Skill Nodes</h3>
                <p>Map your core expert competencies and project domains in a clean, visual format.</p>
              </div>
              <div className="landing__feature-card">
                <div className="landing__feature-icon-wrapper">🧬</div>
                <h3>Connection Mesh</h3>
                <p>Discover matching tech profiles, follow expert builders, and expand your professional web.</p>
              </div>
              <div className="landing__feature-card">
                <div className="landing__feature-icon-wrapper">✨</div>
                <h3>Interactive Feed</h3>
                <p>Engage with posts, share media, toggle likes, and exchange knowledge through threads.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="landing__right">
          {/* Visual Showcase - Feed Preview */}
          <aside className="landing__preview card" aria-hidden>
            <div className="landing__preview-browser">
              <div className="landing__preview-dots">
                <span />
                <span />
                <span />
              </div>
              <span className="landing__preview-url">SkillMesh / feed</span>
            </div>

            <div className="landing__preview-feed">
              <div className="landing__preview-card">
                <div className="landing__preview-header">
                  <span className="avatar avatar--sm">A</span>
                  <div>
                    <div className="landing__preview-name">Aisha Khan</div>
                    <div className="landing__preview-meta">@aishak · 2h</div>
                  </div>
                </div>
                <p className="landing__preview-text">
                  Wrapped a production launch today. Team collaboration made all the difference.
                </p>
                <div className="landing__preview-tags">
                  <span className="tag">React</span>
                  <span className="tag">Figma</span>
                  <span className="tag">Product Design</span>
                </div>
                <div className="landing__preview-media">
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80"
                    alt=""
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* New Interactive Skills Explorer Module */}
          <section className="landing__explorer card">
            <header className="landing__explorer-header">
              <h3>Explore SkillMesh Connections</h3>
              <p>Filter connections by core category to see node intersections.</p>
            </header>

            <div className="landing__explorer-tabs">
              <button
                type="button"
                className={`explorer-tab ${activeCategory === 'frontend' ? 'active' : ''}`}
                onClick={() => setActiveCategory('frontend')}
              >
                Frontend
              </button>
              <button
                type="button"
                className={`explorer-tab ${activeCategory === 'backend' ? 'active' : ''}`}
                onClick={() => setActiveCategory('backend')}
              >
                Backend
              </button>
              <button
                type="button"
                className={`explorer-tab ${activeCategory === 'devops' ? 'active' : ''}`}
                onClick={() => setActiveCategory('devops')}
              >
                Cloud/DevOps
              </button>
            </div>

            <div className="landing__explorer-body">
              <p className="explorer-description">{activeMesh.description}</p>
              
              <div className="explorer-skills-list">
                {activeMesh.skills.map((skill, index) => (
                  <span key={index} className="tag tag--explorer">{skill}</span>
                ))}
              </div>

              {/* Dynamic Interactive SVG Mesh Visualizer */}
              <div className="explorer-visualizer">
                <svg className="explorer-svg" viewBox="0 0 440 280">
                  {/* Grid Lines */}
                  <g stroke="var(--color-border)" strokeWidth="1.5" strokeOpacity="0.4">
                    {activeMesh.connections.map((conn, idx) => {
                      const fromNode = activeMesh.nodes.find(n => n.id === conn.from)
                      const toNode = activeMesh.nodes.find(n => n.id === conn.to)
                      return (
                        <line
                          key={idx}
                          x1={fromNode.cx}
                          y1={fromNode.cy}
                          x2={toNode.cx}
                          y2={toNode.cy}
                        />
                      )
                    })}
                  </g>

                  {/* Interactive Nodes */}
                  {activeMesh.nodes.map((node) => (
                    <g key={node.id} className="explorer-node-group">
                      {/* Connection outer ring */}
                      <circle
                        cx={node.cx}
                        cy={node.cy}
                        r={node.r + 4}
                        fill="transparent"
                        stroke="var(--color-primary-soft)"
                        strokeWidth="1.5"
                      />
                      {/* Central Node avatar */}
                      <circle
                        cx={node.cx}
                        cy={node.cy}
                        r={node.r}
                        fill="var(--color-surface)"
                        stroke="var(--color-primary)"
                        strokeWidth="2"
                      />
                      {/* Initial Letter */}
                      <text
                        x={node.cx}
                        y={node.cy + 4}
                        textAnchor="middle"
                        fill="var(--color-text)"
                        fontWeight="bold"
                        fontSize="12"
                      >
                        {node.initial}
                      </text>
                      {/* Node labels */}
                      <text
                        x={node.cx}
                        y={node.cy + node.r + 13}
                        textAnchor="middle"
                        fill="var(--color-text)"
                        fontWeight="800"
                        fontSize="10"
                      >
                        {node.name}
                      </text>
                      <text
                        x={node.cx}
                        y={node.cy + node.r + 23}
                        textAnchor="middle"
                        fill="var(--color-text-secondary)"
                        fontSize="8.5"
                      >
                        {node.role}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Modal Auth Dialog */}
      {isAuthModalOpen && (
        <div className="landing__auth-overlay" onClick={() => setIsAuthModalOpen(false)}>
          <div className="landing__auth-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="landing__auth-close"
              onClick={() => setIsAuthModalOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <div className="landing__auth-modal-content">
              {authModalTab === 'login' ? (
                <LoginForm
                  onBack={() => setIsAuthModalOpen(false)}
                  onSuccess={() => navigate('/feed')}
                  switchToRegister={() => setAuthModalTab('register')}
                />
              ) : (
                <RegisterForm
                  onBack={() => setIsAuthModalOpen(false)}
                  onSuccess={() => navigate('/feed')}
                  switchToLogin={() => setAuthModalTab('login')}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
