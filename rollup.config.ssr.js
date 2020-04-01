import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import { string } from 'rollup-plugin-string';

export default [{
    input: 'src/client/server.ts',
    treeshake: true,
    output: {
        file: 'src/server/view/index.js',
        format: 'esm'
    },
    plugins: [
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
}]