'use strict';

var game = new Phaser.Game(800,600,Phaser.AUTO,'',{preload:preload,create:create,update:update});

function preload(){
    game.load.image('sky','assets/sky.png');
    game.load.image('ground','assets/platform.png');
    game.load.image('star','assets/star.png');
    game.load.spritesheet('dude','assets/dude.png',38,42);
}

var plataforma;
var Player;
var cursor;
var star;
var marcador = 0;
var scoreText;

function create(){
    //Vamos a usar física, así que habilite el sistema Arcade Physics
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //Un fondo simple para nuestro juego
    game.add.sprite(0,0,'sky');
    //El grupo de plataformas contiene el suelo y las 2 repisas sobre las que podemos saltar
    plataforma = game.add.group();
    //Habilitaremos la física para cualquier objeto que se cree en este grupo
    plataforma.enableBody = true;
    //antes de crear el terreno
    var ground = plataforma.create(0,game.world.height - 64,'ground');
    //Ajústalo para que se ajuste al ancho del juego (el sprite original tiene un tamaño de 400x32);
    ground.scale.setTo(2,2);
    //Esto evita que se caiga cuando saltas sobre él
    ground.body.immovable = true;
    //Ahora creemos dos repisas
    var ledge = plataforma.create(400,400,'ground');
    ledge.body.immovable = true;
    ledge = plataforma.create(-150,250,'ground');
    ledge.body.immovable = true;

    //La jugadora y sus configuraciones
    Player = game.add.sprite(32, game.world.height - 150,'dude');
    //Necesitamos habilitar la física en el jugador
    game.physics.arcade.enable(Player);
    //Propiedades físicas del jugador. Dale al pequeño un ligero rebote
    Player.body.bounce.y = 0.2;
    Player.body.gravity.y = 300;
    Player.body.collideWorldBounds = true;

    //Nuestras dos animaciones, caminando de izquierda a derecha
    Player.animations.add('left',[0,1,2,3],10,true);
    Player.animations.add('right',[5,6,7,8],10,true);

    //Finalmente algunas estrellas para coleccionar
    star = game.add.group();

    //Habilitaremos la física para cualquier estrella que se cree en este grupo
    star.enableBody = true;
    //Aquí crearemos 12 de ellos espaciados uniformemente
    for(var i=0; i<12; i++){
        //Crea una estrella dentro del grupo 'estrellas'
        var start = star.create(i*70,0,'star');
        //Deja que la gravedad haga lo suyo
        start.body.gravity.y = 300;
        //Esto solo le da a cada estrella un valor de rebote ligeramente aleatorio
        start.body.bounce.y = 0.7 + Math.random()*0.2;
    }

    // Marcador

    scoreText = game.add.text(16,16,'marcador: 0',{fontSize:'32px',fill:'#000'});

    //Nuestros controles
    cursor = game.input.keyboard.createCursorKeys();
}

function update(){
    //Choca a la jugadora y las estrellas con las plataformas
    var hitPlatform = game.physics.arcade.collide(Player, plataforma);
    game.physics.arcade.collide(Player,plataforma);

    //Comprueba si el jugador se superpone con alguna de las estrellas, si llama a la función collectStar
    game.physics.arcade.overlap(Player,star,collectStar,null,this);

    //Restablecer la velocidad de los jugadores (movimiento)
    Player.body.velocity.x = 0;

    if(cursor.left.isDown){
        //Mover hacia la izquierda
        Player.body.velocity.x = 150;
        Player.animations.play('left');
    }else if(cursor.right.isDown){
        //Mover hacia la derecha
        Player.body.velocity.x = 150;
        Player.body.animations.play('right');
    }else{
        //Estarse quieto
        Player.animations.stop();
        Player.frame = 4;
    }

    //Permita que el jugador salte si está tocando el suelo.
    if(cursor.up.isDown && Player.body.touching.down){
        Player.body.velocity.y = -350;
    }
}

function collectStar(player,star){
    //Elimina la estrella de la pantalla.
    star.kill();
    //Agregar y actualizar el puntaje
    marcador+=10;
    scoreText.text = 'Marcador: '+marcador;
}