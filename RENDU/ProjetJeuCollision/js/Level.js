import Obstacle from "./Obstacle.js";
import Sortie from "./Sortie.js";

//class pour gerer les différents niveaux
export default class Level {
    constructor() {
        this.currentLevelIndex  = 0;
        this.maxLevels = 10;
    }

    //fonction pour générer un niveau 
    generateLevel(levelIndex) {
        let numObstacles = Math.max(1, levelIndex * 2);
        let obstacles = [];

        //
        let obstacle1 = new Obstacle(250, 0, 30, 600, "red");
        obstacles.push(obstacle1);
        
        let obstacle2 = new Obstacle(500, 150, 30, 700, "blue" );
        obstacles.push(obstacle2);

        //
        let playerStart = { x: 50, y: 50 };

        let sortieX = 600 + levelIndex * 10;
        let sortieY = 300 + (levelIndex % 2) * 50; 
        let sortie = new Sortie(sortieX, sortieY, 50, 50);

        return { playerStart, obstacles, sortie };
    }

    //gère le passage des niveaux
    loadLevel() {
        if (this.currentLevelIndex >= this.maxLevels) {
            console.log("BRAVOO VOUS AVEZ REUSSI !");
            return null;
        }

        console.log(`Nouveau niveau debloqué  ${this.currentLevelIndex + 1}`);
        return this.generateLevel(this.currentLevelIndex);
    }

    //passe les niveaux entre eux
    nextLevel() {
        this.currentLevelIndex++;
        return this.loadLevel();
    }
}
