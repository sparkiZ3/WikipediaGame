import * as cheerio from "cheerio";

export class Utils {
    static async fetchWikipedia(url) {
        try{
            return await fetch(url);
        }catch(e){
            console.log("Failed to get wikipedia page :", e)
            return this.renderFetchError(e.message)
        }
    }
    static renderFetchError(error){
        return `<div class="mw-page-container">
                    failed to fetch ressource :
                </div>${error}`
    }
    static formatPage(htmlContent) {
        const $ = cheerio.load(htmlContent);

        // Sélectionner uniquement la div mw-page-container
        const container = $(".mw-page-container").html();

        return container || null;

    }
    static async getRandomWikipediaPage() {
        try {
            const response = await this.fetchWikipedia("https://fr.wikipedia.org/api/rest_v1/page/random/summary");

            if (!response.ok) {
                throw new Error(`HTTP error while fetching random page: ${response.status}`);
            }

            const data = await response.json();

            const title = data?.titles?.normalized ?? "Titre inconnu";
            const url = data?.content_urls?.desktop?.page ?? "";

            const reformattedURL = url.replace(/'/g, "%27");

            return {
                title,
                url: reformattedURL
            };

        } catch (error) {
            console.error("Erreur lors de la récupération de la page Wikipedia :", error);
            return null;
        }
    }
    static async getWikipediaPageDataSummary(slug) {
        const fullUrl = "https://fr.wikipedia.org/api/rest_v1/page/summary/"+slug
        try {
            const response = await fetch(fullUrl);

            if (!response.ok) {
                throw new Error(`HTTP error while fetching random page: ${response.status}`);
            }

            const data = await response.json();

            const title = data?.titles?.normalized ?? "Titre inconnu";
            const url = data?.content_urls?.desktop?.page ?? "";

            const reformattedURL = url.replace(/'/g, "%27");

            return {
                title,
                url: reformattedURL
            };

        } catch (error) {
            console.error("Erreur lors de la récupération des données de la page :", error);
            return null;
        }
    }

    static async getWikipediaPage(url) {
        if (this.checkDomain(url)){
            console.log("Fetching Wikipedia page:", url);
            const response = await this.fetchWikipedia(url);
            if (response.text){
                return this.formatPage(await response.text());
            }else{
                console.log('error while fetching : ',url)
            }
        }else{
            console.log("unauthorized page :",url)
            return null;
        }
    }
    static checkDomain(url){
        console.log("checking domain :"+url)
        const targetUrl = new URL(url)
        console.log("domain : ", targetUrl.hostname)
        console.log("path : ", targetUrl.pathname)
        return targetUrl.hostname === "fr.wikipedia.org" && targetUrl.pathname.startsWith("/wiki/")
    }
}