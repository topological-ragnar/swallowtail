const $ = require('jquery')
const THREE = require('three')
const dat = require('dat.gui')
const loop = require('raf-loop')
const WindowResize = require('three-window-resize')


class Sketch {

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

        var geometry = new THREE.BoxGeometry();
        // var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        var material = new THREE.MeshNormalMaterial()
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
        this.camera.position.z = 5


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

module.exports = Sketch
