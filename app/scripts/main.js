var Scene = require('./scene');
var GeoData = require('json!./countries.geo.json');

Scene.init();
Scene.addData(GeoData);
Scene.render();