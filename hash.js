const fs = require('fs')
const crypto = require('crypto')
const shajs = require('sha.js')

// rules:
// - lowercase
// - uppercase
// - digits
// - symbols


const characterSubsets = {
    lowercase: "abcdefghijklmnopqrstuvwxyz", // 26
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", // 26
    digits: "0123456789", // 10
    symbols: "Ł↑Ŧ§Ω©!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ø€¶ŧ←↓→ĸħđð¢»łß" // 31
};

const hash = (data, characterRules, limitedLength = 20) => {
    let compiled = JSON.stringify(data)
    let shaSum = shajs('sha256')
        .update(compiled)
        .digest('hex')
        .split('')

    let shaSumComponents = []
    let shaSumValue = null
    shaSum.forEach(char => {
        if (shaSumValue === null) {
            shaSumValue = parseInt(char, 16)
        } else {
            shaSumComponents.push(shaSumValue * parseInt(char, 16) + 5)
            shaSumValue = null
        }
    })

    let characterSet = Object.keys(characterSubsets)
        .filter(subset => characterRules.indexOf(subset) !== -1)
        .map(subset => characterSubsets[subset]).join('').split('')
    return [...shaSumComponents]
        .map(part => characterSet[part % characterSet.length])
        .join('')
        .substring(0, limitedLength)
}

console.log(hash(["twitter.com", "lefuturiste", "inPassword", Math.random()], ['symbols']))

// let writeStream = fs.createWriteStream('rand.txt');

// writeStream.on('finish', () => {
//     console.log('wrote all data to file');
// });

// for (var i = 0; i < 1000; i++) {
//     let data = hash(
//         [Math.random(), Math.random(), Math.random(),  Math.random(),  Math.random()],
//         ["lowercase", "uppercase", "digits", "symbols"])
//     writeStream.write(
//         data,
//         'base64'
//     );
// }

// writeStream.end()
