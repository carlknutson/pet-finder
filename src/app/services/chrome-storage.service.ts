import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChromeStorageService {

  constructor() { }

  chromeStorageSwitch = false;

  // TODO: handle errors / bad cache data
  updateWatchHistory(petIdList, petsFromSite) {

    if (this.chromeStorageSwitch) {
      return new Promise((resolve, reject) => {

        chrome.storage.local.get(petIdList, result => {
              var pets:any[] = [];

              var unwatchedPets = [];

              for (var i = 0; i < petsFromSite.length; i++) {
                  switch(result[petsFromSite[i].id]) {
                    case "D":
                      break;
                    case "W":
                      petsFromSite[i].status = "W";
                      pets.push(petsFromSite[i]);
                      break;
                    default:
                      unwatchedPets.push(petsFromSite[i]);
                  }
              }
              pets = pets.concat(unwatchedPets);
              resolve(pets);
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        resolve(petsFromSite);
      });
    }
  }

  getSearchCriteria() {

    var obj = { 
                zipCode: '',
                filterType: 'all'  
              };

    if (this.chromeStorageSwitch) {

      return new Promise((resolve, reject) => {


        chrome.storage.local.get(['zip_code'], result => {
          var zip:string = result['zip_code'];
          if (zip == null) {
            obj.zipCode = '';
          } else {
            obj.zipCode = zip;
          }
          
          chrome.storage.local.get(['filter_type'], result => {
            var cachedType:string = result['filter_type'];
            if (cachedType == null) {
              obj.filterType = 'all';
            } else {
              obj.filterType = cachedType;
            }
            resolve(obj);
          });
        });
      });
    } else {
      console.log('google storage is off');
      return new Promise((resolve, reject) => {
        resolve(obj);
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

  setZip(zip: string) {
    if (this.chromeStorageSwitch) {
      var obj = {};
      obj['zip_code'] = zip;

      chrome.storage.local.set(obj, function() {
        console.log("Setting... " + obj);
      });
    }
  }

  dismissPet(id) {
    if (this.chromeStorageSwitch) {
      var obj = {};
      obj[id] = "D";

      chrome.storage.local.set(obj, function() {
        console.log("Dismissed pet: " + id);
      });
    }
  }

  watchPet(id, status) {
    if (this.chromeStorageSwitch) {
      var obj = {};
      obj[id] = status;

      chrome.storage.local.set(obj, function() {
        console.log("Toggle watch ind for: " + id);
      });
    }
    
  }

}
