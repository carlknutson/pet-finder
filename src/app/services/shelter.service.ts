import { Injectable } from '@angular/core';
import { AnimalHumaneSocietyService } from './animal-humane-society.service';
import { EvanstonAnimalShelterService } from './evanston-animal-shelter.service';
import { PetfinderApiService } from './petfinder-api.service';
import { ChromeStorageService } from './chrome-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ShelterService {

  constructor(private animalHumaneSocietyService: AnimalHumaneSocietyService,
              private evanstonAnimalShelterService: EvanstonAnimalShelterService,
              private petFinderApiService: PetfinderApiService,
              private chromeStorageService: ChromeStorageService) { }

  getPets(zip:string, type:string) {

    var pets = [];
    return new Promise((resolve, reject) => {
      // this.animalHumaneSocietyService.getPets(type).then(value => {

      //   this.petFinderApiService.getPets(zip, type).then(value2 => {
      //     resolve(pets.concat(value).concat(value2));
      //   });
      // });

      // TODO: based on type, get corresponding watched list
      this.chromeStorageService.getWatchedPets(type).then((watchedPets:any[]) => {
        this.petFinderApiService.getPets(zip, type, 1).then((petFinderPets:any[]) => {
          resolve(watchedPets.concat(petFinderPets));
        },
        error => {
        reject();
        });
      });
    });
  }
}