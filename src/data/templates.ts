import basicCover from "../assets/template-covers/basic.png";
import donutCover from "../assets/template-covers/donut.png";
import pumpkinCover from "../assets/template-covers/pumpkin.png";
import cityCover from "../assets/template-covers/city.png";
import { BasicScene, donut, pumpkin, city } from "./mock-data";

export const templates = [
  { src: basicCover, title: "Basic scene", data: BasicScene },
  { src: donutCover, title: "Donut", data: donut },
  { src: pumpkinCover, title: "Pumpkin", data: pumpkin },
  { src: cityCover, title: "City scene", data: city },
];
