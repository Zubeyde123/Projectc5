/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 10-23-2023
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
@isTest
public with sharing class uiapplicationHandlerTest {
  

    @isTest
    public static void testCreateAddRecord() {
        // Positive test: Create a test Ad__c record
        Ad__c testAd = new Ad__c(
            UTM_Campaign__c='TEST', 
            UTM_Content__c='TEST', 
            UTM_Medium__c='TEST', 
            UTM_Referer__c='TEST', 
            UTM_Source__c='TEST', 
            UTM_Term__c='TEST', 
            utm_id__c='TEST'
        );
       

        // Call the createAddRecord method
        String adId = uiapplicationHandler.createAddRecord(testAd);

        // Verify that the record was inserted and an ID was returned
        System.assertNotEquals(null, adId);


    }

    @isTest
    public static void testCreateLeadRecord() {
        // Positive test: Create a test Lead record
        Lead testLead = new Lead(FirstName = 'John', LastName = 'Doe', Company = 'Test Company');


        // Call the createLeadRecord method
        String leadId = uiapplicationHandler.createLeadRecord(testLead);

        // Verify that the record was inserted and an ID was returned
        System.assertNotEquals(null, leadId);

        // Negative test: Try to insert a Lead record with missing required fields
        Lead invalidLead = new Lead();
        try {
            uiapplicationHandler.createLeadRecord(invalidLead);
            
        } catch (Exception e) {
            // Exception was expected
            system.debug('invalidLead ERROR...');
            system.debug(e.getMessage());
            System.assertEquals(true, e.getMessage().contains('Script-thrown exception'));
        }
    }

    @isTest
    public static void testCampaignMemberRecord() {
        // Positive test: Create a test Ad__c record
        Ad__c testAd = new Ad__c(
            UTM_Campaign__c='TEST', 
            UTM_Content__c='TEST', 
            UTM_Medium__c='TEST', 
            UTM_Referer__c='TEST', 
            UTM_Source__c='TEST', 
            UTM_Term__c='TEST', 
            utm_id__c='TEST'
        );
        
        insert testAd;
        system.debug(testAd);

        Campaign TestCampaign = New Campaign(
            Name='TEST', IsActive=true
        );
        insert TestCampaign;
        
        system.debug(TestCampaign);


        // Create a test Lead record
        Lead testLead = new Lead(FirstName = 'John', LastName = 'Doe', Company = 'Test Company');
        insert testLead;
        system.debug(TestCampaign);

        // Call the campaignMemberRecord method
        Test.startTest();
        uiapplicationHandler.campaignMemberRecord(testLead, testAd);
        Test.stopTest();

        // Verify that a CampaignMember record was created
        CampaignMember[] campaignMembers = [SELECT Id FROM CampaignMember];
        System.assertNotEquals(0, campaignMembers.size());

    }
}