"use client"

import { useState, useCallback, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Maze from "@/components/Maze";
import TaskDescription from "@/components/TaskDescription";
import Button from "@/components/Button";
import Footer from "@/components/Footer";

const Tasks = () => {
  const [showDescription, setShowDescription] = useState(true);
  const [mazeProgress, setMazeProgress] = useState(0);
  const [currentClue, setCurrentClue] = useState("");
  const [isClueCorrect, setIsClueCorrect] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [pendingMovement, setPendingMovement] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  // Load tasks from JSON file
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        const data = await response.json();
        setTasks(data.tasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
        // Fallback task if JSON loading fails
        setTasks([{
          id: 1,
          title: "Default Task",
          description: "Complete the maze challenge",
          correctAnswers: ["start"]
        }]);
      }
    };

    loadTasks();
  }, []);

  // Get current task based on progress
  const currentTask = tasks[currentTaskIndex] || tasks[0];

  const handleMoveComplete = useCallback((step, isCompleted) => {
    if (isCompleted && step === 11) {
      console.log("Maze completed!");
    }
  }, []);

  const openModal = () => {
    if (!pendingMovement) {
      setShowModal(true);
      setCurrentClue("");
      setFeedback("");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentClue("");
    setFeedback("");
  };

  const handleSubmitClue = () => {
    if (!currentTask || !currentTask.correctAnswers) return;

    const userAnswer = currentClue.toLowerCase().trim();
    const correctAnswers = currentTask.correctAnswers.map(answer => answer.toLowerCase().trim());

    if (correctAnswers.includes(userAnswer)) {
      setIsClueCorrect(true);
      setFeedback("Correct! Moving sprite...");
      setPendingMovement(true);


      const newProgress = mazeProgress + 1;
      setMazeProgress(newProgress);
      

      if (currentTaskIndex < tasks.length - 1) {
        setCurrentTaskIndex(currentTaskIndex + 1);
      }


      setTimeout(() => {
        setPendingMovement(false);
        closeModal();
      }, 2000);
    } else {
      setIsClueCorrect(false);
      setFeedback("Incorrect clue. Try again!");
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />

      <main className="flex-1 flex flex-col lg:block px-4 pt-2 lg:pt-20 pb-2 lg:pb-4 overflow-hidden mt-[4rem]">
        
        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col h-full">
          

          <div className="h-[40vh] flex items-center justify-center">
            <div className="w-full max-w-[90vw] h-full flex items-center justify-center">
              <div style={{ transform: 'scale(0.6)' }}>
                <Maze 
                  currentStep={mazeProgress} 
                  totalSteps={11} 
                  onMoveComplete={handleMoveComplete}
                />
              </div>
            </div>
          </div>


          <div className="h-[2vh]"></div>


          <div className="h-[45vh] overflow-y-auto space-y-3 px-2">
            

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


            <div className="bg-[#111111] border border-gray-600 rounded-lg p-3">
              <div className="text-center space-y-2">
                <h3 className="text-sm font-semibold text-[#e6d8a3]">Submit Your Answer</h3>
                <p className="text-gray-400 text-xs">
                  Enter the correct clue to advance the sprite
                </p>
                
                <div className="flex justify-center">
                  <Button
                    text="Submit Clue"
                    glowColor="#fff8de"
                    className="px-4 py-2"
                    textSize="text-xs"
                    onClick={openModal}
                  />
                </div>

                <div className="pt-2 border-t border-gray-700">
                  <p className="text-gray-500 text-xs">
                    Hint: Read the task description carefully for clues...
                  </p>
                </div>
              </div>
            </div>


            <div className="bg-[#111111] border border-gray-600 rounded-lg p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Progress</span>
                <span className="text-xs font-medium text-[#e6d8a3]">
                  {mazeProgress}/11
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-[#e6d8a3] to-[#fff8de] h-1.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(mazeProgress / 11) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block max-w-7xl mx-auto h-full">
          <div className="grid lg:grid-cols-2 gap-8 h-full items-start">
            

            <div className="flex justify-center order-1 lg:order-1">
              <div className="w-full max-w-[500px]">
                <Maze 
                  currentStep={mazeProgress} 
                  totalSteps={11} 
                  onMoveComplete={handleMoveComplete}
                />
              </div>
            </div>


            <div className="space-y-6 order-2 lg:order-2">
              

              <div className="bg-[#111111] border border-[#e6d8a3] rounded-lg p-6">
                {currentTask && (
                  <TaskDescription
                    task={currentTask.title}
                    description={currentTask.description}
                    showDescription={showDescription}
                    onToggle={() => setShowDescription(!showDescription)}
                  />
                )}
              </div>

              <div className="bg-[#111111] border border-gray-600 rounded-lg p-6">
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-semibold text-[#e6d8a3]">Submit Your Answer</h3>
                  <p className="text-gray-400 text-sm">
                    Enter the correct clue to advance the sprite
                  </p>
                  
                  <div className="flex justify-center">
                    <Button
                      text="Submit Clue"
                      glowColor="#fff8de"
                      className="px-8 py-3"
                      textSize="text-base"
                      onClick={openModal}
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <p className="text-gray-500 text-xs">
                      Hint: Read the task description carefully for clues...
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#111111] border border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Progress</span>
                  <span className="text-sm font-medium text-[#e6d8a3]">
                    {mazeProgress}/11
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[#e6d8a3] to-[#fff8de] h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(mazeProgress / 11) * 100}%` }}
                  ></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>


      <Footer />


      {showModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 px-4"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        >
          <div className="bg-[#111111] border-2 border-[#e6d8a3] rounded-lg p-6 w-full max-w-md relative">

            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#e6d8a3] mb-2">Submit Your Clue</h3>
              <p className="text-gray-300 text-sm">
                Enter the correct clue to move the sprite forward in the maze
              </p>
            </div>

            <div className="mb-4">
              <input
                type="text"
                value={currentClue}
                onChange={(e) => setCurrentClue(e.target.value)}
                placeholder={pendingMovement ? "Correct answer submitted!" : "Enter your clue..."}
                className={`w-full px-4 py-3 rounded-lg border-2 bg-black text-white placeholder-gray-400 focus:outline-none transition-colors ${
                  pendingMovement 
                    ? 'border-green-500 bg-green-900 bg-opacity-20' 
                    : 'border-[#fff8de] focus:border-[#e6d8a3]'
                }`}
                onKeyPress={(e) => e.key === 'Enter' && !pendingMovement && handleSubmitClue()}
                autoFocus={!pendingMovement}
                disabled={pendingMovement}
              />
              {feedback && (
                <p className={`mt-2 text-sm ${isClueCorrect ? 'text-green-500' : 'text-red-500'}`}>
                  {feedback}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              {pendingMovement ? (

                <div className="w-full">
                  <Button
                    text="Close"
                    glowColor="#00ff88"
                    className="w-full"
                    textSize="text-sm"
                    onClick={closeModal}
                  />
                </div>
              ) : (

                <>
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <div className="flex-1">
                    <Button
                      text="Submit"
                      glowColor="#fff8de"
                      className="w-full"
                      textSize="text-sm"
                      onClick={handleSubmitClue}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="mt-4 text-center">
              <p className="text-gray-500 text-xs">
                Tip: Read the task description carefully for clues...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
