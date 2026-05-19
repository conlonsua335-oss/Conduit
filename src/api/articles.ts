import { apiRequest } from "./client";
import type { ArticlesResponse, ArticleResponse, CreateArticleInput } from "../types";

export const listArticles = (limit = 10, offset = 0, tag?: string) =>
  apiRequest<ArticlesResponse>(
    `/articles?limit=${limit}&offset=${offset}${tag ? `&tag=${tag}` : ""}`
  );

export const feedArticles = (limit = 10, offset = 0) =>
  apiRequest<ArticlesResponse>(
    `/articles/feed?limit=${limit}&offset=${offset}`
  );

export const getArticle = (slug: string) =>
  apiRequest<ArticleResponse>(`/articles/${slug}`);

export const deleteArticle = (slug: string) =>
  apiRequest<void>(`/articles/${slug}`, { method: "DELETE" });

export const createArticle = (data: CreateArticleInput) =>
  apiRequest<ArticleResponse>(`/articles`, {
    method: "POST",
    body: JSON.stringify({ article: data }),
  });

export const updateArticle = (slug:string, data: CreateArticleInput) =>
  apiRequest<ArticleResponse>(`/articles/${slug}`, {
    method: "PUT",
    body: JSON.stringify({ article: data }),
  });