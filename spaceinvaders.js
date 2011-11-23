// requestAnim shim layer by Paul Irish
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var ArcadeFont = {
  alphabet: {
    'A': '28,54,99,99,127,99,99',
    'B': '63,99,99,63,99,99,63',
    'C': '62,99,3,3,3,99,62',
    'D': '31,51,99,99,99,51,31',
    'E': '127,3,3,63,3,3,127',
    'F': '63,3,3,31,3,3,3,0',
    'G': '62,99,3,115,99,99,62',
    'H': '99,99,99,127,99,99,99,0',
    'I': '30,12,12,12,12,12,30,0',
    'J': '96,96,96,96,96,99,62',
    'K': '99,51,27,15,27,51,99',
    'L': '3,3,3,3,3,3,127',
    'M': '99,119,127,107,99,99,99',
    'N': '99,103,111,127,123,115,99',
    'O': '62,99,99,99,99,99,62',
    'P': '63,99,99,99,63,3,3',
    'Q': '62,99,99,99,123,51,94',
    'R': '63,99,99,63,27,51,99',
    'S': '62,99,3,127,96,99,62',
    'T': '63,12,12,12,12,12,12',
    'U': '99,99,99,99,99,99,62',
    'V': '99,99,99,99,54,28,8',
    'W': '99,99,99,107,127,119,99',
    'X': '99,119,62,28,62,119,99',
    'Y': '51,51,51,30,12,12,12',
    'Z': '127,112,56,28,14,7,127',
    ' ': '0,0,0,0,0,0,0',
    '1': '12,14,12,12,12,12,63',
    '2': '62,99,112,60,6,3,127',
    '3': '126,48,24,60,96,99,62',
    '4': '56,60,54,51,127,48,48',
    '5': '127,3,63,96,96,99,62',
    '6': '62,99,3,63,99,99,62',
    '7': '127,96,48,24,12,12,12',
    '8': '62,99,99,62,99,99,62',
    '9': '62,99,99,126,96,99,62',
    '0': '62,99,99,99,99,99,62'
  },

  // space between letters
  gutter: 2,

  blueprint: function(text) {
    var blueprint = [],
        letter, letterCode, line, g, i, l, j;
    text = text.toUpperCase();
    for (i in text) {
      letterCode = this.alphabet[text[i]].split(',');

      for (j = 0, l = letterCode.length; j<l; ++j) {
        line = EightBit.decodeNumber(letterCode[j], 7);
        if (!blueprint[j]) {
          blueprint[j] = '';
        }
        blueprint[j] += line;
        for (g = this.gutter; g--;) {
          blueprint[j] += '0';
        }
      }
    }
    return blueprint.join('\n');
  }
};
var EightBit = {
  encode: function(str) {
    var codes = [],
        lines = str.split('\n'),
        i, l;
    for (i = 0, l = lines.length; i<l; ++i) {
      codes.push(this.encodeLine(lines[i]));
    }
    return codes.join(',');
  },

  decode: function(code, base) {
    var result = [],
        lines = code.split(','),
        i, l;
    for (i = 0, l = lines.length; i<l; ++i) {
      result.push(this.decodeNumber(lines[i], base));
    }
    return result.join('\n');
  },

  encodeLine: function(line) {
    var x = 0;
    for (var i in line) {
      x += line[i] === '1' ? Math.pow(2, i) : 0;
    }
    return x;
  },

  decodeNumber: function(nr, base) {
    var line = '',
        i, p;
    for (i = base; i--;) {
      p = Math.pow(2, i);
      if (p <= nr) {
        nr -= p;
        line = '1' + line;
      } else {
        line = '0' + line;
      }
    }
    return line;
  }
}

var redraw = function(calcBox) {
  var ctx = this.element.getContext('2d'),
      rows = this.blueprint.split('\n'),
      row, pixel;
  ctx.fillStyle = 'rgba(' + this.color + ', ' + 1 + ')';
  for (var y=0,yl=rows.length; y<=yl; ++y) {
    row = rows[y] || '';
    for (var x=0,xl=row.length; x<=xl; ++x) {
      pixel = row[x];
      if (pixel === '1') {
        ctx.fillRect(Math.round(this.x + this.pixelSize * x), Math.round(this.y + this.pixelSize * y), this.pixelSize, this.pixelSize);

        // do this only on start
        if (calcBox) {
          this.boundingBox.width = Math.max(this.boundingBox.width, this.pixelSize * x + this.pixelSize);
        }
      }
    }
    if (calcBox) {
      this.boundingBox.height += this.pixelSize;
    }
  }
};

// calculates if element hits this element
var isHit = function(object) {
  var box    = this.boundingBox,
      objBox = object.boundingBox;

  if (this.y + box.height < object.y) return false;
	if (this.y > object.y + objBox.height) return false;

	if (this.x + box.width < object.x) return false;
	if (this.x > object.x + objBox.width) return false;
  return true;
};

var explode = function(particles) {
  var row,
      rows = this.blueprint.split('\n'),
      pixel, variR, variG, variB, colors;
  for (var y=0,yl=rows.length; y<=yl; ++y) {
    row = rows[y] || '';
    for (var x=0,xl=row.length; x<=xl; ++x) {
      pixel = row[x];
      if (pixel === '1') {
        colors = this.color.split(',');
        for (var i=0; i<colors.length; ++i) {
          colors[i] = Math.round(parseInt(colors[i], 10) + Math.random() * 80 - 40);
          colors[i] = Math.min(255, colors[i]);
          colors[i] = Math.max(0, colors[i]);
        }
        particles.push(new Particle(this.element, {
          color:     colors.join(','),
          pixelSize: this.pixelSize,
          x: Math.round(this.x + this.pixelSize * x),
          y: Math.round(this.y + this.pixelSize * y),
          velX: Math.random() * 380 -200,
          velY: -Math.random() * (10 + 270),
          gravity: 100,
          drag:    0.96,
          fade:    0.01 + (Math.random() * 0.01)
        }));
      }
    }
  }
};

var Text = function(canvas, text, config) {
  config = config || {};
  $.extend(this, config);
  this.element = canvas;

  // here goes the bounding box in
  this.boundingBox = {
    width: 0, height: 0
  };
  this.setText(text);
};
Text.prototype.redraw = redraw;
Text.prototype.explode = explode;
Text.prototype.setText = function(text) {
  this.blueprint = ArcadeFont.blueprint(text.toString());
  this.redraw(true);
};

var Canon = function(canvas, config) {
  config = config || {};
  $.extend(this, config);
  this.blueprint = EightBit.decode(this.blueprint, this.base);
  this.element = canvas;

  // here goes the bounding box in
  this.boundingBox = {
    width: 0, height: 0
  };

  this.redraw(true);
};
Canon.prototype.redraw = redraw;
Canon.prototype.isHit = isHit;
Canon.prototype.explode = explode;

var Invader = function(canvas, config) {
  var element = document.createElement('canvas');
  config = config || {};
  this.points = 1;
  $.extend(this, config);
  element.width = this.maxWidth * this.pixelSize;
  element.height = this.maxHeight * this.pixelSize;
  this.element = canvas;

  // here goes the bounding box in
  this.boundingBox = {
    width: 0, height: 0
  };

  this.redraw(true);
};
Invader.prototype.redraw = redraw;
Invader.prototype.shoot = function(bulletSpeed, bulletSize) {
  return new Bullet(this.element, {
    speed: bulletSpeed,
    color: '255, 255, 255',
    pixelSize: bulletSize,
    x: this.x + this.boundingBox.width/2,
    y: this.y + this.boundingBox.height
  });
};
Invader.prototype.explode = explode;
Invader.prototype.isHit = isHit;

var Bullet = function(canvas, config) {
  this.canvas = canvas;
  this.ctx = canvas.getContext('2d');
  $.extend(this, config);
  this.boundingBox = { width: this.pixelSize, height: this.pixelSize };
};
Bullet.prototype.update = function(timeDiff) {
  this.y += this.speed * timeDiff;
  this.ctx.fillStyle = 'rgba(' + this.color + ', 1)';
  this.ctx.fillRect(Math.round(this.x), Math.round(this.y), this.pixelSize, this.pixelSize);

  // remove if outside viewscope
  if (this.y > this.canvas.height || this.y < -this.pixelSize) {
    return false;
  }
  return true;
};
Bullet.prototype.isHit = isHit;
Bullet.prototype.explode = function(particles) {
  for (var xi=this.pixelSize; xi--;) {
    for (var yi=this.pixelSize; yi--;) {
      colors = [255, 255, 255];
      for (var i=3; i--;) {
        colors[i] = Math.round(255, -Math.random() * 25);
      }
      particles.push(new Particle(this.canvas, {
        color:     colors.join(','),
        pixelSize: this.pixelSize,
        x: Math.round(this.x + xi),
        y: Math.round(this.y + yi),
        velX: Math.random() * 380 -200,
        velY: -Math.random() * (10 + 270),
        gravity: 100,
        drag:    0.95,
        fade:    0.01 + (Math.random() * 0.01)
      }));
    }
  }
};

var Particle = function(canvas, config) {
  var ctx = canvas.getContext('2d');
  this.size = config.pixelSize;
  this.boundingBox = { width: this.size, height: this.size };
  this.alpha = 1;

  this.update = function(timeDiff) {
    config.velY = config.velY * config.drag;
    config.velX = config.velX * config.drag;
    config.y += (config.velY + config.gravity) * timeDiff;
    config.x += config.velX * timeDiff;

    this.alpha -= config.fade || 0;
    this.size *= config.shrink || 1;

    // render it
    ctx.fillStyle = 'rgba(' + config.color + ', ' + this.alpha + ')';
    ctx.fillRect(Math.round(config.x), Math.round(config.y), this.size, this.size);

    // if not visible anymore return false for removing
    return this.alpha >= 0.01;
  };
};

var Game = function(canvas, config) {
  var MAX_PIXEL     = 12,
      IS_MOBILE     = window.DeviceOrientationEvent,

      invaders      = [],
      bullets       = [],
      enemyBullets  = [],
      particles     = [],

      // points of the player
      score         = 0,
      scoreDisplay,
      missedShots   = 0,
      // level 1-5 = n+2 invaders, level >5 more speed
      level         = 1,
      // number of Invaders that are left on screen
      numInvaders   = 0,
      // start moving to the right
      movingRight   = true,
      // speed of invades in pixels per second
      speed         = 40,
      incEnemySpeed = 20,
      canonSpeed    = 130,
      // allow two shots per second
      canonFreq     = 500,
      canonLastShot = 0,
      bulletSpeed   = 100,
      enemyBulletSpeed = 100,

      // mothership stuff
      mothership,
      mothershipCount    = 0,
      lastMothershipTime = new Date(),
      mothershipMovingRight,

      lastLoopTime  = new Date(),
      ctx           = canvas.getContext('2d'),
      invadersWidth = 0,
      xOffset       = config.gutter,

      // probability of enemy fire
      enemyShootProbability = .075,
      incEnemyShootProb     = .05,

      // allow looping
      doLoop       = true,
      ended        = false,

      // written Texts on screen
      screenObjects = [],
      pauseText,

      canon;

  startGame();
  start();

  loop();
  
  function startGame() {
    scoreDisplay = new Text(canvas, score, {
      color:     '205,212,75',
      pixelSize: 2,
      x:         canvas.width - 50,
      y:         5
    });
    scoreDisplay.x = canvas.width - scoreDisplay.boundingBox.width - 5;
    screenObjects.push(scoreDisplay);
  }

  function start() {
    var possibleColors = [
//          '0,255,128',
//          '3,28,255',
//          '255,255,0',
      '255,151,94',
      '255,182,240',
      '195,255,232',
      '182,255,252',
      '197,255,182',
      '255,242,117'
    ];
    var invaderRow,
        y = 0,
        x = 0,
        numRows = 0,
        color; // width of greatest row
    // create invaders
    $.each(config.invaders, function(type, code) {
      invaderRow = [];
      if (++numRows > level+2) { return; }
      color = possibleColors[Math.floor(Math.random()*possibleColors.length)]
      for (var i=0; i<config.numPerRow; ++i) {
        x = xOffset + i * (config.gutter + MAX_PIXEL * config.pixelSize);
        invaderRow.push(new Invader(canvas, {
          blueprint: EightBit.decode(code, config.invaderBase),
          color:     color,
          pixelSize: config.pixelSize,
          x: x,
          y: config.offset + y * MAX_PIXEL * config.pixelSize
        }));
        invadersWidth = Math.max(x, invadersWidth);
        ++numInvaders;
      }
      invaders.push(invaderRow);
      ++y;
    });

    // create Player
    if (!canon) {
      canon = new Canon(canvas, {
        blueprint: '32,112,1022,2047,2047,2047',
        base:      11,
        color:     '255,82,75',
        pixelSize: config.pixelSize,
        x:         canvas.width / 2,
        y:         canvas.height - 30
      });

      $(window).bind('keydown keyup', keyHandler);

      /*var one = true;
      window.ondevicemotion = function(event) {
        one && console.log(event);
        one = false;
        showEndScreen(IS_MOBILE ? "MOBILE": "false");
      }
      window.addEventListener*/
    }
    if (level > 5) {
      enemyShootProbability += incEnemyShootProb;
      speed += incEnemySpeed;
    }
  }

  function keyHandler(event) {
    if (!canon) { return; }
    var value   = event.type === 'keydown',
        keyCode = event.which,
        time;
    if (keyCode === 37 || keyCode === 65) {
      // right on A or Arrow left
      canon.left = value;
    } else if (keyCode === 39 || keyCode === 68) {
      // right on D or Arrow right
      canon.right = value;
    } else if (keyCode === 80 && value) {
      // P for Pause
      doLoop = !doLoop;
      if (doLoop) {
        lastLoopTime = new Date();
        loop();
        $('#end-screen').hide();
        pauseText.explode(particles);
        var index = $.inArray(pauseText, screenObjects);
        if (index > -1) {
          screenObjects.splice(index, 1);
        }
      } else {
        pauseText = showText('PAUSE');
      }
    } else if (keyCode === 32 && value) {
      time = new Date();
      // shoot on space
      if (canonFreq < time - canonLastShot) {
        bullets.push(new Bullet(canvas, {
          speed: -bulletSpeed,
          color: '255, 255, 255',
          pixelSize: config.bulletSize,
          x: canon.x + canon.boundingBox.width/2,
          y: canon.y
        }));
        canonLastShot = time;
      }
    }
  }

  function eachInvader(callback) {
    for (var r=invaders.length; r--;) {
      for (var i=invaders[r].length; i--;) {
        if (callback(invaders[r][i]) === false) {
          invaders[r].splice(i, 1);
          if (!invaders[r].length) {
            invaders.splice(r, 1);
          }
        }
      }
    }
  }

  function randomInvader() {
    var r = Math.floor(Math.random() * invaders.length);
    return invaders[r][Math.floor(Math.random() * invaders[r].length)];
  }

  function showEndScreen() {
    var obj = showText('GAME OVER');
    ended = true;
    setTimeout(function() {
      obj.explode(particles);
      var index = $.inArray(obj, screenObjects);
      if (index > -1) {
        screenObjects.splice(index, 1);
      }
      ended = true;
    }, 5000);
  }

  function showText(text) {
    var obj = new Text(canvas, text, {
      color:     '205,212,75',
      pixelSize: 2,
      x:         canvas.width / 2 - 50,
      y:         canvas.height - 30
    });
    obj.x = (canvas.width - obj.boundingBox.width) / 2;
    obj.y = (canvas.height - obj.boundingBox.height) / 2;
    screenObjects.push(obj);
    return obj;
  }

  function addToScore(points) {
    score += points;
    scoreDisplay.setText(score);
    scoreDisplay.x = canvas.width - scoreDisplay.boundingBox.width - 5;
//        config.scoreBox.html(score);
  }

  function loop() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    var loopTime  = new Date(),
        timeDiff  = (loopTime - lastLoopTime) / 1000, // in ms
        switchDir = false;
    
    // cap time difference. So if we switch tab, we do not make that a hugh leap
    timeDiff = Math.min(50, timeDiff);
    if (timeDiff > 100) {
      lastLoopTime = loopTime;
      doLoop && window.requestAnimFrame(loop);
      return;
    }

    // draw/move yourself
    if (canon) {
      if (canon.right) {
        canon.x += canonSpeed * timeDiff;
        canon.x = Math.min(canon.x, canvas.width - xOffset - canon.boundingBox.width);
      } else if (canon.left) {
        canon.x -= canonSpeed * timeDiff;
        canon.x = Math.max(canon.x, xOffset);
      }
      canon.redraw();
    }

    // draw/move all invaders
    eachInvader(function(invader) {
      invader.x += (movingRight ? 1 : -1) * speed * timeDiff;
      invader.redraw();
      if ((movingRight && invader.x + invader.boundingBox.width > (canvas.width - xOffset)) ||
          (!movingRight && invader.x < xOffset)) {
        switchDir = true;
      }
    });
    if (switchDir) {
      canon && eachInvader(function(invader) {
        invader.y += config.invaderVelY;
      });
      movingRight = !movingRight;
    }

    // draw/move all bullets
    //$.each(bullets, function(i, bullet) { bullet && bullet.update(timeDiff); });
    for (var i=bullets.length; i--;) {
      if (!bullets[i].update(timeDiff)) {
        bullets.splice(i, 1);
        ++missedShots;
      }
    }
    for (var i=enemyBullets.length; i--;) {
      if (!enemyBullets[i].update(timeDiff)) {
        enemyBullets.splice(i, 1);
      }
    }

    // draw/move all particles
    //$.each(particles, function(i, particle) { if (particle && !particle.update(timeDiff)) { particle = null }; });
    for (var i=particles.length; i--;) {
      if (!particles[i].update(timeDiff)) {
        particles.splice(i, 1);
      }
    }

    // check collisions and remove elements (with smashing effects)
    eachInvader(function(invader) {
      var keepIt = true;
      for (var i=bullets.length; i--;) {
        if (keepIt && invader.isHit(bullets[i])) {
          addToScore(invader.points);
          invader.explode(particles);
          keepIt = false;
          bullets.splice(i, 1);
          --numInvaders;
        }
      }
      return keepIt;
    });

    // check collision of bullets
    for (var i=enemyBullets.length; i--;) {
      for (var j=bullets.length; j--;) {
        if (enemyBullets[i] && enemyBullets[i].isHit(bullets[j])) {
          bullets.splice(j, 1);
          enemyBullets[i].explode(particles);
          enemyBullets.splice(i, 1);
        }
      }
    }

    // check if canon is hit
    for (var i=enemyBullets.length; i--;) {
      if (canon && canon.isHit(enemyBullets[i])) {
        canon.explode(particles);
        canon = null;
        enemyBullets.splice(i, 1);
      }
    }

    // invader shoot logic
    if (canon && numInvaders && Math.random() < enemyShootProbability) {
      enemyBullets.push(randomInvader().shoot(enemyBulletSpeed, config.bulletSize));
    }


    if (!numInvaders && !particles.length) {
      //doLoop = false;
      //showEndScreen('YOU WON!!! ' + score + ' points');
      ++level;
      start();
    }
    if (!ended && !canon && !particles.length && !bullets.length) {
      showEndScreen();
      //doLoop = false;
      //showEndScreen('GAME OVER!!!<br>' + score + ' points.<br>You missed ' + missedShots + ' times.');
    }

    // create/draw/move mothership
    if (mothership) {
      mothership.x += (mothershipMovingRight ? 1 : -1) * config.mothership.speed * timeDiff;
      mothership.redraw();

      for (var i=bullets.length; i--;) {
        if (mothership.isHit(bullets[i])) {
          addToScore(mothership.points);
          mothership.explode(particles);
          mothership = null;
          bullets.splice(i, 1);
          lastMothershipTime = loopTime;
        }
      }

      if (mothership && (mothership.x > canvas.width + 20 || mothership.x < mothership.boundingBox.width - 20)) {
        // we missed the mothership
        mothership = null;
      }
    } else {
      if ((mothershipCount <= level || ended) && lastMothershipTime < loopTime - config.mothership.minTime*1000 && Math.random() < config.mothership.probability) {
        mothershipMovingRight = Math.random() < .5;
        mothership = new Invader(canvas, {
          blueprint: EightBit.decode(config.mothership.blueprint, config.mothership.base),
          color:     config.mothership.color,
          pixelSize: config.pixelSize,
          x: canvas.width,
          y: 6,
          points: 10
        });
        mothership.x = mothershipMovingRight ? -mothership.boundingBox.width : canvas.width;
        ++mothershipCount;
      }
    }

    // draw other objects
    for (var i=screenObjects.length; i--;) {
      screenObjects[i].redraw();
    }

    // draw ground
    //ctx.fillStyle ='rgb(10,189,20)';
    //ctx.fillRect(0, canvas.height-10, canvas.width, 10);

    lastLoopTime = loopTime;
    doLoop && window.requestAnimFrame(loop);
  }
};

$(document).ready(function() {
  var gameCanvas = document.getElementById('game');
  gameCanvas.width  = 500;
  gameCanvas.height = 400;

  new Game(gameCanvas, {
    pixelSize:    3,
    bulletSize:   3,

    numPerRow:    6,
    invaders:     {
      '#invader8': '260,136,508,886,2047,1533,1285,216,',
      '#invader2': '240,1020,4095,3687,4095,4095,360,660,1122,0',
      '#invader3': '144,2553,2925,3069,4095,240,504,612,1026',
      '#invader6': '240,2046,4095,3687,4095,504,876,3075',
      '#invader1': '264,144,1020,1020,3951,3069,3069,144,264,0',
      '#invader7': '260,1161,1533,1911,1022,1022,260,514'//,
//          '#invader5': '165,90,60,36'
    },
    invaderVelY:  10,
    invaderBase:  12,
    gutter:       20,
    offset:       60,

    mothership:   {
      blueprint:    '48,252,1023,819,510',
      base:         10,
      color:        '232,36,16',
      offset:       10,
      minTime:      15,
      probability:  .004,
      speed:        60,
      points:       20
    }
  });
});

/**
  TODOs:
  touchstart/move/stop events for mobile usage
  store scores + leaderboard??
  count plays
  loose if invaders reach bottom
  animations

  maybe in second version:
    bunkers
*/
