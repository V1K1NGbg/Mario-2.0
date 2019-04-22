
var game = new Phaser.Game(256, 240, Phaser.CANVAS, '', {
  preload: preload,
  create: create,
  update: update
}, false, false);

var test = false;
var real = true
var count = 0;
var points = 0;
var pointsText;
var liveText;
var gameovertext;
var timer;
var level = 1;
var place = 16;
var bulling;
var randomNumber = 1;
var playery;
var playerx;
var Rolecount = 0;
var rev = 1;
var effect = true;
var randomNumber2;
var win;
if (!lives) {
  var lives = 3;
}

function preload() {
  if (real == true) {
    loadTileMap();
    real = false;
  }
  if (level == 5) {
    game.load.spritesheet('tiles', '/img/tiles2.png', 16, 16);
    game.load.spritesheet('mario', '/img/mario2.png', 16, 16);
    game.load.spritesheet('kill', '/img/kill2.png', 16, 16);
    game.load.spritesheet('goomba', '/img/goomba2.png', 16, 16);
    game.load.spritesheet('coin', '/img/coin2.png', 16, 16);
    game.load.spritesheet('nextlevel', '/img/nextlevel2.png', 16, 16);
  } else {
    game.load.spritesheet('tiles', '/img/tiles.png', 16, 16);
    game.load.spritesheet('mario', '/img/mario.png', 16, 16);
    game.load.spritesheet('kill', '/img/kill.png', 16, 16);
    game.load.spritesheet('goomba', '/img/goomba.png', 16, 16);
    game.load.spritesheet('coin', '/img/coin.png', 16, 16);
    game.load.spritesheet('nextlevel', '/img/nextlevel.png', 16, 16);
    game.load.spritesheet('laser', '/img/laser.png', 16, 256);
    game.load.spritesheet('portal', '/img/portal.png', 16, 16);
    //game.load.spritesheet('laser', '/img/laser.png', 16, 256);
  }

}

function create() {

  //this.weapons.push(new Weapon.Beam(this.game));

  Phaser.Canvas.setImageRenderingCrisp(game.canvas)
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.physics.startSystem(Phaser.Physics.ARCADE);

  map = game.add.tilemap('level');
  map.addTilesetImage('tiles', 'tiles');
  map.setCollisionBetween(20, 40, true, 'solid');

  map.createLayer('background');

  layer = map.createLayer('solid');
  layer.resizeWorld();

  next = game.add.group();
  next.enableBody = true;
  map.createFromTiles(19, null, 'nextlevel', 'stuff', next);

  killer = game.add.group();
  killer.enableBody = true;
  map.createFromTiles(13, null, 'kill', 'stuff', killer);

  coins = game.add.group();
  coins.enableBody = true;
  map.createFromTiles(11, null, 'coin', 'stuff', coins);
  coins.callAll('animations.add', 'animations', 'spin', [0, 0, 1, 2], 3, true);
  coins.callAll('animations.play', 'animations', 'spin');

  portals = game.add.group();
  portals.enableBody = true;
  map.createFromTiles(18, null, 'portal', 'stuff', portals);

  goombas = game.add.group();
  goombas.enableBody = true;
  map.createFromTiles(33, null, 'goomba', 'stuff', goombas);
  goombas.callAll('animations.add', 'animations', 'walk', [0, 1], 2, true);
  goombas.callAll('animations.play', 'animations', 'walk');
  goombas.setAll('body.bounce.x', 1);
  goombas.setAll('body.velocity.x', -20 * rev);
  if (level == 5) {
    goombas.setAll('body.gravity.y', 0);
  } else {
    goombas.setAll('body.gravity.y', 500);
  }

  lasers = game.add.group();
  lasers.enableBody = true;
  map.createFromTiles(5, null, 'laser', 'stuff', lasers);

  player = game.add.sprite(place, game.world.height - 48, 'mario');
  game.physics.arcade.enable(player);
  player.body.gravity.y = 350 * rev;
  player.body.collideWorldBounds = true;
  player.animations.add('walkRight', [1, 2, 3], 10, true);
  player.animations.add('walkLeft', [8, 9, 10], 10, true);
  player.goesRight = false;

  game.camera.follow(player);

  timer = game.time.create(false);
  timer2 = game.time.create(false);
  timer3 = game.time.create(false);
  timer4 = game.time.create(false);

  cursors = game.input.keyboard.createCursorKeys();
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  pointsText = this.add.text(10, 10, 'coins: 0', { fontSize: '15px', fill: '#000' });
  pointsText.setText('coins: ' + points);
  pointsText.fixedToCamera = true;

  liveText = this.add.text(200, 10, 'lives: 3', { fontSize: '15px', fill: '#000' });
  liveText.setText('lives: ' + lives);
  liveText.fixedToCamera = true;

  gameovertext = this.add.text(0, 100, ' ', { fontSize: '17px', fill: '#FFF' });
  gameovertext.setText(' ');
  gameovertext.fixedToCamera = true;

}

function update() {

  //this.weapons[this.currentWeapon].fire(this.player);

  randomNumber = game.rnd.integerInRange(1, 3);
  randomColor = game.rnd.integerInRange(2, 2);
  //randomNumber2 = game.rnd.integerInRange(-3, 3);

  game.physics.arcade.collide(player, layer);
  game.physics.arcade.collide(goombas, layer);
  //game.physics.arcade.overlap(lasers, layer, laserOerlap);
  game.physics.arcade.overlap(player, goombas, goombaOverlap);
  game.physics.arcade.overlap(player, coins, coinOverlap);
  game.physics.arcade.overlap(player, portals, portalOverlap);
  game.physics.arcade.overlap(player, killer, killOverlap);
  game.physics.arcade.overlap(player, next, nextOverlap);

  if (player.body.enable) {
    if (level == 8) {
      player.body.velocity.x = 0;
      if (cursors.right.isDown) {
        player.body.velocity.x = -90 * rev;
        player.animations.play('walkLeft');
        player.goesRight = false;
      } else if (cursors.left.isDown) {
        player.body.velocity.x = 90 * rev;
        player.animations.play('walkRight');
        player.goesRight = true;
      } else {
        player.animations.stop();
        if (player.goesRight) player.frame = 0;
        else player.frame = 7;
      }

      if (cursors.down.isDown && player.body.onFloor()) {
        player.body.velocity.y = -190;
        player.animations.stop();
      }
      if (player.body.velocity.y != 0) {
        if (player.goesRight) player.frame = 5;
        else player.frame = 12;
      }
    } else {
      player.body.velocity.x = 0;
      if (cursors.left.isDown) {
        player.body.velocity.x = -90 * rev;
        if (level == 5) {
          player.animations.play('walkRight');
        } else {
          player.animations.play('walkLeft');
        }
        player.goesRight = false;
      } else if (cursors.right.isDown) {
        player.body.velocity.x = 90 * rev;
        if (level == 5) {
          player.animations.play('walkLeft');
        } else {
          player.animations.play('walkRight');
        }
        player.goesRight = true;
      } else {
        player.animations.stop();
        if (level == 5) {
          if (player.goesRight) player.frame = 7;
          else player.frame = 0;
        } else {
          if (player.goesRight) player.frame = 0;
          else player.frame = 7;
        }
      }

      if (cursors.up.isDown && player.body.onFloor() && level != 5) {
        player.body.velocity.y = -190;
        player.animations.stop();
      }
      if (cursors.up.isDown && player.body.onCeiling() && level == 5) {
        player.body.velocity.y = 190;
        player.animations.stop();
      }
      if (jumpButton.isDown && player.body.onFloor() && level != 5) {
        player.body.velocity.y = -190;
        player.animations.stop();
      }
      if (jumpButton.isDown && player.body.onCeiling() && level == 5) {
        player.body.velocity.y = 190;
        player.animations.stop();
      }
      if (player.body.velocity.y != 0 && level != 5) {
        if (player.goesRight) player.frame = 5;
        else player.frame = 12;
      }
      if (player.body.velocity.y != 0 && level == 5) {
        if (player.goesRight) player.frame = 12;
        else player.frame = 5;
      }
    }
  }

  if (test == true) {
    timer.loop(500, Movedie, player);
    timer.start();
  } else {
    timer.stop();
  }

  if (level == 3) {
    timer2.loop(500 * randomNumber, speedChange, player);
    timer2.start();
  } else {
    timer2.stop();
  }

  if (level == 4) {
    timer3.loop(1300 * randomNumber, roleBack, player);
    timer3.start();
  } else {
    timer3.stop();
  }
  if (level == 9) {
    timer4.loop(5000, randomEffect, player);
    timer4.start();
  } else {
    timer4.stop();
  }

  //lasers.position.y = 150;
}

//function laserOerlap(lasers, layer) {
//  lasers.position.x = layer.position - 3000;
//}

function randomEffect() {
  if (randomColor == 1) {
    game.stage.backgroundColor = '#30FFBA';
    //normal
    level = 2;
    rev = 1;
  } else if (randomColor == 2) {
    game.stage.backgroundColor = '#3DCE00';
    level = 3;
    rev = 1;
    //time
  } else if (randomColor == 3) {
    game.stage.backgroundColor = '#FF0000';
    level = 4;
    rev = 1;
    //roleback
  } else if (randomColor == 4) {
    game.stage.backgroundColor = '#0094FF';
    level = 5;
    rev = -1;
    //reverce
  } else if (randomColor == 5) {
    game.stage.backgroundColor = '#FFFF00';
    level = 6;
    rev = 1;
    //troll
  } else if (randomColor == 6) {
    game.stage.backgroundColor = '#FF6A00';
    level = 7;
    rev = 1;
    //laser
  } else if (randomColor == 7) {
    game.stage.backgroundColor = '#B200FF';
    level = 8;
    rev = 1;
    //directionce
  }
}

function Movedie() {
  let player = this;
  count += 1;
  player.frame = 6;
  if (count <= 10) {
    player.y -= 1 * rev;
  } else if (count > 10 && count <= 45) {
    player.y += 2 * rev;
  } else {
    test = false;
    count = 0;
    player.kill();
    lives -= 1;
    if (lives == 0) {
      GameOver();
    } else {
      this.game.state.restart();
    }
  }

}
function roleBack() {
  Rolecount += 1;
  if (Rolecount == 1) {
    playery = player.position.y;
    playerx = player.position.x;
  } else if (Rolecount == 2) {
    player.position.y = playery;
    player.position.x = playerx;
    Rolecount = 0;
  }
}

function speedChange() {
  bulling = !bulling;
  if (bulling) {
    game.time.slowMotion = 0;
  } else {
    game.time.slowMotion = 3;
  }
}

function coinOverlap(player, coin) {
  coin.kill();
  points += 1;
  pointsText.setText('coins: ' + points);
}

function portalOverlap(player, portal) {
  player.position.y = 192;
  player.position.x = 2000;
  points += 10;
  pointsText.setText('coins: ' + points);
}

function killOverlap(player, kill) {
  player.frame = 6;
  player.body.enable = false;
  test = true;
}

function goombaOverlap(player, goomba) {
  if (level == 5) {
    if (player.body.touching.up) {
      goomba.animations.stop();
      goomba.frame = 2;
      goomba.body.enable = false;
      player.body.velocity.y = 80;
      points += 1;
      pointsText.setText('coins: ' + points);
      game.time.events.add(Phaser.Timer.SECOND, function () {
        goomba.kill();
      });
    } else {
      player.frame = 6;
      player.body.enable = false;
      test = true;
    };
  } else {
    if (player.body.touching.down) {
      goomba.animations.stop();
      goomba.frame = 2;
      goomba.body.enable = false;
      player.body.velocity.y = -80;
      points += 1;
      pointsText.setText('coins: ' + points);
      game.time.events.add(Phaser.Timer.SECOND, function () {
        goomba.kill();
      });
    } else {
      player.frame = 6;
      player.body.enable = false;
      test = true;
    };
  }
}

function nextOverlap(player, nextlevel) {
  nextlevel.kill();
  real = true;
  game.state.restart();
}

function GameOver() {
  game.stage.backgroundColor = '#000000';
  if (win==true) {
    gameovertext.setText('You Win!!!     Your score is: '+points+' points');
  } else {
    gameovertext.setText('You Lose with score of '+points+' points');
  }
  
  //I don't know
}
function loadTileMap() {
  if (level == 1) {
    game.load.tilemap('level', '/img/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.stage.backgroundColor = '#30FFBA';
    game.add.text(100, 155, 'Normal', { fontSize: '15px', fill: '#000' });
    level += 1;
    place = 16;

  } else if (level == 2) {
    game.load.tilemap('level', '/img/level2.json', null, Phaser.Tilemap.TILED_JSON);
    game.stage.backgroundColor = '#3DCE00';
    game.add.text(1900, 145, 'Slow/Fast motion', { fontSize: '15px', fill: '#000' });
    level += 1;
    place = 2000;

  } else if (level == 3) {
    game.load.tilemap('level', '/img/level3.json', null, Phaser.Tilemap.TILED_JSON);
    game.stage.backgroundColor = '#FF0000';
    game.add.text(100, 145, 'Role back', { fontSize: '15px', fill: '#000' });
    game.time.slowMotion = 1;
    level += 1;
    place = 16;

  } else if (level == 4) {
    game.load.tilemap('level', '/img/level4.json', null, Phaser.Tilemap.TILED_JSON);
    game.stage.backgroundColor = '#0094FF';
    game.add.text(1900, 145, 'Reverce', { fontSize: '15px', fill: '#000' });
    rev = -1;
    level += 1;
    place = 2000;

  } else if (level == 5) {
    game.load.tilemap('level', '/img/level5.json', null, Phaser.Tilemap.TILED_JSON);
    game.stage.backgroundColor = '#FFFF00';
    game.add.text(100, 145, 'Troll', { fontSize: '15px', fill: '#000' });
    rev = 1;
    level += 2;
    place = 16;

  } else if (level == 6) {
    game.load.tilemap('level', '/img/level6.json', null, Phaser.Tilemap.TILED_JSON);
    game.stage.backgroundColor = '#FF6A00';
    game.add.text(1900, 145, 'Laser', { fontSize: '15px', fill: '#000' });
    level += 1;
    place = 2000;

  } else if (level == 7) {
    game.load.tilemap('level', '/img/level7.json', null, Phaser.Tilemap.TILED_JSON);
    game.stage.backgroundColor = '#B200FF';
    game.add.text(100, 145, 'Change directions', { fontSize: '15px', fill: '#000' });
    win=true;
    GameOver();
    place = 2000;

  } else if (level == 8) {
    game.load.tilemap('level', '/img/level8.json', null, Phaser.Tilemap.TILED_JSON);
    game.stage.backgroundColor = '#FFFFFF';
    game.add.text(1900, 145, 'All', { fontSize: '15px', fill: '#000' });
    level += 1;
    place = 2000;
    effect = true;

  } else /* if (level==9) {
    game.load.tilemap('level', '/img/level9.json', null, Phaser.Tilemap.TILED_JSON);
    game.stage.backgroundColor = '#B200FF';
    game.add.text(100, 145, 'BOSS', { fontSize: '15px', fill: '#000' });
    level +=1;
    place=16; */ {
    //game.state.stop();
  }
}
