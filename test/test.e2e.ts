import * as fs from 'fs';
import AdventHealth from '../pages/page.ts';

const url = process.env.URL!;

describe('AdventHealth', () => {
    const doctors: Array<IDoc> = [];

    before(async () => {
        console.log('Accessing AdventHealth.com');
        await browser.url(url);
    });

    it('Should display doctors', async () => {
        const PAGE = new AdventHealth();
        const physicians = await $$(PAGE.physiciansSearchBlockItem);

        let continueWhile = false;
        let iteration = 0;
        const MAX_PAGES = 10;

        do {
            for (let i = 1; i <= physicians.length; i++) {
                const doc = await PAGE.getInfo(i);
                doctors.push(doc)
            }

            const isNextPageButtonDisplayed = await $(PAGE.nextPageButton).isDisplayed();
            
            iteration++;
            continueWhile = (isNextPageButtonDisplayed && iteration < MAX_PAGES)

            if (continueWhile) await $(PAGE.nextPageButton).click();
        } while (continueWhile);
    })
    it('Should generate a CSV file', async () => {
        const csv = [
            [
                'name',
                'street',
                'city',
                'state',
                'zipCode',
                'telephone',
            ],
            ...doctors.map((d) => [
                d.name,
                d.street,
                d.city,
                d.state,
                d.zipCode,
                d.telephone
            ])
        ]
        .map(e => e.join(","))
        .join("\n");

        fs.writeFileSync('data.csv', csv, {encoding: 'utf-8'});
    })

});
