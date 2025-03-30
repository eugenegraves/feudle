import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';

function LeaderCard({ player, rank, score, isTopThree }) {
  const cardRef = useRef(null);
  
  useEffect(() => {
    const card = cardRef.current;
    
    // Initialize as flat line
    gsap.set(card, { 
      scaleY: 0.1, 
      opacity: 0,
      transformOrigin: 'center bottom'
    });
    
    // Flip up with delay based on rank
    gsap.to(card, {
      scaleY: 1,
      opacity: 1,
      duration: 0.5,
      delay: 0.3 * rank, // Staggered delay
      ease: 'back.out(1.7)'
    });
    
    // Set up 3D tilt effect on hover
    const handleMouseMove = (e) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      
      gsap.to(card, {
        rotateY: x * 10, // rotate based on mouse X position
        rotateX: -y * 5, // rotate based on mouse Y position
        transformPerspective: 500,
        ease: 'power2.out',
        duration: 0.3
      });
      
      // Create spark effect on hover
      if (Math.random() > 0.9) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        const size = Math.random() * 5 + 2;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.left = `${e.clientX - left - size/2}px`;
        sparkle.style.top = `${e.clientY - top - size/2}px`;
        card.appendChild(sparkle);
        
        gsap.to(sparkle, {
          opacity: 0,
          y: -20 - Math.random() * 10,
          x: (Math.random() - 0.5) * 20,
          duration: 0.8,
          onComplete: () => {
            if (sparkle.parentNode === card) {
              card.removeChild(sparkle);
            }
          }
        });
      }
    };
    
    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [rank]);
  
  return (
    <div 
      ref={cardRef} 
      className={`leader-card ${isTopThree ? 'top-three' : ''}`}
    >
      <div className="rank">{rank}</div>
      <div className="player-name">{player}</div>
      <div className="player-score">{score} pts</div>
    </div>
  );
}

export default LeaderCard; 