var GAME = GAME || {};

var GAMESCENE_STATE = {TUTORIAL_APPEAR:0,TUTORIAL:1,COMPLETING_ROWS_PREVIOUS:2,COMPLETING_ROWS:3,PREVIOUSREADY:4,READY:5,PLAYING:6,LVLUP:7,EXPLODEALL:8,NEWROWS:9,SWAP:10,PAUSE:11,HAMSTERLOSE:12,LOSE:13};

GAME.GameScene = function(container, width, height)
{
	this.container = container;
    this.width = width;
    this.height = height;

    this.innerContainer = new PIXI.DisplayObjectContainer();
    this.innerContainer.position.x = (this.width - defaultWidth)*0.5;
    this.innerContainer.position.y = (this.height - defaultHeight)*0.5;
    this.container.addChild( this.innerContainer );

    this.gameContainer = new PIXI.DisplayObjectContainer();
    this.gameContainer.position.x = this.gameContainer.position.y = 0;
    this.innerContainer.addChild( this.gameContainer );

    this.backgroundContainer = new PIXI.DisplayObjectContainer();
    this.particlesBubblesContainer = new PIXI.DisplayObjectContainer();
    this.bubblesContainer = new PIXI.DisplayObjectContainer();
    this.bubblesInFloorContainer = new PIXI.DisplayObjectContainer();
    this.particlesContainer = new PIXI.DisplayObjectContainer();
    this.hudContainer = new PIXI.DisplayObjectContainer();

    this.gameContainer.addChild( this.backgroundContainer );
    this.gameContainer.addChild( this.particlesBubblesContainer );
    this.gameContainer.addChild( this.bubblesContainer );
    this.gameContainer.addChild( this.bubblesInFloorContainer );
    this.gameContainer.addChild( this.particlesContainer );

    this.innerContainer.addChild( this.hudContainer );

    var background = PIXI.Sprite.fromImage("Art/MenuScene/FondoMenu" + artSuffix + ".png");
    background.anchor.x = background.anchor.y = 0.5;
    background.position.x = defaultWidth*0.5;
    background.position.y = defaultHeight*0.5;
    this.backgroundContainer.addChild( background );

    this.clouds = [];

    var cloud = PIXI.Sprite.fromFrame("MenuScene_Nube.png");
    cloud.anchor.x = cloud.anchor.y = 0.5;
    cloud.position.x = defaultWidth*0.23;
    cloud.position.y = defaultHeight*0.24;
    cloud.speed = defaultWidth / 40;
    this.backgroundContainer.addChild( cloud );
    this.clouds.push( cloud );

    cloud = PIXI.Sprite.fromFrame("MenuScene_Nube.png");
    cloud.anchor.x = cloud.anchor.y = 0.5;
    cloud.scale.x = cloud.scale.y = 0.6;
    cloud.position.x = defaultWidth*0.62;
    cloud.position.y = defaultHeight*0.3;
    cloud.speed = defaultWidth / 70;
    this.backgroundContainer.addChild( cloud );
    this.clouds.push( cloud );

    cloud = PIXI.Sprite.fromFrame("MenuScene_Nube.png");
    cloud.anchor.x = cloud.anchor.y = 0.5;
    cloud.scale.x = cloud.scale.y = 0.8;
    cloud.position.x = defaultWidth*0.8;
    cloud.position.y = defaultHeight*0.35;
    cloud.speed = defaultWidth / 50;
    this.backgroundContainer.addChild( cloud );
    this.clouds.push( cloud );

    this.cuadroBlanco = PIXI.Sprite.fromImage("Art/GameScene/GameScene_CuadroBlanco" + artSuffix + ".png");
    this.cuadroBlanco.anchor.x = this.cuadroBlanco.anchor.y = 0.5;
    this.cuadroBlanco.position.x = defaultWidth*0.5;
    this.cuadroBlanco.position.y = this.cuadroBlanco.height*0.5 + PIXI.Sprite.fromFrame("PauseScene_BarraPoder.png").height*1.1;
    this.backgroundContainer.addChild( this.cuadroBlanco );

    this.rainbow = PIXI.Sprite.fromFrame("Arcoiris.png");
    this.rainbow.anchor.x = this.rainbow.anchor.y = 0.5;
    this.rainbow.alpha = 0.0;
    this.rainbow.position.x = defaultWidth*0.5;
    this.rainbow.position.y = defaultHeight*0.92 - this.rainbow.height*0.5;
    this.backgroundContainer.addChild( this.rainbow );

    this.suelo = PIXI.Sprite.fromFrame("GameScene_FondoAbajo.png");
    this.suelo.anchor.x = this.suelo.anchor.y = 0.5;
    this.suelo.position.x = defaultWidth*0.5;
    this.suelo.position.y = defaultHeight - this.suelo.height*0.5;
    this.backgroundContainer.addChild( this.suelo );

    this.playerContainer = new PIXI.DisplayObjectContainer();
    this.backgroundContainer.addChild( this.playerContainer );

    this.hamster = new PIXI.Spine("Art/Animacion/Hamster1/Hamster1Data" + artSuffix + ".json");
    this.hamster.position.x = defaultWidth*0.27;
    this.hamster.position.y = defaultHeight - this.suelo.height*0.44;
    this.hamster.state.setAnimationByName(0, "Idle", true);
    this.playerContainer.addChild( this.hamster );

    this.hamster.stateData.setMixByName("Idle", "Critical", 0.2);
    this.hamster.stateData.setMixByName("Critical", "Idle", 0.2);

    this.hamster.stateData.setMixByName("Danger", "Idle", 0.2);
    this.hamster.stateData.setMixByName("Idle", "Danger", 0.2);

    this.hamster.stateData.setMixByName("Danger", "GameOver", 0.2);

    this.limite = PIXI.Sprite.fromFrame("GameScene_Limite.png");
    this.limite.anchor.x = this.limite.anchor.y = 0.5;
    this.limite.position.x = defaultWidth*0.5;
    this.limite.position.y = defaultHeight*0.715;
    this.backgroundContainer.addChild( this.limite );

    this.levelManager = new GAME.LevelManager( this );

    this.particleManager = new GAME.ParticleManager(this.particlesContainer,this.particlesBubblesContainer);

    this.crossbow = new GAME.Crossbow(this.backgroundContainer,this.suelo.position.y);    
    this.bubbleManager = new GAME.BubbleManager(this.bubblesContainer,this.bubblesInFloorContainer,this.particlesContainer,this.hudContainer,14,20);

    var textureRojo = PIXI.Texture.fromImage("Art/GameScene/GameScene_Rojo" + artSuffix + ".png");
    this.cuadroRojo = new PIXI.TilingSprite(textureRojo, defaultWidth, defaultHeight);
    this.cuadroRojo.alpha = 0;
    this.cuadroRojo.position.x = 0;
    this.cuadroRojo.position.y = 0;
    this.hudContainer.addChild( this.cuadroRojo );

    var textureBlanco = PIXI.Texture.fromImage("Art/GameScene/GameScene_Blanco" + artSuffix + ".png");
    this.flashBlanco = new PIXI.TilingSprite(textureBlanco, defaultWidth, defaultHeight);
    this.flashBlanco.alpha = 0;
    this.flashBlanco.position.x = 0;
    this.flashBlanco.position.y = 0;
    this.hudContainer.addChild( this.flashBlanco );

    this.gameHUD = new GAME.GameHUD( this.hudContainer );
    this.pauseHUD = new GAME.PauseHUD( this.hudContainer );
    this.gameoverHUD = new GAME.GameOverHUD( this.hudContainer );

    if(gameEngine.isMobile.any())
    {
        this.tutorial = new PIXI.Spine("Art/Tutorial/Tutorial" + artSuffix + ".json");
        this.tutorial.position.x = defaultWidth*0.5;
        this.tutorial.position.y = defaultHeight*0.5 + defaultHeight*0.35;
        this.tutorial.state.setAnimationByName(0, "animation", true);
        this.hudContainer.addChild( this.tutorial );

        this.tutorialClose = PIXI.Sprite.fromFrame("Tutorial_Cerrar.png");
        this.tutorialClose.anchor.x = this.tutorialClose.anchor.y = 0.5;
        this.tutorialClose.position.x = this.tutorial.position.x + defaultWidth*0.35;
        this.tutorialClose.position.y = this.tutorial.position.y - defaultHeight*0.69;
        this.tutorialClose.visible = false;
        this.hudContainer.addChild( this.tutorialClose );

        this.tutorialClose.interactive = this.tutorialClose.buttonMode = true;
        this.tutorialClose.mousedown = this.tutorialClose.touchstart = function (touchData)
        {
            touchData.originalEvent.preventDefault();
            gameEngine.scenes[GAME_MODE.INGAME].closeTutorial();
        }

        this.tutorialAppeared = false;
    }

    // Retrieves the logo from Spil
    /*var logoData = gameEngine.apiInstance.Branding.getLogo();
    if(logoData.image)
    {
        this.logoBrand = PIXI.Sprite.fromImage(logoData.image);
        this.logoBrand.anchor.x = this.logoBrand.anchor.y = 0.5;
        this.logoBrand.position.x = defaultWidth*0.5;
        this.logoBrand.position.y = defaultHeight - this.logoBrand.height*0.5;
        this.hudContainer.addChild( this.logoBrand );

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
GAME.GameScene.constructor = GAME.GameScene;

GAME.GameScene.prototype.resize = function(width, height)
{
	this.width = width;
    this.height = height;

    this.innerContainer.position.x = (this.width - defaultWidth)*0.5;
    this.innerContainer.position.y = (this.height - defaultHeight)*0.5;
}

GAME.GameScene.prototype.onEnter = function()
{
    this.bubbleManager.init();

    this.levelManager.init();

    this.rowsCreated = 0;

    this.bubbleManager.setBubbleReady(this.levelManager);

    this.hamstersTypes = ["Lee", //0
                        "Chou-chou", //1
                        "Tokugava-san", //2
                        "Nibbler", //3
                        "Mayko", //4
                        "Panda-Girl", //5
                        "Papa Bear"]; //6

    this.playerContainer.removeChild( this.hamster );
    var selectedHam = this.hamstersTypes.indexOf(gameEngine.userStorage.hamsterSelected) + 1;

    this.hamster = new PIXI.Spine("Art/Animacion/Hamster" + selectedHam + "/Hamster" + selectedHam + "Data" + artSuffix + ".json");
    this.hamster.position.x = defaultWidth*0.3;
    this.hamster.position.y = defaultHeight - this.suelo.height*0.44;
    this.hamster.state.setAnimationByName(0, "Idle", true);
    this.playerContainer.addChild( this.hamster );

    this.hamster.stateData.setMixByName("Idle", "Critical", 0.2);
    this.hamster.stateData.setMixByName("Critical", "Idle", 0.2);

    this.hamster.stateData.setMixByName("Danger", "Idle", 0.2);
    this.hamster.stateData.setMixByName("Idle", "Danger", 0.2);

    this.hamster.stateData.setMixByName("Danger", "GameOver", 0.2);

    this.hamster.stateData.setMixByName("Idle", "GameOver", 0.1);
    this.hamster.stateData.setMixByName("GameOver", "Idle", 0.2);

    this.hamster.state.animationSpeed = 0.0;

    this.limite.alpha = 0.3;

    this.gameoverHUD.init();
    this.pauseHUD.hide();
    this.gameHUD.init();
    this.gameHUD.enablePause();
    this.crossbow.init();

    this.timeElapsed = 0;

    this.bubblesContainer.filters = null;

    this.gameHUD.disablePause();

    this.crossbow.disableCrossbow();

    this.limitMusicPlaying = false;
    limitMusic.volume(1.0);
    gameMusic.volume(1.0);

    if(gameEngine.isMobile.any() && !this.tutorialAppeared)
    {
        this.tutorialClose.visible = false;
        this.tutorial.visible = true;
    }

    if(gameEngine.isMobile.any() && !this.tutorialAppeared)
    {
        this.tutorial.state.setAnimationByName(0, "animation", true);
        this.state = GAMESCENE_STATE.TUTORIAL_APPEAR;
        this.tutorialAppeared = true;
    }
    else
    {
        this.state = GAMESCENE_STATE.COMPLETING_ROWS_PREVIOUS;
    }
}

GAME.GameScene.prototype.closeTutorial = function()
{
    sounds.play('cancel_close');
    this.tutorialClose.visible = false;
    this.tutorial.visible = false;

    this.state = GAMESCENE_STATE.COMPLETING_ROWS_PREVIOUS;
}

GAME.GameScene.prototype.mouseDown = function(mouseData)
{
    var location = mouseData.getLocalPosition( this.innerContainer );

    if(this.bubbleManager.bubbleReady != null)
    {
        if(gameEngine.isMobile.any())
        {
            if(this.crossbow.isTouching(location) && this.bubbleManager.bubbleReady.state == BUBBLE_STATE.READY && this.state == GAMESCENE_STATE.PLAYING && !this.crossbow.isTouchingBubbleSupport(location))
            {
                this.crossbow.aimShoot( location );
                this.bubbleManager.aimShoot( this.crossbow );
            }
        }
        else
        {
            if(this.bubbleManager.bubbleReady.state == BUBBLE_STATE.READY && this.state == GAMESCENE_STATE.PLAYING && !this.gameHUD.isTouchingPause(location) && !this.crossbow.isTouchingBubbleSupport(location))
            {
                this.crossbow.aimShoot( location );
                this.bubbleManager.aimShoot( this.crossbow );

                this.crossbow.shoot( location );
                this.bubbleManager.shootBubble( this.crossbow );
            }
            else if(this.bubbleManager.bubbleReady.state == BUBBLE_STATE.SHOOTING && this.state == GAMESCENE_STATE.PLAYING && !this.gameHUD.isTouchingPause(location) && !this.crossbow.isTouchingBubbleSupport(location))
            {
                this.crossbow.shoot( location );
                this.bubbleManager.shootBubble( this.crossbow );
            }
        }
    }
}

GAME.GameScene.prototype.mouseMove = function(mouseData)
{
    var location = mouseData.getLocalPosition( this.innerContainer );

    if(this.bubbleManager.bubbleReady != null)
    {
        if(gameEngine.isMobile.any())
        {
            if(this.bubbleManager.bubbleReady.state == BUBBLE_STATE.SHOOTING && this.state == GAMESCENE_STATE.PLAYING)
            {
                this.crossbow.aimShoot( location );
            }
        }
        else
        {
            if(this.bubbleManager.bubbleReady.state == BUBBLE_STATE.READY && this.state == GAMESCENE_STATE.PLAYING)
            {
                this.crossbow.aimShoot( location );
                this.bubbleManager.aimShoot( this.crossbow );
            }
            else if(this.bubbleManager.bubbleReady.state == BUBBLE_STATE.SHOOTING && this.state == GAMESCENE_STATE.PLAYING)
            {
                this.crossbow.aimShoot( location );
            }
        }
    }
}

GAME.GameScene.prototype.mouseUp = function(mouseData)
{
	var location = mouseData.getLocalPosition( this.innerContainer );

    if(this.bubbleManager.bubbleReady != null)
    {
        if(gameEngine.isMobile.any())
        {
            if(this.bubbleManager.bubbleReady.state == BUBBLE_STATE.SHOOTING && this.state == GAMESCENE_STATE.PLAYING)
            {
                this.crossbow.shoot( location );
                this.bubbleManager.shootBubble( this.crossbow );
            }
        }
    }
}

GAME.GameScene.prototype.rightDown = function(mouseData)
{
    this.bubbleManager.swap();
}

GAME.GameScene.prototype.pause = function()
{
    if(this.state === GAMESCENE_STATE.PLAYING)
    {
        this.pauseHUD.show();

        this.gameHUD.disablePause();
        this.crossbow.disableCrossbow();

        if(this.limitMusicPlaying) limitMusic.fade(1.0,0.3,0.3);
        else gameMusic.fade(1.0,0.3,0.3);

        this.hamster.state.animationSpeed = 0.0;

        this.state = GAMESCENE_STATE.PAUSE;
    }
}

GAME.GameScene.prototype.unpause = function()
{
    this.pauseHUD.hide();

    this.gameHUD.enablePause();
    this.crossbow.enableCrossbow();

    if(this.limitMusicPlaying) limitMusic.fade(0.3,1.0,0.3);
    else gameMusic.fade(0.3,1.0,0.3);

    this.hamster.state.animationSpeed = 1.0;

    this.state = GAMESCENE_STATE.PLAYING;
}

GAME.GameScene.prototype.lose = function()
{
    if(this.state != GAMESCENE_STATE.LOSE)
    {   
        this.gameoverHUD.show(this.gameHUD.score);

        this.state = GAMESCENE_STATE.LOSE;

        //gameEngine.apiInstance.GameBreak.request(fnPause, fnResume);
    }
}

GAME.GameScene.prototype.hamsterLose = function()
{
    if(this.state != GAMESCENE_STATE.HAMSTERLOSE)
    {   
        this.gameHUD.disablePause();
        this.crossbow.disableCrossbow();

        this.cuadroRojo.alpha = 0.7;
        TweenLite.to(this.cuadroRojo, 1.0, {alpha:0,ease:Sine.easeInOut,overwrite:"all"});

        this.bubblesContainer.filters = [new PIXI.GrayFilter()];

        if(!this.limitMusicPlaying)
        {
            gameMusic.fade(1.0,0.0,0.3);
            gameMusic.once("faded",function(){gameMusic.stop();gameMusic.volume(1.0);gameoverMusic.play();});
        }
        else
        {
            limitMusic.fade(1.0,0.0,0.3);
            limitMusic.once("faded",function(){limitMusic.stop();limitMusic.volume(1.0);gameoverMusic.play();});
        }

        this.hamster.state.setAnimationByName(0, "GameOver", true);

        this.timeHamsterLose = 0;
        this.state = GAMESCENE_STATE.HAMSTERLOSE;
    }
}

GAME.GameScene.prototype.scoreUpdated = function(score,addToBar)
{
    this.hamster.state.setAnimationByName(0, "Critical", false);
    this.hamster.state.addAnimationByName(0, "Idle", true, 0);

    if(addToBar === false)
    {
        this.gameHUD.bonusShow(score);
    }

    this.gameHUD.scoreUpdated(score,addToBar);
}

GAME.GameScene.prototype.hamsterMatchBreak = function()
{
    this.hamster.state.setAnimationByName(0, "GameOver", false);
    this.hamster.state.addAnimationByName(0, "GameOver", false, 0);
    this.hamster.state.addAnimationByName(0, "Idle", true, 0);
}

GAME.GameScene.prototype.levelUp = function()
{
    this.timeElapsed = 0;

    if(this.tweenFlash)
    {
        this.tweenFlash.pause();
    }

    this.flashBlanco.alpha = 0.4;
    this.tweenFlash = TweenLite.to(this.flashBlanco, 0.4, {alpha:0,ease:Sine.easeIn,overwrite:"all"});

    this.state = GAMESCENE_STATE.LVLUP;
}

GAME.GameScene.prototype.explodeAllBubbles = function()
{
    this.timeElapsed = 0;

    this.particleManager.intensity = 2.0;
    this.bubbleManager.explodeAllBubbles();

    if(this.tweenFlash)
    {
        this.tweenFlash.pause();
    }

    this.flashBlanco.alpha = 0.9;
    this.tweenFlash = TweenLite.to(this.flashBlanco, 0.4, {alpha:0,ease:Sine.easeIn,overwrite:"all"});

    this.rainbow.alpha = 0.8;
    this.tweenFlash = TweenLite.to(this.rainbow, 10, {alpha:0,ease:Sine.easeInOut,overwrite:"all"});

    this.gameHUD.resetBar();

    this.state = GAMESCENE_STATE.EXPLODEALL;
}

GAME.GameScene.prototype.newRows = function()
{
    this.rowsCounter = 0;
    this.timeElapsed = 0;

    this.levelManager.level += 1;

    this.state = GAMESCENE_STATE.NEWROWS;
}

GAME.GameScene.prototype.continuePlaying = function()
{
    this.levelManager.timeElapsed = 0;

    this.gameHUD.levelUpdated( this.levelManager.level );

    gameEngine.userStorage.level = this.levelManager.level;
    gameEngine.userStorage.save();

    this.bubbleManager.bubbleReady = null;
    this.bubbleManager.setBubbleReady(this.levelManager);

    this.state = GAMESCENE_STATE.PLAYING;
}

GAME.GameScene.prototype.update = function(dt)
{
    if(this.state == GAMESCENE_STATE.PLAYING)
    {
        this.timeElapsed += dt;

        this.bubbleManager.update(dt);
        this.gameHUD.update(dt);

        this.crossbow.update(dt);

        this.levelManager.update(dt);

        //El hamster debe asustarse
        if(this.bubbleManager.bubblesQuantityPerRow[14] > 0 && this.hamster.state.tracks[0].animation.name !== "Danger")
        {
            this.hamster.state.setAnimationByName(0, "Danger", true);
        }
        else if(this.bubbleManager.bubblesQuantityPerRow[14] == 0 && this.hamster.state.tracks[0].animation.name === "Danger")
        {
            this.hamster.state.setAnimationByName(0, "Idle", true);
        }

        if(this.bubbleManager.bubblesQuantityPerRow[16] > 0)
        {
            this.limite.alpha = 0.6 + 0.4 * Math.abs(Math.sin(8 * this.timeElapsed));
            this.cuadroRojo.alpha = 0.2 + 0.2 * Math.sin(8 * this.timeElapsed);
        }
        else if(this.bubbleManager.bubblesQuantityPerRow[14] > 0)
        {
            this.limite.alpha = 0.5 + 0.3 * Math.abs(Math.sin(4 * this.timeElapsed));
            this.cuadroRojo.alpha = 0.1 + 0.1 * Math.sin(6 * this.timeElapsed);
        }
        else
        {
            this.limite.alpha = 0.3;
            this.cuadroRojo.alpha = 0.0;
        }

        if(this.bubbleManager.bubblesQuantityPerRow[14] > 0 && !this.limitMusicPlaying)
        {
            gameMusic.fade(1.0,0.0,0.3);
            gameMusic.once("faded",function(){gameMusic.stop();gameMusic.volume(1.0);limitMusic.play();});
            this.limitMusicPlaying = true;
        }
        else if(this.bubbleManager.bubblesQuantityPerRow[14] === 0 && this.limitMusicPlaying)
        {
            limitMusic.fade(1.0,0.0,0.3);
            limitMusic.once("faded",function(){limitMusic.stop();limitMusic.volume(1.0);gameMusic.play();});
            this.limitMusicPlaying = false;
        }

        //Condicion de Game Over
        if(this.bubbleManager.bubblesQuantityPerRow[17] > 0)
        {
            this.hamsterLose();
        }
    }
    else if(this.state == GAMESCENE_STATE.HAMSTERLOSE)
    {
        this.timeHamsterLose += dt;
        if(this.timeHamsterLose > 2)
        {
            this.lose();
        }

        this.limite.alpha = 1.0;
    }
    else if(this.state == GAMESCENE_STATE.TUTORIAL_APPEAR)
    {
        this.timeElapsed += dt;

        this.bubbleManager.update(dt);
        this.gameHUD.update(dt);

        this.cuadroRojo.alpha = 0.0;

        if(this.timeElapsed > 3.0)
        {
            this.timeElapsed = 0;
            this.tutorialClose.visible = true;
            this.state = GAMESCENE_STATE.TUTORIAL;
        }
    }
    else if(this.state == GAMESCENE_STATE.COMPLETING_ROWS_PREVIOUS)
    {
        this.timeElapsed += dt;

        this.bubbleManager.update(dt);
        this.gameHUD.update(dt);

        this.cuadroRojo.alpha = 0.0;

        if(this.timeElapsed > 0.5)
        {
            this.timeElapsed = 0;
            this.state = GAMESCENE_STATE.COMPLETING_ROWS;
        }
    }
    else if(this.state == GAMESCENE_STATE.COMPLETING_ROWS)
    {
        this.timeElapsed += dt;

        this.bubbleManager.update(dt);
        this.gameHUD.update(dt);

        this.cuadroRojo.alpha = 0.0;

        if(this.timeElapsed > 0.2)
        {
            this.timeElapsed = 0;

            if(this.rowsCreated < this.levelManager.rowsAppearing())
            {
                this.bubbleManager.newRow(this.levelManager);
                this.rowsCreated += 1;
            }
            else
            {
                this.state = GAMESCENE_STATE.PREVIOUSREADY;
            }
        }
    }
    else if(this.state == GAMESCENE_STATE.PREVIOUSREADY)
    {
        this.timeElapsed += dt;

        this.bubbleManager.update(dt);
        this.gameHUD.update(dt);

        this.cuadroRojo.alpha = 0.0;

        if(this.timeElapsed > 0.8)
        {
            this.timeElapsed = 0;
            this.gameHUD.showReady();
            this.state = GAMESCENE_STATE.READY;
        }
    }
    else if(this.state == GAMESCENE_STATE.READY)
    {
        this.timeElapsed += dt;

        this.bubbleManager.update(dt);
        this.gameHUD.update(dt);

        this.cuadroRojo.alpha = 0.0;

        if(this.timeElapsed > 2.0)
        {
            this.timeElapsed = 0;
            this.gameHUD.showGo();
            this.hamster.state.animationSpeed = 1.0;
            this.gameHUD.enablePause();
            this.crossbow.enableCrossbow();
            this.state = GAMESCENE_STATE.PLAYING;

            gameMusic.play();
        }
    }
    else if(this.state == GAMESCENE_STATE.LVLUP)
    {
        this.timeElapsed += dt;

        this.bubbleManager.update(dt);
        this.gameHUD.update(dt);

        this.cuadroRojo.alpha = 0.0;

        if(this.bubbleManager.bubblesQuantityPerRow[14] > 0 && !this.limitMusicPlaying)
        {
            gameMusic.fade(1.0,0.0,0.3);
            gameMusic.once("faded",function(){gameMusic.stop();gameMusic.volume(1.0);limitMusic.play();});
            this.limitMusicPlaying = true;
        }
        else if(this.bubbleManager.bubblesQuantityPerRow[14] === 0 && this.limitMusicPlaying)
        {
            limitMusic.fade(1.0,0.0,0.3);
            limitMusic.once("faded",function(){limitMusic.stop();limitMusic.volume(1.0);gameMusic.play();});
            this.limitMusicPlaying = false;
        }

        if(this.timeElapsed > 1.5)
        {
            this.explodeAllBubbles();
        }
    }
    else if(this.state == GAMESCENE_STATE.EXPLODEALL)
    {
        this.timeElapsed += dt;

        this.bubbleManager.update(dt);
        this.gameHUD.update(dt);

        this.cuadroRojo.alpha = 0.0;

        if(this.timeElapsed > 0.2)
        {
            this.newRows();
        }
    }
    else if(this.state == GAMESCENE_STATE.NEWROWS)
    {
        this.timeElapsed += dt;

        this.bubbleManager.update(dt);
        this.gameHUD.update(dt);

        this.cuadroRojo.alpha = 0.0;

        if(this.rowsCounter < this.levelManager.rowsAppearing() && this.timeElapsed > 0.2)
        {
            this.rowsCounter += 1;
            this.bubbleManager.newRow(this.levelManager,0.2);
            this.timeElapsed = 0.0;
        }
        else if(this.timeElapsed > 0.5)
        {
            this.continuePlaying();
        }
    }

    this.particleManager.update(dt);

    var i;
    for(i=0;i<this.clouds.length;i++)
    {
        var cloud = this.clouds[i];
        cloud.position.x += cloud.speed * dt;
        if(cloud.position.x - cloud.width*0.5 > defaultWidth)
        {
            cloud.position.x = -cloud.width*0.5;
        }
    }
}
