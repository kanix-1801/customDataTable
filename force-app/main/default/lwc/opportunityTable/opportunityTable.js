import { LightningElement, wire, track } from "lwc";
import getOpportunities from "@salesforce/apex/OpportunityController.getOpportunities";

const COLUMNS = [
  { label: "Opportunity Name", fieldName: "Name", type: "text" },
  {
    label: "Amount",
    fieldName: "Amount",
    type: "currency",
    typeAttributes: { currencyCode: "USD" },
    cellAttributes: { class: { fieldName: "amountCellClass" } }
  },
  { label: "Stage", fieldName: "StageName", type: "text" }
];

export default class OpportunityTable extends LightningElement {
  // @track summaryField = 'Amount';
  // @track summaryType = 'max';
  @track parentCall = null;

  @track summaryCal = [
    { summaryField: "ExpectedRevenue", summaryType: "sum" , result : null  , columnsNum : 2},
    { summaryField: "ExpectedRevenue", summaryType: "max" , result : null , columnsNum : 1}
  ];

  summarizeData(data) {
    const records = data;

    if (!records || records.length === 0) return null;
    // const summaryResults = [];
    this.summaryCal.forEach((item) => {
      {
        const fieldName = item.summaryField;
        const summaryType = item.summaryType;

        const values = records
          .map((record) => record[fieldName])
          .filter((val) => typeof val === "number");

        switch (summaryType.toLowerCase()) {
          case "sum":
            item.result = (values.reduce((acc, curr) => acc + curr, 0));
            break;
          case "avg":
            item.result = (
              values.reduce((acc, curr) => acc + curr, 0) / values.length
            );
            break;
          case "min":
            item.result = (Math.min(...values));
            break;
          case "max":
            item.result = (Math.max(...values));
            break; 
          case "count":
            item.result = (values.length);
            break;
          default:
            throw new Error(`Unsupported summaryType: ${summaryType}`);
        }
      }
    }); 
    console.log('summaryResults : ' , JSON.stringify(this.summaryCal)); 
    return this.summaryCal;
  }

  @track columnFields = "ExpectedRevenue , Amount  , AccountId, Name";

  columns = COLUMNS;
  opportunities;
  error;

  @wire(getOpportunities)
  wiredOpportunities({ error, data }) {
    if (data) {
      // Find the highest amount in the dataset
      // We use 0 as a fallback if data is empty or all amounts are negative.
      // const highestAmount = Math.max(...data.map(opp => opp.Amount), 0);
      this.opportunities = data;
      console.log("the sum is : " + this.summarizeData(this.opportunities));
      this.parentCall = this.summarizeData(this.opportunities);
    } else if (error) {
      this.error = error;
      this.opportunities = undefined;
    }
  }
}
