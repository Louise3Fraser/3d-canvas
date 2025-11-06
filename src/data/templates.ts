import basicCover from "../assets/template-covers/basic.png";
import donutCover from "../assets/template-covers/donut.png";
import elfCover from "../assets/template-covers/elf.png";
import pumpkinCover from "../assets/template-covers/pumpkin.png";
import { BasicScene, donut, elf, pumpkin } from "./mock-data";

export const templates = [
  { src: pumpkinCover, title: "Pumpkin", data: pumpkin },
  { src: basicCover, title: "Basic scene", data: BasicScene },
  { src: donutCover, title: "Donut", data: donut },
  { src: elfCover, title: "Elf", data: elf },
];
