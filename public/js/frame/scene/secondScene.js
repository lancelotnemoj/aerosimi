var secondScene = function (aeroplane = "F117") {
    var scene = new BABYLON.Scene(engine);

    type = "side"
    video = ""

    var light = setLight(scene)
    frontCamera = frontCam(scene)
    sideCamera = sideCam(scene)
    scene.activeCamera = sideCamera
    var ground = frameGround(scene)
    var two_panel = addFrequencePanel(scene, aeroplane)
    var vrHelper = vr(scene, ground)
    var tri_panel = addBackButton("表面电场分布（频率）")

    var assetsManager = new BABYLON.AssetsManager(scene);
    assetsManager.onTaskError = function (task) {
        console.log("error while loading " + task.name);
    }
    assetsManager.onFinish = function (tasks) {
        engine.runRenderLoop(function () {
            scene.render();
        });
    };
    if (aeroplane == "F117") {
        addRadar(assetsManager, new BABYLON.Vector3(260, -10, -100))
        addF117(assetsManager)
        assetsManager.load();
    } else {
        addRadar(assetsManager, new BABYLON.Vector3(260, -10, -100))
        addA380(assetsManager)
        assetsManager.load();
    }
    console.log(scene)
    return scene;
};

// -----------------------------------------
function addFrequencePanel(scene_t, aeroplane) {
    wave = ""
    radar = ""
    let columns = [
        "F117",
        "A320"
    ]
    var columns_l = [
        "正视图",
        "侧视图"
    ]
    var columns_radar = [
        "433MHz",
        "2.4GHz"
    ]

    let columns_power=[
        "0dBm",
        "10dBm"
    ]

    // aero_type
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("plane_r");
    let panel = miniFormitem(columns, "飞行器类型", 30, 60, "left", "top", onRatioClick = (aero) => {
        if (aero == "F117") {
            scene.dispose()
            scene = secondScene("F117")
        } else {
            scene.dispose()
            scene = secondScene("A380")
        }
    })
    advancedTexture.addControl(panel);

    var advancedTexture_rr = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("plane_rr");
    let panel_rr = miniFormitem(columns_power, "入射功率", 30, 300, "left", "top")
    advancedTexture_rr.addControl(panel_rr);
    // radar_type
    var advancedTexture_l = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("plane_l");
    let panel_l = downFormitem_s(columns_radar, "开始实验", "雷达类型", 30, 420, "left", "top", onRatioClick = (frequency) => {
        if (frequency == "433MHz") {
            if (wave != "") {
                // clearInterval(wave)
                // wave=createRadarSphere(scene,2,new BABYLON.Vector3(257,15,-98),new BABYLON.Vector3(Math.PI*0.3,Math.PI*0.69,Math.PI*0))
                radar = "433MHz"
            } else {
                // wave=createRadarSphere(scene,2,new BABYLON.Vector3(257,15,-98),new BABYLON.Vector3(Math.PI*0.3,Math.PI*0.69,Math.PI*0))
                radar = "433MHz"
            }
            // setTimeout(()=>{
            //     clearInterval(wave)
            //     wave=""
            // },5000)
        } else if (frequency == "2.4GHz") {
            if (wave != "") {
                // clearInterval(wave)
                // wave=createRadarSphere(scene,0.7,new BABYLON.Vector3(257,15,-98),new BABYLON.Vector3(Math.PI*0.3,Math.PI*0.69,Math.PI*0))
                radar = "2.4GHz"
            } else {
                // wave=createRadarSphere(scene,0.7,new BABYLON.Vector3(257,15,-98),new BABYLON.Vector3(Math.PI*0.3,Math.PI*0.69,Math.PI*0))
                radar = "2.4GHz"
            }
            // setTimeout(()=>{
            //     clearInterval(wave)
            //     wave=""
            // },5000)
        }
    }, onButtonClick = () => {
        if (aeroplane != "" && radar != "" && type != "") {
            scene.meshes.forEach((element) => {
                if (element.state == "f117" || element.state == "a380") {
                    aerofly_2(element, radar)
                }
                setTimeout(() => {
                    video = addPicture("exp_2", aeroplane, radar, type, x = 300, y = 80, z = 40)
                }, 7000)
            })
        } else {
            console.log(aeroplane, wave, type)
            alert("请填写完所有参数")
        }
    })
    advancedTexture_l.addControl(panel_l)

    // view_type
    let panel_r2 = miniFormitem(columns_l, "选择角度", 30, 180, "left", "top", onRatioClick = (towards) => {
        if (towards == "正视图") {
            type = "front"
            scene.meshes.forEach((element) => {
                if (element.state == "f117" || element.state == "a380") {
                    console.log(element.position)
                    if (element.position.z != 0) {
                        element.position = new BABYLON.Vector3(-300, element.position.y, 0)
                        element.rotation.y -= 0.5 * Math.PI
                    }
                }
            })
        } else {
            scene.meshes.forEach((element) => {
                type = "side"
                if (element.state == "f117" || element.state == "a380") {
                    console.log(element.position)
                    if (element.position.x != 0) {
                        element.position = new BABYLON.Vector3(0, element.position.y, 300)
                        element.rotation.y += 0.5 * Math.PI
                    }
                }
            })
        }
        if (video != "") {
            video.dispose()
            video = ""
        }
    })
    advancedTexture.addControl(panel_r2);
}

function aerofly_2(aeroplane, frequency) {
    let temp_pos
    let radar = getMeshByState("radar")
    radar = radar.position
    let wave = createRadarSphere(scene, frequency == "433MHz" ? 2 : 0.7, new BABYLON.Vector3(257, 15, -98), new BABYLON.Vector3(Math.PI * 0.3, Math.PI * 0.69, Math.PI * 0))
    if (aeroplane.position.z == 0 && aeroplane.position.x < 600) {
        let back = 0
        setTimeout(() => {
            back = setInterval(() => {
                temp_pos = new BABYLON.Vector3(aeroplane.position.x, aeroplane.position.y, aeroplane.position.z)
                setTimeout(()=>{
                    createBackSphere(scene, temp_pos, radar)
                },1500)
            }, 200)
        }, 500)
        let move = setInterval(() => {
            aeroplane.position.x += 0.5
            if (aeroplane.position.x >= 600) {
                clearInterval(move)
                clearInterval(back)
                clearInterval(wave)
            }
        }, 1)
    } else if (aeroplane.position.x == 0 && aeroplane.position.z > -600) {
        let back = 0
        setTimeout(() => {
            back = setInterval(() => {
                temp_pos = new BABYLON.Vector3(aeroplane.position.x, aeroplane.position.y, aeroplane.position.z)
                setTimeout(()=>{
                    createBackSphere(scene, temp_pos, radar)
                },1500)
            }, 300)
        }, 1000)
        let move = setInterval(() => {
            aeroplane.position.z -= 0.5
            if (aeroplane.position.z <= -600) {
                clearInterval(move)
                clearInterval(back)
                clearInterval(wave)
            }
        }, 1)
    }
}