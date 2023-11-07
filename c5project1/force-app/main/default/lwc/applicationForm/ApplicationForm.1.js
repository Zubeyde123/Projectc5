import { LightningElement,api,track } from 'lwc';

import createAddRecord from '@salesforce/apex/uiapplicationHandler.createAddRecord';

import createLeadRecord from '@salesforce/apex/uiapplicationHandler.createLeadRecord';

import campaignMemberRecord from '@salesforce/apex/uiapplicationHandler.campaignMemberRecord';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class ApplicationForm extends LightningElement {

  // SELECT Id, Campaign__c, UTM_Campaign__c, UTM_Content__c, UTM_Medium__c, UTM_Referer__c, UTM_Source__c, UTM_Term__c, utm_id__c FROM Ad__c

  isLeadSent = false;
  isButtonClick = false;
  errorMsg;

  isError = false;

  @api titleform;
  @api utm_source;
  @api utm_medium;
  @api utm_campaign;
  @api utm_id;
  @api utm_term;
  @api utm_content;
  @api utm_referer;

  @track leadData = {
    FirstName:'',
    LastName:'',
    Phone:'',
    Email:'',
    Company:'B2C',
    Status:'Open - Not Contacted',
    Ad__c:''
  }

  @track advertiseData = {

    UTM_Campaign__c:'', 
    UTM_Content__c:'', 
    UTM_Medium__c:'', 
    UTM_Referer__c:'', 
    UTM_Source__c:'', 
    UTM_Term__c:'', 
    utm_id__c:''
  }


  async createLeadHandler(){

    this.isButtonClick=true;

    // Call apex method....  uiapplicationHandler.createLeadRecord(Lead singleLead )
    console.log('1 -  createLeadRecord will run...');

    if(this.leadData.LastName){

      await createLeadRecord({
        singleLead:this.leadData
      })
      .then(data=>{
        console.log('2 - Lead Created ',data);
  
        console.log('3 - lead data collected...');

        this.isError=false;

        this.isLeadSent=true;
  
      })
      .catch(err=>{
        console.log('4 - Lead Error : ',err);
        this.isError=true;

        this.errorMsg = err.body.message;

        const evt = new ShowToastEvent({
          title: 'Error ',
          message: this.errorMsg ,
          variant: 'error',
          mode: 'dismissable'
      });
      this.dispatchEvent(evt);


      });
  
  
      console.log('5- Create Lead Record Finished...');
  
      // Call Apex Method .....  uiapplicationHandler.campaignMemberRecord(Lead singleLead,Ad__c singleAd)

      if(!this.isError) {

        await campaignMemberRecord({
          singleLead:this.leadData,
          singleAd:this.advertiseData
        })
        .then(data=>{
          console.log('campaignMemberRecord success');
          this.isError=false;
        })
        .catch(err=>{
          console.log('campaignMemberRecord ERROR ',err);
          this.isError=true;
          this.errorMsg = err.body.message;

          const evt = new ShowToastEvent({
            title: 'Error ',
            message: this.errorMsg ,
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);

        });
    

      }
 
      this.isButtonClick=false;
    } else {
      this.isButtonClick=false;
    }
    

  }

  textChangeHandler(event){

    switch(event.target.name) {
      case 'fname':
        this.leadData.FirstName=event.target.value;
        break;
      case 'lname':
        this.leadData.LastName=event.target.value;
        break;
      case 'lemail':
        this.leadData.Email=event.target.value;
        break;
      case 'lphone':
        this.leadData.Phone=event.target.value;
        break; 

     
    }

    console.log(JSON.stringify(this.leadData));

    console.log(JSON.parse(JSON.stringify(this.leadData)));

  }

  connectedCallback(){
    console.log('title : ', this.titleform);

    console.log('**********AD DATA ***************');

    /*
    console.log(this.utm_source);
    console.log(this.utm_medium);
    console.log(this.utm_campaign);
    console.log(this.utm_id);
    console.log(this.utm_term);
    console.log(this.utm_content);
    console.log(this.utm_referer);
*/

    this.advertiseData = {
      ...this.advertiseData,
      UTM_Campaign__c:this.utm_campaign,
      UTM_Content__c:this.utm_content, 
      UTM_Medium__c:this.utm_medium, 
      UTM_Referer__c:this.utm_referer, 
      UTM_Source__c:this.utm_source, 
      UTM_Term__c:this.utm_term, 
      utm_id__c:this.utm_id
    }

    console.log('Ad__C object Details.');
    console.log(JSON.stringify(this.advertiseData));
    

    // Call apex method....  uiapplicationHandler.createAddRecord(Ad__c singleAd )
    createAddRecord({singleAd:this.advertiseData})
    .then(data=>{

      this.isError=false;

      console.log('Success Returned Data : ',data );

      this.advertiseData = {
        ...this.advertiseData,
        Id:data
      }

      this.leadData.Ad__c=data;

    })
    .catch(err=>{
      console.log('ERR Ad creation : ',err);
      this.isError = true;
      // this.errorMsg = err.body.message;
    });


  }
}