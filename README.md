Web app created for a [contest](https://dev.to/challenges/pinata) in [Dev Community](https://dev.to)

## What's under the hood

-  NodeJS - [https://www.nodejs.org](https://www.nodejs.org)
-  Typescript - [https://www.typescriptlang.org/](https://www.typescriptlang.org/)
-  ReactJS - [https://www.react.dev/](https://www.react.dev/)
-  NextJS - [https://www.nextjs.org/](https://www.nextjs.org/)
-  TailwindCSS - [https://www.tailwindcss.com/](https://www.tailwindcss.com/)
-  Next-Intl - [https://next-intl-docs.vercel.app/](https://next-intl-docs.vercel.app/)
-  Next-Themes - [https://www.github.com/pacocoursey/next-themes](https://www.github.com/pacocoursey/next-themes)
-  NextUI - [https://www.nextui.org/](https://www.nextui.org/)
-  ReactIcons - [https://react-icons.github.io/react-icons/](https://react-icons.github.io/react-icons/)
-  PinataSDK - [https://www.pinata.cloud](https://www.pinata.cloud)

## Techniques used

-  'Content-Security-Policy' to secure the application against hijack and code injection
-  Components and functions reused as much as possible across the application
-  Optimized global state manager
-  Visualization of optimized image thumbnails from Pinata Cloud
-  Audio and video playback in the file details dialog
-  Translations for the 10 most spoken languages
-  Detection of the user's browser language
-  Dark/Light themes
-  Drag and drop support

## The first

-  Create an account on Pinata Cloud
-  Create and API Key with administration priviledge (copy the JWT key for later)
-  Make a copy of the file 'env.sample' to '.env.local' inside the cloned repository folder, edit it and fill the fields

## Installing dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

## Building and running the production server

```bash
npm run build
npm run start
# or
yarn build
yarn start
# or
pnpm build
pnpm start
# or
bun build
bun start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Running the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
