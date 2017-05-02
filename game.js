var currentState,
    width,
    height,
    frames = 0,
    theBird,
    theCacti,
    
    textAndButtonContainer,
    rowOneText,
    rowTwoText,
    theButton,
    
    theScore = 0;

var states = {
    splash: 0,
    game: 1,
    score: 2
};

var canvas,
    renderingContext


function CactusGroup()
{
    this.collection = [];

    this.reset = function() {
        this.collection = [];
    }

    this.add = function() {
        this.collection.push(new Cactus());
    }

    this.update = function() {
        if(frames % 100 === 0)
        {
            this.add();
        }

        for (var i = 0, len = this.collection.length; i < len; i++)
        {
            var cactus = this.collection[i];

            if(i === 0)
            {
                cactus.detectCollision();
                cactus.checkScore();
            }

            cactus.x -= 2;
            if(cactus.x < -cactus.width)
            {
                this.collection.splice(i, 1);
                i--;
                len--;
            }

        }
    }

    this.draw = function() {
        for (var i = 0, len = this.collection.length; i < len; i++)
        {
            var cactus = this.collection[i];
            cactus.draw();
        }
    }

}

function Cactus() 
{
    this.x = width;
    this.y = 0;

    this.width = topMediumCactusSprite.width;
    this.height = topMediumCactusSprite.height;

    this.scored = false;
    
    this.detectCollision = function() {

        if (this.x <= (theBird.x + theBird.width) && this.x >= theBird.x && theBird.y <= 95) 
        {
            currentState = states.score;
            checkHighScore();
            rowOneText.innerText = "Score: " + theScore + "   High score: localStorage.getItem("highScore") + " ";
            textAndButtonContainer.appendChild(rowTwoText);
            textAndButtonContainer.appendChild(theButton);
        }
        if (this.x <= (theBird.x + theBird.width) && this.x >= theBird.x && theBird.y >= 185)
        {
            currentState = states.score;
            checkHighScore();
            rowOneText.innerText = "Score: " + theScore + "   High score: localStorage.getItem("highScore") + " ";
            textAndButtonContainer.appendChild(rowTwoText);
            textAndButtonContainer.appendChild(theButton);
        }
    }

    // var cx = Math.min(Math.max(theBird.x, this.x), this.x + this.width);
    // var cy1 = Math.min(Math.max(theBird.y, this.y), this.y + this.height);
    // var cy2 = Math.min(Math.max(theBird.y, this.y + this.height + 110), this.y + 2 * this.height + 80);
    // // Closest difference
    // var dx = theBird.x - cx;
    // var dy1 = theBird.y - cy1;
    // var dy2 = theBird.y - cy2;
    // // Vector length
    // var d1 = dx * dx + dy1 * dy1;
    // var d2 = dx * dx + dy2 * dy2;
    // var r = theBird.radius * theBird.radius;
    // // Determine intersection
    // if (r > d1 || r > d2)
    // {
    //     currentState = states.score;
    // }


    this.draw = function() {
        topMediumCactusSprite.draw(renderingContext, this.x, this.y); 
        bottomMediumCactusSprite.draw(renderingContext, this.x, height - this.height);
    }

    this.checkScore = function() {
        if((this.x + this.width) < 150 && !this.scored) //If the bird passes the right edge of the cactus
        {
            theScore++;
            this.scored = true;
            rowOneText.innerText = "Score: " + theScore;
            
            console.log("Score: " + theScore);
        }
    }


}

//

function UserGuy()
{
    this.x = 0; 
    this.y = 130;
    this.width = 45;
    this.height = 55;

    this.frame = 0;
    this.velocity = 0;
    this.animation = [0, 1, 2, 3];

    this.rotation = 0;
    this.radius = 12;

    this.gravity = 0.35;
    this._jump = 4.5; 

    this.flap = function() { 
        this.velocity = -this._jump;
    }

    this.update = function() {
        var h = currentState === states.splash ? 15 : 10; 
        this.frame += frames % h === 0 ? 1 : 0 
        this.frame %= this.animation.length;

        if(currentState === states.splash)
        {
            this.updateIdleBird();
        }
        else
        {
            this.updatePlayingBird();
        }
    };

    this.updateIdleBird = function() //This function does nothing, so why does it exist? 
    {
        // this.y = 250;
    };

    this.updatePlayingBird = function()
    {
        this.velocity += this.gravity;
        this.y += this.velocity;

        this.ground = 300;
        //Checks if the dude hits the ground and stays there.
        if(this.y >= this.ground)
        {
            this.y = this.ground;
            this.velocity = this._jump;
            currentState = states.score;
            checkHighScore();
            rowOneText.innerText = "Score: " + theScore + "   High score: localStorage.getItem("highScore") + " ";
            textAndButtonContainer.appendChild(rowTwoText);
            textAndButtonContainer.appendChild(theButton);
        }
    };

    this.draw = function(renderingContext) {

        renderingContext.save(); 

        renderingContext.translate(this.x, this.y);
        renderingContext.rotate(this.rotation);

        if(currentState === states.splash || currentState === states.game)
        {
            var h = this.animation[this.frame]; 
            birdSprites[h].draw(renderingContext, 20, this.y);
        }
        else
        {
            birdSprites[0].draw(renderingContext, 20, theBird.y);
        }

        renderingContext.restore();
    };

}


function onpress(evt) //This evt parameter is not used, so why does it exist? 
{
    switch (currentState)
    {
        case states.splash:
            theBird.flap();
            currentState = states.game;
            rowOneText.innerText = "Score: ";
            break;
        case states.game:
            theBird.flap();
            break;
    }

}






function executeJS()
{
    setUpWindow();
    setUpCanvas();
    currentState = states.splash;
    document.body.appendChild(canvas);

    textAndButtonContainer = document.createElement("div");
    textAndButtonContainer.id = "box";
    document.body.appendChild(textAndButtonContainer);

    rowOneText = document.createElement("span");
    rowOneText.className = "text";
    rowOneText.innerText = "Click to play";
    textAndButtonContainer.appendChild(rowOneText);

    rowTwoText = document.createElement("span");
    rowTwoText.className = "text";
    rowTwoText.innerText = "You died!";
    //I don't append rowTwoText here.

    theButton = document.createElement("input");
    theButton.id = "theButton";
    theButton.setAttribute("type", "button");
    theButton.setAttribute("value", "Play again");
    // theButton.onclick = resetGame();

    //I don't append theButton here.
    
    loadGraphics();
    theBird = new UserGuy();

    theCacti = new CactusGroup();
}

function setUpWindow()
{
    var inputEvent = "touchstart";
    var windowWidth = window.innerWidth;
    console.log(windowWidth);
    if(windowWidth < 500)
    {
        width = 320;
        height = 430;
    }
    else
    {
        width = 900;
        height = 666;
        inputEvent = "mousedown";
    }
    document.addEventListener("mousedown", onpress); 
}

function setUpCanvas()
{
    canvas = document.createElement("canvas");
    canvas.style.border = "4px solid black";
    canvas.id = "canvas";
    canvas.width = width;
    canvas.height = height;
    renderingContext = canvas.getContext("2d");
}




function checkHighScore()
{
    // Check browser support
    if (typeof(Storage) !== "undefined" && theScore > localStorage.getItem("highScore"))
    {
        // Store
        localStorage.setItem("highScore", theScore);
        // Retrieve
        console.log(localStorage.getItem("highScore"));
    }
}

function resetGame()
{
    currentState = states.splash;
    theCacti.reset();
    rowOneText.innerText = "Click to play";
    textAndButtonContainer.removeChild(rowTwoText);
    textAndButtonContainer.removeChild(theButton);
    theBird.y = 130;
    theScore = 0;
}

function loadGraphics()
{
    var spriteSheet = new Image();
    spriteSheet.src = "spriteSheet.png";
    spriteSheet.onload = function() {
        initSprites(this);
        gameLoop();

    };
}

function gameLoop()
{
    update();
    render();
    window.requestAnimationFrame(gameLoop);
}

function update()
{
    frames++;
    theBird.update();

    if(currentState === states.game)
    {
        theCacti.update();
    }

}

function render()
{
    backgroundSprite.draw(renderingContext, 0, 0);
    theCacti.draw(renderingContext);
    theBird.draw(renderingContext);
}
