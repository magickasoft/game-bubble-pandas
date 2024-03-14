var GAME_MODE = {LOADING:0, SPLASH:1, MENU:2, INGAME:3};

var GAME = GAME || {};

GAME.Engine = function(width, height)
{
    var interactive = true;
    this.DEBUG = false;

    this.width = width;
    this.height = height;

    this.userStorage = new GAME.UserStorage();
    this.stage = new PIXI.Stage(0x000000, interactive);

    this.rootContainer = new PIXI.DisplayObjectContainer();
    this.sceneContainer = new PIXI.DisplayObjectContainer();
    this.wallContainer = new PIXI.DisplayObjectContainer();
    this.orientationContainer = new PIXI.DisplayObjectContainer();
    this.blackContainer = new PIXI.DisplayObjectContainer();

    this.stage.addChild( this.rootContainer );
    this.rootContainer.addChild( this.sceneContainer );
    this.rootContainer.addChild( this.wallContainer );
    this.rootContainer.addChild( this.orientationContainer );
    this.rootContainer.addChild( this.blackContainer );

    this.scenes = [];

    this.inTransition = false;

    this.sideEffect = false;

    this.isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (gameEngine.isMobile.Android() || gameEngine.isMobile.BlackBerry() || gameEngine.isMobile.iOS() || gameEngine.isMobile.Opera() || gameEngine.isMobile.Windows());
        }
    };
}

// constructor
GAME.Engine.constructor = GAME.Engine;

GAME.Engine.prototype.resize = function(width, height)
{
    if(this.scenes.length > 0)
    {
        this.width = width;
        this.height = height;

        this.scenes[this.state].resize(width, height);

        if(this.hamsterCortina)
        {
           this.hamsterCortina.position.y = this.height*0.5;
        }

        if(this.tilingSpriteLeft)
        {
            //Fix para moviles
            if((this.width - defaultWidth)*0.5 == 0)
            {
                this.tilingSpriteLeft.width = 2;
                this.tilingSpriteLeft.height = this.height;
                this.tilingSpriteRight.width = 2;
                this.tilingSpriteRight.height = this.height;
                this.tilingSpriteLeft.visible = this.tilingSpriteRight.visible = false;
            }
            else
            {
                this.tilingSpriteLeft.width = (this.width - defaultWidth)*0.5;
                this.tilingSpriteLeft.height = this.height;
                this.tilingSpriteRight.width = (this.width - defaultWidth)*0.5;
                this.tilingSpriteRight.height = this.height;
                this.tilingSpriteLeft.visible = this.tilingSpriteRight.visible = true;
            }

            if((this.height - defaultHeight)*0.5 == 0)
            {
                this.tilingSpriteBottom.width = this.width;
                this.tilingSpriteBottom.height = 2;
                this.tilingSpriteTop.width = this.width;
                this.tilingSpriteTop.height = 2;
                this.tilingSpriteTop.visible = this.tilingSpriteBottom.visible = false;
            }
            else
            {
                this.tilingSpriteBottom.width = this.width;
                this.tilingSpriteBottom.height = (this.height - defaultHeight)*0.5;
                this.tilingSpriteTop.width = this.width;
                this.tilingSpriteTop.height = (this.height - defaultHeight)*0.5;
                this.tilingSpriteTop.visible = this.tilingSpriteBottom.visible = true;
            }

            this.tilingSpriteLeft.position.x = 0;
            this.tilingSpriteLeft.position.y = 0;
            this.tilingSpriteRight.position.x = this.width - ((this.width - defaultWidth)*0.5);
            this.tilingSpriteRight.position.y = 0;

            this.tilingSpriteBottom.position.x = 0;
            this.tilingSpriteBottom.position.y = this.height - ((this.height - defaultHeight)*0.5);
            this.tilingSpriteTop.position.x = 0;
            this.tilingSpriteTop.position.y = 0;
        }

        this.orientationContainer.position.x = this.width*0.5;
        this.orientationContainer.position.y = this.height*0.5;

        //Pregunto si estoy en moviles y si estoy en Portrait
        if(this.isMobile.any() && window.innerHeight < window.innerWidth)
        {
            this.sceneContainer.visible = false;
            this.orientationContainer.visible = true;

            if(this.scenes[this.state].pause) this.scenes[this.state].pause();
        }
        else
        {
            this.sceneContainer.visible = true;
            this.orientationContainer.visible = false;
        }
    }
}

GAME.Engine.prototype.preload = function()
{
    var container = new PIXI.DisplayObjectContainer();
    this.sceneContainer.addChild( container );
    this.scenes.push( new GAME.LoadingScene(container, this.width, this.height) );
    this.state = GAME_MODE.LOADING;

    this.stage.mousedown = this.stage.touchstart = function (touchData)
    {
        touchData.originalEvent.preventDefault();
        gameEngine.scenes[gameEngine.state].mouseDown(touchData);
    }

    this.stage.mousemove = this.stage.touchmove = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        gameEngine.scenes[gameEngine.state].mouseMove(touchData);
    }

    this.stage.mouseup = this.stage.touchend = this.stage.mouseupoutside = this.stage.touchendoutside = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        gameEngine.scenes[gameEngine.state].mouseUp(touchData);
    }

    this.stage.rightdown = function (touchData)
    {
        touchData.originalEvent.preventDefault();
        if(gameEngine.scenes[gameEngine.state].rightDown) gameEngine.scenes[gameEngine.state].rightDown(touchData);
    }

    var textureNegro = PIXI.Texture.fromImage("Art/PatronFondo" + artSuffix + ".png");
    var cuadroNegro = new PIXI.TilingSprite(textureNegro, defaultWidth, defaultHeight);
    cuadroNegro.position.x = -defaultWidth*0.5;
    cuadroNegro.position.y = -defaultHeight*0.5;
    this.orientationContainer.addChild( cuadroNegro );

    var backgroundOrientation = PIXI.Sprite.fromImage("Art/LoadingScene/RotacionMovil" + artSuffix + ".png");
    backgroundOrientation.anchor.x = backgroundOrientation.anchor.y = 0.5;
    backgroundOrientation.position.x = backgroundOrientation.position.y = 0;
    this.orientationContainer.addChild( backgroundOrientation );

    var texture = PIXI.Texture.fromImage("Art/PatronFondo" + artSuffix + ".png");

    //Reviso si la altura de los tiling sprites son cero, fix para moviles
    if((this.width - defaultWidth)*0.5 == 0)
    {
        this.tilingSpriteLeft = new PIXI.TilingSprite(texture, 2, this.height);
        this.tilingSpriteRight = new PIXI.TilingSprite(texture, 2, this.height);
        this.tilingSpriteLeft.visible = this.tilingSpriteRight.visible = false;
    }
    else
    {
        this.tilingSpriteLeft = new PIXI.TilingSprite(texture, (this.width - defaultWidth)*0.5, this.height);
        this.tilingSpriteRight = new PIXI.TilingSprite(texture, (this.width - defaultWidth)*0.5, this.height);
        this.tilingSpriteLeft.visible = this.tilingSpriteRight.visible = true;
    }
    
    if((this.height - defaultHeight)*0.5 == 0)
    {
        this.tilingSpriteBottom = new PIXI.TilingSprite(texture, this.width, 2);
        this.tilingSpriteTop = new PIXI.TilingSprite(texture, this.width, 2);
        this.tilingSpriteBottom.visible = this.tilingSpriteTop.visible = false;
    }
    else
    {
        this.tilingSpriteBottom = new PIXI.TilingSprite(texture, this.width, (this.height - defaultHeight)*0.5);
        this.tilingSpriteTop = new PIXI.TilingSprite(texture, this.width, (this.height - defaultHeight)*0.5);
        this.tilingSpriteBottom.visible = this.tilingSpriteTop.visible = true;
    }

    this.tilingSpriteLeft.position.x = 0;
    this.tilingSpriteLeft.position.y = 0;
    this.tilingSpriteRight.position.x = this.width - ((this.width - defaultWidth)*0.5);
    this.tilingSpriteRight.position.y = 0;
    this.tilingSpriteBottom.position.x = 0;
    this.tilingSpriteBottom.position.y = this.height - ((this.height - defaultHeight)*0.5);
    this.tilingSpriteTop.position.x = 0;
    this.tilingSpriteTop.position.y = 0;

    this.blackContainer.addChild( this.tilingSpriteLeft );
    this.blackContainer.addChild( this.tilingSpriteRight );
    this.blackContainer.addChild( this.tilingSpriteBottom );
    this.blackContainer.addChild( this.tilingSpriteTop );
}

GAME.Engine.prototype.startLoading = function()
{
    this.scenes[GAME_MODE.LOADING].startLoading();
}

GAME.Engine.prototype.readyToPlay = function()
{
    var i;
    var container;
    
    for(i = 1; i < 4; i++)
    {
        container = new PIXI.DisplayObjectContainer();
        container.visible = false;
        this.sceneContainer.addChild( container );

        if(i == GAME_MODE.SPLASH)
        {
            this.scenes.push( new GAME.SplashScene(container, this.width, this.height) );
        }
        else if(i == GAME_MODE.MENU)
        {
            this.scenes.push( new GAME.MenuScene(container, this.width, this.height) );
        }
        else if(i == GAME_MODE.INGAME)
        {
            this.scenes.push( new GAME.GameScene(container, this.width, this.height) );
        }
    }

    if(!this.userStorage.isSoundsMute)
    {
        this.unmuteSounds();
        this.unmuteMusic();
    }
    else
    {
        this.muteSounds();
        this.muteMusic();
    }

    //Crear cortina
    this.wallContainer.visible = false;

    this.hamsterCortina = PIXI.Sprite.fromImage("Art/CortinaHamster" + artSuffix + ".png");
    this.hamsterCortina.anchor.x = this.hamsterCortina.anchor.y = 0.5;
    
    this.hamsterCortina.position.y = this.height*0.5;
    this.wallContainer.addChild( this.hamsterCortina );

    this.scenes[this.state].readyToPlay();
}

GAME.Engine.prototype.pause = function()
{
    if(this.scenes.length > 0)
    {
        if(this.scenes[this.state].pause) this.scenes[this.state].pause();
    }
}

GAME.Engine.prototype.unpause = function()
{
}

GAME.Engine.prototype.muteSounds = function()
{
    Howler.mute(true);
}

GAME.Engine.prototype.unmuteSounds = function()
{
    Howler.mute(false);
}

GAME.Engine.prototype.muteMusic = function()
{
    Howler.mute(true);
}

GAME.Engine.prototype.unmuteMusic = function()
{
    Howler.mute(false);
}

GAME.Engine.prototype.endTranstition = function()
{
    this.wallContainer.visible = false;
    this.inTransition = false;
    this.sideEffect = !this.sideEffect;
}

GAME.Engine.prototype.startTransitionScene = function(game_mode)
{
    if(this.scenes[game_mode].onEnter)
    {
        this.scenes[game_mode].onEnter();
    }
    this.scenes[game_mode].resize(this.width, this.height);
    this.scenes[game_mode].container.visible = true;
    if(this.state != game_mode)
    {
        this.scenes[this.state].container.visible = false;
        this.state = game_mode;
    }
}

GAME.Engine.prototype.transitionScene = function(game_mode)
{
    if(this.sideEffect) TweenLite.to(this.hamsterCortina.position, 0.7, {x:this.width*0.5 + defaultWidth*0.5 + this.hamsterCortina.width*0.5,ease:Sine.easeOut,onStartScope:this,onStart:this.startTransitionScene,onStartParams:[game_mode],onCompleteScope:this,onComplete:this.endTranstition,overwrite:"all"});
    else TweenLite.to(this.hamsterCortina.position, 0.7, {x:this.width*0.5 - defaultWidth*0.5 - this.hamsterCortina.width*0.5,ease:Sine.easeOut,onStartScope:this,onStart:this.startTransitionScene,onStartParams:[game_mode],onCompleteScope:this,onComplete:this.endTranstition,overwrite:"all"});
}

GAME.Engine.prototype.changeSceneTo = function(game_mode)
{
    if(!this.inTransition)
    {
        this.inTransition = true;

        if(this.sideEffect) this.hamsterCortina.position.x = this.width*0.5 - defaultWidth*0.5 - this.hamsterCortina.width*0.5;
        else this.hamsterCortina.position.x = this.width*0.5 + defaultWidth*0.5 + this.hamsterCortina.width*0.5;

        this.wallContainer.visible = true;

        TweenLite.to(this.hamsterCortina.position, 0.7, {x:this.width*0.5,ease:Sine.easeIn,onCompleteScope:this,onCompleteParams:[game_mode],onComplete:this.transitionScene,overwrite:"all"});

        sounds.play('transition');
    }
}

GAME.Engine.prototype.update = function(dt)
{
   if(this.scenes[this.state].update) this.scenes[this.state].update(dt);
}
