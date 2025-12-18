import * as cheerio from "cheerio";

export class Utils {
    static async fetchWikipedia(url) {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        return response;
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
        return data.content_urls.desktop.page;
    }
    static async getWikipediaPage(url) {
        console.log("Fetching Wikipedia page:", url);
        const response = await this.fetchWikipedia(url);
        return this.formatPage(await response.text());
    }
}