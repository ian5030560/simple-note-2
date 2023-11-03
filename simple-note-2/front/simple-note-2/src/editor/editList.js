import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";

const Image = {
    class: ImageTool,
    config: {
        /**
         * 
         * @param {File} file 
         * @returns {Promise.<{success, file: {url}}>}
         */
        uploadByFile(file){

            const convert = async (file) => {
                console.log(file);
                return {
                    success: 1,
                    file: {
                        url: URL.createObjectURL(file)
                    }
                }
            }

            return convert(file);
        }
    }
}

export const tools = {
    header: Header,
    image: Image,
}