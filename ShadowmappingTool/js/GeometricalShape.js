/**
 * Created by Danny on 02.02.2017.
 */

/**
 * @param type String der den Typ des Objekts definiert
 * @constructor
 */
var GeometricalShape = function(type) {
    // Main Object
    var basicObjectHeight = 2.5;
    var basicObjectBoxGeometry;
    switch (type) {
        case "Box":
            basicObjectBoxGeometry = new THREE.BoxGeometry(2.5, basicObjectHeight, 2.5);
            break;
        case "Sphere":
            basicObjectBoxGeometry = new THREE.SphereGeometry(basicObjectHeight / 2, 16, 16);
            break;
        case "Triangle":
            basicObjectBoxGeometry = new THREE.ConeGeometry(2.5, basicObjectHeight, 4);
            break;
        default:
            throw("Unkown geometriacal shape type: " + type);
    }
    //basicObjectBoxGeometry.translate( 0.5,0.5,0.5 );
    var basicObjectMaterial = new THREE.MeshPhongMaterial(
        {
            color: 0xFF5900,
            polygonOffset:false,
            polygonOffsetFactor:1,
            polygonOffsetUnits: 20.0,
            shininess: 30,
            specular: 0xFF0000,
        });

    this.threeobject = new THREE.Mesh(basicObjectBoxGeometry, basicObjectMaterial);
    this.threeobject.castShadow = true;
    this.threeobject.receiveShadow = true;


    this.toggleRotationX = false;
    this.toggleRotationY = false;
    this.toggleRotationZ = false;
    this.tmpRotaX = 0;
    this.tmpRotaY = 0;
    this.tmpRotaZ = 0;


};

GeometricalShape.prototype = Object.create(AbstractShape.prototype);
GeometricalShape.prototype.constructor = GeometricalShape;
/**
 * @override
 * @returns {*|jQuery|HTMLElement}
 */
GeometricalShape.prototype.getTabElement = function () {
    return ($('#Basic_template'));
};
/**
 * Objekt auf der X Achse skalieren
 * @param xs neue Skalierung
 */
GeometricalShape.prototype.setXScale = function (xs) {
    this.threeobject.scale.setX(parseFloat(xs));
};
/**
 * Objekt auf der Y Achse skalieren
 * @param ys neue Skalierung
 */
GeometricalShape.prototype.setYScale = function (ys) {
    this.threeobject.scale.setY(parseFloat(ys));
};
/**
 * Objekt auf der Z Achse skalieren
 * @param zs neue Skalierung
 */
GeometricalShape.prototype.setZScale = function (zs) {
    this.threeobject.scale.setZ(parseFloat(zs));
};
GeometricalShape.prototype.setPolygonOffSet = function () {
    this.threeobject.material.polygonOffset = !this.threeobject.material.polygonOffset;
    //console.log(this.threeobject.material.polygonOffset);
};
GeometricalShape.prototype.setUnits = function (u) {
    //console.log("old val:");
    //console.log( this.threeobject.material.polygonOffsetUnits);
    this.threeobject.material.polygonOffsetUnits = parseFloat(u);
    //console.log("new val:");
    //console.log( this.threeobject.material.polygonOffsetUnits);
};
GeometricalShape.prototype.setFactor = function(f) {
    //console.log("old val:");
    //console.log(  this.threeobject.material.polygonOffsetFactor);
    this.threeobject.material.polygonOffsetFactor = parseFloat(f);
    //console.log("new val:");
    //console.log(  this.threeobject.material.polygonOffsetFactor);
};
GeometricalShape.prototype.changeWireFrame= function(){
  if(this.threeobject.material.wireframe){
      this.threeobject.material.wireframe=false;
  }
  else{
      this.threeobject.material.wireframe=true;
  }
};
GeometricalShape.prototype.toggleXRotation = function () {
    this.toggleRotationX = !this.toggleRotationX;
};
GeometricalShape.prototype.toggleYRotation = function () {
    this.toggleRotationY = !this.toggleRotationY;
};
GeometricalShape.prototype.toggleZRotation = function () {
    this.toggleRotationZ = !this.toggleRotationZ;
};
GeometricalShape.prototype.rotateX = function () {
    this.tmpRotaX = this.tmpRotaX + 1;
    this.threeobject.rotation.x = THREE.Math.degToRad(this.tmpRotaX);
    if(this.tmpRotaX == 360) { this.tmpRotaX = 0; }
};
GeometricalShape.prototype.rotateY = function () {
    this.tmpRotaY = this.tmpRotaY + 1;
    this.threeobject.rotation.y = THREE.Math.degToRad(this.tmpRotaY);
    if(this.tmpRotaY == 360) { this.tmpRotaY = 0; }
};
GeometricalShape.prototype.rotateZ = function () {
    this.tmpRotaZ = this.tmpRotaZ + 1;
    this.threeobject.rotation.z = THREE.Math.degToRad(this.tmpRotaZ);
    if(this.tmpRotaZ == 360) { this.tmpRotaZ = 0; }
};
GeometricalShape.prototype.setColHex = function (hex) {
    hex = hex.replace("#","0x"); // Hash-Code in Hex-Code umwandeln
    this.threeobject.material.color.setHex(hex);
};
GeometricalShape.prototype.setSpecHex = function (hex) {
    hex = hex.replace("#","0x"); // Hash-Code in Hex-Code umwandeln
    this.threeobject.material.specular.setHex(hex);
};
