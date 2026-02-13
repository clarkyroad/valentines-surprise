
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, Stars, Sparkles } from 'lucide-react';

// --- Types & Interfaces ---
interface Position {
  x: number;
  y: number;
}

interface FloatingElement {
  id: number;
  style: React.CSSProperties;
  content: string | React.ReactNode;
}

// --- Helper Components ---

const FloatingHeart: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div className="heart-particle text-rose-400" style={style}>
    <Heart size={24} fill="currentColor" />
  </div>
);

const FloatingSadness: React.FC<{ style: React.CSSProperties; content: string | React.ReactNode }> = ({ style, content }) => (
  <div className="heart-particle text-gray-400" style={style}>
    {typeof content === 'string' ? <span className="text-3xl">{content}</span> : content}
  </div>
);

// --- Main App Component ---

const App: React.FC = () => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [rejectionCount, setRejectionCount] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState<Position | null>(null);
  const [yesButtonSize, setYesButtonSize] = useState(1);
  const [hearts, setHearts] = useState<{ id: number; style: React.CSSProperties }[]>([]);
  const [noEffects, setNoEffects] = useState<FloatingElement[]>([]);
  const [selectedHappyMeme, setSelectedHappyMeme] = useState<string | null>(null);
  const buttonAreaRef = useRef<HTMLDivElement>(null);

  // Reliable high-quality cute/funny rejection memes
  const sadMemes = [
    "https://media.giphy.com/media/L95Z8wUX8OyoU/giphy.gif", // Crying Pikachu
    "https://media.giphy.com/media/OPU6wUKARA8AU/giphy.gif", // Sad Spongebob
    "https://media.giphy.com/media/7SF5scGB2AFrO/giphy.gif", // Sad Dog
    "https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif", // Sad Cat
    "https://media.giphy.com/media/vncvVvC6y5tUv/giphy.gif", // Crying Panda
    "https://media.giphy.com/media/qQhCYKAtGZFC0/giphy.gif", // Dramatic Crying
    "https://media.giphy.com/media/9Y5BbDSkSTiY8/giphy.gif", // Devastated Cat
  ];

  // Collection of celebratory memes
  const happyMemes = [
    "https://media.giphy.com/media/XNnL0o4f6L5UuR7v1E/giphy.gif", // Milk Mocha Heart Hug
    "https://media.giphy.com/media/5GovlCZycMqd2/giphy.gif", // Happy Dance
    "https://media.giphy.com/media/l41lI4bY2eBIn0zfy/giphy.gif", // Cat Hug
    "https://media.giphy.com/media/14412MUKmbQqyc/giphy.gif", // Happy Puppy
  ];

  const defaultMeme = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbm9wdmNxdGthYnN4ZnlxY3FyeHp6eHp6eHp6eHp6eHp6eHppZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cLS1cfxvGOPVpf9g3y/giphy.gif"; 

  const handleNoInteraction = useCallback(() => {
    if (isAccepted) return;

    const area = buttonAreaRef.current;
    if (!area) return;

    const rect = area.getBoundingClientRect();
    const padding = 20;
    const btnWidth = 100;
    const btnHeight = 44;

    const newX = Math.random() * (rect.width - btnWidth - padding * 2) + padding;
    const newY = Math.random() * (rect.height - btnHeight - padding * 2) + padding;

    setNoButtonPos({ x: newX, y: newY });
    setRejectionCount(prev => prev + 1);
    setYesButtonSize(prev => Math.min(prev + 0.5, 8));

    // Add a floating "sad" indicator
    const emojis = ["😢", "😭", "💔", "🥺", "❌", "Nooo", "Rude!"];
    const newEffect: FloatingElement = {
      id: Date.now(),
      content: emojis[Math.floor(Math.random() * emojis.length)],
      style: {
        left: `${Math.random() * 80 + 10}vw`,
        bottom: '-50px',
        animationDuration: `${2 + Math.random() * 2}s`,
        animationDelay: '0s',
      }
    };
    setNoEffects(prev => [...prev, newEffect]);
  }, [isAccepted]);

  const handleYesClick = () => {
    setIsAccepted(true);
    setNoButtonPos(null);
    const randomHappy = happyMemes[Math.floor(Math.random() * happyMemes.length)];
    setSelectedHappyMeme(randomHappy);
    triggerConfetti();
  };

  const triggerConfetti = () => {
    const newHearts = Array.from({ length: 70 }).map((_, i) => ({
      id: Date.now() + i,
      style: {
        left: `${Math.random() * 100}vw`,
        bottom: '-50px',
        animationDuration: `${1.2 + Math.random() * 2.5}s`,
        animationDelay: `${Math.random() * 1.5}s`,
        transform: `scale(${0.4 + Math.random() * 1.6})`,
      }
    }));
    setHearts(prev => [...prev, ...newHearts]);
  };

  useEffect(() => {
    if (hearts.length > 0 || noEffects.length > 0) {
      const timer = setTimeout(() => {
        setHearts(prev => prev.filter(h => Date.now() - h.id < 6000));
        setNoEffects(prev => prev.filter(e => Date.now() - e.id < 6000));
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [hearts, noEffects]);

  const currentMeme = isAccepted 
    ? (selectedHappyMeme || happyMemes[0])
    : (rejectionCount > 0 ? sadMemes[(rejectionCount - 1) % sadMemes.length] : defaultMeme);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200">
      
      {/* Background Floating Hearts */}
      {hearts.map(heart => (
        <FloatingHeart key={heart.id} style={heart.style} />
      ))}

      {/* Floating Rejection Effects */}
      {noEffects.map(effect => (
        <FloatingSadness key={effect.id} style={effect.style} content={effect.content} />
      ))}

      {/* Decorative Ornaments */}
      <div className="absolute top-10 left-10 text-rose-300 animate-pulse hidden lg:block opacity-30">
        <Stars size={100} />
      </div>
      <div className="absolute bottom-10 right-10 text-pink-300 animate-bounce hidden lg:block opacity-30">
        <Sparkles size={100} />
      </div>

      <div 
        className={`max-w-xl w-full bg-white/95 backdrop-blur-xl rounded-[3.5rem] shadow-[0_40px_80px_rgba(255,50,120,0.25)] p-10 flex flex-col items-center text-center border-8 border-white relative z-10 transition-all duration-500`}
      >
        {/* Banner Image Frame */}
        <div className="w-full aspect-video mb-8 overflow-hidden rounded-3xl border-2 border-rose-50 shadow-inner bg-rose-50/50 flex items-center justify-center relative">
            <img 
              key={currentMeme}
              src={currentMeme} 
              alt="Valentine Interaction Meme" 
              className="w-full h-full object-contain p-4 animate-fade-in"
            />
            <div className="absolute inset-0 bg-rose-500/5 pointer-events-none"></div>
        </div>

        {/* Text Content */}
        {!isAccepted ? (
          <>
            <h1 className="text-4xl md:text-5xl font-bold text-rose-600 mb-4 fancy-font drop-shadow-sm leading-tight">
              Will you be my Valentine?
            </h1>
            <p className="text-gray-500 mb-8 text-xl font-medium min-h-[4rem] italic px-4">
              {rejectionCount === 0 
                ? "I have a special place in my heart for you... 👉👈" 
                : rejectionCount < 3 
                  ? "Are you sure? Look at my poor heart... 😭" 
                  : rejectionCount < 7
                    ? "Hey! Come back here and click Yes! 🥺"
                    : "The 'Yes' button is taking over! Give in! 😤"}
            </p>

            {/* Action Buttons Container */}
            <div 
              ref={buttonAreaRef}
              className="relative w-full h-64 mt-2 rounded-3xl bg-rose-50/20 border-2 border-dashed border-rose-100 flex items-center justify-center overflow-visible"
            >
              <button
                onClick={handleYesClick}
                style={{ transform: `scale(${yesButtonSize})` }}
                className="px-16 py-5 bg-rose-500 hover:bg-rose-600 text-white text-2xl font-black rounded-full shadow-[0_15px_40px_rgba(244,63,94,0.5)] transition-all active:scale-95 flex items-center gap-3 z-20 hover:rotate-2 relative group"
              >
                <div className="absolute inset-0 bg-white/20 group-hover:scale-110 transition-transform duration-700 blur-xl"></div>
                YES! <Heart size={32} fill="white" className="animate-pulse" />
              </button>

              <button
                onMouseEnter={handleNoInteraction}
                onClick={handleNoInteraction}
                style={noButtonPos ? { 
                  position: 'absolute', 
                  left: `${noButtonPos.x}px`, 
                  top: `${noButtonPos.y}px`,
                  transition: 'none'
                } : { position: 'relative', marginLeft: '3rem' }}
                className={`px-8 py-3 bg-white hover:bg-gray-100 text-gray-400 font-bold rounded-full shadow-sm z-30 border border-gray-100 transition-colors whitespace-nowrap active:scale-90`}
              >
                No {rejectionCount > 5 ? '🛑' : ''}
              </button>
            </div>
          </>
        ) : (
          <div className="animate-fade-in flex flex-col items-center">
            <h1 className="text-6xl md:text-7xl font-bold text-rose-600 mb-6 fancy-font drop-shadow-md">
              Yay! 💖
            </h1>
            <p className="text-3xl text-rose-400 font-black mb-10 animate-bounce tracking-wide uppercase">
              I KNEW IT! 🎉
            </p>
            <div className="flex justify-center gap-10 mb-10">
               <Heart className="text-rose-500 animate-pulse scale-150" size={64} fill="currentColor" />
               <Heart className="text-pink-400 animate-bounce delay-75 scale-125" size={72} fill="currentColor" />
               <Heart className="text-rose-500 animate-pulse delay-150 scale-150" size={64} fill="currentColor" />
            </div>
            
            <button 
              onClick={() => {
                setIsAccepted(false);
                setRejectionCount(0);
                setNoButtonPos(null);
                setYesButtonSize(1);
                setSelectedHappyMeme(null);
              }}
              className="mt-8 px-10 py-3 text-rose-300 hover:text-rose-600 text-sm font-bold transition-all border-2 border-rose-100 rounded-full hover:bg-white hover:shadow-lg active:scale-95"
            >
              Reset for more memes? ✨
            </button>
          </div>
        )}
      </div>

      <footer className="mt-10 text-rose-400 text-xs font-bold tracking-[0.4em] uppercase opacity-40 flex items-center gap-2">
        <Heart size={14} fill="currentColor" /> VALENTINE 2024 <Heart size={14} fill="currentColor" />
      </footer>
    </div>
  );
};

export default App;
