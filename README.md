Project 1
============

How to view/test
-----------------
To run the game, open `index.html` in a web browser.

To test, run `npm install` in the root folder, then `grunt`.

Grunt is a task runner that will run mocha (the testing
framework) and jslint (style checker).

Overview
----------
- `conway_utils.js`: The game logic, split into simple, convenient, easily testable functions.
- `conway.js`: This defines a Backbone model for a game object, and two views: one for the grid and one for the game controls.
- `options.js`: This defines a Backbone model for game options, and a view for an options panel to edit them.
- `index.html`: The page that the game runs on.  It initializes all of the models and views in a script tag at the bottom.
- `test/conway_tests.js`: Unit tests.

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

Additionally, for the second part of the project, I have wrapped the grid in a model class that helps deal with logic,
rendering, and events.

### Rendering code
#### Options
One option is a model-view like architecture where the game model throws events on change, causing a re-render of
the game board.  This has the advantage of supporting many nice features and allowing easy switching of different
front-ends by using a different view class, as well as different views for one model which is useful for creating
control panels and such.

Another option is having a function that takes in a game board and renders it to a specified canvas.  This makes it
simple to do different rendering by calling a different rendering function, but makes it so that the render function
needs to be called manually when something changes in the game board.

#### Chosen method
For the second part of the project, I switched to a Model-View system using Backbone.js.  This had many, many benefits
over the initial system.  First of all, it forced me to structure my code into models and views, cleanly separating
data and rendering.  It allowed me to create two views for the same game object - the controls (play/pause, turn counter,
clear button) and the actual grid.  It also allowed me to have the game model listen to the options model to detect
changes in settings.  If I were to extend the project with additional features in the future, using this model will
undoubtedly make my life easier.

Nodes on Design
-----------------

My design notes from the previous part of the project:

> "My goal was to create a simple system that would accomplish the requirements of this part of the project.  In the case
that the requirements of the next part necessitate a switch to a more complex system, it will be easy to move the
functions in conway.js, which are very self-contained and each accomplish a very specific task, into a new framework."

I would say I was correct in my assessment.  For this part of the project I switched entirely to using backbone for a lot
of the game functionality, but the core game logic runs on the same functions as before.  In switching to a completely new
rendering system, I had to edit exactly none of the actual game logic code, as expected.
