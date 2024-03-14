var PARTICLE_STATE = {IDLE:0, MOVING:1};
var BUBBLE_TYPE = {CYAN:0, RED:1, BLUE:2, GREEN:3, YELLOW:4, ORANGE:5, PURPLE:6, ROCK:7, SPECIAL:8};

var GAME = GAME || {};

GAME.ParticleBubble = function(bubbleType, containerBubblesBlue,containerBubblesCyan,containerBubblesGreen,containerBubblesMagenta,containerBubblesOrange,containerBubblesRed,containerBubblesYellow)
{
    this.bubbleType = bubbleType;

    this.containerBubblesBlue = containerBubblesBlue;
    this.containerBubblesCyan = containerBubblesCyan;
    this.containerBubblesGreen = containerBubblesGreen;
    this.containerBubblesMagenta = containerBubblesMagenta;
    this.containerBubblesOrange = containerBubblesOrange;
    this.containerBubblesRed = containerBubblesRed;
    this.containerBubblesYellow = containerBubblesYellow;

    if(this.bubbleType === BUBBLE_TYPE.CYAN)
    {
        this.sprite = PIXI.Sprite.fromImage("Art/Particulas/Particulas_BurbujaCyan" + artSuffix + ".png");
        this.containerBubblesCyan.addChild( this.sprite );    
    }
    else if(this.bubbleType === BUBBLE_TYPE.BLUE)
    {
        this.sprite = PIXI.Sprite.fromImage("Art/Particulas/Particulas_BurbujaBlue" + artSuffix + ".png");
        this.containerBubblesBlue.addChild( this.sprite );    
    }
    else if(this.bubbleType === BUBBLE_TYPE.GREEN)
    {
        this.sprite = PIXI.Sprite.fromImage("Art/Particulas/Particulas_BurbujaGreen" + artSuffix + ".png");
        this.containerBubblesGreen.addChild( this.sprite );    
    }
    else if(this.bubbleType === BUBBLE_TYPE.PURPLE)
    {
        this.sprite = PIXI.Sprite.fromImage("Art/Particulas/Particulas_BurbujaMagenta" + artSuffix + ".png");
        this.containerBubblesMagenta.addChild( this.sprite );    
    }
    else if(this.bubbleType === BUBBLE_TYPE.ORANGE)
    {
        this.sprite = PIXI.Sprite.fromImage("Art/Particulas/Particulas_BurbujaOrange" + artSuffix + ".png");
        this.containerBubblesOrange.addChild( this.sprite );    
    }
    else if(this.bubbleType === BUBBLE_TYPE.RED)
    {
        this.sprite = PIXI.Sprite.fromImage("Art/Particulas/Particulas_BurbujaRed" + artSuffix + ".png");
        this.containerBubblesRed.addChild( this.sprite );    
    }
    else if(this.bubbleType === BUBBLE_TYPE.YELLOW)
    {
        this.sprite = PIXI.Sprite.fromImage("Art/Particulas/Particulas_BurbujaYellow" + artSuffix + ".png");
        this.containerBubblesYellow.addChild( this.sprite );    
    }
    else if(this.bubbleType === BUBBLE_TYPE.SPECIAL)
    {
        this.sprite = PIXI.Sprite.fromImage("Art/Particulas/Particulas_BurbujaYellow" + artSuffix + ".png");
        this.containerBubblesYellow.addChild( this.sprite );    
    }
    
    this.sprite.anchor.x = this.sprite.anchor.y = 0.5;

    this.init();
}

// constructor
GAME.ParticleBubble.constructor = GAME.ParticleBubble;

GAME.ParticleBubble.prototype.init = function()
{
    this.sprite.alpha = 1;
    this.sprite.rotation = 0;
    this.sprite.visible = false;

    this.state = PARTICLE_STATE.IDLE;
}

GAME.ParticleBubble.prototype.explode = function(x,y)
{
    this.sprite.position.x = x;
    this.sprite.position.y = y;

    //Tiempo en segundos en que se vive la particula
    this.lifespan = 0.1 + Math.random() * 0.2;

    var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    this.rotationSpeed = (Math.PI * 0.5 + Math.random() * Math.PI * 0.2) * plusOrMinus;

    this.sprite.scale.x = this.sprite.scale.y = 0.4 + Math.random() * 0.2;
    this.scaleVelocity = ((1.6 + Math.random() * 0.9) - this.sprite.scale.x) / this.lifespan;

    this.sprite.alpha = 0.9;
    this.alphaVelocity = - this.sprite.alpha / this.lifespan;

    this.sprite.visible = true;

    this.state = PARTICLE_STATE.MOVING;
}

GAME.ParticleBubble.prototype.update = function(dt)
{
    if(this.state == PARTICLE_STATE.MOVING)
    {
        this.sprite.rotation += this.rotationSpeed * dt;

        this.sprite.scale.x = this.sprite.scale.y = this.sprite.scale.x + this.scaleVelocity * dt;

        this.sprite.alpha = this.sprite.alpha + this.alphaVelocity * dt > 0 ? this.sprite.alpha + this.alphaVelocity * dt : 0;

        if(this.sprite.alpha == 0)
        {
            this.init();
        }
    }
}
