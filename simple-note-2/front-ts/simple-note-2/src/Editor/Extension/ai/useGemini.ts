import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { useEffect, useRef } from "react";
const { api: API_KEY } = require("../../../resource/gemini.json");

export default function useGenimi() {
    const model = useRef<GenerativeModel>();
    useEffect(() => {
        if(!API_KEY) return;
        model.current = new GoogleGenerativeAI(API_KEY)
            .getGenerativeModel({ model: "gemini-1.5-flash", tools: [{}] })
    })

    return model.current;
}