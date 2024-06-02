const puppeteer = require("puppeteer");
require("dotenv").config();

const cat_amazon = async (req, res) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
   // Vérifier si le mot-clé et le nombre de pages sont fournis
   if (!req.query['keyword']) {
    return res.status(400).json({ error: 'Le paramètre mot-cle est requis.' });
}
if (!req.query['pages'] || isNaN(parseInt(req.query['nombre-pages']))) {
    return res.status(400).json({ error: 'Le paramètre nombre-pages est requis et doit être un nombre valide.' });
}

const keyword = req.query['keyword'];
const pagesToScrape = parseInt(req.query['pages']);
try {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    let allData = [];

    for (let i = 0; i < pagesToScrape; i++) {
        // Construire l'URL avec pagination
        let url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}&page=${i + 1}`;
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Accepter les cookies si nécessaire
        const cookiesButton = await page.$('#sp-cc-accept');
        if (cookiesButton) {
            await cookiesButton.click();
        }

        const data = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('.s-result-item'));
            return items.map(item => {
                const title = item.querySelector('h2 .a-link-normal') ? item.querySelector('h2 .a-link-normal').innerText : null;
                const price = item.querySelector('.a-price .a-offscreen') ? item.querySelector('.a-price .a-offscreen').innerText : null;
                const url = item.querySelector('h2 .a-link-normal') ? item.querySelector('h2 .a-link-normal').href : null;
                return { title, price, url };
            });
        });

        allData = allData.concat(data);

        // Vérifier s'il y a un lien pour la page suivante, sinon sortir de la boucle
        const nextPageExists = await page.$('a.s-pagination-item.s-pagination-next');
        if (!nextPageExists && i < pagesToScrape - 1) {
            console.log("Reached the last available page before reaching the requested number of pages.");
            break;
        }
    }

    await browser.close();

    // Envoyer les données en réponse HTTP
    res.json(allData);
} catch (error) {
    console.error('Error running scrape:', error);
    res.status(500).json({ error: 'Erreur lors de l’exécution du scraping.' });
}
};

module.exports = { cat_amazon };
