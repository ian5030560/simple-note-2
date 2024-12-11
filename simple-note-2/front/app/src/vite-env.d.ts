declare module "*.jpg";
declare module "*.png";
declare module "*.css";
declare module "*.json"{
    const value: any;
    export default value;
};
declare module "*.mp4"{
    const src: string;
    export default src;  
}