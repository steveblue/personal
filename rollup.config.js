import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import { string } from 'rollup-plugin-string';

export default [{
    input: 'src/client/index.ts',
    treeshake: true,
    output: {
        file: 'src/client/index.js',
        format: 'esm'
    },
    plugins: [
        (process.env.EMULATE_API) ? replace() : replace({ 'http://localhost:4444': 'https://stephenbelovarich.com' }),
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
        string({
            include: ['**/*.html'],
        }),
        typescript()
    ],
    onwarn: function (message) {

        console.log(message);

    }
},
{
    input: 'src/server/init.ts',
    treeshake: true,
    external: ['lokijs', 'node-fetch', 'chalk'],
    output: {
        file: 'dist/init.js',
        format: 'cjs'
    },
    plugins: [
        replace({ 'dist/DB': 'DB' }),
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