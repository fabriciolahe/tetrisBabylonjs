/// <reference path='./vendor/babylon.d.ts'/>

//get our canvas
const canvas = document.getElementById('renderCanvas');

const engine = new BABYLON.Engine(canvas,true);

const BOX_SIZE = 1
const BOX_DEPTH = 4
const GROUND_SIZE = 20

const SHAPES = ["I", "O", "S", "T", "L"]
var BODIES = { "I": {}, "O": {}, "S": {}, "T": {}, "L": {} }

function createScene(){
    //Create Scene
    const scene = new BABYLON.Scene(engine);
    scene.enablePhysics(new BABYLON.Vector3(0,-0.5,0), new BABYLON.AmmoJSPlugin());

    //Create Camera
    const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0,0,-50));
    camera.rotate = Math.PI /80;

    //Create Light
    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0,10,0));

    //Create Basement
    const base = BABYLON.MeshBuilder.CreateBox('base',{
        size:1
    },scene);
    base.position.y = -11;
    base.scaling.x = 20;
    base.scaling.z = 10;
    new BABYLON.PhysicsImpostor(base, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, scene);

    //Create left Wall
    const LWall = BABYLON.MeshBuilder.CreateBox('lwall',{
        size:1
    },scene);
    LWall.position.x = -10;
    LWall.scaling.y = 23;
    new BABYLON.PhysicsImpostor(LWall, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, scene);

    //Create right Wall
    const RWall = BABYLON.MeshBuilder.CreateBox('rwall',{
        size:1
    },scene);
    RWall.position.x = 10;
    RWall.scaling.y = 23;
    new BABYLON.PhysicsImpostor(RWall, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, scene);

    var ticker = 0;

    scene.registerBeforeRender(function() {
        if((ticker++ % 60)) return;
        let nextChar = SHAPES[randomInteger(1, SHAPES.length)]
        getBody(nextChar, scene, new BABYLON.Vector3(0,40,0))  
    });
    scene.registerBeforeRender( ()=> {
        scene.meshes.forEach( (m)=> {
            if (m.name=="s" && m.position.y < -15) {
                m.dispose();
            }
        })
    });

    return scene;
}

var getBody = (nextChar, scene, position = new BABYLON.Vecto3(0, 40, 0)) => {

    let body
    if (BODIES[nextChar].mesh) {
        body = BODIES[nextChar].mesh.clone("s")
    } else {
        let shape = getShape(nextChar, scene)
        BODIES[nextChar].mesh = shape

        body = BODIES[nextChar].mesh.clone("s")
        body.isVisible = true

    }
    body.position = position

    return body
}

var getShape = (shape, scene) => {

    switch (shape) {
        case "O":
            var boxO = BABYLON.MeshBuilder.CreateBox("boxO", { height: BOX_DEPTH/2, width: BOX_SIZE, depth: BOX_DEPTH/2 }, scene);
            boxO.physicsImpostor = new BABYLON.PhysicsImpostor(boxO, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1 }, scene);
            return boxO

        case "I":
            var boxI = BABYLON.MeshBuilder.CreateBox("boxI", { height: BOX_DEPTH, width: BOX_SIZE, depth: BOX_SIZE }, scene);
            boxI.physicsImpostor = new BABYLON.PhysicsImpostor(boxI, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1 }, scene);

            return boxI

        case "L":

            var boxL = BABYLON.MeshBuilder.CreateBox("boxL", { height: BOX_SIZE, width: BOX_SIZE, depth: BOX_DEPTH }, scene);
            var boxLTop = BABYLON.MeshBuilder.CreateBox("boxLTop", { height: BOX_SIZE, width: BOX_SIZE, depth: BOX_SIZE }, scene);
            boxLTop.position.y = BOX_SIZE
            boxLTop.position.z = BOX_SIZE + BOX_SIZE/2
            boxLTop.parent = boxL

            boxL.physicsImpostor = new BABYLON.PhysicsImpostor(boxL, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1 }, scene);
            boxLTop.physicsImpostor = new BABYLON.PhysicsImpostor(boxLTop, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1 }, scene);

            return boxL
            /** 
            return  BABYLON.Mesh.MergeMeshes([boxL, boxLTop])
            */

            var newMesh = subCSG.toMesh("csg", materials[shape], scene);
            newMesh.position = new BABYLON.Vector3(10, 0, 0);
            return newMesh

        case "T":
            var boxT = BABYLON.MeshBuilder.CreateBox("boxT", { height: BOX_SIZE, width: BOX_SIZE, depth: BOX_DEPTH }, scene);
            var boxTBottom = BABYLON.MeshBuilder.CreateBox("box", { height: BOX_SIZE, width: BOX_SIZE, depth: BOX_SIZE }, scene);
            boxTBottom.position.y = -BOX_SIZE
            boxTBottom.parent = boxT

            boxT.physicsImpostor = new BABYLON.PhysicsImpostor(boxT, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1 }, scene);
            boxTBottom.physicsImpostor = new BABYLON.PhysicsImpostor(boxTBottom, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1 }, scene);

            return boxT //BABYLON.Mesh.MergeMeshes([boxT, boxTBottom])

        case "S":
            var boxS = BABYLON.MeshBuilder.CreateBox("boxS", { height: BOX_SIZE, width: BOX_SIZE, depth: BOX_DEPTH / 2 }, scene);
            var boxSTop = BABYLON.MeshBuilder.CreateBox("boxS", { height: BOX_SIZE, width: BOX_SIZE, depth: BOX_DEPTH / 2 }, scene);
            boxSTop.position.y = BOX_SIZE
            boxSTop.position.z = BOX_SIZE
            boxSTop.parent = boxS

            boxS.physicsImpostor = new BABYLON.PhysicsImpostor(boxS, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1 }, scene);
            boxSTop.physicsImpostor = new BABYLON.PhysicsImpostor(boxSTop, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1 }, scene);

            return boxS

        //return BABYLON.Mesh.MergeMeshes([boxS, boxSTop])
    }
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max-min)) + min
}

const scene = createScene();


var renderLoop = function(){
    scene.render();
};

engine.runRenderLoop(renderLoop);

/* engine.runRenderLoop(()=>{
    scene.render();
}); */