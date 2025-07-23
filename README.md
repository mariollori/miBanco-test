# MiBancoTest

Proyecto Angular para la cotización de seguros vehiculares y la administración de un catálogo de modelos de vehículos.

## Descripción

Esta aplicación permite:
- Cotizar seguros vehiculares ingresando datos del vehículo y del conductor.
- Visualizar el precio base, ajustes y prima total anual estimada.
- Consultar el historial de las últimas 3 cotizaciones de la sesión.
- Administrar el catálogo de modelos de vehículos (listar, crear y eliminar).

## Tecnologías

- Angular 20+
- NodeJs 22+
- SCSS (con metodología BEM)
- Reactive Forms
- Angular Router (Lazy Loading)
- Docker
- Jazmine y Karma (testing)

## Estructura del Proyecto

```
src/
  app/
    features/
      home/
      quotation/
      vehicle-catalog/
    layout/
    shared/
  assets/
  styles.scss
  main.ts
  index.html
```

- **features/quotation/**: Módulo de cotización de seguros.
- **features/vehicle-catalog/**: Módulo de administración de vehículos.
- **shared/**: Componentes reutilizables, mocks y utilidades.(Atomic Design)
- **layout/**: Componentes de layout y rutas principales.

## Instalación

1. Clona el repositorio:
   ```sh
   git clone https://github.com/mariollori/miBanco-test.git
   cd mi-banco-test
   ```

2. Instala las dependencias:
   ```sh
   npm install
   ```

## Uso

### Servidor de desarrollo

```sh
npm start
```
Abre [http://localhost:4200](http://localhost:4200) en tu navegador.

### Construcción para producción

```sh
npm run build
```
Los archivos de salida estarán en la carpeta `dist/`.

### Pruebas unitarias

```sh
npm test
```

### Docker

En la raiz del proyecto ejecutar (construye imagen)
```sh
docker build -t angular-container .
```
Levantar servidor en el puerto 80

```sh
docker container run -p 80:80 angular-container
```

Ingresar a localhost

## Convenciones de estilos

- Se utiliza la metodología **BEM** para nombrar las clases CSS/SCSS.
- Los estilos globales están en `src/styles.scss`.

## Notas

- El catálogo de vehículos utiliza datos simulados en [`public/mocks/vehicles.json`](public/mocks/vehicles.json).
- El historial de cotizaciones se almacena en la sesión del navegador.

## Resultados

- Home page

![alt text](/public/readme/image.png)

- Quotation Page

![alt text](image.png)

- Catalog Page

![alt text](/public/readme/image-2.png)

- Docker Container

![alt text](/public/readme/image4.png)