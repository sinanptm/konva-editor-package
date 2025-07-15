import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import strip from '@rollup/plugin-strip';

export default [
    {
        input: './index.ts',
        output: [
            {
                file: 'dist/index.js',
                format: 'cjs',
                sourcemap: true,
            },
            {
                file: 'dist/index.esm.js',
                format: 'esm',
                sourcemap: true,
            },
        ],
        plugins: [
            peerDepsExternal(),
            resolve({
                extensions: ['.ts', '.tsx', '.js', '.jsx'],
            }),
            commonjs(),
            strip({
                directives: ['use client'],
            }),
            typescript({
                tsconfig: './tsconfig.json',
                jsx: 'react-jsx',
                include: ['**/*.ts', '**/*.tsx'], 
                exclude: ['node_modules', 'dist'],
            }),
            postcss({
                config: {
                    "path": "./styles/globals.css"
                },
                minimize: true,
                inject: {
                    insertAt: "top"
                }
            }),
            terser(),
        ],
        external: [
            'react',
            'react-dom',
            'konva',
            'react-konva',
            'zustand',
            'zundo',
            'use-image',
            'class-variance-authority',
            'clsx',
            'tailwind-merge',
            'lucide-react',
            '@radix-ui/react-label',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            'tw-animate-css'
        ],
    },
    {
        input: './index.ts',
        output: [{file: 'dist/index.d.ts', format: 'es6'}],
        plugins: [
            dts({
                tsconfig: './tsconfig.json',
            }),
        ],
        // external: [/\.css$/],
    },
];