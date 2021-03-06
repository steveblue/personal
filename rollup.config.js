import nodeResolve from '@rollup/plugin-node-resolve';
import commonjsResolve from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import html from 'rollup-plugin-string-html';

function replaceHost() {
    return (process.env.EMULATE_API) ?
            replace({ 'http://localhost:4443': 'http://localhost:4444' }) :
            replace({ 'http://localhost:4444': 'https://stephenbelovarich.com' });
}

export default [{
    input: 'src/client/index.ts',
    treeshake: true,
    output: {
        file: 'src/client/index.js',
        format: 'esm'
    },
    plugins: [
        replaceHost(),
        nodeResolve({
            mainFields: ['module', 'jsnext'],
            extensions: ['.ts', '.js']
        }),
        postcss({
            extract: false,
            modules: false,
            use: [
                ['sass', {
                    includePaths: ['src/client/style']
                }]
            ],
            minimize: true,
            extensions: ['.scss','.css']
        }),
        html({
            include: ["**/*.html"],
            exclude: ["**/index.html"],
            minifier: {}
        }),
        typescript(),
        commonjsResolve()
    ],
    onwarn: function (message) {

        console.log(message);

    }
},
{
    input: 'src/client/bus.ts',
    treeshake: true,
    output: {
        file: 'src/client/bus.js',
        format: 'esm'
    },
    plugins: [
        replaceHost(),
        nodeResolve({
            mainFields: ['module', 'jsnext'],
            extensions: ['.ts', '.js']
        }),
        typescript()
    ],
    onwarn: function (message) {

        console.log(message);

    }
},
{
    input: 'src/config.ts',
    treeshake: true,
    output: {
        file: 'dist/config.js',
        format: 'cjs'
    },
    plugins: [
        replaceHost(),
        nodeResolve({
            mainFields: ['module', 'jsnext'],
            extensions: ['.ts', '.js']
        }),
        typescript()
    ],
    onwarn: function (message) {

        console.log(message);

    }
},
{
    input: 'src/config.ts',
    treeshake: true,
    output: {
        file: 'dist/server/config.js',
        format: 'cjs'
    },
    plugins: [
        replaceHost(),
        nodeResolve({
            mainFields: ['module', 'jsnext'],
            extensions: ['.ts', '.js']
        }),
        typescript()
    ],
    onwarn: function (message) {

        console.log(message);

    }
},
{
    input: 'src/server/db.ts',
    treeshake: true,
    external: ['nedb', 'node-fetch', 'chalk', 'path'],
    output: {
        file: 'dist/db.js',
        format: 'cjs'
    },
    plugins: [
        replace({ 'dist/db.json': 'db.json' }),
        nodeResolve({
            mainFields: ['main', 'module'],
            extensions: ['.ts', '.js']
        }),
        typescript()
    ],
    onwarn: function (message) {

        console.log(message);

    }
}]