import path       from 'node:path';

import commonjs   from '@rollup/plugin-commonjs';
import resolve    from '@rollup/plugin-node-resolve';
import terser     from '@rollup/plugin-terser';        // Terser is used for minification / mangling
import virtual    from '@rollup/plugin-virtual';

// Terser config; refer to respective documentation for more information.
const terserConfig = {
   compress: { passes: 3 },
   mangle: { toplevel: true, keep_classnames: true, keep_fnames: true },
   ecma: 2021,
   module: true
};

// The deploy path for the server bundle which includes the common code.
const s_DEPLOY_PATH = './external';

const s_DEPLOY_MINIFY = true;

// Produce sourcemaps or not
const s_SOURCEMAP = true;

// Defines potential output plugins to use conditionally if the .env file indicates the bundles should be
// minified / mangled.
const outputPlugins = [];
if (s_DEPLOY_MINIFY)
{
   outputPlugins.push(terser(terserConfig));
}

export default () =>
{
   return [
      {
         input: 'pack',
         output: [{
            file: `${s_DEPLOY_PATH}${path.sep}collect.js`,
            format: 'es',
            plugins: outputPlugins,
            generatedCode: { constBindings: true },
            sourcemap: s_SOURCEMAP,
         }],
         plugins: [
            virtual({
               pack: `export { collect as default } from './node_modules/collect.js/src/index.js';`
            }),
            resolve({ browser: true }),
            commonjs()
         ]
      },
      {
         input: 'pack',
         output: [{
            file: `${s_DEPLOY_PATH}${path.sep}DOMPurify.js`,
            format: 'es',
            plugins: outputPlugins,
            generatedCode: { constBindings: true },
            sourcemap: s_SOURCEMAP,
         }],
         plugins: [
            virtual({
               pack: `export { default } from './node_modules/dompurify/dist/purify.es.mjs';`
            })
         ]
      }
   ];
};
