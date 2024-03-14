var MENU_STATE = {HOME:0,SHOP:1};

var GAME = GAME || {};

GAME.MenuScene = function(container, width, height)
{
	this.container = container;
    this.width = width;
    this.height = height;

    this.innerContainer = new PIXI.DisplayObjectContainer();
    this.innerContainer.position.x = (this.width - defaultWidth)*0.5;
    this.innerContainer.position.y = (this.height - defaultHeight)*0.5;
    this.container.addChild( this.innerContainer );

    var background = PIXI.Sprite.fromImage("Art/MenuScene/FondoMenu" + artSuffix + ".png");
    background.anchor.x = background.anchor.y = 0.5;
    background.position.x = defaultWidth*0.5;
    background.position.y = defaultHeight*0.5;
    this.innerContainer.addChild( background );

    this.lights = [];
    var i;
    var n = 16;
    for(i = 0; i < n; i++)
    {
        var light = PIXI.Sprite.fromFrame("MenuScene_RayoBlanco.png");
        light.alpha = 0.15;
        light.anchor.x = 0.5;
        light.anchor.y = 0;
        light.angularSpeed = Math.PI / 8;
        light.rotation = i * (Math.PI * 2 / n);
        light.position.x = defaultWidth*0.5;
        light.position.y = defaultHeight*0.38;
        this.innerContainer.addChild( light );
        this.lights.push( light );
    }

    var sol = PIXI.Sprite.fromFrame("MenuScene_Sol.png");
    sol.anchor.x = sol.anchor.y = 0.5;
    sol.position.x = defaultWidth*0.5;
    sol.position.y = defaultHeight*0.38;
    this.innerContainer.addChild( sol );

    this.clouds = [];

    var cloud = PIXI.Sprite.fromFrame("MenuScene_Nube.png");
    cloud.anchor.x = cloud.anchor.y = 0.5;
    cloud.position.x = defaultWidth*0.23;
    cloud.position.y = defaultHeight*0.24;
    cloud.speed = defaultWidth / 40;
    this.innerContainer.addChild( cloud );
    this.clouds.push( cloud );

    cloud = PIXI.Sprite.fromFrame("MenuScene_Nube.png");
    cloud.anchor.x = cloud.anchor.y = 0.5;
    cloud.scale.x = cloud.scale.y = 0.6;
    cloud.position.x = defaultWidth*0.62;
    cloud.position.y = defaultHeight*0.3;
    cloud.speed = defaultWidth / 70;
    this.innerContainer.addChild( cloud );
    this.clouds.push( cloud );

    cloud = PIXI.Sprite.fromFrame("MenuScene_Nube.png");
    cloud.anchor.x = cloud.anchor.y = 0.5;
    cloud.scale.x = cloud.scale.y = 0.8;
    cloud.position.x = defaultWidth*0.8;
    cloud.position.y = defaultHeight*0.35;
    cloud.speed = defaultWidth / 50;
    this.innerContainer.addChild( cloud );
    this.clouds.push( cloud );

    var suelo = PIXI.Sprite.fromFrame("GameScene_FondoAbajo.png");
    suelo.anchor.x = suelo.anchor.y = 0.5;
    suelo.position.x = defaultWidth*0.5;
    suelo.position.y = defaultHeight - suelo.height*0.5;
    this.innerContainer.addChild( suelo );

    /****************************************************************************/
    // HOME SCENE
    /****************************************************************************/
    
    this.homeContainer = new PIXI.DisplayObjectContainer();
    this.homeContainer.position.x = this.homeContainer.position.y = 0;
    this.innerContainer.addChild( this.homeContainer );

    this.icon = new PIXI.Spine("Art/Animacion/LogoHamster/LogoData" + artSuffix + ".json");
    this.icon.position.x = defaultWidth*0.5;
    this.icon.position.y = defaultHeight*0.43;
    this.homeContainer.addChild( this.icon );

    this.icon.visible = false;

    this.icon.state.setAnimationByName(0, "Logo", true);

    this.logoGrenades = PIXI.Sprite.fromFrame("MenuScene_Logo.png");
    this.logoGrenades.anchor.x = this.logoGrenades.anchor.y = 0.5;
    this.logoGrenades.position.x = defaultWidth*0.5;
    this.logoGrenades.position.y = defaultHeight*0.5;
    this.homeContainer.addChild( this.logoGrenades );

    this.play = PIXI.Sprite.fromFrame("MenuScene_Play.png");
    this.play.anchor.x = this.play.anchor.y = 0.5;
    this.play.scale.x = this.play.scale.y = 0.9;
    this.play.position.x = defaultWidth*0.5;
    this.play.position.y = defaultHeight*0.8 - 32;
    this.homeContainer.addChild( this.play );

    this.play.interactive = true;
    this.play.buttonMode = true;
    this.play.mousedown = function (touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("MenuScene_PlayHold.png"));
    }

    this.play.touchstart = function (touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("MenuScene_PlayHold.png"));
        sounds.play('explode_bubble');
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    this.play.mouseup = this.play.touchend = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        gameEngine.changeSceneTo(GAME_MODE.INGAME);
        menuMusic.stop();
        sounds.play('ok_accept');
        this.setTexture(PIXI.Texture.fromFrame("MenuScene_Play.png"));
        TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }

    this.play.mouseover = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        sounds.play('explode_bubble');
        TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    this.play.mouseout = this.play.touchendoutside = this.play.mouseupoutside = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("MenuScene_Play.png"));
        TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }

    // Retrieves the logo from Spil
    /*var logoData = gameEngine.apiInstance.Branding.getLogo();
    if(logoData.image)
    {
        this.logoBrand = PIXI.Sprite.fromImage(logoData.image);
        this.logoBrand.anchor.x = this.logoBrand.anchor.y = 0.5;
        this.logoBrand.position.x = defaultWidth*0.5;
        this.logoBrand.position.y = defaultHeight*0.01 + this.logoBrand.height*0.5;
        this.homeContainer.addChild( this.logoBrand );

        this.logoBrand.interactive = this.logoBrand.buttonMode = true;
        this.logoBrand.mousedown = this.logoBrand.touchstart = function (touchData)
        {
            touchData.originalEvent.preventDefault();
            var logoData = gameEngine.apiInstance.Branding.getLogo();
            logoData.action();
        }
    }*/

    if(!gameEngine.userStorage.isSoundsMute)
    {
        this.soundsButton = PIXI.Sprite.fromFrame("MenuScene_SoundOn.png");
    }
    else
    {
        this.soundsButton = PIXI.Sprite.fromFrame("MenuScene_SoundOff.png");
    }
    this.soundsButton.anchor.x = this.soundsButton.anchor.y = 0.5;
    this.soundsButton.scale.x = this.soundsButton.scale.y = 0.9;
    this.soundsButton.position.x = this.soundsButton.width*0.6;
    this.soundsButton.position.y = this.soundsButton.height*0.6;
    this.homeContainer.addChild( this.soundsButton );

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
            this.setTexture(PIXI.Texture.fromFrame("MenuScene_SoundOff.png"));
        }
        else
        {
            gameEngine.userStorage.isSoundsMute = false;
            gameEngine.userStorage.isMusicMute = false;
            gameEngine.userStorage.save();
            gameEngine.unmuteSounds();
            gameEngine.unmuteMusic();
            sounds.play('ok_accept');
            this.setTexture(PIXI.Texture.fromFrame("MenuScene_SoundOn.png"));
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

    /*this.infoButton = PIXI.Sprite.fromFrame("MenuScene_Info.png");
    this.infoButton.scale.x = this.infoButton.scale.y = 0.9;
    this.infoButton.anchor.x = this.infoButton.anchor.y = 0.5;
    this.infoButton.position.x = defaultWidth - this.infoButton.width*0.52;
    this.infoButton.position.y = this.infoButton.height*0.6;
    this.homeContainer.addChild( this.infoButton );

    this.infoButton.interactive = true;
    this.infoButton.buttonMode = true;
    this.infoButton.mousedown = function (touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("MenuScene_InfoHold.png"));
    }

    this.infoButton.touchstart = function (touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("MenuScene_InfoHold.png"));
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        sounds.play('explode_bubble');
        TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    this.infoButton.mouseup = this.infoButton.touchend = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        gameEngine.scenes[GAME_MODE.MENU].touchInfo();
        this.setTexture(PIXI.Texture.fromFrame("MenuScene_Info.png"));
        TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }

    this.infoButton.mouseover = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        sounds.play('explode_bubble');
        TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    this.infoButton.mouseout = this.infoButton.touchendoutside = this.infoButton.mouseupoutside = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("MenuScene_Info.png"));
        TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }*/

    /*this.moreButton = PIXI.Sprite.fromFrame("MenuScene_MoreGames.png");
    this.moreButton.scale.x = this.moreButton.scale.y = 0.9;
    this.moreButton.anchor.x = this.moreButton.anchor.y = 0.5;
    this.moreButton.position.x = this.moreButton.width*0.6;
    this.moreButton.position.y = defaultHeight - this.moreButton.height*0.6;
    this.homeContainer.addChild( this.moreButton );

    this.moreButton.interactive = this.moreButton.buttonMode = true;
    this.moreButton.mousedown = function (touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("MenuScene_MoreGames.png"));
    }

    this.moreButton.touchstart = function (touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("MenuScene_MoreGames.png"));
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        sounds.play('explode_bubble');
        TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    this.moreButton.mouseup = this.moreButton.touchend = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        
        // adds a more games button to the screen
        var buttonProperties = gameEngine.apiInstance.Branding.getLink('more_games');
        buttonProperties.action();

        this.setTexture(PIXI.Texture.fromFrame("MenuScene_MoreGames.png"));
        TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }

    this.moreButton.mouseover = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        sounds.play('explode_bubble');
        TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    this.moreButton.mouseout = this.moreButton.touchendoutside = this.moreButton.mouseupoutside = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("MenuScene_MoreGames.png"));
        TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }*/

    this.grenadesButton = PIXI.Sprite.fromFrame("MenuScene_Tienda.png");
    this.grenadesButton.scale.x = this.grenadesButton.scale.y = 0.9;
    this.grenadesButton.anchor.x = this.grenadesButton.anchor.y = 0.5;
    this.grenadesButton.position.x = defaultWidth - this.grenadesButton.width*0.6;
    this.grenadesButton.position.y = defaultHeight - this.grenadesButton.height*0.6;
    this.homeContainer.addChild( this.grenadesButton );

    this.grenadesButton.interactive = true;
    this.grenadesButton.buttonMode = true;
    this.grenadesButton.mousedown = function (touchData)
    {
        touchData.originalEvent.preventDefault();
        //HOLD
        this.setTexture(PIXI.Texture.fromFrame("MenuScene_Tienda.png"));
    }

    this.grenadesButton.touchstart = function (touchData)
    {
        touchData.originalEvent.preventDefault();
        //HOLD
        this.setTexture(PIXI.Texture.fromFrame("MenuScene_Tienda.png"));
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        sounds.play('explode_bubble');
        TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    this.grenadesButton.mouseup = this.grenadesButton.touchend = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        sounds.play('ok_accept');
        gameEngine.scenes[GAME_MODE.MENU].goShop();
        this.setTexture(PIXI.Texture.fromFrame("MenuScene_Tienda.png"));
        TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }

    this.grenadesButton.mouseover = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        sounds.play('explode_bubble');
        TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    this.grenadesButton.mouseout = this.grenadesButton.touchendoutside = this.grenadesButton.mouseupoutside = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("MenuScene_Tienda.png"));
        TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }

    this.destello = PIXI.Sprite.fromFrame("MenuScene_DestelloTienda.png");
    this.destello.anchor.x = this.destello.anchor.y = 0.5;
    this.destello.position.x = this.grenadesButton.position.x;
    this.destello.position.y = this.grenadesButton.position.y;
    this.homeContainer.addChild( this.destello );

    /****************************************************************************/
    // SHOP SCENE
    /****************************************************************************/

    this.hamstersTypes = ["Lee", //0
                        "Chou-chou", //1
                        "Tokugava-san", //2
                        "Nibbler", //3
                        "Mayko", //4
                        "Panda-Girl", //5
                        "Papa Bear"]; //6

    this.conditionsBestScores = [null, //0
                                5, //1
                                9, //2
                                11, //3
                                13, //4
                                15, //5
                                20];//6

    this.hamsterSelectedIndex = this.hamstersTypes.indexOf(gameEngine.userStorage.hamsterSelected);
    this.actualHamsterIndex = this.hamstersTypes.indexOf(gameEngine.userStorage.hamsterSelected);

    this.shopContainer = new PIXI.DisplayObjectContainer();
    this.shopContainer.position.x = defaultWidth;
    this.shopContainer.position.y = 0;
    this.innerContainer.addChild( this.shopContainer );

    this.hamstersContainer = new PIXI.DisplayObjectContainer();
    this.shopContainer.addChild( this.hamstersContainer );

    this.hamstersArray = [];
    this.cuadros = [];

    var i;
    for(i = 0; i < this.hamstersTypes.length; i++)
    {
        var hamsterContainer = new PIXI.DisplayObjectContainer();
        hamsterContainer.position.x = defaultWidth*i;
        hamsterContainer.position.y = 0;
        this.hamstersContainer.addChild( hamsterContainer );

        var hamsterType = this.hamstersTypes[i];

        var objectText = new PIXI.BitmapText(hamsterType, {font: "Tienda_FuenteObjeto", align: "left"});
        objectText.position.x = defaultWidth*0.5 - objectText.textWidth*0.5;
        objectText.position.y = defaultHeight*0.1 - objectText.textHeight*0.5;
        hamsterContainer.addChild( objectText );

        var cuadro = PIXI.Sprite.fromFrame("Tienda_CuadroTienda.png");
        cuadro.anchor.x = cuadro.anchor.y = 0.5;
        cuadro.position.x = defaultWidth*0.5;
        cuadro.position.y = defaultHeight*0.4;
        hamsterContainer.addChild( cuadro );

        cuadro.buttonMode = cuadro.interactive = false;
        cuadro.mouseup = function(touchData)
        {
            touchData.originalEvent.preventDefault();
            gameEngine.scenes[GAME_MODE.MENU].selectButton.mouseup(touchData);
        }

        cuadro.touchstart = function(touchData)
        {
            touchData.originalEvent.preventDefault();
        }

        cuadro.touchend = function(touchData)
        {
            touchData.originalEvent.preventDefault();
            gameEngine.scenes[GAME_MODE.MENU].selectButton.touchend(touchData);
        }
        this.cuadros.push(cuadro);

        var hamsterImage;
        if(i == 0) hamsterImage = PIXI.Sprite.fromFrame("Tienda_Hamster1.png");
        else if(i == 1) hamsterImage = PIXI.Sprite.fromFrame("Tienda_Hamster2.png");
        else if(i == 2) hamsterImage = PIXI.Sprite.fromFrame("Tienda_Hamster3.png");
        else if(i == 3) hamsterImage = PIXI.Sprite.fromFrame("Tienda_Hamster4.png");
        else if(i == 4) hamsterImage = PIXI.Sprite.fromFrame("Tienda_Hamster5.png");
        else if(i == 5) hamsterImage = PIXI.Sprite.fromFrame("Tienda_Hamster6.png");
        else if(i == 6) hamsterImage = PIXI.Sprite.fromFrame("Tienda_Hamster7.png");

        hamsterImage.anchor.x = hamsterImage.anchor.y = 0.5;
        hamsterImage.position.x = cuadro.position.x;
        hamsterImage.position.y = cuadro.position.y - cuadro.height*0.00;
        hamsterContainer.addChild( hamsterImage );

        this.hamstersArray.push( hamsterContainer );
        if(i == this.actualHamsterIndex) hamsterContainer.visible = true;
        else hamsterContainer.visible = false;
    }

    // Retrieves the logo from Spil
    /*var logoData = gameEngine.apiInstance.Branding.getLogo();
    if(logoData.image)
    {
        this.logoBrand = PIXI.Sprite.fromImage(logoData.image);
        this.logoBrand.anchor.x = this.logoBrand.anchor.y = 0.5;
        this.logoBrand.position.x = defaultWidth - this.logoBrand.width*0.5;
        this.logoBrand.position.y = this.logoBrand.height*0.5;
        this.shopContainer.addChild( this.logoBrand );

        this.logoBrand.interactive = this.logoBrand.buttonMode = true;
        this.logoBrand.mousedown = this.logoBrand.touchstart = function (touchData)
        {
            touchData.originalEvent.preventDefault();
            var logoData = gameEngine.apiInstance.Branding.getLogo();
            logoData.action();
        }
    }*/

    this.homeButton = PIXI.Sprite.fromFrame("Tienda_Home.png");
    this.homeButton.scale.x = this.homeButton.scale.y = 0.9;
    this.homeButton.anchor.x = this.homeButton.anchor.y = 0.5;
    this.homeButton.position.x = this.homeButton.width*0.55;
    this.homeButton.position.y = this.homeButton.height*0.55;
    this.shopContainer.addChild( this.homeButton );

    this.homeButton.interactive = true;
    this.homeButton.buttonMode = true;
    this.homeButton.mousedown = function (touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("Tienda_Home.png"));
    }

    this.homeButton.touchstart = function (touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("Tienda_Home.png"));
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        sounds.play('explode_bubble');
        TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    this.homeButton.mouseup = this.homeButton.touchend = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        sounds.play('ok_accept');
        gameEngine.scenes[GAME_MODE.MENU].goHome();
        this.setTexture(PIXI.Texture.fromFrame("Tienda_Home.png"));
        TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }

    this.homeButton.mouseover = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        sounds.play('explode_bubble');
        TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    this.homeButton.mouseout = this.homeButton.touchendoutside = this.homeButton.mouseupoutside = function(touchData)
    {
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("Tienda_Home.png"));
        TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }

    this.unlockedMessage = new PIXI.BitmapText(_("Unlocked"), {font: "Tienda_Texto", align: "left"});
    this.unlockedMessage.position.x = defaultWidth*0.5 - this.unlockedMessage.textWidth*0.5;
    this.unlockedMessage.position.y = defaultHeight*0.71 - this.unlockedMessage.textHeight*0.5;
    this.shopContainer.addChild( this.unlockedMessage );

    this.conditionsContainer = new PIXI.DisplayObjectContainer();
    this.conditionsContainer.position.x = defaultWidth*0.5;
    this.conditionsContainer.position.y = defaultHeight*0.75;
    this.shopContainer.addChild( this.conditionsContainer );

    this.conditionsText = new PIXI.BitmapText(_("Level needed"), {font: "Tienda_Texto", align: "left"});
    this.conditionsText.position.x = -this.conditionsText.textWidth*0.5;
    this.conditionsText.position.y = -this.conditionsText.textHeight*1.5;
    this.conditionsContainer.addChild( this.conditionsText );

    this.actualZombiesText = new PIXI.BitmapText(gameEngine.userStorage.score + "", {font: "Tienda_FuenteVerde", align: "left"});
    this.actualZombiesText.position.y = -this.actualZombiesText.textHeight*0.3;
    this.conditionsContainer.addChild( this.actualZombiesText );

    this.requiredZombiesText = new PIXI.BitmapText(" / " + this.conditionsBestScores[this.actualHamsterIndex], {font: "Tienda_FuenteRoja", align: "left"});
    this.requiredZombiesText.position.y = this.actualZombiesText.position.y;
    this.conditionsContainer.addChild( this.requiredZombiesText );

    this.actualZombiesText.position.x = -(this.actualZombiesText.textWidth + this.requiredZombiesText.textWidth)*0.5;
    this.requiredZombiesText.position.x = this.actualZombiesText.position.x + this.actualZombiesText.textWidth;

    this.backButton = PIXI.Sprite.fromFrame("Tienda_Back.png");
    this.backButton.scale.x = this.backButton.scale.y = 0.9;
    this.backButton.anchor.x = this.backButton.anchor.y = 0.5;
    this.backButton.position.x = this.homeButton.width*0.6;
    this.backButton.position.y = defaultHeight - this.homeButton.height*0.6;
    this.shopContainer.addChild( this.backButton );

    this.backButton.interactive = true;
    this.backButton.buttonMode = true;
    this.backButton.mousedown = function (touchData)
    {
        if(this.filters) return;
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("Tienda_Back.png"));
    }

    this.backButton.touchstart = function (touchData)
    {
        if(this.filters) return;
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("Tienda_Back.png"));
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        sounds.play('explode_bubble');
        TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    this.backButton.touchend = function(touchData)
    {
        if(this.filters) return;
        touchData.originalEvent.preventDefault();
        sounds.play('ok_accept');
        gameEngine.scenes[GAME_MODE.MENU].goBack();
        this.setTexture(PIXI.Texture.fromFrame("Tienda_Back.png"));
        TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }

    this.backButton.mouseup = function(touchData)
    {
        if(this.filters) return;
        touchData.originalEvent.preventDefault();
        sounds.play('ok_accept');
        gameEngine.scenes[GAME_MODE.MENU].goBack();
    }

    this.backButton.mouseover = function(touchData)
    {
        if(this.filters) return;
        touchData.originalEvent.preventDefault();
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        sounds.play('explode_bubble');
        TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    this.backButton.mouseout = this.backButton.touchendoutside = this.backButton.mouseupoutside = function(touchData)
    {
        if(this.filters) return;
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("Tienda_Back.png"));
        TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }

    this.nextButton = PIXI.Sprite.fromFrame("Tienda_Next.png");
    this.nextButton.scale.x = this.nextButton.scale.y = 0.9;
    this.nextButton.anchor.x = this.nextButton.anchor.y = 0.5;
    this.nextButton.position.x = defaultWidth - this.homeButton.width*0.6;
    this.nextButton.position.y = defaultHeight - this.homeButton.height*0.6;
    this.shopContainer.addChild( this.nextButton );

    this.nextButton.interactive = true;
    this.nextButton.buttonMode = true;
    this.nextButton.mousedown = function (touchData)
    {
        if(this.filters) return;
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("Tienda_Next.png"));
    }

    this.nextButton.touchstart = function (touchData)
    {
        if(this.filters) return;
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("Tienda_Next.png"));
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        sounds.play('explode_bubble');
        TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    this.nextButton.touchend = function(touchData)
    {
        if(this.filters) return;
        touchData.originalEvent.preventDefault();
        sounds.play('ok_accept');
        gameEngine.scenes[GAME_MODE.MENU].goNext();
        this.setTexture(PIXI.Texture.fromFrame("Tienda_Next.png"));
        TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }

    this.nextButton.mouseup = function(touchData)
    {
        if(this.filters) return;
        touchData.originalEvent.preventDefault();
        sounds.play('ok_accept');
        gameEngine.scenes[GAME_MODE.MENU].goNext();
    }

    this.nextButton.mouseover = function(touchData)
    {
        if(this.filters) return;
        touchData.originalEvent.preventDefault();
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        sounds.play('explode_bubble');
        TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    this.nextButton.mouseout = this.nextButton.touchendoutside = this.nextButton.mouseupoutside = function(touchData)
    {
        if(this.filters) return;
        touchData.originalEvent.preventDefault();
        this.setTexture(PIXI.Texture.fromFrame("Tienda_Next.png"));
        TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }

    this.selectButton = PIXI.Sprite.fromFrame("Tienda_Selected.png");
    this.selectButton.scale.x = this.selectButton.scale.y = 0.9;
    this.selectButton.anchor.x = this.selectButton.anchor.y = 0.5;
    this.selectButton.position.x = defaultWidth*0.5;
    this.selectButton.position.y = this.nextButton.position.y;
    this.shopContainer.addChild( this.selectButton );

    this.selectButton.interactive = true;
    this.selectButton.buttonMode = true;
    this.selectButton.mousedown = function (touchData)
    {
        if(this.filters) return;
        touchData.originalEvent.preventDefault();
    }

    this.selectButton.touchstart = function (touchData)
    {
        if(this.filters) return;
        touchData.originalEvent.preventDefault();
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        sounds.play('explode_bubble');
        TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    this.selectButton.touchend = function(touchData)
    {
        if(this.filters) return;
        touchData.originalEvent.preventDefault();
        sounds.play('select_hamster');
        gameEngine.scenes[GAME_MODE.MENU].selectHamster();
        TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }

    this.selectButton.mouseup = function(touchData)
    {
        if(this.filters) return;
        touchData.originalEvent.preventDefault();
        sounds.play('select_hamster');
        gameEngine.scenes[GAME_MODE.MENU].selectHamster();
    }

    this.selectButton.mouseover = function(touchData)
    {
        if(this.filters) return;
        touchData.originalEvent.preventDefault();
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        sounds.play('explode_bubble');
        TweenLite.to(this, 0.2, {rotation:Math.random()*Math.PI*0.05*plusOrMinus,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.6, {x:1,y:1,ease:Elastic.easeOut,overwrite:"all"});
    }

    this.selectButton.mouseout = this.selectButton.touchendoutside = this.selectButton.mouseupoutside = function(touchData)
    {
        if(this.filters) return;
        touchData.originalEvent.preventDefault();
        TweenLite.to(this, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
    }

    this.showConditions();

    var textureBlanco = PIXI.Texture.fromImage("Art/GameScene/GameScene_Blanco" + artSuffix + ".png");
    this.flashBlanco = new PIXI.TilingSprite(textureBlanco, defaultWidth, defaultHeight);
    this.flashBlanco.alpha = 0;
    this.flashBlanco.position.x = this.flashBlanco.position.y = 0;
    this.innerContainer.addChild( this.flashBlanco );

    /****************************************************************************/
    // INFORMATION MESSAGE
    /****************************************************************************/

    /*this.infoContainer =  new PIXI.DisplayObjectContainer();
    this.infoContainer.position.x = this.width*0.5;
    this.infoContainer.position.y = this.height*0.5;
    this.infoContainer.visible = false;
    this.container.addChild( this.infoContainer );

    var textureNegro = PIXI.Texture.fromImage("Art/MenuScene/CuadroNegro" + artSuffix + ".png");
    this.cuadroNegro = new PIXI.TilingSprite(textureNegro, this.width, this.height);
    this.cuadroNegro.alpha = 0.8;
    this.cuadroNegro.position.x = -defaultWidth*0.5;
    this.cuadroNegro.position.y = -defaultHeight*0.5;
    this.infoContainer.addChild( this.cuadroNegro );

    this.infoMessage = PIXI.Sprite.fromFrame("MenuScene_CreditsInfo.png");
    this.infoMessage.anchor.x = this.infoMessage.anchor.y = 0.5;
    this.infoMessage.position.x = defaultWidth*0.03;
    this.infoMessage.position.y = 0;
    this.infoContainer.addChild( this.infoMessage );

    this.infoMessage.interactive = true;
    this.infoMessage.buttonMode = true;
    this.infoMessage.mousedown = this.infoMessage.touchstart = function (touchData)
    {
        touchData.originalEvent.preventDefault();
        gameEngine.scenes[GAME_MODE.MENU].touchInfo();
    }*/

    this.state = MENU_STATE.HOME;
}   

// constructor
GAME.MenuScene.constructor = GAME.MenuScene;

GAME.MenuScene.prototype.resize = function(width, height)
{
	this.width = width;
    this.height = height;

    this.innerContainer.position.x = (this.width - defaultWidth)*0.5;
    this.innerContainer.position.y = (this.height - defaultHeight)*0.5;

    /*this.infoContainer.position.x = this.width*0.5;
    this.infoContainer.position.y = this.height*0.5;

    this.cuadroNegro.width = defaultWidth;
    this.cuadroNegro.height = defaultHeight;*/
}

GAME.MenuScene.prototype.onEnter = function()
{
    if(!gameEngine.userStorage.isSoundsMute)
    {
        this.soundsButton.setTexture(PIXI.Texture.fromFrame("MenuScene_SoundOn.png"));
    }
    else
    {
        this.soundsButton.setTexture(PIXI.Texture.fromFrame("MenuScene_SoundOff.png"));
    }

    if(menuMusic.seek() == 0)
    {
        menuMusic.stop();
        menuMusic.play();
    }

    this.logoGrenades.scale.x = this.logoGrenades.scale.y = 3;
    this.logoGrenades.alpha = 0;
    this.logoGrenades.visible = true;

    this.icon.visible = false;

    TweenLite.to(this.logoGrenades.scale, 0.9, {x:1,y:1,delay:0.4,ease:Bounce.easeOut,overwrite:"all"});
    TweenLite.to(this.logoGrenades, 0.3, {alpha:1,delay:0.4,ease:Circ.easeIn,overwrite:"all",onComplete:this.hamsterAppear,onCompleteScope:this});

    this.homeContainer.buttonMode = this.homeButton.interactive = false;
    this.backButton.buttonMode = this.backButton.interactive = false;
    this.selectButton.buttonMode = this.selectButton.interactive = false;
    this.nextButton.buttonMode = this.nextButton.interactive = false;

    this.soundsButton.buttonMode = this.soundsButton.interactive = true;
    //this.infoButton.buttonMode = this.infoButton.interactive = true;
    this.grenadesButton.buttonMode = this.grenadesButton.interactive = true;
    this.play.buttonMode = this.play.interactive = true;

    if(this.actualHamsterIndex == 0)
    {
        this.backButton.filters = [new PIXI.GrayFilter()];
        this.backButton.alpha = 0.3;
    }
    else
    {
        this.backButton.filters = null;
        this.backButton.alpha = 1.0;
    }

    if(this.actualHamsterIndex == this.hamstersTypes.length - 1)
    {
        this.nextButton.filters = [new PIXI.GrayFilter()];
        this.nextButton.alpha = 0.3;
    }
    else
    {
        this.nextButton.filters = null;
        this.nextButton.alpha = 1.0;
    }

    this.state = MENU_STATE.HOME;
}

GAME.MenuScene.prototype.hamsterAppear = function()
{
    TweenLite.to(this.icon.position, 0.25, {y:defaultHeight*0.5,ease:Sine.easeOut,overwrite:"all",onComplete:this.hamsterAppearStep,onCompleteScope:this});

    sounds.play('logo_voice');
}

GAME.MenuScene.prototype.hamsterAppearStep = function()
{
    this.icon.position.y = defaultHeight*0.5;
    this.icon.visible = true;

    TweenLite.to(this.icon.position, 0.3, {y:defaultHeight*0.43,ease:Sine.easeOut,overwrite:"all"});
}

GAME.MenuScene.prototype.mouseDown = function(mouseData)
{

}

GAME.MenuScene.prototype.mouseMove = function(mouseData)
{

}

GAME.MenuScene.prototype.mouseUp = function(mouseData)
{
	
}

GAME.MenuScene.prototype.selectHamster = function()
{
    if(gameEngine.userStorage.level >= this.conditionsBestScores[this.actualHamsterIndex])
    {
        gameEngine.userStorage.hamsterSelected = this.hamstersTypes[this.actualHamsterIndex];
        gameEngine.userStorage.save();

        this.hamsterSelectedIndex = this.actualHamsterIndex;
        this.selectButton.setTexture(PIXI.Texture.fromFrame("Tienda_Selected.png"));

        this.flashBlanco.alpha = 0.9;
        TweenLite.to(this.flashBlanco, 0.4, {alpha:0,ease:Sine.easeIn,overwrite:"all"});
    }
}

GAME.MenuScene.prototype.goNext = function()
{
    if(this.actualHamsterIndex < this.hamstersTypes.length - 1)
    {
        this.actualHamsterIndex += 1;

        if(this.actualHamsterIndex == this.hamstersTypes.length - 1)
        {
            this.nextButton.filters = [new PIXI.GrayFilter()];
            this.nextButton.alpha = 0.3;
            TweenLite.to(this.nextButton, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
            TweenLite.to(this.nextButton.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
        }
        else
        {
            this.nextButton.filters = null;
            this.nextButton.alpha = 1.0;
        }
        if(this.backButton.filters)
        {
            this.backButton.filters = null;
            this.backButton.alpha = 1.0;
        }

        this.hamstersArray[this.actualHamsterIndex].visible = true;
        TweenLite.to(this.hamstersContainer.position, 0.4, {x:-this.actualHamsterIndex*defaultWidth,ease:Circ.easeOut,overwrite:"all",onComplete:this.hide,onCompleteScope:this.hamstersArray[this.actualHamsterIndex - 1]});

        if(this.actualHamsterIndex == this.hamsterSelectedIndex)
        {
            this.selectButton.setTexture(PIXI.Texture.fromFrame("Tienda_Selected.png"));
        }
        else
        {
            this.selectButton.setTexture(PIXI.Texture.fromFrame("Tienda_Select.png"));
        }

        this.showConditions();
    }
}

GAME.MenuScene.prototype.showConditions = function()
{
    if(gameEngine.userStorage.level < this.conditionsBestScores[this.actualHamsterIndex])
    {
        this.selectButton.filters = [new PIXI.GrayFilter()];
        this.selectButton.alpha = 0.3;
        TweenLite.to(this.selectButton, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
        TweenLite.to(this.selectButton.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});

        this.hamstersArray[this.actualHamsterIndex].children[2].filters = [new PIXI.GrayFilter()];
        this.hamstersArray[this.actualHamsterIndex].children[2].alpha = 0.3;

        this.conditionsText.setText(_("Needed to unlock"));
        this.conditionsText.updateTransform();
        this.conditionsText.position.x = -this.conditionsText.textWidth*0.5;
        this.conditionsText.position.y = -this.conditionsText.textHeight*1.5;

        this.actualZombiesText.setText("");
        this.requiredZombiesText.setText("Level " + this.conditionsBestScores[this.actualHamsterIndex]);
        this.actualZombiesText.updateTransform();
        this.requiredZombiesText.updateTransform();

        this.actualZombiesText.position.x = -(this.actualZombiesText.textWidth + this.requiredZombiesText.textWidth)*0.5;
        this.requiredZombiesText.position.x = -this.requiredZombiesText.textWidth*0.5;

        this.conditionsContainer.visible = true;
        this.unlockedMessage.visible = false;
    }
    else
    {
        this.selectButton.filters = null;
        this.selectButton.alpha = 1.0;
        this.hamstersArray[this.actualHamsterIndex].children[2].filters = null;
        this.hamstersArray[this.actualHamsterIndex].children[2].alpha = 1.0;
        this.conditionsContainer.visible = false;
        this.unlockedMessage.visible = true;
    }
}

GAME.MenuScene.prototype.goBack = function()
{
    if(this.actualHamsterIndex > 0)
    {
        this.actualHamsterIndex -= 1;
        if(this.actualHamsterIndex == 0)
        {
            this.backButton.filters = [new PIXI.GrayFilter()];
            this.backButton.alpha = 0.3;
            TweenLite.to(this.backButton, 0.4, {rotation:0,ease:Sine.easeInOut,overwrite:"all"});
            TweenLite.to(this.backButton.scale, 0.2, {x:0.9,y:0.9,ease:Sine.easeInOut,overwrite:"all"});
        }
        else
        {
            this.backButton.filters = null;
            this.backButton.alpha = 1.0;
        }
        if(this.nextButton.filters)
        {
            this.nextButton.filters = null;
            this.nextButton.alpha = 1.0;
        }

        this.hamstersArray[this.actualHamsterIndex].visible = true;
        TweenLite.to(this.hamstersContainer.position, 0.4, {x:-this.actualHamsterIndex*defaultWidth,ease:Circ.easeOut,overwrite:"all",onComplete:this.hide,onCompleteScope:this.hamstersArray[this.actualHamsterIndex + 1]});

        if(this.actualHamsterIndex == this.hamsterSelectedIndex)
        {
            this.selectButton.setTexture(PIXI.Texture.fromFrame("Tienda_Selected.png"));
        }
        else
        {
            this.selectButton.setTexture(PIXI.Texture.fromFrame("Tienda_Select.png"));
        }

        this.showConditions();
    }
}

GAME.MenuScene.prototype.hide = function()
{
    this.visible = false;
}

GAME.MenuScene.prototype.goShop = function()
{
    this.homeContainer.buttonMode = this.homeButton.interactive = true;
    this.backButton.buttonMode = this.backButton.interactive = true;
    this.selectButton.buttonMode = this.selectButton.interactive = true;
    this.nextButton.buttonMode = this.nextButton.interactive = true;
    var i;
    for(i=0;i<this.cuadros.length;i++)
    {
        this.cuadros[i].buttonMode = this.cuadros[i].interactive = true;
    }

    this.soundsButton.buttonMode = this.soundsButton.interactive = false;
    //this.infoButton.buttonMode = this.infoButton.interactive = false;
    this.grenadesButton.buttonMode = this.grenadesButton.interactive = false;
    this.play.buttonMode = this.play.interactive = false;

    this.hamsterSelectedIndex = this.hamstersTypes.indexOf(gameEngine.userStorage.hamsterSelected);
    this.actualHamsterIndex = this.hamstersTypes.indexOf(gameEngine.userStorage.hamsterSelected);
    this.hamstersContainer.position.x = -defaultWidth * this.actualHamsterIndex;

    this.nextButton.scale.x = this.nextButton.scale.y = 0.9;
    this.backButton.scale.x = this.backButton.scale.y = 0.9;
    this.selectButton.scale.x = this.selectButton.scale.y = 0.9;

    this.nextButton.rotation = this.backButton.rotation = this.selectButton.rotation = 0;

    this.showConditions();

    if(this.actualHamsterIndex == 0)
    {
        this.backButton.filters = [new PIXI.GrayFilter()];
        this.backButton.alpha = 0.3;
    }
    else
    {
        this.backButton.filters = null;
        this.backButton.alpha = 1.0;
    }

    if(this.actualHamsterIndex == this.hamstersTypes.length - 1)
    {
        this.nextButton.filters = [new PIXI.GrayFilter()];
        this.nextButton.alpha = 0.3;
    }
    else
    {
        this.nextButton.filters = null;
        this.nextButton.alpha = 1.0;
    }

    this.selectButton.setTexture(PIXI.Texture.fromFrame("Tienda_Selected.png"));

    var i;
    for(i=0;i<this.hamstersArray.length;i++)
    {
        this.hamstersArray[i].visible = false;
    }
    this.hamstersArray[this.actualHamsterIndex].visible = true;

    if(this.tweenGoHome1 || this.tweenGoHome2)
    {
        this.tweenGoHome1.pause();
        this.tweenGoHome2.pause();
    }
    this.tweenGoShop1 = TweenLite.to(this.homeContainer.position, 0.3, {x:-defaultWidth,ease:Circ.easeOut,overwrite:"all"});
    this.tweenGoShop2 = TweenLite.to(this.shopContainer.position, 0.3, {x:0,ease:Circ.easeOut,overwrite:"all"});
}

GAME.MenuScene.prototype.goHome = function()
{
    this.homeContainer.buttonMode = this.homeButton.interactive = false;
    this.backButton.buttonMode = this.backButton.interactive = false;
    this.selectButton.buttonMode = this.selectButton.interactive = false;
    this.nextButton.buttonMode = this.nextButton.interactive = false;
    var i;
    for(i=0;i<this.cuadros.length;i++)
    {
        this.cuadros[i].buttonMode = this.cuadros[i].interactive = false;
    }

    this.soundsButton.buttonMode = this.soundsButton.interactive = true;
    //this.infoButton.buttonMode = this.infoButton.interactive = true;
    this.grenadesButton.buttonMode = this.grenadesButton.interactive = true;
    this.play.buttonMode = this.play.interactive = true;

    var i;
    for(i=0;i<this.hamstersArray.length;i++)
    {
        this.hamstersArray[i].visible = false;
    }

    if(this.tweenGoShop1 || this.tweenGoShop2)
    {
        this.tweenGoShop1.pause();
        this.tweenGoShop2.pause();
    }
    this.tweenGoHome1 = TweenLite.to(this.homeContainer.position, 0.3, {x:0,ease:Circ.easeOut,overwrite:"all"});
    this.tweenGoHome2 = TweenLite.to(this.shopContainer.position, 0.3, {x:defaultWidth,ease:Circ.easeOut,overwrite:"all"});
}

GAME.MenuScene.prototype.touchInfo = function()
{
    /*if(!this.infoContainer.visible)
    {
        sounds.play('ok_accept');

        this.play.interactive = this.play.buttonMode = false;
        this.soundsButton.interactive = this.soundsButton.buttonMode = false;
        this.infoButton.interactive = this.infoButton.buttonMode = false;
        this.grenadesButton.interactive = this.grenadesButton.buttonMode = false;

        this.infoMessage.position.y = -defaultHeight;
        this.cuadroNegro.alpha = 0;
        this.infoContainer.visible = true;
        TweenLite.to(this.infoMessage.position, 0.5, {y:0,ease:Circ.easeOut,overwrite:"all"});
        TweenLite.to(this.cuadroNegro, 0.5, {alpha:0.8,ease:Sine.easeInOut,overwrite:"all"});
    }
    else
    {
        sounds.play('cancel_close');

        this.play.interactive = this.play.buttonMode = true;
        this.soundsButton.interactive = this.soundsButton.buttonMode = true;
        this.infoButton.interactive = this.infoButton.buttonMode = true;
        this.grenadesButton.interactive = this.grenadesButton.buttonMode = true;
        this.infoContainer.visible = false;
    }*/
}

GAME.MenuScene.prototype.update = function(dt)
{
    var light;
    var i;
    var light;
	for(i=0;i<this.lights.length;i++)
    {
        light = this.lights[i];
        light.rotation += light.angularSpeed * dt;
    }

    var cloud;
    for(i=0;i<this.clouds.length;i++)
    {
        cloud = this.clouds[i];
        cloud.position.x += cloud.speed * dt;
        if(cloud.position.x - cloud.width*0.5 > defaultWidth)
        {
            cloud.position.x = -cloud.width*0.5;
        }
    }

    this.destello.rotation += Math.PI * 2 * dt;
}
