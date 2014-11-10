/**
 * Created by cxa70 on 11/7/2014.
 * Utilize this to convert an integer value into a baseN string.
 * Also can decode a baseN string to an integer value.
 * Currently supports base2 thru base36 using built in conversion.
 * Also has the following additional base conversions:
 *      31.5 --> this is a "safe" version of base 31. Removes characters taht could be used to make "words" which might result in bad words. Designed to be used for client facing values.
 *      62 --> used for generating mixed case values.
 *      64 --> psuedo base64 encoding. NOT the same as a base64 encoded string.
 *      64.5 --> same as 64 except replaces + and / with - and _ so it is safe for use as file system objects.
 */
var BaseChars = {
    31.5:"0123456789BCDFGHJKLMNPQRSTVWXYZ",
    62: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    64: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    64.5: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
};

Number.prototype.Encode = function (base){
    if (BaseChars[base]) {
        var innerBase = ~~(base);
        var x = this % innerBase;
        var y = Math.floor(this / innerBase);
        if (y > 0) {
            return y.Encode(base) + BaseChars[base][x];
        } else {
            return BaseChars[base][x];
        }
    } else {
        return this.toString(base);
    }
};

String.prototype.Decode = function (base){
    if (BaseChars[base]) {
        var dec = 0;
        for (var i = 0; i < this.length; i++) {
            var char = this.substr(this.length - (i + 1), 1);
            var idx = BaseChars[base].indexOf(char);
            dec = dec + (Math.pow(~~(base), i) * idx);
        }
        return dec;
    } else {
        return parseInt(this, base);
    }
};