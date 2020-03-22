import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChromeStorageService {

  constructor() { }

  chromeStorageSwitch = true;

  // TODO: handle errors / bad cache data
  updateWatchHistory(petIdList, dirtyPets) {

    if (this.chromeStorageSwitch) {
      return new Promise((resolve, reject) => {

        chrome.storage.local.get(petIdList, result => {
              var pets:any[] = [];

              console.log(result);

              var unwatchedPets = [];

              for (var i = 0; i < dirtyPets.length; i++) {
                  switch(result[dirtyPets[i].id]) {
                    case "D":
                      break;
                    case "W":
                      dirtyPets[i].status = "W";
                      pets.push(dirtyPets[i]);
                      break;
                    default:
                      unwatchedPets.push(dirtyPets[i]);
                  }
              }
              pets = pets.concat(unwatchedPets);
              console.log("Pet Counter: " + pets.length)
              resolve(pets);
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        resolve(dirtyPets);
      });
    }
  }

  getFilterType() {
    if (this.chromeStorageSwitch) {

      return new Promise((resolve, reject) => {
        chrome.storage.local.get(['filter_type'], result => {
          var cachedType:string = result['filter_type'];
          if (cachedType == null) {
            console.log('filter_type is empty, use all');
            resolve('all');
          } else {
            console.log('filter_type has a value of: ' + cachedType);
            resolve(cachedType);
          }    
        });
      });
    } else {
      console.log('google storage is off');
      return new Promise((resolve, reject) => {
        resolve('all');
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
