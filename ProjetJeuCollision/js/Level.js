import Obstacle from "./Obstacle.js";
import Sortie from "./Sortie.js";
import {generateObstaclesAnime } from "./obstacle_level.js";

//class pour gerer les niveau
export default class Level {
    constructor() {
        //initiale le niveau à 1
        this.currentLevelIndex = 0;
        //intialise les nombre de niveaux 
        this.maxLevels = 3;
    }

   //fonction pour générer un niveau 
    generateLevel(levelIndex) {
        //position du joueur
        let playerStart = { x: 50, y: 50 };

        //liste d'obstacles
        let obstacles = [];

        //obstacle 
        let obstacle1 = new Obstacle(0, 200, 500, 30, "DarkSlateGray");
        let obstacle2 = new Obstacle(300, 400, 500, 30, "DarkSlateGray");
        let obstacle3 = new Obstacle(0, 600, 500, 30, "DarkSlateGray");
        obstacles.push(obstacle1, obstacle2, obstacle3);

        //obstacle anime
        let obstacleAnimes1 = generateObstaclesAnime(obstacle1, obstacle2, levelIndex,50);
        let obstacleAnimes2 = generateObstaclesAnime(obstacle2, obstacle3, levelIndex,-250);
            
        obstacles.push(...obstacleAnimes1,...obstacleAnimes2);

        //initialise la sortie en dessous de l'obstacle 3
        let sortieX = obstacle3.x + obstacle3.w / 2 - 25; 
        let sortieY = obstacle3.y + obstacle3.h + 10; 
        let sortie = new Sortie(sortieX, sortieY, 50, 50, "FireBrick");
        return { playerStart, obstacles, sortie };
    }
    
    //gere passage des niveaux
    loadLevel() {
        //si niveau final atteint affiche une alerte
        if (this.currentLevelIndex >= this.maxLevels) {
            alert("BRAVO ! Vous avez réussi !");
            //reintialise au niveau 1
            this.currentLevelIndex = 0;
            return this.generateLevel(this.currentLevelIndex);
        }

        //affiche le niveaux suivant
        console.log(`Nouveau niveau débloqué ${this.currentLevelIndex + 1}`);
        return this.generateLevel(this.currentLevelIndex);
    }

    //passe au niveau suivant
    nextLevel() {
        this.currentLevelIndex++;
        return this.loadLevel();
    }   
}
