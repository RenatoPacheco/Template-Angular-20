import { Pipe, PipeTransform } from "@angular/core";
import { StringUtils } from "../utils";

@Pipe({
    name: 'decodeHtml',
    standalone: true
})
export class DecodeHtmlPipe implements PipeTransform {

  transform(value: string): string {
    return StringUtils.htmlDecode(value);
  }

}
