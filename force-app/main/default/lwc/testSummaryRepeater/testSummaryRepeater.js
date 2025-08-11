import { LightningElement, api, track } from "lwc";

export default class TestSummaryRepeater extends LightningElement {
  @track summaryCalculation = [];

  @api
  set records(value) {
    this.summaryCalculation = [];

    const parseSummaryItem = (raw) => {
      if (!raw && raw !== 0) return null;
      // If it's already an object (or Proxy of object), return it
      if (typeof raw === "object") return raw;

      let s = String(raw).trim();

      console.log("s , s", s);
      console.log("s , s", s);

      // If the string is quoted like '"{...}"', unwrap it
      if (s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1).trim();

      // Remove surrounding braces if present
      if (s.startsWith("{")) s = s.slice(1);
      if (s.endsWith("}")) s = s.slice(0, -1);

      const obj = {};
      console.log("s , s", obj);
      // Regex: key : "double-quoted"  OR  'single-quoted'  OR  unquoted (until comma)
      const pairRe =
        /([A-Za-z0-9_]+)\s*:\s*(?:"([^"]*)"|'([^']*)'|([^,]+))(?:,|$)/g;
      let m;
      console.log("s , s", pairRe);
      while ((m = pairRe.exec(s)) !== null) {
        const key = m[1].trim();
        // prefer double-quoted capture, then single-quoted, then unquoted
        let val = (m[2] ?? m[3] ?? m[4] ?? "").trim();

        // Clean leftover trailing braces/quotes if any
        val = val
          .replace(/^\s*["']?/, "")
          .replace(/["']?\s*$/, "")
          .replace(/}$/, "")
          .trim();

        obj[key] = val;
        console.log("s , s", obj[key]);
      }

      // If regex failed to capture anything, return null
      console.log("s , s", obj);
      console.log("obj ", JSON.stringify(obj));
      if (Object.keys(obj).length === 0) {
        console.warn("parseSummaryItem: could not parse item", raw);
        return null;
      }
      return obj;
    };

    // Convert this.summaryCal to array of objects
    console.log(' log : summaryCal' , this.summaryCal);
    console.log(' log : summaryCal' , JSON.stringify(this.summaryCal));
    const summaryCalArr = Array.isArray(this.summaryCal) ? this.summaryCal : [];
    const summaryCalObjects = summaryCalArr
      .map(parseSummaryItem)
      .filter(Boolean);

    console.log("Parsed summaryCalObjects:", summaryCalObjects);

    // Parse records input (value). It may be a JSON string or already an array.
    let recordsArray = [];
    try {
      recordsArray = typeof value === "string" ? JSON.parse(value) : value;
      if (!Array.isArray(recordsArray))
        throw new Error("records is not an array");
    } catch (e) {
      console.error(
        "Invalid records input (expected JSON array or array):",
        e,
        value
      );
      return;
    }

    summaryCalObjects.forEach((item) => {
      const fieldName = item.summaryField;
      const summaryType = (item.summaryType || "").toLowerCase();

      const rawValues = recordsArray
        .map((r) => r[fieldName])
        .filter((v) => v !== undefined && v !== null);

      const numericValues = rawValues
        .map((v) => (typeof v === "number" ? v : parseFloat(v)))
        .filter((n) => !Number.isNaN(n));

      let result = null;
      switch (summaryType) {
        case "sum":
          result = numericValues.reduce((a, b) => a + b, 0);
          break;
        case "avg":
          result = numericValues.length
            ? numericValues.reduce((a, b) => a + b, 0) / numericValues.length
            : 0;
          break;
        case "min":
          result = numericValues.length ? Math.min(...numericValues) : null;
          break;
        case "max":
          result = numericValues.length ? Math.max(...numericValues) : null;
          break;
        case "count":
          result = rawValues.length;
          break;
        default:
          console.warn(
            "Unsupported summaryType:",
            summaryType,
            "for item",
            item
          );
      }

      this.summaryCalculation.push({
        summaryField: item.summaryField,
        summaryType: item.summaryType,
        Coulmn_Name: item.Coulmn_Name,
        result: result
      });
    });

    console.log(
      "SummaryRepeater : summaryCalculation",
      this.summaryCalculation
    );
    console.log(
      "SummaryRepeater : summaryCalculation",
      JSON.stringify(this.summaryCalculation)
    );
  }

  //   @api
  //   set records(value) {
  //     console.log("SummaryRepeater : Type of value:", typeof value);
  //     console.log("SummaryRepeater :  : geting records");
  //     console.log("SummaryRepeater :  : geting records", value);
  //     console.log("SummaryRepeater :  : geting records", JSON.stringify(value));

  //     // if(!value || value.length === 0){
  //     //     this.summaryCalculation = null;
  //     // }

  //     let recordsArray;
  //     try {
  //       recordsArray = JSON.parse(value);
  //     } catch (e) {
  //       console.error("SummaryRepeater Invalid JSON string:", e);
  //       return;
  //     }

  //     recordsArray.forEach((item) => {
  //       console.log("SummaryRepeater 2 Name:", item.Name);
  //       console.log("SummaryRepeater 2 Amount:", item.Amount);
  //       console.log("SummaryRepeater 2 Id:", item.Id);
  //     });

  //     console.log('SummaryRepeater  : summaryCal' , this.summaryCal);
  //     console.log('SummaryRepeater  : summaryCal' , JSON.stringify(this.summaryCal));

  // console.log("SummaryRepeater : Type of value:", typeof this.summaryCal);
  // // Ensure we always get an array of objects
  // let summaryCalObjects = this.summaryCal.map(rawItem => {
  //   if (typeof rawItem === 'string') {
  //     try {
  //       // Step 1: Add quotes around keys
  //       let cleaned = rawItem.replace(/(\w+)\s*:/g, '"$1":');

  //       // Step 2: Replace single quotes with double quotes (if any)
  //       cleaned = cleaned.replace(/'/g, '"');

  //       // Step 3: Fix missing ending quotes before }
  //       cleaned = cleaned.replace(/(\w+)\}/g, '$1"}');

  //       // Step 4: Parse JSON
  //       return JSON.parse(cleaned);
  //     } catch (e) {
  //       console.error('Invalid summaryCal item:', rawItem, e);
  //       return null;
  //     }
  //   }
  //   return rawItem; // Already object
  // }).filter(Boolean);

  // console.log('Parsed Objects:', summaryCalObjects);

  // this.summaryCal.forEach(rawItem => {
  //   let item = rawItem;

  //   // If it's a string, parse it
  //   if (typeof rawItem === 'string') {
  //     console.log('')
  //     try {
  //       // Replace invalid JS-style object format with JSON format
  //       item = JSON.parse(
  //         rawItem
  //           .replace(/(\w+)\s*:/g, '"$1":') // add quotes to keys
  //           .replace(/'/g, '"') // replace single quotes with double
  //       );
  //     } catch (e) {
  //       console.error('Invalid summaryCal item:', rawItem, e);
  //       return;
  //     }
  //   }

  //   console.log('SummaryRepeater : item ', item);
  //   console.log('SummaryRepeater : typeof', typeof item);
  //   console.log('SummaryRepeater : item summaryField', item.summaryField);
  //   console.log('SummaryRepeater : item summaryType', item.summaryType);

  //   const fieldName = item.summaryField;
  //   const summaryType = item.summaryType;

  //   const values = recordsArray.map(record => record[fieldName]);

  //   switch (summaryType.toLowerCase()) {
  //     case "sum":
  //       this.summaryCalculation.push(values.reduce((acc, curr) => acc + curr, 0));
  //       break;
  //     case "avg":
  //       this.summaryCalculation.push(values.reduce((acc, curr) => acc + curr, 0) / values.length);
  //       break;
  //     case "min":
  //       this.summaryCalculation.push(Math.min(...values));
  //       break;
  //     case "max":
  //       this.summaryCalculation.push(Math.max(...values));
  //       break;
  //     case "count":
  //       this.summaryCalculation.push(values.length);
  //       break;
  //     default:
  //       throw new Error(`Unsupported summaryType: ${summaryType}`);
  //   }
  // });

  //     console.log('SummaryRepeater : summaryCalculation' , this.summaryCalculation);
  //     console.log('SummaryRepeater : summaryCalculation' , JSON.stringify(this.summaryCalculation));
  //   }

  get records() {
    return this._records;
  }

  @api summaryCal;

  // @track calculation;
}
