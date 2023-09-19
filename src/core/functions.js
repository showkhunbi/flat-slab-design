export const selectBar = (areaOfSteel, options = {}) => {
    let AsProvided, noOfBars, barSize
    AsProvided = noOfBars = barSize = 0
    let defaultOptions = {
        bar_sizes: [12],
        min_number_of_bars: 1,
        max_number_of_bars: null,
        span: null,
        min_spacing: null,
        even_number_of_bars: false
    }
    options = { ...defaultOptions, ...options }

    if (Array.isArray(options.bar_sizes)) {
        options.bar_sizes.sort()
    } else {
        throw TypeError("Bar_sizes argument must be a list")
    }

    if (options.span && options.max_number_of_bars === null) {
        options.max_number_of_bars = Math.floor(options.span / (options.min_spacing || 100))
    }

    if (options.max_number_of_bars) {
        for (let i = 0; i < options.bar_sizes.length; i++) {
            let bar_size = options.bar_sizes[i]
            let areaOfBar = Math.PI * (bar_size ** 2) / 4
            let num_of_bars = Math.ceil(areaOfSteel / areaOfBar)

            if (options.bar_sizes.indexOf(bar_size) === 0 && num_of_bars < options.min_number_of_bars) {
                noOfBars = options.min_number_of_bars
                barSize = bar_size
                break
            } else if (options.bar_sizes.indexOf(bar_size) !== (options.bar_sizes.length - 1)) {
                if ((num_of_bars >= options.min_number_of_bars) && (num_of_bars <= options.max_number_of_bars)) {
                    noOfBars = num_of_bars
                    barSize = bar_size
                    break
                }
            } else {
                noOfBars = num_of_bars
                barSize = bar_size
                break
            }
            if (noOfBars === 1) noOfBars += 1
        }
    } else {
        barSize = options.bar_sizes[0]
        let areaOfBar = Math.PI * (barSize ** 2) / 4
        noOfBars = Math.ceil(areaOfSteel / areaOfBar)
    }

    if (options.even_number_of_bars && noOfBars % 2 !== 0) noOfBars++
    AsProvided = Math.ceil(((Math.PI) * (barSize ** 2) / 4) * noOfBars)
    return { AsProvided, noOfBars, barSize }
}


export function cleanFloat(number) {
    if (typeof number !== 'number') {
        throw new Error('Input must be a number');
    }
    return number.toFixed(2);
}



