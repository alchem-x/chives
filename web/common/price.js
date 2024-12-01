import { isNumber } from 'lodash-es'

export const getToFixedN = (d) => (n) => isNumber(n) ? parseFloat(n.toFixed(d)) : n
export const toFixed2 = getToFixedN(2)
export const toFixed3 = getToFixedN(3)

export const styleColorRed = {
    color: '#ee2500',
}

export const styleColorGreen = {
    color: '#093',
}

export const getCurrentPriceItem = (quote, wrap) => {
    const value = quote.current ? `${toFixed3(quote.current)} ${wrap ? '\n' : ''}(${quote.chg >= 0 ? `+${toFixed3(quote.chg) ?? 0}` : toFixed3(quote.chg)}, ${quote.percent >= 0 ? `+${toFixed2(quote.percent) ?? 0}` : toFixed2(quote.percent)}%)` : ''
    const red = quote.chg > 0
    const green= quote.chg < 0
    const className = { red, green, }
    const style = {}
    if (red) {
        Object.assign(style, styleColorRed)
    }
    if (green) {
        Object.assign(style, styleColorGreen)
    }
    return {
        value,
        style,
        className,
    }
}