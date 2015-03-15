var draw = function (snakeToDraw, apple)
{
	var drawableSnake = { color: "green", pixels: snakeToDraw };
	  var drawableApple = { color: "red", pixels: [apple] };
	  var drawableObjects = [drawableSnake, drawableApple];
	  CHUNK.draw(drawableObjects);
}

//TODO: REwrite using switch statements
var moveSegment = function(segment) {
  if (segment.direction === "down") {
    return { top: segment.top + 1, left: segment.left }
  } else if (segment.direction === "up") {
    return { top: segment.top - 1, left: segment.left }
  } else if (segment.direction === "right") {
    return { top: segment.top, left: segment.left + 1 }
  } else if (segment.direction === "left") {
    return { top: segment.top, left: segment.left - 1 }
  }
  return segment;
}


//TODO: change this horrible function name
var segmentFurtherForwardThan = function (index, snake)
{
	if (snake[index - 1] === undefined) {
	  return snake[index];
	} else {
	  return snake[index - 1];
	}
}


var moveSnake = function (snake)
{
	/*
	//This code only moves the 1st segment in the snake
	var oldSegment = snake[0];
	var newSegment = moveSegment(oldSegment);
	newSegment.direction = oldSegment.direction;
	var newSnake = [newSegment];
	return newSnake;
	*/

	/*
	//array.map can be used instead of array.forEach
	var newSnake = [];
  	snake.forEach(function(oldSegment) {
	    var newSegment = moveSegment(oldSegment);
	    newSegment.direction = oldSegment.direction;
	    newSnake.push(newSegment);
	  });
	*/

	//make the segment follow the segment ahead of it
  	return snake.map(function(oldSegment, segmentIndex) {
	    var newSegment = moveSegment(oldSegment);
	    newSegment.direction = segmentFurtherForwardThan(segmentIndex, snake).direction;
	    return newSegment;
	  });

  return newSnake;
}

var growSnake = function(snake) {
  var indexOfLastSegment = snake.length - 1;
  var lastSegment = snake[snake.length - 1];
  snake.push({ top: lastSegment.top, left: lastSegment.left });
  return snake;
}

var ate = function(snake, otherThing) {
  var head = snake[0];
  return CHUNK.detectCollisionBetween([head], otherThing);
}

var advanceGame = function()
{
	var newSnake = moveSnake(snake);

    if (ate(newSnake, snake)) {
      CHUNK.endGame();
      CHUNK.flashMessage("Woops! You ate yourself!");
    }

    if (ate(newSnake, [apple])) {
      newSnake = growSnake(newSnake);
      apple = CHUNK.randomLocation();
    }

    if (ate(newSnake, CHUNK.gameBoundaries())) {
      CHUNK.endGame();
      CHUNK.flashMessage("Woops! you hit a wall!");
    }

    snake = newSnake;
    draw(snake, apple);
}

var changeDirection = function(direction) {
  snake[0].direction = direction;
}


//apple objecct
var apple = {top:8, left:10};
//snake object with it's initial settings
var snake = [{ top: 1, left: 0, direction: "down" }, { top: 0, left: 0, direction: "down" }];
//moves snake every second
CHUNK.executeNTimesPerSecond(advanceGame, 1);
//when the arrow key is pressed change directions
CHUNK.onArrowKey(changeDirection);