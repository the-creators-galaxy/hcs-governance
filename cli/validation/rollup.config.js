import typescript from 'rollup-plugin-typescript2'
export default [
    {
        input: './src/index.ts',
        output: {
            file: './lib/index.mjs',
            format: 'esm',
        },
        plugins: [typescript()],
        external: ['https', 'url', 'crypto']
    },
    {
        input: './src/index.ts',
        output: {
            file: './lib/index.js',
            format: 'cjs',
        },
        plugins: [typescript()],
        external: ['https', 'url', 'crypto']
    },
]