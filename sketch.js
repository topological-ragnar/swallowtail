const $ = require('jquery')
const THREE = require('three')
OrbitControls = require('three-orbit-controls')
const dat = require('dat.gui')
const loop = require('raf-loop')
const WindowResize = require('three-window-resize')


class Sketch {

    constructor() {
        this.gui = new dat.GUI()
        this.params = this.gui.addFolder('parameters');
        this.gui.show()
        this.params.xspeed = 1
        this.params.yspeed = 1
        this.gui.add(this.params, 'xspeed', 0, 10);
        this.gui.add(this.params, 'yspeed', 0, 10);
        
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        var windowResize = new WindowResize(this.renderer, this.camera)

        


        var geometry = new THREE.BoxGeometry(2,1,1);
        // var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        var material = new THREE.MeshNormalMaterial()
        // this.cube = new THREE.Mesh(geometry, material);
        // this.scene.add(this.cube);
        this.camera.position.z = 5

        this.numCubes = 100
        this.cubes = []
        for(var i = 0; i < this.numCubes; i++){
            this.cubes.push(new THREE.Mesh(geometry, material))
            this.scene.add(this.cubes[i])
        }


        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);

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
        for(var i = 0; i < this.numCubes; i++){
            this.cubes[i].rotation.x += 0.0001*this.params.xspeed*i;
            this.cubes[i].rotation.y += 0.0001*this.params.yspeed*i;
        }
        // this.controls.update();

        
    }
    

}

module.exports = Sketch
