import { Component, ViewChild, Input } from '@angular/core';
import { Table } from 'primeng/table';
import { EdaTable } from './eda-table';
import { FilterUtils } from 'primeng/api';
import * as _ from 'lodash';

@Component({
    selector: 'eda-table',
    templateUrl: './eda-table.component.html'
})
export class EdaTableComponent {
    @ViewChild('table', {static: false}) table: Table;

    @Input() inject: EdaTable;

    public lodash: any = _;

    constructor() { }

    _tableFilter(table: Table, value: any, col: any) {
        if (_.isNil(FilterUtils['between'])) {
            FilterUtils['between'] = (value: any, filter: any): boolean => {
                if (_.isNil(filter) || (filter[0] === 0 && filter[1] === 0)) {
                    return true;
                }
                if (_.isNil(value) || value === '') {
                    return false;
                }
                return value >= filter[0] && value <= filter[1];
            };
        }
        return table.filter(value, col.field, col.filter.comparationMethod);
    }

    verifyFilter() {
        return _.find(this.inject.cols, 'filter') && this.inject.value && this.inject.value.length > 0;
    }

}