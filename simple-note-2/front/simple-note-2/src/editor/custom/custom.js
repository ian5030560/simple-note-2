import React from "react";
import ReactDOMServer from "react-dom/server";
import {FileImageOutlined} from "@ant-design/icons";

class Image{

    save(){

    }

    render(){
        const input = document.createElement("input");
        input.type = ""
    }      
    
    static get toolbox(){
        return {
            title: "Image",
            icon: ReactDOMServer.renderToString(<FileImageOutlined/>)
        }
    }

}