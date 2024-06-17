import { Lame } from "node-lame";
import { existsSync } from "fs";

export class MP3Cutter {
  public async cut(src: string, start: number, end: number, options: Options) {
    if (!src || !start || !end) {
      throw "Invalid parameters!";
    }

    if (!existsSync(src)) {
      throw `Giving file doesn't exists, got ${src}`;
    }

    if (start > end) {
      throw "Start is bigger than end!";
    } else if (start < 0 || end < 0) {
      throw "Start or end is negative, cannot process";
    }

    // Convert file into Buffer
    const lamedecoder = new Lame({ output: "buffer" }).setFile(src);
    lamedecoder.decode().then(() => {
      const buffer = lamedecoder.getBuffer();
      this.encodeFile(buffer, options);
    });
  }

  private encodeFile(buffer: Buffer, options: Options) {
    const lameEncoder = new Lame({
      output: options.outputName,
      sfreq: options.sampleRate,
      bitrate: options.bitrate ?? 192,
    }).setBuffer(buffer);

    // Encode into mp3
    lameEncoder
      .encode()
      .then(() => {
        console.log("encoding finished");
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

export class Options {
  outputName!: string;
  bitrate?: Bitrate;
  sampleRate?: SampleRate;
}

export type Bitrate =
  | 8
  | 16
  | 24
  | 32
  | 40
  | 48
  | 56
  | 64
  | 80
  | 96
  | 112
  | 128
  | 144
  | 160
  | 192
  | 224
  | 256
  | 320;

export type SampleRate = 8 | 11.025 | 12 | 16 | 22.05 | 24 | 32 | 44.1 | 48;
