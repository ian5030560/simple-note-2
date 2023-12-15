import { Editor, Range, Transforms, Element } from "slate"

// function isUrl(url) {
//     var urlPattern = new RegExp('^(https?:\\/\\/)?' + 
//         '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + 
//         '((\\d{1,3}\\.){3}\\d{1,3}))' + 
//         '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + 
//         '(\\?[;&a-z\\d%_.~+=-]*)?' + 
//         '(\\#[-a-z\\d_]*)?$', 'i'); 
//     return !!urlPattern.test(url);

// }

const LinkHelper = {

    isActive(editor){
        const [match] = Editor.nodes(
            editor,
            {match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === "link"}
        )

        return !!match
    },

    unwrapLink(editor){
        Transforms.unwrapNodes(
            editor, 
            {match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link'}
        )
    },
    /**
     * 
     * @param {Editor} editor
     * @param {string} href  
     */
    toggleLink(editor, href) {

        const isValid = this.isUrl(href);
        const isActive = this.isActive(editor);

        if(isValid){

            if(isActive) this.unwrapLink(editor);

            const {selection} = editor;
            const isCollapsed = selection && Range.isCollapsed(selection);
            const Link = {
                type: 'link',
                link: href,
                children: isCollapsed ? [{text: href}] : [],
            }
            if(isCollapsed) Transforms.insertNodes(editor, Link);
            else{
                Transforms.wrapNodes(editor, Link, {split: true});
                Transforms.collapse(editor, {edge: "end"});
            }
        }
        
        return isValid;
    },

    isUrl(url) {
        var urlPattern = new RegExp('^(https?:\\/\\/)?' + 
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + 
            '((\\d{1,3}\\.){3}\\d{1,3}))' + 
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + 
            '(\\?[;&a-z\\d%_.~+=-]*)?' + 
            '(\\#[-a-z\\d_]*)?$', 'i'); 
        return !!urlPattern.test(url);
    
    }
}

export default LinkHelper;