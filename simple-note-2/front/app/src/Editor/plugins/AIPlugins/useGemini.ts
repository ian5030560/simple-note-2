import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { useEffect, useRef } from "react";
import useAPI from "../../../util/api";

export default function useGenimi(onError: () => void) {
    const model = useRef<GenerativeModel>();
    const { ai: { gemini } } = useAPI();

    useEffect(() => {
        gemini().then(({ api }) => {
            model.current = new GoogleGenerativeAI(api)
                .getGenerativeModel({ model: "gemini-1.5-flash" })
        }).catch((e) => {
            console.log(e);
            onError();
        });
    }, []);

    return model.current;
}