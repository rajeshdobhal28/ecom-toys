export type ApiEndpoint = { url: string; method: string };

export type APIConfig = {
    [key: string]: ApiEndpoint
}