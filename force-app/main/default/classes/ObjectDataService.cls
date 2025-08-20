public with sharing class ObjectDataService {
    @AuraEnabled(cacheable=true)
    public static List<ObjectDefinition> getAvailableObjects() {
        List<ObjectDefinition> objects = new List<ObjectDefinition>();
        
        for (EntityDefinition entity : [
            SELECT QualifiedApiName, Label, IsQueryable 
            FROM EntityDefinition 
            WHERE IsQueryable = true 
            AND IsCustomSetting = false
            ORDER BY Label
            LIMIT 200
        ]) {
            if (!entity.QualifiedApiName.endsWith('__Tag') && 
                !entity.QualifiedApiName.endsWith('__History')) {
                objects.add(new ObjectDefinition(
                    entity.QualifiedApiName,
                    entity.Label
                ));
            }
        }
        
        return objects;
    }

    @AuraEnabled(cacheable=true)
    public static List<FieldDefinition> getAvailableFields(String objectName) {
        List<FieldDefinition> fields = new List<FieldDefinition>();
        
        // First get the object type
        Schema.SObjectType objType = Schema.getGlobalDescribe().get(objectName);
        if (objType == null) return fields;
        
        // Get all fields for the object
        Map<String, Schema.SObjectField> fieldMap = objType.getDescribe().fields.getMap();
        
        for (Schema.SObjectField field : fieldMap.values()) {
            Schema.DescribeFieldResult fieldDescribe = field.getDescribe();
            if (fieldDescribe.isAccessible() && fieldDescribe.isFilterable()) {
                fields.add(new FieldDefinition(
                    fieldDescribe.getName(),
                    fieldDescribe.getLabel(),
                    fieldDescribe.getType().name()
                ));
            }
        }
        
        // Sort fields by label
        fields.sort();
        return fields;
    }

    @AuraEnabled(cacheable=true)
    public static List<SObject> fetchRecords(String objectName, List<String> fieldNames) {
        // Validate input
        if (String.isBlank(objectName) || fieldNames == null || fieldNames.isEmpty()) {
            throw new AuraHandledException('Invalid parameters');
        }
        
        // Verify object exists and is accessible
        Schema.SObjectType objType = Schema.getGlobalDescribe().get(objectName);
        if (objType == null) {
            throw new AuraHandledException('Object not found');
        }
        if (!objType.getDescribe().isAccessible()) {
            throw new AuraHandledException('Object not accessible');
        }
        
        // Verify field access
        List<String> accessibleFields = new List<String>();
        Map<String, Schema.SObjectField> fieldMap = objType.getDescribe().fields.getMap();
        
        for (String field : fieldNames) {
            if (fieldMap.containsKey(field) && fieldMap.get(field).getDescribe().isAccessible()) {
                accessibleFields.add(field);
            }
        }
        
        if (accessibleFields.isEmpty()) {
            throw new AuraHandledException('No accessible fields selected');
        }
        
        // Build query
        String query = 'SELECT ' + String.join(accessibleFields, ', ') + 
                     ' FROM ' + objectName + 
                     ' LIMIT 50';
        
        try {
            return Database.query(query);
        } catch (Exception e) {
            throw new AuraHandledException('Query error: ' + e.getMessage());
        }
    }

    // Wrapper classes
    public class ObjectDefinition {
        @AuraEnabled public String apiName;
        @AuraEnabled public String label;
        
        public ObjectDefinition(String apiName, String label) {
            this.apiName = apiName;
            this.label = label;
        }
    }

    public class FieldDefinition implements Comparable {
        @AuraEnabled public String apiName;
        @AuraEnabled public String label;
        @AuraEnabled public String dataType;
        
        public FieldDefinition(String apiName, String label, String dataType) {
            this.apiName = apiName;
            this.label = label;
            this.dataType = dataType;
        }
        
        public Integer compareTo(Object compareTo) {
            FieldDefinition other = (FieldDefinition)compareTo;
            return this.label.compareTo(other.label);
        }
    }
}