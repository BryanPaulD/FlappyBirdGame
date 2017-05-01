var birdSprites;
var backgroundSprite;
var cactiSprites;
var topMediumCactusSprite;
var bottomMediumCactusSprite;

function Sprite(img, x, y, width, height)
{
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

Sprite.prototype.draw = function(renderingContext, x, y) {
    renderingContext.drawImage(this.img, this.x, this.y, this.width, this.height, x, y, this.width, this.height);
};

function initSprites(img)
{
    birdSprites = [
        new Sprite(img, 0, 0, 75, 55),
        new Sprite(img, 0, 85, 75, 35),
        new Sprite(img, 0, 165, 75, 50),
        new Sprite(img, 0, 265, 75, 40)
    ];

    backgroundSprite = new Sprite(img, 750, 0, 900, 666);

    cactiSprites = [
        new Sprite(img, 125, 225, 215, 440), //bottom large
        new Sprite(img, 200, 0, 50, 95), //top small

        new Sprite(img, 370, 0, 130, 250), //top medium
        new Sprite(img, 370, 415, 130, 250), //bottom medium

        new Sprite(img, 620, 570, 50, 95), //bottom small
        new Sprite(img, 535, 0, 215, 430) //top large
    ];

    topMediumCactusSprite = cactiSprites[2];
    bottomMediumCactusSprite = cactiSprites[3];
}
