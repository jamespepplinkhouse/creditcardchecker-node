import { always, cond, map, T } from 'ramda'

const isAmex = (card: string) =>
  card.length === 15 &&
  (card.substr(0, 2) === '34' || card.substr(0, 2) === '37')
const isDiscover = (card: string) =>
  card.length === 16 && card.substr(0, 4) === '6011'
const isMasterCard = (card: string) =>
  card.length === 16 &&
  (card.substr(0, 2) === '51' || card.substr(0, 2) === '55')
const isVisa = (card: string) =>
  (card.length === 13 || card.length === 16) && card.substr(0, 1) === '4'

const determineCardType = cond([
  [isVisa, always('VISA')],
  [isMasterCard, always('MasterCard')],
  [isDiscover, always('Discover')],
  [isAmex, always('AMEX')],
  [T, always('Unknown')]
])

export const luhn = (card: string): boolean => {
  let b = 0
  let c = 0
  let total = 0
  let e = 0

  // tslint:disable-next-line:whitespace
  for (total = +card[(b = card.length - 1)], e = 0; b--; ) {
    c = +card[b]
    total += ++e % 2 ? (2 * c) % 10 + (c > 4 ? 1 : 0) : c
  }

  return !(total % 10)
}

export const validateCard = (card: string): string => {
  const cardType = determineCardType(card)
  const validity = cardType !== 'Unknown' && luhn(card) ? 'valid' : 'invalid'
  return `${cardType}: ${card} (${validity})`
}

export const validateCards = (cards: string[]): string[] =>
  map(validateCard, cards)
