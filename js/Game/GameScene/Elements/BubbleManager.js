var BUBBLE_TYPE = {CYAN:0, RED:1, BLUE:2, GREEN:3, YELLOW:4, ORANGE:5, PURPLE:6, ROCK:7, SPECIAL:8};

var GAME = GAME || {};

GAME.BubbleManager = function(container,containerFloor,particlesContainer,hudContainer,bubblesPerRow,bubblesPerColumn)
{
    this.container = container;
    this.containerFloor = containerFloor;
    this.particlesContainer = particlesContainer;
    this.hudContainer = hudContainer;

    this.bubblesPerRow = bubblesPerRow;
    this.bubblesPerColumn = bubblesPerColumn;
    this.space = PIXI.Sprite.fromFrame("GameScene_BolitaAmarilla.png").width*0.0;

    this.bubbleSize = PIXI.Sprite.fromFrame("GameScene_BolitaAmarilla.png").width;

    this.topSpace = PIXI.Sprite.fromFrame("GameScene_BolitaAmarilla.png").width*0.2;

    this.currentOffset = false;

    //Pool de burbujas para poder utilizar
    this.bubblesInGame = [];

    var i,j;

    //vector contador de bolitas por fila
    this.bubblesQuantityPerRow = [];
    for(j=0;j<this.bubblesPerColumn;j++)
    {
        this.bubblesQuantityPerRow[j] = 0;
    }

    //Matriz de burbujas en el juego para guardar las conexiones entre ellas
    this.bubblesMatrix = [];
    for(i=0;i<this.bubblesPerRow;i++)
    {
        this.bubblesMatrix[i] = [];
        for(j=0;j<this.bubblesPerColumn;j++)
        {
            this.bubblesMatrix[i][j] = null;
        }
    }

    //Inicializo la matriz de burbujas visitadas
    this.visitingMatrix = [];
    for(i=0;i<this.bubblesPerRow;i++)
    {
        this.visitingMatrix[i] = [];
        for(j=0;j<this.bubblesPerColumn;j++)
        {
            this.visitingMatrix[i][j] = false;
        }
    }

    this.scorePerBubble = 10;

    this.bubbleReady = null;
    this.bubbleShow = null;

    this.bubbleReadyMove = PIXI.Sprite.fromFrame("GameScene_BolitaAmarilla.png");
    this.bubbleReadyMove.anchor.x = this.bubbleReadyMove.anchor.y = 0.5;
    this.bubbleReadyMove.visible = false;
    this.containerFloor.addChild( this.bubbleReadyMove );

    this.bubbleShowMove = PIXI.Sprite.fromFrame("GameScene_BolitaAmarilla.png");
    this.bubbleShowMove.anchor.x = this.bubbleShowMove.anchor.y = 0.5;
    this.bubbleShowMove.visible = false;
    this.containerFloor.addChild( this.bubbleShowMove );

    this.bubbleSpecialAppear = false;

    var types = [0,1,2,3,4,5,6];
    types.sort(function(){return Math.random() - 0.5;});
    BUBBLE_TYPE.CYAN = types[0];
    BUBBLE_TYPE.RED = types[1];
    BUBBLE_TYPE.BLUE = types[2];
    BUBBLE_TYPE.GREEN = types[3];
    BUBBLE_TYPE.YELLOW = types[4];
    BUBBLE_TYPE.ORANGE = types[5];
    BUBBLE_TYPE.PURPLE = types[6];
}

// constructor
GAME.BubbleManager.constructor = GAME.BubbleManager;

GAME.BubbleManager.prototype.init = function()
{
    this.currentOffset = false;

    var i,j;
    for(i = 0; i < this.bubblesInGame.length; i++)
    {
        this.bubblesInGame[i].init();
    }

    for(i=0;i<this.bubblesPerColumn;i++)
    {
        this.bubblesQuantityPerRow[i] = 0;
    }

    for(i=0;i<this.bubblesPerRow;i++)
    {
        this.bubblesMatrix[i] = [];
        for(j=0;j<this.bubblesPerColumn;j++)
        {
            this.bubblesMatrix[i][j] = null;
        }
    }

    this.matches = 1;
    this.counterMatches = 1;

    this.bubbleReady = null;
    this.bubbleShow = null;
}

GAME.BubbleManager.prototype.swap = function()
{
    if(this.bubbleReady.state == BUBBLE_STATE.MOVING || gameEngine.scenes[GAME_MODE.INGAME].state != GAMESCENE_STATE.PLAYING || this.bubbleReady.bubbleType === BUBBLE_TYPE.SPECIAL) return;

    gameEngine.scenes[GAME_MODE.INGAME].state = GAMESCENE_STATE.SWAP;

    sounds.play('swap_bubble');

    //gameEngine.scenes[GAME_MODE.INGAME].gameHUD.hideTutorial();

    //Assign texture to moving bubbles
    if(this.bubbleReady.bubbleType == BUBBLE_TYPE.CYAN) this.bubbleReadyMove.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaCeleste.png"));
    else if(this.bubbleReady.bubbleType == BUBBLE_TYPE.RED) this.bubbleReadyMove.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaRoja.png"));
    else if(this.bubbleReady.bubbleType == BUBBLE_TYPE.BLUE) this.bubbleReadyMove.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaAzul.png"));
    else if(this.bubbleReady.bubbleType == BUBBLE_TYPE.GREEN) this.bubbleReadyMove.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaVerde.png"));
    else if(this.bubbleReady.bubbleType == BUBBLE_TYPE.YELLOW) this.bubbleReadyMove.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaAmarilla.png"));
    else if(this.bubbleReady.bubbleType == BUBBLE_TYPE.ORANGE) this.bubbleReadyMove.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaNaranja.png"));
    else if(this.bubbleReady.bubbleType == BUBBLE_TYPE.PURPLE) this.bubbleReadyMove.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaPurpura.png"));

    if(this.bubbleShow.bubbleType == BUBBLE_TYPE.CYAN) this.bubbleShowMove.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaCeleste.png"));
    else if(this.bubbleShow.bubbleType == BUBBLE_TYPE.RED) this.bubbleShowMove.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaRoja.png"));
    else if(this.bubbleShow.bubbleType == BUBBLE_TYPE.BLUE) this.bubbleShowMove.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaAzul.png"));
    else if(this.bubbleShow.bubbleType == BUBBLE_TYPE.GREEN) this.bubbleShowMove.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaVerde.png"));
    else if(this.bubbleShow.bubbleType == BUBBLE_TYPE.YELLOW) this.bubbleShowMove.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaAmarilla.png"));
    else if(this.bubbleShow.bubbleType == BUBBLE_TYPE.ORANGE) this.bubbleShowMove.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaNaranja.png"));
    else if(this.bubbleShow.bubbleType == BUBBLE_TYPE.PURPLE) this.bubbleShowMove.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaPurpura.png"));

    this.bubbleReadyMove.position.x = this.bubbleReady.sprite.position.x;
    this.bubbleReadyMove.position.y = this.bubbleReady.sprite.position.y;

    this.bubbleShowMove.position.x = this.bubbleShow.sprite.position.x;
    this.bubbleShowMove.position.y = this.bubbleShow.sprite.position.y;

    this.bubbleReadyMove.visible = true;
    this.bubbleShowMove.visible = true;

    this.bubbleReady.sprite.visible = false;
    this.bubbleShow.sprite.visible = false;

    TweenLite.to(this.bubbleReadyMove.position, 0.2, {x:this.bubbleShowMove.position.x,y:this.bubbleShowMove.position.y,ease:Sine.easeInOut,overwrite:"all"});
    TweenLite.to(this.bubbleShowMove.position, 0.2, {x:this.bubbleReadyMove.position.x,y:this.bubbleReadyMove.position.y,ease:Sine.easeInOut,overwrite:"all",onCompleteScope:this,onComplete:this.swapBubbles});
}

GAME.BubbleManager.prototype.swapBubbles = function()
{
    var bubbleTypeReady = this.bubbleReady.bubbleType;
    this.bubbleReady.swap(this.bubbleShow.bubbleType);
    this.bubbleShow.swap(bubbleTypeReady);

    this.bubbleReadyMove.visible = false;
    this.bubbleShowMove.visible = false;

    this.bubbleReady.sprite.visible = true;
    this.bubbleShow.sprite.visible = true;

    gameEngine.scenes[GAME_MODE.INGAME].state = GAMESCENE_STATE.PLAYING;
}

GAME.BubbleManager.prototype.newRow = function(levelManager,durationMovement)
{
    var color;

    var i,j;
    var bubble;
    for(i=0;i<this.bubblesPerRow;i++)
    {
        color = Math.floor(Math.random() * (levelManager.bubbleTypesAccepted() + 1));

        if(Math.random() < levelManager.probabilityRockAppear())
        {
            color = BUBBLE_TYPE.ROCK;
        }

        //Inserto la burbuja en la fila 0 para cada columna
        bubble = this.setBubble(color,i,0,this.currentOffset,0.4);
        this.bubblesMatrix[i].splice(0,0,bubble);
        //Elimino el último
        this.bubblesMatrix[i].splice(this.bubblesMatrix[i].length - 1,1);
    }

    //Si no esta definido lo defino
    if(typeof durationMovement == "undefined") durationMovement = 0.4;

    for(i=0;i<this.bubblesPerRow;i++)
    {
        for(j=1;j<this.bubblesMatrix[i].length;j++)
        {
            if(this.bubblesMatrix[i][j] != null) this.bubblesMatrix[i][j].newRow(durationMovement);
        }
    }

    //Agrego la cantidad de burbujas en la fila nueva
    for(i=this.bubblesPerColumn - 1;i >= 1;i--)
    {
        this.bubblesQuantityPerRow[i] = this.bubblesQuantityPerRow[i - 1];
    }
    this.bubblesQuantityPerRow[0] = this.bubblesPerRow;

    //Cambio el offset para la nueva linea
    this.currentOffset = !this.currentOffset;

    sounds.play('new_row');
}

GAME.BubbleManager.prototype.setBubble = function(bubbleType,column,row,offset,appearDuration)
{
    var bubble;
    var i;
    for(i = 0; i < this.bubblesInGame.length; i++)
    {
        bubble = this.bubblesInGame[i];
        
        if(bubble.state == BUBBLE_STATE.IDLE)
        {
            bubble.setBubble(bubbleType,column,row,offset,appearDuration);
            return bubble;
        }
    }

    bubble = new GAME.Bubble(this.container,this.containerFloor,this.particlesContainer,this.hudContainer,this.bubblesPerRow,this.space,this.topSpace);
    this.bubblesInGame.push(bubble);
    bubble.setBubble(bubbleType,column,row,offset,appearDuration);

    return bubble;
}

GAME.BubbleManager.prototype.setBubbleReady = function(levelManager)
{
    if(this.bubbleReady == null)
    {
        var color;
        if(this.bubbleShow == null)
        {
            color = Math.floor(Math.random() * (levelManager.bubbleTypesAccepted() + 1));

            //Asigno la burbuja Ready
            var bubble;
            var i;
            for(i = 0; i < this.bubblesInGame.length; i++)
            {
                bubble = this.bubblesInGame[i];
                
                if(bubble.state == BUBBLE_STATE.IDLE)
                {
                    bubble.setBubbleReady(color);
                    this.bubbleReady = bubble;
                    break;
                }
            }

            if(this.bubbleReady == null)
            {
                bubble = new GAME.Bubble(this.container,this.containerFloor,this.particlesContainer,this.hudContainer,this.bubblesPerRow,this.space,this.topSpace);
                this.bubblesInGame.push(bubble);
                bubble.setBubbleReady(color);

                this.bubbleReady = bubble;
            }
        }
        else
        {
            if(this.bubbleSpecialAppear)
            {
                this.bubbleShow.setBubbleReady(BUBBLE_TYPE.SPECIAL);
                this.bubbleSpecialAppear = false;
                gameEngine.scenes[GAME_MODE.INGAME].crossbow.specialAppear();

                gameEngine.scenes[GAME_MODE.INGAME].particleManager.intensity = 10.0;
                gameEngine.scenes[GAME_MODE.INGAME].particleManager.explode(this.bubbleShow.sprite.position.x,this.bubbleShow.sprite.position.y);
            }
            else
            {
                this.bubbleShow.setBubbleReady(this.bubbleShow.bubbleType);
            }
            this.bubbleReady = this.bubbleShow;
            this.bubbleShow = null;
        }

        //Asigno la burbuja Show
        var i;
        var bubble;
        color = Math.floor(Math.random() * (levelManager.bubbleTypesAccepted() + 1));

        for(i = 0; i < this.bubblesInGame.length; i++)
        {
            bubble = this.bubblesInGame[i];
            
            if(bubble.state == BUBBLE_STATE.IDLE)
            {
                bubble.setBubbleShow(color);
                this.bubbleShow = bubble;
                break;
            }
        }

        if(this.bubbleShow == null)
        {
            bubble = new GAME.Bubble(this.container,this.containerFloor,this.particlesContainer,this.hudContainer,this.bubblesPerRow,this.space,this.topSpace);
            this.bubblesInGame.push(bubble);
            bubble.setBubbleShow(color);

            this.bubbleShow = bubble;
        }
    }
}

GAME.BubbleManager.prototype.aimShoot = function(crossbow)
{
    var velocityModule = defaultWidth / 0.42;
    var velocityShootingX = Math.cos(crossbow.flechaBallesta.rotation - Math.PI*0.5)*velocityModule;
    var velocityShootingY = Math.sin(crossbow.flechaBallesta.rotation - Math.PI*0.5)*velocityModule;

    this.bubbleReady.setShooting(velocityShootingX,velocityShootingY);
}

GAME.BubbleManager.prototype.shootBubble = function(crossbow)
{
    this.aimShoot(crossbow);

    this.positionTunnelingX = this.bubbleReady.sprite.position.x;
    this.positionTunnelingY = this.bubbleReady.sprite.position.y;

    //Hack para simular lag
    //this.bubbleReady.sprite.position.x += this.bubbleReady.velocityX * 1.5;
    //this.bubbleReady.sprite.position.y += this.bubbleReady.velocityY * 1.5;

    this.bubbleReady.setMoving();
}

GAME.BubbleManager.prototype.isTouchingBubble = function(location)
{
    if(this.bubbleReady != null)
    {
        if(location.x <= this.bubbleReady.sprite.position.x + this.bubbleReady.sprite.width*0.5 && location.x >= this.bubbleReady.sprite.position.x - this.bubbleReady.sprite.width*0.5
        && location.y >= this.bubbleReady.sprite.position.y - this.bubbleReady.sprite.height*0.5 && location.y <= this.bubbleReady.sprite.position.y + this.bubbleReady.sprite.height*0.5)
        {
            return true;
        }
    }
    return false;
}

GAME.BubbleManager.prototype.wigglePropagate = function(bubbleImpacting,bubbleImpacted,intensityCollision)
{
    if(intensityCollision <= 0.0) return;

    this.visitingMatrix[bubbleImpacted.column][bubbleImpacted.row] = true;

    var directionX = bubbleImpacted.sprite.position.x - bubbleImpacting.sprite.position.x;
    var directionY = bubbleImpacted.sprite.position.y - bubbleImpacting.sprite.position.y;
    var angle = Math.atan2(directionY,directionX);

    var newPositionX = bubbleImpacted.sprite.position.x + intensityCollision * this.bubbleSize * Math.cos(angle);
    var newPositionY = bubbleImpacted.sprite.position.y + intensityCollision * this.bubbleSize * Math.sin(angle);

    bubbleImpacted.inMovement(newPositionX,newPositionY);

    var positions;
    if(bubbleImpacted.offset)
    {
        positions = [{x:-1,y:0,offset:bubbleImpacted.offset},
                    {x:1,y:0,offset:bubbleImpacted.offset},
                    {x:0,y:1,offset:!bubbleImpacted.offset},
                    {x:1,y:1,offset:!bubbleImpacted.offset},
                    {x:0,y:-1,offset:!bubbleImpacted.offset},
                    {x:1,y:-1,offset:!bubbleImpacted.offset}];
    }
    else
    {
        positions = [{x:-1,y:0,offset:bubbleImpacted.offset},
                    {x:1,y:0,offset:bubbleImpacted.offset},
                    {x:-1,y:1,offset:!bubbleImpacted.offset},
                    {x:0,y:1,offset:!bubbleImpacted.offset},
                    {x:-1,y:-1,offset:!bubbleImpacted.offset},
                    {x:0,y:-1,offset:!bubbleImpacted.offset}];
    }

    var x,y,k;
    var currentBubble;
    for(k=0;k<positions.length;k++)
    {
        x = bubbleImpacted.column + positions[k].x;
        y = bubbleImpacted.row + positions[k].y;

        if(x >= 0 && x < this.bubblesPerRow && y >= 0 && y < this.bubblesPerColumn)
        {
            if(this.bubblesMatrix[x][y] != null)
            {
                currentBubble = this.bubblesMatrix[x][y];
                if(!this.visitingMatrix[currentBubble.column][currentBubble.row])
                {
                    this.wigglePropagate(bubbleImpacted,this.bubblesMatrix[currentBubble.column][currentBubble.row],intensityCollision - 0.05);
                }
            }
        }    
    }
}

GAME.BubbleManager.prototype.startWigglePropagate = function(bubbleImpacting,bubbleImpacted)
{
    var i,j;
    //Inicializo la matriz de burbujas visitadas
    for(i=0;i<this.bubblesPerRow;i++)
    {
        for(j=0;j<this.bubblesPerColumn;j++)
        {
            this.visitingMatrix[i][j] = false;
        }
    }

    //Ya se esta moviendo la burbuja que esta impactando
    this.visitingMatrix[bubbleImpacting.column][bubbleImpacting.row] = true;

    this.wigglePropagate(bubbleImpacting,bubbleImpacted,0.15);
}

GAME.BubbleManager.prototype.searchForBranch = function(bubble)
{
    this.visitingMatrix[bubble.column][bubble.row] = true;

    var positions;
    if(bubble.offset)
    {
        positions = [{x:-1,y:0,offset:bubble.offset},
                    {x:1,y:0,offset:bubble.offset},
                    {x:0,y:1,offset:!bubble.offset},
                    {x:1,y:1,offset:!bubble.offset},
                    {x:0,y:-1,offset:!bubble.offset},
                    {x:1,y:-1,offset:!bubble.offset}];
    }
    else
    {
        positions = [{x:-1,y:0,offset:bubble.offset},
                    {x:1,y:0,offset:bubble.offset},
                    {x:-1,y:1,offset:!bubble.offset},
                    {x:0,y:1,offset:!bubble.offset},
                    {x:-1,y:-1,offset:!bubble.offset},
                    {x:0,y:-1,offset:!bubble.offset}];
    }

    var x,y,k;
    var currentBubble;
    for(k=0;k<positions.length;k++)
    {
        x = bubble.column + positions[k].x;
        y = bubble.row + positions[k].y;

        if(x >= 0 && x < this.bubblesPerRow && y >= 0 && y < this.bubblesPerColumn)
        {
            if(this.bubblesMatrix[x][y] != null)
            {
                currentBubble = this.bubblesMatrix[x][y];
                if(!this.visitingMatrix[currentBubble.column][currentBubble.row])
                {
                    this.searchForBranch(currentBubble);
                }
            }
        }    
    }
}

GAME.BubbleManager.prototype.searchForMatch = function(bubble,branchDepth)
{
    this.coordinates.push({x:bubble.column,y:bubble.row});
    this.visitingMatrix[bubble.column][bubble.row] = true;

    var positions;
    if(bubble.offset)
    {
        positions = [{x:-1,y:0,offset:bubble.offset},
                    {x:1,y:0,offset:bubble.offset},
                    {x:0,y:1,offset:!bubble.offset},
                    {x:1,y:1,offset:!bubble.offset},
                    {x:0,y:-1,offset:!bubble.offset},
                    {x:1,y:-1,offset:!bubble.offset}];
    }
    else
    {
        positions = [{x:-1,y:0,offset:bubble.offset},
                    {x:1,y:0,offset:bubble.offset},
                    {x:-1,y:1,offset:!bubble.offset},
                    {x:0,y:1,offset:!bubble.offset},
                    {x:-1,y:-1,offset:!bubble.offset},
                    {x:0,y:-1,offset:!bubble.offset}];
    }

    //Le asigno una profundidad en la busqueda
    bubble.branchDepth = branchDepth;

    var x,y,k;
    var currentBubble;
    for(k=0;k<positions.length;k++)
    {
        x = bubble.column + positions[k].x;
        y = bubble.row + positions[k].y;

        if(x >= 0 && x < this.bubblesPerRow && y >= 0 && y < this.bubblesPerColumn)
        {
            if(this.bubblesMatrix[x][y] != null)
            {
                currentBubble = this.bubblesMatrix[x][y];
                if(currentBubble.bubbleType == bubble.bubbleType && !this.visitingMatrix[currentBubble.column][currentBubble.row])
                {
                    this.searchForMatch(currentBubble,branchDepth + 1);
                }
            }
        }    
    }
}

GAME.BubbleManager.prototype.startSearchForMatch = function(bubble)
{
    //Lista de coordenadas con burbujas que deberan explotar
    this.coordinates = [];

    //Inicializo la matriz de burbujas visitadas
    this.visitingMatrix = [];
    var i,j;
    for(i=0;i<this.bubblesPerRow;i++)
    {
        this.visitingMatrix[i] = [];
        for(j=0;j<this.bubblesPerColumn;j++)
        {
            this.visitingMatrix[i][j] = false;
        }
    }

    this.searchForMatch(bubble,0);

    //Si se encontraron menos de 3 burbujas no hacer nada
    if(this.coordinates.length < 3)
    {
        sounds.play('clash_bubble');
        this.bubbleReady = null;
        if(this.matches > 1)
        {
            if(this.matches > 3) 
            {
                gameEngine.scenes[GAME_MODE.INGAME].hamsterMatchBreak();
                sounds.play('match_break');
                gameEngine.scenes[GAME_MODE.INGAME].gameHUD.hitsShow(this.counterMatches,true);
            }
            this.matches = 1;
            this.counterMatches = 1;
        }
        this.setBubbleReady(gameEngine.scenes[GAME_MODE.INGAME].levelManager);
        return;
    }

    //Cantidad de burbujas que debo sumar al score
    var quantityBubbles = this.coordinates.length;

    //Inicializo el vector que guardara las burbujas que se deben explotar
    this.bubblesForExplode = [];
    this.bubblesForDropping = [];

    var coordidate;
    for(i=0;i<this.coordinates.length;i++)
    {
        coordidate = this.coordinates[i];

        this.bubblesQuantityPerRow[this.bubblesMatrix[coordidate.x][coordidate.y].row] -= 1;
        this.bubblesForExplode.push( this.bubblesMatrix[coordidate.x][coordidate.y] );
        this.bubblesMatrix[coordidate.x][coordidate.y] = null;
    }

    //Revisar las burbujas que no estan directamente en las ramas principales
    //Inicializar la matriz de visitas
    for(i=0;i<this.bubblesPerRow;i++)
    {
        for(j=0;j<this.bubblesPerColumn;j++)
        {
            this.visitingMatrix[i][j] = false;
        }
    }

    //Reviso las burbujas que estan 
    for(i=0;i<this.bubblesPerRow;i++)
    {
        if(this.bubblesMatrix[i][0] != null && !this.visitingMatrix[i][0])
        {
            this.searchForBranch(this.bubblesMatrix[i][0]);
        }
    }

    for(i=0;i<this.bubblesPerRow;i++)
    {
        for(j=0;j<this.bubblesPerColumn;j++)
        {
            if(this.bubblesMatrix[i][j] != null && !this.visitingMatrix[i][j])
            {
                this.bubblesQuantityPerRow[this.bubblesMatrix[i][j].row] -= 1;
                this.bubblesForDropping.push( this.bubblesMatrix[i][j] );
                this.bubblesMatrix[i][j] = null;

                quantityBubbles += 1;
            }
        }
    }

    var score = this.scorePerBubble * quantityBubbles + Math.max(0,quantityBubbles - 3) * this.scorePerBubble;
    gameEngine.scenes[GAME_MODE.INGAME].scoreUpdated(score,true);

    //Calculo la intensidad del score
    gameEngine.scenes[GAME_MODE.INGAME].particleManager.calculateIntensity(score);

    //Mostrar score ganado
    bubble.showScore(bubble.sprite.position.x,bubble.sprite.position.y,score);

    this.bubblesExplodeCounter = 0;
    for(i=0;i<this.bubblesForExplode.length;i++)
    {
        this.bubblesForExplode[i].explode(true);
    }
    for(i=0;i<this.bubblesForDropping.length;i++)
    {
        this.bubblesForDropping[i].drop();
    }   

    sounds.play('match_' + this.matches);
    if(this.counterMatches > 2)
    {
        gameEngine.scenes[GAME_MODE.INGAME].gameHUD.hitsShow(this.counterMatches,false);
    }

    this.counterMatches += 1;
    if(this.matches < 7) this.matches += 1;
}

GAME.BubbleManager.prototype.explodeAllBubbles = function()
{
    this.bubblesForExplode = [];

    var quantityBubbles = 0;
    var i,j;
    for(i=0;i<this.bubblesPerRow;i++)
    {
        for(j=0;j<this.bubblesPerColumn;j++)
        {
            if(this.bubblesMatrix[i][j] != null)
            {
                this.bubblesQuantityPerRow[this.bubblesMatrix[i][j].row] -= 1;
                this.bubblesForExplode.push( this.bubblesMatrix[i][j] );
                this.bubblesMatrix[i][j] = null;
                quantityBubbles += 1;
            }
        }
    }

    this.bubblesExplodeCounter = 0;
    for(i=0;i<this.bubblesForExplode.length;i++)
    {
        this.bubblesForExplode[i].explode(false);
    }

    sounds.play('explode_all_bubbles');
    this.matches = 1;
    this.counterMatches = 1;
}

GAME.BubbleManager.prototype.searchBubbleSpecial = function(bubbleType)
{
    //Inicializo el vector que guardara las burbujas que se deben explotar
    this.bubblesForExplode = [];
    this.bubblesForDropping = [];

    var quantityBubbles = 0;
    var i,j;
    for(i=0;i<this.bubblesPerRow;i++)
    {
        for(j=0;j<this.bubblesPerColumn;j++)
        {
            if(this.bubblesMatrix[i][j] != null)
            {
                if(this.bubblesMatrix[i][j].bubbleType == bubbleType || this.bubblesMatrix[i][j].bubbleType == BUBBLE_TYPE.SPECIAL)
                {
                    this.bubblesQuantityPerRow[this.bubblesMatrix[i][j].row] -= 1;
                    this.bubblesForExplode.push( this.bubblesMatrix[i][j] );
                    this.bubblesMatrix[i][j] = null;
                    quantityBubbles += 1;
                }
            }
        }
    }

    //Revisar las burbujas que no estan directamente en las ramas principales
    //Inicializar la matriz de visitas
    //Inicializo la matriz de burbujas visitadas
    this.visitingMatrix = [];
    for(i=0;i<this.bubblesPerRow;i++)
    {
        this.visitingMatrix[i] = [];
        for(j=0;j<this.bubblesPerColumn;j++)
        {
            this.visitingMatrix[i][j] = false;
        }
    }

    //Reviso las burbujas que estan 
    for(i=0;i<this.bubblesPerRow;i++)
    {
        if(this.bubblesMatrix[i][0] != null && !this.visitingMatrix[i][0])
        {
            this.searchForBranch(this.bubblesMatrix[i][0]);
        }
    }

    for(i=0;i<this.bubblesPerRow;i++)
    {
        for(j=0;j<this.bubblesPerColumn;j++)
        {
            if(this.bubblesMatrix[i][j] != null && !this.visitingMatrix[i][j])
            {
                this.bubblesQuantityPerRow[this.bubblesMatrix[i][j].row] -= 1;
                this.bubblesForDropping.push( this.bubblesMatrix[i][j] );
                this.bubblesMatrix[i][j] = null;
                quantityBubbles += 1;
            }
        }
    }

    this.bubblesExplodeCounter = 0;
    for(i=0;i<this.bubblesForExplode.length;i++)
    {
        this.bubblesForExplode[i].explode(false);
    }
    for(i=0;i<this.bubblesForDropping.length;i++)
    {
        this.bubblesForDropping[i].drop();
    }

    var score = this.scorePerBubble * quantityBubbles + Math.max(0,quantityBubbles - 3) * this.scorePerBubble;
    gameEngine.scenes[GAME_MODE.INGAME].scoreUpdated(score,false);

    gameEngine.scenes[GAME_MODE.INGAME].levelUp();

    sounds.play('star_explode');
}

GAME.BubbleManager.prototype.notifyExplodeBubble = function()
{
    this.bubblesExplodeCounter += 1;
    if(this.bubblesExplodeCounter >= this.bubblesForExplode.length)
    {
        this.bubbleReady = null;
        this.setBubbleReady(gameEngine.scenes[GAME_MODE.INGAME].levelManager);
        //console.log("Set Bubble Ready!");
    }
}

GAME.BubbleManager.prototype.update = function(dt)
{
    for(i = 0; i < this.bubblesInGame.length; i++)
    {
        this.bubblesInGame[i].update(dt);
    }

    var i,j,k;
    if(this.bubbleReady != null)
    {
        if(this.bubbleReady.state == BUBBLE_STATE.MOVING_TOP)
        {
            var distanceMin = defaultWidth;
            var distance;
            var posX,posY,initX;
            var offset = !this.currentOffset;
            var column,row;

            for(j=0;j<this.bubblesPerColumn;j++)
            {
                for(i=0;i<this.bubblesPerRow;i++)
                {
                    if(this.bubblesMatrix[i][j] != null) continue;

                    initX = (defaultWidth - (this.bubblesPerRow * this.bubbleReady.sprite.width + (this.bubblesPerRow - 1) * this.bubbleReady.space + (this.bubbleReady.sprite.width + this.bubbleReady.space)*0.5))*0.5 + this.bubbleReady.sprite.width*0.5;

                    posX = offset == true ? initX + i * (this.bubbleReady.sprite.width + this.bubbleReady.space) + (this.bubbleReady.sprite.width + this.bubbleReady.space)*0.5: initX + i * (this.bubbleReady.sprite.width + this.bubbleReady.space);
                    posY = gameEngine.scenes[GAME_MODE.INGAME].cuadroBlanco.position.y - gameEngine.scenes[GAME_MODE.INGAME].cuadroBlanco.height*0.5 + this.topSpace + this.bubbleReady.sprite.height*0.5 + j * (this.bubbleReady.sprite.height + this.bubbleReady.space) * Math.sin(Math.PI/3);

                    distance = Math.sqrt((posX - this.bubbleReady.sprite.position.x)*(posX - this.bubbleReady.sprite.position.x) + (posY - this.bubbleReady.sprite.position.y)*(posY - this.bubbleReady.sprite.position.y));

                    if(distance < distanceMin)
                    {
                        distanceMin = distance;
                        column = i;
                        row = j;
                    }
                }

                //En caso que ya haya encontrado una posicion cercana al borde superior debo detenerme de  buscar y dejarla puesta en la escena
                if(distanceMin != defaultWidth)
                {
                    this.bubbleReady.setBubble(this.bubbleReady.bubbleType,column,row,offset);
                    this.bubblesMatrix[column][row] = this.bubbleReady;

                    this.bubblesQuantityPerRow[row] += 1;

                    this.startSearchForMatch(this.bubblesMatrix[column][row]);
                    break;
                }
                else offset = !offset;
            }
        }
        else if(this.bubbleReady.state == BUBBLE_STATE.MOVING)
        {
            var DISTANCE_BUBBLES_COLLISION = this.bubbleReady.sprite.width*0.95;
            var DISTANCE_BUBBLES_TUNNELING = this.bubbleReady.sprite.width*0.3;
            var bubble;
            var distance;
            var positions;

            //Encuentro las posiciones para evaluar
            var positionTunneling = [];
            var distanceTunneling = Math.sqrt( (this.bubbleReady.sprite.position.x - this.positionTunnelingX)*(this.bubbleReady.sprite.position.x - this.positionTunnelingX) + (this.bubbleReady.sprite.position.y - this.positionTunnelingY)*(this.bubbleReady.sprite.position.y - this.positionTunnelingY) );
            var tunnelingPos;

            var ratio = Math.floor(distanceTunneling / DISTANCE_BUBBLES_TUNNELING);
            var offsetX = (this.bubbleReady.sprite.position.x - this.positionTunnelingX) / ratio;
            var offsetY = (this.bubbleReady.sprite.position.y - this.positionTunnelingY) / ratio;
            var accumX = this.positionTunnelingX;
            var accumY = this.positionTunnelingY;
            for(tunnelingPos = 1;tunnelingPos <= Math.floor(distanceTunneling / DISTANCE_BUBBLES_TUNNELING);tunnelingPos++)
            {
                accumX += offsetX;
                accumY += offsetY;
                positionTunneling.push( new PIXI.Point(accumX,accumY) );
            }
            positionTunneling.push( new PIXI.Point(this.bubbleReady.sprite.position.x,this.bubbleReady.sprite.position.y) );

            /*console.log("Distance Tunneling: " + distanceTunneling);
            console.log("DISTANCE_BUBBLES_TUNNELING: " + DISTANCE_BUBBLES_TUNNELING);
            console.log("Tunneling N: " + positionTunneling.length);*/

            this.positionTunnelingX = this.bubbleReady.sprite.position.x;
            this.positionTunnelingY = this.bubbleReady.sprite.position.y;

            var initX = (defaultWidth - (this.bubblesPerRow * this.bubbleReady.sprite.width + (this.bubblesPerRow - 1) * this.bubbleReady.space + (this.bubbleReady.sprite.width + this.bubbleReady.space)*0.5))*0.5 + this.bubbleReady.sprite.width*0.5;

            var encontreLugar = false;
            var posTunneling,y_search,x_search,positionForSearching,positionsCollisions,posX,posY;

            var directionX,directionY;
            var distanceMin = defaultWidth;
            var column,row,offset;
            var x,y;
            for(tunnelingPos=0;tunnelingPos < positionTunneling.length && !encontreLugar; tunnelingPos++)
            {
                posTunneling = positionTunneling[tunnelingPos];

                //I have to calculate the current position accordly to coordinates
                y_search = Math.floor(0.5 + (posTunneling.y - this.topSpace - gameEngine.scenes[GAME_MODE.INGAME].cuadroBlanco.position.y + gameEngine.scenes[GAME_MODE.INGAME].cuadroBlanco.height*0.5 + this.bubbleReady.sprite.height*0.5) / ((this.bubbleReady.sprite.height + this.bubbleReady.space) * Math.sin(Math.PI/3)));
                if(y_search < 0 || y_search >= this.bubblesPerColumn) continue;

                positionForSearching = y_search > 0 ? y_search - 1 : y_search;
                if(this.bubblesQuantityPerRow[positionForSearching] === 0) continue;

                //Find coordinate X from current moving bubble
                x_search = (y_search % 2 === 0 && this.currentOffset) || (y_search % 2 === 1 && !this.currentOffset) ? Math.floor(0.5 + (posTunneling.x - initX) / (this.bubbleReady.sprite.width + this.bubbleReady.space)) : Math.floor(0.5 + (posTunneling.x - initX - (this.bubbleReady.sprite.width + this.bubbleReady.space)*0.5) / (this.bubbleReady.sprite.width + this.bubbleReady.space));

                if((y_search % 2 === 1 && this.currentOffset) || (y_search % 2 === 0 && !this.currentOffset))
                {
                    positionsCollisions = [{x:0,y:0},
                                {x:-1,y:0},
                                {x:1,y:0},
                                {x:0,y:1},
                                {x:1,y:1},
                                {x:0,y:-1},
                                {x:1,y:-1}];
                }
                else
                {
                    positionsCollisions = [{x:0,y:0},
                                    {x:-1,y:0},
                                    {x:1,y:0},
                                    {x:-1,y:1},
                                    {x:0,y:1},
                                    {x:-1,y:-1},
                                    {x:0,y:-1}];
                }

                for(i=0;i<positionsCollisions.length && !encontreLugar;i++)
                {
                    posX = x_search + positionsCollisions[i].x;
                    posY = y_search + positionsCollisions[i].y;
                    if(!(posX >= 0 && posX < this.bubblesPerRow && posY >= 0 && posY < this.bubblesPerColumn)) continue;

                    bubble = this.bubblesMatrix[posX][posY];
                    if(bubble === null) continue;

                    distance = Math.sqrt((bubble.sprite.position.x - posTunneling.x)*(bubble.sprite.position.x - posTunneling.x) + (bubble.sprite.position.y - posTunneling.y)*(bubble.sprite.position.y - posTunneling.y));
                    //Pregunto si la burbuja actual choca con la burbuja que estoy revisando
                    if(distance < DISTANCE_BUBBLES_COLLISION)
                    {
                        //Particles
                        directionX = (bubble.sprite.position.x - posTunneling.x);
                        directionY = (bubble.sprite.position.y - posTunneling.y);
                        gameEngine.scenes[gameEngine.state].particleManager.clash(posTunneling.x + 0.5 * directionX,posTunneling.y + 0.5 * directionY);

                        if(bubble.offset)
                        {
                            positions = [{x:-1,y:0,offset:bubble.offset},
                                        {x:1,y:0,offset:bubble.offset},
                                        {x:0,y:1,offset:!bubble.offset},
                                        {x:1,y:1,offset:!bubble.offset},
                                        {x:0,y:-1,offset:!bubble.offset},
                                        {x:1,y:-1,offset:!bubble.offset}];
                        }
                        else
                        {
                            positions = [{x:-1,y:0,offset:bubble.offset},
                                        {x:1,y:0,offset:bubble.offset},
                                        {x:-1,y:1,offset:!bubble.offset},
                                        {x:0,y:1,offset:!bubble.offset},
                                        {x:-1,y:-1,offset:!bubble.offset},
                                        {x:0,y:-1,offset:!bubble.offset}];
                        }

                        distanceMin = defaultWidth;
                        //Revisamos todos los lados aledaños a la burbuja que esta en la matriz y que choca con la burbuja que lance
                        for(k=0;k<positions.length;k++)
                        {
                            x = bubble.column + positions[k].x;
                            y = bubble.row + positions[k].y;
                            if(x >= 0 && x < this.bubblesPerRow && y >= 0 && y < this.bubblesPerColumn)
                            {
                                if(this.bubblesMatrix[x][y] === null)
                                {
                                    posX = positions[k].offset === true ? initX + x * (bubble.sprite.width + bubble.space) + (bubble.sprite.width + bubble.space)*0.5: initX + x * (bubble.sprite.width + bubble.space);
                                    posY = gameEngine.scenes[GAME_MODE.INGAME].cuadroBlanco.position.y - gameEngine.scenes[GAME_MODE.INGAME].cuadroBlanco.height*0.5 + this.topSpace + bubble.sprite.height*0.5 + y * (bubble.sprite.height + bubble.space) * Math.sin(Math.PI/3);

                                    distance = Math.sqrt((posX - posTunneling.x)*(posX - posTunneling.x) + (posY - posTunneling.y)*(posY - posTunneling.y));

                                    if(distance < distanceMin)
                                    {
                                        distanceMin = distance;
                                        column = x;
                                        row = y;
                                        offset = positions[k].offset;
                                    }
                                }
                            }
                        }

                        if(distanceMin < defaultWidth)
                        {
                            this.bubbleReady.setBubbleInMovement(this.bubbleReady.bubbleType,column,row,offset);
                            this.bubblesMatrix[column][row] = this.bubbleReady;

                            this.bubblesQuantityPerRow[row] += 1;

                            //Propago el movimiento de las burbujas en el juego
                            this.startWigglePropagate(this.bubblesMatrix[column][row],bubble);

                            if(this.bubbleReady.bubbleType == BUBBLE_TYPE.SPECIAL)
                            {
                                this.searchBubbleSpecial( bubble.bubbleType );
                            }
                            else
                            {
                                this.startSearchForMatch(this.bubblesMatrix[column][row]);
                            }

                            encontreLugar = true;
                        }
                        else
                        {
                            if(bubble.offset)
                            {
                                positions = [{x:-2,y:0,offset:bubble.offset},{x:-1,y:-1,offset:!bubble.offset},
                                            {x:-1,y:-2,offset:bubble.offset},{x:0,y:-2,offset:bubble.offset},{x:1,y:-2,offset:bubble.offset},
                                            {x:2,y:-1,offset:!bubble.offset},{x:2,y:0,offset:bubble.offset},{x:2,y:1,offset:!bubble.offset},
                                            {x:1,y:2,offset:bubble.offset},{x:0,y:2,offset:bubble.offset},{x:-1,y:2,offset:bubble.offset},
                                            {x:-1,y:1,offset:!bubble.offset}];
                            }
                            else
                            {
                                positions = [{x:-2,y:0,offset:bubble.offset},{x:-2,y:-1,offset:!bubble.offset},
                                            {x:-1,y:-2,offset:bubble.offset},{x:0,y:-2,offset:bubble.offset},{x:1,y:-2,offset:bubble.offset},
                                            {x:1,y:-1,offset:!bubble.offset},{x:2,y:0,offset:bubble.offset},{x:1,y:1,offset:!bubble.offset},
                                            {x:1,y:2,offset:bubble.offset},{x:0,y:2,offset:bubble.offset},{x:-1,y:2,offset:bubble.offset},
                                            {x:-2,y:1,offset:!bubble.offset}];
                            }

                            distanceMin = defaultWidth;
                            //Revisamos todos los lados aledanos a la burbuja que esta en la matriz y que choca con la burbuja que lance
                            for(k=0;k<positions.length;k++)
                            {
                                x = bubble.column + positions[k].x;
                                y = bubble.row + positions[k].y;
                                if(x >= 0 && x < this.bubblesPerRow && y >= 0 && y < this.bubblesPerColumn)
                                {
                                    if(this.bubblesMatrix[x][y] === null)
                                    {
                                        posX = positions[k].offset === true ? initX + x * (bubble.sprite.width + bubble.space) + (bubble.sprite.width + bubble.space)*0.5: initX + x * (bubble.sprite.width + bubble.space);
                                        posY = gameEngine.scenes[GAME_MODE.INGAME].cuadroBlanco.position.y - gameEngine.scenes[GAME_MODE.INGAME].cuadroBlanco.height*0.5 + this.topSpace + bubble.sprite.height*0.5 + y * (bubble.sprite.height + bubble.space) * Math.sin(Math.PI/3);

                                        distance = Math.sqrt((posX - posTunneling.x)*(posX - posTunneling.x) + (posY - posTunneling.y)*(posY - posTunneling.y));

                                        if(distance < distanceMin)
                                        {
                                            distanceMin = distance;
                                            column = x;
                                            row = y;
                                            offset = positions[k].offset;
                                        }
                                    }
                                }
                            }

                            if(distanceMin < defaultWidth)
                            {
                                this.bubbleReady.setBubbleInMovement(this.bubbleReady.bubbleType,column,row,offset);
                                this.bubblesMatrix[column][row] = this.bubbleReady;

                                this.bubblesQuantityPerRow[row] += 1;

                                //Propago el movimiento de las burbujas en el juego
                                this.startWigglePropagate(this.bubblesMatrix[column][row],bubble);

                                if(this.bubbleReady.bubbleType == BUBBLE_TYPE.SPECIAL)
                                {
                                    this.searchBubbleSpecial( bubble.bubbleType );
                                }
                                else
                                {
                                    this.startSearchForMatch(this.bubblesMatrix[column][row]);
                                }

                                encontreLugar = true;
                            }
                        }
                    }
                }
            }
        }
    }
}
