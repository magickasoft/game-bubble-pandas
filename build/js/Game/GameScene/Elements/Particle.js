var PARTICLE_STATE = {IDLE:0, MOVING:1};
var PARTICLE_TYPE = {STAR:0, CIRCLE:1};

var GAME = GAME || {};

GAME.Particle = function(containerStar,containerCircle,particleType)
{
    this.containerStar = containerStar;
    this.containerCircle = containerCircle;

    this.particleType = particleType;

    if(particleType == PARTICLE_TYPE.STAR)
    {
        this.sprite = PIXI.Sprite.fromImage("Art/GameScene/GameScene_EstrellaParticula" + artSuffix + ".png");
        this.containerStar.addChild( this.sprite );
    }
    else if(particleType == PARTICLE_TYPE.CIRCLE)
    {
        this.sprite = PIXI.Sprite.fromImage("Art/GameScene/GameScene_CirculoParticula" + artSuffix + ".png");
        this.containerCircle.addChild( this.sprite );
    }
    this.sprite.anchor.x = this.sprite.anchor.y = 0.5;

    this.gravityClash = defaultHeight * 0.0;
    this.gravityExplode = defaultHeight * 0.5;

    this.init();
}

// constructor
GAME.Particle.constructor = GAME.Particle;

GAME.Particle.prototype.init = function()
{
    this.sprite.alpha = 1;
    this.sprite.rotation = 0;
    this.sprite.visible = false;

    this.state = PARTICLE_STATE.IDLE;
}

GAME.Particle.prototype.clash = function(x,y)
{
    this.sprite.position.x = x;
    this.sprite.position.y = y;

    //Tiempo en segundos en que se vive la particula
    this.lifespan = 0.5 + Math.random() * 0.3;

    var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    this.rotationSpeed = (Math.PI * 0.5 + Math.random() * Math.PI * 0.2) * plusOrMinus;

    var angle = Math.random() * Math.PI * 2;
    var velocityModule = defaultWidth*0.4 + Math.random()*defaultWidth*0.1;
    this.velocityX = velocityModule * Math.cos( angle );
    this.velocityY = velocityModule * Math.sin( angle );

    this.sprite.scale.x = this.sprite.scale.y = 0.8 + Math.random() * 0.2;
    this.scaleVelocity = - this.sprite.scale.x / this.lifespan;

    this.sprite.alpha = 1;
    this.alphaVelocity = - this.sprite.alpha / this.lifespan;

    this.sprite.visible = true;

    this.gravity = this.gravityClash;

    this.state = PARTICLE_STATE.MOVING;
}

GAME.Particle.prototype.explode = function(x,y)
{
    this.sprite.position.x = x;
    this.sprite.position.y = y;

    //Tiempo en segundos en que se vive la particula
    this.lifespan = 2.0 + Math.random() * 0.7;

    var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    this.rotationSpeed = (Math.PI * 0.5 + Math.random() * Math.PI * 0.2) * plusOrMinus;

    var angle = - (Math.random() * Math.PI * 1.5 - Math.PI * 0.25);
    var velocityModule = defaultWidth*0.6 + Math.random()*defaultWidth*0.3;
    this.velocityX = velocityModule * Math.cos( angle );
    this.velocityY = velocityModule * Math.sin( angle );

    this.sprite.scale.x = this.sprite.scale.y = 0.8 + Math.random() * 0.2;
    this.scaleVelocity = - this.sprite.scale.x / this.lifespan;

    this.sprite.alpha = 1;
    this.alphaVelocity = - this.sprite.alpha / (this.lifespan * 2.0);

    this.sprite.visible = true;

    this.gravity = this.gravityExplode * 1.5;

    this.state = PARTICLE_STATE.MOVING;
}

GAME.Particle.prototype.update = function(dt)
{
    if(this.state == PARTICLE_STATE.MOVING)
    {
        this.sprite.position.x += this.velocityX * dt;
        this.sprite.position.y += this.velocityY * dt;

        this.velocityY += this.gravity * dt;

        this.sprite.rotation += this.rotationSpeed * dt;

        this.sprite.scale.x = this.sprite.scale.x + this.scaleVelocity * dt > 0 ? this.sprite.scale.x + this.scaleVelocity * dt : 0;
        this.sprite.scale.y = this.sprite.scale.x;

        this.sprite.alpha = this.sprite.alpha + this.alphaVelocity * dt > 0 ? this.sprite.alpha + this.alphaVelocity * dt : 0;

        if(this.sprite.alpha == 0)
        {
            this.init();
        }
    }
}
