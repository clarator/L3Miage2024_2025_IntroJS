import ObstacleAnime from "./ObstacleAnime.js"; 

//fonction pour créer un obstacle anime entre 2 obstacles
function betweenTwoObstacles(obst1, obst2, position) {
    
    //pour le placer au centre des 2 obstacles
    let centerX = obst1.x + obst1.w / 2 + position;
    let centerY = obst1.y + obst1.h + (obst2.y - (obst1.y + obst1.h)) / 2;

    //pour qu'il se déplace entre les 2 obstacles
    let minY = obst1.y + obst1.h;
    let maxY = obst2.y;            

    //retourne un obstacle anime
    return new ObstacleAnime(centerX, centerY, 10, 20, "DarkSlateGray", 1, centerX, centerX, minY, maxY);
}

//fonction pour créer des plusieurs obstacles anime au fur et a mesure des niveaux
function generateObstaclesAnime(obstacle1, obstacle2, levelIndex, position) {
    //liste pour stoquer les obstacles anime
    let obstacleAnimes = [];

    //compteur pour augmenter le nombre d'obstacle à chaque niveau
    let obstacleCount = levelIndex;

    //boucle permettant de créer des obstacles
    for (let i = 0; i < obstacleCount; i++) {
       
        //initiale l'obstacle
        let obstacleAnime;

        //creer grace a la focntion betweenTwoObstacles
        obstacleAnime = betweenTwoObstacles(obstacle1, obstacle2, position);
        
        //le met dans la liste
        obstacleAnimes.push(obstacleAnime);

        //décale pour avoir une distance entre les obstacles
        position += 180; 
    }

    //retourne la liste
    return obstacleAnimes;
}
export {generateObstaclesAnime};