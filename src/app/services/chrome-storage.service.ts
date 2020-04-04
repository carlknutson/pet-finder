import { Injectable } from '@angular/core';
import { watch } from 'fs';

@Injectable({
  providedIn: 'root'
})
export class ChromeStorageService {

  constructor() { }

  chromeStorageSwitch = true;

  // TODO: handle errors / bad cache data
  updateWatchHistory(petIdList, petsFromSite) {

    if (this.chromeStorageSwitch) {
      return new Promise((resolve, reject) => {

        chrome.storage.local.get(petIdList, result => {
          var unwatchedPets:any[] = [];

          for (var i = 0; i < petsFromSite.length; i++) {
              if (result[petsFromSite[i].id]== undefined) {
                  unwatchedPets.push(petsFromSite[i]);
              }
          }
          resolve(unwatchedPets);
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

  dismissPet(id, type) {
    if (this.chromeStorageSwitch) {
      
      this.removeFromWatchedList(id, type);
      var obj = {};
      obj[id] = "D";

      chrome.storage.local.set(obj, function() {
        console.log("Dismissed pet: " + id);
      });
    }
  }

  setPetInfo(petInfo) {
    if (this.chromeStorageSwitch) {

      var obj = {};
      obj[petInfo['id']] = petInfo;

      chrome.storage.local.set(obj, function() {
        console.log("Toggle watch ind for: " + petInfo.id);
      });
    } 
  }

  removeFromWatchedList(id, type) {
    if (this.chromeStorageSwitch) {
      chrome.storage.local.get([type], result => {
        var storedWatchedList = result[type];
        console.log(storedWatchedList);

        if (storedWatchedList != undefined) {
          var index = storedWatchedList.indexOf(id);
          if (index > -1) {
            storedWatchedList.splice(index, 1);
          } else {
            console.log("trying to remove id from watch list, but does not exist: " + id);
          }

          var obj = {};
          obj[type] = storedWatchedList;

          chrome.storage.local.set(obj, function() {
            console.log("Setting watched list after removal");
            console.log(storedWatchedList);
          });
        }
      });
    }
  }
  
  addToWatchedList(id, type) {
    if (this.chromeStorageSwitch) {

      chrome.storage.local.get([type], result => {

        var storedWatchedList = result[type];

        console.log(storedWatchedList);

        var watched = [];
        // TODO: ensure this is set at beginning of extension and then refactor
        if (storedWatchedList == undefined) {
          watched.push(id);
        } else {
          storedWatchedList.push(id);
          watched = storedWatchedList;
        }


        var obj = {};
        obj[type] = watched;

        chrome.storage.local.set(obj, function() {
          console.log("Setting watched list");
          console.log(watched);
        });
      });
    }
  }

  getWatchedPets (type: string) {
    if (this.chromeStorageSwitch) {
      return new Promise((resolve, reject) => {
        var pets = [];
        var petTypes = [];

        if (type == 'all') {
          petTypes = ['dog', 'cat'];            
        } else {
          petTypes.push(type);
        }

        chrome.storage.local.get(petTypes, results => {

          var watchedList = [];

          for (var i = 0; i < petTypes.length; i++) {

            if (results[petTypes[i]] != undefined) {
              watchedList = watchedList.concat(results[petTypes[i]]);
            }
          }

          if (watchedList.length == 0) {
            resolve([]);
          } else {
            chrome.storage.local.get(watchedList, result => {

              for (var i = 0; i < watchedList.length; i++) {
                pets.push(result[watchedList[i]]);
              }
              console.log(pets);
              resolve(pets)
            });
          }
        });
      });
    }
    else {
      return new Promise((resolve, reject) => {
        resolve([]);
      });
    }
  }

}
