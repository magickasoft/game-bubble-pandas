var GAME = GAME || {};

GAME.LevelManager = function(gameScene)
{
    this.gameScene = gameScene;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "json/levels.json", true);
    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          xhr.levelManager.jsonString = JSON.parse(xhr.responseText);;
        } else {
          console.error(xhr.statusText);
          xhr.levelManager.jsonString = null;
        }
      }
    };
    xhr.onerror = function (e) {
      console.error(xhr.statusText);
      xhr.levelManager.jsonString = null;
    };
    xhr.levelManager = this;
    xhr.send(null);

    this.secondsForShake1 = 5;
    this.secondsForShake2 = 1;

    this.playingShakeSlow = false;
    this.playingShakeFast = false;

    this.init();
}

// constructor
GAME.LevelManager.constructor = GAME.LevelManager;

GAME.LevelManager.prototype.init = function()
{
    this.level = 1;
    this.timeElapsed = 0;
}

GAME.LevelManager.prototype.newRowTimeElapse = function()
{
    if(this.level > this.jsonString.levels.length) return this.jsonString.levels[this.jsonString.levels.length - 1].newRowTimeElapse;
    else return this.jsonString.levels[this.level - 1].newRowTimeElapse;
}

GAME.LevelManager.prototype.bubbleTypesAccepted = function()
{
    if(this.level > this.jsonString.levels.length) return this.jsonString.levels[this.jsonString.levels.length - 1].bubbleTypesAccepted;
    else return this.jsonString.levels[this.level - 1].bubbleTypesAccepted;
}

GAME.LevelManager.prototype.probabilityRockAppear = function()
{
    if(this.level > this.jsonString.levels.length) return this.jsonString.levels[this.jsonString.levels.length - 1].probabilityRockAppear;
    else return this.jsonString.levels[this.level - 1].probabilityRockAppear;
}

GAME.LevelManager.prototype.rowsAppearing = function()
{
    if(this.level > this.jsonString.levels.length) return this.jsonString.levels[this.jsonString.levels.length - 1].rowsAppearing;
    else return this.jsonString.levels[this.level - 1].rowsAppearing;
}

GAME.LevelManager.prototype.scoreNeeded = function()
{
    if(this.jsonString !== null) return 1000;
    if(this.level > this.jsonString.levels.length) return this.jsonString.levels[this.jsonString.levels.length - 1].scoreNeeded;
    else return this.jsonString.levels[this.level - 1].scoreNeeded;
}

GAME.LevelManager.prototype.update = function(dt)
{
    this.timeElapsed += dt;

    var newRowTimeElapse = this.newRowTimeElapse();

    //Shake effect
    if(this.timeElapsed > newRowTimeElapse - this.secondsForShake2)
    {
        if(!this.playingShakeFast)
        {
            this.playingShakeFast = true;
            sounds.play('shake_fast');
        }
        this.gameScene.bubblesContainer.position.x = defaultWidth*0.004 * Math.sin( 70 * this.timeElapsed );
    }
    else if(this.timeElapsed > newRowTimeElapse - this.secondsForShake1)
    {
        if(!this.playingShakeSlow)
        {
            this.playingShakeSlow = true;
            sounds.play('shake_slow');
        }
        this.gameScene.bubblesContainer.position.x = defaultWidth*0.003 * Math.sin( 40 * this.timeElapsed );
    }
    else
    {
        this.playingShakeFast = this.playingShakeSlow = false;
        this.gameScene.bubblesContainer.position.x = 0;
    }

    if(this.timeElapsed > newRowTimeElapse)
    {
        this.timeElapsed -= newRowTimeElapse;
        this.gameScene.bubbleManager.newRow(this);
    }
}
