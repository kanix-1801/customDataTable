import { LightningElement, track, wire } from 'lwc';
import getAccountData from '@salesforce/apex/AccountController.getAccountData';

export default class AccountDatatableParent extends LightningElement {
    @track tableData = [];
    columnFields2 = 'Name,Industry';
    columnFields = 'Name,Industry';
    keyField = 'Id';
    @track preSelectedRows = [];
    isRequired = true;
    columnLabels = 'Name:Account Name,Industry:Vertical';

    @wire(getAccountData, { columnFields: '$columnFields' })
    wiredAccounts({ data, error }) {
        if (data) {
            this.tableData = data;
        } else if (error) {
            console.error('Error fetching account data:', error);
        }
    }

    handleSelectedRows(event) {
        this.selectedRows = event.detail;
    }

    handleEditedRows(event) {
        this.editedRows = event.detail;
    }

    handleRemovedRows(event) {
        this.removedRows = event.detail;
    }
}


// import { LightningElement, track } from 'lwc';

// export default class AccountDatatableParent extends LightningElement {
//     @track tableData = []; // Populate with your data
//   columnFields = 'Name,Industry';
//   keyField = 'Id';
//   @track preSelectedRows = [];
//   isRequired = true;
//   columnLabels = 'Name:Account Name,Industry:Vertical';

//   handleSelectedRows(event) {
//     this.selectedRows = event.detail;
//   }

//   handleEditedRows(event) {
//     this.editedRows = event.detail;
//   }

//   handleRemovedRows(event) {
//     this.removedRows = event.detail;
//   }
// }