import { Pipe, PipeTransform } from '@angular/core';
import { ReverseLimit } from '../models/reverselimit.model';

@Pipe({ name: 'reverselimitpipe' })
export class ReverseLimitPipe implements PipeTransform {
    transform(key: number, reverseLimitEntries: ReverseLimit[]): string {
        const limitData = reverseLimitEntries.find(reverselimit => reverselimit.reverseLimitId == key);
        return limitData?.name ?? '--';
    }
}