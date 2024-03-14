var PAUSE_STATE = {HIDE:0, SHOW:1};

var GAME = GAME || {};

GAME.PauseHUD = function(container)
{
    this.container = container;

    var textureNegro = PIXI.Texture.fromImage("Art/MenuScene/CuadroNegro" + artSuffix + ".png");
    this.cuadroNegro = new PIXI.TilingSprite(textureNegro, defaultWidth, defaultHeight);
    this.cuadroNegro.alpha = 0.8;
    this.cuadroNegro.position.x = 0;
    this.cuadroNegro.position.y = 0;

    this.cuadroNegro.visible = false;

    this.container.addChild( this.cuadroNegro );

    this.buttonsContainer =  new PIXI.DisplayObjectContainer();
    this.buttonsContainer.visible = false;
    this.container.addChild( this.buttonsContainer );

    this.title = new PIXI.BitmapText(_("Paused"), {font: "GameScene_LevelFont", align: "left"});
    this.title.position.x = defaultWidth*0.5 - this.title.textWidth*0.5;
    this.title.position.y = defaultWidth*0.4;
    this.buttonsContainer.addChild( this.title );

    var home = PIXI.Sprite.fromFrame("PauseScene_BotonHome.png");
    home.anchor.x = home.anchor.y = 0.5;
    home.scale.x = home.scale.y = 0.9;
    home.position.x = defaultWidth*0.2;
    home.position.y = defaultHeight*0.52;
    this.buttonsContainer.addChild( home );

    home.interactive = true;
    home.buttonMode = true;
    home.mousedown = function (touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("PauseScene_BotonHomeHold.png"));
    }

    home.touchstart = function (touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("PauseScene_BotonHomeHold.png"));
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        sounds.play('explode_bubble');
        TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    home.mouseup = home.touchend = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        if(gameEngine.scenes[GAME_MODE.INGAME].gameHUD.score > gameEngine.userStorage.score)
        {
            //submit the player's score
            //gameEngine.apiInstance.Score.submit(Math.floor(gameEngine.scenes[GAME_MODE.INGAME].gameHUD.score));
			console.log('Score.submit' + Math.floor(gameEngine.scenes[GAME_MODE.INGAME].gameHUD.score));

            gameEngine.userStorage.score = Math.floor(gameEngine.scenes[GAME_MODE.INGAME].gameHUD.score);
            gameEngine.userStorage.save();
        }

        //gameEngine.apiInstance.GameBreak.request(fnPause, fnResume);

        gameMusic.stop();limitMusic.stop();
        menuMusic.stop();menuMusic.play();
        sounds.play('ok_accept');
        gameEngine.changeSceneTo(GAME_MODE.MENU);
        this.setTexture(PIXI.Texture.fromFrame("PauseScene_BotonHome.png"));
        TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }

    home.mouseover = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        sounds.play('explode_bubble');
        TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    home.mouseout = home.touchendoutside = home.mouseupoutside = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("PauseScene_BotonHome.png"));
        TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }

    if(!gameEngine.userStorage.isSoundsMute)
    {
        this.soundsButton = PIXI.Sprite.fromFrame("PauseScene_SoundOn.png");
    }
    else
    {
        this.soundsButton = PIXI.Sprite.fromFrame("PauseScene_SoundOff.png");
    }
    this.soundsButton.anchor.x = this.soundsButton.anchor.y = 0.5;
    this.soundsButton.scale.x = this.soundsButton.scale.y = 0.9;
    this.soundsButton.position.x = defaultWidth*0.5;
    this.soundsButton.position.y = defaultHeight*0.52;
    this.buttonsContainer.addChild( this.soundsButton );

    this.soundsButton.interactive = true;
    this.soundsButton.buttonMode = true;

    this.soundsButton.touchstart = function (touchData)
    {
        touchData.originalEvent.preventDefault();
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        sounds.play('explode_bubble');
        TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    this.soundsButton.mouseup = this.soundsButton.touchend = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        if(!gameEngine.userStorage.isSoundsMute)
        {
            gameEngine.userStorage.isSoundsMute = true;
            gameEngine.userStorage.isMusicMute = true;
            gameEngine.userStorage.save();
            gameEngine.muteSounds();
            gameEngine.muteMusic();
            this.setTexture(PIXI.Texture.fromFrame("PauseScene_SoundOff.png"));
        }
        else
        {
            gameEngine.userStorage.isSoundsMute = false;
            gameEngine.userStorage.isMusicMute = false;
            gameEngine.userStorage.save();
            gameEngine.unmuteSounds();
            gameEngine.unmuteMusic();
            sounds.play('ok_accept');
            this.setTexture(PIXI.Texture.fromFrame("PauseScene_SoundOn.png"));
        }
        TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }

    this.soundsButton.mouseover = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        sounds.play('explode_bubble');
        TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    this.soundsButton.mouseout = this.soundsButton.touchendoutside = this.soundsButton.mouseupoutside = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }

    var resume = PIXI.Sprite.fromFrame("PauseScene_BotonResume.png");
    resume.anchor.x = resume.anchor.y = 0.5;
    resume.scale.x = resume.scale.y = 0.9;
    resume.position.x = defaultWidth*0.8;
    resume.position.y = defaultHeight*0.52;
    this.buttonsContainer.addChild( resume );

    resume.interactive = true;
    resume.buttonMode = true;
    resume.mousedown = function (touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("PauseScene_BotonResumeHold.png"));
    }

    resume.touchstart = function (touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("PauseScene_BotonResumeHold.png"));
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        sounds.play('explode_bubble');
        TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    resume.mouseup = resume.touchend = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        sounds.play('ok_accept');
        gameEngine.scenes[GAME_MODE.INGAME].unpause();
        this.setTexture(PIXI.Texture.fromFrame("PauseScene_BotonResume.png"));
        TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }

    resume.mouseover = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        sounds.play('explode_bubble');
        TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    resume.mouseout = resume.touchendoutside = resume.mouseupoutside = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("PauseScene_BotonResume.png"));
        TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }

    this.init();    
}

// constructor
GAME.PauseHUD.constructor = GAME.PauseHUD;

GAME.PauseHUD.prototype.init = function()
{
    if(!gameEngine.userStorage.isSoundsMute)
    {
        this.soundsButton.setTexture(PIXI.Texture.fromFrame("PauseScene_SoundOn.png"));
    }
    else
    {
        this.soundsButton.setTexture(PIXI.Texture.fromFrame("PauseScene_SoundOff.png"));
    }

    this.hide();
    this.state = PAUSE_STATE.HIDE;
}

GAME.PauseHUD.prototype.show = function()
{
    this.cuadroNegro.alpha = 0;
    this.cuadroNegro.visible = true;
    TweenLite.to(this.cuadroNegro, 0.2, {alpha:0.8,ease:Sine.easeInOut,overwrite:"all"});

    this.buttonsContainer.position.x = 0;
    this.buttonsContainer.position.y = -defaultHeight;
    this.buttonsContainer.visible = true;
    TweenLite.to(this.buttonsContainer.position, 0.3, {y:0,delay:0.1,ease:Circ.easeOut,overwrite:"all"});
}

GAME.PauseHUD.prototype.hide = function()
{
    this.cuadroNegro.visible = false;
    this.buttonsContainer.visible = false;
}

GAME.PauseHUD.prototype.update = function(dt)
{
    
}
