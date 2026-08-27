# 🌿 Tu Espacio — *Tu lugar en el mundo*

> **Aplicación web minimalista de toma de notas y gestión de tareas, diseñada a medida para las necesidades de concentración y accesibilidad de una persona con TDAH.**

Desarrollado por: **Milagros Escarlon**

---

## 📌 Tabla de Contenidos
1. [Sobre el Proyecto](#-sobre-el-proyecto)
2. [El Cliente y la Inspiración: El Proceso con mi Pareja](#-el-cliente-y-la-inspiración-el-proceso-con-mi-pareja)
3. [Toma de Decisiones de Diseño y UX/UI](#-toma-de-decisiones-de-diseño-y-uxui)
4. [Stack Tecnológico y Decisiones de Desarrollo](#-stack-tecnológico-y-decisiones-de-desarrollo)
5. [Desafíos Técnicos y Aprendizajes](#-desafíos-técnicos-y-aprendizajes)
6. [Ideas Descartadas e Iteraciones](#-ideas-descartadas-e-iteraciones)
7. [Demostración y Enlaces](#-demostración-y-enlaces)

---

## 📖 Sobre el Proyecto

**"Tu Espacio"** es una aplicación web orientada a la toma rápida de notas, captura de ideas y organización cotidiana sin ruidos visuales ni distracciones. Su objetivo es brindar ese "lugarcito en el mundo" donde volcar pensamientos con total comodidad, calma y fluidez.

---

## 💡 El Cliente y la Inspiración: El Proceso con mi Pareja

El motor principal de este proyecto fue **mi pareja, quien actuó como mi cliente y principal fuente de inspiración**. Al tener **TDAH (Trastorno por Déficit de Atención e Hiperactividad)**, necesitaba una herramienta adaptada a su forma de procesar la información y trabajar en el día a día.

Todo el desarrollo se basó en entrevistas directas, análisis de sus aplicaciones de cabecera (*Notion* y *Obsidian*) y un proceso de validación continua con sus "Sí" y "No" ante cada propuesta:

* **Acceso Inmediato (*Express Capture*):** A pedido explícito de él, la aplicación inicia directamente en el anotador y no en la pantalla de login. Esto responde a la necesidad de volcar una idea o tarea urgente en el momento exacto, sin pasos previos que rompan su hilo de concentración.
* **Cero pantallas blancas agresivas:** Al no tolerar fondos blancos puros para trabajar, definió la búsqueda de una paleta cálida y descansada para la vista.
* **Experiencia Responsive:** Pensada desde el día uno para que pudiera usarla tanto en la computadora como rápidamente desde el celular.

---

## 🎨 Toma de Decisiones de Diseño y UX/UI

Cada detalle visual fue consensuado para transmitir calma y reducir la sobrecarga cognitiva:

### 1. Paleta de Colores
* **Tema Claro:** Basado en tonos **cálidos pastel** y crema, inspirados en combinaciones suaves para evitar la fatiga visual.
* **Tema Oscuro:** Diseñado a partir de los tonos que caracterizan a Obsidian, una de sus herramientas de referencia favoritas.

### 2. Identidad Visual y Mascota
* **Concepto:** *"Tu Espacio — Tu lugar en el mundo"*, pensado como un refugio seguro para escribir.
* **Mascota/Logo:** Un simpático *carpincho* con lápiz (creado en Canva), con dos versiones adaptadas respectivamente para contrastar en fondo claro y fondo oscuro.

### 3. Usabilidad Inmersiva
* Se incorporó un botón interactivo para **ocultar y mostrar el menú lateral**, permitiendo despejar la pantalla por completo a la hora de escribir sin distracciones periféricas.

---

## 💻 Stack Tecnológico y Decisiones de Desarrollo

* **HTML5:** Estructura semántica priorizando la claridad y accesibilidad.
* **CSS3 + Bootstrap:** 
  * Priorización de clases de utilidad de Bootstrap para lograr una estructura responsiva y ordenada.
  * Reglas CSS personalizadas para paletas cromáticas específicas e identidad visual.
* **JavaScript (Vanilla):**
  * **Arquitectura limpia y modular:** Código estructurado en capas (constantes, selectores DOM, inicialización, funciones y controladores de eventos).
  * **Manejo de flujo del navegador:** Control de eventos, formularios y redirecciones fluidas.
  * **Modo Oscuro Dinámico:** Cambio de temas en tiempo real con persistencia en `LocalStorage`.
  * **Persistencia Completa con `LocalStorage`:** Guardado automático de notas, contenido enriquecido, temas y avatares para no perder datos al recargar la página.
  * **Lógica Invitado vs. Registrado:** Acceso directo sin barreras con límite de 1 nota rápida para capturar ideas al instante (diseñado para TDAH), y gestión ilimitada de notas para usuarios con sesión.

---

## 🚀 Desafíos Técnicos y Aprendizajes

* **Comprensión profunda de JavaScript:** Entender a fondo cómo interceptar eventos nativos del navegador y conectar dinámicas de interfaz sin recurrir a código que no pudiera justificar conceptualmente.
* **Balance Bootstrap vs. CSS:** Encontrar el equilibrio exacto entre el uso de clases predeterminadas y estilos propios sin romper la estética personalizada de la app.
* **Gestión de estado local:** Primer acercamiento práctico a `LocalStorage` para persistir preferencias del usuario entre distintas vistas.

---

## 💡 Ideas Descartadas e Iteraciones

En conjunto con el feedback y bajo la premisa de mantener un código comprensible y fiel a la experiencia del usuario, se descartaron dos propuestas:

* 🗑️ **Papelera con historial de restauración:** Aunque se llegó a maquetar, sumaba una complejidad en JavaScript que se alejaba del objetivo de mantener la app simple y con código 100% dominado.
* 📅 **Calendario interactivo (*FullCalendar*):** Se probó en prototipo, pero rompía la estética limpia de la app y las limitaciones de la librería no permitían una integración natural con las notas.

---

## 🔗 Enlaces del Proyecto

* 🌐 **Sitio Web / Demo:** `[Inserta aquí tu enlace desplegado]`
* 🎨 **Tablero de Figma:** `[Inserta aquí tu enlace a Figma]`