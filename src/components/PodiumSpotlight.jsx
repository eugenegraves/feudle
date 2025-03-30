import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

function PodiumSpotlight({ winners }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Set up scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#111');
    
    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      mountRef.current.clientWidth / mountRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.set(0, 4, 8);
    
    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    
    // Set up lights
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    // Main spotlight
    const spotLight = new THREE.SpotLight(0xffffff, 1.5);
    spotLight.position.set(0, 10, 5);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.3;
    spotLight.castShadow = true;
    spotLight.shadow.bias = -0.0001;
    scene.add(spotLight);
    
    // Colored accent lights
    const colors = [0xff4466, 0x44aaff, 0xaaff44];
    const positions = [
      [-5, 3, 3],
      [5, 3, 3],
      [0, 3, -5]
    ];
    
    positions.forEach((pos, i) => {
      const light = new THREE.PointLight(colors[i], 0.8, 10);
      light.position.set(...pos);
      scene.add(light);
      
      // Animate light intensity
      gsap.to(light, {
        intensity: 1.2,
        duration: 1.5 + i * 0.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });
    });
    
    // Create podium platforms
    const createPodium = (width, height, depth, position, color) => {
      // Platform geometry
      const geometry = new THREE.BoxGeometry(width, height, depth);
      
      // Materials
      const materials = [
        new THREE.MeshStandardMaterial({ color: color, metalness: 0.3, roughness: 0.7 }), // right
        new THREE.MeshStandardMaterial({ color: color, metalness: 0.3, roughness: 0.7 }), // left
        new THREE.MeshStandardMaterial({ color: color, metalness: 0.3, roughness: 0.7 }), // top
        new THREE.MeshStandardMaterial({ color: color, metalness: 0.3, roughness: 0.7 }), // bottom
        new THREE.MeshStandardMaterial({ color: color, metalness: 0.3, roughness: 0.7 }), // front
        new THREE.MeshStandardMaterial({ color: color, metalness: 0.3, roughness: 0.7 }), // back
      ];
      
      // Create mesh
      const podium = new THREE.Mesh(geometry, materials);
      podium.position.copy(position);
      podium.castShadow = true;
      podium.receiveShadow = true;
      
      // Add texture to top
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load('https://i.imgur.com/XoGkgQk.png'); // Placeholder texture
      materials[2].map = texture;
      
      return podium;
    };
    
    // Create the three podium platforms with different heights
    const firstPlace = createPodium(2, 3, 2, new THREE.Vector3(0, 1.5, 0), 0xFFD700);
    const secondPlace = createPodium(2, 2, 2, new THREE.Vector3(-2.5, 1, 0), 0xC0C0C0);
    const thirdPlace = createPodium(2, 1, 2, new THREE.Vector3(2.5, 0.5, 0), 0xCD7F32);
    
    scene.add(firstPlace, secondPlace, thirdPlace);
    
    // Create player name textures
    const createPlayerText = (name, position) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      
      // Background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Border
      ctx.strokeStyle = '#ffcc00';
      ctx.lineWidth = 5;
      ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
      
      // Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 40px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(name, canvas.width / 2, canvas.height / 2);
      
      // Create texture
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true
      });
      
      // Create mesh
      const geometry = new THREE.PlaneGeometry(2, 1);
      const textMesh = new THREE.Mesh(geometry, material);
      textMesh.position.copy(position);
      textMesh.rotation.x = -Math.PI / 8; // Tilt slightly upward
      
      // Initially invisible
      textMesh.visible = false;
      scene.add(textMesh);
      
      // Animate in
      setTimeout(() => {
        textMesh.visible = true;
        textMesh.scale.set(0.1, 0.1, 0.1);
        gsap.to(textMesh.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.8,
          ease: 'elastic.out(1, 0.3)'
        });
      }, 1500);
      
      return textMesh;
    };
    
    // Extract top 3 winners if available
    const top3 = winners && winners.length >= 3 
      ? winners.slice(0, 3) 
      : [
          { name: 'Champion', score: 2500 },
          { name: 'Runner-up', score: 2100 },
          { name: 'Third', score: 1800 }
        ];
    
    // Create name plates for each winner
    createPlayerText(top3[0].name, new THREE.Vector3(0, 3.2, 0.5));
    createPlayerText(top3[1].name, new THREE.Vector3(-2.5, 2.2, 0.5));
    createPlayerText(top3[2].name, new THREE.Vector3(2.5, 1.7, 0.5));
    
    // Add particle effect
    const createParticles = () => {
      const particleCount = 200;
      const particles = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount; i++) {
        // Position
        positions[i * 3] = (Math.random() - 0.5) * 10;  // x
        positions[i * 3 + 1] = Math.random() * 10;      // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;  // z
        
        // Color
        colors[i * 3] = Math.random();        // r
        colors[i * 3 + 1] = Math.random();    // g
        colors[i * 3 + 2] = Math.random() * 0.5 + 0.5;  // b (bias toward blue)
      }
      
      particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
      });
      
      const particleSystem = new THREE.Points(particles, material);
      scene.add(particleSystem);
      
      return {
        geometry: particles,
        system: particleSystem,
        update: () => {
          const positions = particles.attributes.position.array;
          for (let i = 0; i < particleCount; i++) {
            // Move particles upward and reset when they reach the top
            positions[i * 3 + 1] += 0.02;
            if (positions[i * 3 + 1] > 10) {
              positions[i * 3 + 1] = 0;
              positions[i * 3] = (Math.random() - 0.5) * 10;
              positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
            }
          }
          particles.attributes.position.needsUpdate = true;
        }
      };
    };
    
    const particles = createParticles();
    
    // Set up controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minDistance = 5;
    controls.maxDistance = 15;
    
    // Animation
    const podiums = [firstPlace, secondPlace, thirdPlace];
    podiums.forEach((podium, i) => {
      // Start from below
      podium.position.y = -2;
      
      // Animate in with delay
      gsap.to(podium.position, {
        y: podium.position.y + 3,
        delay: i * 0.3,
        duration: 1.2,
        ease: 'elastic.out(1, 0.3)'
      });
      
      // Subtle hover animation
      gsap.to(podium.position, {
        y: podium.position.y + 3 + 0.1,
        duration: 2 + i * 0.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: i * 0.3 + 1.2
      });
    });
    
    // Resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Update particles
      particles.update();
      
      // Update controls
      controls.update();
      
      // Render
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      
      // Dispose of resources
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
      renderer.dispose();
    };
  }, [winners]);
  
  return <div ref={mountRef} className="podium-spotlight" />;
}

export default PodiumSpotlight; 