/// <reference types="node" />
declare module 'gl' {
    function gl(width: number, height: number, opts?: Object): any;
    export = gl;
}
declare module 'canvas' {
    class Image extends HTMLImageElement {
        static MODE_IMAGE: number;
        static MODE_MIME: number;
        src: any;
        dataMode: number;
    }
    class Canvas extends HTMLCanvasElement {
        constructor(width: number, height: number);
        static Image: any;
        toBuffer(type?: string): Buffer;
    }
    export = Canvas;
}
