import { useCallback, useEffect, useMemo, useRef } from "react";

interface WebcamProp {
    width: number;
    height: number;
    contraints: MediaStreamConstraints;
}
const useWebcam = (prop: WebcamProp) => {

    const ref = useRef<HTMLVideoElement>(null);
    const flag = useRef<boolean>(false);

    const init = useCallback(() => {
        if(ref.current && !flag.current){
            navigator.mediaDevices
            .getUserMedia(prop.contraints)
            .then(stream => {
                ref.current!.srcObject = stream;
                flag.current = true;
            })
        } 
    }, [prop.contraints]);

    useEffect(() => {}, [init, prop.contraints]);
    
    const getStream = useCallback(() => ref.current!.srcObject as MediaStream, []);

    const play = useCallback(() => {
        if(!ref.current) return;

        let stream = getStream();
        if(!stream.active) init();
        else{
            let tracks = stream.getTracks();
            tracks.forEach(track => track.enabled = true);
        }
    }, [getStream, init]);

    const stop = useCallback(() => {
        if(!ref.current) return;

        let stream = getStream();
        if(!stream.active) return;

        let tracks = stream.getTracks();
        tracks.forEach(track => track.stop());

        flag.current = false;
    }, [getStream]);

    const getPicture = useCallback(() => {

    }, []);

    const camera = useMemo(() => <video autoPlay playsInline controls={false} width={prop.width} height={prop.height} ref={ref}/>, [prop.height, prop.width]);

    return {play, stop, camera, getPicture};
}

export default useWebcam;