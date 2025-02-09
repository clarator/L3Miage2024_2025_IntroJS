import Obstacle from "./Obstacle.js";

//class heritant de obstacle pour creer des obstacle anime
export default class ObstacleAnime extends Obstacle {
    constructor(x, y, w, h, couleur, speed, minX, maxX, minY, maxY) {
        //construteur de obstacle
        super(x, y, w, h, couleur);

        //pour la vitesse
        this.speed = speed;

        //pour la taille
        this.minX = minX;  
        this.maxX = maxX;  
        this.minY = minY; 
        this.maxY = maxY;  
    }

    update(canvas) {
        //met a jour la position
        this.y += this.speed;

        //verifie si elle a atteint les bords
        if (this.y <= this.minY || this.y + this.h >= this.maxY) {
            //si oui il part de l'autre sens
            this.speed = -this.speed;  
        } 
    }

    //dessine l'obstacle avec la class parent
    draw(ctx) {
        super.draw(ctx);
    }
}
