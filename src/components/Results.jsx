import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import Header from './Header'
import ResultsBoard from './ResultsBoard'
import './results.css'

function Results({ onPlayAgain, score = 75, strikes = 2 }) {
  // Use props for score and strikes if provided, otherwise use defaults
  const maxScore = 100
  const maxStrikes = 3
  const isWinner = score >= 50
  
  const canvasRef = useRef(null)
  const trophyRef = useRef(null)
  
  // Initialize 3D scene
  useEffect(() => {
    // Create scene, camera, and renderer
    const scene = new THREE.Scene()
    
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    })
    
    // Set initial size
    const setRendererSize = () => {
      const container = canvasRef.current.parentElement;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    
    setRendererSize();
    renderer.setClearColor(0x000000, 0)
    
    // Handle window resize
    const handleResize = () => {
      setRendererSize();
    }
    
    window.addEventListener('resize', handleResize);
    
    // Create trophy group
    const trophy = new THREE.Group()
    scene.add(trophy)
    trophyRef.current = trophy
    
    // Enhanced base with more details
    const baseGeometry = new THREE.CylinderGeometry(2.2, 2.5, 0.8, 32)
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.9,
      roughness: 0.1
    })
    const base = new THREE.Mesh(baseGeometry, baseMaterial)
    base.position.y = -3
    trophy.add(base)
    
    // Second tier base (smaller)
    const base2Geometry = new THREE.CylinderGeometry(1.8, 2.2, 0.5, 32)
    const base2Material = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.9,
      roughness: 0.1
    })
    const base2 = new THREE.Mesh(base2Geometry, base2Material)
    base2.position.y = -2.35
    trophy.add(base2)
    
    // Decorative ring
    const ringGeometry = new THREE.TorusGeometry(1.8, 0.15, 16, 32)
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.9,
      roughness: 0.1
    })
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.position.y = -2
    ring.rotation.x = Math.PI / 2
    trophy.add(ring)
    
    // Trophy pedestal
    const pedestalGeometry = new THREE.CylinderGeometry(0.7, 1.2, 1, 32)
    const pedestalMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.8,
      roughness: 0.2
    })
    const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial)
    pedestal.position.y = -1.2
    trophy.add(pedestal)
    
    // Trophy stem
    const stemGeometry = new THREE.CylinderGeometry(0.4, 0.6, 2.5, 32)
    const stemMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.7,
      roughness: 0.3
    })
    const stem = new THREE.Mesh(stemGeometry, stemMaterial)
    stem.position.y = 0.5
    trophy.add(stem)
    
    // Trophy cup bottom (wider, bowl-like shape)
    const cupBottomGeometry = new THREE.CylinderGeometry(1.5, 0.5, 1.5, 32)
    const cupBottomMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.9,
      roughness: 0.1
    })
    const cupBottom = new THREE.Mesh(cupBottomGeometry, cupBottomMaterial)
    cupBottom.position.y = 2.5
    trophy.add(cupBottom)
    
    // Trophy cup middle
    const cupMiddleGeometry = new THREE.CylinderGeometry(1.8, 1.5, 1, 32)
    const cupMiddleMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.9,
      roughness: 0.1
    })
    const cupMiddle = new THREE.Mesh(cupMiddleGeometry, cupMiddleMaterial)
    cupMiddle.position.y = 3.5
    trophy.add(cupMiddle)
    
    // Trophy cup top (flared open)
    const cupTopGeometry = new THREE.CylinderGeometry(2.2, 1.8, 1, 32)
    const cupTopMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.9,
      roughness: 0.1
    })
    const cupTop = new THREE.Mesh(cupTopGeometry, cupTopMaterial)
    cupTop.position.y = 4.5
    trophy.add(cupTop)
    
    // Trophy handles (left)
    const handleGeometry = new THREE.TorusGeometry(0.8, 0.15, 16, 32, Math.PI)
    const handleMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.8,
      roughness: 0.2
    })
    const handleLeft = new THREE.Mesh(handleGeometry, handleMaterial)
    handleLeft.position.set(-1.8, 3.5, 0)
    handleLeft.rotation.y = Math.PI / 2
    trophy.add(handleLeft)
    
    // Trophy handles (right)
    const handleRight = new THREE.Mesh(handleGeometry, handleMaterial)
    handleRight.position.set(1.8, 3.5, 0)
    handleRight.rotation.y = -Math.PI / 2
    trophy.add(handleRight)
    
    // Trophy crown/top decoration
    const crownBaseGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.3, 32)
    const crownBaseMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.9,
      roughness: 0.1
    })
    const crownBase = new THREE.Mesh(crownBaseGeometry, crownBaseMaterial)
    crownBase.position.y = 5.3
    trophy.add(crownBase)
    
    // Star on top
    const starGeometry = new THREE.OctahedronGeometry(0.6)
    const starMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 1,
      roughness: 0,
      emissive: 0xffd700,
      emissiveIntensity: 0.2
    })
    const star = new THREE.Mesh(starGeometry, starMaterial)
    star.position.y = 6
    star.rotation.y = Math.PI / 4
    trophy.add(star)
    
    // Add decorative text plate
    const textPlateGeometry = new THREE.BoxGeometry(2.5, 0.8, 0.1)
    const textPlateMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.5,
      roughness: 0.5
    })
    const textPlate = new THREE.Mesh(textPlateGeometry, textPlateMaterial)
    textPlate.position.y = -2.5
    textPlate.position.z = 1.5
    textPlate.rotation.x = Math.PI * 0.1
    trophy.add(textPlate)
    
    // Scale the entire trophy - increase from 0.7 to 1.0
    trophy.scale.set(1.0, 1.0, 1.0)
    trophy.position.y = -2
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)
    
    const pointLight = new THREE.PointLight(0xffd700, 0.8, 100)
    pointLight.position.set(-5, 5, 5)
    scene.add(pointLight)
    
    // Spotlight to create dramatic effect
    const spotLight = new THREE.SpotLight(0xffffff, 1.5)
    spotLight.position.set(0, 10, 5)
    spotLight.angle = Math.PI / 6
    spotLight.penumbra = 0.3
    spotLight.castShadow = true
    scene.add(spotLight)
    
    // Position camera - move camera back to see the bigger trophy
    camera.position.z = 12
    camera.position.y = 2
    
    // Trophy position and animation based on win/lose
    if (isWinner) {
      // Trophy stands upright and spins if user won
      trophy.rotation.x = 0
      
      // Spinning animation
      gsap.to(trophy.rotation, {
        y: Math.PI * 2,
        duration: 15,
        repeat: -1,
        ease: "none"
      })
      
      // Floating animation
      gsap.to(trophy.position, {
        y: -0.7,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })
      
      // Add sparkle effect
      gsap.to(pointLight, {
        intensity: 1.5,
        distance: 20,
        duration: 1.5,
        repeat: -1,
        yoyo: true
      })
      
      // Star pulsing
      gsap.to(star.scale, {
        x: 1.2,
        y: 1.2,
        z: 1.2,
        duration: 1,
        repeat: -1,
        yoyo: true
      })
      
      // Star rotating faster than the trophy
      gsap.to(star.rotation, {
        y: Math.PI * 2,
        duration: 3,
        repeat: -1,
        ease: "none"
      })
    } else {
      // Trophy lies flat if user lost
      trophy.rotation.x = Math.PI / 2
      trophy.position.y = -1.5
      
      // Subtle movement for non-winners
      gsap.to(trophy.rotation, {
        z: 0.05,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })
    }
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    
    animate()
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      scene.remove(trophy)
      renderer.dispose()
    }
  }, [isWinner])
  
  // GSAP animations for text elements
  useEffect(() => {
    // Headline burst animation
    gsap.fromTo('.results-headline', 
      { scale: 0, opacity: 0 }, 
      { 
        scale: 1, 
        opacity: 1, 
        duration: 2, 
        ease: "elastic.out(1, 0.3)"
      }
    )
  }, [])
  
  const handlePlayAgain = () => {
    if (onPlayAgain) {
      onPlayAgain()
    }
  }
  
  return (
    <div className="results-container">
      <div className="results-content">
        <h1 className="results-headline">Round Over!</h1>
        
        <div className="trophy-container">
          <canvas ref={canvasRef} className="trophy-canvas"></canvas>
        </div>
        
        <ResultsBoard score={score} maxScore={maxScore} strikes={strikes} maxStrikes={maxStrikes} />
        
        {isWinner ? (
          <h2 className="winner-message">You're a Feudle Champ!</h2>
        ) : (
          <h2 className="loser-message">Buzzed Out!</h2>
        )}
        
        <button className="play-again-button" onClick={handlePlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  )
}

export default Results 