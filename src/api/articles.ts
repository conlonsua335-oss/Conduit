import { apiRequest } from "./client";
import type { ArticlesResponse, ArticleResponse, CreateArticleInput, ProfileResponse, CommentsResponse, CommentResponse } from "../types";


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

export const updateArticle = (slug:string, data:CreateArticleInput) => 
  apiRequest<ArticleResponse>(`/article/${slug}`,{
    method:"PUT",
    body:JSON.stringify({article:data})
  })

export const followUser = (username: string) =>
  apiRequest<ProfileResponse>(`/profiles/${username}/follow`, { method: "POST" });  

export const unfollowUser = (username: string) =>
  apiRequest<ProfileResponse>(`/profiles/${username}/follow`, { method: "DELETE" });  

export const getComment = (slug :string ) => 
  apiRequest<CommentsResponse>(`/articles/${slug}/comments`)

export const addComment = (slug:string, body:string) =>
  apiRequest<CommentResponse>(`/articles/${slug}/comments`,{
    method:"POST",
    body:JSON.stringify({comment:{body}})
  })

 export const deleteComment = (slug:string, commentId:number) =>
  apiRequest<void>(`/articles/${slug}/comments/${commentId}`,{
    method:"DELETE"
  }) 