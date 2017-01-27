// From http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4();
    }

function parseAlpha(a) {
    return parseInt('0' + a, 10);
}

function parseColorValue(v) {
    if(v.indexOf('%') != -1)
        return Math.floor(parseFloat(v) * 2.55);
    else
        return parseInt(v, 10);
}

// From http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    function hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b, a) {
            a = a || '';
            return r + r + g + g + b + b + a + a;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
            a: parseAlpha(parseInt(result[4], 16) || 1)
        } : null;
    }

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b, a) {
        a = a || 1;
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b) + componentToHex(a);
    }

// From http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
    function hslToRgb(h, s, l){
        var r, g, b;

        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            var hue2rgb = function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

// From http://stackoverflow.com/questions/32673760/how-can-i-know-if-a-given-string-is-hex-rgb-rgba-or-hsl-color-using-javascipt
    function isHexColor(value) {
        return /^#?(?:[A-Fa-f0-9]{3}){1,2}$/i.test(value)
    }

    function isRgbColor(value) {
        return /^rgb[(](?:\s*0*(?:\d\d?(?:\.\d+)?(?:\s*%)?|\.\d+\s*%|100(?:\.0*)?\s*%|(?:1\d\d|2[0-4]\d|25[0-5])(?:\.\d+)?)\s*(?:,(?![)])|(?=[)]))){3}[)]$/i.test(value)
    }

    function isRgbaColor(value) {
        return /^rgba[(](?:\s*0*(?:\d\d?(?:\.\d+)?(?:\s*%)?|\.\d+\s*%|100(?:\.0*)?\s*%|(?:1\d\d|2[0-4]\d|25[0-5])(?:\.\d+)?)\s*,){3}\s*0*(?:\.\d+|1(?:\.0*)?)\s*[)]$/i.test(value)
    }

    function isHslColor(value) {
        return /^hsl[(]\s*0*(?:[12]?\d{1,2}|3(?:[0-5]\d|60))\s*(?:\s*,\s*0*(?:\d\d?(?:\.\d+)?\s*%|\.\d+\s*%|100(?:\.0*)?\s*%)){2}\s*[)]$/i.test(value)
    }

    function isHslaColor(value) {
        return /^hsla[(]\s*0*(?:[12]?\d{1,2}|3(?:[0-5]\d|60))\s*(?:\s*,\s*0*(?:\d\d?(?:\.\d+)?\s*%|\.\d+\s*%|100(?:\.0*)?\s*%)){2}\s*,\s*0*(?:\.\d+|1(?:\.0*)?)\s*[)]$/i.test(value)
    }

    function stringColorToRgb(value) {
        var colorValues = /^(rgb|hsl)(a?)[(]\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*(?:,\s*([\d.]+)\s*)?[)]$/i.exec(value);

        var r = parseColorValue(colorValues[3]);
        var g = parseColorValue(colorValues[4]);
        var b = parseColorValue(colorValues[5]);
        var a = undefined;

        if(colorValues[2] == 'a')
            a = colorValues[6];

        if(colorValues[1] == 'rgb') {
            r = r;
            g = g;
            b = b;
        }

        if(colorValues[1] == 'hsl') {
            var rgb = hslToRgb(r, g, b);
            r = rgb[0];
            g = rgb[1];
            b = rgb[2];
        }

        if(a === undefined)
            a = 1;

        return {
            r: r,
            g: g,
            b: b,
            a: parseAlpha(a),
        }
    }

function parseColor(value) {
    if(isRgbColor(value) || isRgbaColor(value) || isHslColor(value) || isHslaColor(value))
        return stringColorToRgb(value);

    if(isHexColor(value))
        return hexToRgb(value);

    return false;
}

console.log('#0F0F0F', parseColor('#0F0F0F'));
console.log('#123', parseColor('#123'));
console.log('#1234', parseColor('#1234'));
console.log('#ABC456', parseColor('#ABC456'));
console.log('#1234567', parseColor('#1234567'));
console.log('rgb(1,2,3)', parseColor('rgb(1,2,3)'));
console.log('rgb(1,2,)', parseColor('rgb(1,2,)'));
console.log('rgb(112233)', parseColor('rgb(112233)'));
console.log('rgb(255,249,199)', parseColor('rgb(255,249,199)'));
console.log('rgb(256,249,199)', parseColor('rgb(256,249,199)'));
console.log('rgb(255,249,199,)', parseColor('rgb(255,249,199,)'));
console.log('rgb( 100%, 199, 50%)', parseColor('rgb( 100%, 199, 50%)'));
console.log('rgb( 100%, 199%, 50%)', parseColor('rgb( 100%, 199%, 50%)'));
console.log('rgb(1,2,3%,.5)', parseColor('rgb(1,2,3%,.5)'));
console.log('rgba(1,2,3%,0.75)', parseColor('rgba(1,2,3%,0.75)'));
console.log('rgba(1,2,3%,.5)', parseColor('rgba(1,2,3%,.5)'));
console.log('rgba(1,2,.5)', parseColor('rgba(1,2,.5)'));
console.log('rgba(1,2,3)', parseColor('rgba(1,2,3)'));
console.log('rgba(1,249,100,1)', parseColor('rgba(1,249,100,1)'));
console.log('rgba(1,249,100,1.0)', parseColor('rgba(1,249,100,1.0)'));
console.log('rgba(1,249,100,1.1)', parseColor('rgba(1,249,100,1.1)'));
console.log('rgba(255,256,255,1)', parseColor('rgba(255,256,255,1)'));
console.log('rgba(1,249.5,100%,1)', parseColor('rgba(1,249.5,100%,1)'));
console.log('rgba(1,249.5,101%,1)', parseColor('rgba(1,249.5,101%,1)'));
console.log('hsl(360,2%,100%)', parseColor('hsl(360,2%,100%)'));
console.log('hsl(361,2%,100%)', parseColor('hsl(361,2%,100%)'));
console.log('hsl(,2%,100%)', parseColor('hsl(,2%,100%)'));
console.log('hsl(360,2%,)', parseColor('hsl(360,2%,)'));
console.log('hsl(360,2%,0100.00%)', parseColor('hsl(360,2%,0100.00%)'));
console.log('hsl(360,2%,101%)', parseColor('hsl(360,2%,101%)'));
console.log('hsla(180,2%,100%,0.5)', parseColor('hsla(180,2%,100%,0.5)'));
console.log('hsla(180,2%,100%,)', parseColor('hsla(180,2%,100%,)'));
