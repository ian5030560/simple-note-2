import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { useEffect, useRef } from "react";

export default function useGenimi() {
    const model = useRef<GenerativeModel>();

    useEffect(() => {
        // model.current = new GoogleGenerativeAI(API_KEY)
        //     .getGenerativeModel({ model: "gemini-1.5-flash", tools: [{}] })
    })

    return model.current;
}