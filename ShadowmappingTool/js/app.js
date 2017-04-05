var App = (function () {

    //VARIABLES
    var toggleSpotlightTarget = false;
    var lastTmpTarget;

    /** Konstruktor
     */
    function App(target) {
        var _this = this;
        this.currentTarget = null;
        this.targets = [];
        this.spotlights = []; // Zusätzliche Liste für einfacherer Zugriff
        this.currentShadowMapViewer = null;
        this.scene = new THREE.Scene();
        var container = target;
        var toolbar = document.querySelector('#toolbar');

        var width = container.offsetWidth,
            height = width * .52;

        //------------
        // CAMERA
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.lookAt(0, 0, 0);
        this.camera.position.y = 10;
        this.camera.position.z = 10;
        //------------
        // RENDERER

        this.renderer =  new THREE.WebGLRenderer({antialias: true});
        this.renderer.physicallyCorrectLights = true;
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        this.renderer.toneMapping = THREE.ReinhardToneMapping;
        this.renderer.setSize(width, height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.setPixelRatio(width / height);
        //this.renderer.shadowMap.type = THREE.BasicShadowMap;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        //Append to DOM
        container.appendChild(this.renderer.domElement);
        container.classList.add('canvasLoaded');
        // Three JS stats
        this.stats = new Stats();
        this.stats.showPanel(0);// FPS
        toolbar.appendChild(this.stats.dom);
        // Near and Far Pane
        this.nearPaneValue = 1;
        this.farPaneValue = 20;
        // Ambient light
        this.scene.add(new THREE.AmbientLight(0x8ab4ea, .3));
        // Intensity reminder
        this.lastIntensityValue = parseFloat(2);
        //------------
        // CONTROLS
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0);
        this.controls.rotateSpeed = .5;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        this.controls.enableZoom = true;

        // Ground Plane
        var groundGeometry = new THREE.BoxGeometry(36, 36, 36);
        var groundMaterial = new THREE.MeshPhongMaterial(
            {
                color: 0xA1C2E3,
                shininess: 30,
                specular: 0xC8DCF0,
                polygonOffset: true,
                polygonOffsetFactor: 2
            });
        groundMaterial.side= THREE.CullFaceBack;
        var skybox = new THREE.Mesh(groundGeometry, groundMaterial);
        skybox.castShadow = true;
        skybox.receiveShadow = true;
        skybox.position.set(0, 16, 0);
        this.scene.add(skybox);

        var _camera = this.camera;
        var _renderer = this.renderer;

        function onWindowResize() {
            width = container.offsetWidth;
            height = width * .52;
            _camera.aspect = width / height;
            _camera.updateProjectionMatrix();
            _renderer.setSize(width, height);
        }

        window.addEventListener('resize', onWindowResize, false);

        this.init();
        this.update();


    };

    App.prototype.render = function () {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        if(this.currentShadowMapViewer != null) this.currentShadowMapViewer.render(this.renderer);
        this.stats.update();
    };

    App.prototype.update = function () {
        this.render();
        var _this = this;

        //Update Spotlight Indicator Position
        for (var i=0; i< this.targets.length;i++){
            if(this.targets[i].threeobject != null) {
                if(this.targets[i].threeobject.type == "SpotLight"){
                    this.targets[i].setIndicatorLookAt();
                }
            }
        }

        //AutoMove Spotlights
        for (var i=0; i< this.targets.length;i++){
            if(this.targets[i].threeobject != null) {
                if(this.targets[i].threeobject.type == "SpotLight" && this.targets[i].toggleAutoMove == true){
                    this.targets[i].moveLight();
                    this.targets[i].setIndicatorPosition();
                }
            }
        }

        //Rotate Basic Object
        for (var i=0; i< this.targets.length;i++){
            if(this.targets[i].threeobject != null) {
                if(this.targets[i].toggleRotationX == true){
                    this.targets[i].rotateX();
                }
                if(this.targets[i].toggleRotationY == true){
                    this.targets[i].rotateY();
                }
                if(this.targets[i].toggleRotationZ == true){
                    this.targets[i].rotateZ();
                }
            }
        }

        //updates SpotlightHelper
        for (var i=0; i<= this.targets.length-1;i++){
            if(this.targets[i].threeobject != null && this.targets[i].threeobject.type == "SpotLight"){
                this.targets[i].spotLightHelper.update();
            }
        }

        this.updateIntervalID = window.requestAnimationFrame(function() {return _this.update(); });
    };

    App.prototype.addObject = function (obj) {
        obj.addToScene(this.scene);
        this.targets.push(obj);
        if(obj.threeobject != null) {
            if(obj.threeobject.type == "SpotLight") {
                this.spotlights.push(obj);
            }
        }

        this.currentTarget = obj;

    };

    App.prototype.removeObject = function( obj ) {
        obj.removeFromScene(this.scene);
        this.targets.splice( this.targets.indexOf(obj),1 );
        if(obj.threeobject != null) {
            if(obj.threeobject.type == "Spotlight") {
                this.spotlights.splice( this.spotlights.indexOf(obj),1 );
            }
            if(this.currentShadowMapViewer == this.currentTarget.shadowViewer) {
                this.currentShadowMapViewer = null;
            }
        }
    }

    /**Initialisierung*/
    App.prototype.init = function () {
        /*var spot = spotLight();
        _this.addObject(spot);
        _this.addObject(spotlightIndicator());
        _this.addObject(shadowCameraHelper(spot));
        _this.addObject(spotLightHelper(spot));
        _this.addObject(basicShape("Box"));*/
        //_this.addObject(customShape('obj/monster.js'));
    };

    App.prototype.changeTarget = function (checkboxCurrent) {

        var newtarget = this.currentTarget.threeobject;
        var tmpindex = -1;
        var tmptarget = new THREE.Object3D();
        tmptarget.name = tmptarget;
        tmptarget.position.copy(this.currentTarget.threeobject.position);

        for (var i = 0; i < this.targets.length; i++) {
            if (this.targets[i].threeobject.type == "SpotLight") {
                tmpindex = i;
            }
        }

        if(tmpindex < 0) {
            return;
        }

        if (this.targets[tmpindex].threeobject.target == this.currentTarget.threeobject) {
            toggleSpotlightTarget = true;
        }
        else {
            toggleSpotlightTarget = false;
        }


        var toggleCheckboxes = document.querySelectorAll('[id^="target"]');
        toggleCheckboxes.forEach(function(checkbox) {
            if(checkbox != checkboxCurrent) {
                checkbox.checked = false;
            }
        });

        if (toggleSpotlightTarget == false) {
            for (var i = 0; i < this.targets.length; i++) {
                if (this.targets[i].threeobject.type == "SpotLight") {
                    if(lastTmpTarget != "undefined") {
                        this.scene.remove(lastTmpTarget);
                    }
                    this.targets[i].threeobject.target = newtarget;
                }
            }
        }
        else {
            for (var i = 0; i < this.targets.length; i++) {
                if (this.targets[i].threeobject.type == "SpotLight") {
                    if(lastTmpTarget != "undefined") {
                        this.scene.remove(lastTmpTarget);
                    }
                    this.targets[i].threeobject.target = tmptarget;
                    this.scene.add(this.targets[i].threeobject.target);
                }
            }
        }
        lastTmpTarget = tmptarget;
    };

    App.prototype.toggleShadowMap = function (active) {
        if( active.checked ) this.currentShadowMapViewer = this.currentTarget.shadowViewer;
        else this.currentShadowMapViewer = null;

        var toggleCheckboxes = document.querySelectorAll('[id^="toggleShadowViewer"]');
        toggleCheckboxes.forEach(function(checkbox) {
            if(checkbox != active) {
                checkbox.checked = false;
            }
        });

    }

    App.prototype.toggleAllLights = function () {
        for (var i = 0; i < this.targets.length; i++) {
            if(this.targets[i].threeobject != null) {
                if (this.targets[i].threeobject.type == "SpotLight") {
                    this.targets[i].toggleLight();
                }
            }
        }
        var toggleCheckboxes = document.querySelectorAll('[id^="toggleLight"]');
        toggleCheckboxes.forEach(function(checkbox) {
            checkbox.checked = !checkbox.checked;
        });
    }

    App.prototype.toggleAllHelpers = function () {
        for (var i = 0; i < this.targets.length; i++) {
            if(this.targets[i].threeobject != null) {
                if (this.targets[i].threeobject.type == "SpotLight") {
                    this.targets[i].toggleHelpers();
                }
            }
        }
        var toggleCheckboxes = document.querySelectorAll('[id^="toggleHelpers"]');
        toggleCheckboxes.forEach(function(checkbox) {
            checkbox.checked = !checkbox.checked;
        });
    }
        return App;
}());
//# sourceMappingURL=app.js.map