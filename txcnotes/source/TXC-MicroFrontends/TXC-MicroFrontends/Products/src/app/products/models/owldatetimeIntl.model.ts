import { OwlDateTimeIntl } from 'ng-pick-datetime';

export class DefaultIntl extends OwlDateTimeIntl {
    override cancelBtnLabel = 'Cancel';
    override setBtnLabel = 'Apply';
    override hour12AMLabel = 'AM';
    override hour12PMLabel = 'PM';
}