import { Injectable } from '@angular/core';
import { watch } from 'fs';

@Injectable({
  providedIn: 'root',
})
export class ChromeStorageService {
  constructor() {}

  chromeStorageSwitch = true;

  updateWatchHistory(petIdList, petsFromSite) {
    if (this.chromeStorageSwitch) {
      return new Promise((resolve, reject) => {
        chrome.storage.local.get(petIdList, (result) => {
          const unwatchedPets: any[] = [];

          petsFromSite.forEach((pet) => {
            if (result[pet.id] === undefined) {
              unwatchedPets.push(pet);
            }
          });

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
    const obj = {
      zipCode: '',
      filterType: 'all',
      filterAges: [],
      filterBreeds: [],
    };

    if (this.chromeStorageSwitch) {
      return new Promise((resolve, reject) => {
        chrome.storage.local.get(['zip_code'], (result) => {
          const zip: string = result.zip_code;
          if (zip == null) {
            obj.zipCode = '';
          } else {
            obj.zipCode = zip;
          }

          chrome.storage.local.get(['filter_type'], (typeResult) => {
            const cachedType: string = typeResult.filter_type;
            if (cachedType == null) {
              obj.filterType = 'all';
            } else {
              obj.filterType = cachedType;
            }

            chrome.storage.local.get(['filter_ages'], (ageResults) => {
              const storedAge: [] = ageResults.filter_ages;
              if (storedAge == null) {
                obj.filterAges = [];
              } else {
                obj.filterAges = storedAge;
              }

              chrome.storage.local.get(['filter_breeds'], (breedResults) => {
                const storedBreed: [] = breedResults.filter_breeds;
                if (storedBreed == null) {
                  obj.filterBreeds = [];
                } else {
                  obj.filterBreeds = storedBreed;
                }
                resolve(obj);
              });
            });
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
      const obj = {
        filter_type: '',
      };
      obj.filter_type = type;

      chrome.storage.local.set(obj);
    }
  }

  setFilterAges(ages: string) {
    if (this.chromeStorageSwitch) {
      const obj = {
        filter_ages: '',
      };
      obj.filter_ages = ages;

      chrome.storage.local.set(obj);
    }
  }

  setFilterBreeds(breeds: string) {
    if (this.chromeStorageSwitch) {
      const obj = {
        filter_breeds: '',
      };
      obj.filter_breeds = breeds;

      chrome.storage.local.set(obj);
    }
  }

  setZip(zip: string) {
    if (this.chromeStorageSwitch) {
      const obj = {
        zip_code: '',
      };
      obj.zip_code = zip;

      chrome.storage.local.set(obj);
    }
  }

  dismissPet(id, type) {
    if (this.chromeStorageSwitch) {
      this.removeFromWatchedList(id, type);
      const obj = {};
      obj[id] = 'D';

      chrome.storage.local.set(obj);
    }
  }

  setPetInfo(petInfo) {
    if (this.chromeStorageSwitch) {
      const obj = {};
      obj[petInfo.id] = petInfo;

      chrome.storage.local.set(obj);
    }
  }

  removeFromWatchedList(id, type) {
    if (this.chromeStorageSwitch) {
      chrome.storage.local.get([type], (result) => {
        const storedWatchedList = result[type];

        if (storedWatchedList !== undefined) {
          const index = storedWatchedList.indexOf(id);
          if (index > -1) {
            storedWatchedList.splice(index, 1);
          } else {
            console.log('trying to remove id from watch list, but does not exist: ' + id);
          }

          const obj = {};
          obj[type] = storedWatchedList;
          chrome.storage.local.set(obj);
        }
      });
    }
  }

  addToWatchedList(id, type) {
    if (this.chromeStorageSwitch) {
      chrome.storage.local.get([type], (result) => {
        const storedWatchedList = result[type];

        let watched = [];

        if (storedWatchedList === undefined) {
          watched.push(id);
        } else {
          storedWatchedList.push(id);
          watched = storedWatchedList;
        }

        const obj = {};
        obj[type] = watched;

        chrome.storage.local.set(obj);
      });
    }
  }

  getWatchedPets(type: string) {
    if (this.chromeStorageSwitch) {
      return new Promise((resolve, reject) => {
        const pets = [];
        let petTypes = [];

        if (type === 'all') {
          petTypes = ['dog', 'cat'];
        } else {
          petTypes.push(type);
        }

        chrome.storage.local.get(petTypes, (results) => {
          let watchedList = [];

          petTypes.forEach((petType) => {
            if (results[petType] !== undefined) {
              watchedList = watchedList.concat(results[petType]);
            }
          });

          if (watchedList.length === 0) {
            resolve([]);
          } else {
            chrome.storage.local.get(watchedList, (result) => {
              watchedList.forEach((watchedPet) => {
                pets.push(result[watchedPet]);
              });

              resolve(pets);
            });
          }
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        resolve([]);
      });
    }
  }
}
