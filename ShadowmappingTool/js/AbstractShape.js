/**
 * Created by Danny on 24.02.2017.
 */
AbstractShape = function () {
    throw "abstract class!"
};
AbstractShape.prototype.threeobject = null;
/**
 * Fügt das Objekt einer Szene hinzu (ggf. auch mehrere Objekte)
 * @param scene three-JS Szene
 */
AbstractShape.prototype.addToScene = function (scene) {
    scene.add(this.threeobject);
};
/**
 * Entfernt das Objekt aus der gegebeben Szene (ggf. auch mehrere Objekte)
 * @param scene three-JS Szene
 */
AbstractShape.prototype.removeFromScene = function (scene) {
    scene.remove(this.threeobject);
};
/**
 * Liefert die dem Objekt zugehörige Schablone für Einstellungen
 * @returns {null}
 */
AbstractShape.prototype.getTabElement = function () {
    return (null);
};

AbstractShape.prototype.setXPos = function (x) {
    if(this.threeobject != null) {
        this.threeobject.position.setX( parseFloat(x));
    }
};

AbstractShape.prototype.setYPos = function (y) {
    if(this.threeobject != null) {
        this.threeobject.position.setY( parseFloat(y));
    }
};

AbstractShape.prototype.setZPos = function (z) {
    if(this.threeobject != null) {
        this.threeobject.position.setZ( parseFloat(z));
    }
};

AbstractShape.prototype.setXRotation = function (xr) {
    if(this.threeobject != null) {
        this.threeobject.rotation.x = THREE.Math.degToRad(parseInt(xr));
    }
};

AbstractShape.prototype.setYRotation = function (yr) {
    if(this.threeobject != null) {
        this.threeobject.rotation.y = THREE.Math.degToRad(parseInt(yr));
    }
};

AbstractShape.prototype.setZRotation = function (zr) {
    if(this.threeobject != null) {
        this.threeobject.rotation.z = THREE.Math.degToRad(parseInt(zr));
    }
};

