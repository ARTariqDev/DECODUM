"use client"

import { useState } from "react";
import Navbar from "@/components/Navbar";
import TaskVideo from "@/components/TaskVideo";
import TaskDescription from "@/components/TaskDescription";
import Button from "@/components/Button";
import Footer from "@/components/Footer";

const Tasks = () => {
  const [showDescription, setShowDescription] = useState(true);
  //adding random video link and task description, we will fetch this from a json file or db later
  return (
    <div className="flex flex-col h-[100vh]">
      <Navbar />


      <main className="flex flex-col flex-1 w-full items-center px-4 pt-24 sm:pt-32 mt-[4rem]">

        <div className="flex justify-center w-full max-w-5xl mt-6">
          <TaskVideo link="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=0&modestbranding=1&rel=0&color=white" />
        </div>

        <div className="w-full max-w-5xl mt-6">
          <TaskDescription
            task="Task Number: 1"
            description="Random test Description for Task, will update later"
            showDescription={showDescription}
            onToggle={() => setShowDescription(!showDescription)}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 w-full max-w-5xl">
          <div className="flex-1 max-w-[180px] pb-2">
            <Button
              text="Submit Clue"
              glowColor="#fff8de"
              className="w-full"
              textSize="text-sm"
            />
          </div>
        </div>
      </main>


      <Footer />
    </div>
  );
};

export default Tasks;
