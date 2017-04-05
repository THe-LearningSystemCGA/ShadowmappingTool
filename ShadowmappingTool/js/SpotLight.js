/**
 * Created by Danny on 02.02.2017.
 */

/**
 * @constructor
 */
var SpotLight = function () {
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.intensity = 3;
    spotLight.penumbra = .2;
    spotLight.angle = THREE.Math.degToRad(60);
    spotLight.position.set(5, 5, -5);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 20;
    spotLight.shadow.camera.fov = 60;
    spotLight.shadow.bias = 0.000;
    //Variablen für moveLight
    spotLight.points = 144;
    spotLight.cAngle = 0;
    spotLight.cRadius = 0;
    this.threeobject = spotLight;
    this.toggleAutoMove = false;

    // Spotlight Helper
    this.spotLightHelper = new THREE.SpotLightHelper(this.threeobject);
    this.spotLightHelper.name = "spotLightHelper";
    this.spotLightHelper.visible = false;

    this.cameraHelper = new THREE.CameraHelper(this.threeobject.shadow.camera);
    this.cameraHelper.name = "cameraHelper";
    this.cameraHelper.visible = false;
    this.cameraHelper.update();
    this.spotLightHelper.update();

    // Spotlight Indicator Cone
    var radius = Math.atan(60)*.4;
    var spotlightConeGeometry = new THREE.ConeGeometry( radius, .4, 32 );
    spotlightConeGeometry.translate(0,-0.2,0);
    spotlightConeGeometry.rotateX( Math.PI / -2 );
    var spotlightConeMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} );
    this.spotlightIndicator = new THREE.Mesh( spotlightConeGeometry, spotlightConeMaterial );
    this.spotlightIndicator.position.copy(spotLight.position);
    this.spotlightIndicator.lookAt(spotLight.target.position);

    // Spotlight Shadowmap-Viewer
    this.shadowViewer = new THREE.ShadowMapViewer(this.threeobject);
    //this.shadowViewer.enabled = false;
    this.shadowViewer.size.set(300, 200);
};

SpotLight.prototype = Object.create(AbstractShape.prototype);
SpotLight.prototype.constructor = SpotLight;
/**
 * @override
 * @param scene
 */
SpotLight.prototype.addToScene = function (scene) {
    scene.add(this.threeobject);
    scene.add(this.spotlightIndicator);
    scene.add(this.spotLightHelper);
    scene.add(this.cameraHelper);
    scene.add(this.shadowViewer);
};
/**
 * @override
 * @param scene
 */
SpotLight.prototype.removeFromScene = function (scene) {
    scene.remove(this.threeobject);
    scene.remove(this.spotlightIndicator);
    scene.remove(this.spotLightHelper);
    scene.remove(this.cameraHelper);
    scene.remove(this.shadowViewer);
};
/**
 * @override
 * @returns {*|jQuery|HTMLElement}
 */
SpotLight.prototype.getTabElement = function () {
    return ($('#Spotlight_template'));
};
/**
 * Intensität einstellen
 * @param i neuer Intensitätswert
 */
SpotLight.prototype.setIntensity = function(i) {
    this.threeobject.intensity = parseFloat(i);
};
/**
 * Distanz einstellen
 * @param d neuer Dinstanzwert
 */
SpotLight.prototype.setDistance = function(d) {
    this.threeobject.distance = parseFloat(d);
};
/**
 * Kamerawinkel einstellen
 * @param a neur Winkel
 */
SpotLight.prototype.setAngle = function (a) {
    this.threeobject.angle = THREE.Math.degToRad(parseInt(a));
    this.threeobject.shadow.camera.fov = parseInt(a);
    this.cameraHelper.update();
};
/**
 * Penumbra einstellen
 * @param p neuer Wert für Penumbra
 */
SpotLight.prototype.setPenumbra = function (p) {
    this.threeobject.penumbra = parseFloat(p);
};
/**
 * Bias einstellen
 * @param b neuer Bias Wert
 */
SpotLight.prototype.setBias = function (b) {
    this.threeobject.shadow.bias = parseFloat(b);
};
/**
 * Near Pane einstellen
 * @param n neue Distanz
 */
SpotLight.prototype.setNear = function (n) {
    this.nearPaneValue = parseFloat(n);
    this.updatePanes();
};
/**
 * Far Pane einstellen
 * @param f neue Distanz
 */
SpotLight.prototype.setFar = function (f) {
    this.farPaneValue = parseFloat(f);
    this.updatePanes();
};
/**
 * Interne Updatefunktion
 */
SpotLight.prototype.updatePanes = function() {
    this.threeobject.shadow.camera.near = this.nearPaneValue;
    this.threeobject.shadow.camera.far = this.farPaneValue;
    this.cameraHelper.update();
};
/**
 * Faktor des Polygon offset einstellen
 * @param f neuer Offset
 */
SpotLight.prototype.setFactor = function(f) {
    this.threeobject.material.polygonOffsetFactor = parseFloat(f);
};
/**
 * Units des Polygon Offset einstellen
 * @param u neuer Unit Wert
 */
SpotLight.prototype.setUnits = function (u) {
    this.threeobject.material.polygonOffsetUnits = parseFloat(u);
};
/**
 * Spotlight Helper umschalten
 */
SpotLight.prototype.toggleHelpers = function() {
    this.spotLightHelper.visible = !this.spotLightHelper.visible;
    this.cameraHelper.visible = !this.cameraHelper.visible;
};
/**
 * Spotlight Ein- oder Ausschalten, beim Einschalten wird der letzte Intensitätswert wieder angenommen
 */
SpotLight.prototype.toggleLight = function () {
    if( this.threeobject.intensity > 0 )
    {
        this.lastIntensityValue = this.threeobject.intensity;
        this.threeobject.intensity = parseFloat(0);
    }
    else this.threeobject.intensity =  this.lastIntensityValue;
};
/**
 * Auflösung der Shadowmap einstellen
 * @param size neue Höhe und Breite der Shadowmap
 */
SpotLight.prototype.setShadowMapSize = function(size) {
  var mapSize = parseInt(size);
  this.threeobject.shadow.mapSize.width = mapSize;
  this.threeobject.shadow.mapSize.height = mapSize;
};

SpotLight.prototype.setColHex = function (hex) {
    hex = hex.replace("#","0x"); // Hash-Code in Hex-Code umwandeln
    this.threeobject.color.setHex(hex);
    this.spotLightHelper.cone.material.color.setHex(hex);
    this.spotlightIndicator.material.color.setHex(hex);
};

SpotLight.prototype.setColR = function (x) {
    this.threeobject.color.r = x;
    this.spotLightHelper.cone.material.color.r=x;
};

SpotLight.prototype.setColG = function (x) {
    this.threeobject.color.g = x;
    this.spotLightHelper.cone.material.color.g=x;
};
SpotLight.prototype.setColB = function (x) {
    this.threeobject.color.b = x;
    this.spotLightHelper.cone.material.color.b=x;
};
SpotLight.prototype.setIndicatorPosX = function (x) {
    this.spotlightIndicator.position.x = parseFloat(x);
    this.setIndicatorLookAt();
};
SpotLight.prototype.setIndicatorPosY = function (x) {
    this.spotlightIndicator.position.y = parseFloat(x);
    this.setIndicatorLookAt();
};
SpotLight.prototype.setIndicatorPosZ = function (x) {
    this.spotlightIndicator.position.z = parseFloat(x);
    this.setIndicatorLookAt();
};
SpotLight.prototype.setIndicatorLookAt = function () {
    this.spotlightIndicator.lookAt(this.threeobject.target.position);
};
SpotLight.prototype.setIndicatorPosition = function () {
    this.spotlightIndicator.position.x = this.threeobject.position.x;
    this.spotlightIndicator.position.y = this.threeobject.position.y;
    this.spotlightIndicator.position.z = this.threeobject.position.z;
};
//Set AutoMove true or false
SpotLight.prototype.setAutoMove = function () {
    this.toggleAutoMove = !this.toggleAutoMove;
};
//Automatische Kreisbewegung des Spotlights
SpotLight.prototype.moveLight = function () {
    this.threeobject.cRadius = ( Math.sqrt(Math.pow(this.threeobject.position.x, 2) + Math.pow(this.threeobject.position.z, 2)));
    this.threeobject.position.setX(Math.cos(this.threeobject.cAngle) * this.threeobject.cRadius);
    this.threeobject.position.setZ(Math.sin(this.threeobject.cAngle) * this.threeobject.cRadius);

    if (this.cAngle >= Math.PI * 2) this.threeobject.cAngle = 0;
    this.threeobject.cAngle += (Math.PI / this.threeobject.points);
};
SpotLight.prototype.xTarget = function(x){
    this.threeobject.target.position.setX(parseFloat(x));
    this.threeobject.parent.add(this.threeobject.target);
};
SpotLight.prototype.yTarget = function (y){
    this.threeobject.target.position.setY(parseFloat(y));
    this.threeobject.parent.add(this.threeobject.target);
};
SpotLight.prototype.zTarget = function (z){
    this.threeobject.target.position.setZ(parseFloat(z));
    this.threeobject.parent.add(this.threeobject.target);
};