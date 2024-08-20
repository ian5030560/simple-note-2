import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { useEffect, useRef } from "react";

export default function useGenimi() {
    const model = useRef<GenerativeModel>();

    useEffect(() => {
        const API_KEY = "AIzaSyDXlilZA6flQCDThnj7qRd4gunxZIWl1Po";
        model.current = new GoogleGenerativeAI(API_KEY)
            .getGenerativeModel({ model: "gemini-1.5-flash", tools: [{}] })
    })

    return model.current;
}