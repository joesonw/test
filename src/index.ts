import GL = require('gl');
import * as fs from 'fs';
import Canvas = require('canvas');

function dec2Hex(dec: number): string {
    const ret = dec.toString(16);
    return '00'.slice(ret.length) + ret;
}

export default class Test {
    private _gl: WebGLRenderingContext;

    constructor(private width: number, private height: number) {
        const gl = GL(width, height);
        gl.viewport(0, 0, width, height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this._gl = gl;
    }

    public get gl(): WebGLRenderingContext {
        return this._gl;
    }

    public createContext(width: number, height: number): CanvasRenderingContext2D{
        const canvas = new Canvas(this.width, this.height);
        return canvas.getContext('2d');
    }

    public equalContext(context: CanvasRenderingContext2D) {
        const imageData = context.getImageData(0, 0, this.width, this.height);
        const gl = this._gl;
        const pixels = new Uint8Array(this.width * this.height * 4);
        gl.readPixels(0, 0, this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        const length = this.width * this.height * 4;
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j ++) {
                const R = pixels[(this.width * i + j ) * 4 + 0];
                const G = pixels[(this.width * i + j ) * 4 + 1];
                const B = pixels[(this.width * i + j ) * 4 + 2];
                const A = pixels[(this.width * i + j ) * 4 + 3];

                const r = imageData.data[(this.width * (this.width - 1 - i) + j ) * 4 + 0];
                const g = imageData.data[(this.width * (this.width - 1 - i) + j ) * 4 + 1];
                const b = imageData.data[(this.width * (this.width - 1 - i) + j ) * 4 + 2];
                const a = imageData.data[(this.width * (this.width - 1 - i) + j ) * 4 + 3];
                if (
                    R !== r ||
                    G !== g ||
                    B !== b ||
                    A !== a
                ) {
                    throw `failed to match context at (${i},${j})`;
                }
            }
        }
        for (let i = 0 ; i < length; i++) {
            if (imageData.data[i] !== pixels[i]) {
            }
        }
    }

    public exportImage(file: string) {
        const gl = this._gl;
        const pixels = new Uint8Array(this.width * this.height * 4);
        gl.readPixels(0, 0, this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        const canvas = new Canvas(this.width, this.height);

        const context = canvas.getContext('2d');
        const imageData = context.createImageData(this.width, this.height);
        const total = this.width * this.height * 4;
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j ++) {
                const R = pixels[(this.width * i + j ) * 4 + 0];
                const G = pixels[(this.width * i + j ) * 4 + 1];
                const B = pixels[(this.width * i + j ) * 4 + 2];
                const A = pixels[(this.width * i + j ) * 4 + 3];


                imageData.data[(this.width * (this.width - 1 - i) + j ) * 4 + 0] = R;
                imageData.data[(this.width * (this.width - 1 - i) + j ) * 4 + 1] = G;
                imageData.data[(this.width * (this.width - 1 - i) + j ) * 4 + 2] = B;
                imageData.data[(this.width * (this.width - 1 - i) + j ) * 4 + 3] = A;
            }
        }
        context.putImageData(imageData, 0, 0);

        fs.writeFileSync(file, canvas.toBuffer());
    }
}
