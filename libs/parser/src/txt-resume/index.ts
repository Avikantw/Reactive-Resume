import { ResumeData, defaultResumeData, resumeDataSchema } from "@reactive-resume/schema";
import { Schema, z } from "zod";
import { Parser } from "../interfaces/parser";
import { TXTResume, txtResumeSchema } from "./schema";
export * from "./schema";


export class TXTResumeParser implements Parser<string, TXTResume> {
    schema: Schema;

    constructor() {
        this.schema = txtResumeSchema;
    }

    readFile(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                try {
                    const result = reader.result as string;
                    resolve(result);
                } catch {
                    reject(new Error("Failed to parse txt file."));
                }
            };

            reader.onerror = () => {
                reject(new Error("Failed to read the file."));
            };

            reader.readAsText(file);
        });
    }

    validate(data: string): TXTResume {
        const lines = data.split("\n");
        let parsedResumeData: {
            basics: {
                name?: string,
                email?: string,
                phone?: string,
                headline?: string,
                location?: string 
            } 
        } = { basics: {} };

        lines.forEach(line => {
            const [key, val] = line.split(':').map(s => s.trim());
            if (key === "name") {
                parsedResumeData.basics.name = val;
            }
            if (key === "email") {
                parsedResumeData.basics.email = val;
            }
            if (key == "phone") {
                parsedResumeData.basics.phone = val;
            }
            if (key === "headline") {
                parsedResumeData.basics.headline = val;
            }
            if (key === "location") {
                parsedResumeData.basics.location = val;
            }
        });
        return this.schema.parse(parsedResumeData) as TXTResume;
    }

    convert(data: TXTResume) {
        const result = JSON.parse(JSON.stringify(defaultResumeData));

        result.basics.name = data.basics?.name ?? "";
        result.basics.email = data.basics?.email ?? "";
        result.basics.phone = data.basics?.phone ?? "";
        result.basics.headline = data.basics?.headline ?? "";
        result.basics.location = data.basics?.location ?? "";

        return result;
    }
}