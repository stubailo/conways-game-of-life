Project 1
============

How to view/test
-----------------
To run the game, open `index.html` in a web browser.  This is already being hosted on [my server](http://massive.mit.edu:1234).

To test, run `npm install` in the root folder, then `grunt`.

Grunt is a task runner that will run mocha (the testing
framework) and jslint (style checker).

Overview
----------
`graphics.js`: The graphics code provided with the lab.
`conway.js`: The game logic.  The `run_game(element)` function at the end calls all of the relevant code.
`options.js`: Code for parsing options embedded in the URL hash.
`index.html`: The page that the game runs on.  It calls `run_game` in a script tag at the bottom.

Design challenges
------------------

### Representation of game board
#### Options
There are several options.  The first is a 2D array of Cell objects that keep track of their life or death.
This has the advantage of being extensible to different kinds of games, including ones that don't just involve
life or death.  However this results in a large increase in source code volume and potential errors.

Another is a 2D array of true and false values, true for alive and false for dead.  This one is simple and easy to
work with because it is impossible for a cell to acquire an invalid state.  It isn't extensible to games with more
than 2 states, but the increase in simplicity is significant.

A third possible choice is a representation of the game board as a string with a series of lines separated by
newline characters.  This representation is able to represent a very high number of possible states, and would make
for very easy debugging by just printing out the board.  However it would be hard to ensure that all states are valid.

#### Chosen representation
I decided to represent the board as a 2D array of boolean values.  This seemed to naturally reflect the states of alive
and dead and let the code be simpler by using the cell as a boolean variable in an if-statement.

### Rendering code
#### Options
One option is a model-view like architecture where the game model throws events on change, causing a re-render of
the game board.  This has the advantage of supporting many nice features and allowing easy switching of different
front-ends by using a different view class.  However, for this project it seemed unnecessary because the game logic
is very simple and there would only be one kind of event - the board change event that triggers a re-render of all
of the cells.  If the game required additional features in the rendering department it would be prudent to switch to
such a model, but it isn't necessary for the current specifications.

Another option is having a function that takes in a game board and renders it to a specified canvas.  This makes it
simple to do different rendering by calling a different rendering function, but makes it so that the render function
needs to be called manually when something changes in the game board.  This seemed to be good enough for the project
because the re-rendering times are very well defined (a render needs to happen exactly once per turn).

#### Chosen method
I chose to have a single function that takes in a board and a pad and renders the game state.  Since this option
only took several minutes to write and only has several lines of code, it isn't a wasted effort in case new
features require a more sophisticated event-based rendering system.

Nodes on Design
-----------------

My goal was to create a simple system that would accomplish the requirements of this part of the project.  In the case
that the requirements of the next part necessitate a switch to a more complex system, it will be easy to move the
functions in conway.js, which are very self-contained and each accomplish a very specific task, into a new framework.
