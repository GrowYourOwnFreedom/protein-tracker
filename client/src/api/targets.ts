import { proteinTrackerApiRequest } from "@/api/client";
import { Targets } from "@/types";

export function getTargets():Promise<Targets>{
    return proteinTrackerApiRequest("/targets")
}