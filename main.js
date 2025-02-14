class Game {
    constructor() {
        this.container = document.getElementById("game-container");
        this.personaje = new Personaje(); // ✅ Создаём персонажа сразу
        this.monedas = [];
        this.puntuacion = 0;
        this.crearEscenario();
        this.agregarEventos();
        this.checkColisiones();
    }

    crearEscenario() {
        this.container.appendChild(this.personaje.element); // ✅ Добавляем персонажа в контейнер

        for (let i = 0; i < 10; i++) {
            const moneda = new Moneda();
            this.monedas.push(moneda);
            this.container.appendChild(moneda.element);
        }
    }

    agregarEventos() {
        window.addEventListener("keydown", (e) => {
            this.personaje.mover(e);
        });
    }

    checkColisiones() {
        setInterval(() => {
            this.monedas.forEach((moneda, index) => {
                if (this.personaje.colisionaCon(moneda)) {
                    console.log("Монета собрана!");
                    this.container.removeChild(moneda.element);
                    this.monedas.splice(index, 1);
                }
            });
        }, 100);
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

        // ✅ Правильный путь к файлу персонажа
        this.element = document.createElement("img");
        this.element.src = "./images/taxwoman1.png"; // Проверить, находится ли файл в `images/`
        this.element.classList.add("personaje");

        // ✅ Добавляем персонажа внутрь контейнера
        document.getElementById("game-container").appendChild(this.element);
        this.actualizarPosicion();
    }
    
    mover(evento) {
        if (evento.key === "ArrowRight") {
            this.x += this.velocidad;
            this.element.style.transform = "scaleX(1)"; // ✅ Поворачивается вправо
        } else if (evento.key === "ArrowLeft") {
            this.x -= this.velocidad;
            this.element.style.transform = "scaleX(-1)"; // ✅ Поворачивается влево
        } else if (evento.key === "ArrowUp" && !this.saltando) {
            this.saltar();
        }
        this.actualizarPosicion();
    }

    saltar() {
        this.saltando = true;
        let alturaMaxima = this.y - 100;
        const salto = setInterval(() => {
            if (this.y > alturaMaxima) {
                this.y -= 10;
            } else {
                clearInterval(salto);
                this.caer();
            }
            this.actualizarPosicion();
        }, 20);
    }

    caer() {
        const gravedad = setInterval(() => {
            if (this.y < 300) {
                this.y += 10;
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

        this.element = document.createElement("div");
        this.element.classList.add("moneda");

        // ✅ Добавляем знак "$" внутрь монеты
        this.element.innerHTML = "$";

        document.getElementById("game-container").appendChild(this.element);
        this.actualizarPosicion();

        // ✅ Запускаем движение монеты
        this.moverAleatorio();
    }

    actualizarPosicion() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    moverAleatorio() {
        setInterval(() => {
            this.x = Math.random() * 700 + 50;
            this.y = Math.random() * 250 + 50;
            this.actualizarPosicion();
        }, 2000);
    }
}

const juego = new Game();
