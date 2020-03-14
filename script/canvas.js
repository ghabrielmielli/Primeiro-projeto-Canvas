//-----------------Preparando Canvas--------------------
var canvas = document.querySelector('canvas');
c = canvas.getContext("2d");

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", setCanvasSize);
setCanvasSize();
//-------------------------------------------------------

//------------------Bolinha que quica e fica se movimentando pros lados------------------
class Ball {
    constructor(x, y, radius, color) {
        //Posicionamento
        this.x = x;
        this.y = y;

        //Características
        this.radius = radius;
        this.color = color;

        //Movimentação no eixo Y
        this.velocityY = 0;
        this.gravity = 1;
        this.bouncePotential = 0.6;
        this.jumping = true;
        this.jumpingPulse = 15;

        //Movimentação no eixo X
        this.velocityX = 1;
        this.acceleration = 1.09;
        this.isMoving = true;
        this.direction = "right";
        this.dashingTime = 1000;
    }

    jump() {
        this.velocityY = - this.jumpingPulse;
        this.jumping = true;
    }

    dash() {
        this.dashing = true;

        setTimeout(() => {
            this.dashing = false;
        }, this.dashingTime);
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.strokeStyle = this.color
        c.stroke()
        c.closePath()
    }

    update() {

        //-------------- CONTROLE VERTICAL ----------------  

        //Corrige bug ao dar resize na tela
        if (!this.jumping) {
            this.y = canvas.height - this.radius;
        }


        //Controle de pulo
        if (this.jumping) {

            this.y += this.velocityY;

            //quando tocar o chão
            if (this.y + this.radius >= canvas.height) {

                //Não deixa a bola sair do canvas
                this.y = canvas.height - this.radius;

                //quica se a velocidade de impácto com o chão for um mínimo.
                if (this.velocityY > 3) {
                    this.velocityY = -this.velocityY * this.bouncePotential;
                }
                //para de quicar caso contrário.
                else {
                    this.velocityY = 10;
                    this.jumping = false;
                }
            }
            else {
                this.velocityY += this.gravity;
            }
        }

        //------------------- CONTROLE HORIZONTAL ---------------------

        if (this.isMoving) {
            this.x += this.velocityX;

            //colisão com paredes
            if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {

                this.velocityX = - this.velocityX * 0.88;

                if (this.x - this.radius <= 0) {
                    this.direction = "right";
                    this.x = this.radius;
                }
                else if (this.x + this.radius >= canvas.width) {
                    this.direction = "left";
                    this.x = canvas.width - this.radius;
                }
            }

            //atrito com o chão
            this.velocityX *= 0.98;

            //Função pra fazer parar
            if (this.velocityX < 0 && this.velocityX > -0.3
                || this.velocityX > 0 && this.velocityX < 0.3) {

                this.velocityX = 0;
                this.isMoving = false;
                setTimeout(() => {
                    this.dash();
                }, 1)
            }

        }

        //DÁ UM DASH
        if (this.dashing) {
            if (this.direction == "right") {
                if (this.velocityX < 1)
                    this.velocityX = 1;
            }
            else {
                if (this.velocityX > -1)
                    this.velocityX = -1;
            }
            this.velocityX *= this.acceleration;
            this.isMoving = true;
        }

        this.draw();
    }
}
//---------------------------------------------------------------

var title = {
    title: "Apenas uma Bolinha",
    subtitle: "by: Ghabriel Mielli",
    draw: () => {
        c.save();

        c.translate(canvas.width / 2, canvas.height / 2);
        c.textAlign = "center";
        c.textBaseline = "middle";

        c.fillStyle = "rgba(100,0,0,0.4)";
        c.font = "30px Montserrat";
        c.fillText(title.title, 0, -20);
        c.fillText(title.subtitle, 0, 20);
        c.restore();
    }
}


//cria um bola
ball = new Ball(canvas.width / 2, 100, 50, 'green');

//Faz a bola pular
window.addEventListener('keydown', (e) => {
    if (e.keyCode == 32)
        ball.jump();
})

// Roda a aplicação
function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height);
    title.draw();
    ball.update();
}


animate();