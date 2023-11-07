import ImageDialog from "./component/image";
import ReactDOM from "react-dom/server";
import { createRoot } from "react-dom/client";
import { FileImageOutlined } from "@ant-design/icons";

export class Image {

    constructor({ data }) {
        this.data = data;
    }

    save() {
        return this.data;
    }

    handleSelect = (file) => {
        this.data = {
            url: URL.createObjectURL(file)
        }
    }

    render() {
        this.wrapper = document.createElement("div");
        this.wrapper.className = "wrapper";
        const root = createRoot(this.wrapper);
        root.render(<ImageDialog src="" onSelect={this.handleSelect} />);
        return this.wrapper;
    }

    static get toolbox() {

        return {
            title: "Image",
            icon: ReactDOM.renderToString(<FileImageOutlined />)
        }
    }

}


