var THREE = require('three');
var CTRL = require('./three.orbitcontrols');
var proj4 = require('proj4');

var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight,
    VIEW_ANGLE = 45,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 10000,
    container = document.getElementById('map'),
    renderer,
    light,
    camera,
    scene;

function init() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(WIDTH, HEIGHT);

  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE,ASPECT,NEAR,FAR);
  camera.position.z = 120;
  camera.position.x = 100;
  camera.position.y = -100;
  scene.add(camera);

  light = new THREE.PointLight(0xFFFFFF);
  light.position.x = 120;
  light.position.y = -100;
  light.position.z = 120;
  scene.add(light);
  
  controls = new THREE.OrbitControls(camera);
  controls.damping = 0.2;
  controls.addEventListener('change', render);
  
  container.appendChild(renderer.domElement);
}

function addData(data) {
  data.features.forEach(function(feature) {
    
    var shapeCoords = [];
    
    feature.geometry.coordinates[0].forEach(function(coord) {
      var vector = coordToVector(coord);
      shapeCoords.push(vector);
    });

    var ex = shapeCoords[0];
    
    if(shapeCoords.length > 3) {
      var shape = new THREE.Shape(shapeCoords);
      var extrusionSettings = {amount: 10, bevelEnabled: false};
      var geometry = new THREE.ExtrudeGeometry(shape, extrusionSettings);
      var material = new THREE.MeshPhongMaterial({color: 0xcccccc});  
      var mesh = new THREE.Mesh(geometry,material );
      scene.add(mesh);
    }
  });
}

function coordToVector(coord) {
  var lng = coord[1];
  var lat = coord[0];

  // get x value
  var x = (lng+180)*(WIDTH/360)

  // convert from degrees to radians
  var latRad = lat * Math.PI/180;

  // get y value
  var mercN = Math.log(Math.tan((Math.PI/4)+(latRad/2)));
  var y = (HEIGHT/2)-(WIDTH*mercN/(2*Math.PI));
  x = x - WIDTH/2
  y = y - HEIGHT/2
  return new THREE.Vector3(x,y,0);
}

function render() {
  console.log('render');
  renderer.render(scene, camera);
}

module.exports = {
  init : init,
  addData : addData,
  render : render
}