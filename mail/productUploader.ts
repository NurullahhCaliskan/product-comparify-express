import getMailTemplate, {getProductSeparator, getProductTemplate} from "./mailTemplate";

export default class ProductUploader {

    /***
     * get mail template as string
     * @param productList product List
     * @return {string|*}
     */
    getMailResult(productList: [{ website: string, url: string, newValue: string, oldValue: string, priceChangeRate: string, productTitle: string, src: string }]) {
        let productHtml = "";

        for (const product of productList) {
            productHtml += getProductTemplate(product.src, product.oldValue.toString(), product.newValue, product.priceChangeRate, product.url, product.productTitle);
            productHtml += getProductSeparator();
        }

        let mailTemplate = getMailTemplate();

        mailTemplate = mailTemplate.replace(":productList", productHtml);

        return mailTemplate;
    }
}
