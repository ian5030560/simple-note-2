import { useMemo } from "react";

export function dataURItoBlob(dataURI: string) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = decodeURI(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

class StepController{

    private undoStack: Array<string>;
    private redoStack: Array<string>;
    canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement){
        this.undoStack = [];
        this.redoStack = [];
        this.canvas = canvas;
    }

    save(){
        let context = this.canvas.getContext("2d", { willReadFrequently: true });
        if(!context) return;
        
        let data = this.canvas.toDataURL();
        this.undoStack.push(data);
    }

    redo(){
        if(this.redoStack.length === 0) return;

        let data = this.redoStack.pop()!;
        this.undoStack.push(data);
        this.redraw(data);
    }

    undo(){
        if(this.undoStack.length === 0) return;

        let data = this.undoStack.pop()!;
        this.redoStack.push(data);
        this.redraw(data);
    }

    private redraw(data: string){
        let context = this.canvas.getContext("2d", { willReadFrequently: true });
        if(!context) return;
        
        let image = new Image();
        image.src = data;
        
        image.onload = () => {
            context!.clearRect(0, 0, this.canvas.width, this.canvas.height);
            context!.drawImage(image, 0, 0);
        }
    }

    export(){

        let imageData: HTMLImageElement | undefined = undefined;
        if(this.canvas.style.backgroundImage){
            let {backgroundImage} = window.getComputedStyle(this.canvas);
            backgroundImage = backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
            imageData = new Image();
            imageData.onload = () => {
                imageData!.width = this.canvas.width;
                imageData!.height = this.canvas.height;
            }
            imageData.src = backgroundImage;
        }


        let context = this.canvas.getContext("2d")!;
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";

        if(imageData){
            context.globalCompositeOperation = "destination-over";
            context.drawImage(imageData, 0, 0, this.canvas.width, this.canvas.height);
            context.globalCompositeOperation = "source-over";
        };

        let data = new Image();
        let blob = dataURItoBlob(this.canvas.toDataURL("image/png", 1));
        data.src = URL.createObjectURL(blob);
        return data;
    }

    clear(){
        this.redoStack.length = 0;
        this.undoStack.length = 0;
    }

    isDirty(){
        return this.undoStack.length > 0;
    }
}

const useStep = (canvas: HTMLCanvasElement | undefined | null) => {
    const step = useMemo(() => canvas ? new StepController(canvas) : undefined, [canvas]);
    return step;
}

export default useStep;