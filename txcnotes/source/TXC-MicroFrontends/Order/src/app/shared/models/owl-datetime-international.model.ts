import { OwlDateTimeIntl } from '@danielmoncada/angular-datetime-picker';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class OwlDateTimeDefaultModel extends OwlDateTimeIntl {
    override cancelBtnLabel = 'Cancel';
    override setBtnLabel = 'Set';
    override hour12AMLabel = 'AM';
    override hour12PMLabel = 'PM';
}