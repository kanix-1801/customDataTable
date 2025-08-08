import { LightningElement , api  , track} from 'lwc';

export default class SummaryRepeater extends LightningElement {

    // reagrding the calculation and user input things. 
    @track rows = [
        {
            id: 1,
            SField: '',
            operation: '',
            Coulmn_Name: ''
        }
    ];

    summaryTypeOptions = [
        { label: 'SUM', value: 'sum' },
        { label: 'AVG', value: 'avg' },
        { label: 'MIN', value: 'min' },
        { label: 'MAX', value: 'max' },
        { label: 'COUNT', value: 'count' }
    ];


    addRow() {
        this.rowId++;
        this.rows = [
            ...this.rows,
            {
                id: this.rowId,
                fField: '',
                operator: '',
                sField: '',
                Coulmn_Name: '',
            }
        ];
    }

    removeRow() {
        if (this.rows.length > 1) {
            this.rows = this.rows.slice(0, -1);
        }
    }

    handleChange(event) {
        const index = event.target.dataset.index;
        const fieldName = event.target.name;
        this.rows[index][fieldName] = event.target.value;
    }


    // Output #1: JSON string map for formulas
    @api
    get summaryJson() {
        const summaryMap = {};
        this.rows.forEach(row => {
            const {Coulmn_Name , SField , operation } = row;
            //  id: 1,
            // SField: '',
            // operation: '',
            // const { Coulmn_Name, fField, operator, sField } = row;
            if (SField && operation) {
                summaryMap[Coulmn_Name] = `${SField} ${operation}`;
            }
        });
        console.log('summaryMap',summaryMap);
        console.log('JSON summaryMap',JSON.stringify(summaryMap));
        return JSON.stringify(summaryMap);
    }


     @api
    get summaryMapJson() {
        const summaryJsonTemp = [];
        this.rows.forEach(row => {
            const {Coulmn_Name , SField , operation } = row;
            if (SField && operation) {
                const temp = `{ summaryField : "${SField}" , summaryType: "${operation}" , Coulmn_Name: "${Coulmn_Name}}`;
                summaryJsonTemp.push(temp);
            }
        });
        console.log('JSON summaryMap',JSON.stringify(summaryJsonTemp));
        return (summaryJsonTemp);
    }

    _rawFieldsListWithDetail;
    _picklistOptionsOnlyNumberFiels = [];
    _rawfieldsList;
    _fieldsListWithDetail = [];
    _objectName;

    @api
    set fieldsListWithDetail(value) {
        if (value && Array.isArray(value)) {
            this._rawFieldsListWithDetail = value;
            console.log('SummaryRepeater :  this._rawFieldsListWithDetail ',JSON.stringify( this._rawFieldsListWithDetail ));

            this._picklistOptionsOnlyNumberFiels = value
            .filter(item => 
                ["number", "currency", "percent", "double"].includes(item.type.toLowerCase())
            )
            .map((item) => {
                    return {
                    label: item.label,
                    value: item.name
                }
                
            });
            console.log('SummaryRepeater : Processed Picklist Options: ', this._picklistOptionsOnlyNumberFiels);
            console.log('SummaryRepeater : Processed Picklist Options: ', JSON.stringify(this._picklistOptionsOnlyNumberFiels));
        }
    }

    get fieldsListWithDetail() {
        console.log('SummaryRepeater : ');
        return this._fieldsListWithDetail;
    }


    @api
    set fieldList(value){
        console.log('SummaryRepeater : fieldList ',value);
        // if (value) {
            this._rawfieldsList = value;
            console.log("SummaryRepeater : inside the fieldList setter ");

            console.log('SummaryRepeater :  this._rawFieldsListWithDetail ',JSON.stringify( this._rawFieldsListWithDetail ));

            const fieldsArray = value.split(',').map(f => f.trim());

            console.log('SummaryRepeater :  fieldsArray ',JSON.stringify( fieldsArray ));
            console.log('SummaryRepeater :  fieldsArray ' , fieldsArray );
            this._picklistOptionsOnlyNumberFiels.forEach(
                item => {
                    if(fieldsArray.includes(item.value)){
                        this._fieldsListWithDetail.push(item);
                }});
        // } 
        console.log('SummaryRepeater : this._fieldsListWithDetail which i am going to use in the pickList : ' ,JSON.stringify(this._fieldsListWithDetail));
    }
    get fieldList(){
        return this._fieldList;
    }

    @api
    set objectName(value){
        this._objectName = value;
    }
    get objectName(){
        return this._objectName;
    }
}