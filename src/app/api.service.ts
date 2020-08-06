import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Products } from './registration/registration.component';
import { Observable,BehaviorSubject} from 'rxjs';
import { map } from  'rxjs/operators';

var   baseurl= window.location.hostname.includes("localhost")?"http://localhost":"";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  selectiondata=[];
  private messageSource = new BehaviorSubject(this.selectiondata);
  currentMessage = this.messageSource.asObservable();


  constructor(private httpClient: HttpClient) { }

  changeMessage(message: any) {
    this.messageSource.next(message);
  }

  all_products(): Observable<Products>{ 
    return this.httpClient.get<Products>(baseurl+'/php_api/masterdb/basproducts.php'); 
  }

  get_token(): Observable<Products>{ 
    return this.httpClient.get<Products>(baseurl+'/php_api/token.php'); 
  }

  all_cats(): Observable<Products>{ 
    return this.httpClient.get<Products>(baseurl+'/php_api/masterdb/bascats.php'); 
  }

  get_cat(id: number){
    return this.httpClient.get<any>(baseurl+`/php_api/masterdb/basgetcat.php?catid=${id}`);
  }

  insert_setting(settingarray){
    // let headers = new HttpHeaders();
    // headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    // return this.httpClient.post<any>('php_api/insert-setting.php',settingarray,{headers});
    return this.httpClient.post<any>(baseurl+'/php_api/insert-setting.php',settingarray);
  }

  registration(finaldata){
    // let headers = new HttpHeaders();
    // headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    // return this.httpClient.post<any>('php_api/insert-setting.php',settingarray,{headers});
    return this.httpClient.post<any>(baseurl+'/php_api/registration.php',finaldata);
  }

  empregistration(finaldata){
    // let headers = new HttpHeaders();
    // headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    // return this.httpClient.post<any>('php_api/insert-setting.php',settingarray,{headers});
    return this.httpClient.post<any>(baseurl+'/php_api/emp-registration.php',finaldata);
  }

  emplogin(finaldata){
    // let headers = new HttpHeaders();
    // headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    // return this.httpClient.post<any>('php_api/insert-setting.php',settingarray,{headers});
    return this.httpClient.post<any>(baseurl+'/php_api/emp-login.php',finaldata);
  }

  mgrlogin(finaldata){
    // let headers = new HttpHeaders();
    // headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    // return this.httpClient.post<any>('php_api/insert-setting.php',settingarray,{headers});
    return this.httpClient.post<any>(baseurl+'/php_api/mgr-login.php',finaldata);
  }

  adminlogin(finaldata){
    return this.httpClient.post<any>(baseurl+'/php_api/admin-login.php',finaldata);
  }

  getstoreproducts(storeid){    
    return this.httpClient.post<any>(baseurl+'/php_api/get-store-products.php',storeid);
  }

  getstoreusers(storeid){    
    return this.httpClient.post<any>(baseurl+'/php_api/get-store-users.php',storeid);
  }

  getstoreorders(storeid){    
    return this.httpClient.post<any>(baseurl+'/php_api/get-store-orders.php',storeid);
  }

 revieworder(storeid){    
    return this.httpClient.post<any>(baseurl+'/php_api/review-order.php',storeid);
  }

  getmgrorders(mgrid){    
    return this.httpClient.post<any>(baseurl+'/php_api/get-mgr-orders.php',mgrid);
  }

  checkSite(sitename){    
    return this.httpClient.post<any>(baseurl+'/php_api/check-site.php',sitename);
  }

  shipsettings(storeid){    
    return this.httpClient.post<any>(baseurl+'/php_api/ship-settings.php',storeid);
  }

  emporder(finaldata){    
    return this.httpClient.post<any>(baseurl+'/php_api/emp-order.php',finaldata);
  }

  getpricingbreaks(data){    
    return this.httpClient.post<any>(baseurl+'/php_api/masterdb/getPricingBreaks.php',data);
  }

  getsinglepricingbreak(data){    
    return this.httpClient.post<any>(baseurl+'/php_api/masterdb/getsinglePricingBreak.php',data);
  }

  checkCustomerEmail(data){    
    return this.httpClient.post<any>(baseurl+'/php_api/check-customer-email.php',data);
  }

  checkStoreUrl(data){    
    return this.httpClient.post<any>(baseurl+'/php_api/check-store-url.php',data);
  }

  getStoreSettings(data){    
    return this.httpClient.post<any>(baseurl+'/php_api/get-store-settings.php',data);
  }

  getStores(){    
    return this.httpClient.get<any>(baseurl+'/php_api/get-stores.php');
  }

  

  mgrsettingsupdate(finaldata){
    return this.httpClient.post<any>(baseurl+'/php_api/mgrsettingsupdate.php',finaldata);
  }

  storeproductdetails(storeid){    
    return this.httpClient.post<any>(baseurl+'/php_api/store-product-details.php',storeid);
  }

  uploadproductimage(data) {
    let uploadURL = baseurl+'/php_api/product-image-upload.php';
    return this.httpClient.post<any>(uploadURL, data);
  }

  updateproductimage(finaldata){    
    return this.httpClient.post<any>(baseurl+'/php_api/update-product-image.php',finaldata);
  }

  approveselection(finaldata){    
    return this.httpClient.post<any>(baseurl+'/php_api/approve-selection.php',finaldata);
  }

  denyselection(finaldata){    
    return this.httpClient.post<any>(baseurl+'/php_api/deny-selection.php',finaldata);
  }

  approveallselection(finaldata){    
    return this.httpClient.post<any>(baseurl+'/php_api/approve-all-selection.php',finaldata);
  }
  confirmorders(finaldata){    
    return this.httpClient.post<any>(baseurl+'/php_api/confirm-orders.php',finaldata);
  }
  payment(finaldata){    
    return this.httpClient.post<any>(baseurl+'/php_api/payment.php',finaldata);
  }

  vault(finaldata){    
    return this.httpClient.post<any>(baseurl+'/php_api/vault-customer.php',finaldata);
  }

  update_vault(finaldata){    
    return this.httpClient.post<any>(baseurl+'/php_api/update-vault-customer.php',finaldata);
  }

  delete_vault(finaldata){    
    return this.httpClient.post<any>(baseurl+'/php_api/delete-vault-customer.php',finaldata);
  }

  customer_token(finaldata){    
    return this.httpClient.post<any>(baseurl+'/php_api/customer-token.php',finaldata);
  }

  customer_payment(finaldata){    
    return this.httpClient.post<any>(baseurl+'/php_api/customer-payment.php',finaldata);
  }

  get_customer_id(finaldata){    
    return this.httpClient.post<any>(baseurl+'/php_api/getcustomerID.php',finaldata);
  }

  amorder(finaldata){    
    return this.httpClient.post<any>(baseurl+'/php_api/get-am-orders.php',finaldata);
  }

  save_product_selection(finaldata){    
    return this.httpClient.post<any>(baseurl+'/php_api/product-selection-update.php',finaldata);
  }

  update_store_setting(finaldata){    
    return this.httpClient.post<any>(baseurl+'/php_api/update-store-setting.php',finaldata);
  }

  update_address_setting(finaldata){    
    return this.httpClient.post<any>(baseurl+'/php_api/update-store-address.php',finaldata);
  }

  update_caddress(finaldata){    
    return this.httpClient.post<any>(baseurl+'/php_api/update-single-corp-address.php',finaldata);
  }

  check_store_product_order(finaldata){    
    return this.httpClient.post<any>(baseurl+'/php_api/check-store-product-order.php',finaldata);
  }

  getsingleuseraddress(finaldata){    
    return this.httpClient.post<any>(baseurl+'/php_api/get-single-user-address.php',finaldata);
  }
  savesingleuseraddress(finaldata){    
    return this.httpClient.post<any>(baseurl+'/php_api/save-single-user-address.php',finaldata);
  }
  savesingleuserdetails(finaldata){    
    return this.httpClient.post<any>(baseurl+'/php_api/save-single-user-details.php',finaldata);
  }

  forgot(finaldata){    
    return this.httpClient.post<any>(baseurl+'/php_api/forgot-email.php',finaldata);
  }

  reset(finaldata){    
    return this.httpClient.post<any>(baseurl+'/php_api/sbresetpassword.php',finaldata);
  }

  uploadFile(data) {
    let uploadURL = baseurl+'/php_api/image-upload.php';
    return this.httpClient.post<any>(uploadURL, data, {
      reportProgress: true,
      observe: 'events'
    }).pipe(map((event) => {

      switch (event.type) {

        case HttpEventType.UploadProgress:
          const progress = Math.round(100 * event.loaded / event.total);
          return { status: 'progress', message: progress };

        case HttpEventType.Response:
          return event.body;
        default:
          return `Unhandled event: ${event.type}`;
      }
    })
    );
  }

  
}

