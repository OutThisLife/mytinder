export * from './tinder'

export const getAge = (d: string) =>
  Math.floor((+new Date() - +new Date(d)) / 31557600000)
