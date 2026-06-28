import { proteinTrackerApiRequest } from "@/api/client";
import { Targets, UpdateTargetsRequestBody } from "@/types";

export async function getTargets():Promise<Targets>{
    return proteinTrackerApiRequest<Targets>("/targets")
}

export async function updateTargets(data: UpdateTargetsRequestBody):Promise<Targets> {
  const response = proteinTrackerApiRequest<Targets>("/targets", {
    method: "PATCH",
    data,
  });
  return response
  
}