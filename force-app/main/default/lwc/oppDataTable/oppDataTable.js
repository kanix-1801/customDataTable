import { LightningElement, track, wire } from "lwc";
import getListOfObjectsRecords from "@salesforce/apex/AccountController.getListOfObjectsRecords";

export default class OppDataTable extends LightningElement {
  @track tableData = [];
  @track columnFields = "ExpectedRevenue , Amount  , AccountId, Name";
  @track keyField = "Id";
  @track preSelectedRows = [];
  @track isRequired = false;


  @wire(getListOfObjectsRecords, {
    objectName: "Opportunity",
    columnFields: "ExpectedRevenue , Amount  , AccountId, Name"
  })
  handleOpportunityData({ data, error }) {
    if (data) {
      // Add TotalRevenue to each record
      this.tableData = data.map(record => {
        const expected = Number(record.ExpectedRevenue) || 0;
        const amount = Number(record.Amount) || 0;
        return {
          ...record,
          TotalRevenue: expected + amount
        };
      });

      console.log("Modified data:", JSON.stringify(this.tableData));
      this.doOperation(this.operation , "amount" , this.tableData);
    } else if (error) {
      console.error("Error:", error);
    }
  }

  operation = "sum";

  doOperation = (operationType , fieldsName , record) => {
    console.log('Operation Type:', operationType);
    console.log('Fields Name:', fieldsName);
    console.log('Record:', record);
    console.log('Record:', JSON.stringify(record));
    
  }

}
