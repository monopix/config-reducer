const { default: configReducer, devTestReducer } = require('./index')

it('should return the same object', () => {
  const input = { a: 1, b: 2 }
  const expected = { a: 1, b: 2 }
  expect(configReducer(input, 'test')).toEqual(expected)
})

it('should reduce object & clean by array', () => {
  const input = { foo: { a: 1 }, bar: { b: 2 }, bazz: { c: 5 } }
  const expected = { a: 1 }
  expect(configReducer(input, 'foo', ['foo', 'bar', 'bazz'])).toEqual(expected)
})

it('should reduce object & clean by string', () => {
  const input = { test: { a: 1 } }
  const expected = { a: 1 }
  expect(configReducer(input, 'test', 'test')).toEqual(expected)
})

it('should reduce object & clean by boolean', () => {
  const input = { test: { a: 1 } }
  const expected = { a: 1 }
  expect(configReducer(input, 'test', true)).toEqual(expected)
})

it('should reduce object & not clean', () => {
  const input = { test: { a: 1 } }
  const expected = { a: 1, test: { a: 1 } }
  expect(configReducer(input, 'test', false)).toEqual(expected)
})

it('should overwrite value', () => {
  const input = { test: { a: 2 }, a: 1 }
  const expected = { a: 2 }
  expect(configReducer(input, 'test')).toEqual(expected)
})

it('should return the same array', () => {
  const input = [1, { a: 2 }]
  const expected = [1, { a: 2 }]
  expect(configReducer(input, 'test')).toEqual(expected)
})

it('should reduce object in array', () => {
  const input = [1, { test: 2 }]
  const expected = [1, 2]
  expect(configReducer(input, 'test')).toEqual(expected)
})

it('should reduce array to array & clean by array', () => {
  const input = [1, { foo: [2, 3] }, { bar: [4] }, { bazz: [5] }]
  const expected = [1, 2, 3]
  expect(configReducer(input, 'foo', ['foo', 'bar', 'bazz'])).toEqual(expected)
})

it('should reduce nested object', () => {
  const input = { a: 1, b: { test: { c: 2 } } }
  const expected = { a: 1, b: { c: 2 } }
  expect(configReducer(input, 'test')).toEqual(expected)
})

it('should reduce function in object', () => {
  const input = { foo: () => ({ a: 1 }), bar: () => ({ b: 2 }) }
  const expected = { a: 1 }
  expect(configReducer(input, 'foo', ['foo', 'bar'])).toEqual(expected)
})

// TO DO

// fit('should reduce function that modifies current config state', () => {
//   // const input = { a: 1, foo: state => { state.a = 7 } }
//   const expected = { a: 7 }
//   expect(configReducer(input, 'foo')).toEqual(expected)
// })
//
// it('should use reducers from object', () => {
//   const input = { foo: { a: 1 }, bar: { b: 2 } }
//   const expected = { a: 1, bar: { b: 2 } }
//   expect(configReducer(input, { foo: true, bar: false })).toEqual(expected)
// })
//
// it('should use reducers from array', () => {
//   const input = { foo: { a: 1 } }
//   const expected = { a: 1 }
//   expect(configReducer(input, ['foo', 'bar'])).toEqual(expected)
// })
//
// it('should reduce nested the same reducer', () => {
//   const input = { a: 1, b: { test: { c: 2, test: { d: 3 } } } }
//   const expected = { a: 1, b: { c: 2 } }
//   expect(configReducer(input, 'test')).toEqual(expected)
// })

it('should reduce function in array', () => {
  const input = [{ foo: () => [1] }, { bar: () => [2] }]
  const expected = [1]
  expect(configReducer(input, 'foo', ['foo', 'bar'])).toEqual(expected)
})

it('should reduce object in array in object', () => {
  const input = { foo: [{ test: { a: 1 } }] }
  const expected = { foo: [{ a: 1 }] }
  expect(configReducer(input, 'test')).toEqual(expected)
})

it('should reduce nested array', () => {
  const input = { foo: [[{ bar: [{ test: { a: 1 } }] }]] }
  const expected = { foo: [[{ bar: [{ a: 1 }] }]] }
  expect(configReducer(input, 'test')).toEqual(expected)
})

it('should keep order in array', () => {
  const input = [1, { test: { b: 2 } }, { c: 3 }]
  const expected = [1, { b: 2 }, { c: 3 }]
  expect(configReducer(input, 'test')).toEqual(expected)

  const falseInput = [{ test: { b: 2 } }, 1, { c: 3 }]
  const falseExpected = [1, { b: 2 }, { c: 3 }]
  expect(configReducer(falseInput, 'test')).not.toEqual(falseExpected)
})

it('should works with predefined settings', () => {
  const input = { a: 1, development: { b: 2 }, test: { c: 5 } }
  const expected = { a: 1, c: 5 }
  expect(devTestReducer(input)).toEqual(expected)
})
