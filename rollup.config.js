import fs from 'fs'

import {nodeResolve} from '@rollup/plugin-node-resolve'
import dotenv from "rollup-plugin-dotenv"
import commonjs from '@rollup/plugin-commonjs'
import riot from 'rollup-plugin-riot'

const pkgData = JSON.parse(fs.readFileSync('package.json'))
process.env['QTEI_VERSION'] = pkgData['version']

const NODE_ENV = process.env['NODE_ENV'] || 'development'
const optimize = (NODE_ENV == 'production')

const demo = {
  input: 'src/app.js',
  output: {
    file: 'public/app.js',
    format: optimize ? 'iife' : 'esm',
    sourcemap: !optimize
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    riot(),
    dotenv()
  ]
}

const lib = {
  input: 'src/lib.js',
  output: {
    file: optimize ? 'dist/qtei.min.js' : 'public/qtei.js',
    format: optimize ? 'iife' : 'esm',
    sourcemap: !optimize
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    riot(),
    dotenv()
  ]
}

export default (optimize ? [lib] : [demo, lib])
