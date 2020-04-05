import { Injectable } from '@angular/core';
import { PetfinderApiService } from './petfinder-api.service';
import { ChromeStorageService } from './chrome-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ShelterService {
  constructor(private petFinderApiService: PetfinderApiService, private chromeStorageService: ChromeStorageService) {}

  getPets(zip: string, type: string) {
    const pets = [];
    return new Promise((resolve, reject) => {
      this.chromeStorageService.getWatchedPets(type).then((watchedPets: any[]) => {
        this.petFinderApiService.getPets(zip, type, 1).then(
          (petFinderPets: any[]) => {
            resolve(watchedPets.concat(petFinderPets));
          },
          (error) => {
            reject();
          }
        );
      });
    });
  }
}
