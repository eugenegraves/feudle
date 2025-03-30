import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import PodiumSpotlight from './PodiumSpotlight';
import LeaderCard from './LeaderCard';

const MOCK_LEADERBOARD_DATA = [
  { player: "Neon_Knight", score: 2500, rank: 1 },
  { player: "PixelPunisher", score: 2100, rank: 2 },
  { player: "QuizWizard", score: 1800, rank: 3 },
  { player: "MindMaster", score: 1650, rank: 4 },
  { player: "BrainiacBoss", score: 1520, rank: 5 },
  { player: "TriviaKing", score: 1490, rank: 6 },
  { player: "QuestionQueen", score: 1350, rank: 7 },
  { player: "PuzzlePro", score: 1280, rank: 8 },
  { player: "GameGenius", score: 1150, rank: 9 },
  { player: "WisdomWarrior", score: 1050, rank: 10 }
];

function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState(MOCK_LEADERBOARD_DATA);
  const headlineRef = useRef(null);
  const subheadlineRef = useRef(null);
  const contentRef = useRef(null);
  
  useEffect(() => {
    // Setup GSAP animations
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    // Initially hide elements
    gsap.set([headlineRef.current, subheadlineRef.current, contentRef.current], { 
      opacity: 0,
      y: 20
    });
    
    // Headline animation
    tl.to(headlineRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "back.out(1.7)"
    })
    // Subheadline animation with letter reveal
    .to(subheadlineRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6
    }, "-=0.3")
    // Content animation
    .to(contentRef.current, {
      opacity: 1,
      y: 0,
      duration: 1
    }, "-=0.2");
    
    // Letter-by-letter animation for subheadline
    const subheadText = subheadlineRef.current.innerText;
    subheadlineRef.current.innerHTML = '';
    
    Array.from(subheadText).forEach((letter, i) => {
      const span = document.createElement('span');
      span.textContent = letter;
      span.style.opacity = '0';
      span.style.display = 'inline-block';
      subheadlineRef.current.appendChild(span);
      
      gsap.to(span, {
        opacity: 1,
        y: 0,
        duration: 0.05,
        delay: 0.8 + i * 0.03,
        ease: "power1.out"
      });
      
      // Add slight rotation effect to some letters
      if (Math.random() > 0.7) {
        gsap.to(span, {
          rotation: (Math.random() - 0.5) * 10,
          duration: 0.3,
          delay: 0.8 + i * 0.03
        });
      }
    });
    
    // Setup scroll animations for leader cards
    const leaderCards = document.querySelectorAll('.leader-card');
    leaderCards.forEach((card, i) => {
      gsap.set(card, { 
        opacity: 0,
        x: i % 2 === 0 ? -20 : 20
      });
      
      gsap.to(card, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        delay: 2 + i * 0.1,
        ease: "power2.out"
      });
    });
  }, []);
  
  return (
    <div className="leaderboard-container">
      <div className="leaderboard-content">
        <h1 ref={headlineRef} className="leaderboard-headline">Leaderboard</h1>
        <h2 ref={subheadlineRef} className="leaderboard-subheadline">Top Feudle Champions</h2>
        
        <div ref={contentRef} className="leaderboard-main">
          <div className="podium-container">
            <PodiumSpotlight winners={leaderboardData.slice(0, 3).map(item => ({ name: item.player, score: item.score }))} />
          </div>
          
          <div className="leaderboard-list">
            <h3 className="list-title">Top 10 Players</h3>
            
            <div className="leaderboard-cards">
              {leaderboardData.map((data) => (
                <LeaderCard 
                  key={data.rank}
                  player={data.player}
                  rank={data.rank}
                  score={data.score}
                  isTopThree={data.rank <= 3}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard; 