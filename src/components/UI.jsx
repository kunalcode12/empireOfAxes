"use client";

import { useEffect, useState } from "react";
import { useGame } from "../hooks/useGame";

export const UI = () => {
  const startGame = useGame((state) => state.startGame);
  const balloonsHit = useGame((state) => state.balloonsHit);
  const targetHit = useGame((state) => state.targetHit);
  const throws = useGame((state) => state.throws);
  const firstGame = useGame((state) => state.firstGame);
  const [showGameOver, setShowGameOver] = useState(false);

  // Check if game is over
  useEffect(() => {
    if (throws === 0 && !firstGame) {
      // Small delay to show the game over dialog
      const timer = setTimeout(() => {
        setShowGameOver(true);
        // Make API call to deduct points
        deductUserPoints();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [throws, firstGame]);

  // Function to deduct points from user
  const deductUserPoints = async () => {
    try {
      // Get userId from URL params or localStorage
      const walletAddress =
        new URLSearchParams(window.location.search).get("wallet") ||
        localStorage.getItem("userId");

      console.log("User ID:", walletAddress);

      if (!walletAddress) {
        console.error("User ID not found");
        return;
      }

      // Calculate points to deduct (you can adjust this logic)
      const actualScore = balloonsHit * 10 + targetHit * 50;

      const response = await fetch(
        `https://be1.rostrafi.fun/api/v1/walletUser/${walletAddress}/points`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            walletAddress,
            points: actualScore,
            operation: "add",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to deduct points");
      }

      const data = await response.json();
      console.log("Points deducted successfully:", data);

      // Wait a bit before redirecting
      setTimeout(() => {
        window.location.href = `https://www.rostrafi.fun/?gameWon=true&gameName=AxeAscend&pointsEarned=${actualScore}`;
      }, 3000);
    } catch (error) {
      console.error("Error deducting points:", error);
    }
  };

  return (
    <section className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">
      <div className="absolute top-4 left-4 md:top-8 md:left-14 opacity-0 animate-fade-in-down animation-delay-200 pointer-events-auto">
        <a target="_blank">
          <img
            src="/images/logoEmpire.jpg"
            alt="Wawa Sensei logo"
            className="w-20 h-20 object-contain"
          />
        </a>
      </div>
      <div className="absolute left-4 md:left-15 -translate-x-1/2 -rotate-90 flex items-center gap-4 animation-delay-1500 animate-fade-in-down opacity-0">
        <div className="w-20 h-px bg-white/60"></div>
        <p className="text-white/60 text-xs">Break the curse</p>
      </div>

      <div
        className={`p-4 flex flex-col items-center gap-2 md:gap-4 mt-[50vh] animate-fade-in-up opacity-0 animation-delay-1000`}
      >
        {throws === 0 && firstGame && (
          <>
            <h1 className="bold text-white/80 text-4xl md:text-5xl font-extrabold text-center">
              🪓 Playing Ground
            </h1>
            <p className="text-white/70 text-sm">
              Become an axe master and break the curse of the temple by
              exploding balloons. 🎈 <br />
            </p>
            <button
              className="bg-white/80 text-black font-bold px-4 py-2 rounded-lg shadow-md hover:bg-white/100 transition duration-200 pointer-events-auto cursor-pointer"
              onClick={startGame}
            >
              Start Game
            </button>
          </>
        )}
      </div>
      <div className="absolute right-4 top-4 flex flex-col items-end justify-center gap-4">
        <div className="flex flex-col items-center gap-2 saturate-0">
          <p className="">
            {Array(throws)
              .fill(0)
              .map((_, index) => (
                <span key={index} className="text-white text-6xl">
                  🪓
                </span>
              ))}
          </p>
        </div>
        {!firstGame && (
          <>
            <div className="text-right">
              <p className="text-sm font-medium text-white">SCORE</p>
              <p className="text-6xl text-white font-bold">
                {balloonsHit * 5 + targetHit * 50}
              </p>
            </div>
            <p className="text-3xl text-white font-bold">🎈 {balloonsHit}</p>
            <p className="text-3xl text-white font-bold">🎯 {targetHit}</p>
          </>
        )}
      </div>

      {/* Game Over Dialog */}
      {showGameOver && (
        <div className="fixed inset-0 flex items-center justify-center z-20 pointer-events-auto">
          <div className="bg-black/80 backdrop-blur-md p-8 rounded-xl border border-white/20 max-w-md w-full shadow-2xl animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white/90 text-center mb-4">
              🏆 Game Over!
            </h2>
            <div className="space-y-4 mb-6">
              <p className="text-white/80 text-center text-xl">
                Congratulations, Axe Master!
              </p>
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="text-white/70 text-center mb-2">Final Score</h3>
                <p className="text-5xl text-white font-bold text-center">
                  {balloonsHit * 5 + targetHit * 50}
                </p>
                <div className="flex justify-center gap-8 mt-4">
                  <div className="text-center">
                    <p className="text-2xl">🎈</p>
                    <p className="text-white/90">{balloonsHit}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl">🎯</p>
                    <p className="text-white/90">{targetHit}</p>
                  </div>
                </div>
              </div>
              <p className="text-white/60 text-center text-sm">
                Redirecting to home page in a few seconds...
              </p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() =>
                  (window.location.href =
                    "https://www.rostrafi.fun/?gameWon=true&gameName=AxeAscend&pointsEarned=100")
                }
                className="bg-white/80 text-black font-bold px-6 py-2 rounded-lg shadow-md hover:bg-white/100 transition duration-200 cursor-pointer"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
