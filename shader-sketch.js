const $ = require('jquery')
const THREE = require('three')
const dat = require('dat.gui')
const loop = require('raf-loop')
const WindowResize = require('three-window-resize')


class ShaderSketch {

    constructor() {
        this.gui = new dat.GUI()
        // this.params = gui.addFolder('parameters');
        // gui.show()

        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        var windowResize = new WindowResize(this.renderer, this.camera)

        var comp_width = window.innerWidth
        var comp_height = window.innerHeight

        /* this will be used to switch render targets every frame
         * because webgl complains if a buffer is simultaneously used
         * for reading and writing data
         */
        var currentTarget = 0;

        /* create two renderTargets with the size of the world */
        var comp_target0 = new THREE.WebGLRenderTarget(comp_width,
            comp_height, {
            magFilter: THREE.NearestFilter,
            minFilter: THREE.NearestFilter,
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping
        });

        var comp_target1 = new THREE.WebGLRenderTarget(comp_width, comp_height, {
            magFilter: THREE.NearestFilter,
            minFilter: THREE.NearestFilter,
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping
        });
        /* create a scene with single quad mesh */
        var comp_scene = new THREE.Scene();
        var comp_camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
        comp_camera.position.set(0, 0, 5);

        /* material which uses the Shader code to Compute
         * rather than render lighting and other normal things
         */
        var comp_material = new THREE.ShaderMaterial({
            uniforms: {
                R: { value: 0 },
                time: { value: 0 },
                res: { value: [comp_width, comp_height] },
                map: { value: comp_target1 },
                pattern: { value: patterns[0] },
                addRandom: { value: 0 },
                firstFrame: { value: 0 }
            },
            vertexShader: document.getElementById('vertex-shader').textContent,
            fragmentShader: document.getElementById('frag-shader').textContent
        });
        var comp_mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1, 1), comp_material);
        comp_scene.add(comp_mesh);


    }

    start() {
        $(window).on('load', () => {
            $('#loading-screen').hide()
            console.log('it begins!')
        })
        loop((dt) => {
            this.render()
            // if (this.environment.controls) {
            //     this.environment.controls.update(dt)
            // }
        }).start()
    }

    render() {
        // requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
    }


}

module.exports = ShaderSketch
