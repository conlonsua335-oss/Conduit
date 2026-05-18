import type { ArticlesResponse } from "../types";
import { apiRequest } from "./client";

export const listArticles = (limit = 10, offset = 0) => 
    apiRequest<ArticlesResponse>(`/articles?limit=${limit}&offset=${offset}`)
