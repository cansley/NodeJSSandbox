/**
 * Created by cxa70 on 10/21/2014.
 */
var Currency = function(canadianDollar){
    this.canadianDollar = canadianDollar;
}

Currency.prototype.roundTwoDecimals = function(amount){
    return Math.round(amount * 100) / 100;
}

Currency.prototype.CanadianToUS = function(canadian){
    return this.roundTwoDecimals(canadian * this.canadianDollar);
}

Currency.prototype.USToCanadian = function(us){
    return this.roundTwoDecimals(us / this.canadianDollar);
}
// exports is global reference to moduel.exports and cannot be overwritten without breaking stuff.
// to add things to exports, use exports.thing = something.
// to assign an object to exports, use module.exports = thing
// or if you really need to: module.exports = exports = thing
module.exports = Currency;