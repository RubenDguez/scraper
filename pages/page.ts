export default class AdventHealth {
    get nextPageButton() {
        return '//*[@title="Go to next page"]';
    }

    get physiciansSearchBlockItem() {
        return '//li[@class="physicians-search-block__item"]';
    }

    physiciansSearchBlockItemByIndex(index: number) {
        return `(${this.physiciansSearchBlockItem})[${index}]`
    }

    docName(index: number) {
        return `${this.physiciansSearchBlockItemByIndex(index)}//h3//a`
    }

    addressStreet(index: number, set: number = 1) {
        return `(${this.physiciansSearchBlockItemByIndex(index)}//*[@property="streetAddress"])[${set}]`
    }

    addressCity(index: number, set: number = 1) {
        return `(${this.physiciansSearchBlockItemByIndex(index)}//*[@property="addressLocality"])[${set}]`
    }

    addressState(index: number, set: number = 1) {
        return `(${this.physiciansSearchBlockItemByIndex(index)}//*[@property="addressRegion"])[${set}]`
    }

    postalCode(index: number, set: number = 1) {
        return `(${this.physiciansSearchBlockItemByIndex(index)}//*[@property="postalCode"])[${set}]`
    }

    telephone(index: number, set: number = 1) {
        return `(${this.physiciansSearchBlockItemByIndex(index)}//a[@class="telephone"])[${set}]`
    }

    async getName(i: number) {
        await $(this.docName(i)).waitForExist();
        const name = await $(this.docName(i)).getText()
        return name.replace(/,/g, ';');
    }

    /**
     * Get Address
     * @param {number} i
     * @return {Promise<string>}
     */
    async getAddress(i: number): Promise<string> {
        await $(this.addressStreet(i)).waitForExist();
        let addressSt = await $(this.addressStreet(i)).getText();
        if (!addressSt) {
            for (let s = 2; s <= 10; s++) {
                if (!await $(this.addressStreet(i, s)).isExisting()) continue

                addressSt = await $(this.addressStreet(i, s)).getText();

                if (addressSt) break;
            }
        }

        return addressSt.replace('\n', ', ').replace(/,/g, ';');
    }

    /**
     * Get City
     * @param {number} i 
     * @return {Promise<string>}
     */
    async getCity(i: number): Promise<string> {
        await $(this.addressCity(i)).waitForExist();
        let addressCty = await $(this.addressCity(i)).getText();
        if (!addressCty) {
            for (let s = 2; s <= 10; s++) {
                if (!await $(this.addressCity(i, s)).isExisting()) continue

                addressCty = await $(this.addressCity(i, s)).getText();

                if (addressCty) break;
            }
        }

        return addressCty.replace(/,/g, ';');
    }

    /**
     * Get State
     * @param {number} i
     * @return {Promise<boolean>}
     */
    async getState(i: number): Promise<string> {
        await $(this.addressState(i)).waitForExist();
        let addressSte = await $(this.addressState(i)).getText();
        if (!addressSte) {
            for (let s = 2; s <= 10; s++) {
                if (!await $(this.addressState(i, s)).isExisting()) continue

                addressSte = await $(this.addressState(i, s)).getText();

                if (addressSte) break;
            }
        }

        return addressSte.replace(/,/g, ';');
    }

    /**
     * Get Zip Code
     * @param {number} i
     * @return {Promise<string>}
     */
    async getZipCode(i: number): Promise<string> {
        await $(this.postalCode(i)).waitForExist();
        let zipCode = await $(this.postalCode(i)).getText();
        if (!zipCode) {
            for (let s = 2; s <= 10; s++) {
                if (!await $(this.postalCode(i, s)).isExisting()) continue

                zipCode = await $(this.postalCode(i, s)).getText();

                if (zipCode) break;
            }
        }

        return zipCode.replace(/,/g, ';');
    }

    /**
     * Get Telephone
     * @param {number} i
     * @return {Promise<string>}
     */
    async getTelephone(i: number): Promise<string> {
        await $(this.telephone(i)).waitForExist();
        let tel = await $(this.telephone(i)).getText();
        if (!tel) {
            for (let s = 2; s <= 10; s++) {
                if (!await $(this.telephone(i, s)).isExisting()) continue

                tel = await $(this.telephone(i, s)).getText();

                if (tel) break;
            }
        }

        return tel.split('\n')[1].replace(/,/g, ';');
    }

    /**
     * Get Info
     * @param {number} i 
     * @return {Promise<IDoc>}
     */
    async getInfo(i: number): Promise<IDoc> {
        await $(this.physiciansSearchBlockItemByIndex(i)).scrollIntoView({ block: 'center', behavior: 'smooth' });
        const name = await this.getName(i);
        const addressSt = await this.getAddress(i);
        const addressCty = await this.getCity(i);
        const addressSte = await this.getState(i);
        const zipCode = await this.getZipCode(i);
        const tel = await this.getTelephone(i);   

        return {
            name: name,
            street: addressSt,
            city: addressCty,
            state: addressSte,
            zipCode: zipCode,
            telephone: tel,
        }
    }
}
