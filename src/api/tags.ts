import { apiRequest } from "./client";
import type { TagsResponse } from "../types";

export const getTags = () => apiRequest<TagsResponse>("/tags");