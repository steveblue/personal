import nodeResolve from '@rollup/plugin-node-resolve';
import commonjsResolve from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';
import { string } from 'rollup-plugin-string';

export default [{
    input: 'src/client/server.ts',
    treeshake: true,
    external: ['node-fetch', 'lowdb', 'lowdb/adapters/FileSync', 'path'],
    output: {
        file: 'src/server/view/index.js',
        format: 'esm'
    },
    plugins: [
        replace({ 'dist/db.json': 'db.json' }),
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
        typescript(),
        commonjsResolve()
    ],
    onwarn: function (message) {

        console.log(message);

    }
}]