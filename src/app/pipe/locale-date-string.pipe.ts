import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localeDateString'
})
export class LocaleDateStringPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    return  new Date(Number(value)).toLocaleDateString('en-GB');
  }

}
