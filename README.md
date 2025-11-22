# 🕹️ ARCADE CLÁSICO - Portal de Juegos Retro

![Arcade Clásico](https://img.shields.io/badge/Arcade-Cl%C3%A1sico-00F0FF?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

Portal de juegos arcade clásicos con estética retro auténtica. Una colección de 7 juegos icónicos recreados con tecnologías web modernas y efectos visuales nostálgicos de los años 70-90.

## 🎮 Juegos Disponibles

### 1. 🟦 TETRIS (1984)
El legendario puzzle de bloques donde debes organizar tetrominós que caen para completar líneas.

**Características:**
- 7 tipos de piezas clásicas (I, O, T, S, Z, J, L)
- Sistema de rotación con wall kick
- Niveles con velocidad incremental
- Preview de siguiente pieza
- Sistema de puntuación por líneas

**Controles:** Flechas para mover/rotar, Espacio para caída rápida

---

### 2. 🐸 FROG (1981)
Basado en el clásico Frogger. Ayuda a la rana a cruzar calles llenas de tráfico y ríos con troncos flotantes.

**Características:**
- 5 carriles de tráfico con coches
- 5 carriles de río con troncos y tortugas
- Sistema de vidas y timer
- Nivel progresivo
- 5 slots de objetivo para completar

**Controles:** Flechas direccionales

---

### 3. 👾 SPACE INVADERS (1978)
El shooter espacial pionero. Defiende la Tierra de oleadas de invasores alienígenas.

**Características:**
- Grid de 55 aliens con movimiento coordinado
- Sistema de disparos bidireccional
- 4 escudos destructibles
- Oleadas progresivas con dificultad aumentada
- Sistema de vidas y high score

**Controles:** Flechas para mover, Espacio para disparar

---

### 4. 🏓 PONG (1972)
El primer videojuego arcade comercial. Tenis de mesa clásico contra CPU.

**Características:**
- Física de pelota con rebotes angulares
- IA oponente balanceada
- Sistema de puntuación (primero a 11 gana)
- Aceleración progresiva de la pelota
- Modo pausa

**Controles:** W/S para mover paddle, Espacio para pausar

---

### 5. 🐍 SNAKE (1976)
El adictivo juego de la serpiente. Come, crece y evita chocarte.

**Características:**
- Serpiente que crece al comer
- Colisión con paredes y auto-colisión
- Velocidad incremental
- High score con localStorage
- Grid visual para navegación

**Controles:** Flechas direccionales

---

### 6. 💣 MINESWEEPER (1990)
El clásico puzzle de lógica. Encuentra todas las minas sin detonarlas usando deducciones.

**Características:**
- Grid de 9×9 con 10 minas
- Números que indican minas adyacentes
- Click izquierdo para revelar
- Click derecho para colocar banderas
- Revelado recursivo de celdas vacías
- Timer y contador de minas

**Controles:** Click izquierdo para revelar, Click derecho para bandera

---

### 7. 🟡 PAC-MAN (1980)
El icónico juego de laberintos. Come todos los puntos mientras evitas los fantasmas.

**Características:**
- Laberinto clásico auténtico
- 4 fantasmas con IA de persecución
- Puntos regulares y power pellets
- Modo power para comer fantasmas
- Sistema de vidas y niveles
- Física y movimiento suave

**Controles:** Flechas direccionales

---

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura y Canvas API para rendering de juegos
- **CSS3** - Estilos retro con efectos CRT y animaciones
- **JavaScript (Vanilla)** - Lógica de juegos sin frameworks
- **Google Fonts** - Press Start 2P para estética pixel

## 🎨 Características de Diseño

### Estética Retro Auténtica
- ✨ **Efectos CRT** - Scanlines y flicker simulados
- 🌈 **Colores Neón** - Paletas vibrantes únicas por juego
- 🔆 **Glow Effects** - Text-shadow y box-shadow intensos
- 📺 **Grid Animado** - Fondo con patrón en movimiento
- 🎮 **Fuente Pixel** - Press Start 2P para nostalgia total

### Diseño Responsive
- Grid adaptable en menú principal
- Canvas escalables en todos los juegos
- Controles optimizados para diferentes dispositivos
- Layout flexible con CSS Grid y Flexbox

## 📁 Estructura del Proyecto

```
classic-games/
├── index.html              # Menú principal
├── index.css              # Estilos del menú
├── README.md              # Este archivo
└── games/
    ├── tetris/
    │   ├── index.html
    │   ├── css/
    │   │   └── styles.css
    │   └── js/
    │       └── game.js
    ├── frog/
    │   ├── index.html
    │   ├── css/
    │   │   └── styles.css
    │   └── js/
    │       └── game.js
    ├── space-invaders/
    │   ├── index.html
    │   ├── css/
    │   │   └── styles.css
    │   └── js/
    │       └── game.js
    ├── pong/
    │   ├── index.html
    │   ├── css/
    │   │   └── styles.css
    │   └── js/
    │       └── game.js
    └── snake/
        ├── index.html
        ├── css/
        │   └── styles.css
        └── js/
            └── game.js
    ├── minesweeper/
    │   ├── index.html
    │   ├── css/
    │   │   └── styles.css
    │   └── js/
    │       └── game.js
    └── pacman/
        ├── index.html
        ├── css/
        │   └── styles.css
        └── js/
            └── game.js
```

## 🚀 Cómo Usar

### Instalación Local

1. **Clonar el repositorio:**
```bash
git clone https://github.com/jtejadavilca/classic-games.git
cd classic-games
```

2. **Abrir en el navegador:**
   - Simplemente abre `index.html` en tu navegador favorito
   - O usa un servidor local:
   ```bash
   # Con Python
   python -m http.server 8000
   
   # Con Node.js (http-server)
   npx http-server
   ```

3. **¡Juega!**
   - Navega por el menú principal
   - Selecciona tu juego favorito
   - Usa los controles indicados en cada juego

### Requisitos
- Navegador moderno con soporte para:
  - HTML5 Canvas
  - CSS3 (Grid, Flexbox, Animations)
  - JavaScript ES6+
  - localStorage (para high scores)

## 🎯 Características Técnicas

### Sistema de Juegos
- **Game Loop** con requestAnimationFrame para 60 FPS
- **Collision Detection** precisa en todos los juegos
- **Physics Engine** simple para Pong
- **Grid System** para Tetris, Frog y Snake
- **AI Logic** para oponentes en Space Invaders y Pong

### Optimizaciones
- Rendering eficiente con Canvas API
- Image rendering pixelated para estética retro
- Responsive design sin sacrificar performance
- localStorage para persistencia de high scores

## 🌟 Características Especiales

- 🎨 Cada juego tiene su **paleta de colores neón única**
- 💾 **High scores** guardados localmente (Snake)
- ⚡ **Dificultad progresiva** en todos los juegos
- 🔊 Preparado para agregar **efectos de sonido retro**
- 📱 **Mobile-friendly** con controles táctiles potenciales

## 🔮 Futuras Mejoras

- [ ] Sistema de sonidos retro (8-bit)
- [ ] Leaderboard global con backend
- [ ] Más juegos (Pac-Man, Breakout, Asteroids)
- [ ] Controles táctiles para móviles
- [ ] Efectos de partículas
- [ ] Modo multijugador local
- [ ] Achievements y estadísticas
- [ ] Temas de color alternativos

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

**Creado con ❤️ para los gamers retro**

---

## 🎮 ¿Listo para Jugar?

¡Abre `index.html` y sumérgete en la nostalgia arcade! 

**PRESS START** 🕹️

---

### 🌟 Screenshots

*Menú principal con efectos CRT y colores neón vibrantes*

*Cada juego con su estética única manteniendo el tema retro*

---

**¿Encontraste un bug? ¿Tienes una sugerencia?**  
Abre un issue o envía un pull request. ¡Todas las contribuciones son bienvenidas!
