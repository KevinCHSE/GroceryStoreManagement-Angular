# Grocery Store Management · Angular

Web client for managing a small grocery store: product catalog and stock, customers with store credit, sales and customer payments. Built for a real family grocery store. The interface is in Spanish.

**Live demo:** [add link] · **Backend repo:** [grocery-store-management-spring](add link)

> The backend runs on Render's free tier, so the first request after a period of inactivity can take up to a minute.


## Features

- **Dashboard** – active customers, sales of the month, low-stock products and a purchases report.
- **Products** – searchable list, create, edit, activate / deactivate, and stock control.
- **Customers** – searchable list, create, edit, activate / deactivate; credit limit, amount owed and total purchased per customer.
- **New sale** – customer and product search, cart with live total, cash or credit payment, stock validation when adding items, and the server's error message when a sale is rejected.
- **Payment report** – payments per customer with period, amount paid, previous balance and new balance.
- **Users** – admin-only screen to create users with the `ADMIN` or `USER` role.
- **Authentication** – JWT login; screens and navigation adapt to the user's role.

## Tech stack

- **Angular 21** – standalone components, signals, `computed`, `rxResource`
- **TypeScript 5.9** and **RxJS 7.8**
- **jwt-decode** to read the role and expiry from the token
- **Vitest** for unit tests, **Prettier** for formatting
- Angular CLI (esbuild)

## Technical highlights

- Standalone components with lazy-loaded feature routes (`loadChildren`).
- Local state with signals; derived values such as the cart total are `computed`, so they cannot get out of sync.
- Data fetching with `rxResource`, reloaded after mutations so stock stays up to date.
- Functional HTTP interceptor: sends the JWT only to the API and signs the user out when the API answers `401`.
- Functional route guards (`authGuard`, `adminGuard`) that check the token's expiry on every navigation.
- Typed models for every API payload.
- Separate environment files for local development and production.

## Getting started

**Requirements:** Node.js 22 or newer, npm, and the [backend](add link) running on `http://localhost:8080`.

```bash
git clone https://github.com/KevinCHSE/grocery-store-management-angular.git
cd grocery-store-management-angular
npm install
npm start
```

The app is served at `http://localhost:4200`.

`npm start` runs `ng serve` with the development configuration, which swaps the environment file so the app talks to your local backend:

| File | Used by | API URL |
|---|---|---|
| `src/Environments/environments.development.ts` | `ng serve` | `http://localhost:8080` |
| `src/Environments/environment.ts` | production build | deployed API |

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Dev server with live reload |
| `npm run build` | Production build in `dist/` |
| `npm test` | Unit tests with Vitest |

## Project structure

```
src/
├── Environments/            # API URL for development and production
└── app/
    ├── Login/               # login screen
    ├── Security/            # AuthService, HTTP interceptor, route guards
    ├── Service/             # login service
    ├── Interface/           # login interfaces
    └── Pulperia/
        ├── Layout/          # app shell
        ├── nav-bar/         # navigation
        ├── pages/           # dashboard, products, clients, cart, payment report, new user
        ├── Models/          # typed API models
        ├── Service/         # HTTP services
        └── Pipes/           # search pipe
```

## Authentication

The backend returns a JWT on login. The app stores it in `localStorage`, decodes the roles (`ROLE_ADMIN`, `ROLE_USER`) from it to show or hide options, and sends it in the `Authorization` header on every API request. An expired or rejected token sends the user back to the login screen. The real authorization is always enforced by the backend.


## Author

Kevin · [LinkedIn](add link) · [GitHub](https://github.com/KevinCHSE)
