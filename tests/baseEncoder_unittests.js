/**
 * Created by cxa70 on 11/6/2014.
 *
 * Used to generate ids of various base sets
 * ex: base10 is simple integer value.
 *     base16 is hex
 *     base18 is oct
 *     etc
 */
require("./../BaseEncoder/index");
exports.baseEncoderTest = function(test){
    test.expect(12);
    //var basesToTry = [3, 10, 16, 18, 31, 36, 31.5, 62];
    //var valueToConvert = 557424683;
    //var stringToConvert = "bitch";
    //
    //basesToTry.forEach(function(element, index, array){
    //    console.log(valueToConvert + " equals " + valueToConvert.Encode(element) + " in base " + element);
    //});
    //
    //basesToTry.forEach(function(element, index, array){
    //    console.log(stringToConvert + " equals " + stringToConvert.Decode(element) + " from base " + element);
    //});

    var x = 1;
    var encoded = [];
    var vals = [];
    var thing;
    var base = 32;
    while (x < 1000000000000){
        thing = x.Encode(base);
        encoded.push(thing);
        vals.push(x);
        x = thing.Decode(base)*10;
    }

    encoded.forEach(function(element, index, array){
        var val = element.Decode(base);
        var source = vals[index];
        test.equal(source, val, "Pass");
    });

    test.done();
}

