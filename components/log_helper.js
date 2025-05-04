const colors = require('./colors'); // Import the colors module
module.exports = {
    // paint single string to color
    paint: function (text, color) {
        if (!colors[color]) {
            throw new Error(`Color "${color}" is not defined in colors module`);
        }
        return (colors[color] + text + colors.reset);
    },

    // paint array to color
    // {{text: color}
    // {text: color}...}
    paintArray: function (textArray) {
        let result = '';
        for (let i = 0; i < textArray.length; i++) {
            const text = textArray[i].text;
            const color = textArray[i].color;
            result += this.paint(text, color) + ' ';
        }
        return result.trim();
    }
};