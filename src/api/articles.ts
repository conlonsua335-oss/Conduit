import { apiRequest } from "./client";
import type { ArticlesResponse, ArticleResponse, CreateArticleInput, ProfileResponse, CommentsResponse, CommentResponse } from "../types";


export const listArticles = (
  limit = 10,
  page = 1,
  tag?: string,
  author?: string,
  favorited?: string
) =>
  apiRequest<ArticlesResponse>(
    `/articles?limit=${limit}&page=${page}${tag ? `&tag=${tag}` : ""}${author ? `&author=${author}` : ""}${favorited ? `&favorited=${favorited}` : ""}`
  );

export const feedArticles = (limit = 10, page = 1) =>
  apiRequest<ArticlesResponse>(
    `/articles/feed?limit=${limit}&page=${(page-1)*limit}`
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
  apiRequest<ArticleResponse>(`/articles/${slug}`,{
    method:"PUT",
    body:JSON.stringify({article:data})
  })

export const followUser = (username: string) =>
  apiRequest<ProfileResponse>(`/profiles/${username}/follow`, { method: "POST" });  

export const unfollowUser = (username: string) =>
  apiRequest<ProfileResponse>(`/profiles/${username}/follow`, { method: "DELETE" });  

export const favoriteArticle = (slug: string) =>
  apiRequest<ArticleResponse>(`/articles/${slug}/favorite`, {
    method: "POST",
  });

export const unfavoriteArticle = (slug: string) =>
  apiRequest<ArticleResponse>(`/articles/${slug}/favorite`, {
    method: "DELETE",
  });

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

  export const getProfile = (username:string) =>
    apiRequest<ProfileResponse>(`/profiles/${username}`) 