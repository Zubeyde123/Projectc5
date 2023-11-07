import { LightningElement,api } from 'lwc';

export default class Calendly extends LightningElement {

  @api calendlyURL;
  
  connectedCallback(){
    console.log(this.calendlyURL);
    // https%3A%2F%2Fcalendly.com%2Fselcukgoktas%2Fcohort-5-proje%2F*00QHs00001ufS3wMAE*lead%20emailtest*arsivcix%40gmail.com
    // https://calendly.com/selcukgoktas/cohort-5-proje/?name=00QHs00001ufS3wMAE$%20lead%20emailtest&amp;amp;email=arsivcix@gmail.com

    // %3A : 
    // %2F / 
    // %40 @

    this.calendlyURL=this.calendlyURL.replaceAll('%3A',':').replaceAll('%2F','/').replaceAll('%40','@');

    console.log(this.calendlyURL);
    // https://calendly.com/selcukgoktas/cohort-5-proje/*00QHs00001ufS3wMAE*lead%20emailtest*arsivcix@gmail.com


    // Content Security Policy (CSP) 


    let userlink = this.calendlyURL.split('*')[0];
    let leadid = this.calendlyURL.split('*')[1];
    let leadName = this.calendlyURL.split('*')[2];
    let leadmail = this.calendlyURL.split('*')[3];

    this.calendlyURL=userlink+'?name='+leadid+'$'+leadName +'&email='+leadmail;

    console.log(this.calendlyURL);


  }
}