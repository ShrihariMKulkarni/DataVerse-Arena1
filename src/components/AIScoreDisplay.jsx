import React, { useEffect, useRef, useState } from 'react'

function CountUp({ target, duration = 1200 }) {
  const [current, setCurrent] = useState(0)
  const frameRef = useRef(null)
  useEffect(() => {
    const start = Date.now()
    const step = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(eased * target))
      if (progress < 1) frameRef.current = requestAnimationFrame(step)
    }
    frameRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, duration])
  return <>{current}</>
}

function NeonProgressBar({ value, max = 10, color = 'cyan', delay = 0 }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth((value / max) * 100), delay + 100)
    return () => clearTimeout(t)
  }, [value, max, delay])
  const colorMap = {
    cyan: 'linear-gradient(90deg, #00ffff, #9d00ff)',
    magenta: 'linear-gradient(90deg, #ff0080, #9d00ff)',
    green: 'linear-gradient(90deg, #00ff88, #00ffff)',
    yellow: 'linear-gradient(90deg, #f0ff00, #00ffff)',
  }
  const shadowMap = {
    cyan: '0 0 8px #00ffff',
    magenta: '0 0 8px #ff0080',
    green: '0 0 8px #00ff88',
    yellow: '0 0 8px #f0ff00',
  }
  return (
    <div className="cyber-progress-track">
      <div
        className="cyber-progress-fill relative"
        style={{
          width: `${width}%`,
          background: colorMap[color] || colorMap.cyan,
          boxShadow: shadowMap[color] || shadowMap.cyan,
          transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
    </div>
  )
}

const CRITERIA_META = {
  functionality: { label: 'LIVE FUNCTIONALITY', icon: '⚡', color: 'cyan' },
  ui_ux: { label: 'UI / UX POLISH', icon: '◈', color: 'magenta' },
  innovation: { label: 'INNOVATION', icon: '◆', color: 'yellow' },
  impact: { label: 'REAL-WORLD IMPACT', icon: '◉', color: 'green' },
  technical_architecture: { label: 'TECH ARCHITECTURE', icon: '⟁', color: 'cyan' },
}

export default function AIScoreDisplay({ aiScore, animate = true }) {
  if (!aiScore) return null
  const { scores, total_ai_score, detected_stack, verdict, top_strengths, key_improvements } = aiScore

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="cyber-label mb-1">AI EVALUATION RESULT</div>
          <h3 className="cyber-heading text-lg neon-text-cyan">AI SCORE BREAKDOWN</h3>
        </div>
        <div className="text-center">
          <div className="cyber-label">TOTAL AI SCORE</div>
          <div
            className="cyber-heading text-4xl neon-text-cyan"
            style={{ textShadow: '0 0 20px #00ffff, 0 0 40px rgba(0,255,255,0.3)' }}
          >
            {animate ? <CountUp target={total_ai_score} duration={1500} /> : total_ai_score}
            <span className="text-cyber-muted text-xl">/50</span>
          </div>
        </div>
      </div>

      {/* Detected Stack */}
      {detected_stack && (
        <div className="cyber-card p-3 border-cyber-purple/30">
          <span className="cyber-label">DETECTED STACK</span>
          <span className="font-mono text-sm text-cyber-purple" style={{ textShadow: '0 0 6px #9d00ff' }}>
            {detected_stack}
          </span>
        </div>
      )}

      {/* Score Criteria */}
      <div className="space-y-4">
        {scores && Object.entries(CRITERIA_META).map(([key, meta], idx) => {
          const item = scores[key]
          if (!item) return null
          return (
            <div key={key} className="cyber-card p-4 hud-corners" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`neon-text-${meta.color} text-lg`}>{meta.icon}</span>
                  <span className="cyber-heading text-xs tracking-wider text-cyber-text">{meta.label}</span>
                </div>
                <div className={`cyber-heading text-xl neon-text-${meta.color}`}>
                  {animate ? <CountUp target={item.score} duration={1000 + idx * 200} /> : item.score}
                  <span className="text-cyber-muted text-sm">/10</span>
                </div>
              </div>
              <NeonProgressBar value={item.score} max={10} color={meta.color} delay={idx * 150} />
              {item.reason && (
                <p className="font-mono text-xs text-cyber-muted mt-2 leading-relaxed">{item.reason}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Verdict */}
      {verdict && (
        <div className="cyber-card p-5 border-cyber-cyan/30">
          <div className="cyber-label mb-2">AI VERDICT</div>
          <p className="font-mono text-sm text-cyber-text leading-relaxed">{verdict}</p>
        </div>
      )}

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {top_strengths?.length > 0 && (
          <div className="cyber-card p-4 border-cyber-green/20">
            <div className="cyber-label mb-3 neon-text-green">TOP STRENGTHS</div>
            <ul className="space-y-2">
              {top_strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 font-mono text-xs text-cyber-text">
                  <span className="neon-text-green mt-0.5">▶</span>{s}
                </li>
              ))}
            </ul>
          </div>
        )}
        {key_improvements?.length > 0 && (
          <div className="cyber-card p-4 border-cyber-yellow/20">
            <div className="cyber-label mb-3 neon-text-yellow">KEY IMPROVEMENTS</div>
            <ul className="space-y-2">
              {key_improvements.map((s, i) => (
                <li key={i} className="flex items-start gap-2 font-mono text-xs text-cyber-text">
                  <span className="neon-text-yellow mt-0.5">▶</span>{s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
