var OSC = require("./mfn_modules/oscjs");

var client = new OSC();
client.listen();
client.on('/osc_data', function(e) {
  console.log(e);
});
client.send('/osc_data',
          'sfiTFNI',
          ['hello', Math.random(),0, true, false, null, undefined]);