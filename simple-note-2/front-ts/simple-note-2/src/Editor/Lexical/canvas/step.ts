import { useMemo } from "react";

function dataURItoBlob(dataURI: string) {
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

    private undoStack: Array<HTMLImageElement>;
    private redoStack: Array<HTMLImageElement>;
    canvas: HTMLCanvasElement;
    private ustep: number;
    private rstep: number;

    constructor(canvas: HTMLCanvasElement){
        this.undoStack = [];
        this.redoStack = [];
        this.canvas = canvas;
        this.ustep = -1;
        this.rstep = -1;
    }

    save(){
        let context = this.canvas.getContext("2d", { willReadFrequently: true });
        if(!context) return;
        
        let data = new Image();
        data.src = this.canvas.toDataURL();
        if(this.ustep === this.undoStack.length - 1){
            this.undoStack.push(data);
            this.ustep ++;
        }
        else{
            this.undoStack[++ this.ustep] = data;
        }
    }

    redo(){
        if(this.rstep === -1) return;
    
        let data = this.redoStack[this.rstep --];

        if(this.ustep === this.undoStack.length - 1){
            this.undoStack.push(data);
            this.ustep ++;
        }
        else{
            this.undoStack[++ this.ustep] = data;
        }

        this.redraw(data);
    }

    undo(){
        if(this.ustep === -1) return;
   
        let data = this.undoStack[this.ustep --];

        if(this.rstep === this.redoStack.length - 1){
            this.redoStack.push(data);
            this.rstep ++;
        }
        else{
            this.redoStack[++ this.rstep] = data;
        }

        this.redraw(data);
    }

    private redraw(data: HTMLImageElement){
        let context = this.canvas.getContext("2d", { willReadFrequently: true });
        if(!context) return;
        
        // console.log(this.undoStack, this.ustep);
        // console.log(this.redoStack, this.rstep);
        // console.log("--------------------------------------------------------");

        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        data.onload = () => context!.drawImage(data, 0, 0);
    }

    export(){
        let data = new Image();
        let blob = dataURItoBlob(this.canvas.toDataURL());
        data.src = URL.createObjectURL(blob);
        this.clear();
        return data;
    }

    clear(){
        this.rstep = -1;
        this.ustep = -1;
    }

    isDirty(){
        return this.ustep !== -1;
    }
}

const useStep = (canvas: HTMLCanvasElement | undefined | null) => {
    const step = useMemo(() => canvas ? new StepController(canvas) : undefined, [canvas]);
    return step;
}

export default useStep;