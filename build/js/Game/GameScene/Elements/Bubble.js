var BUBBLE_STATE = {IDLE:0, SHOW:1, READY:2, SHOOTING:3, MOVING:4, MOVING_TOP:5, SET:6, EXPLODING:7, DROPPING:8};

var GAME = GAME || {};

GAME.Bubble = function(container,containerFloor,particlesContainer,hudContainer,bubblesInRow,space,topSpace)
{
    this.container = container;
    this.containerFloor = containerFloor;
    this.particlesContainer = particlesContainer;
    this.hudContainer = hudContainer;

    this.bubblesInRow = bubblesInRow;
    this.space = space;
    this.topSpace = topSpace;

    this.sprite = PIXI.Sprite.fromFrame("GameScene_BolitaAmarilla.png");
    this.sprite.anchor.x = this.sprite.anchor.y = 0.5;

    this.seedSprite = PIXI.Sprite.fromFrame("GameScene_Semilla.png");
    this.seedSprite.anchor.x = this.seedSprite.anchor.y = 0.5;

    this.particlesContainer.addChild( this.seedSprite );
    this.container.addChild( this.sprite );

    this.scoreText = new PIXI.BitmapText("+0", {font: "GameScene_BlueFont", align: "left"});
    this.scoreText.alpha = 0.0;
    this.hudContainer.addChild( this.scoreText );

    this.velocityGravity = 0;
    this.gravity = defaultHeight * 1.9;

    this.timeElapsed = 0;
    this.timeBetweenParticles = 0.03;

    this.movingNewRow = false;

    this.init();
}

// constructor
GAME.Bubble.constructor = GAME.Bubble;

GAME.Bubble.prototype.init = function()
{
    this.sprite.alpha = 1.0;
    this.sprite.visible = false;
    this.sprite.scale.x = this.sprite.scale.y = 1.0;

    this.seedSprite.alpha = 1.0;
    this.seedSprite.visible = false;

    this.disappearSeed = false;

    this.branchDepth = 0;

    if(this.state == BUBBLE_STATE.SHOW || this.state == BUBBLE_STATE.READY || this.state == BUBBLE_STATE.SHOOTING || this.state == BUBBLE_STATE.MOVING || this.state == BUBBLE_STATE.MOVING_TOP || this.state == BUBBLE_STATE.DROPPING)
    {
        this.containerFloor.removeChild( this.sprite );
        this.container.addChild( this.sprite );
    }
    this.state = BUBBLE_STATE.IDLE;
}

GAME.Bubble.prototype.setBubble = function(bubbleType,column,row,offset,appearDuration)
{
    this.bubbleType = bubbleType;
    this.row = row;
    this.column = column;
    this.offset = offset;
    
    /*if(typeof appearDuration != "undefined")
    {
        this.sprite.scale.x = this.sprite.scale.y = 0.0;
        TweenLite.to(this.sprite.scale, appearDuration, {x:1.0,y:1.0,ease:Sine.easeInOut,overwrite:"all"});
    }*/

    if(this.bubbleType == BUBBLE_TYPE.CYAN) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaCeleste.png"));
    else if(this.bubbleType == BUBBLE_TYPE.RED) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaRoja.png"));
    else if(this.bubbleType == BUBBLE_TYPE.BLUE) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaAzul.png"));
    else if(this.bubbleType == BUBBLE_TYPE.GREEN) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaVerde.png"));
    else if(this.bubbleType == BUBBLE_TYPE.YELLOW) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaAmarilla.png"));
    else if(this.bubbleType == BUBBLE_TYPE.ORANGE) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaNaranja.png"));
    else if(this.bubbleType == BUBBLE_TYPE.PURPLE) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaPurpura.png"));
    else if(this.bubbleType == BUBBLE_TYPE.ROCK) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaPiedra.png"));
    else if(this.bubbleType == BUBBLE_TYPE.SPECIAL) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaEstrella.png"));

    var initX = (defaultWidth - (this.bubblesInRow * this.sprite.width + (this.bubblesInRow - 1) * this.space + (this.sprite.width + this.space)*0.5))*0.5 + this.sprite.width*0.5;

    var x = this.offset == true ? initX + this.column * (this.sprite.width + this.space) + (this.sprite.width + this.space)*0.5: initX + this.column * (this.sprite.width + this.space);
    var y = gameEngine.scenes[GAME_MODE.INGAME].cuadroBlanco.position.y - gameEngine.scenes[GAME_MODE.INGAME].cuadroBlanco.height*0.5 + this.topSpace + this.sprite.height*0.5 + this.row * (this.sprite.height + this.space) * Math.sin(Math.PI/3);

    this.sprite.position.x = x;
    this.sprite.position.y = y;

    this.sprite.visible = true;

    if(this.state == BUBBLE_STATE.SHOW || this.state == BUBBLE_STATE.READY || this.state == BUBBLE_STATE.SHOOTING || this.state == BUBBLE_STATE.MOVING || this.state == BUBBLE_STATE.MOVING_TOP || this.state == BUBBLE_STATE.DROPPING)
    {
        this.containerFloor.removeChild( this.sprite );
        this.container.addChild( this.sprite );
    }

    this.state = BUBBLE_STATE.SET;
}

GAME.Bubble.prototype.inMovement = function(positionX,positionY)
{
    if(!this.movingNewRow)
    {
        var posX = this.sprite.position.x;
        var posY = this.sprite.position.y;

        this.sprite.position.x = positionX;
        this.sprite.position.y = positionY;

        if(this.tweenMovement) this.tweenMovement.pause();
        this.tweenMovement = TweenLite.to(this.sprite.position, 0.3, {x:posX,y:posY,ease:Back.easeOut,overwrite:"all"});
    }
}

GAME.Bubble.prototype.setBubbleInMovement = function(bubbleType,column,row,offset)
{
    this.bubbleType = bubbleType;
    this.row = row;
    this.column = column;
    this.offset = offset;
    
    if(this.bubbleType == BUBBLE_TYPE.CYAN) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaCeleste.png"));
    else if(this.bubbleType == BUBBLE_TYPE.RED) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaRoja.png"));
    else if(this.bubbleType == BUBBLE_TYPE.BLUE) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaAzul.png"));
    else if(this.bubbleType == BUBBLE_TYPE.GREEN) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaVerde.png"));
    else if(this.bubbleType == BUBBLE_TYPE.YELLOW) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaAmarilla.png"));
    else if(this.bubbleType == BUBBLE_TYPE.ORANGE) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaNaranja.png"));
    else if(this.bubbleType == BUBBLE_TYPE.PURPLE) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaPurpura.png"));
    else if(this.bubbleType == BUBBLE_TYPE.ROCK) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaPiedra.png"));
    else if(this.bubbleType == BUBBLE_TYPE.SPECIAL) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaEstrella.png"));

    var initX = (defaultWidth - (this.bubblesInRow * this.sprite.width + (this.bubblesInRow - 1) * this.space + (this.sprite.width + this.space)*0.5))*0.5 + this.sprite.width*0.5;

    var x = this.offset == true ? initX + this.column * (this.sprite.width + this.space) + (this.sprite.width + this.space)*0.5: initX + this.column * (this.sprite.width + this.space);
    var y = gameEngine.scenes[GAME_MODE.INGAME].cuadroBlanco.position.y - gameEngine.scenes[GAME_MODE.INGAME].cuadroBlanco.height*0.5 + this.topSpace + this.sprite.height*0.5 + this.row * (this.sprite.height + this.space) * Math.sin(Math.PI/3);

    if(this.tweenMovement) this.tweenMovement.pause();
    this.tweenMovement = TweenLite.to(this.sprite.position, 0.3, {x:x,y:y,ease:Back.easeOut,overwrite:"all"});

    this.sprite.visible = true;

    if(this.state == BUBBLE_STATE.SHOW || this.state == BUBBLE_STATE.READY || this.state == BUBBLE_STATE.SHOOTING || this.state == BUBBLE_STATE.MOVING || this.state == BUBBLE_STATE.MOVING_TOP || this.state == BUBBLE_STATE.DROPPING)
    {
        this.containerFloor.removeChild( this.sprite );
        this.container.addChild( this.sprite );
    }

    this.state = BUBBLE_STATE.SET;
}

GAME.Bubble.prototype.setBubbleReady = function(bubbleType)
{
    this.bubbleType = bubbleType;

    if(this.bubbleType == BUBBLE_TYPE.CYAN) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaCeleste.png"));
    else if(this.bubbleType == BUBBLE_TYPE.RED) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaRoja.png"));
    else if(this.bubbleType == BUBBLE_TYPE.BLUE) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaAzul.png"));
    else if(this.bubbleType == BUBBLE_TYPE.GREEN) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaVerde.png"));
    else if(this.bubbleType == BUBBLE_TYPE.YELLOW) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaAmarilla.png"));
    else if(this.bubbleType == BUBBLE_TYPE.ORANGE) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaNaranja.png"));
    else if(this.bubbleType == BUBBLE_TYPE.PURPLE) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaPurpura.png"));
    else if(this.bubbleType == BUBBLE_TYPE.ROCK) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaPiedra.png"));
    else if(this.bubbleType == BUBBLE_TYPE.SPECIAL) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaEstrella.png"));

    this.sprite.position.x = defaultWidth*0.5;
    this.sprite.position.y = gameEngine.scenes[GAME_MODE.INGAME].crossbow.flechaBallesta.position.y - gameEngine.scenes[GAME_MODE.INGAME].crossbow.flechaBallesta.height*0.17 + this.sprite.height*0.5;

    this.sprite.alpha = 1.0;
    this.sprite.visible = true;

    if(this.state == BUBBLE_STATE.IDLE || this.state == BUBBLE_STATE.SET || this.state == BUBBLE_STATE.EXPLODING)
    {
        this.container.removeChild( this.sprite );
        this.containerFloor.addChild( this.sprite );
    }

    this.state = BUBBLE_STATE.READY;
}

GAME.Bubble.prototype.setBubbleShow = function(bubbleType)
{
    this.bubbleType = bubbleType;

    if(this.bubbleType == BUBBLE_TYPE.CYAN) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaCeleste.png"));
    else if(this.bubbleType == BUBBLE_TYPE.RED) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaRoja.png"));
    else if(this.bubbleType == BUBBLE_TYPE.BLUE) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaAzul.png"));
    else if(this.bubbleType == BUBBLE_TYPE.GREEN) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaVerde.png"));
    else if(this.bubbleType == BUBBLE_TYPE.YELLOW) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaAmarilla.png"));
    else if(this.bubbleType == BUBBLE_TYPE.ORANGE) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaNaranja.png"));
    else if(this.bubbleType == BUBBLE_TYPE.PURPLE) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaPurpura.png"));
    else if(this.bubbleType == BUBBLE_TYPE.ROCK) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaPiedra.png"));
    else if(this.bubbleType == BUBBLE_TYPE.SPECIAL) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaEstrella.png"));

    this.sprite.position.x = gameEngine.scenes[GAME_MODE.INGAME].crossbow.bubbleSupport.position.x;
    this.sprite.position.y = gameEngine.scenes[GAME_MODE.INGAME].crossbow.bubbleSupport.position.y - this.sprite.height*0.14;

    this.sprite.alpha = 1.0;
    this.sprite.visible = true;

    if(this.state == BUBBLE_STATE.IDLE || this.state == BUBBLE_STATE.SET || this.state == BUBBLE_STATE.EXPLODING)
    {
        this.container.removeChild( this.sprite );
        this.containerFloor.addChild( this.sprite );
    }

    this.state = BUBBLE_STATE.SHOW;
}

GAME.Bubble.prototype.swap = function(bubbleType)
{
    this.bubbleType = bubbleType;

    if(this.bubbleType == BUBBLE_TYPE.CYAN) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaCeleste.png"));
    else if(this.bubbleType == BUBBLE_TYPE.RED) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaRoja.png"));
    else if(this.bubbleType == BUBBLE_TYPE.BLUE) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaAzul.png"));
    else if(this.bubbleType == BUBBLE_TYPE.GREEN) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaVerde.png"));
    else if(this.bubbleType == BUBBLE_TYPE.YELLOW) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaAmarilla.png"));
    else if(this.bubbleType == BUBBLE_TYPE.ORANGE) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaNaranja.png"));
    else if(this.bubbleType == BUBBLE_TYPE.PURPLE) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaPurpura.png"));
    else if(this.bubbleType == BUBBLE_TYPE.ROCK) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaPiedra.png"));
    else if(this.bubbleType == BUBBLE_TYPE.SPECIAL) this.sprite.setTexture(PIXI.Texture.fromFrame("GameScene_BolitaEstrella.png"));
}

GAME.Bubble.prototype.newRow = function(durationMovement)
{
    this.movingNewRow = true;

    this.row += 1;
    var initX = (defaultWidth - (this.bubblesInRow * this.sprite.width + (this.bubblesInRow - 1) * this.space + (this.sprite.width + this.space)*0.5))*0.5 + this.sprite.width*0.5;

    var x = this.offset == true ? initX + this.column * (this.sprite.width + this.space) + (this.sprite.width + this.space)*0.5: initX + this.column * (this.sprite.width + this.space);
    var y = gameEngine.scenes[GAME_MODE.INGAME].cuadroBlanco.position.y - gameEngine.scenes[GAME_MODE.INGAME].cuadroBlanco.height*0.5 + this.topSpace + this.sprite.height*0.5 + this.row * (this.sprite.height + this.space) * Math.sin(Math.PI/3);

    if(this.tweenMovement) this.tweenMovement.pause();
    if(durationMovement < 0.4) TweenLite.to(this.sprite.position, durationMovement, {x:x,y:y,ease:Sine.easeInOut,overwrite:"all",onCompleteScope:this,onComplete:this.movingNewRowFinish});
    else TweenLite.to(this.sprite.position, durationMovement, {x:x,y:y,ease:Elastic.easeOut,overwrite:"all",onCompleteScope:this,onComplete:this.movingNewRowFinish});
}

GAME.Bubble.prototype.movingNewRowFinish = function()
{
    this.movingNewRow = false;
}

GAME.Bubble.prototype.moveToNewPosition = function()
{
    var initX = (defaultWidth - (this.bubblesInRow * this.sprite.width + (this.bubblesInRow - 1) * this.space + (this.sprite.width + this.space)*0.5))*0.5 + this.sprite.width*0.5;
    var x = this.offset == true ? initX + this.column * (this.sprite.width + this.space) + (this.sprite.width + this.space)*0.5: initX + this.column * (this.sprite.width + this.space);
    var y = gameEngine.scenes[GAME_MODE.INGAME].cuadroBlanco.position.y - gameEngine.scenes[GAME_MODE.INGAME].cuadroBlanco.height*0.5 + this.topSpace + this.sprite.height*0.5 + this.row * (this.sprite.height + this.space) * Math.sin(Math.PI/3);

    if(this.tweenMovement) this.tweenMovement.pause();
    this.tweenMovement = TweenLite.to(this.sprite.position, 0.4, {x:x,y:y,ease:Back.easeInOut,overwrite:"all"});
}

GAME.Bubble.prototype.drop = function()
{
    if(this.state !== BUBBLE_STATE.DROPPING)
    {
        this.velocityGravity = 0;

        this.container.removeChild( this.sprite );
        this.containerFloor.addChild( this.sprite );

        this.state = BUBBLE_STATE.DROPPING;
    }
}

GAME.Bubble.prototype.explode = function(notify)
{
    TweenLite.to(this.sprite, 0.15, {alpha:0,ease:Circ.easeOut,overwrite:"all",delay:this.branchDepth * 0.05 + 0.05});
    TweenLite.to(this.sprite.scale, 0.15, {x:1.2,y:1.2,ease:Circ.easeOut,overwrite:"all",delay:this.branchDepth * 0.05 + 0.05, onStart:this.setExploding, onStartScope:this, onStartParams:[notify]});
}

GAME.Bubble.prototype.setExploding = function(notify)
{
    gameEngine.scenes[GAME_MODE.INGAME].particleManager.explode(this.sprite.position.x,this.sprite.position.y);

    if(notify) sounds.play('explode_bubble');

    this.seedSprite.rotation = Math.random() * Math.PI * 2.0;
    this.seedSprite.position.x = this.sprite.position.x;
    this.seedSprite.position.y = this.sprite.position.y;
    this.seedSprite.visible = true;

    var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    this.rotationSpeed = (Math.PI * 0.6 + Math.random() * Math.PI * 0.3) * plusOrMinus;

    var angle = Math.random() * Math.PI * 2;
    var velocityModule = defaultWidth*0.08 + Math.random()*defaultWidth*0.04;
    this.velocityX = velocityModule * Math.cos( angle );
    this.velocityY = velocityModule * Math.sin( angle );
    
    this.state = BUBBLE_STATE.EXPLODING;

    //Notificar que ha explotado la burbuja
    if(notify === true) gameEngine.scenes[GAME_MODE.INGAME].bubbleManager.notifyExplodeBubble();
}

GAME.Bubble.prototype.showScore = function(x,y,score)
{
    if(this.bubbleType == BUBBLE_TYPE.CYAN) this.scoreText.setStyle({font: "GameScene_CyanFont", align: "left"});
    else if(this.bubbleType == BUBBLE_TYPE.RED) this.scoreText.setStyle({font: "GameScene_RedFont", align: "left"});
    else if(this.bubbleType == BUBBLE_TYPE.BLUE) this.scoreText.setStyle({font: "GameScene_BlueFont", align: "left"});
    else if(this.bubbleType == BUBBLE_TYPE.GREEN) this.scoreText.setStyle({font: "GameScene_GreenFont", align: "left"});
    else if(this.bubbleType == BUBBLE_TYPE.YELLOW) this.scoreText.setStyle({font: "GameScene_YellowFont", align: "left"});
    else if(this.bubbleType == BUBBLE_TYPE.ORANGE) this.scoreText.setStyle({font: "GameScene_OrangeFont", align: "left"});
    else if(this.bubbleType == BUBBLE_TYPE.PURPLE) this.scoreText.setStyle({font: "GameScene_MagentaFont", align: "left"});

    this.scoreText.alpha = 0;
    this.scoreText.setText("+" + score);
    this.scoreText.updateTransform();
    this.scoreText.position.x = x - this.scoreText.textWidth*0.5;
    this.scoreText.position.y = y;

    TweenLite.to(this.scoreText, 0.1, {alpha:1.0,ease:Sine.easeOut,overwrite:"all"});
    TweenLite.to(this.scoreText.position, 0.1, {y:y-this.scoreText.textHeight*0.5,ease:Sine.easeOut,overwrite:"all",onCompleteScope:this,onComplete:this.hideScore});
}

GAME.Bubble.prototype.hideScore = function()
{
    TweenLite.to(this.scoreText, 0.1, {alpha:0.0,delay:1.2,ease:Sine.easeOut,overwrite:"all"});
    TweenLite.to(this.scoreText.position, 0.1, {y:this.scoreText.position.y-this.scoreText.textHeight*0.5,delay:1.2,ease:Sine.easeOut,overwrite:"all"});
}

GAME.Bubble.prototype.setShooting = function(velocityX,velocityY)
{
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.state = BUBBLE_STATE.SHOOTING;
}

GAME.Bubble.prototype.setMoving = function()
{
    this.state = BUBBLE_STATE.MOVING;
}

GAME.Bubble.prototype.setMovingTop = function()
{
    this.state = BUBBLE_STATE.MOVING_TOP;
}

GAME.Bubble.prototype.update = function(dt)
{
    if(this.state == BUBBLE_STATE.MOVING)
    {
        //Defino los limites donde la burbuja puede rebotar
        var x1 = (defaultWidth - (this.bubblesInRow*this.sprite.width + (this.sprite.width + this.space)*0.5 + (this.bubblesInRow - 1)*this.space))*0.5;
        var x2 = defaultWidth - x1;
        var y1 = gameEngine.scenes[GAME_MODE.INGAME].cuadroBlanco.position.y - gameEngine.scenes[GAME_MODE.INGAME].cuadroBlanco.height*0.5 + this.topSpace + this.sprite.height*0.5;
        var y2 = defaultHeight + this.sprite.height*0.5;

        if(this.sprite.position.x + this.velocityX * dt < x1 || this.sprite.position.x + this.velocityX * dt > x2 )
        {
            this.velocityX *= -1;

            //Particles
            if(this.sprite.position.x + this.velocityX * -1 * dt < x1)
            {
                gameEngine.scenes[GAME_MODE.INGAME].particleManager.clash(x1,this.sprite.position.y);
                sounds.play('clash_bubble');
            }
            else if(this.sprite.position.x + this.velocityX * -1 * dt > x2)
            {
                gameEngine.scenes[GAME_MODE.INGAME].particleManager.clash(x2,this.sprite.position.y);
                sounds.play('clash_bubble');
            }
        }
        this.sprite.position.x += this.velocityX * dt;
        
        //Reviso si choco con la muralla superior
        if(this.sprite.position.y < y1)
        {
            if(this.bubbleType !== BUBBLE_TYPE.SPECIAL) this.setMovingTop();
            else this.velocityY *= -1;

            //Particles
            gameEngine.scenes[GAME_MODE.INGAME].particleManager.clash(this.sprite.position.x,y1);

            sounds.play('clash_bubble');
        }
        this.sprite.position.y += this.velocityY * dt;

        if(this.sprite.position.y > y2)
        {
            this.setBubbleReady(BUBBLE_TYPE.SPECIAL);
        }

        this.timeElapsed += dt;
        if(this.timeElapsed > this.timeBetweenParticles)
        {
            gameEngine.scenes[GAME_MODE.INGAME].particleManager.emitBubbles(this.sprite.position.x,this.sprite.position.y,this.bubbleType);
            this.timeElapsed = 0;
        }
    }
    else if(this.state == BUBBLE_STATE.EXPLODING)
    {
        this.seedSprite.position.x += this.velocityX * dt;
        this.seedSprite.position.y += this.velocityY * dt;
        this.velocityY += this.gravity * dt;
        this.seedSprite.rotation += this.rotationSpeed * dt;
        if(this.seedSprite.position.y > defaultHeight * 0.5 && !this.disappearSeed)
        {
            this.disappearSeed = true;
            TweenLite.to(this.seedSprite, 0.2, {alpha:0,ease:Sine.easeIn,overwrite:"all",onComplete:this.init,onCompleteScope:this});
        }
    }
    else if(this.state == BUBBLE_STATE.DROPPING)
    {
        this.sprite.position.y += this.velocityGravity * dt;
        this.velocityGravity += this.gravity * dt;
        if(this.sprite.position.y > defaultHeight * 0.7 && !this.disappearSeed)
        {
            this.disappearSeed = true;
            TweenLite.to(this.sprite, 0.15, {alpha:0,ease:Sine.easeIn,overwrite:"all",onComplete:this.init,onCompleteScope:this});
        }
    }
}
