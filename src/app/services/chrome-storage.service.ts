import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChromeStorageService {

  constructor() { }

  // toggle, allows testing on localhost
  chromeStorageSwitch = false;

  getFilterType() {
    if (this.chromeStorageSwitch) {

      return new Promise((resolve, reject) => {
        chrome.storage.local.get(['filter_type'], result => {
          var cachedType:string = result['filter_type'];
          if (cachedType == null) {
            console.log('filter_type is empty');
            resolve('');
          } else {
            console.log('filter_type has a value of: ' + cachedType);
            resolve(cachedType)
          }    
        });
      });
    } else {
      console.log('google storage is off');
      return new Promise((resolve, reject) => {
        resolve('');
      });
    }    
  }

  setFilterType(type) {
    if (this.chromeStorageSwitch) {
      var obj = {};
      obj['filter_type'] = type;

      chrome.storage.local.set(obj, function() {
        console.log("Setting... " + obj);
      });
    }
  }

}
