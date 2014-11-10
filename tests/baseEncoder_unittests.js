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
exports.baseEncoderTest_outOfRange = function(test){
    test.expect(1);
    test.throws(function(){(123).Encode(37);}, RangeError, "What happened.");
    test.done();
};

exports.baseEncoder_decimalToBase3 = function(test){
    test.expect(1);
    test.equals((557424683).Encode(3), "1102211220002220122", "Encoding base 3 failed.");
    test.done();
};

exports.baseEncoder_decimalToBase31_5 = function(test){
    test.expect(1);
    test.equals((557424683).Encode(31.5), "MGL5HD", "Encoding base 31.5 failed.");
    test.done();
};

exports.baseEncoder_decimalToBase62 = function(test){
    test.expect(1);
    test.equals((557424683).Encode(62), "bitch", "Encoding base 62 failed.");
    test.done();
};

exports.baseEncoder_decimalToBase64 = function(test){
    test.expect(1);
    test.equals((557424683).Encode(64), "hOaAr", "Encoding base 64 failed.");
    test.done();
};

exports.baseEncoder_decimalToBase64_5 = function(test){
    test.expect(1);
    test.equals((557424683).Encode(64.5), "hOaAr", "Encoding base 64.5 failed.");
    test.done();
};

exports.baseEncoder_Base3ToDecimal = function(test){
    test.expect(1);
    test.equals("1102211220002220122".Decode(3), 557424683, "Decoding base 3 failed.");
    test.done();
};

exports.baseEncoder_Base31_5ToDecimal = function(test){
    test.expect(1);
    test.equals("MGL5HD".Decode(31.5), 557424683, "Decoding base 31.5 failed.");
    test.done();
};

exports.baseEncoder_Base62ToDecimal = function(test){
    test.expect(1);
    test.equals("bitch".Decode(62), 557424683, "Decoding base 62 failed.");
    test.done();
};

exports.baseEncoder_Base64ToDecimal = function(test){
    test.expect(1);
    test.equals("hOaAr".Decode(64), 557424683, "Decoding base 64 failed.");
    test.done();
};

exports.baseEncoder_Base64_5ToDecimal = function(test){
    test.expect(1);
    test.equals("hOaAr".Decode(64.5), 557424683, "Decoding base 64.5 failed.");
    test.done();
};