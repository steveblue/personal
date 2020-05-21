import nodeResolve from '@rollup/plugin-node-resolve';
import commonjsResolve from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';
import html from 'rollup-plugin-string-html';

export default [{
    input: 'src/client/server.ts',
    treeshake: true,
    external: ['node-fetch', 'lowdb', 'lowdb/adapters/FileSync', 'path', 'html-minifier-terser'],
    output: {
        file: 'src/server/view/index.js',
        format: 'esm'
    },
    plugins: [
        (process.env.EMULATE_API) ? replace({ 'http://localhost:4443': 'http://localhost:4444', 'dist/db.json': 'db.json' }) : replace({ 'http://localhost:4443': 'https://stephenbelovarich.com', 'dist/db.json': 'db.json' }),
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
}]