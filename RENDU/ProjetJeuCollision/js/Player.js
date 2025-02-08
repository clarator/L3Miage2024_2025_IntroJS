import ObjectGraphique from "./ObjectGraphique.js";
import { drawTriangle, drawCircleImmediat } from "./utils.js";  

export default class Player extends ObjectGraphique {
    constructor(x, y) {
        super(x, y, 100, 100);
        this.vitesseX = 0;
        this.vitesseY = 0;
        this.couleur = "black";
        this.angle = 0;  
        this.temps = 0;    
    }

    //dessiner le monstre
    draw(ctx){
        ctx.save();

        //déplace le systeme de coordonnées
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        //recentre le monstre
        ctx.translate(-this.w / 2, -this.h / 2);

        // cape rouge qui bouge
        ctx.fillStyle = "red";
        ctx.beginPath();
        //definit la cape
        ctx.moveTo(0, 25);
        ctx.lineTo(50, 25);
        //crée l'ondulation de la cape
        ctx.lineTo(50 + Math.sin(this.temps) * 3, 70);
        ctx.lineTo(0 + Math.sin(this.temps + 1) * 3, 70);
        ctx.closePath();
        ctx.fill();

        // tete du monstre
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 50, 50);
    
        // yeux
        drawCircleImmediat(ctx,15, 20, 5, "red");
        drawCircleImmediat(ctx, 35, 20, 5, "red");

        // bouche
        drawTriangle(ctx, 15, 30, 20, 30, 17, 35);
        drawTriangle(ctx, 22, 30, 27, 30, 25, 35);
        drawTriangle(ctx, 30, 30, 35, 30, 32, 35);

        //jambes
        ctx.fillStyle = "black";
        ctx.fillRect(15, 50, 5, 10);
        ctx.fillStyle = "black";
        ctx.fillRect(30, 50, 5, 10);

        //bras
        ctx.fillStyle = "black";
        ctx.fillRect(40, 25, 25, 5);
        ctx.fillStyle = "black";
        ctx.fillRect(-15, 25, 20, 5);

    
        //cornes
        ctx.fillStyle = "red";
        ctx.fillRect(5, -5, 5, 10);
        ctx.fillStyle = "red";
        ctx.fillRect(37, -5, 5, 10);

        // restore
        ctx.restore();

        // super.draw() dessine une croix à la position x, y
        // pour debug
        super.draw(ctx);
    }

    move() {
        this.x += this.vitesseX;
        this.y += this.vitesseY;
        this.temps += 0.1;
    }
}