import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Edit2, Moon, Sun, Trophy, Upload, Palette } from 'lucide-react';

interface TimeConfig {
  hours: number;
  minutes: number;
  seconds: number;
}

interface HackathonDetails {
  name: string;
  organizer: string;
  venue: string;
  endMessage: string;
  logo: string;
  colors: {
    light: {
      from: string;
      to: string;
    };
    dark: {
      from: string;
      to: string;
    };
  };
}

function App() {
  const [timeLeft, setTimeLeft] = useState<TimeConfig>({ hours: 0, minutes: 0, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [initialTime, setInitialTime] = useState<TimeConfig>({ hours: 0, minutes: 0, seconds: 0 });
  const [hackathonDetails, setHackathonDetails] = useState<HackathonDetails>({
    name: "Hackathon",
    organizer: "Tech Community",
    venue: "Innovation Hub",
    endMessage: "Time's up! Great work everyone! 🎉",
    logo: "",
    colors: {
      light: {
        from: "#074799",
        to: "#009990"
      },
      dark: {
        from: "#074799",
        to: "#009990"
      }
    }
  });
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isEditingColors, setIsEditingColors] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Update CSS variables when colors change
    const root = document.documentElement;
    if (isDarkMode) {
      root.style.setProperty('--gradient-from', hackathonDetails.colors.dark.from);
      root.style.setProperty('--gradient-to', hackathonDetails.colors.dark.to);
      root.style.setProperty('--card-from', `${hackathonDetails.colors.light.from}33`); // 20% opacity
      root.style.setProperty('--card-to', `${hackathonDetails.colors.light.to}33`); // 20% opacity
    } else {
      root.style.setProperty('--gradient-from', hackathonDetails.colors.light.from);
      root.style.setProperty('--gradient-to', hackathonDetails.colors.light.to);
      root.style.setProperty('--card-from', '#ffffff1a'); // 10% white
      root.style.setProperty('--card-to', '#ffffff1a');
    }
  }, [isDarkMode, hackathonDetails.colors]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
            setIsRunning(false);
            setIsEnded(true);
            return prev;
          }

          let newSeconds = prev.seconds - 1;
          let newMinutes = prev.minutes;
          let newHours = prev.hours;

          if (newSeconds < 0) {
            newSeconds = 59;
            newMinutes -= 1;
          }

          if (newMinutes < 0) {
            newMinutes = 59;
            newHours -= 1;
          }

          return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
    setIsEnded(false);
  };

  const handleTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInitialTime({ ...timeLeft });
    setIsEditing(false);
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingDetails(false);
  };

  const handleColorsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingColors(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHackathonDetails(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const containerClasses = "min-h-screen transition-colors duration-500 bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)]";
  const cardClasses = "transform transition-all duration-500 bg-gradient-to-br from-[var(--card-from)] to-[var(--card-to)] backdrop-blur-lg rounded-2xl p-8 w-full max-w-5xl shadow-xl border border-white/10";

  if (isEnded) {
    return (
      <div className={containerClasses + " flex items-center justify-center p-4"}>
        <div className={cardClasses + " animate-fade-in"}>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-white/70 hover:text-white transition-colors"
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
          {hackathonDetails.logo && (
            <img 
              src={hackathonDetails.logo} 
              alt="HackIndia Logo" 
              className="h-32 mx-auto mb-8 animate-fade-in"
            />
          )}
          <div className="text-center space-y-8 animate-bounce-in">
            <Trophy className="w-40 h-40 text-yellow-500 mx-auto" />
            <h2 className="title-text font-extrabold text-white mb-6">{hackathonDetails.endMessage}</h2>
            <button
              onClick={handleReset}
              className="bg-white/10 hover:bg-white/20 text-white px-12 py-6 rounded-lg transition-colors text-2xl font-semibold"
            >
              Start New Timer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses + " flex items-center justify-center p-4"}>
      <div className={cardClasses}>
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-white/70 hover:text-white transition-colors"
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <button
              onClick={() => setIsEditingColors(!isEditingColors)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <Palette size={24} />
            </button>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
            >
              <Upload size={20} />
              <span className="text-sm">Upload Logo</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLogoUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => setIsEditingDetails(!isEditingDetails)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <Edit2 size={20} />
            </button>
          </div>
        </div>

        {isEditingColors && (
          <form onSubmit={handleColorsSubmit} className="mb-8 p-4 bg-black/20 rounded-lg border border-white/10">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-white font-semibold mb-2">Light Mode Colors</h3>
                <div>
                  <label className="block text-white/70 text-sm mb-1">From Color</label>
                  <input
                    type="color"
                    value={hackathonDetails.colors.light.from}
                    onChange={(e) => setHackathonDetails(prev => ({
                      ...prev,
                      colors: {
                        ...prev.colors,
                        light: { ...prev.colors.light, from: e.target.value }
                      }
                    }))}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">To Color</label>
                  <input
                    type="color"
                    value={hackathonDetails.colors.light.to}
                    onChange={(e) => setHackathonDetails(prev => ({
                      ...prev,
                      colors: {
                        ...prev.colors,
                        light: { ...prev.colors.light, to: e.target.value }
                      }
                    }))}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-white font-semibold mb-2">Dark Mode Colors</h3>
                <div>
                  <label className="block text-white/70 text-sm mb-1">From Color</label>
                  <input
                    type="color"
                    value={hackathonDetails.colors.dark.from}
                    onChange={(e) => setHackathonDetails(prev => ({
                      ...prev,
                      colors: {
                        ...prev.colors,
                        dark: { ...prev.colors.dark, from: e.target.value }
                      }
                    }))}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">To Color</label>
                  <input
                    type="color"
                    value={hackathonDetails.colors.dark.to}
                    onChange={(e) => setHackathonDetails(prev => ({
                      ...prev,
                      colors: {
                        ...prev.colors,
                        dark: { ...prev.colors.dark, to: e.target.value }
                      }
                    }))}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-colors"
            >
              Save Colors
            </button>
          </form>
        )}

        {hackathonDetails.logo && (
          <div className="flex justify-center mb-8">
            <img 
              src={hackathonDetails.logo} 
              alt="HackIndia Logo" 
              className="h-28 animate-fade-in"
            />
          </div>
        )}

        {isEditingDetails ? (
          <form onSubmit={handleDetailsSubmit} className="space-y-4 mb-8">
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-1">Hackathon Name</label>
                <input
                  type="text"
                  value={hackathonDetails.name}
                  onChange={(e) => setHackathonDetails(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">Organizer</label>
                <input
                  type="text"
                  value={hackathonDetails.organizer}
                  onChange={(e) => setHackathonDetails(prev => ({ ...prev, organizer: e.target.value }))}
                  className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">Venue</label>
                <input
                  type="text"
                  value={hackathonDetails.venue}
                  onChange={(e) => setHackathonDetails(prev => ({ ...prev, venue: e.target.value }))}
                  className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">End Message</label>
                <input
                  type="text"
                  value={hackathonDetails.endMessage}
                  onChange={(e) => setHackathonDetails(prev => ({ ...prev, endMessage: e.target.value }))}
                  className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-colors"
            >
              Save Details
            </button>
          </form>
        ) : (
          <div className="text-center mb-8 space-y-2">
            <h1 className="title-text font-extrabold text-white animate-fade-in">{hackathonDetails.name}</h1>
            <p className="subtitle-text text-white/70">{hackathonDetails.organizer}</p>
            <p className="subtitle-text text-white/70">{hackathonDetails.venue}</p>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleTimeSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-1">Hours</label>
                <input
                  type="number"
                  min="0"
                  value={timeLeft.hours}
                  onChange={(e) => setTimeLeft(prev => ({ ...prev, hours: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={timeLeft.minutes}
                  onChange={(e) => setTimeLeft(prev => ({ ...prev, minutes: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={timeLeft.seconds}
                  onChange={(e) => setTimeLeft(prev => ({ ...prev, seconds: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-colors"
            >
              Set Timer
            </button>
          </form>
        ) : (
          <>
            <div className="text-center mb-12">
              <div 
                className="timer-text font-extrabold text-white tracking-wider animate-pulse-subtle leading-none"
                onClick={() => setIsEditing(true)}
              >
                {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
              </div>
            </div>

            <div className="flex justify-center space-x-8">
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  className="bg-green-500/20 hover:bg-green-500/30 text-white p-6 rounded-full transition-colors transform hover:scale-110"
                >
                  <Play size={48} />
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="bg-yellow-500/20 hover:bg-yellow-500/30 text-white p-6 rounded-full transition-colors transform hover:scale-110"
                >
                  <Pause size={48} />
                </button>
              )}
              <button
                onClick={handleReset}
                className="bg-red-500/20 hover:bg-red-500/30 text-white p-6 rounded-full transition-colors transform hover:scale-110"
              >
                <RotateCcw size={48} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;