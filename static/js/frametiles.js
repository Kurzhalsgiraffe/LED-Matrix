const tile_body = document.querySelector("#tile-body");
var canvasObject = new CanvasObject(canvas=null, FRAME_SIZE=256, PIXEL_SIZE=16, colorArray=[], gridColor='rgba(0, 0, 0, 1.0)');

async function loadMultipleArraysFromServer(ids) {
    let response = await fetch("/loadlist", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(ids)
    });
    
    if (response.status == 200) {
        let res = await response.json();
        return res
    } else {
        console.log("failed to load colorArray from server");
    }
}

async function initializeCanvasTiles(animation_ids, thumbnail_ids) {
    let blobs = await loadMultipleArraysFromServer(thumbnail_ids)

    for (let id of animation_ids) {
        const wrap = document.createElement("div");
        const tile = document.createElement("div");
        const canvas = document.createElement("canvas");
        const cardbody = document.createElement("div");

        wrap.classList.add("col")
        wrap.classList.add("col-lg-3")
        tile.classList.add("card");
        tile.classList.add("h-80");
        tile.classList.add("bg-dark");
        tile.setAttribute("id", "tile-"+id);
        canvas.classList.add("card-img-top");
        canvas.setAttribute("width", "256px");
        canvas.setAttribute("height", "256px");
        canvas.setAttribute("id", "canvas-"+id);
        cardbody.classList.add("card-body");
        cardbody.setAttribute("id", "card-body-"+id);

        tile.appendChild(canvas);
        tile.appendChild(cardbody);
        wrap.appendChild(tile);
        tile_body.appendChild(wrap);
    }
    if (Object.keys(blobs).length !== 0) {
        await drawThumbnails(blobs,animation_ids);
    }
}

async function drawThumbnails(blobs,animation_ids) {
    for (let x=0; x<blobs.length; x++) {
        id = animation_ids[x]
        blob = blobs[x][1]

        let c = document.querySelector("#canvas-"+id);
        canvasObject.setCanvas(c);
        canvasObject.setColorArray(blob)
        
        if (canvasObject.colorArray.length === 0) {
            canvasObject.initializeColorArray();
        }
        canvasObject.drawColorArrayToCanvas();
        canvasObject.drawGrid()
    }
}