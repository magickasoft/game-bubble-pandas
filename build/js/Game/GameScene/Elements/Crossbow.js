var CROSSBOW_STATE = {IDLE:0, SHOOTING:1};

var GAME = GAME || {};

GAME.Crossbow = function(container,positionY)
{
    this.container = container;

    var baseBallesta = PIXI.Sprite.fromFrame("GameScene_BaseBallesta.png");
    baseBallesta.anchor.x = baseBallesta.anchor.y = 0.5;
    baseBallesta.position.x = defaultWidth*0.5;
    baseBallesta.position.y = positionY - baseBallesta.height*0.26;
    this.container.addChild( baseBallesta );

    this.bubbleSupport = PIXI.Sprite.fromFrame("GameScene_BolaReserva.png");
    this.bubbleSupport.anchor.x = this.bubbleSupport.anchor.y = 0.5;
    this.bubbleSupport.position.x = defaultWidth*0.73;
    this.bubbleSupport.position.y = positionY - this.bubbleSupport.height*0.3;
    this.container.addChild( this.bubbleSupport );

    this.bubbleSupport.interactive = this.bubbleSupport.buttonMode = true;
    this.bubbleSupport.mousedown = this.bubbleSupport.touchstart = function (touchData)
    {
        touchData.originalEvent.preventDefault();
        gameEngine.scenes[GAME_MODE.INGAME].bubbleManager.swap();
    }

    this.glowSupport = PIXI.Sprite.fromFrame("GameScene_Swap.png");
    this.glowSupport.anchor.x = this.glowSupport.anchor.y = 0.5;
    this.glowSupport.position.x = this.bubbleSupport.position.x;
    this.glowSupport.position.y = this.bubbleSupport.position.y - this.bubbleSupport.height*0.08;
    this.container.addChild( this.glowSupport );

    //Genero textura para los puntos moviles
    this.pointsShooting = [];
    var i;
    for(i = 0; i < 10; i++)
    {
        var point = PIXI.Sprite.fromFrame("GameScene_PuntoLinea.png");
        point.anchor.x = point.anchor.y = 0.5;
        point.position.x = defaultWidth*0.5;
        point.position.y = defaultHeight*0.5;
        point.visible = false;
        this.pointsShooting.push( point );
        this.container.addChild( point );
    }

    this.flechaBallesta = PIXI.Sprite.fromFrame("GameScene_FlechaBallesta.png");
    this.flechaBallesta.anchor.x = 0.5;
    this.flechaBallesta.anchor.y = 0.71;
    this.flechaBallesta.position.x = defaultWidth*0.5;
    this.flechaBallesta.position.y = baseBallesta.position.y - baseBallesta.height*0.5 - this.flechaBallesta.height*0.22;
    this.container.addChild( this.flechaBallesta );

    this.flechaBallestaBlanco = PIXI.Sprite.fromFrame("GameScene_FlechaBallestaBlanco.png");
    this.flechaBallestaBlanco.anchor.x = 0.5;
    this.flechaBallestaBlanco.anchor.y = 0.71;
    this.flechaBallestaBlanco.position.x = this.flechaBallesta.position.x;
    this.flechaBallestaBlanco.position.y = this.flechaBallesta.position.y;
    this.flechaBallestaBlanco.alpha = 0;
    this.container.addChild( this.flechaBallestaBlanco );

    this.pointsLeftRope = [];
    this.pointsLeftRope.push(new PIXI.Point(0, 0));
    this.pointsLeftRope.push(new PIXI.Point(defaultWidth*0.5, defaultHeight*0.5));

    this.pointsRightRope = [];
    this.pointsRightRope.push(new PIXI.Point(0, 0));
    this.pointsRightRope.push(new PIXI.Point(defaultWidth*0.5, defaultHeight*0.5));

    this.leftRope = new PIXI.Rope(PIXI.Texture.fromImage("Art/GameScene/GameScene_Cuerda" + artSuffix + ".png"), this.pointsLeftRope);
    this.container.addChild(this.leftRope);

    this.rightRope = new PIXI.Rope(PIXI.Texture.fromImage("Art/GameScene/GameScene_Cuerda" + artSuffix + ".png"), this.pointsRightRope);
    this.container.addChild(this.rightRope);

    this.arcoBallesta = PIXI.Sprite.fromFrame("GameScene_ArcoBallesta.png");
    this.arcoBallesta.anchor.x = 0.5;
    this.arcoBallesta.anchor.y = 0.5;
    this.arcoBallesta.position.x = defaultWidth*0.5;
    this.arcoBallesta.position.y = this.flechaBallesta.position.y + this.arcoBallesta.height*0.6;
    this.container.addChild( this.arcoBallesta );

    //Poner los puntos de la cuerda
    this.pointsLeftRope[0].x = this.flechaBallesta.position.x - this.flechaBallesta.width*0.38*Math.cos(this.flechaBallesta.rotation*-1);
    this.pointsLeftRope[0].y = this.flechaBallesta.position.y + this.flechaBallesta.width*0.38*Math.sin(this.flechaBallesta.rotation*-1);

    this.pointsLeftRope[1].x = this.arcoBallesta.position.x - this.arcoBallesta.width*0.49*Math.cos(this.arcoBallesta.rotation*-1);
    this.pointsLeftRope[1].y = this.arcoBallesta.position.y + this.arcoBallesta.width*0.49*Math.sin(this.arcoBallesta.rotation*-1);

    this.pointsRightRope[0].x = this.flechaBallesta.position.x + this.flechaBallesta.width*0.38*Math.cos(this.flechaBallesta.rotation);
    this.pointsRightRope[0].y = this.flechaBallesta.position.y + this.flechaBallesta.width*0.38*Math.sin(this.flechaBallesta.rotation);

    this.pointsRightRope[1].x = this.arcoBallesta.position.x + this.arcoBallesta.width*0.49*Math.cos(this.arcoBallesta.rotation);
    this.pointsRightRope[1].y = this.arcoBallesta.position.y + this.arcoBallesta.width*0.49*Math.sin(this.arcoBallesta.rotation);

    this.collisionBox = {x:this.flechaBallesta.position.x - this.arcoBallesta.width*0.5,
                        y:this.flechaBallesta.position.y - this.flechaBallesta.height*0.5,
                        width:this.arcoBallesta.width,
                        height:this.flechaBallesta.height + this.arcoBallesta.height};

    this.init();    
}

// constructor
GAME.Crossbow.constructor = GAME.Crossbow;

GAME.Crossbow.prototype.init = function()
{
    this.enableCrossbow();

    this.arcoBallesta.rotation = 0;
    this.flechaBallesta.rotation = 0;

    var i;
    for(i = 0; i < this.pointsShooting.length; i++)
    {
        this.pointsShooting[i].visible = false;
    }

    this.arcoBallesta.position.x = defaultWidth*0.5;
    this.arcoBallesta.position.y = this.flechaBallesta.position.y + this.arcoBallesta.height*0.6;

    this.pointsLeftRope[0].x = this.flechaBallesta.position.x - this.flechaBallesta.width*0.38*Math.cos(this.flechaBallesta.rotation*-1);
    this.pointsLeftRope[0].y = this.flechaBallesta.position.y + this.flechaBallesta.width*0.38*Math.sin(this.flechaBallesta.rotation*-1);

    this.pointsLeftRope[1].x = this.arcoBallesta.position.x - this.arcoBallesta.width*0.49*Math.cos(this.arcoBallesta.rotation*-1);
    this.pointsLeftRope[1].y = this.arcoBallesta.position.y + this.arcoBallesta.width*0.49*Math.sin(this.arcoBallesta.rotation*-1);

    this.pointsRightRope[0].x = this.flechaBallesta.position.x + this.flechaBallesta.width*0.38*Math.cos(this.flechaBallesta.rotation);
    this.pointsRightRope[0].y = this.flechaBallesta.position.y + this.flechaBallesta.width*0.38*Math.sin(this.flechaBallesta.rotation);

    this.pointsRightRope[1].x = this.arcoBallesta.position.x + this.arcoBallesta.width*0.49*Math.cos(this.arcoBallesta.rotation);
    this.pointsRightRope[1].y = this.arcoBallesta.position.y + this.arcoBallesta.width*0.49*Math.sin(this.arcoBallesta.rotation);

    this.timeElapsed = 0;

    this.state = CROSSBOW_STATE.IDLE;
}

GAME.Crossbow.prototype.isTouchingBubbleSupport = function(location)
{
    if(location.x <= this.bubbleSupport.position.x + this.bubbleSupport.width*0.5 && location.x >= this.bubbleSupport.position.x - this.bubbleSupport.width*0.5 && location.y >= this.bubbleSupport.position.y - this.bubbleSupport.height*0.5 && location.y <= this.bubbleSupport.position.y + this.bubbleSupport.height*0.5)
    {
        return true;
    }
    return false;
}

GAME.Crossbow.prototype.aimShoot = function(location)
{
    var distance,angle;

    var posX = this.flechaBallesta.position.x;
    var posY = this.flechaBallesta.position.y;

    var distanceMin = defaultWidth*0.05;
    var distanceMax = defaultWidth*0.17;

    if(gameEngine.isMobile.any())
    {
        location.x = Math.max( 0, Math.min( defaultWidth, location.x ) );
        location.y = Math.max( this.flechaBallesta.position.y + defaultWidth*0.04, location.y );

        //Calculo la distancia del arco de la ballesta (minima y maxima posible)
        distance = Math.min(distanceMax, Math.max(distanceMin, Math.sqrt((location.x - posX)*(location.x - posX) + (location.y - posY)*(location.y - posY))));
    }
    else
    {
        location.x = Math.max( 0, Math.min( defaultWidth, location.x ) );
        location.y = Math.min( this.flechaBallesta.position.y - defaultWidth*0.04, location.y );

        //Calculo la distancia del arco de la ballesta (minima y maxima posible)
        distance = (distanceMin + distanceMax) * 0.5;
    }

    var x = location.x - posX;
    var y = location.y - posY;
    angle = Math.atan2(y,x);

    
    if(gameEngine.isMobile.any())
    {
        this.flechaBallesta.rotation = angle - Math.PI*0.5;

        this.arcoBallesta.rotation = angle - Math.PI*0.5;

        this.arcoBallesta.position.x = posX + Math.cos(angle)*distance;
        this.arcoBallesta.position.y = posY + Math.sin(angle)*distance;
    }
    else
    {
        this.flechaBallesta.rotation = angle + Math.PI*0.5;

        this.arcoBallesta.rotation = angle + Math.PI*0.5;

        this.arcoBallesta.position.x = posX + Math.cos(angle + Math.PI)*distance;
        this.arcoBallesta.position.y = posY + Math.sin(angle + Math.PI)*distance;
    }

    //Calculo de los puntos
    posX = this.flechaBallesta.position.x + Math.cos(this.flechaBallesta.rotation - Math.PI * 0.5) * this.flechaBallesta.height*0.5;
    posY = this.flechaBallesta.position.y + Math.sin(this.flechaBallesta.rotation - Math.PI * 0.5) * this.flechaBallesta.height*0.5;

    var distanceShoot = defaultWidth * 0.5 - this.flechaBallesta.height*0.5;
    var shootingPointX = posX + Math.cos(this.flechaBallesta.rotation - Math.PI * 0.5)*distanceShoot;
    var shootingPointY = posY + Math.sin(this.flechaBallesta.rotation - Math.PI * 0.5)*distanceShoot;

    var moduleVelocity = Math.sqrt( (shootingPointX - posX)*(shootingPointX - posX) + (shootingPointY - posY)*(shootingPointY - posY) );
    this.velocityShootingX = defaultWidth*0.1 * (shootingPointX - posX) / moduleVelocity;
    this.velocityShootingY = defaultWidth*0.1 * (shootingPointY - posY) / moduleVelocity;

    this.distanceShootingX = Math.abs(shootingPointX - posX);
    this.distanceShootingY = Math.abs(shootingPointY - posY);

    this.state = CROSSBOW_STATE.SHOOTING;
}

GAME.Crossbow.prototype.shoot = function(location)
{
    var distance,angle;

    var posX = this.flechaBallesta.position.x;
    var posY = this.flechaBallesta.position.y;

    var distanceMin = defaultWidth*0.05;
    var distanceMax = defaultWidth*0.17;

    if(gameEngine.isMobile.any())
    {
        location.x = Math.max( 0, Math.min( defaultWidth, location.x ) );
        location.y = Math.max( this.flechaBallesta.position.y + defaultWidth*0.04, location.y );

        //Calculo la distancia del arco de la ballesta (minima y maxima posible)
        distance = Math.min(distanceMax, Math.max(distanceMin, Math.sqrt((location.x - posX)*(location.x - posX) + (location.y - posY)*(location.y - posY))));
    }
    else
    {
        location.x = Math.max( 0, Math.min( defaultWidth, location.x ) );
        location.y = Math.min( this.flechaBallesta.position.y - defaultWidth*0.04, location.y );

        //Calculo la distancia del arco de la ballesta (minima y maxima posible)
        distance = (distanceMin + distanceMax) * 0.4;
    }

    var x = location.x - posX;
    var y = location.y - posY;
    angle = Math.atan2(y,x);

    if(gameEngine.isMobile.any())
    {
        this.flechaBallesta.rotation = angle - Math.PI*0.5;

        this.arcoBallesta.rotation = angle - Math.PI*0.5;

        this.arcoBallesta.position.x = posX + Math.cos(angle)*distance;
        this.arcoBallesta.position.y = posY + Math.sin(angle)*distance;

        TweenLite.to(this.arcoBallesta.position, 0.3, {x:posX + Math.cos(angle)*distanceMin,y:posY + Math.sin(angle)*distanceMin,ease:Elastic.easeOut,overwrite:"all"});
    }
    else
    {
        this.flechaBallesta.rotation = angle + Math.PI*0.5;

        this.arcoBallesta.rotation = angle + Math.PI*0.5;

        this.arcoBallesta.position.x = posX + Math.cos(angle + Math.PI)*distance;
        this.arcoBallesta.position.y = posY + Math.sin(angle + Math.PI)*distance;

        TweenLite.to(this.arcoBallesta.position, 0.3, {x:posX + Math.cos(angle + Math.PI)*distanceMin,y:posY + Math.sin(angle + Math.PI)*distanceMin,ease:Elastic.easeOut,overwrite:"all"});
    }

    var i;
    for(i = 0; i < this.pointsShooting.length; i++)
    {
        this.pointsShooting[i].visible = false;
    }

    sounds.play('shoot_bubble');

    this.state = CROSSBOW_STATE.IDLE;
}

GAME.Crossbow.prototype.enableCrossbow = function()
{
    this.flechaBallesta.interactive = this.flechaBallesta.buttonMode = true;
    this.arcoBallesta.interactive = this.arcoBallesta.buttonMode = true;
    this.bubbleSupport.interactive = this.bubbleSupport.buttonMode = true;
}

GAME.Crossbow.prototype.disableCrossbow = function()
{
    this.flechaBallesta.interactive = this.flechaBallesta.buttonMode = false;
    this.arcoBallesta.interactive = this.arcoBallesta.buttonMode = false;
    this.bubbleSupport.interactive = this.bubbleSupport.buttonMode = false;
}

GAME.Crossbow.prototype.isTouching = function(location)
{
    if(location.x <= this.collisionBox.x + this.collisionBox.width && location.x >= this.collisionBox.x
        && location.y >= this.collisionBox.y && location.y <= this.collisionBox.y + this.collisionBox.height)
    {
        return true;
    }
    return false;
}

GAME.Crossbow.prototype.specialAppear = function()
{
    this.flechaBallestaBlanco.alpha = 0.94;
    TweenLite.to(this.flechaBallestaBlanco, 2, {alpha:0.0,ease:Sine.easeIn,overwrite:"all"});

    sounds.play('star_appear');
}

GAME.Crossbow.prototype.update = function(dt)
{
    this.timeElapsed += dt;

    this.pointsLeftRope[0].x = this.flechaBallesta.position.x - this.flechaBallesta.width*0.38*Math.cos(this.flechaBallesta.rotation*-1);
    this.pointsLeftRope[0].y = this.flechaBallesta.position.y + this.flechaBallesta.width*0.38*Math.sin(this.flechaBallesta.rotation*-1);

    this.pointsLeftRope[1].x = this.arcoBallesta.position.x - this.arcoBallesta.width*0.49*Math.cos(this.arcoBallesta.rotation*-1);
    this.pointsLeftRope[1].y = this.arcoBallesta.position.y + this.arcoBallesta.width*0.49*Math.sin(this.arcoBallesta.rotation*-1);

    this.pointsRightRope[0].x = this.flechaBallesta.position.x + this.flechaBallesta.width*0.38*Math.cos(this.flechaBallesta.rotation);
    this.pointsRightRope[0].y = this.flechaBallesta.position.y + this.flechaBallesta.width*0.38*Math.sin(this.flechaBallesta.rotation);

    this.pointsRightRope[1].x = this.arcoBallesta.position.x + this.arcoBallesta.width*0.49*Math.cos(this.arcoBallesta.rotation);
    this.pointsRightRope[1].y = this.arcoBallesta.position.y + this.arcoBallesta.width*0.49*Math.sin(this.arcoBallesta.rotation);

    this.flechaBallestaBlanco.rotation = this.flechaBallesta.rotation;

    if(this.state == CROSSBOW_STATE.SHOOTING)
    {
        var distanceShoot = defaultWidth * 0.5 - this.flechaBallesta.height*0.6;
        var x1 = distanceShoot * 0.75;
        var y1 = 0.8;
        var x2 = distanceShoot;
        var y2 = 0.0;
        var distance;

        var i;
        for(i = 0; i < this.pointsShooting.length; i++)
        {
            var posX = this.flechaBallesta.position.x + Math.cos(this.flechaBallesta.rotation - Math.PI * 0.5) * this.flechaBallesta.height*0.5;
            var posY = this.flechaBallesta.position.y + Math.sin(this.flechaBallesta.rotation - Math.PI * 0.5) * this.flechaBallesta.height*0.5;

            this.pointsShooting[i].visible = true;
            var offsetX = this.velocityShootingX * (this.timeElapsed + i * (this.distanceShootingX / Math.abs(this.velocityShootingX)) / this.pointsShooting.length) % this.distanceShootingX;
            var offsetY = this.velocityShootingY * (this.timeElapsed + i * (this.distanceShootingY / Math.abs(this.velocityShootingY)) / this.pointsShooting.length) % this.distanceShootingY;
            this.pointsShooting[i].position.x = (posX + offsetX);
            this.pointsShooting[i].position.y = (posY + offsetY);

            distance = Math.sqrt( offsetX*offsetX + offsetY*offsetY );
            this.pointsShooting[i].alpha = Math.min(y1,Math.max(y2,(((y2 - y1) / (x2 - x1)) * (distance - x1)) + y1));
        }
    }

    this.glowSupport.rotation += Math.PI * dt * 3.0;
}
