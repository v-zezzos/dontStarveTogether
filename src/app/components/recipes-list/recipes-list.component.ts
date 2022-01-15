import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ParserService, Recipe } from 'src/app/services/parser/parser.service';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent implements OnInit, OnDestroy {

  recipesList: Recipe[];
  recipesListSubscription: Subscription;

  constructor(
    private parser: ParserService
  ) { }

  ngOnInit(): void {
    this.recipesListSubscription = this.parser.parseFoodRecipePage().subscribe(recipesList => {
      this.recipesList = recipesList;
    });
  }

  ngOnDestroy(): void {
      this.recipesListSubscription.unsubscribe();
  }
}
