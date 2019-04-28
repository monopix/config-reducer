const omit = require('lodash/omit')
const reduce = require('lodash/reduce')
const intersection = require('lodash/intersection')
const forEach = require('lodash/forEach')
const isArray = require('lodash/isArray')
const isFunction = require('lodash/isFunction')
const isBoolean = require('lodash/isBoolean')
const isPlainObject = require('lodash/isPlainObject')

const configReducer = (object, reducer = process.env.NODE_ENV, clean = true) => {
  const transform = obj => {
    //
    // TODO: nested multi reducer and the same reducer
    // TODO: alias ex:  _test or $test -> test

    // if (isPlainObject(obj)) {
    //   const reducers = isArray(reducer) ? reducer : [reducer]
    //   console.log(reducers)
    //   let result = {}
    //   reducers.forEach(red => {
    //     result = Object.assign(
    //       result,
    //       omit(obj, isBoolean(clean) && clean ? red : clean),
    //       isFunction(obj[red]) ? obj[red](red, obj) : obj[red]
    //     )
    //     console.log(result)
    //   })
    //   console.log(result)
    //   return result
    // }
    if (isPlainObject(obj)) {
      const result = Object.assign(
        omit(obj, isBoolean(clean) && clean ? reducer : clean),
        isFunction(obj[reducer]) ? obj[reducer](reducer, obj) : obj[reducer]
      )
      return Object.keys(result).length ? result : undefined
    }
    if (isArray(obj)) {
      return obj.reduce((result, value) => {
        if (isPlainObject(value) && value[reducer]) {
          const _value = isFunction(value[reducer])
            ? value[reducer](reducer, obj)
            : value[reducer]

          return [...result, ...(isArray(_value) ? _value : [_value])]
        }

        return [...result, value]
      }, [])
    }

    return obj
  }

  const recursion = obj => {
    const result = transform(obj)

    // Note: Do not use isObjectLike() because
    //       classes will be classified.

    if (isPlainObject(result)) {
      forEach(result, (value, key) => {
        const out = recursion(value)
        result[key] = out
      })
    }

    if (isArray(result)) {
      return reduce(
        result,
        (sum, value) => {
          const out = recursion(value)
          return out !== undefined ? [...sum, out] : sum
        },
        []
      )
    }

    return result
  }

  return recursion(object)
}

module.exports = {
  default: configReducer,
  devReducer: (config, reducer = process.env.NODE_ENV) =>
    configReducer(
      config,
      reducer,
      ['development']
    ),
  prodReducer: (config, reducer = process.env.NODE_ENV) =>
    configReducer(
      config,
      reducer,
      ['production']
    ),
  testReducer: (config, reducer = process.env.NODE_ENV) =>
    configReducer(
      config,
      reducer,
      ['test']
    ),
  devProdReducer: (config, reducer = process.env.NODE_ENV) =>
    configReducer(
      config,
      reducer,
      ['development', 'production']
    ),
  devTestReducer: (config, reducer = process.env.NODE_ENV) =>
    configReducer(
      config,
      reducer,
      ['development', 'test']
    ),
  prodTestReducer: (config, reducer = process.env.NODE_ENV) =>
    configReducer(
      config,
      reducer,
      ['production', 'test']
    ),
  devProdTestReducer: (config, reducer = process.env.NODE_ENV) =>
    configReducer(
      config,
      reducer,
      ['development', 'production', 'test']
    ),
}
