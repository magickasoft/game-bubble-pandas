var GAME = GAME || {};

GAME.SplashScene = function(container, width, height)
{
    this.container = container;
    this.width = width;
    this.height = height;

    this.innerContainer =  new PIXI.DisplayObjectContainer();
    this.innerContainer.position.x = this.width*0.5;
    this.innerContainer.position.y = this.height*0.5;
    this.container.addChild( this.innerContainer );

    var negro = PIXI.Texture.fromImage("Art/PatronFondo" + artSuffix + ".png");
    var cnegro = new PIXI.TilingSprite(negro, defaultWidth, defaultHeight);
    cnegro.position.x = -defaultWidth*0.5;
    cnegro.position.y = -defaultHeight*0.5;
    this.innerContainer.addChild( cnegro );

    this.logo = PIXI.Sprite.fromFrame("LoadingScene_StudioPangeaSplash.png");
    this.logo.anchor.x = this.logo.anchor.y = 0.5;
    this.logo.position.x = this.logo.position.y = 0;
    this.innerContainer.addChild( this.logo );

    // Retrieves the logo from Spil
   /* var logoData = gameEngine.apiInstance.Branding.getLogo();
    if(logoData.image)
    {
        this.logoBrand = PIXI.Sprite.fromImage(logoData.image);
        this.logoBrand.anchor.x = this.logoBrand.anchor.y = 0.5;
        this.logoBrand.position.x = -defaultWidth*0.5 + this.logoBrand.width*0.5;
        this.logoBrand.position.y = defaultHeight*0.5 - this.logoBrand.height*0.5;
        this.innerContainer.addChild( this.logoBrand );

        this.logoBrand.interactive = this.logoBrand.buttonMode = true;
        this.logoBrand.mousedown = this.logoBrand.touchstart = function (touchData)
        {
            touchData.originalEvent.preventDefault();
            var logoData = gameEngine.apiInstance.Branding.getLogo();
            logoData.action();
        }
    }*/
}

// constructor
GAME.SplashScene.constructor = GAME.SplashScene;

GAME.SplashScene.prototype.onEnter = function()
{
    //menuMusic.play();
    TweenLite.to(this.innerContainer, 0.5, {alpha:1.0,ease:Sine.easeInOut,delay:2.5,onComplete:this.changeScene});
}

GAME.SplashScene.prototype.resize = function(width, height)
{
    this.width = width;
    this.height = height;

    this.innerContainer.position.x = this.width*0.5;
    this.innerContainer.position.y = this.height*0.5;
}

GAME.SplashScene.prototype.changeScene = function()
{
    gameEngine.changeSceneTo(GAME_MODE.MENU);
}

GAME.SplashScene.prototype.mouseDown = function(mouseData)
{
}

GAME.SplashScene.prototype.mouseMove = function(mouseData)
{
}

GAME.SplashScene.prototype.mouseUp = function(mouseData)
{
}

GAME.SplashScene.prototype.update = function(dt)
{
}
