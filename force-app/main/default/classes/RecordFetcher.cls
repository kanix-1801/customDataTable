public with sharing class RecordFetcher {

    @AuraEnabled(cacheable=true)
    public static String getMessage() {
        return 'Hello from Apex!';
    }

    @AuraEnabled(cacheable=true)
    public static List<SObject> getRecords(String objectName, List<String> fields) {
        if (String.isBlank(objectName) || fields == null || fields.isEmpty()) {
            return new List<SObject>();
        }
        String soql = 'SELECT ' + String.join(fields, ',') + ' FROM ' + objectName + ' LIMIT 50';
        return Database.query(soql);
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getObjectNames() {
        List<String> objects = new List<String>();
        for (Schema.SObjectType sObj : Schema.getGlobalDescribe().values()) {
            objects.add(sObj.getDescribe().getName());
        }
        return objects;
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getObjectFields(String objectName) {
        Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe();
        if (!gd.containsKey(objectName)) return new List<String>();
        Map<String, Schema.SObjectField> fields = gd.get(objectName).getDescribe().fields.getMap();
        return new List<String>(fields.keySet());
    }

    
    

}