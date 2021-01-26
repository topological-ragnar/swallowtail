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
        this.params.a = 0
        this.params.b = 0
        this.params.c = 0
        this.params.epsilon = 0
        this.gui.add(this.params, 'a', -10, 10, 0.1);
        this.gui.add(this.params, 'b', -10, 10, 0.1);
        this.gui.add(this.params, 'c', -2, 2, 0.1);
        // this.gui.add(this.params, 'epsilon', 0, 1,0.01);
        
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        var windowResize = new WindowResize(this.renderer, this.camera)

        
        this.clock = new THREE.Clock();
        this.clock.getDelta();

        var geometry = new THREE.BoxGeometry(2,1,1);
        // var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        var material = new THREE.MeshNormalMaterial()
        // this.cube = new THREE.Mesh(geometry, material);
        // this.scene.add(this.cube);
        this.camera.position.z = 5

        // this.numCubes = 0
        // this.cubes = []
        // for(var i = 0; i < this.numCubes; i++){
        //     this.cubes.push(new THREE.Mesh(geometry, material))
        //     this.scene.add(this.cubes[i])
        // }


        const map = new THREE.TextureLoader().load('textures/sprite.png');
        const spritematerial = new THREE.SpriteMaterial({ map: map, color: 0xffffff });

        this.sprites = []
        this.numSprites = 100
        this.spacing = 1
        for(var i = 0; i < this.numSprites; i++){
            const sprite = new THREE.Sprite(spritematerial);
            sprite.scale.set(0.1, 0.1, 1)
            this.scene.add(sprite)
            this.sprites.push(sprite)
            sprite.position.x = i/this.spacing-this.numSprites/(this.spacing*2)
        }
        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.graph = new THREE.BufferGeometry()
        var graphMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })
        var line = new THREE.Line(this.graph, graphMaterial)
        this.scene.add(line)

        var axis = new THREE.BufferGeometry()
        var points = []
        for (var i = -50; i < 50; i++) {
            points.push(new THREE.Vector3(i / 5, 0, 0))
        }
        axis.setFromPoints(points)
        var axisMaterial = new THREE.LineDashedMaterial({
            color: 0x0fe0ee,
            linewidth: 1,
            scale: 1,
            dashSize: 3,
            gapSize: 2})
        var axisObject = new THREE.Line(axis,axisMaterial)
        this.scene.add(axisObject)

        this.discrim = new THREE.BufferGeometry()
        this.setDiscrim()
        var discrimObject = new THREE.Line(this.discrim, axisMaterial)
        this.scene.add(discrimObject)
        this.paramPoint = new THREE.Sprite(spritematerial)
        this.paramPoint.scale.set(0.1, 0.1, 1)
        this.scene.add(this.paramPoint)
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

    potential(x) {
        return this.params.a + this.params.b * x + this.params.c * x * x + x * x * x * x
    }

    setGraph() {
        var points = []
        for (var i = -50; i < 50; i++) {
            points.push(new THREE.Vector3(i/5,this.potential(i/5),0))
        }
        this.graph.setFromPoints(points)
    }

    setDiscrim(){
        var points = []
        for (var i = -30; i < 31; i++) {
            var u = this.params.c
            var v = i/20
            points.push(new THREE.Vector3(
                (3 * Math.pow(v, 4) + u * v * v) / 10 - 3,
                (-2*u*v-4*Math.pow(v,3))/10-3,
                0
            ))
        }
        this.discrim.setFromPoints(points)
    }

    render() {
        // requestAnimationFrame(this.animate);
        var dt = this.clock.getDelta();

        this.renderer.render(this.scene, this.camera);

        this.setGraph()
        this.setDiscrim()

        this.paramPoint.position.x = this.params.a/10-3
        this.paramPoint.position.y = this.params.b/ 10 - 3

        this.sprites.forEach(sprite => {

        })
        for(var i = 0; i < this.numSprites; i++){
            var x = this.sprites[i].position.x
            this.sprites[i].position.x += dt*this.potential(x)
            if(x > 5){
                this.sprites[i].position.x = - i / this.spacing
            }
        }
        // this.controls.update();



        
    }
    

}

module.exports = Sketch
