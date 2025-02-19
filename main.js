class Game {
    constructor() {
        this.container = document.getElementById("game-container");
        this.personaje = new Personaje();
        this.monedas = [];
        this.puntuacion = 0;
        this.totalMonedas = 10;
        this.monedasRecogidas = 0;
        this.crearEscenario();
        this.agregarEventos();
        this.iniciarMusica();
    }

    iniciarMusica() {
        this.musicaFondo = new Audio("sounds/background.mp3");
        this.musicaFondo.loop = true;
        this.musicaFondo.volume = 0.3;
        document.addEventListener("click", () => {
            this.musicaFondo.play();
        }, { once: true });
    }

    crearEscenario() {
        this.container.appendChild(this.personaje.element);
        for (let i = 0; i < this.totalMonedas; i++) {
            const moneda = new Moneda();
            this.monedas.push(moneda);
            this.container.appendChild(moneda.element);
        }
        setTimeout(() => this.checkColisiones(), 100);
    }

    agregarEventos() {
        window.addEventListener("keydown", (e) => {
            this.personaje.mover(e);
        });

        window.addEventListener("resize", () => {
            this.actualizarTamaño();
        });
    }

    actualizarTamaño() {
        const screenWidth = window.innerWidth;
        if (screenWidth > 1024) {
            this.container.style.width = "800px";
            this.container.style.height = "400px";
        } else if (screenWidth > 768) {
            this.container.style.width = "85vw";
            this.container.style.height = "55vh";
        } else {
            this.container.style.width = "95vw";
            this.container.style.height = "60vh";
        }
    }

    checkColisiones() {
        setInterval(() => {
            this.monedas.forEach((moneda, index) => {
                if (this.personaje.colisionaCon(moneda)) {
                    console.log("Moneda recogida!");
                    moneda.destruir();
                    this.monedas.splice(index, 1);
                    this.monedasRecogidas++;

                    let sonidoMoneda = new Audio("sounds/coin.mp3");
                    sonidoMoneda.volume = 1;
                    sonidoMoneda.play();

                    if (this.monedasRecogidas === this.totalMonedas) {
                        this.mostrarVictoria();
                    }
                }
            });
        }, 50);
    }

    crearMensajeVictoria() {
        const victoryMessage = document.createElement('div');
        victoryMessage.id = 'victory-message';

        const victoryContent = document.createElement('div');
        victoryContent.className = 'victory-content';

        const title = document.createElement('h2');
        title.textContent = '¡Victoria!';

        const message = document.createElement('p');
        message.textContent = '¡Has recogido todas las monedas!';

        const restartButton = document.createElement('button');
        restartButton.id = 'restart-button';
        restartButton.textContent = 'Jugar de nuevo';
        restartButton.addEventListener('click', () => this.reiniciarJuego());

        victoryContent.appendChild(title);
        victoryContent.appendChild(message);
        victoryContent.appendChild(restartButton);
        victoryMessage.appendChild(victoryContent);

        document.body.appendChild(victoryMessage);
    }

    mostrarVictoria() {
        this.crearMensajeVictoria();
        this.musicaFondo.pause();
        const victorySound = new Audio("sounds/victory.mp3");
        victorySound.volume = 0.5;
        victorySound.play();
    }

    reiniciarJuego() {
        
        const victoryMessage = document.getElementById('victory-message');
        if (victoryMessage) {
            document.body.removeChild(victoryMessage);
        }

        
        this.monedas.forEach(moneda => {
            moneda.destruir(); 
        });
        this.monedas = [];
        this.monedasRecogidas = 0;

        
        this.personaje.x = 50;
        this.personaje.y = 300;
        this.personaje.actualizarPosicion();

        
        this.crearEscenario();

        
        this.musicaFondo.currentTime = 0;
        this.musicaFondo.play();
    }
}

class Personaje {
    constructor() {
        this.x = 50;
        this.y = 300;
        this.width = 50;
        this.height = 50;
        this.velocidad = 15;
        this.saltando = false;
        this.sonidoSalto = new Audio("sounds/jump.mp3");
        this.sonidoSalto.volume = 0.05;
        this.element = document.createElement("img");
        this.element.src = "images/taxwoman1.png";
        this.element.classList.add("personaje");
        this.element.style.position = "absolute";
        document.getElementById("game-container").appendChild(this.element);
        this.actualizarPosicion();
    }

    mover(evento) {
        if (evento.key === "ArrowRight") {
            this.x += this.velocidad;
            this.element.style.transform = "scaleX(1)";
        } else if (evento.key === "ArrowLeft") {
            this.x -= this.velocidad;
            this.element.style.transform = "scaleX(-1)";
        } else if (evento.key === " " && !this.saltando) {
            this.saltar();
        }
        this.actualizarPosicion();
    }

    saltar() {
        this.saltando = true;
        let alturaMaxima = this.y - 250;
        this.sonidoSalto.play();

        const salto = setInterval(() => {
            if (this.y > alturaMaxima) {
                this.y -= 15;
            } else {
                clearInterval(salto);
                setTimeout(() => this.caer(), 200);
            }
            this.actualizarPosicion();
        }, 20);
    }

    caer() {
        const gravedad = setInterval(() => {
            if (this.y < 300) {
                this.y += 15;
            } else {
                clearInterval(gravedad);
                this.saltando = false;
            }
            this.actualizarPosicion();
        }, 20);
    }

    actualizarPosicion() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    colisionaCon(objeto) {
        return (
            this.x < objeto.x + objeto.width &&
            this.x + this.width > objeto.x &&
            this.y < objeto.y + objeto.height &&
            this.y + this.height > objeto.y
        );
    }
}

class Moneda {
    constructor() {
        this.x = Math.random() * 700 + 50;
        this.y = Math.random() * 250 + 50;
        this.width = 35;
        this.height = 35;
        this.velocidad = 3; // Скорость движения монеты
        this.element = document.createElement("div");
        this.element.classList.add("moneda");
        this.element.innerHTML = "$";
        document.getElementById("game-container").appendChild(this.element);
        this.actualizarPosicion();
        this.iniciarMovimiento();
    }

    actualizarPosicion() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    calcularDistancia(personaje) {
        const dx = this.x - personaje.x;
        const dy = this.y - personaje.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    mover(personaje) {
        const distancia = this.calcularDistancia(personaje);

        
        if (distancia < 200) {
            
            const dx = this.x - personaje.x;
            const dy = this.y - personaje.y;

            
            const length = Math.sqrt(dx * dx + dy * dy);
            const dirX = dx / length;
            const dirY = dy / length;

            
            this.x += dirX * this.velocidad;
            this.y += dirY * this.velocidad;

            
            this.x = Math.max(35, Math.min(this.x, 750));
            this.y = Math.max(35, Math.min(this.y, 350));

            this.actualizarPosicion();
        }
    }

    iniciarMovimiento() {
        this.intervaloMovimiento = setInterval(() => {
            const personaje = document.querySelector('.personaje');
            if (personaje) {
                const rect = personaje.getBoundingClientRect();
                const personajeObj = {
                    x: rect.left - document.getElementById('game-container').getBoundingClientRect().left,
                    y: rect.top - document.getElementById('game-container').getBoundingClientRect().top
                };
                this.mover(personajeObj);
            }
        }, 50);
    }

    destruir() {
        clearInterval(this.intervaloMovimiento);
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const juego = new Game();

    document.getElementById("left").addEventListener("touchstart", () => juego.personaje.mover({ key: "ArrowLeft" }));
    document.getElementById("right").addEventListener("touchstart", () => juego.personaje.mover({ key: "ArrowRight" }));
    document.getElementById("jump").addEventListener("touchstart", () => juego.personaje.saltar());
});