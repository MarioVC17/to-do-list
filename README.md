# To Do List

## Descripción del Proyecto

To Do List es una app que permite la creación y gestión de tareas, también se pueden agregar, editar y/o eliminar categorías que luego podrás usar en las tareas

## Tecnologías Utilizadas

* Ionic Framework (Angular)
* Capacitor (para funcionalidades nativas)
* AngularFire (para Firebase)
* Ionic Storage (para almacenamiento local)
* Git (para versionamiento)

## Pre-requisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu sistema:

* [Node.js](https://nodejs.org/) (versión LTS recomendada)
* [npm](https://www.npmjs.com/) (se instala con Node.js) o [yarn](https://yarnpkg.com/) (opcional)
* [Ionic CLI](https://ionicframework.com/docs/cli/installation) (`npm install -g @ionic/cli`)
* [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)
* Para desarrollo en Android:
    * [Android Studio](https://developer.android.com/studio/) y las SDKs necesarias.
    * Configuración de un emulador de Android o un dispositivo físico.
* Para desarrollo en iOS:
    * [Xcode](https://developer.apple.com/xcode/) (requerido en macOS).
    * Configuración de un simulador de iOS o un dispositivo físico.

## Instalación

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/MarioVC17/to-do-list.git
    ```

2.  **Instalar las dependencias:**
    Con npm:
    ```bash
    npm install
    ```
    O con yarn (si lo utilizas):
    ```bash
    yarn install
    ```

## Ejecución en el Navegador (PWA)

Para ejecutar la aplicación como una Progressive Web App en tu navegador:

```bash
ionic serve