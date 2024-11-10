import React, { useState, useRef, useEffect } from 'react';
import '../index.css';

const Home = () => {
  const [isJumping, setIsJumping] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const heroRef = useRef(null);
  const enemyRef = useRef(null);

  const handleJump = () => {
    if (gameOver || !gameStarted) return;

    const currentTime = Date.now();

    if (currentTime - lastClickTime <= 1000) {
      setClickCount((prevCount) => prevCount + 1);
    } else {
      setClickCount(1);
    }

    setLastClickTime(currentTime);

    if (clickCount >= 5) {
      setIsButtonDisabled(true);
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 500); 
    }

    setIsJumping(true);
    setTimeout(() => {
      setIsJumping(false);
      if (!gameOver) setScore((prevScore) => prevScore + 1);
    }, 550);
  };

  const checkCollision = () => {
    if (!heroRef.current || !enemyRef.current) return;

    const heroRect = heroRef.current.getBoundingClientRect();
    const enemyRect = enemyRef.current.getBoundingClientRect();
    const halfOverlapWidth = Math.min(heroRect.width, enemyRect.width) / 2;

    const horizontalOverlap = 
      heroRect.left < enemyRect.right - halfOverlapWidth && 
      heroRect.right > enemyRect.left + halfOverlapWidth;
    const verticalOverlap = 
      heroRect.bottom > enemyRect.top && 
      heroRect.top < enemyRect.bottom;

    if (horizontalOverlap && verticalOverlap) {
      setGameOver(true);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setGameOver(false);
  };

  const restartGame = () => {
    setGameOver(false);
    setScore(0);
    setIsJumping(false);
    setClickCount(0);
    setLastClickTime(0);
    setIsButtonDisabled(false);
    setGameStarted(false);
  };

  useEffect(() => {
    if (!gameStarted || gameOver) {
      if (enemyRef.current) {
        enemyRef.current.style.animation = 'none';
      }
      return;
    }

    if (enemyRef.current) {
      enemyRef.current.style.animation = '';
    }

    const interval = setInterval(() => {
      checkCollision();
    }, 50);

    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        handleJump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleJump]);

  return (
    <div className="home-container">
      {!gameStarted && (
        <div className="start-screen">
          <h1>AbhiEscape</h1>
          <div className="game-instructions">
            <p>
              <strong>How to Play:</strong>
            </p>
            <p>Press the <strong>Up Arrow</strong> key or click the <strong>button</strong> at the bottom right corner to jump over the enemy and survive!</p>
            <p>Your goal is to survive as long as possible by jumping over the enemy.</p>
          </div>
          <button onClick={startGame} className="start-button">Start Game</button>
        </div>
      )}

      {gameStarted && (
        <>
          <div className="scoreboard">Score: {score}</div>
          <img
            ref={heroRef}
            src="/images/heroji.png"
            alt="Hero"
            className={`hero-image ${isJumping ? 'jump' : ''}`}
          />

          <img
            ref={enemyRef}
            src="/images/enemy.png"
            alt="Enemy"
            className={`enemy-image moveEnemy ${gameOver ? 'paused' : ''}`}
          />

          <button
            className="up-arrow-btn"
            onClick={handleJump}
            disabled={isButtonDisabled || gameOver}
          >
            ↑
          </button>

          {gameOver && (
            <div className="game-over-screen">
              <div className="game-over-message">GAME OVER</div>
              <div className="final-score">Your Score: {score}</div>
              <button onClick={restartGame} className="restart-button">Restart Game</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
