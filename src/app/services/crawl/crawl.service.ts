import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CrawlService {

  constructor( 
    private http: HttpClient
  ) { }
  
    fetchFoodItemsPage() {
      return this.http.get(environment.foodItemsPageURL, { responseType: 'text' });
    }
  
    fetchFoodRecipesPage() {
      return this.http.get(environment.foodRecipesPageURL, { responseType: 'text' });
    }
}
