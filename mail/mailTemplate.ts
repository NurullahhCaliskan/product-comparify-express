export function getProductTemplate(src: string, oldPrice: string, newPrice: string, priceChangeRate: string, url: string, title:string, currency:string) {
    let template = " <table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" classname=\"row row-6\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-position: center top;\" width=\"100%\"> " +
        "                <tbody> " +
        "                <tr> " +
        "                    <td> " +
        "                        <table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" classname=\"row-content stack\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #30304c; color: #000000; width: 680px;\" width=\"680\"> " +
        "                            <tbody> " +
        "                            <tr> " +
        "                                <td classname=\"column column-1\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; background-color: #30304c; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;\" width=\"25%\"> " +
        "                                    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" classname=\"image_block\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\" width=\"100%\"> " +
        "                                        <tbody> " +
        "                                        <tr> " +
        "                                            <td style=\"width:100%;padding-right:0px;padding-left:0px;padding-top:25px;padding-bottom:25px;\"> " +
        "                                                <div align=\"center\" style=\"line-height:10px\"><img classname=\"fullMobileWidth big\" src=\" :src \" style=\"display: block; height: auto; border: 0; width: 136px; max-width: 100%; border-radius: 15px;\" width=\"136\"></div> " +
        "                                            </td> " +
        "                                        </tr> " +
        "                                        </tbody> " +
        "                                    </table> " +
        "                                </td> " +
        "                                <td classname=\"column column-2\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;\" width=\"41.666666666666664%\"> " +
        "                                    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" classname=\"heading_block\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\" width=\"100%\"> " +
        "                                        <tbody> " +
        "                                        <tr> " +
        "                                            <td style=\"padding-bottom:10px;padding-left:15px;padding-right:10px;text-align:center;width:100%;padding-top:35px;\"> " +
        "                                                <h1 style=\"margin: 0; color: #ffffff; direction: ltr; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 400; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;\"><strong>Product: :title</strong></h1> " +
        "                                            </td> " +
        "                                        </tr> " +
        "                                        </tbody> " +
        "                                    </table> " +
        "                                    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" classname=\"text_block\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;\" width=\"100%\"> " +
        "                                        <tbody> " +
        "                                        <tr> " +
        "                                            <td style=\"padding-bottom:15px;padding-left:15px;padding-right:10px;padding-top:10px;\"> " +
        "                                                <div style=\"font-family: sans-serif\"> " +
        "                                                    <div classname=\"txtTinyMce-wrapper\" style=\"font-size: 14px; mso-line-height-alt: 21px; color: #ffffff; line-height: 1.5; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;\"> " +
        "                                                        <p style=\"margin: 0; font-size: 14px; text-align: left;\">Old Price: :oldPrice</p> " +
        "                                                        <p style=\"margin: 0; font-size: 14px; text-align: left;\">New Price: :newPrice</p> " +
        "                                                        <p style=\"margin: 0; font-size: 14px; text-align: left;\">Price Change Rate: %:priceChangeRate</p> " +
        "                                                    </div> " +
        "                                                </div> " +
        "                                            </td> " +
        "                                        </tr> " +
        "                                        </tbody> " +
        "                                    </table> " +
        "                                </td> " +
        "                                 <td classname=\"column column-3\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;\" width=\"33.333333333333336%\"> " +
        "                                    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" classname=\"button_block\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\" width=\"100%\"> " +
        "                                        <tbody> " +
        "                                        <tr> " +
        "                                            <td style=\"padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:65px;text-align:left;\"> " +
        "                                                <!--[if mso]> " +
        "                                                <v:roundrect xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:w=\"urn:schemas-microsoft-com:office:word\" href=\"www.example.com\" style=\"height:44px;width:176px;v-text-anchor:middle;\" arcsize=\"10%\" strokeweight=\"0.75pt\" strokecolor=\"#0057B7\" fillcolor=\"#0057b7\"> " +
        "                                                    <w:anchorlock/> " +
        "                                                    <v:textbox inset=\"0px,0px,0px,0px\"> " +
        "                                                        <center style=\"color:#ffffff; font-family:Arial, sans-serif; font-size:16px\"><![endif]--><a href=\":url\" style=\"text-decoration:none;display:inline-block;color:#ffffff;background-color: #6667ab;border-radius:4px;width:auto;border-top: 1px solid #6667ab;font-weight:400;border-right: 1px solid #6667ab;border-bottom: 1px solid #6667ab;border-left: 1px solid #6667ab;padding-top:5px;padding-bottom:5px;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;\" target=\"_blank\"><span style=\"padding-left:40px;padding-right:40px;font-size:16px;display:inline-block;letter-spacing:normal;\"><span style=\"font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;\">Go To Product</span></span></a> " +
        "                                                <!--[if mso]></center></v:textbox></v:roundrect><![endif]--> " +
        "                                            </td> " +
        "                                        </tr> " +
        "                                        </tbody> " +
        "                                    </table> " +
        "                                </td>  " +
        "                            </tr> " +
        "                            </tbody> " +
        "                        </table> " +
        "                    </td> " +
        "                </tr> " +
        "                </tbody> " +
        "            </table> ";

    let oldPriceWithCurrency = oldPrice;
    let newPriceWithCurrency = newPrice;

    try{
        oldPriceWithCurrency = new Intl.NumberFormat('de-DE', { style: 'currency', currency: currency }).format(Number(oldPrice))
        newPriceWithCurrency = new Intl.NumberFormat('de-DE', { style: 'currency', currency: currency }).format(Number(newPrice))
    }catch (e) {

    }


    template = template.replace(":src", src)
    template = template.replace(":oldPrice", oldPriceWithCurrency)
    template = template.replace(":newPrice", newPriceWithCurrency)
    template = template.replace(":priceChangeRate", priceChangeRate)
    template = template.replace(":url", url)
    template = template.replace(":title", title)

    return template
}


export function getProductSeparator() {
    return "<table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" classname=\"row row-7\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\" width=\"100%\"> " +
        "                <tbody> " +
        "                <tr> " +
        "                    <td> " +
        "                        <table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" classname=\"row-content stack\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;\" width=\"680\"> " +
        "                            <tbody> " +
        "                            <tr> " +
        "                                <td classname=\"column column-1\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;\" width=\"100%\"> " +
        "                                    <div classname=\"spacer_block\" style=\"height:10px;line-height:10px;font-size:1px;\">&nbsp;</div> " +
        "                                </td> " +
        "                            </tr> " +
        "                            </tbody> " +
        "                        </table> " +
        "                    </td> " +
        "                </tr> " +
        "                </tbody> " +
        "            </table>"
}

export default function getMailTemplate() {
    return "<html> " +
        "<head> " +
        "    <style type=\"text/css\"> " +
        "        @font-face { " +
        "            font-weight: 400; " +
        "            font-style: normal; " +
        "            font-family: 'Circular-Loom'; " +
        " " +
        "            src: url('https://cdn.loom.com/assets/fonts/circular/CircularXXWeb-Book-cd7d2bcec649b1243839a15d5eb8f0a3.woff2') format('woff2'); " +
        "        } " +
        " " +
        "        @font-face { " +
        "            font-weight: 500; " +
        "            font-style: normal; " +
        "            font-family: 'Circular-Loom'; " +
        " " +
        "            src: url('https://cdn.loom.com/assets/fonts/circular/CircularXXWeb-Medium-d74eac43c78bd5852478998ce63dceb3.woff2') format('woff2'); " +
        "        } " +
        " " +
        "        @font-face { " +
        "            font-weight: 700; " +
        "            font-style: normal; " +
        "            font-family: 'Circular-Loom'; " +
        " " +
        "            src: url('https://cdn.loom.com/assets/fonts/circular/CircularXXWeb-Bold-83b8ceaf77f49c7cffa44107561909e4.woff2') format('woff2'); " +
        "        } " +
        " " +
        "        @font-face { " +
        "            font-weight: 900; " +
        "            font-style: normal; " +
        "            font-family: 'Circular-Loom'; " +
        " " +
        "            src: url('https://cdn.loom.com/assets/fonts/circular/CircularXXWeb-Black-bf067ecb8aa777ceb6df7d72226febca.woff2') format('woff2'); " +
        "        }</style> " +
        "    <style type=\"text/css\"> " +
        "        @font-face { " +
        "            font-weight: 400; " +
        "            font-style: normal; " +
        "            font-family: 'Circular-Loom'; " +
        " " +
        "            src: url('https://cdn.loom.com/assets/fonts/circular/CircularXXWeb-Book-cd7d2bcec649b1243839a15d5eb8f0a3.woff2') format('woff2'); " +
        "        } " +
        " " +
        "        @font-face { " +
        "            font-weight: 500; " +
        "            font-style: normal; " +
        "            font-family: 'Circular-Loom'; " +
        " " +
        "            src: url('https://cdn.loom.com/assets/fonts/circular/CircularXXWeb-Medium-d74eac43c78bd5852478998ce63dceb3.woff2') format('woff2'); " +
        "        } " +
        " " +
        "        @font-face { " +
        "            font-weight: 700; " +
        "            font-style: normal; " +
        "            font-family: 'Circular-Loom'; " +
        " " +
        "            src: url('https://cdn.loom.com/assets/fonts/circular/CircularXXWeb-Bold-83b8ceaf77f49c7cffa44107561909e4.woff2') format('woff2'); " +
        "        } " +
        " " +
        "        @font-face { " +
        "            font-weight: 900; " +
        "            font-style: normal; " +
        "            font-family: 'Circular-Loom'; " +
        " " +
        "            src: url('https://cdn.loom.com/assets/fonts/circular/CircularXXWeb-Black-bf067ecb8aa777ceb6df7d72226febca.woff2') format('woff2'); " +
        "        }</style> " +
        "    <style type=\"text/css\"> " +
        "        @font-face { " +
        "            font-weight: 400; " +
        "            font-style: normal; " +
        "            font-family: 'Circular-Loom'; " +
        " " +
        "            src: url('https://cdn.loom.com/assets/fonts/circular/CircularXXWeb-Book-cd7d2bcec649b1243839a15d5eb8f0a3.woff2') format('woff2'); " +
        "        } " +
        " " +
        "        @font-face { " +
        "            font-weight: 500; " +
        "            font-style: normal; " +
        "            font-family: 'Circular-Loom'; " +
        " " +
        "            src: url('https://cdn.loom.com/assets/fonts/circular/CircularXXWeb-Medium-d74eac43c78bd5852478998ce63dceb3.woff2') format('woff2'); " +
        "        } " +
        " " +
        "        @font-face { " +
        "            font-weight: 700; " +
        "            font-style: normal; " +
        "            font-family: 'Circular-Loom'; " +
        " " +
        "            src: url('https://cdn.loom.com/assets/fonts/circular/CircularXXWeb-Bold-83b8ceaf77f49c7cffa44107561909e4.woff2') format('woff2'); " +
        "        } " +
        " " +
        "        @font-face { " +
        "            font-weight: 900; " +
        "            font-style: normal; " +
        "            font-family: 'Circular-Loom'; " +
        " " +
        "            src: url('https://cdn.loom.com/assets/fonts/circular/CircularXXWeb-Black-bf067ecb8aa777ceb6df7d72226febca.woff2') format('woff2'); " +
        "        }</style> " +
        "</head> " +
        "<body style=\"background-color: #141414; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;\"> " +
        "<table border=\"0\" cellPadding=\"0\" cellSpacing=\"0\" className=\"nl-container\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #181824;\" width=\"100%\"> " +
        "    <tbody> " +
        "    <tr> " +
        "        <td> " +
        " " +
        "            <table align=\"center\" border=\"0\" cellPadding=\"0\" cellSpacing=\"0\" className=\"row row-2\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\" width=\"100%\"> " +
        "                <tbody> " +
        "                <tr> " +
        "                    <td> " +
        "                        <table align=\"center\" border=\"0\" cellPadding=\"0\" cellSpacing=\"0\" className=\"row-content stack\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;\" width=\"680\"> " +
        "                            <tbody> " +
        "                            <tr> " +
        "                                <td className=\"column column-1\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;\" width=\"100%\"> " +
        "                                    <div className=\"spacer_block\" style=\"height:60px;line-height:60px;font-size:1px;\">&nbsp;</div> " +
        "                                </td> " +
        "                            </tr> " +
        "                            </tbody> " +
        "                        </table> " +
        "                    </td> " +
        "                </tr> " +
        "                </tbody> " +
        "            </table> " +
        " " +
        "            <table align=\"center\" border=\"0\" cellPadding=\"0\" cellSpacing=\"0\" className=\"row row-4\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\" width=\"100%\"> " +
        "                <tbody> " +
        "                <tr> " +
        "                    <td> " +
        "                        <table align=\"center\" border=\"0\" cellPadding=\"0\" cellSpacing=\"0\" className=\"row-content stack\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;\" width=\"680\"> " +
        "                            <tbody> " +
        "                            <tr> " +
        "                                <td className=\"column column-1\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;\" width=\"100%\"> " +
        "                                    <table border=\"0\" cellPadding=\"0\" cellSpacing=\"0\" className=\"heading_block\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\" width=\"100%\"> " +
        "                                        <tbody> " +
        "                                        <tr> " +
        "                                            <td style=\"padding-bottom:10px;padding-left:10px;padding-right:10px;text-align:center;width:100%;padding-top:50px;\"> " +
        "                                                <h1 style=\"margin: 0; color: #ffd700; direction: ltr; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 400; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;\"><span className=\"tinyMce-placeholder\">Product Alert List</span></h1> " +
        "                                            </td> " +
        "                                        </tr> " +
        "                                        </tbody> " +
        "                                    </table> " +
        "                                    <table border=\"0\" cellPadding=\"0\" cellSpacing=\"0\" className=\"heading_block\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\" width=\"100%\"> " +
        "                                        <tbody> " +
        "                                        <tr> " +
        "                                            <td style=\"padding-bottom:5px;padding-left:10px;padding-right:10px;text-align:center;width:100%;\"> " +
        "                                                <h1 style=\"margin: 0; color: #ffffff; direction: ltr; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 34px; font-weight: 400; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;\"><strong>We have listed the price change of the products you follow</strong></h1> " +
        "                                            </td> " +
        "                                        </tr> " +
        "                                        </tbody> " +
        "                                    </table> " +
        "                                </td> " +
        "                            </tr> " +
        "                            </tbody> " +
        "                        </table> " +
        "                    </td> " +
        "                </tr> " +
        "                </tbody> " +
        "            </table> " +
        "            <table align=\"center\" border=\"0\" cellPadding=\"0\" cellSpacing=\"0\" className=\"row row-5\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\" width=\"100%\"> " +
        "                <tbody> " +
        "                <tr> " +
        "                    <td> " +
        "                        <table align=\"center\" border=\"0\" cellPadding=\"0\" cellSpacing=\"0\" className=\"row-content stack\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;\" width=\"680\"> " +
        "                            <tbody> " +
        "                            <tr> " +
        "                                <td className=\"column column-1\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;\" width=\"100%\"> " +
        "                                    <div className=\"spacer_block\" style=\"height:30px;line-height:30px;font-size:1px;\">&nbsp;</div> " +
        "                                </td> " +
        "                            </tr> " +
        "                            </tbody> " +
        "                        </table> " +
        "                    </td> " +
        "                </tr> " +
        "                </tbody> " +
        "            </table> " +
        "           :productList " +
        " " +
        " " +
        "            <table align=\"center\" border=\"0\" cellPadding=\"0\" cellSpacing=\"0\" className=\"row row-12\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\" width=\"100%\"> " +
        "                <tbody> " +
        "                <tr> " +
        "                    <td> " +
        "                        <table align=\"center\" border=\"0\" cellPadding=\"0\" cellSpacing=\"0\" className=\"row-content stack\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;\" width=\"680\"> " +
        "                            <tbody> " +
        "                            <tr> " +
        "                                <td className=\"column column-1\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;\" width=\"100%\"> " +
        "                                    <div className=\"spacer_block\" style=\"height:60px;line-height:60px;font-size:1px;\">&nbsp;</div> " +
        "                                </td> " +
        "                            </tr> " +
        "                            </tbody> " +
        "                        </table> " +
        "                    </td> " +
        "                </tr> " +
        "                </tbody> " +
        "            </table> " +
        " " +
        " " +
        "        </td> " +
        "    </tr> " +
        "    </tbody> " +
        "</table> " +
        " " +
        " " +
        "</body> " +
        "</html> ";
}

