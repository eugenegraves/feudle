import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

function FeatureCard({ title, icon, description }) {
  const cardRef = useRef(null)
  
  useEffect(() => {
    const card = cardRef.current
    
    // Set up 3D tilt effect on hover
    const handleMouseMove = (e) => {
      const { left, top, width, height } = card.getBoundingClientRect()
      const x = (e.clientX - left) / width - 0.5
      const y = (e.clientY - top) / height - 0.5
      
      gsap.to(card, {
        rotateY: x * 10, // rotate based on mouse X position
        rotateX: -y * 10, // rotate based on mouse Y position
        transformPerspective: 500,
        ease: 'power2.out',
        duration: 0.5
      })
      
      // Add glow effect based on mouse position
      gsap.to(card, {
        '--highlight-position': `${x * 100 + 50}% ${y * 100 + 50}%`,
        duration: 0.4
      })
    }
    
    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.3)'
      })
    }
    
    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])
  
  // Icons mapping
  const getIconClass = (iconName) => {
    const icons = {
      'calendar': '📅',
      'star': '⭐',
      'clock': '⏰'
    }
    return icons[iconName] || '🎮'
  }
  
  return (
    <div className="card" ref={cardRef}>
      <div className="card-icon">{getIconClass(icon)}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

export default FeatureCard 