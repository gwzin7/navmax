
import React, { useState, useEffect } from "react";
import { Clock, X, RefreshCw, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/language/LanguageContext";
import { Progress } from "@/components/ui/progress";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

const FocusModePage = () => {
  const { translate } = useLanguage();
  const [focusActive, setFocusActive] = useState(false);
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [sessionType, setSessionType] = useState<'focus' | 'break'>('focus');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage for the timer
  const calculateProgress = () => {
    const totalTime = sessionType === 'focus' ? 25 * 60 : 5 * 60;
    return 100 - ((timeRemaining / totalTime) * 100);
  };

  // Toggle focus mode
  const toggleFocusMode = () => {
    setFocusActive(!focusActive);
    if (pomodoroActive && !focusActive) {
      // If turning off focus mode while pomodoro is running, stop pomodoro
      setPomodoroActive(false);
    }
  };

  // Toggle pomodoro timer
  const togglePomodoro = () => {
    setPomodoroActive(!pomodoroActive);
  };

  // Reset pomodoro timer
  const resetPomodoro = () => {
    setPomodoroActive(false);
    setSessionType('focus');
    setTimeRemaining(25 * 60);
  };

  // Skip to next session
  const skipSession = () => {
    if (sessionType === 'focus') {
      // Switch to break
      setTimeRemaining(5 * 60);
      setSessionType('break');
      setCompletedPomodoros(prev => prev + 1);
    } else {
      // Switch to focus
      setTimeRemaining(25 * 60);
      setSessionType('focus');
    }
  };

  // Handle pomodoro timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (pomodoroActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (pomodoroActive && timeRemaining === 0) {
      // Timer completed, switch sessions
      skipSession();
    }

    return () => clearInterval(interval);
  }, [pomodoroActive, timeRemaining]);

  return (
    <div className="relative flex flex-col h-screen bg-navmax bg-paper-texture bg-opacity-10 bg-blend-overlay">
      {/* Main content area - blurred when focus mode is active */}
      <div className={`flex-1 overflow-hidden ${focusActive ? 'filter blur-sm transition-all' : ''}`}>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-8">{translate("focus.pageTitle")}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-navmax-muted rounded-xl p-6 border border-navmax-light">
              <h2 className="text-xl font-semibold mb-4">{translate("focus.whatIs")}</h2>
              <p className="text-navmax-foreground/70 mb-4">
                {translate("focus.description")}
              </p>
              <Button 
                onClick={toggleFocusMode}
                variant={focusActive ? "default" : "outline"}
                className={focusActive ? "bg-navmax-accent hover:bg-navmax-accent/90" : ""}
              >
                {focusActive 
                  ? translate("focus.deactivateMode") 
                  : translate("focus.activateMode")}
              </Button>
            </div>
            
            <div className="bg-navmax-muted rounded-xl p-6 border border-navmax-light">
              <h2 className="text-xl font-semibold mb-4">{translate("focus.pomodoro")}</h2>
              <p className="text-navmax-foreground/70 mb-4">
                {translate("focus.pomodoroDescription")}
              </p>
              
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline">
                    <Clock size={16} className="mr-2" />
                    {translate("focus.openPomodoro")}
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="bg-navmax p-6">
                  <DrawerHeader className="text-center">
                    <DrawerTitle>{translate("focus.pomodoroTimer")}</DrawerTitle>
                  </DrawerHeader>
                  
                  <div className="flex flex-col items-center mt-6">
                    <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="96"
                          cy="96"
                          r="88"
                          fill="none"
                          stroke="#333"
                          strokeWidth="8"
                        />
                        <circle
                          cx="96"
                          cy="96"
                          r="88"
                          fill="none"
                          stroke={sessionType === 'focus' ? "#ea384c" : "#4caf50"}
                          strokeWidth="8"
                          strokeDasharray="552.9"
                          strokeDashoffset={552.9 - (calculateProgress() / 100) * 552.9}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold">{formatTime(timeRemaining)}</span>
                        <span className="text-sm text-navmax-foreground/70 capitalize">
                          {sessionType === 'focus' ? translate("focus.focusSession") : translate("focus.breakSession")}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-4 mb-6">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={togglePomodoro}
                      >
                        {pomodoroActive ? <Pause size={16} /> : <Play size={16} />}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={resetPomodoro}
                      >
                        <RefreshCw size={16} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={skipSession}
                      >
                        <Clock size={16} />
                      </Button>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-navmax-foreground/70">
                        {translate("focus.completedPomodoros")}: <span className="font-semibold">{completedPomodoros}</span>
                      </p>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay for focus mode */}
      {focusActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-navmax bg-opacity-90 backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-8">{translate("focus.modeActive")}</h2>
          
          {pomodoroActive && (
            <div className="mb-12">
              <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="#333"
                    strokeWidth="6"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke={sessionType === 'focus' ? "#ea384c" : "#4caf50"}
                    strokeWidth="6"
                    strokeDasharray="351.9"
                    strokeDashoffset={351.9 - (calculateProgress() / 100) * 351.9}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{formatTime(timeRemaining)}</span>
                </div>
              </div>
              
              <div className="flex justify-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={togglePomodoro}
                >
                  {pomodoroActive ? <Pause size={14} className="mr-1" /> : <Play size={14} className="mr-1" />}
                  {pomodoroActive ? translate("focus.pause") : translate("focus.resume")}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={skipSession}
                >
                  <Clock size={14} className="mr-1" />
                  {translate("focus.skip")}
                </Button>
              </div>
            </div>
          )}
          
          <Button 
            onClick={toggleFocusMode}
            variant="outline"
          >
            <X size={16} className="mr-2" />
            {translate("focus.exitFocusMode")}
          </Button>
        </div>
      )}
      
      {/* Floating pomodoro timer */}
      {focusActive && !pomodoroActive && (
        <div className="absolute bottom-6 right-6 p-4 bg-navmax-muted rounded-lg border border-navmax-light shadow-lg">
          <Button 
            onClick={togglePomodoro}
            variant="outline"
            className="flex items-center"
          >
            <Clock size={16} className="mr-2" />
            {translate("focus.startPomodoro")}
          </Button>
        </div>
      )}
      
      <div className="p-6 text-xs text-navmax-foreground/50 absolute right-0 bottom-0">
        NAVMAX
      </div>
    </div>
  );
};

export default FocusModePage;
