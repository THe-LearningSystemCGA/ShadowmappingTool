/**
 * Created by Danny on 02.02.2017.
 */

/**
 * @param path Pfad zum Objekt
 * @param scene Scenenreferenz für späteres hinzufügen
 * @constructor
 */
var CustomShape = function (path,scene) {
    var _this = this;
    var loader = new THREE.ObjectLoader();
    loader.load(path,function ( obj ) {
        console.log("loaded");
        _this.threeobject = obj;
        _this.addToScene( scene );
    });

    this.toggleRotationX = false;
    this.toggleRotationY = false;
    this.toggleRotationZ = false;
    this.tmpRotaX = 0;
    this.tmpRotaY = 0;
    this.tmpRotaZ = 0;

}

CustomShape.prototype = Object.create(AbstractShape.prototype);
CustomShape.prototype.constructor = CustomShape;
/**
 * @override
 * @param scene
 */
CustomShape.prototype.addToScene = function(scene) {
    if( this.threeobject == null )
    {
        console.log("Object isn't loaded yet");
    }
    else scene.add( this.threeobject );
}
/**
 * @override
 * @returns {*|jQuery|HTMLElement}
 */
CustomShape.prototype.getTabElement = function () {
    return ($('#Custom_template'));
};
/**
 * Objekt auf der X Achse skalieren
 * @param xs neue Skalierung
 */
CustomShape.prototype.setXScale = function (xs) {
    this.threeobject.scale.setX(parseFloat(xs));
};
/**
 * Objekt auf der Y Achse skalieren
 * @param ys neue Skalierung
 */
CustomShape.prototype.setYScale = function (ys) {
    this.threeobject.scale.setY(parseFloat(ys));
};
/**
 * Objekt auf der Z Achse skalieren
 * @param zs neue Skalierung
 */
CustomShape.prototype.setZScale = function (zs) {
    this.threeobject.scale.setZ(parseFloat(zs));
};

CustomShape.prototype.toggleXRotation = function () {
    this.toggleRotationX = !this.toggleRotationX;
};
CustomShape.prototype.toggleYRotation = function () {
    this.toggleRotationY = !this.toggleRotationY;
};
CustomShape.prototype.toggleZRotation = function () {
    this.toggleRotationZ = !this.toggleRotationZ;
};
CustomShape.prototype.rotateX = function () {
    this.tmpRotaX = this.tmpRotaX + 1;
    this.threeobject.rotation.x = THREE.Math.degToRad(this.tmpRotaX);
    if(this.tmpRotaX == 360) { this.tmpRotaX = 0; }
};
CustomShape.prototype.rotateY = function () {
    this.tmpRotaY = this.tmpRotaY + 1;
    this.threeobject.rotation.y = THREE.Math.degToRad(this.tmpRotaY);
    if(this.tmpRotaY == 360) { this.tmpRotaY = 0; }
};
CustomShape.prototype.rotateZ = function () {
    this.tmpRotaZ = this.tmpRotaZ + 1;
    this.threeobject.rotation.z = THREE.Math.degToRad(this.tmpRotaZ);
    if(this.tmpRotaZ == 360) { this.tmpRotaZ = 0; }
};
