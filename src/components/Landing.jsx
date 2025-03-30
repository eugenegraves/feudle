import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import FeatureCard from './FeatureCard'

function Landing({ onPlay }) {
  const canvasRef = useRef(null)
  const wheelRef = useRef(null)
  
  // Initialize and animate Three.js scene
  useEffect(() => {
    // Create scene, camera, and renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    })
    renderer.setSize(window.innerWidth * 0.5, window.innerHeight * 0.5)
    renderer.setClearColor(0x000000, 0)
    
    // Create wheel geometry
    const wheelGeometry = new THREE.CylinderGeometry(5, 5, 0.5, 32, 1)
    const wheelMaterials = []
    
    // Create alternating teal and gold segments
    const numSegments = 12
    for (let i = 0; i < numSegments; i++) {
      const color = i % 2 === 0 ? 0x00f5d4 : 0xffd700
      const material = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.5,
        roughness: 0.2,
      })
      wheelMaterials.push(material)
    }
    
    // Apply materials to wheel segments
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterials)
    scene.add(wheel)
    wheelRef.current = wheel
    
    // Position camera
    camera.position.z = 10
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    
    const pointLight = new THREE.PointLight(0x00f5d4, 1, 100)
    pointLight.position.set(5, 5, 5)
    scene.add(pointLight)
    
    // Wheel initial rotation
    wheel.rotation.x = Math.PI / 2 // Lay flat
    
    // Animation timeline with GSAP
    const tl = gsap.timeline()
    
    // Initial fast spin
    tl.to(wheel.rotation, {
      y: Math.PI * 8,
      duration: 4,
      ease: "power2.out"
    })
    
    // Slow to stop with some "ticks"
    tl.to(wheel.rotation, {
      y: Math.PI * 10,
      duration: 2,
      ease: "steps(8)",
      onComplete: () => {
        // Add glow effect when stopped
        gsap.to(pointLight, {
          intensity: 2,
          distance: 50,
          duration: 1,
          yoyo: true,
          repeat: -1
        })
      }
    })
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth * 0.5, window.innerHeight * 0.5)
    }
    
    window.addEventListener('resize', handleResize)
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      
      // Gentle continuous rotation
      wheel.rotation.z += 0.003
      
      renderer.render(scene, camera)
    }
    
    animate()
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize)
      scene.remove(wheel)
      wheelGeometry.dispose()
      wheelMaterials.forEach(material => material.dispose())
      renderer.dispose()
    }
  }, [])
  
  // GSAP animations for text and cards
  useEffect(() => {
    // Headline animation - flashing effect
    gsap.fromTo('.headline', 
      { opacity: 0, scale: 0.8 }, 
      { 
        opacity: 1, 
        scale: 1, 
        duration: 2,
        ease: "elastic.out(1, 0.3)",
        yoyo: true,
        repeat: 1,
        repeatDelay: 0.3
      }
    )
    
    // Subheadline slide up
    gsap.fromTo('.subheadline', 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.5, ease: "back.out(1.7)" }
    )
    
    // Feature cards staggered fade in
    gsap.fromTo('.feature-cards .card', 
      { y: 100, opacity: 0 }, 
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        stagger: 0.2, 
        delay: 1,
        ease: "back.out(1.2)"
      }
    )
    
    // Button pulse animation
    gsap.to('.play-button', {
      scale: 1.1,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    })
  }, [])

  const handlePlayClick = () => {
    if (onPlay) {
      onPlay()
    }
  }

  return (
    <div className="landing-container">
      <div className="wheel-container">
        <canvas ref={canvasRef} className="wheel-canvas"></canvas>
      </div>
      
      <div className="content-container">
        <h1 className="headline">Feudle: Guess the Crowd</h1>
        <h2 className="subheadline">Daily Fun, Feud-Style</h2>
        
        <div className="feature-cards">
          <FeatureCard title="Daily Prompts" icon="calendar" description="New challenges every day" />
          <FeatureCard title="Score Points" icon="star" description="Match popular answers" />
          <FeatureCard title="Beat the Buzzer" icon="clock" description="Test your speed and wit" />
        </div>
        
        <button className="play-button" onClick={handlePlayClick}>Play Now</button>
      </div>
    </div>
  )
}

export default Landing 