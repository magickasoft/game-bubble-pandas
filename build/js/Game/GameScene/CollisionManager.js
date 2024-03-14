var GAME = GAME || {};

GAME.CollisionManager = function(gameScene)
{
    this.gameScene = gameScene;

    this.enemyManager = gameScene.enemyManager;
    this.grenadeManager = gameScene.grenadeManager;

    this.lineHP = gameScene.lineHP;

    this.player = gameScene.player;
}

// constructor
GAME.CollisionManager.constructor = GAME.CollisionManager;

GAME.CollisionManager.prototype.test = function()
{
    var i,j;
    for(i = 0;i < this.grenadeManager.grenadesInGame.length;i++)
    {
        var grenade = this.grenadeManager.grenadesInGame[i];
        if(grenade.state == GRENADE_STATE.EXPLODE)
        {   
            //Encontrar los enemigos afectados por la explosion o bien identificar si la granada es bateada por un zombie
            var enemiesAffected = [];
            for(j = 0;j < this.enemyManager.enemiesInGame.length;j++)
            {
                var enemy = this.enemyManager.enemiesInGame[j];
                if(enemy.state == ENEMY_STATE.MOVING)
                {
                    var distance = Math.sqrt( (grenade.sprite.position.x - enemy.center.x)*(grenade.sprite.position.x - enemy.center.x) +
                                            (grenade.sprite.position.y - enemy.center.y)*(grenade.sprite.position.y - enemy.center.y) );

                    if(distance <= enemy.damageRadiusMid && enemy.enemyType == ENEMY_TYPE.BASEBALL && Math.random() <= enemy.dodgeChance)
                    {
                        grenade.homeRun();
                        enemy.hitBall();
                        break;
                    }
                    else if(distance <= enemy.damageRadiusMax)
                    {
                        enemiesAffected.push( enemy );
                    }
                }
            }

            //Si la granada no ha sido bateada debe explotar y hacer daño
            if(grenade.state == GRENADE_STATE.EXPLODE)
            {
                var isCritical = false;
                var criticalFactor = 1.0;
                var criticalChance = this.player.criticalChance();
                
                if(Math.random() <= criticalChance)
                {
                    criticalFactor = 2.0;
                    isCritical = true;

                    this.gameScene.shake(defaultWidth*0.06,1.0);
                    this.grenadeManager.grenadeFloorExplode(grenade.sprite.position,FLOOR_TYPE.CRITICAL);
                }
                else
                {
                    this.gameScene.shake(defaultWidth*0.03,0.6);

                    this.grenadeManager.grenadeFloorExplode(grenade.sprite.position,FLOOR_TYPE.NORMAL);
                }

                var totalScore = 0;
                var totalExp = 0;
                var combo = 0;
                for(j = 0;j < enemiesAffected.length;j++)
                {
                    var enemy = enemiesAffected[j];

                    var distance = Math.sqrt( (grenade.sprite.position.x - enemy.center.x)*(grenade.sprite.position.x - enemy.center.x) +
                                            (grenade.sprite.position.y - enemy.center.y)*(grenade.sprite.position.y - enemy.center.y) );

                    if(distance <= enemy.damageRadiusMid)
                    {
                        var x1 = enemy.damageRadiusMin;
                        var y1 = this.player.damagePower();
                        var x2 = enemy.damageRadiusMid;
                        var y2 = this.player.damagePower() * 0.6;

                        var damagePower = Math.min(y1,Math.max(y2, ((y2 - y1)/(x2 - x1))*(distance - x1) + y1 ));
                        damagePower *= criticalFactor;

                        damagePower = Math.floor(damagePower);

                        enemy.hit( damagePower );

                        if(enemy.state == ENEMY_STATE.DEAD && this.player != PLAYER_STATE.DEAD)
                        {
                            combo += 1;
                            totalExp += enemy.exp;
                            totalScore += enemy.score;
                        }
                    }
                    else if(distance <= enemy.damageRadiusMax)
                    {
                        var x1 = enemy.damageRadiusMid;
                        var y1 = this.player.damagePower() * 0.6;
                        var x2 = enemy.damageRadiusMax;
                        var y2 = this.player.damagePower() * 0.3;

                        var damagePower = Math.min(y1,Math.max(y2, ((y2 - y1)/(x2 - x1))*(distance - x1) + y1 ));
                        damagePower *= criticalFactor;

                        damagePower = Math.floor(damagePower);

                        if(damagePower > 0)
                        {
                            enemy.hit( damagePower );
                            //console.log( "Damage Power: " + damagePower );

                            if(enemy.state == ENEMY_STATE.DEAD && this.player != PLAYER_STATE.DEAD)
                            {
                                combo += 1;
                                totalExp += enemy.exp;
                                totalScore += enemy.score;
                            }
                        }
                    }
                }

                this.player.exp += totalExp;
                this.player.score += totalScore * combo;

                grenade.explode(isCritical,combo);

                this.gameScene.scoreUpdated();
                this.gameScene.expUpdated();
            }
        }
    }

    if(this.player != PLAYER_STATE.DEAD)
    {
        var enemyHit = false;
        //Revisar si el enemigo llego al final del camino
        for(j = 0;j < this.enemyManager.enemiesInGame.length;j++)
        {
            var enemy = this.enemyManager.enemiesInGame[j];
            if(enemy.state == ENEMY_STATE.MOVING && enemy.sprite.position.y - enemy.sprite.height*0.1 > this.lineHP.position.y)
            {
                this.player.hit(enemy.damage);
                enemy.setIsArrived();
                enemyHit = true;
            }
        }

        if(enemyHit)
        {
            this.gameScene.livesUpdated();
        }
    }

    //Revisar y modificar la jerarquia de los enemigos respecto a sus posiciones
    for(i = 0;i < this.enemyManager.enemiesInGame.length;i++)
    {
        var enemyA = this.enemyManager.enemiesInGame[i];
        if(enemyA.state == ENEMY_STATE.MOVING || enemyA.state == ENEMY_STATE.DEAD)
        {
            for(j = 0;j < this.enemyManager.enemiesInGame.length;j++)
            {
                var enemyB = this.enemyManager.enemiesInGame[j];
                if(enemyA == enemyB) continue;
                if(enemyB.state == ENEMY_STATE.MOVING || enemyB.state == ENEMY_STATE.DEAD && enemyA.column == enemyB.colum)
                {
                    var distance = Math.sqrt( (enemyA.center.x - enemyB.center.x)*(enemyA.center.x - enemyB.center.x) +
                                            (enemyA.center.y - enemyB.center.y)*(enemyA.center.y - enemyB.center.y) );

                    if(distance < enemyA.damageRadiusMid + enemyB.damageRadiusMid)
                    {
                        var indexA = enemyA.containerParent.children.indexOf(enemyA.container);
                        var indexB = enemyB.containerParent.children.indexOf(enemyB.container);
                        if(enemyA.sprite.position.y < enemyB.sprite.position.y && indexA > indexB)
                        {
                            enemyA.containerParent.swapChildren(enemyA.container,enemyB.container);
                        }
                        else if(enemyA.sprite.position.y >= enemyB.sprite.position.y && indexA < indexB)
                        {
                            enemyA.containerParent.swapChildren(enemyA.container,enemyB.container);
                        }
                    }
                }
            }
        }
    }
}
