# Cash Register (for Kids)

This app simulates a cash register in the browser for kids to play.
The app runs fully client-side in the browser using svelte. A deployment is available here:
[Cash Register](https://jonasdiemer.github.io/cash-register/)

The project is written with help of AI (Claude).

## Main Features

- Enter store inventory (items, price, quantity)
- Checkout process with barcode scanning
- Receipt QR code generation

See [Masterplan](masterplan.md) for more details.

## Developing

After cloning the project and installing dependencies with `pnpm install` (or `pnpm install` or `yarn`), start a development server:

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
