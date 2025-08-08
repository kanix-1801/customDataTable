public with sharing class OpportunityController {
    /**
     * @description Fetches a list of opportunities with essential fields.
     * @return List of Opportunities
     */
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunities() {
        try {
            // SOQL query to get the records and fields needed by the LWC.
            // We limit it to 20 for this example.
            return [
                SELECT Id, Name, Amount, StageName , ExpectedRevenue
                FROM Opportunity
                WHERE Amount != null
                ORDER BY CreatedDate DESC
                LIMIT 20
            ];
        } catch (Exception e) {
            // In a real-world scenario, handle the exception gracefully.
            // For LWC, throwing an AuraHandledException is a best practice.
            throw new AuraHandledException('Error fetching opportunities: ' + e.getMessage());
        }
    }
}