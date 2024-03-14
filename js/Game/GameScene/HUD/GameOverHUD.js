var GAMEOVER_STATE = {HIDE:0, SHOW:1};

var GAME = GAME || {};

GAME.GameOverHUD = function(container)
{
    this.container = container;

    var textureNegro = PIXI.Texture.fromImage("Art/MenuScene/CuadroNegro" + artSuffix + ".png");
    this.cuadroNegro = new PIXI.TilingSprite(textureNegro, defaultWidth, defaultHeight);
    this.cuadroNegro.alpha = 0.0;
    this.cuadroNegro.position.x = 0;
    this.cuadroNegro.position.y = 0;

    this.cuadroNegro.visible = false;

    this.container.addChild( this.cuadroNegro );

    this.buttonsContainer =  new PIXI.DisplayObjectContainer();
    this.buttonsContainer.visible = false;
    this.container.addChild( this.buttonsContainer );

    this.title = new PIXI.BitmapText(_("Game Over"), {font: "GameScene_FuenteRoja", align: "left"});
    this.title.position.x = defaultWidth*0.5 - this.title.textWidth*0.5;
    this.title.position.y = defaultHeight*0.16;
    this.buttonsContainer.addChild( this.title );

    this.box = PIXI.Sprite.fromFrame("PauseScene_CuadroGameOver.png");
    this.box.anchor.x = this.box.anchor.y = 0.5;
    this.box.position.x = defaultWidth*0.5;
    this.box.position.y = defaultHeight*0.63;
    this.buttonsContainer.addChild( this.box );

    this.scoreLabelText = new PIXI.BitmapText(_("Score") + ":", {font: "GameScene_FuenteBlanca", align: "left"});
    this.scoreLabelText.position.x = this.box.position.x - this.box.width*0.1 - this.scoreLabelText.textWidth;
    this.scoreLabelText.position.y = this.box.position.y - this.box.height*0.25;
    this.buttonsContainer.addChild( this.scoreLabelText );

    this.bestLabelText = new PIXI.BitmapText(_("Best") + ":", {font: "GameScene_FuenteBlanca", align: "left"});
    this.bestLabelText.position.x = this.box.position.x - this.box.width*0.1 - this.bestLabelText.textWidth;
    this.bestLabelText.position.y = this.box.position.y + this.box.height*0.03;
    this.buttonsContainer.addChild( this.bestLabelText );

    this.scoreText = new PIXI.BitmapText("0", {font: "GameScene_FuenteBlanca", align: "left"});
    this.scoreText.position.x = this.box.position.x - this.box.width*0.4 + this.scoreText.textWidth;
    this.scoreText.position.y = this.box.position.y - this.box.height*0.25;
    this.buttonsContainer.addChild( this.scoreText );

    this.bestText = new PIXI.BitmapText("0", {font: "GameScene_FuenteBlanca", align: "left"});
    this.bestText.position.x = this.box.position.x - this.box.width*0.4 + this.bestText.textWidth;
    this.bestText.position.y = this.box.position.y + this.box.height*0.03;
    this.buttonsContainer.addChild( this.bestText );

    var home = PIXI.Sprite.fromFrame("PauseScene_BotonHome.png");
    home.anchor.x = home.anchor.y = 0.5;
    home.scale.x = home.scale.y = 0.9;
    home.position.x = defaultWidth*0.2;
    home.position.y = defaultHeight*0.38;
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
        gameoverMusic.stop();
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
    this.soundsButton.position.y = defaultHeight*0.38;
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

    var retry = PIXI.Sprite.fromFrame("PauseScene_BotonRestart.png");
    retry.anchor.x = retry.anchor.y = 0.5;
    retry.scale.x = retry.scale.y = 0.9;
    retry.position.x = defaultWidth*0.8;
    retry.position.y = defaultHeight*0.38;
    this.buttonsContainer.addChild( retry );

    retry.interactive = true;
    retry.buttonMode = true;
    retry.mousedown = function (touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("PauseScene_BotonRestartHold.png"));
    }

    retry.touchstart = function (touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("PauseScene_BotonRestart.png"));
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        sounds.play('explode_bubble');
        TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    retry.mouseup = retry.touchend = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        sounds.play('ok_accept');
        gameEngine.changeSceneTo(GAME_MODE.INGAME);
        this.setTexture(PIXI.Texture.fromFrame("PauseScene_BotonRestart.png"));
        TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }

    retry.mouseover = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        sounds.play('explode_bubble');
        TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    retry.mouseout = retry.touchendoutside = retry.mouseupoutside = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("PauseScene_BotonRestart.png"));
        TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }

    this.init();    
}

// constructor
GAME.GameOverHUD.constructor = GAME.GameOverHUD;

GAME.GameOverHUD.prototype.init = function()
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

GAME.GameOverHUD.prototype.show = function(score)
{
    score = Math.floor(score);
    this.cuadroNegro.alpha = 0;
    this.cuadroNegro.visible = true;
    TweenLite.to(this.cuadroNegro, 0.2, {alpha:0.6,ease:Sine.easeInOut,overwrite:"all"});

    this.buttonsContainer.position.x = 0;
    this.buttonsContainer.position.y = -defaultHeight;
    this.buttonsContainer.visible = true;
    TweenLite.to(this.buttonsContainer.position, 0.3, {y:0,delay:0.1,ease:Circ.easeOut,overwrite:"all"});

    var best = Math.floor(gameEngine.userStorage.score);
    if(score > best)
    {
        //submit the player's score
       //gameEngine.apiInstance.Score.submit(score);
	   console.log('Score.submit'+score);

        best = score;
        gameEngine.userStorage.score = best;
        gameEngine.userStorage.save();
    }

    this.scoreText.setText("" + score);
    this.scoreText.updateTransform();
    this.scoreText.position.x = this.box.position.x - this.box.width*0.07;

    this.bestText.setText("" + best);
    this.bestText.updateTransform();
    this.bestText.position.x = this.box.position.x - this.box.width*0.07;
}

GAME.GameOverHUD.prototype.hide = function()
{
    this.cuadroNegro.visible = false;
    this.buttonsContainer.visible = false;
}

GAME.GameOverHUD.prototype.update = function(dt)
{
    
}
