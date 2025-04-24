import axios from "axios";
import * as cheerio from 'cheerio';


const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/110.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
];

function getRandomUserAgent() {
    return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function getHeaders() {
    return {
        'User-Agent': getRandomUserAgent(),
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    };
}

const BASE_DELAY_MS = 1500;
const RANDOM_DELAY_MS = 1000;


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function performRequestWithDelay(url) {
    const waitMs = BASE_DELAY_MS + Math.floor(Math.random() * RANDOM_DELAY_MS);
    console.log(`Waiting for ${waitMs} ms before request to ${url}`);
    await delay(waitMs);
    return axios.get(url, { headers: getHeaders(), timeout: 15000 }); // Increased timeout
}
export const getAmazonProductData = async (uid, url) => {
    try {
        const response = await performRequestWithDelay(url);
        const $ = cheerio.load(response.data);
    
        const title = $('#productTitle').text().trim() || 'N/A';
    
        let price = 'N/A';
        const priceWhole = $('.a-price-whole').first().text().trim();
        const priceFraction = $('.a-price-fraction').first().text().trim();
        const priceSymbol = $('.a-price-symbol').first().text().trim();
        if (priceWhole) {
          price = `${priceSymbol}${priceWhole}${priceFraction}`;
        } else {
          const offscreenPrice = $('.a-offscreen').first().text().trim();
          if (offscreenPrice) {
            price = offscreenPrice;
          }
        }
    
        let warrantyInfo = "No warranty info available";
        let warrantyElement = $('#WARRANTY').first();
        if (!warrantyElement.length) {
          warrantyElement = $('#supportAndWarranty').first();
        }
    
        if (warrantyElement.length) {
          const possibleTexts = warrantyElement.find('*').map((i, el) => $(el).text().trim()).get();
          for (const text of possibleTexts) {
            if (/warranty/i.test(text)) {
              warrantyInfo = text;
              break;
            }
          }
    
          if (warrantyInfo === "No warranty info available") {
            const generalText = warrantyElement.text().replace(/\s+/g, ' ').trim();
            if (generalText.length && generalText.length < 300) {
              warrantyInfo = generalText;
            }
          }
        }
    
        const productDetails = {};
        let detailsTable = $('#productDetails_detailBullets_sections1').first();
        if (!detailsTable.length) {
          detailsTable = $('#productDetails_techSpec_section_1').first();
        }
    
        if (detailsTable.length) {
          detailsTable.find('tr').each((i, el) => {
            const key = $(el).find('th').text().trim();
            const value = $(el).find('td').text().trim();
            if (key && value) {
              const cleanValue = value.replace(/\\u[\dA-F]{4}/gi, '');
              productDetails[key] = cleanValue;
            }
          });
        }
    
        let customerReviews = "N/A";
        const ratingText = $('#acrPopover').attr('title')?.trim();
        const reviewCountText = $('#acrCustomerReviewText').text().trim();
        if (ratingText) {
          customerReviews = `${ratingText} (${reviewCountText || 'count unavailable'})`;
        } else if (reviewCountText) {
          customerReviews = reviewCountText;
        }
    
        let bestSellersRank = "N/A";
        const ranks = [];
        $('li:contains("Best Sellers Rank"), li:contains("Best Sellers Rank:")').each((i, el) => {
          const fullText = $(el).text().replace(/\s+/g, ' ').trim();
          const rankMatch = fullText.match(/#([\d,]+)\s+in\s+([^(\n]+)/);
          if (rankMatch) {
            ranks.push(rankMatch[0].replace('in ', 'in ').trim());
          } else if (fullText.toLowerCase().includes('best sellers rank')) {
            ranks.push(fullText.replace(/Best Sellers Rank:?/i, '').trim());
          }
        });
        if (ranks.length > 0) {
          bestSellersRank = ranks.slice(0, 3).join(' | ');
        }
    
        return {
          Title: title,
          Price: price,
          Warranty: warrantyInfo,
          ASIN: productDetails['ASIN'] || 'N/A',
          CustomerReviews: customerReviews,
          BestSellersRank: bestSellersRank,
          DateFirstAvailable: productDetails['Date First Available'] || 'N/A',
          Manufacturer: productDetails['Manufacturer'] || 'N/A',
          Packer: productDetails['Packer'] || 'N/A',
          Importer: productDetails['Importer'] || 'N/A',
          ItemDimensionsLxWxH: productDetails['Item Dimensions LxWxH'] || productDetails['Product Dimensions'] || 'N/A',
          NetQuantity: productDetails['Net Quantity'] || 'N/A',
          IncludedComponents: productDetails['Included Components'] || 'N/A',
          GenericName: productDetails['Generic Name'] || 'N/A',
        };
    
      } catch (error) {
        console.error(`Error scraping Amazon URL ${url}:`, error.message);
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          let errorType = "Network/Request Error";
          if (status === 404) errorType = "Product Not Found (404)";
          else if (status === 403) errorType = "Forbidden (Blocked/CAPTCHA)";
          else if (status === 503 || status === 429) errorType = "Rate Limited/Server Busy";
          else if (status) errorType = `HTTP Error ${status}`;
          return { Error: errorType, Details: error.message, Url: url };
        } else {
          return { Error: "Parsing Error", Details: error.message, Url: url };
        }
      }
};
