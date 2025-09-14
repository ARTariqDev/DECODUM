"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import RulesModal from "@/components/RulesModal";
import Timer from "@/components/Timer";
import Navbar from "@/components/Navbar";
import Maze from "@/components/Maze";
import TaskDescription from "@/components/TaskDescription";
import Button from "@/components/Button";
import Footer from "@/components/Footer";

const Tasks = () => {
  const handleCloseRulesModal = async () => {
    setShowRulesModal(false);
    setTimerStarted(true);
    sessionStorage.setItem("seenRulesModal", "1");
    // Start timer in backend if not already started
    try {
      const res = await fetch("/api/timer/time-started");
      const { timeStarted } = await res.json();
      if (!timeStarted) {
        await fetch("/api/timer/time-started", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newTime: Date.now() }),
        });
      }
    } catch (err) {
      console.error("Error starting timer in backend:", err);
    }
    // Re-sync timer
    if (typeof window !== "undefined") {
      // Wait a moment for backend to update
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  };
  const [showDescription, setShowDescription] = useState(true);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(7200);
  const TIMER_KEY = "decodum_timer_start";
  const timerExpiredRef = useRef(false);
  const loggedOutRef = useRef(false);
  // Show modal only on first login (sessionStorage flag) and sync timer
  useEffect(() => {
    if (typeof window === "undefined") return;
    const seenRules = sessionStorage.getItem("seenRulesModal");
    if (!seenRules) {
      setShowRulesModal(true);
      setLoading(false);
    } else {
      setShowRulesModal(false);
      // Only sync timer after modal is hidden
      (async function syncTimerWithBackend() {
        try {
          const res = await fetch("/api/timer/time-started");
          const { timeStarted } = await res.json();
          let start = timeStarted;
          if (!start) {
            // If not started, POST to start timer
            const now = Date.now();
            await fetch("/api/timer/time-started", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ newTime: now }),
            });
            start = now;
          }
          // Check if timer already ended
          const endedRes = await fetch("/api/timer/time-ended");
          const { timeEnded } = await endedRes.json();
          if (timeEnded) {
            // Timer already ended, set timer to 0
            setTimerSeconds(0);
            setTimerStarted(true);
            setLoading(false);
            return;
          }
          // Calculate seconds left
          const nowSec = Math.floor(Date.now() / 1000);
          const startSec = Math.floor(start / 1000);
          const elapsed = nowSec - startSec;
          const left = Math.max(7200 - elapsed, 0);
          setTimerSeconds(left);
          setTimerStarted(true);
          setLoading(false);
        } catch (err) {
          console.error("Error syncing timer with backend:", err);
          setLoading(false);
        }
      })();
    }
  }, []);

  // Timer interval effect (separate from loading/modal logic)
  useEffect(() => {
    if (!timerStarted || timerExpiredRef.current || loggedOutRef.current)
      return;
    if (timerSeconds <= 0) {
      timerExpiredRef.current = true;
      handleTimerExpire();
      return;
    }
    const interval = setInterval(() => {
      if (!loggedOutRef.current) {
        setTimerSeconds((s) => {
          if (s <= 1) {
            return 0;
          }
          return s - 1;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [timerStarted, timerSeconds]);

  const handleTimerExpire = async () => {
    if (loggedOutRef.current) return;
    loggedOutRef.current = true;
    // Mark timer ended in backend
    try {
      await fetch("/api/timer/time-ended", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newTime: Date.now() }),
      });
    } catch (err) {
      console.error("Error posting time-ended:", err);
    }
    // Save all answers (simulate by calling saveAnswer for current task)
    await saveAnswer();
    // Log out user (clear session and redirect)
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/?logout=1";
  };
  const [mazeProgress, setMazeProgress] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [mazeCompleted, setMazeCompleted] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [teamName, setTeamName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [taskAnswers, setTaskAnswers] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await fetch("/api/tasks");
        const data = await response.json();
        setTasks(data.tasks);
      } catch (error) {
        console.error("Error loading tasks:", error);
        // Fallback task if JSON loading fails
        setTasks([
          {
            id: 1,
            title: "Default Task",
            description: "Complete the maze challenge",
            correctAnswers: ["start"],
          },
        ]);
      }
    };

    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth", {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          setTeamName(data.teamId);
          setIsAuthenticated(true);
          setMazeProgress(data.mazeProgress || 0);
          setCurrentTaskIndex(data.currentTaskIndex || 0);
          setTaskAnswers(data.taskAnswers || {});

          // Set maze completed if progress is 11
          if (data.mazeProgress >= 11) {
            setMazeCompleted(true);
          }
        } else {
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        window.location.href = "/login";
      }
    };

    loadTasks();
    checkAuth();
  }, []);

  // Update current answer when task changes
  useEffect(() => {
    const currentTask = tasks[currentTaskIndex];
    if (currentTask) {
      setCurrentAnswer(taskAnswers[currentTask.id] || "");
    }
  }, [currentTaskIndex, taskAnswers, tasks]);

  const currentTask = tasks[currentTaskIndex] || tasks[0];

  // Dummy state to force Maze re-render after save/clear
  const [actualProgressTrigger, setActualProgressTrigger] = useState(0);
  const calculateActualProgress = () => {
    return Object.values(taskAnswers).filter(
      (answer) => answer && answer.trim() !== ""
    ).length;
  };
  // Sprite progress: number of non-empty answers (0-11)
  // Use mazeProgress (from backend) to control sprite movement
  const actualProgress = calculateActualProgress() + actualProgressTrigger * 0;

  // Check if maze should be completed based on actual progress
  useEffect(() => {
    if (actualProgress >= 11) {
      setMazeCompleted(true);
    }
  }, [actualProgress]);

  const handleMoveComplete = useCallback((step, isCompleted) => {
    // This callback is no longer used since sprite moves based on task answers
    // But keeping it for compatibility
    if (isCompleted && step === 11) {
      console.log("Maze completed!");
      setMazeCompleted(true);
    }
  }, []);

  const saveAnswer = async () => {
    if (loggedOutRef.current) return;
    if (!currentTask || !isAuthenticated) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/task-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: currentTask.id,
          answer: currentAnswer,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setTaskAnswers(result.taskAnswers);
        setMazeProgress(result.mazeProgress);
        setActualProgressTrigger((v) => v + 1); // force Maze update
        // Check if maze is completed
        if (result.mazeProgress >= 11) {
          setMazeCompleted(true);
        }
        setIsEditing(false);
      } else {
        console.error("Error saving answer:", result.error);
      }
    } catch (error) {
      console.error("Error saving answer:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const clearAnswer = async () => {
    if (!currentTask || !isAuthenticated) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/task-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: currentTask.id,
          answer: "",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setTaskAnswers(result.taskAnswers);
        setMazeProgress(result.mazeProgress);
        setCurrentAnswer("");
        setActualProgressTrigger((v) => v + 1); // force Maze update
        // Update maze completed status
        setMazeCompleted(result.mazeProgress >= 11);
        setIsEditing(false);
      } else {
        console.error("Error clearing answer:", result.error);
      }
    } catch (error) {
      console.error("Error clearing answer:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const navigateToTask = (direction) => {
    if (direction === "next" && currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    } else if (direction === "prev" && currentTaskIndex > 0) {
      setCurrentTaskIndex(currentTaskIndex - 1);
    }
  };

  const hasAnswer = currentTask && taskAnswers[currentTask.id];

  if (loading) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />

      {/* Rules Modal */}
      <RulesModal isOpen={showRulesModal} onClose={handleCloseRulesModal} />

      {/* Timer */}
      {timerStarted && !showRulesModal && (
        <Timer secondsLeft={timerSeconds} onExpire={handleTimerExpire} />
      )}

      {mazeCompleted && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="bg-gray-900 border border-green-500 rounded-lg p-8 max-w-md mx-4 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-green-400 mb-4">
              Congratulations!
            </h2>
            <p className="text-gray-300 mb-6">
              You have successfully completed all tasks! You can now review your
              answers or save and logout.
            </p>
            <p className="text-yellow-400 mb-6">Team: {teamName}</p>
            <div className="flex flex-col gap-3">
              <Button
                text="Save & Logout"
                glowColor="#00ff88"
                className="w-full"
                onClick={async () => {
                  // Clear timer from localStorage
                  localStorage.removeItem(TIMER_KEY);
                  await saveAnswer();
                  await fetch("/api/auth/logout", { method: "POST" });
                  window.location.href = "/";
                }}
              />
              <Button
                text="Review Answers"
                glowColor="#fff8de"
                className="w-full"
                onClick={() => setMazeCompleted(false)}
              />
            </div>
          </div>
        </div>
      )}
      {/* Show a logout button under the answer section if all tasks are complete and user is reviewing answers */}

      <main className="flex-1 flex flex-col lg:block px-2 lg:px-4 pt-2 lg:pt-4 pb-2 lg:pb-4 overflow-hidden mt-[4rem]">
        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col h-full">
          {/* Mini progress indicator for mobile */}
          <div className="flex justify-center mb-2">
            <div className="bg-[#111111] border border-[#e6d8a3] rounded-lg px-3 py-1">
              <span className="text-xs font-medium text-[#e6d8a3]">
                Question {actualProgress}/11
              </span>
            </div>
          </div>

          <div className="h-[35vh] flex items-center justify-center mb-8">
            <div className="w-full max-w-[90vw] h-full flex items-center justify-center">
              <div style={{ transform: "scale(0.55)" }}>
                <Maze
                  currentStep={mazeProgress}
                  totalSteps={11}
                  onMoveComplete={handleMoveComplete}
                />
              </div>
            </div>
          </div>

          <div className="h-[1vh]"></div>

          <div className="h-[55vh] overflow-y-auto space-y-2 px-2">
            {/* Task Navigation */}
            <div className="bg-[#111111] border border-gray-600 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-[#e6d8a3]">
                  Task Navigation
                </h3>
                <span className="text-xs text-gray-400">
                  {currentTaskIndex + 1} of {tasks.length}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigateToTask("prev")}
                  disabled={currentTaskIndex === 0}
                  className="flex-1 px-3 py-2 rounded bg-gray-800 text-white text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => navigateToTask("next")}
                  disabled={currentTaskIndex >= tasks.length - 1 || !hasAnswer}
                  className="flex-1 px-3 py-2 rounded bg-gray-800 text-white text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Task Description */}
            <div className="bg-[#111111] border border-[#e6d8a3] rounded-lg p-3">
              {currentTask && (
                <TaskDescription
                  task={currentTask.title}
                  description={currentTask.description}
                  showDescription={showDescription}
                  onToggle={() => setShowDescription(!showDescription)}
                />
              )}
            </div>

            {/* Answer Section */}
            <div className="bg-[#111111] border border-gray-600 rounded-lg p-3">
              <div className="text-center space-y-2">
                <h3 className="text-sm font-semibold text-[#e6d8a3]">
                  Your Answer
                </h3>

                {hasAnswer && !isEditing ? (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400">Current answer:</p>
                    <div className="bg-gray-800 p-2 rounded text-xs text-gray-300 max-h-20 overflow-y-auto whitespace-pre-wrap text-left">
                      {taskAnswers[currentTask.id]}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        text="Edit"
                        glowColor="#fff8de"
                        className="flex-1 py-2"
                        textSize="text-xs"
                        onClick={() => setIsEditing(true)}
                      />
                      <button
                        onClick={clearAnswer}
                        disabled={isSaving}
                        className="flex-1 px-3 py-2 rounded bg-red-600 text-white text-xs hover:bg-red-700 disabled:opacity-50"
                      >
                        {isSaving ? "Clearing..." : "Clear"}
                      </button>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        text="Logout"
                        glowColor="#ff4d4d"
                        className="flex-1 py-2"
                        textSize="text-xs"
                        onClick={async () => {
                          await saveAnswer();
                          await fetch("/api/auth/logout", { method: "POST" });
                          window.location.href = "/";
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <textarea
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder="Enter your answer here... You can write sentences, paragraphs, or any text."
                      className="w-full px-3 py-2 rounded-lg border border-[#fff8de] focus:border-[#e6d8a3] bg-black text-white placeholder-gray-400 focus:outline-none transition-colors resize-vertical min-h-[80px] text-xs"
                    />
                    <div className="flex gap-2">
                      <Button
                        text={isSaving ? "Saving..." : "Save Answer"}
                        glowColor="#fff8de"
                        className="flex-1 py-2"
                        textSize="text-xs"
                        onClick={saveAnswer}
                        disabled={isSaving || !currentAnswer.trim()}
                      />
                      {hasAnswer && (
                        <button
                          onClick={() => {
                            setCurrentAnswer(taskAnswers[currentTask.id] || "");
                            setIsEditing(false);
                          }}
                          className="flex-1 px-3 py-2 rounded bg-gray-700 text-white text-xs hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block max-w-7xl mx-auto h-full">
          <div className="grid lg:grid-cols-2 gap-4 h-full">
            <div className="flex justify-center items-center order-1 lg:order-1">
              <div className="w-full max-w-[450px]">
                <Maze
                  currentStep={mazeProgress}
                  totalSteps={11}
                  onMoveComplete={handleMoveComplete}
                />
              </div>
            </div>

            <div
              className="space-y-3 order-2 lg:order-2 overflow-y-auto pr-2 mt-8"
              style={{ maxHeight: "calc(100vh - 8rem)" }}
            >
              {/* Task Navigation */}
              <div className="bg-[#111111] border border-gray-600 rounded-lg p-2">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-[#e6d8a3]">
                    Task Navigation
                  </h3>
                  <span className="text-xs text-gray-400">
                    {currentTaskIndex + 1} of {tasks.length}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigateToTask("prev")}
                    disabled={currentTaskIndex === 0}
                    className="flex-1 px-2 py-1 rounded bg-gray-800 text-white text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => navigateToTask("next")}
                    disabled={
                      currentTaskIndex >= tasks.length - 1 || !hasAnswer
                    }
                    className="flex-1 px-2 py-1 rounded bg-gray-800 text-white text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                  >
                    Next →
                  </button>
                </div>
              </div>

              {/* Task Description */}
              <div className="bg-[#111111] border border-[#e6d8a3] rounded-lg p-2">
                {currentTask && (
                  <TaskDescription
                    task={currentTask.title}
                    description={currentTask.description}
                    showDescription={showDescription}
                    onToggle={() => setShowDescription(!showDescription)}
                  />
                )}
              </div>

              {/* Answer Section */}
              <div className="bg-[#111111] border border-gray-600 rounded-lg p-2">
                <div className="text-center space-y-2">
                  <h3 className="text-sm font-semibold text-[#e6d8a3]">
                    Your Answer
                  </h3>

                  {hasAnswer && !isEditing ? (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-400">Current answer:</p>
                      <div className="bg-gray-800 p-2 rounded text-gray-300 text-left whitespace-pre-wrap text-xs max-h-24 overflow-y-auto">
                        {taskAnswers[currentTask.id]}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          text="Edit"
                          glowColor="#fff8de"
                          className="flex-1 py-1"
                          textSize="text-xs"
                          onClick={() => setIsEditing(true)}
                        />
                        <button
                          onClick={clearAnswer}
                          disabled={isSaving}
                          className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 text-xs"
                        >
                          {isSaving ? "Clearing..." : "Clear"}
                        </button>
                      </div>
                      <div className="flex gap-1 mt-2">
                        <Button
                          text="Logout"
                          glowColor="#ff4d4d"
                          className="flex-1 py-1"
                          textSize="text-xs"
                          onClick={async () => {
                            await saveAnswer();
                            await fetch("/api/auth/logout", { method: "POST" });
                            window.location.href = "/";
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <textarea
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        placeholder="Enter your answer here..."
                        className="w-full px-2 py-1 rounded-lg border-2 border-[#fff8de] focus:border-[#e6d8a3] bg-black text-white placeholder-gray-400 focus:outline-none transition-colors resize-vertical min-h-[60px] text-xs"
                      />
                      <div className="flex gap-1">
                        <Button
                          text={isSaving ? "Saving..." : "Save"}
                          glowColor="#fff8de"
                          className="flex-1 py-1"
                          textSize="text-xs"
                          onClick={saveAnswer}
                          disabled={isSaving || !currentAnswer.trim()}
                        />
                        {hasAnswer && (
                          <button
                            onClick={() => {
                              setCurrentAnswer(
                                taskAnswers[currentTask.id] || ""
                              );
                              setIsEditing(false);
                            }}
                            className="px-2 py-1 rounded bg-gray-700 text-white hover:bg-gray-600 text-xs"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Tasks;
