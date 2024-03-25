// similar to popular library jedwatson/classnames

// record - special type of typescript where KEY is string and VALUE is string OR Boolean
export function classNames(cls, mods, additional) {
    return [
        cls,
        ...additional.filter(Boolean),
        ...Object.entries(mods)
            .filter(([_, value]) => Boolean(value)) // the first value in each array (represented by the underscore) is ignored and the filter only uses the second value (value).
            .map(([cls]) => cls)
    ].join(" ")
}
