var GAME = GAME || {};

GAME.ParticleManager = function(container,containerParticleBubbles)
{
    if(!gameEngine.userStorage.showEffects) return;

    this.container = container;
    this.containerParticleBubbles = containerParticleBubbles;

    this.containerBubblesBlue = new PIXI.SpriteBatch();
    this.containerBubblesCyan = new PIXI.SpriteBatch();
    this.containerBubblesGreen = new PIXI.SpriteBatch();
    this.containerBubblesMagenta = new PIXI.SpriteBatch();
    this.containerBubblesOrange = new PIXI.SpriteBatch();
    this.containerBubblesRed = new PIXI.SpriteBatch();
    this.containerBubblesYellow = new PIXI.SpriteBatch();

    this.containerStars = new PIXI.SpriteBatch();
    this.containerCircles = new PIXI.SpriteBatch();

    this.containerParticleBubbles.addChild( this.containerBubblesBlue );
    this.containerParticleBubbles.addChild( this.containerBubblesCyan );
    this.containerParticleBubbles.addChild( this.containerBubblesGreen );
    this.containerParticleBubbles.addChild( this.containerBubblesMagenta );
    this.containerParticleBubbles.addChild( this.containerBubblesOrange );
    this.containerParticleBubbles.addChild( this.containerBubblesRed );
    this.containerParticleBubbles.addChild( this.containerBubblesYellow );

    this.container.addChild( this.containerCircles );
    this.container.addChild( this.containerStars );

    //Pool de particulas
    this.particlesInGame = [];

    this.intensity = 1.0;

    this.bubblesInGame = [];

    this.radiusError = PIXI.Sprite.fromImage("Art/Particulas/Particulas_BurbujaCyan" + artSuffix + ".png").width;
}

// constructor
GAME.ParticleManager.constructor = GAME.ParticleManager;

GAME.ParticleManager.prototype.init = function()
{
    if(!gameEngine.userStorage.showEffects) return;

    var i;
    for(i = 0; i < this.particlesInGame.length; i++)
    {
        this.particlesInGame[i].init();
    }
    for(i = 0; i < this.bubblesInGame.length; i++)
    {
        this.bubblesInGame[i].init();
    }
}

GAME.ParticleManager.prototype.emitBubbles = function(x,y,bubbleType)
{
    if(!gameEngine.userStorage.showEffects) return;

    var n = 2;
    
    var angle,errorX,errorY;

    var i;
    for(i=0;i < n;i++)
    {
        angle = Math.random() * Math.PI * 2;
        errorX = this.radiusError * Math.cos( angle );
        errorY = this.radiusError * Math.sin( angle );
        this.emitBubble(x + errorX,y + errorY,bubbleType);
    }
}

GAME.ParticleManager.prototype.emitBubble = function(x,y,bubbleType)
{
    var particle;
    var i;
    for(i = 0; i < this.bubblesInGame.length; i++)
    {
        particle = this.bubblesInGame[i];
        
        if(particle.state === PARTICLE_STATE.IDLE && bubbleType === particle.bubbleType)
        {
            particle.explode(x,y);
            return particle;
        }
    }

    particle = new GAME.ParticleBubble(bubbleType,this.containerBubblesBlue,this.containerBubblesCyan,this.containerBubblesGreen,this.containerBubblesMagenta,this.containerBubblesOrange,this.containerBubblesRed,this.containerBubblesYellow);
    this.bubblesInGame.push(particle);
    particle.explode(x,y);

    return particle;
}

GAME.ParticleManager.prototype.calculateIntensity = function(score)
{
    if(!gameEngine.userStorage.showEffects) return;

    var x1 = 30;
    var y1 = 1.0;
    var x2 = 250;
    var y2 = 2.0;
    this.intensity = Math.min(y2,Math.max(y1,(((y2 - y1) / (x2 - x1)) * (score - x1)) + y1));
}

GAME.ParticleManager.prototype.explode = function(x,y)
{
    if(!gameEngine.userStorage.showEffects) return;

    var n = Math.floor(4 * this.intensity);

    var i;
    for(i=0;i < n;i++)
    {
        this.explodeParticle(x,y);
    }
}

GAME.ParticleManager.prototype.explodeParticle = function(x,y)
{
    var particle;
    var i;
    for(i = 0; i < this.particlesInGame.length; i++)
    {
        particle = this.particlesInGame[i];
        
        if(particle.state == PARTICLE_STATE.IDLE)
        {
            particle.explode(x,y);
            return particle;
        }
    }

    var type = Math.floor(Math.random() * (1 + 1));
    particle = new GAME.Particle(this.containerStars,this.containerCircles,type);
    this.particlesInGame.push(particle);
    particle.explode(x,y);

    return particle;
}

GAME.ParticleManager.prototype.clash = function(x,y)
{
    if(!gameEngine.userStorage.showEffects) return;

    var n = 3;

    var i;
    for(i=0;i < n;i++)
    {
        this.clashParticle(x,y);
    }
}

GAME.ParticleManager.prototype.clashParticle = function(x,y)
{
    var particle;
    var i;
    for(i = 0; i < this.particlesInGame.length; i++)
    {
        particle = this.particlesInGame[i];
        
        if(particle.state == PARTICLE_STATE.IDLE)
        {
            particle.clash(x,y);
            return particle;
        }
    }

    var type = Math.floor(Math.random() * (1 + 1));
    particle = new GAME.Particle(this.containerStars,this.containerCircles,type);
    this.particlesInGame.push(particle);
    particle.clash(x,y);

    return particle;
}

GAME.ParticleManager.prototype.update = function(dt)
{
    if(!gameEngine.userStorage.showEffects) return;
    
    var i;
    for(i = 0; i < this.particlesInGame.length; i++)
    {
        this.particlesInGame[i].update(dt);
    }
    for(i = 0; i < this.bubblesInGame.length; i++)
    {
        this.bubblesInGame[i].update(dt);
    }
}
