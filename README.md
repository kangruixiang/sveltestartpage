# Svelte template with Tailwind CSS

<br>

<div style="display:flex">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Svelte_Logo.svg/199px-Svelte_Logo.svg.png" />
  <img src="https://seeklogo.com/images/T/tailwind-css-logo-5AD4175897-seeklogo.com.png" />
</div>

<br>

## Install Tailwind CSS with Svelte

Setting up Tailwind CSS in a Svelte project.

<ol>
  <li>
    <p>Install necessary dependencies:</p>

```sh
npm i -D svelte-preprocess tailwindcss postcss autoprefixer
```

  </li>
  <li>
    <p>Run the init command to generate the <code>tailwind.config.js</code> file:</p>

```sh
npx tailwindcss init
```

  </li>
  <li>
    <p>Configure <b>svelte-preprocess</b> in your <code>rollup.config.js</code> file:</p>

```js
// ...
import sveltePreprocess from 'svelte-preprocess'

// ...

export default {
  // ...
  plugins: [
    svelte({
      // ...
      preprocess: sveltePreprocess({
        sourceMap: !production,
        postcss: {
          plugins: [require('tailwindcss')(), require('autoprefixer')()],
        },
      }),
    }),
    // ...
  ],
  // ...
}
```

  </li>
  <li>
    <p>Add the Tailwind directives to your <code>App.svelte</code>:</p>

```svelte
<script>
  export let name;
</script>

<main>
  <h1>Hello {name}!</h1>
  <p> Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</main>

<style lang="postcss" global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
```

  </li>
  <li>
    <p>Finally, add the paths to all of your template files in your <code>tailwind.config.js</code> file:</p>
    
```js
module.exports = {
  content: ['./public/index.html', './src/**/*.svelte'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
  </li>
</ol>

<br>

## Get started

Install the dependencies...

```bash
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

### Building and running in production mode

```bash
npm run build
```

### Using TypeScript

This template comes with a script to set up a TypeScript development environment, run:

```bash
node scripts/setupTypeScript.js
```
