import { existsSync } from "fs";
import ffmpeg from "fluent-ffmpeg";

export class MP3Cutter {
  public async cut(
    src: string,
    outputName: string,
    start: number,
    end: number,
  ): Promise<void> {
    if (!src || !outputName) {
      Promise.reject(new Error(`Invalid parameters! Got ${src} ${outputName}`));
    }

    if (!existsSync(src)) {
      Promise.reject(new Error(`Given file doesn't exists, got ${src}`));
    }

    if(src == outputName){
      Promise.reject(new Error(`Source and output name must be different`));
    }

    if (start > end) {
      Promise.reject(new Error("Start is bigger than end!"));
    } else if (start < 0 || end < 0) {
      Promise.reject(new Error("Start or end is negative, cannot process"));
    }

    ffmpeg(src)
      .setStartTime(start)
      .setDuration(end - start)
      .output(outputName)
      .on("end", () => {
        console.log("File has been cut successfully");
      })
      .on("error", (err) => {
        console.error("Error cutting the file: ", err);
      })
      .run();
  }
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
