import * as cheerio from "cheerio";

export class Utils {
    static async fetchWikipedia(url) {
        const response = await fetch(url);

        if (!response.ok) {
            console,log("status : ",response.status)
            return renderFetchError(response.status)
            //throw new Error(`HTTP error ${response.status}`);
        }

        return response;
    }
    static renderFetchError(error){
        const page = `<div class="mw-page-container">
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
        const response = await this.fetchWikipedia("https://en.wikipedia.org/api/rest_v1/page/random/summary");

        const data = await response.json();

        const title = data.titles.normalized
        const URL=data.content_urls.desktop.page
        return {
            "title":title,
            "url":URL
        };
    }
    static async getWikipediaPage(url) {
        console.log("Fetching Wikipedia page:", url);
        const response = await this.fetchWikipedia(url);
        return this.formatPage(await response.text());
    }
}