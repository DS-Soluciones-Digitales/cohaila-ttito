
## Requisitos

- Node.js 20+ 
- npm

## Instalacion

npm install


## Desarrollo

npm run dev


Luego abre la URL que imprime Vite en consola.

## Backend

El backend real vive en `../conversor-backend`.

cd ../conversor-backend
npm install
npm run dev


Endpoint principal:

GET /exchangeRate/{from}/{to}?dateFrom=YYYY-MM-DD


## Build de produccion

npm run build


Para previsualizar el build:

npm run preview


## Tests

npm run test


Modo interactivo:

npm run test:watch


## Configuracion del backend

La app puede usar el backend real o el mock local.

- En la UI puedes modificar `Backend URL` y activar o desactivar `Usar mock local`.
- La configuracion queda guardada en `localStorage`.
- Variables de entorno opcionales:
  - `VITE_API_BASE_URL` (por defecto `http://localhost:3001`)
  - `VITE_USE_MOCK` (`true` o `false`, por defecto `false`)

## Notas funcionales

- El selector evita combinaciones de monedas no permitidas.
- Al cambiar una moneda, el valor vuelve a 1 y se recalcula el equivalente.
- La grafica muestra siempre los ultimos 5 tipos de cambio.
- `dateFrom` solo acepta fechas entre hoy y los ultimos 4 dias.
