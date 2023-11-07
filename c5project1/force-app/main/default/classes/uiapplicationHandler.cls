/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 10-17-2023
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public class uiapplicationHandler {
    public uiapplicationHandler() {

    }

    @AuraEnabled
    public static string createAddRecord(Ad__c singleAd ){
        try {
            insert singleAd;
            return singleAd.id;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static string createLeadRecord(Lead singleLead){
        try {
            insert singleLead;
            return singleLead.id;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


    @AuraEnabled
    public static void campaignMemberRecord(Lead singleLead,Ad__c singleAd){
        CampaignMember cm = New CampaignMember();
        String search = '%'+singleAd.utm_id__c+'%';
        List<Campaign> campaings = New List<Campaign>();
        try {
            campaings = [SELECT Id, Name, Type, Status, IsActive FROM Campaign WHERE IsActive = True AND Name LIKE :search LIMIT 1];
            if(!campaings.isEmpty()){
                // SELECT Id, LeadId, CampaignId, Status FROM CampaignMember
                cm.LeadId=singleLead.id;
                cm.CampaignId=campaings[0].id;
                cm.Status='Sent';

                insert cm;

                singleAd.Campaign__c=campaings[0].id;

                update singleAd;
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}