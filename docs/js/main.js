function rollDice() {
    arr = []
    for (var i = 0; i < 4; i++) {
        arr.push(3 * Math.floor((Math.random() * 3) - 1));
    }
    return arr;
}

function stringifyDice(dice, total) {
    return `(${dice[0]}) + (${dice[1]}) + (${dice[2]}) + (${dice[3]}) = **${total}**`
}

function getTotal(dice) {
    return dice.reduce((a, b) => a+b);
}

function dice() {
    return getTotal(rollDice());
}
