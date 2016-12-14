export default class Test {
    private width;
    private height;
    private _gl;
    constructor(width: number, height: number);
    readonly gl: WebGLRenderingContext;
    createContext(width: number, height: number): CanvasRenderingContext2D;
    equalContext(context: CanvasRenderingContext2D): void;
    exportImage(file: string): void;
}
