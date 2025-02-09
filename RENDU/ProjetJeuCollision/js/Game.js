import Player from "./Player.js";
import Obstacle from "./Obstacle.js";
import ObjetSouris from "./ObjetSouris.js";
import { rectsOverlap } from "./collisions.js";
import { initListeners } from "./ecouteurs.js";
import Sortie from "./Sortie.js";
import Level from "./Level.js";
import ObstacleAnime from "./ObstacleAnime.js";
export default class Game {
    //tableau pour les objets du jeu
    objetsGraphiques = [];

    //nombre de vie
    lives = 3;

    constructor(canvas) {
        this.canvas = canvas;
        // etat du clavier
        this.inputStates = {
            mouseX: 0,
            mouseY: 0,
        };

        //gestionnaire niveaux
        this.levelManager = new Level();

    }

    async init(canvas) {
        this.ctx = this.canvas.getContext("2d");

        //charge le niveau
        let levelData = this.levelManager.loadLevel();
        if (!levelData) return;

        //cree le joueur
        this.player = new Player(100, 100);
        this.objetsGraphiques.push(this.player);

        //objet qui suite la souris, juste pour tester
        this.objetSouris = new ObjetSouris(200, 200, 25, 25, "DimGray");
        this.objetsGraphiques.push(this.objetSouris);

        //ajoute les obstacles
        this.objetsGraphiques.push(...levelData.obstacles);

        //ajoute la sortie
        this.sortie = new Sortie(700, 700, 50, 50, "FireBrick");
        this.objetsGraphiques.push(this.sortie);

        //initialise les écouteurs de touches, souris, etc.
        initListeners(this.inputStates, this.canvas);

        console.log("Game initialisé");
    }

    start() {
        console.log("Game démarré");

        //démarre une animation à 60 images par seconde
        requestAnimationFrame(this.mainAnimationLoop.bind(this));
    }

    mainAnimationLoop() {
        //efface le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //dessine les objets à animer dans le jeu
        this.drawAllObjects();
        this.drawLevel();

        //regarde l'état du clavier, manette, souris et on met à jour
        this.update();

        //demande au navigateur d'appeler la fonction mainAnimationLoop
        requestAnimationFrame(this.mainAnimationLoop.bind(this));
    }

    drawAllObjects() {
        //dessine tous les objets du jeu
        this.objetsGraphiques.forEach(obj => {
            obj.draw(this.ctx);
        });
    }

    update() {   
        //déplacement du joueur. 
        this.movePlayer();
        
        //mise à jour de la position de l'objet qui suit la souris
        this.objetSouris.x = this.inputStates.mouseX;
        this.objetSouris.y = this.inputStates.mouseY;

        //mise à jour des obstacles animés
        this.objetsGraphiques.forEach(obj => {
            if (obj instanceof ObstacleAnime) {
                obj.update(this.canvas);
            }
        });

        //vérification si le joueur a atteint la sortie
        if (rectsOverlap(
            this.player.x - this.player.w / 2, this.player.y - this.player.h / 2, this.player.w, this.player.h,
            this.sortie.x, this.sortie.y, this.sortie.w, this.sortie.h
        )) {
            console.log("Niveau terminé !");

            let levelData = this.levelManager.nextLevel();

            if (levelData) {
                //mise à jour des objets pour le niveaux suivant
                this.objetsGraphiques = [this.player, ...levelData.obstacles, levelData.sortie];
                this.sortie = levelData.sortie;

                this.player.x = levelData.playerStart.x;
                this.player.y = levelData.playerStart.y;

                this.player.vitesseX = 0;
                this.player.vitesseY = 0;

                initListeners(this.inputStates, this.canvas);
            }
        }
    }

    movePlayer() {
        //initialise la vitesse 
        this.player.vitesseX = 0;
        this.player.vitesseY = 0;
        
        //pour detecter les touches appuyees
        if(this.inputStates.ArrowRight) {
            this.player.vitesseX = 3;
        } 

        if(this.inputStates.ArrowLeft) {
            this.player.vitesseX = -3;
        } 

        if(this.inputStates.ArrowUp) {
            this.player.vitesseY = -3;
        } 

        if(this.inputStates.ArrowDown) {
            this.player.vitesseY = 3;
        } 

        //pour le deplacement du joueur
        this.player.move();

        //tester les collision
        this.testCollisionsPlayer();
    }

    testCollisionsPlayer() {
        // Teste collision avec les bords du canvas
        this.testCollisionPlayerBordsEcran();

        // Teste collision avec les obstacles
        this.testCollisionPlayerObstacles();
       
    }

    ////pour empecher de sortir de l'ecran (fonctionne pas trop pour mon cas)
    testCollisionPlayerBordsEcran() {
        if (this.player.x - this.player.w / 2 < 0) {
            this.player.vitesseX = 0;
            this.player.x = this.player.w / 2;
        }
        if (this.player.x + this.player.w / 2 > this.canvas.width) {
            this.player.vitesseX = 0;
            this.player.x = this.canvas.width - this.player.w / 2;
        }
    
        if (this.player.y - this.player.h / 2 < 0) {
            this.player.y = this.player.h / 2;
            this.player.vitesseY = 0;
        }
        
        if (this.player.y + this.player.h / 2 > this.canvas.height) {
            this.player.vitesseY = 0;
            this.player.y = this.canvas.height - this.player.h / 2;
        }
    }
    
    testCollisionPlayerObstacles() {
        this.objetsGraphiques.forEach(obj => {
            if (obj instanceof Obstacle) {
                if (rectsOverlap(this.player.x - this.player.w / 2, this.player.y - this.player.h / 2, this.player.w, this.player.h,
                                 obj.x, obj.y, obj.w, obj.h)) {
                    console.log("Collision avec obstacle");
    
                    //code permettant d'éviter que le joueur fasse trop facilement des collisions
                    //horizontalement
                    if (this.player.x < obj.x + obj.w && this.player.x + this.player.w > obj.x) {
                        if (this.player.y < obj.y) {
                            this.player.y = obj.y - this.player.h / 2;
                        } else if (this.player.y > obj.y + obj.h) {
                            this.player.y = obj.y + obj.h + this.player.h / 2;
                        }
                    }
    
                    //verticalement
                    if (this.player.y < obj.y + obj.h && this.player.y + this.player.h > obj.y) {
                        if (this.player.x < obj.x) {
                            this.player.x = obj.x - this.player.w / 2;
                        } else if (this.player.x > obj.x + obj.w) {
                            this.player.x = obj.x + obj.w + this.player.w / 2;
                        }
                    }
                    
                    //si collision ça remet au point de départ
                    this.player.x = 50; 
                    this.player.y = 50;
                    this.player.vitesseX = 0;
                    this.player.vitesseY = 0;

                    //perte de vie
                    this.lives -= 1;
                    this.gameOver();
                }
            }
        });
    }
    
    testSortie() {
        //verifie si joueur va à la sortie
        if (rectsOverlap(this.player.x - this.player.w / 2, this.player.y - this.player.h / 2, this.player.w, this.player.h,
                         this.sortie.x, this.sortie.y, this.sortie.w, this.sortie.h)) {
            console.log("Niveau terminé !");
        }
    }
    
    //permet d'afficher les infos niveau et vie
    drawLevel() {
        const ctx = this.ctx;
        const x = this.canvas.width - 150;
        const y = 0;
        const width = 150;
        const height = 25;
        const text = `Niveau: ${this.levelManager.currentLevelIndex + 1} | Vies: ${this.lives}`;
        ctx.fillStyle = "white";
        ctx.fillRect(x, y, width, height);
        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        ctx.textAlign = "right";  
        ctx.fillText(text, this.canvas.width - 10, y + height - 5);
    }

    //gere animation et efface l'ecran
    gameLoop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);  
        this.drawLevel();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    //pour la fin de jeu
    gameOver() {
        console.log("Game over");

        //si plus de vie
        if (this.lives <= 0) { 
            //reinitialise les vies et le niveau 
            this.lives = 3;  
            this.levelManager.currentLevelIndex = 0;  

            let levelData = this.levelManager.loadLevel();

            //reinitialise les objets graphiques
            if (levelData) {
                this.objetsGraphiques = [this.player, ...levelData.obstacles, levelData.sortie];
                this.sortie = levelData.sortie;
                this.player.x = levelData.playerStart.x;
                this.player.y = levelData.playerStart.y;
                this.player.vitesseX = 0;
                this.player.vitesseY = 0;
            }
        }
    }
    
}