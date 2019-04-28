# config-reducer

> **One config file for development, test and production.** :sparkles:

Useful when you want to have simplicity your configuration pipeline.<br>
Work with a webpack-merge.

## A picture is worth a thousand words:

### Example 1 (trivial)

```
{
  development: {    // <--
    stats: {
      colors: true,
    },
  },
  module: {},
  plugins: [],
}
```

Output for process.env.NODE_ENV === 'development':

```
{
  stats: {
    colors: true,
  },
  module: {},
  plugins: [],
}
```

Output for process.env.NODE_ENV === 'production':

```
{
  module: {},
  plugins: [],
}
```

### Example 2 (webpack.config.js)

```
{
  development: {    // <--
    stats: {
      colors: true,
      warnings: true,
    },
  },
  module: {
    rules: [
      {
        include: [paths.dir.app],
        use: [
          {
            loader: 'css-loader',
            options: {
              modules: true,
              development: {    // <--
                minimize: false,
              },
            }
          },
        ],
      },
    ],
  },
  plugins: [
    new Dotenv(config.dotenv),
    {development: () => {    // <--
      const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
      return [
        new HardSourceWebpackPlugin(),
      ]
    }},
    {production: [    // <--
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.HashedModuleIdsPlugin(),
    ]},
  ],
}
```

Output for process.env.NODE_ENV === 'development':

```
{
  stats: {
    colors: true,
    warnings: true,
  },
  module: {
    rules: [
      {
        include: [paths.dir.app],
        use: [
          {
            loader: 'css-loader',
            options: {
              modules: true,
              minimize: false,
            }
          },
        ],
      },
    ],
  },
  plugins: [
    new Dotenv(config.dotenv),
    new HardSourceWebpackPlugin(),
  ],
}
```

### Example 3 (babel.config.js)

```
{
  presets: ['@babel/preset-env'],
  plugins: [
    [
      'emotion',
      {
        hoist: true,
        development: {    // <--
          sourceMap: true,
          hoist: false,
        },
      },
    ],

    'react-hot-loader/babel',
    {development: ['@babel/plugin-transform-react-jsx-source']},    // <--
    {production: [    // <--
      'transform-react-remove-prop-types',
    ]},
  ],
}
```

Output for process.env.NODE_ENV === 'production':

```
{
  presets: ['@babel/preset-env'],
  plugins: [
    [
      'emotion',
      {
        hoist: true,
      },
    ],

    'react-hot-loader/babel',
    'transform-react-remove-prop-types',
  ],
}
```


## Installation

```
$ npm install config-reducer
```

or

```
$ yarn add config-reducer
```


## Usage

Copy and paste ;)

```js
const { devProdReducer } = require('config-reducer')

module.exports = devProdReducer({
  development: {
    devtool: 'inline-cheap-module-source-map',
    mode: 'development',
  },
  devtool: 'source-map',
  name: 'client',
  target: 'web',
  // ...
})
```


## API

### Import variants:

#### default

```js
const configReducer = require('config-reducer').default

const commonConfig = {
  development: {
    stats: {
      colors: true,
      warnings: true,
    },
  },
  // ... config -> go to example 2
}

const result = configReducer(commonConfig, process.env.NODE_ENV, [
  'development',
  'production',
])
```

```js
const configReducer = require('config-reducer').default

module.exports = api => {
  const babelConfig = {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    // ... config -> go to example 3
  }

  return configReducer(babelConfig, api.env(), [
    'development',
    'production',
    'test',
  ])
}
```

#### devReducer

```js
const { devReducer } = require('config-reducer')

module.exports = devReducer({
  development: {
    devtool: 'inline-cheap-module-source-map',
    mode: 'development',
  },
  devtool: 'source-map',
  name: 'client',
  target: 'web',
  // ... config -> go to example 2
})

```

#### prodReducer

```js
const { prodReducer } = require('config-reducer')
```

#### testReducer

```js
const { testReducer } = require('config-reducer')
```

#### devProdReducer

```js
const { devProdReducer } = require('config-reducer')

module.exports = devReducer({
  development: {
    devtool: 'inline-cheap-module-source-map',
    mode: 'development',
  },
  output: {
    production: {
      filename: '[name].[chunkhash].js',
    },
    filename: '[name].js',
  },
  devtool: 'source-map',
  name: 'client',
  target: 'web',
  // ... config -> go to example 2
})

```

#### devTestReducer

```js
const { devTestReducer } = require('config-reducer')
```

#### prodTestReducer

```js
const { prodTestReducer } = require('config-reducer')
```

#### devProdTestReducer

```js
const { devProdTestReducer } = require('config-reducer')
```

### Parameters:

Module steps:

1. find and prepare (deep duplicate) - `input`
2. apply to parent - `reducer`
3. delete references - `cleanup`

```js
devProdReducer(input, reducer, cleanup)
```

#### input

Type: `Object|Array`<br>
Required: `true`<br>

Your configuration object or array variants:

##### [{ development: [] }]

##### {{ development: {} }}

##### [{ development: () => [] }]

The function warrant is intended to be postponed until the configurations are reduced. Thanks to this, we do not have to import modules from which we do not use:

1 Install module for development mode

```
$ yarn add --dev hard-source-webpack-plugin
```

2 Configuration

```js
{
  plugins: [
    new Dotenv(config.dotenv),
    {development: () => {
      const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
      return [
        new HardSourceWebpackPlugin(),
      ]
    }},
  ],
}
```

3 Compile production version - work fine, without `hard-source-webpack-plugin`

```
$ yarn prod
```

Useful in Dockerfile.

##### {{ development: () => {} }}

#### reducer

Type: `string`<br>
Default: `process.env.NODE_ENV`

This key will be merged.

#### cleanup

Type: `boolean|string|Array<string>`<br>
Default: `true`

These keys will be deleted.

- false: do nothing
- true: delete reducer
- string: delete key
- array of strings: delete keys


## Real examples

- [webpack config example 1](https://gitlab.com/krystian_m/boilerplate/blob/master/config/webpack.common.js)
- [webpack config example 2](https://gitlab.com/krystian_m/boilerplate/blob/master/config/webpack.client.js)
- [babel config example](https://gitlab.com/krystian_m/boilerplate/blob/master/babel.config.js)


## TODO
- array/object reducer
- reducer in reducer / nested reducers
- alias ex: test = _test


## Issues

If you find a bug, please file an issue on issue tracker on [GitHub](https://github.com/monopix/config-reducer/issues).


## License

MIT
