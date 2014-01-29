(function(win, doc, $) {
  'use strict';

  Terminal.addCommand('todos', 'Shows the TODOs of my homepage. (Not an exhaustive list, of course.)', function(args, done) {
    this.appendLine('I might do the following things:');
    this.appendLine('- Play command, so we can play a game of space invaders');
    this.appendLine('- On failed command, suggest existing similar ones');
    this.appendLine('- Colors');
    this.appendLine('- Images and Videos in the terminal (Comics and stuff)');
    this.appendLine('- Artificial Intelligence');
    this.appendLine('- Say that you need a modern browser to really watch this site.');
    this.appendLine('- Write tests');
    this.appendLine('- More funny stuff');
    this.appendLine('- Something that makes sense');
    this.appendLine('- Port useful things from the bash, like aliases, dot files');
    this.appendLine('- Dont show intro every time');
    this.appendLine('- Saving and Viewing Comments / Mails');
    done();
  });

  Terminal.addCommand('intro', 'Plays my intro scripts, you already have seen.', function(args, done) {
    var skript = new TypeScript($('#intro-script').val());
    skript.run(this, done);
  });

  Terminal.addCommand('why', 'The reason why this exists.', function(args, done) {
    var skript = new TypeScript($('#reason-why').val());
    skript.run(this, done);
  });
  Terminal.addCommand('why?', 'why');
  Terminal.addCommand('about', 'why');

  Terminal.addCommand('contact', 'Will give you contact informations.', function(args, done) {
    var skript = new TypeScript($('#contact-details').val());
    skript.run(this, done);
  });

  Terminal.addCommand('profiles', 'My profiles in the world wide web.', function(args, done) {
    var skript = new TypeScript($('#my-profiles').val());
    skript.run(this, done);
  });

  Terminal.addCommand('projects', 'The projects I choose put online. If you want to know/see more, ask me.', function(args, done) {
    var skript = new TypeScript($('#my-projects').val());
    skript.run(this, done);
  });

  var GAMES = {
    'spaceinvaders': function(terminal, done) {
      function startSpaceInvaders() {
        var canvasId    = 'space-invader-game',
            gameElement = doc.getElementById(canvasId),
            game;

        if (!gameElement) {
          $('body').append('<canvas id="' + canvasId + '"></canvas>');
        }
        game = new SpaceInvaders(canvasId);

        terminal.disable();
        $('body').on('keyup', function siKeyListener(event) {
          if (event.which === 81) { // Q
            $('body').off('keyup', siKeyListener);
            terminal.enable();
            $('#' + canvasId).remove();
            done();
          }
        });
        terminal.appendLine('Press Q to quit.');
      }

      if (win.SpaceInvaders) {
        startSpaceInvaders();
      } else {
        Terminal.utils.loadFile('bower_components/space_invaders/spaceinvaders.js', function(err) {
          if (err) {
            terminal.appendLine('Could not load game files.');
            done();
          } else {
            startSpaceInvaders();
          }
        });
      }
    }
  };

  Terminal.addCommand('play', 'Possible Games: SpaceInvaders', function(args, done) {
    var game = args.trim();
    if (GAMES[game]) {
      GAMES[game](this, done);
    } else {
      this.appendLine('Usage: play GAME');
      this.appendLine('Possible games: ' + Object.keys(GAMES).join(', '));
      done();
    }
  });

  win.Terminal = Terminal;
}(window, document, jQuery));
