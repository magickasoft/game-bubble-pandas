var LOADING_STATE = {PRELOAD:0, LOADING:1, READY:2};

var GAME = GAME || {};

GAME.LoadingScene = function(container, width, height)
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

    this.loadingCircle = new PIXI.Sprite.fromImage("Art/LoadingScene/CirculoCarga" + artSuffix + ".png");
    this.loadingCircle.anchor.x = this.loadingCircle.anchor.y = 0.5;
    this.loadingCircle.position.x = 0;
    this.loadingCircle.position.y = 0;
    this.innerContainer.addChild( this.loadingCircle );

    // Retrieves the logo from Spil
    /*var logoData = gameEngine.apiInstance.Branding.getLogo();
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

    this.timeElapsed = 0.0;

    this.state = LOADING_STATE.PRELOAD;
}

// constructor
GAME.LoadingScene.constructor = GAME.LoadingScene;

GAME.LoadingScene.prototype.resize = function(width, height)
{
    this.width = width;
    this.height = height;

    this.innerContainer.position.x = this.width*0.5;
    this.innerContainer.position.y = this.height*0.5;
}

GAME.LoadingScene.prototype.startLoading = function()
{
    this.logo = PIXI.Sprite.fromFrame("LoadingScene_Logo.png");
    this.logo.anchor.x = this.logo.anchor.y = 0.5;
    this.logo.position.x = 0;
    this.logo.position.y = -defaultHeight*0.09;
    this.innerContainer.addChild( this.logo );

    this.loadingBarBackground = PIXI.Sprite.fromFrame("LoadingScene_LoadingBar.png");
    this.loadingBarBackground.anchor.x = this.loadingBarBackground.anchor.y = 0.5;
    this.loadingBarBackground.position.x = 0;
    this.loadingBarBackground.position.y = defaultHeight*0.07;
    this.innerContainer.addChild( this.loadingBarBackground );

    this.loadingBar = PIXI.Sprite.fromFrame("LoadingScene_GreenBar.png");
    this.loadingBar.anchor.x = 0;
    this.loadingBar.anchor.y = 0.5;
    this.loadingBar.position.x = this.loadingBarBackground.position.x - this.loadingBar.width*0.5;
    this.loadingBar.position.y = this.loadingBarBackground.position.y;
    this.loadingBar.scale.x = 0;
    this.innerContainer.addChild( this.loadingBar );

    this.playit = PIXI.Sprite.fromFrame("LoadingScene_PlayItOn.png");
    this.playit.anchor.x = this.playit.anchor.y = 0.5;
    this.playit.position.x = 0;
    this.playit.position.y = -defaultHeight*0.4;
    this.playit.scale.x = this.playit.scale.y = 0.8;
    this.innerContainer.addChild( this.playit );

    this.state = LOADING_STATE.LOADING;

    this.loadingCircle.position.x = 0;
    this.loadingCircle.position.y = defaultHeight*0.3;
}

GAME.LoadingScene.prototype.setFactor = function(factor)
{
    this.loadingBar.scale.x = factor;
}

GAME.LoadingScene.prototype.appearQuestion = function()
{
    var questionText = new PIXI.BitmapText(_("Please choose your preference") + ":", {font: "LoadingScene_FontWhite", align: "left"});
    questionText.position.x = -questionText.textWidth*0.5;
    questionText.position.y = -defaultHeight*0.2 - questionText.textHeight;
    questionText.alpha = 0.0;
    this.innerContainer.addChild( questionText );

    TweenLite.to(questionText, 0.5, {alpha:1.0,ease:Sine.easeOut,onCompleteScope:this,onComplete:this.appearOption});
}

GAME.LoadingScene.prototype.appearOption = function()
{
    var playContainer =  new PIXI.DisplayObjectContainer();
    playContainer.position.x = 0;
    playContainer.position.y = defaultHeight*0.3;
    playContainer.scale.x = playContainer.scale.y = 0.9;
    playContainer.alpha = 0.0;
    this.innerContainer.addChild( playContainer );

    var play = PIXI.Sprite.fromFrame("LoadingScene_BestEffects.png");
    play.anchor.x = play.anchor.y = 0.5;
    play.position.x = play.position.y = 0;
    playContainer.addChild( play );

    play.interactive = play.buttonMode = true;
    play.mousedown = function (touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("LoadingScene_BestEffects.png"));
    }

    play.touchstart = function (touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("LoadingScene_BestEffects.png"));
        sounds.play('explode_bubble');
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        //TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.parent.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    play.mouseup = play.touchend = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        sounds.play('ok_accept');
        menuMusic.stop();menuMusic.play();
        gameEngine.userStorage.showEffects = true;
        gameEngine.changeSceneTo(GAME_MODE.SPLASH);
        this.setTexture(PIXI.Texture.fromFrame("LoadingScene_BestEffects.png"));
        //TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.parent.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }

    play.mouseover = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        sounds.play('explode_bubble');
        //TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.parent.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    play.mouseout = play.touchendoutside = play.mouseupoutside = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("LoadingScene_BestEffects.png"));
        //TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.parent.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }

    var playText = new PIXI.BitmapText(_("Best effects"), {font: "LoadingScene_FontBlack", align: "left"});
    playText.position.x = play.width*0.16 - playText.textWidth*0.5;
    playText.position.y = -playText.textHeight*0.52;
    playContainer.addChild( playText );

    TweenLite.to(playContainer, 0.5, {alpha:1.0,ease:Sine.easeOut});

    var playPerformanceContainer =  new PIXI.DisplayObjectContainer();
    playPerformanceContainer.position.x = 0;
    playPerformanceContainer.position.y = 0;
    playPerformanceContainer.scale.x = playPerformanceContainer.scale.y = 0.9;
    playPerformanceContainer.alpha = 0.0;
    this.innerContainer.addChild( playPerformanceContainer );

    var playPerformance = PIXI.Sprite.fromFrame("LoadingScene_BestPerfomance.png");
    playPerformance.anchor.x = playPerformance.anchor.y = 0.5;
    playPerformance.position.x = playPerformance.position.y = 0;
    playPerformanceContainer.addChild( playPerformance );

    playPerformance.interactive = playPerformance.buttonMode = true;
    playPerformance.mousedown = function (touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("LoadingScene_BestPerfomance.png"));
    }

    playPerformance.touchstart = function (touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("LoadingScene_BestPerfomance.png"));
        sounds.play('explode_bubble');
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        //TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.parent.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    playPerformance.mouseup = playPerformance.touchend = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        sounds.play('ok_accept');
        menuMusic.stop();menuMusic.play();
        gameEngine.userStorage.showEffects = false;
        gameEngine.changeSceneTo(GAME_MODE.SPLASH);
        this.setTexture(PIXI.Texture.fromFrame("LoadingScene_BestPerfomance.png"));
        //TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.parent.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }

    playPerformance.mouseover = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        sounds.play('explode_bubble');
        //TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.parent.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    playPerformance.mouseout = playPerformance.touchendoutside = playPerformance.mouseupoutside = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("LoadingScene_BestPerfomance.png"));
        //TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.parent.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }

    var playPerformanceText = new PIXI.BitmapText(_("Best performance"), {font: "LoadingScene_FontBlack", align: "left"});
    playPerformanceText.position.x = play.width*0.16 - playPerformanceText.textWidth*0.5;
    playPerformanceText.position.y = -playPerformanceText.textHeight*0.52;
    playPerformanceContainer.addChild( playPerformanceText );

    TweenLite.to(playPerformanceContainer, 0.5, {alpha:1.0,ease:Sine.easeOut});
}

GAME.LoadingScene.prototype.readyToPlay = function()
{
    if(gameEngine.isMobile.any())
    {
        TweenLite.to(this.loadingBar, 0.3, {alpha:0,ease:Sine.easeOut,overwrite:"all"});
        TweenLite.to(this.loadingBarBackground, 0.3, {alpha:0,ease:Sine.easeOut,overwrite:"all"});
        TweenLite.to(this.logo, 0.3, {alpha:0,ease:Sine.easeOut,overwrite:"all"});
        TweenLite.to(this.loadingCircle, 0.3, {alpha:0,ease:Sine.easeOut,overwrite:"all",onCompleteScope:this,onComplete:this.appearQuestion});
    }
    else
    {
        var play = PIXI.Sprite.fromFrame("MenuScene_Play.png");
        play.anchor.x = play.anchor.y = 0.5;
        play.scale.x = play.scale.y = 0.5;
        play.position.x = 0;
        play.position.y = defaultHeight*0.3;
        this.innerContainer.addChild( play );

        this.loadingCircle.visible = false;

        TweenLite.to(play.scale, 1, {x:0.9,y:0.9,ease:Elastic.easeOut});

        play.interactive = true;
        play.buttonMode = true;
        play.mousedown = function (touchData)
        {
            touchData.originalEvent.preventDefault();
            this.setTexture(PIXI.Texture.fromFrame("MenuScene_PlayHold.png"));
        }

        play.touchstart = function (touchData)
        {
            touchData.originalEvent.preventDefault();
            this.setTexture(PIXI.Texture.fromFrame("MenuScene_PlayHold.png"));
            sounds.play('explode_bubble');
            var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
            TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
            TweenLite.to(this.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
        }

        play.mouseup = play.touchend = function(touchData)
        {
            touchData.originalEvent.preventDefault();
            sounds.play('ok_accept');
            menuMusic.stop();menuMusic.play();
            gameEngine.changeSceneTo(GAME_MODE.SPLASH);
            this.setTexture(PIXI.Texture.fromFrame("MenuScene_Play.png"));
            TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
            TweenLite.to(this.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
        }

        play.mouseover = function(touchData)
        {
            touchData.originalEvent.preventDefault();
            var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
            sounds.play('explode_bubble');
            TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
            TweenLite.to(this.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
        }

        play.mouseout = play.touchendoutside = play.mouseupoutside = function(touchData)
        {
            touchData.originalEvent.preventDefault();
            this.setTexture(PIXI.Texture.fromFrame("MenuScene_Play.png"));
            TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
            TweenLite.to(this.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
        }
    }

    if(gameEngine.userStorage.isMusicMute)
    {
        gameEngine.muteMusic();
    }
    else
    {
        gameEngine.unmuteMusic();
    }

    if(gameEngine.userStorage.isSoundsMute)
    {
        gameEngine.muteSounds();
    }
    else
    {
        gameEngine.unmuteSounds();
    }

    this.state = LOADING_STATE.READY;
}

GAME.LoadingScene.prototype.mouseDown = function(mouseData)
{
}

GAME.LoadingScene.prototype.mouseMove = function(mouseData)
{
}

GAME.LoadingScene.prototype.mouseUp = function(mouseData)
{
}

GAME.LoadingScene.prototype.update = function(dt)
{
    this.timeElapsed += dt;

    this.loadingCircle.rotation += 2*Math.PI * dt;
}
