"use client"

import { useEffect, useRef, useState, useCallback } from 'react';

const maze = [
  [0,0,0,1,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0],
  [1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,1,0],
  [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,0,1],
  [0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0],
  [1,1,0,1,1,1,1,1,0,1,0,1,0,0,0,1,0,1,1,1],
  [0,0,0,0,0,0,0,1,0,1,0,1,1,1,0,1,0,0,0,0],
  [0,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
  [0,0,0,1,0,1,1,1,1,1,1,1,0,1,0,1,0,1,0,0],
  [1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1],
  [0,0,0,1,1,1,0,1,1,1,0,1,0,0,0,1,1,1,0,0],
  [0,1,0,0,0,0,0,0,0,1,0,1,1,1,0,0,0,0,0,1],
  [0,1,1,1,0,1,1,1,0,1,0,0,0,0,0,1,0,1,0,0],
  [0,0,0,0,0,0,0,0,0,1,1,1,0,1,0,1,0,1,1,0],
  [1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,1,1,1,0,1],
  [0,1,1,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,0,1,1,1,0,1,1,1,1,1,0,1,1,0],
  [1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0]
];

function findPath(maze, start, end) {
  const rows = maze.length;
  const cols = maze[0].length;
  
  class Node {
    constructor(x, y, g = 0, h = 0, parent = null) {
      this.x = x;
      this.y = y;
      this.g = g;
      this.h = h;
      this.f = g + h;
      this.parent = parent;
    }
  }

  function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  function getNeighbors(node) {
    const neighbors = [];
    const directions = [{x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: 0}];
    
    for (let dir of directions) {
      const newX = node.x + dir.x;
      const newY = node.y + dir.y;
      
      if (newX >= 0 && newX < cols && newY >= 0 && newY < rows && maze[newY][newX] === 0) {
        neighbors.push(new Node(newX, newY));
      }
    }
    return neighbors;
  }

  const openList = [];
  const closedList = [];
  const startNode = new Node(start.x, start.y, 0, heuristic(start, end));
  
  openList.push(startNode);

  while (openList.length > 0) {
    let currentNode = openList[0];
    let currentIndex = 0;
    
    for (let i = 1; i < openList.length; i++) {
      if (openList[i].f < currentNode.f) {
        currentNode = openList[i];
        currentIndex = i;
      }
    }

    openList.splice(currentIndex, 1);
    closedList.push(currentNode);

    if (currentNode.x === end.x && currentNode.y === end.y) {
      const path = [];
      let current = currentNode;
      while (current) {
        path.unshift({x: current.x, y: current.y});
        current = current.parent;
      }
      return path;
    }

    const neighbors = getNeighbors(currentNode);
    for (let neighbor of neighbors) {
      if (closedList.some(node => node.x === neighbor.x && node.y === neighbor.y)) {
        continue;
      }

      const gScore = currentNode.g + 1;
      const existingOpen = openList.find(node => node.x === neighbor.x && node.y === neighbor.y);

      if (!existingOpen) {
        neighbor.g = gScore;
        neighbor.h = heuristic(neighbor, end);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = currentNode;
        openList.push(neighbor);
      } else if (gScore < existingOpen.g) {
        existingOpen.g = gScore;
        existingOpen.f = existingOpen.g + existingOpen.h;
        existingOpen.parent = currentNode;
      }
    }
  }
  
  return [];
}

const start = {x: 0, y: 0};
const end = {x: 19, y: 19};
const path = findPath(maze, start, end);

const Maze = ({ onMoveComplete, currentStep = 0, totalSteps = 11 }) => {
  const gameRef = useRef(null);
  const [game, setGame] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const onMoveCompleteRef = useRef(onMoveComplete);
  const totalStepsRef = useRef(totalSteps);
  const isInitializing = useRef(false);

  useEffect(() => {
    onMoveCompleteRef.current = onMoveComplete;
    totalStepsRef.current = totalSteps;
  }, [onMoveComplete, totalSteps]);

  // Add effect to handle currentStep changes
  useEffect(() => {
    if (game && game.scene.keys.MazeScene) {
      const scene = game.scene.keys.MazeScene;
      if (scene.updatePlayerPosition) {
        scene.updatePlayerPosition(currentStep);
      }
    }
  }, [currentStep, game]);

  const handleMoveComplete = useCallback((step, isCompleted) => {
    if (onMoveCompleteRef.current) {
      onMoveCompleteRef.current(step, isCompleted);
    }
  }, []);

  useEffect(() => {
    const loadPhaser = async () => {
      if (game || !gameRef.current || isInitializing.current) return;
      

      if (gameRef.current.querySelector('canvas')) return;
      
      isInitializing.current = true;
      
      const Phaser = await import('phaser');
      
      class MazeScene extends Phaser.Scene {
        constructor() {
          super("MazeScene");
          this.step = 0;
          this.isMoving = false;
        }

        preload() {
          this.load.image("wall", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==");
        }

        create() {
          const tileSize = 25;
          const mazeWidth = maze[0].length * tileSize;
          const mazeHeight = maze.length * tileSize;

          this.add.rectangle(mazeWidth/2, mazeHeight/2, mazeWidth, mazeHeight, 0x111111);

          maze.forEach((row, r) => {
            row.forEach((cell, c) => {
              const x = c * tileSize;
              const y = r * tileSize;
              
              if (cell === 1) {
                const wall = this.add.rectangle(x, y, tileSize, tileSize, 0xe6d8a3).setOrigin(0);
                const border = this.add.rectangle(x + 1, y + 1, tileSize - 2, tileSize - 2, 0xf0e4b8).setOrigin(0);
              } else {
                const pathTile = this.add.rectangle(x, y, tileSize, tileSize, 0x222222).setOrigin(0);
                
                this.add.rectangle(x, y, tileSize, 1, 0x333333).setOrigin(0);
                this.add.rectangle(x, y, 1, tileSize, 0x333333).setOrigin(0);
              }
            });
          });

          this.createPlayerSprite();

          if (path.length > 0) {
            // Calculate initial position based on currentStep prop
            const initialStep = Math.min(currentStep, path.length - 1);
            const currentPosition = path[initialStep];
            
            this.step = initialStep;
            this.player = this.add.sprite(
              currentPosition.x * tileSize + tileSize / 2,
              currentPosition.y * tileSize + tileSize / 2,
              "player"
            );
            this.player.setScale(0.8);

            const glowCircle = this.add.circle(
              currentPosition.x * tileSize + tileSize / 2,
              currentPosition.y * tileSize + tileSize / 2,
              14, 0xe6d8a3
            );
            glowCircle.setAlpha(0.3);
            this.playerGlow = glowCircle;
            this.playerGlow = glowCircle;
            
            this.tweens.add({
              targets: glowCircle,
              scaleX: 1.2,
              scaleY: 1.2,
              alpha: 0.1,
              duration: 1500,
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut'
            });

            this.add.text(path[0].x * tileSize + 2, path[0].y * tileSize + 2, "START", {
              fontSize: "8px",
              color: "#00ff88",
              fontWeight: "bold",
              fontFamily: "monospace"
            });

            const endPos = path[path.length - 1];
            this.add.text(endPos.x * tileSize + 2, endPos.y * tileSize + 2, "END", {
              fontSize: "8px",
              color: "#ff4444",
              fontWeight: "bold",
              fontFamily: "monospace"
            });

            const portal = this.add.circle(
              endPos.x * tileSize + tileSize / 2,
              endPos.y * tileSize + tileSize / 2,
              10, 0xe6d8a3
            );
            portal.setAlpha(0.6);
            this.tweens.add({
              targets: portal,
              scaleX: 1.3,
              scaleY: 1.3,
              alpha: 0.3,
              duration: 2000,
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut'
            });
          }

          this.clickCount = 0;
        }

        createPlayerSprite() {
          const graphics = this.add.graphics();
          
          graphics.fillStyle(0x3d3524);
          graphics.fillEllipse(0, 2, 12, 16);
          
          graphics.fillStyle(0x2a251c);
          graphics.fillEllipse(0, -6, 10, 8);
          
          graphics.fillStyle(0xebe0c4);
          graphics.fillCircle(0, -4, 4);
          
          graphics.fillStyle(0xe6d8a3);
          graphics.fillCircle(-1.5, -5, 1);
          graphics.fillCircle(1.5, -5, 1);
          
          graphics.fillStyle(0x332a1c);
          graphics.fillCircle(-1.5, -5, 0.5);
          graphics.fillCircle(1.5, -5, 0.5);
          
          graphics.lineStyle(1, 0xe6d8a3, 0.4);
          graphics.strokeCircle(0, 0, 14);
          graphics.lineStyle(1, 0xf0e4b8, 0.6);
          graphics.strokeCircle(0, 0, 11);
          
          graphics.lineStyle(1, 0x1a1612, 0.8);
          graphics.strokeEllipse(0, -6, 10, 8);
          
          graphics.generateTexture("player", 30, 30);
          graphics.destroy();
        }

        movePlayer() {
          // Disabled - sprite now moves based on task answers, not clicks
          return;
        }

        animateMovement(stepsToMove) {
          if (stepsToMove <= 0) {
            this.isMoving = false;
            this.updateProgress();
            
            this.showTaskMessage();
            if (handleMoveComplete) {
              handleMoveComplete(this.clickCount, this.step >= path.length - 1);
            }
            return;
          }

          this.step++;
          const target = path[this.step];
          const tileSize = 25;

          const targetX = target.x * tileSize + tileSize / 2;
          const targetY = target.y * tileSize + tileSize / 2;

          this.tweens.add({
            targets: this.player,
            x: targetX,
            y: targetY,
            duration: 200,
            ease: 'Power2',
            onComplete: () => {
              this.animateMovement(stepsToMove - 1);
            }
          });

          this.tweens.add({
            targets: this.playerGlow,
            x: targetX,
            y: targetY,
            duration: 200,
            ease: 'Power2'
          });
        }

        resetPlayer() {
          if (path.length === 0) return;
          
          this.step = 0;
          this.clickCount = 0;
          this.isMoving = false;
          const tileSize = 25;
          
          this.player.x = path[0].x * tileSize + tileSize / 2;
          this.player.y = path[0].y * tileSize + tileSize / 2;
          
          this.playerGlow.x = path[0].x * tileSize + tileSize / 2;
          this.playerGlow.y = path[0].y * tileSize + tileSize / 2;
          
          if (this.taskMessage) {
            this.taskMessage.destroy();
            this.taskMessage = null;
          }
          
          this.updateProgress();
        }

        showTaskMessage() {
          if (this.step >= path.length - 1) {
            return;
          }

          const tileSize = 25;
          const mazeWidth = maze[0].length * tileSize;
          const mazeHeight = maze.length * tileSize;
          
          let textX = this.player.x;
          let textY = this.player.y - 40;
          
          if (textX < 60) {
            textX = 60;
          } else if (textX > mazeWidth - 60) {
            textX = mazeWidth - 60;
          }
          
          if (textY < 25) {
            textY = this.player.y + 40;
          }

          this.taskMessage = this.add.text(textX, textY, `Task ${this.clickCount}/11\ncompleted!`, {
            fontSize: "12px",
            color: "#ffffff",
            fontWeight: "bold",
            fontFamily: "monospace",
            align: "center",
            backgroundColor: "#000000",
            padding: { x: 8, y: 4 }
          }).setOrigin(0.5);
        }

        updateProgress() {
          // Clear any existing completion text and effects
          if (this.completionText) {
            this.completionText.destroy();
            this.completionText = null;
          }
          if (this.completionGlow) {
            this.completionGlow.destroy();
            this.completionGlow = null;
          }
          
          if (this.step >= path.length - 1) {
            this.completionText = this.add.text(this.player.x, this.player.y - 30, "Maze Completed!", {
              fontSize: "12px",
              color: "#00ff99",
              fontWeight: "bold",
              fontFamily: "monospace"
            }).setOrigin(0.5);
            
            this.completionGlow = this.add.circle(this.player.x, this.player.y, 25, 0x00ff99);
            this.completionGlow.setAlpha(0.3);
            
            this.tweens.add({
              targets: this.completionGlow,
              scaleX: 2,
              scaleY: 2,
              alpha: 0,
              duration: 1000,
              ease: 'Power2'
            });
          }
        }

        updatePlayerPosition(newStep) {
          if (!path.length || !this.player) return;
          
          const targetStep = Math.min(Math.max(0, newStep), path.length - 1);
          if (targetStep === this.step) return; // No change needed
          
          const tileSize = 25;
          const targetPosition = path[targetStep];
          const targetX = targetPosition.x * tileSize + tileSize / 2;
          const targetY = targetPosition.y * tileSize + tileSize / 2;
          
          // Animate to new position
          this.tweens.add({
            targets: this.player,
            x: targetX,
            y: targetY,
            duration: 300,
            ease: 'Power2'
          });
          
          // Update glow circle position if it exists
          if (this.playerGlow) {
            this.tweens.add({
              targets: this.playerGlow,
              x: targetX,
              y: targetY,
              duration: 300,
              ease: 'Power2'
            });
          }
          
          this.step = targetStep;
          
          // Update progress state (completion text/effects)
          this.updateProgress();
        }
      }

      const config = {
        type: Phaser.AUTO,
        width: 500,
        height: 500,
        parent: gameRef.current,
        backgroundColor: '#000000',
        scene: MazeScene
      };

      const newGame = new Phaser.Game(config);
      setGame(newGame);
      setIsReady(true);
      isInitializing.current = false;
    };

    loadPhaser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      if (game) {
        game.destroy(true);
        setGame(null);
        setIsReady(false);
        isInitializing.current = false;
      }
    };
  }, [game]);

  useEffect(() => {
    if (game && isReady && currentStep > 0) {
      const scene = game.scene.getScene('MazeScene');
      if (scene && scene.moveToStep) {
        scene.moveToStep(currentStep);
      }
    }
  }, [currentStep, game, isReady]);

  useEffect(() => {
    if (game && isReady) {
      const scene = game.scene.getScene('MazeScene');
      if (scene) {
        scene.moveToStep = (targetStep) => {
          if (targetStep > scene.clickCount && !scene.isMoving) {
            scene.movePlayer();
          }
        };
      }
    }
  }, [game, isReady]);

  return (
    <div className="flex justify-center w-full mt-[2rem]">
      <div 
        ref={gameRef} 
        className="border-2 border-[#e6d8a3] rounded-lg bg-black"
        style={{ width: '500px', height: '500px' }}
      />
    </div>
  );
};

export default Maze;
