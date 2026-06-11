import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextEditorService {

  readonly PATTERN = {
    LI: /<li[^>]*>([\s\S]*?)<\/li>/g,
    LINK: /<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g,
    TAGS: /<[^>]+>/g,
    SPACES: / +(?= )/g,
    EXTRA_SPACE: /&#160;/g,
    LINEBREAK: "\n",
    BULLET: "● ",
    DOT: ". ",
    DIV: /<div>/g,
    RIGHT_ARROW_HTML: "&(rarr);",
    RIGHT_ARROW: "→",
    NBSP: "&(nbsp);",
  }
  constructor() { }

  convertHtmlToPlainText(html: string) {
    if (!html)
      return "";

    let plainText = html;
    // Replace <li> with bullet points
    plainText = plainText.replace(this.PATTERN.LI, (_: any, li: string) => {
      return `${this.PATTERN.BULLET}${li.trimStart()}`;
    });

    // Replace <a> with link
    plainText = plainText.replace(this.PATTERN.LINK, (_, href, text) => {
      return text;
    });

    // Replace <div> with line break
    plainText = plainText.replace(this.PATTERN.DIV, this.PATTERN.LINEBREAK);
    // Remove all HTML tags
    plainText = plainText.replace(this.PATTERN.TAGS, "");

    // remove extra spaces
    plainText = plainText.trim().replace(this.PATTERN.SPACES, "");

    //remove code generated from extra space
    plainText = plainText.trim().replace(this.PATTERN.EXTRA_SPACE, String.fromCharCode(160));

    // replace right arrow
    plainText = plainText.replace(this.PATTERN.RIGHT_ARROW_HTML, this.PATTERN.RIGHT_ARROW);

    // replace nbsp
    plainText = plainText.replace(this.PATTERN.NBSP, " ");

    // trim each line
    plainText = plainText.split(this.PATTERN.LINEBREAK)
      .map(line => line.trim())
      .join(this.PATTERN.LINEBREAK);
    return plainText;
  }


}
