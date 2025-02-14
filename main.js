class Game {
    constructor() {
        this.container = document.getElementById("game-container");
        this.personaje = null;
        this.monedas = [];
        this.puntuacion = 0;
        this.crearEscenario();
        this.agregarEventos();
        this.checkColisiones(); // ✅ Теперь метод вызывается здесь
    }

    crearEscenario() {
        this.personaje = new Personaje();
        this.container.appendChild(this.personaje.element);
        for (let i = 0; i < 10; i++) {
            const moneda = new Moneda();
            this.monedas.push(moneda);
            this.container.appendChild(moneda.element);
        }
    }
    //El código de Ana que no funciona porque checkColisiones() 
    //llama inmediatamente, antes del primer movimiento, y no se vuelve a activar.

    //agregarEventos() {
  //window.addEventListener("keydown", (e) => this.personaje.mover(e));
  //this.checkColisiones();
//   }


//código que funciona porque checkColisiones()
//llama dentro del controlador de eventos, 
//lo que significa que se ejecuta después de cada movimiento.

//agregarEventos() {
    //window.addEventListener("keydown", (e) => {
      //this.personaje.mover(e);
      //this.checkColisiones(); // ✅ Коллизии проверяются после движения
   // });
  //}

    agregarEventos() {
        console.log("Добавлены обработчики событий");
        window.addEventListener("keydown", (e) => {
            console.log(e.key);
            this.personaje.mover(e);
        });
    }

    checkColisiones() {
        setInterval(() => {
            this.monedas.forEach((moneda, index) => {
                console.log(`Персонаж: x=${this.personaje.x}, y=${this.personaje.y}`);
                console.log(`Монета: x=${moneda.x}, y=${moneda.y}`);

                if (this.personaje.colisionaCon(moneda)) {
                    console.log("Коллизия! Монета собрана.");
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
        this.element = document.createElement("img");
this.element.src = "images/recaudador.png"; // Путь к картинке человека
this.element.classList.add("personaje"); 
     this.actualizarPosicion();
    }

    mover(evento) {
        if (evento.key === "ArrowRight") {
            this.x += this.velocidad;
        } else if (evento.key === "ArrowLeft") {
            this.x -= this.velocidad;
        } else if (evento.key === "ArrowUp") {
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
            }
            this.actualizarPosicion();
        }, 20);
    }

    actualizarPosicion() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    colisionaCon(objeto) {
        let colision =
            this.x < objeto.x + objeto.width &&
            this.x + this.width > objeto.x &&
            this.y < objeto.y + objeto.height &&
            this.y + this.height > objeto.y;

        if (colision) {
            console.log("Столкновение обнаружено!");
        }

        return colision;
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

        // ✅ Запускаем бесконечное движение монеты
        this.moverAleatorio();
    }

    actualizarPosicion() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    moverAleatorio() {
        setInterval(() => {
            this.x = Math.random() * 700 + 50; // Рандомная X координата
            this.y = Math.random() * 250 + 50; // Рандомная Y координата
            this.actualizarPosicion();
        }, 2000); // Монеты двигаются каждые 2 секунды
    }
}


const juego = new Game();
