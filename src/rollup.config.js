import {nodeResolve} from '@rollup/plugin-node-resolve'

import riot from 'rollup-plugin-riot'
import commonjs from '@rollup/plugin-commonjs'

import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import dotenv from "rollup-plugin-dotenv"

const NODE_ENV = process.env['NODE_ENV'] || 'development'
const optimize = (NODE_ENV == 'production')
// console.log(NODE_ENV, optimize)

const app = {
  input: '_assets/app.js',
  output: {
    file: '_site/assets/app.js',
    format: optimize ? 'iife' : 'esm',
    sourcemap: true
  },
  plugins: [
    nodeResolve(),
    dotenv(),
    commonjs(),
    riot()
  ]
}

const database = {
  input: '_assets/database.js',
  output: {
    file: '_site/assets/database.js',
    format: optimize ? 'iife' : 'esm',
    sourcemap: !optimize
  },
  plugins: [
    nodeResolve(),
    dotenv(),
    commonjs()
  ]
}

export default [app, database]
