import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { AlertService, DataSourceService } from '@eda_services/service.index';
import { EditTablePanel, EditColumnPanel, EditModelPanel } from '@eda_models/data-source-model/data-source-models';
import { EdaDialogController, EdaDialogCloseEvent } from '@eda_shared/components/shared-components.index';
import * as _ from 'lodash';

@Component({
    selector: 'app-data-source-detail',
    templateUrl: './data-source-detail.component.html',
    styleUrls: []
})
export class DataSourceDetailComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    public navigationSubscription: any;
    // Properties
    public tablePanel: EditTablePanel;
    public columnPanel: EditColumnPanel;
    public modelPanel: EditModelPanel;
    public typePanel: string;
    public relationController: EdaDialogController;

    // Types
    public columnTypes: SelectItem[] = [
        { label: 'text', value: 'text' },
        { label: 'numeric', value: 'numeric' },
        { label: 'date', value: 'date' }
    ];
    public selectedcolumnType: any;
    public tableTypes: SelectItem[] = [{ label: 'dimension', value: 'dimension' }, { label: 'fact', value: 'fact' }];
    public selectedTableType: string;

    // Aggregation Types
    public selectedAggType: any;
    public aggTypes: SelectItem[] = [
        { label: 'sum', value: 'sum' },
        { label: 'avg', value: 'avg' },
        { label: 'max', value: 'max' },
        { label: 'min', value: 'min' },
        { label: 'count', value: 'count' },
        { label: 'count distinct', value: 'count_distinct' }
    ];

    // Relations
    public tmpRelations: any = [];

    // DB types[]
    public tiposBD: SelectItem[] = [{ label: 'postgres', value: 'postgres' }, { label: 'mySQL', value: 'mySQL' }];
    public selectedTipoBD: SelectItem;

    constructor(public dataModelService: DataSourceService,
                private alertService: AlertService,
                private router: Router) {
        //
        this.navigationSubscription = this.router.events.subscribe(
            (res: any) => {
                if (res instanceof NavigationEnd) {
                    this.tablePanel = new EditTablePanel();
                    this.modelPanel = new EditModelPanel();
                    this.columnPanel = new EditColumnPanel();
                }
            }, err => {
                this.alertService.addError(err);
            }
        );
    }

    ngOnInit() {
        this.carregarPanels();
    }

    ngOnDestroy(): void {
        this.typePanel = '';
        this.dataModelService.ngOnDestroy();
        this.navigationSubscription.unsubscribe();
        this.navigationSubscription.complete();
    }

    carregarPanels() {
        this.dataModelService.currentTablePanel.subscribe(
            tablePanel => {
                this.tablePanel = tablePanel;
                this.tmpRelations = tablePanel.relations.filter(r => r.visible === true);
                this.selectedTableType = tablePanel.table_type;
            }, err => {
                this.alertService.addError(err);
            }
        );

        this.dataModelService.currentColumnPanel.subscribe(
            columnPanel => {
                this.columnPanel = columnPanel;
                this.selectedcolumnType = this.columnPanel.column_type;
                this.selectedAggType = this.columnPanel.aggregation_type;
            }, err => {
                this.alertService.addError(err);
            }
        );

        this.dataModelService.currentTypePanel.subscribe(
            typePanel => {
                this.typePanel = typePanel;
            }, err => this.alertService.addError(err)
        );

        this.dataModelService.currentModelPanel.subscribe(
            modelPanel => {
                this.modelPanel = modelPanel;
                this.selectedTipoBD = { label: modelPanel.connection.type, value: modelPanel.connection.type };
            }, err => this.alertService.addError(err)
        );
    }

    update() {
        switch (this.typePanel) {
            case 'tabla': this.updateTable(); break;
            case 'columna': this.updateColumn(); break;
            case 'root': this.updateModel(); break;
        }
    }

    updateModel() {
        if (this.modelPanel.type) {
            this.dataModelService.changeModel(this.modelPanel);
        }
    }

    updateTable() {
        if (this.tablePanel.technical_name) {
            this.dataModelService.changeTablePanel(this.tablePanel);
        }
    }

    updateColumn() {
        if (this.columnPanel.technical_name) {
            this.dataModelService.changeColumnPanel(this.columnPanel);
        }
    }

    toggle_table(visible: boolean) {
        this.tablePanel.visible = visible ? false : true;
        this.update();
    }

    toggle_column(visible: boolean) {
        this.columnPanel.visible = visible ? false : true;
        this.update();
    }

    updateColumnType() {
        this.columnPanel.column_type = this.selectedcolumnType;
        this.update();
    }

    updateTableType() {
        this.tablePanel.table_type = this.selectedTableType;
        this.update();
    }

    updateAgg() {
        this.columnPanel.aggregation_type = this.selectedAggType;
        this.update();
    }

    setDbType() {
        this.modelPanel.connection.type = this.selectedTipoBD.label;
        this.update();
    }

    deleteRelation(relation) {
        this.dataModelService.deleteRelation(relation);
    }

    openTableRelationDialog() {
        this.relationController = new EdaDialogController({
            params: {table: this.tablePanel},
            close: (event, response) => {

                if ( !_.isEqual(event, EdaDialogCloseEvent.NONE) ) {
                    this.dataModelService.addRelation(response);
                }

                this.relationController = undefined;
            }
        });
    }
}

