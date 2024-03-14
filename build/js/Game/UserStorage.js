var GAME = GAME || {};

GAME.UserStorage = function()
{
    if(typeof(Storage) !== "undefined")
    {
        if (!localStorage.isSoundsMute)
        {
            localStorage.isSoundsMute = "false";
        }

        if(localStorage.isSoundsMute == "false") this.isSoundsMute = false;
        else this.isSoundsMute = true;

        if (!localStorage.isMusicMute)
        {
            localStorage.isMusicMute = "false";
        }

        if(localStorage.isMusicMute == "false") this.isMusicMute = false;
        else this.isMusicMute = true;

        if(localStorage.score) this.score = Number(localStorage.score);
        else this.score = 0;

        if(localStorage.level) this.level = Number(localStorage.level);
        else this.level = 1;

        if(localStorage.hamsterSelected) this.hamsterSelected = localStorage.hamsterSelected;
        else this.hamsterSelected = "Lee";
    }
    else
    {
        this.isSoundsMute = false;
        this.isMusicMute = false;
        this.score = 0;
        this.level = 1;
        this.hamsterSelected = "Lee";
    }

    this.showEffects = true;
}

// constructor
GAME.UserStorage.constructor = GAME.UserStorage;

GAME.UserStorage.prototype.reset = function()
{
    this.score = 0;
    this.level = 1;
    this.isSoundsMute = false;
    this.isMusicMute = false;

    this.hamsterSelected = "Lee";

    if(typeof(Storage) !== "undefined")
    {
        this.save();
    }
}

GAME.UserStorage.prototype.save = function()
{
	if(typeof(Storage) !== "undefined")
    {
    	//isMute
    	if(this.isSoundsMute) localStorage.isSoundsMute = "true";
    	else localStorage.isSoundsMute = "false";

        if(this.isMusicMute) localStorage.isMusicMute = "true";
        else localStorage.isMusicMute = "false";

    	//Nivel actual
    	localStorage.score = this.score;

        localStorage.level = this.level;

        localStorage.hamsterSelected = this.hamsterSelected;
    }
}
