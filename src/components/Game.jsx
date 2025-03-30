import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import Header from './Header'
import GuessInput from './GuessInput'
import Scoreboard from './Scoreboard'
import RulesOverlay from './RulesOverlay'

function Game({ onGameOver }) {
  const [score, setScore] = useState(0)
  const [strikes, setStrikes] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showRules, setShowRules] = useState(true)
  const [gameCompleted, setGameCompleted] = useState(false)
  
  const canvasRef = useRef(null)
  const buzzerRef = useRef(null)
  const sceneRef = useRef(null)
  
  // Check for game completion conditions
  useEffect(() => {
    // Game is over if player has 3 strikes or reaches 100 points
    if (strikes >= 3 || score >= 100) {
      // Small delay to allow animations to complete
      const timer = setTimeout(() => {
        setGameCompleted(true)
        if (onGameOver) {
          // Pass the game data to the parent component
          onGameOver({
            score,
            strikes
          });
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [score, strikes, onGameOver]);
  
  // Initialize 3D scene
  useEffect(() => {
    // Create scene, camera, and renderer
    const scene = new THREE.Scene()
    sceneRef.current = scene
    
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
    
    // Create buzzer group
    const buzzer = new THREE.Group();
    scene.add(buzzer);
    buzzerRef.current = buzzer;
    
    // Buzzer base
    const baseGeometry = new THREE.CylinderGeometry(2.2, 2.5, 0.5, 32);
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x222222,
      metalness: 0.7,
      roughness: 0.3
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -1.2;
    buzzer.add(base);
    
    // Buzzer metallic rim
    const rimGeometry = new THREE.TorusGeometry(1.8, 0.2, 16, 32);
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0xb0b0b0,
      metalness: 0.9,
      roughness: 0.1
    });
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = -0.5;
    buzzer.add(rim);
    
    // Buzzer dome (main part)
    const domeGeometry = new THREE.SphereGeometry(1.8, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    
    // Create texture loader
    const textureLoader = new THREE.TextureLoader();
    
    // Create a canvas for the texture
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    
    // Fill with red
    context.fillStyle = '#cc0000';
    context.fillRect(0, 0, 256, 256);
    
    // Add some gradient for realism
    const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 220);
    gradient.addColorStop(0, 'rgba(255, 50, 50, 0.8)');
    gradient.addColorStop(0.7, 'rgba(180, 0, 0, 0.9)');
    gradient.addColorStop(1, 'rgba(100, 0, 0, 1)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
    
    // Add subtle circular highlights
    context.beginPath();
    context.arc(80, 80, 30, 0, Math.PI * 2);
    context.fillStyle = 'rgba(255, 255, 255, 0.2)';
    context.fill();
    
    // Create texture from canvas
    const domeTexture = new THREE.CanvasTexture(canvas);
    
    const domeMaterial = new THREE.MeshStandardMaterial({
      map: domeTexture,
      color: 0xff0000,
      metalness: 0.2,
      roughness: 0.3,
      envMapIntensity: 0.8,
      bumpScale: 0.005
    });
    
    const dome = new THREE.Mesh(domeGeometry, domeMaterial);
    // Fix orientation - the dome should be facing up, not down
    dome.position.y = -0.5;
    buzzer.add(dome);
    
    // Add a thin disc under the dome for a more realistic look
    const discGeometry = new THREE.CylinderGeometry(1.81, 1.81, 0.1, 32);
    const discMaterial = new THREE.MeshStandardMaterial({
      color: 0xaa0000,
      metalness: 0.5,
      roughness: 0.5
    });
    const disc = new THREE.Mesh(discGeometry, discMaterial);
    disc.position.y = -0.7;
    buzzer.add(disc);
    
    // Add subtle indentations on the dome
    const ringGeometry = new THREE.TorusGeometry(1.4, 0.05, 16, 32);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xdd0000,
      metalness: 0.4,
      roughness: 0.6
    });
    const decorRing = new THREE.Mesh(ringGeometry, ringMaterial);
    decorRing.rotation.x = Math.PI / 2;
    decorRing.position.y = -0.3;
    buzzer.add(decorRing);
    
    // Add smaller ring
    const smallRingGeometry = new THREE.TorusGeometry(0.8, 0.05, 16, 32);
    const smallRing = new THREE.Mesh(smallRingGeometry, ringMaterial);
    smallRing.rotation.x = Math.PI / 2;
    smallRing.position.y = -0.2;
    buzzer.add(smallRing);
    
    // Orient the buzzer to correct position
    buzzer.rotation.x = 0; // Not flipped anymore
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0xffd700, 0.6, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0x00f5d4, 0.4, 10);
    pointLight2.position.set(-2, 2, -2);
    scene.add(pointLight2);
    
    // Position camera
    camera.position.z = 6;
    camera.position.y = 1;
    
    // Subtle pulsing animation
    gsap.to(dome.scale, {
      x: 1.05,
      y: 1.05,
      z: 1.05,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    
    animate();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      scene.remove(buzzer);
      renderer.dispose();
      if (domeTexture) domeTexture.dispose();
    }
  }, []);
  
  // GSAP animations for text elements
  useEffect(() => {
    gsap.fromTo('.game-prompt', 
      { y: -50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.5, ease: "bounce.out" }
    )
  }, []);
  
  const handleSubmit = () => {
    if (gameCompleted) return;
    
    setIsSubmitting(true);
    
    // Animate buzzer press
    const buzzer = buzzerRef.current;
    
    gsap.timeline()
      .to(buzzer.scale, {
        y: 0.7,
        duration: 0.1,
        ease: "power1.in"
      })
      .to(buzzer.scale, {
        y: 1,
        duration: 0.3,
        ease: "elastic.out(1, 0.3)"
      });
    
    // Add visual feedback to the buzzer when pressed
    gsap.to(buzzer.children[2].material, { // The dome material
      emissive: new THREE.Color(0xff3333),
      emissiveIntensity: 0.5,
      duration: 0.1,
      onComplete: () => {
        gsap.to(buzzer.children[2].material, {
          emissiveIntensity: 0,
          duration: 0.3
        });
      }
    });
    
    // Mock score/strike update
    const random = Math.random();
    
    if (random > 0.7) {
      // Simulate correct answer
      setScore(prevScore => {
        const newScore = prevScore + Math.floor(Math.random() * 20) + 10;
        return newScore > 100 ? 100 : newScore;
      });
      
      // Flash the scoreboard
      gsap.to('.score-value', {
        color: '#ffd700',
        duration: 0.2,
        yoyo: true,
        repeat: 5,
        onComplete: () => setIsSubmitting(false)
      });
    } else {
      // Simulate incorrect answer
      if (strikes < 3) {
        setStrikes(prevStrikes => prevStrikes + 1);
      }
      
      // Flash the strikes
      gsap.to('.strikes-value', {
        color: '#ff0000',
        duration: 0.2,
        yoyo: true,
        repeat: 5,
        onComplete: () => setIsSubmitting(false)
      });
    }
  };
  
  const handleCloseRules = () => {
    setShowRules(false);
  };
  
  return (
    <>
      {showRules && <RulesOverlay onClose={handleCloseRules} />}
      
      <div className="game-container">
        <div className="game-content">
          <h1 className="game-prompt">Name something people do when they wake up</h1>
          
          <div className="buzzer-container">
            <canvas ref={canvasRef} className="buzzer-canvas"></canvas>
          </div>
          
          <GuessInput isSubmitting={isSubmitting} />
          
          <Scoreboard score={score} strikes={strikes} />
          
          <button 
            className="submit-button"
            onClick={handleSubmit}
            disabled={isSubmitting || gameCompleted}
          >
            Submit Guess
          </button>
          
          <button 
            className="rules-button"
            onClick={() => setShowRules(true)}
            style={{ marginTop: '1rem', backgroundColor: 'transparent', border: '1px solid var(--accent-color)' }}
          >
            Show Rules
          </button>
        </div>
      </div>
    </>
  );
}

export default Game 