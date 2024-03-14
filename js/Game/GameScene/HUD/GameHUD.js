var GAMEHUD_STATE = {HIDE:0,SHOW:2};

var GAME = GAME || {};

GAME.GameHUD = function(container)
{
    this.container = container;

    //HITS
    this.hitsText = new PIXI.BitmapText("4 " + _("Hits"), {font: "GameScene_Hits", align: "left"});
    this.hitsText.position.x = defaultWidth*0.29 - this.hitsText.textWidth*0.5;
    this.hitsText.position.y = defaultHeight*0.72 - this.hitsText.textHeight*0.5;
    this.hitsText.alpha = 0.0;
    this.container.addChild( this.hitsText );

    this.cruzHits = PIXI.Sprite.fromFrame("GameScene_CruzHit.png");
    this.cruzHits.anchor.x = this.cruzHits.anchor.y = 0.5;
    this.cruzHits.position.x = defaultWidth*0.29;
    this.cruzHits.position.y = defaultHeight*0.72 - this.hitsText.textHeight*0.2;
    this.cruzHits.alpha = 0.0;
    this.container.addChild( this.cruzHits );

    //Bonus TEXT
    this.bonusText = new PIXI.BitmapText(_("Bonus") + "", {font: "GameScene_BonusFont", align: "left"});
    this.bonusText.position.x = defaultWidth*0.5 - this.bonusText.textWidth*0.5;
    this.bonusText.position.y = defaultHeight*0.5 - this.bonusText.textHeight;
    this.bonusText.alpha = 0.0;
    this.container.addChild( this.bonusText );

    this.bonusScoreText = new PIXI.BitmapText("+0", {font: "GameScene_BonusFont", align: "left"});
    this.bonusScoreText.position.x = defaultWidth*0.5 - this.bonusScoreText.textWidth*0.5;
    this.bonusScoreText.position.y = defaultHeight*0.5;
    this.bonusScoreText.alpha = 0.0;
    this.container.addChild( this.bonusScoreText );

    this.barraPoderBackground = PIXI.Sprite.fromFrame("PauseScene_BarraPoder.png");
    this.barraPoderBackground.anchor.x = 0;
    this.barraPoderBackground.anchor.y = 0.5;
    this.barraPoderBackground.position.x = 0;
    this.barraPoderBackground.position.y = this.barraPoderBackground.height*0.5;
    this.barraPoderBackground.alpha = 0.5;
    this.container.addChild( this.barraPoderBackground );

    this.barraPoder = PIXI.Sprite.fromFrame("PauseScene_BarraPoder.png");
    this.barraPoder.anchor.x = 0;
    this.barraPoder.anchor.y = 0.5;
    this.barraPoder.position.x = 0;
    this.barraPoder.position.y = this.barraPoder.height*0.5;
    this.barraPoder.scale.x = 0;
    this.container.addChild( this.barraPoder );

    this.scoreText = new PIXI.BitmapText("0 / 10000", {font: "GameScene_Nivel", align: "left"});
    this.scoreText.position.x = this.barraPoderBackground.position.x + this.barraPoderBackground.width*0.5 - this.scoreText.textWidth*0.5;
    this.scoreText.position.y = this.barraPoderBackground.position.y - this.barraPoderBackground.height*0.5;
    this.container.addChild( this.scoreText );

    this.pauseButton = PIXI.Sprite.fromFrame("GameScene_BotonPause.png");
    this.pauseButton.anchor.x = this.pauseButton.anchor.y = 0.5;
    this.pauseButton.position.x = defaultWidth - this.pauseButton.width*0.5 - defaultWidth*0.01;
    this.pauseButton.position.y = defaultHeight - this.pauseButton.height*0.5;
    this.pauseButton.scale.x = this.pauseButton.scale.y = 0.9;
    this.container.addChild( this.pauseButton );

    this.pauseButton.interactive = true;
    this.pauseButton.buttonMode = true;
    this.pauseButton.mousedown = function (touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("GameScene_BotonPauseHold.png"));
    }

    this.pauseButton.touchstart = function (touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("GameScene_BotonPauseHold.png"));
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        sounds.play('explode_bubble');
        TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    this.pauseButton.mouseup = this.pauseButton.touchend = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        sounds.play('ok_accept');
        gameEngine.scenes[GAME_MODE.INGAME].pause();
        this.setTexture(PIXI.Texture.fromFrame("GameScene_BotonPause.png"));
        TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }

    this.pauseButton.mouseover = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        sounds.play('explode_bubble');
        TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    this.pauseButton.mouseout = this.pauseButton.touchendoutside = this.pauseButton.mouseupoutside = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("GameScene_BotonPause.png"));
        TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }

    this.levelText = new PIXI.BitmapText(_("Level") + " 1", {font: "GameScene_NumerosPuntaje", align: "left"});
    this.levelText.position.x = defaultWidth*0.01;
    this.levelText.position.y = defaultHeight - this.levelText.textHeight*0.8;
    this.container.addChild( this.levelText );

    //Barra que aparece al avanzar de nivel
    this.nivelContainer = new PIXI.DisplayObjectContainer();
    this.nivelContainer.visible = false;
    this.container.addChild( this.nivelContainer );

    this.barraNivel = PIXI.Sprite.fromFrame("GameScene_BarraNivel.png");
    this.barraNivel.anchor.x = this.barraNivel.anchor.y = 0.5;
    this.barraNivel.position.x = defaultWidth * 0.5;
    this.barraNivel.position.y = defaultHeight * 0.5;
    this.barraNivel.alpha = 0.3;
    this.nivelContainer.addChild( this.barraNivel );

    this.nivelText = new PIXI.BitmapText(_("Level") + " 1", {font: "GameScene_LevelFont", align: "left"});
    this.nivelText.position.x = defaultWidth*0.5 - this.nivelText.textWidth*0.5;
    this.nivelText.position.y = defaultHeight*0.5 - this.nivelText.textHeight*0.5;
    this.nivelContainer.addChild( this.nivelText );

    //Ready - go
    var textureNegro = PIXI.Texture.fromImage("Art/MenuScene/CuadroNegro" + artSuffix + ".png");
    this.cuadroNegro = new PIXI.TilingSprite(textureNegro, defaultWidth, defaultHeight);
    this.cuadroNegro.alpha = 0.0;
    this.cuadroNegro.position.x = 0;
    this.cuadroNegro.position.y = 0;
    this.container.addChild( this.cuadroNegro );

    this.readyText = new PIXI.BitmapText(_("Ready"), {font: "GameScene_BonusFont", align: "left"});
    this.readyText.position.x = defaultWidth*0.5 - this.readyText.textWidth*0.5;
    this.readyText.position.y = defaultHeight*0.5 - this.readyText.textHeight*0.5;
    this.readyText.alpha = 0.0;
    this.container.addChild( this.readyText );

    //this.init();
}

// constructor
GAME.GameHUD.constructor = GAME.GameHUD;

GAME.GameHUD.prototype.init = function()
{
    this.pauseButton.interactive = this.pauseButton.buttonMode = true;

    if(typeof gameEngine.scenes[GAME_MODE.INGAME] !== 'undefined') this.scoreText.setText("0 / " + gameEngine.scenes[GAME_MODE.INGAME].levelManager.scoreNeeded());
    this.scoreText.updateTransform();
    this.scoreText.position.x = this.barraPoderBackground.position.x + this.barraPoderBackground.width*0.5 - this.scoreText.textWidth*0.5;
    this.scoreText.position.y = this.barraPoderBackground.position.y - this.barraPoderBackground.height*0.5;

    if(typeof gameEngine.scenes[GAME_MODE.INGAME] !== 'undefined') this.levelText.setText(_("Level") + " " + gameEngine.scenes[GAME_MODE.INGAME].levelManager.level);
    this.levelText.updateTransform();
    this.levelText.position.x = defaultWidth*0.01;
    this.levelText.position.y = defaultHeight - this.levelText.textHeight*0.8;

    this.readyText.alpha = 0.0;
    this.cuadroNegro.alpha = 0.7;

    this.velocityScore = 0;
    this.velocityBarra = 0;

    this.hitsText.alpha = 0.0;
    this.cruzHits.alpha = 0.0;

    this.barraPoder.scale.x = 0;

    this.score = 0;
    this.scoreTemp = 0;
    this.barraScore = 0;

    this.baseScore = 0;
}

GAME.GameHUD.prototype.showReady = function()
{
    this.readyText.setText(_("Ready"));
    this.readyText.updateTransform();
    this.readyText.position.x = defaultWidth*0.5 - this.readyText.textWidth*0.5;
    this.readyText.position.y = defaultHeight*0.5 - this.readyText.textHeight*0.5;
    this.readyText.alpha = 1.0;

    sounds.play('ready');
}

GAME.GameHUD.prototype.showGo = function()
{
    this.readyText.setText(_("Go!"));
    this.readyText.updateTransform();
    this.readyText.position.x = defaultWidth*0.5 - this.readyText.textWidth*0.5;
    this.readyText.position.y = defaultHeight*0.5 - this.readyText.textHeight*0.5;
    this.readyText.alpha = 1.0;
    TweenLite.to(this.readyText, 1.5, {alpha:0.0,ease:Sine.easeInOut,overwrite:"all"});
    TweenLite.to(this.cuadroNegro, 0.5, {alpha:0.0,ease:Sine.easeInOut,overwrite:"all"});

    sounds.play('go');
}

GAME.GameHUD.prototype.disablePause = function()
{
    this.pauseButton.interactive = this.pauseButton.buttonMode = false;
}

GAME.GameHUD.prototype.enablePause = function()
{
    this.pauseButton.interactive = this.pauseButton.buttonMode = true;
}

GAME.GameHUD.prototype.scoreUpdated = function(score,addToBar)
{
    this.scoreTemp = this.score;
    this.score += score;
    this.velocityScore = ((score + this.scoreTemp) - this.scoreTemp) / 0.3;
    this.finalScore = (score + this.scoreTemp);

    if(addToBar)
    {
        this.barraScore += score;

        var x1 = 0;
        var y1 = 0;
        var x2 = gameEngine.scenes[GAME_MODE.INGAME].levelManager.scoreNeeded();
        var y2 = 1.0;
        this.finalBarra = Math.min(y2,Math.max(y1,(((y2 - y1) / (x2 - x1)) * (this.barraScore - x1)) + y1));
        this.velocityBarra = Math.abs((this.finalBarra - this.barraPoder.scale.x) / 0.3);

        if(this.finalBarra >= 1.0)
        {
            gameEngine.scenes[GAME_MODE.INGAME].bubbleManager.bubbleSpecialAppear = true;
        }
    }
}

GAME.GameHUD.prototype.resetBar = function()
{
    this.barraScore = 0;
    this.barraPoder.scale.x = 0;
    this.velocityBarra = 0.0;

    this.baseScore = this.score;
}

GAME.GameHUD.prototype.isTouchingPause = function(location)
{
    if(location.x <= this.pauseButton.position.x + this.pauseButton.width*0.5 && location.x >= this.pauseButton.position.x - this.pauseButton.width*0.5 && location.y <= this.pauseButton.position.y + this.pauseButton.height*0.5 && location.y >= this.pauseButton.position.y - this.pauseButton.height*0.5)
    {
        return true;
    }
    return false;
}

GAME.GameHUD.prototype.hitsShow = function(hits,isMatchBreak)
{
    if(isMatchBreak)
    {
        this.hitsText.alpha = 0;
        this.hitsText.setText(hits + " " + _("Hits"));
        this.hitsText.updateTransform();

        this.hitsText.position.x = defaultWidth*0.29 - this.hitsText.textWidth*0.5;
        this.hitsText.position.y = defaultHeight*0.72;

        TweenLite.to(this.hitsText, 0.1, {alpha:1.0,ease:Sine.easeOut,overwrite:"all"});
        TweenLite.to(this.hitsText.position, 0.1, {y:defaultHeight*0.72-this.hitsText.textHeight*0.5,ease:Sine.easeOut,overwrite:"all",onCompleteScope:this,onComplete:this.hideHits});

        this.cruzHits.alpha = 0.0;
        this.cruzHits.scale.x = this.cruzHits.scale.y = 2.0;
        TweenLite.to(this.cruzHits, 0.5, {alpha:1.0,ease:Sine.easeOut,overwrite:"all"});
        TweenLite.to(this.cruzHits.scale, 0.5, {x:1.0,y:1.0,ease:Bounce.easeOut,overwrite:"all",onCompleteScope:this,onComplete:this.hideCruz});
    }
    else
    {
        this.hitsText.alpha = 0;
        this.hitsText.setText(hits + " " + _("Hits"));
        this.hitsText.updateTransform();

        this.hitsText.position.x = defaultWidth*0.29 - this.hitsText.textWidth*0.5;
        this.hitsText.position.y = defaultHeight*0.72;

        TweenLite.to(this.hitsText, 0.1, {alpha:1.0,ease:Sine.easeOut,overwrite:"all"});
        TweenLite.to(this.hitsText.position, 0.1, {y:defaultHeight*0.72-this.hitsText.textHeight*0.5,ease:Sine.easeOut,overwrite:"all",onCompleteScope:this,onComplete:this.hideHits});
    }
}

GAME.GameHUD.prototype.hideHits = function()
{
    TweenLite.to(this.hitsText, 0.1, {alpha:0.0,delay:1.4,ease:Sine.easeOut,overwrite:"all"});
    TweenLite.to(this.hitsText.position, 0.1, {y:defaultHeight*0.72-this.hitsText.textHeight*0.75,delay:1.4,ease:Sine.easeOut,overwrite:"all"});
}

GAME.GameHUD.prototype.hideCruz = function()
{
    TweenLite.to(this.cruzHits, 0.1, {alpha:0.0,delay:1.0,ease:Sine.easeInOut,overwrite:"all"});
}

GAME.GameHUD.prototype.bonusShow = function(bonus)
{
    this.bonusScoreText.setText("+" + bonus);
    this.bonusScoreText.updateTransform();
    this.bonusScoreText.position.x = defaultWidth*0.5 - this.bonusScoreText.textWidth*0.5;
    this.bonusScoreText.position.y = defaultHeight*0.5;

    this.bonusText.alpha = 1.0;
    TweenLite.to(this.bonusText, 0.4, {alpha:0.0,ease:Sine.easeInOut,overwrite:"all",delay:2.5});

    this.bonusScoreText.alpha = 1.0;
    TweenLite.to(this.bonusScoreText, 0.4, {alpha:0.0,ease:Sine.easeInOut,overwrite:"all",delay:2.5});
}

GAME.GameHUD.prototype.levelUpdated = function(level)
{
    this.levelText.setText(_("Level") + " " + level);
    this.levelText.updateTransform();
    this.levelText.position.x = defaultWidth*0.01;
    this.levelText.position.y = defaultHeight - this.levelText.textHeight*0.8;

    this.nivelText.setText(_("Level") + " " + level);
    this.nivelText.updateTransform();
    this.nivelText.position.x = defaultWidth*0.5 - this.nivelText.textWidth*0.5;
    this.nivelText.position.y = defaultHeight*0.5 - this.nivelText.textHeight*0.4;

    this.nivelContainer.position.x = -defaultWidth;
    this.nivelContainer.visible = true;

    var total = this.baseScore + gameEngine.scenes[GAME_MODE.INGAME].levelManager.scoreNeeded();
    this.scoreText.setText(this.score + " / " + total);
    this.scoreText.updateTransform();

    this.scoreText.position.x = this.barraPoderBackground.position.x + this.barraPoderBackground.width*0.5 - this.scoreText.textWidth*0.5;
    this.scoreText.position.y = this.barraPoderBackground.position.y - this.barraPoderBackground.height*0.5;

    sounds.play('go');
    
    TweenLite.to(this.nivelContainer.position, 0.2, {x:0,ease:Sine.easeOut,overwrite:"all",onCompleteScope:this,onComplete:this.exitLevel});
}

GAME.GameHUD.prototype.exitLevel = function()
{
    TweenLite.to(this.nivelContainer.position, 0.2, {x:defaultWidth,ease:Sine.easeIn,overwrite:"all",delay:1.4,onCompleteScope:this.nivelContainer,onComplete:this.invisible});
}

GAME.GameHUD.prototype.invisible = function()
{
    this.visible = false;
}

GAME.GameHUD.prototype.restart = function()
{
    gameEngine.scenes[GAME_MODE.INGAME].restart();
}

GAME.GameHUD.prototype.update = function(dt)
{
    //Update Score
    if(this.velocityScore > 0)
    {
        this.scoreTemp += this.velocityScore * dt;
        if(this.scoreTemp >= this.finalScore)
        {
            this.velocityScore = 0;
            this.scoreTemp = this.finalScore;
        }

        var number = Math.floor(this.scoreTemp);
        var total = this.baseScore + gameEngine.scenes[GAME_MODE.INGAME].levelManager.scoreNeeded();
        this.scoreText.setText(number + " / " + total);
        this.scoreText.updateTransform();

        this.scoreText.position.x = this.barraPoderBackground.position.x + this.barraPoderBackground.width*0.5 - this.scoreText.textWidth*0.5;
        this.scoreText.position.y = this.barraPoderBackground.position.y - this.barraPoderBackground.height*0.5;
    }

    if(this.velocityBarra > 0)
    {
        if(this.barraPoder.scale.x + this.velocityBarra * dt >= this.finalBarra)
        {
            this.barraPoder.scale.x = this.finalBarra;
            this.velocityBarra = 0.0;
        }
        else
        {
            this.barraPoder.scale.x += this.velocityBarra * dt;
        }
    }
}
