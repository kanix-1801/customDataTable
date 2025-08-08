public with sharing class AccountController {
    /**
     * @description : return a list of account for lwc datatable
     * @return : list of account
     */
   @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [SELECT Id, Name, Industry, AnnualRevenue 
                FROM Account 
                WHERE Name != null 
                LIMIT 100];
    }

    @AuraEnabled
    public static void updateAccounts(List<Account> accounts) {
        try {
            update accounts;
        } catch (Exception e) {
            throw new AuraHandledException('Error updating accounts: ' + e.getMessage());
        }
    }

     @AuraEnabled(cacheable=true)
    public static List<Account> getAccountData(String columnFields) {
        // Default fields fallback
        if (String.isBlank(columnFields)) {
            columnFields = 'Id,Name,Industry';
        }

        List<String> fields = columnFields.split(',');
        String soql = 'SELECT Id';

        for (String field : fields) {
            field = field.trim();
            if (!String.isEmpty(field) && field != 'Id') {
                soql += ', ' + field;
            }
        }
        soql += ' FROM Account LIMIT 100';
        return (List<Account>) Database.query(soql);
    }

    @AuraEnabled(cacheable=true)
    public static List<sObject> getListOfObjectsRecords( string objectName , String columnFields){

        List<sObject> records = new List<sObject>();
        if(string.isBlank(columnFields)){
            columnFields = 'Id,Name,Industry';
        }
        
        List<String> fields = columnFields.split(',');
        String soql = 'SELECT Id';

        for(String field : fields){
            field = field.trim();
            if(!String.isEmpty(field) || field != 'Id'){
                soql += ' , ' + field;
            }
        }
        soql += ' FROM '+ objectName + ' LIMIT 100';
        system.debug('soql ' + soql);
        records = Database.query(soql);

        return records;
    }

}