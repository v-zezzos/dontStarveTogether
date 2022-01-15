import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CrawlService } from '../crawl/crawl.service';

export type Recipe = {
  title: string;
  img: string;
};

export type Food = Recipe;

@Injectable({
  providedIn: 'root'
})
export class ParserService {

  constructor(
    private crawl: CrawlService
  ) { }

  parseFoodItemsPage(): Observable<Array<Food>> {
    const tabRe = /<div id="food">\s*?<table class="links">([\s\S]*?)<\/table>/;
    const tabLineRe = /<tr.*?>([\s\S]*?)<\/tr>/gm;
    const tabColumnRe = /<td.*?>([\s\S]*?)<\/td>/gm;
    const tabImgRe = /src="([\s\S]*?)"/;
    const tabTitleRe = /<a.*?>([\s\S]*?)<\/a>/;

    return this.crawl.fetchFoodItemsPage().pipe(
      map(pageContent => {
        const match = pageContent.match(tabRe);
        return match ? match[1].replace(/\n/g, '').replace(/\r/g, '').replace(/\t/g, '') : pageContent;
      }),
      map(tab => {
        const matchs = [...tab.matchAll(tabLineRe)];
        matchs.shift();
        return matchs.map(match => {
          return match[1];
        });
      }),
      map(tabLinesRaw => {
        const tableLines= tabLinesRaw.map(line => {
          const matchs = [...line.matchAll(tabColumnRe)];
          return matchs.map(match => {
            return match[1];
          });
        })
        return tableLines;
      }),
      map(tabLines => {
        return tabLines./*filter(line => {
          return !line[6].includes('cannot be added to crock pot');
        }).*/map(line => {
          const imgMatch = line[0].match(tabImgRe);
          const titleMatch = line[1].match(tabTitleRe);
          return {title: titleMatch ? titleMatch[1].trim() : line[1].trim(), img: imgMatch ? imgMatch[1].trim() : line[0].trim()};
        });
      }),
      tap(pageContent => {
        console.log(pageContent);
      })
    );

  }

  parseFoodRecipePage(): Observable<Array<Recipe>> {
    const tabRe = /<table class="wikitable sortable".*>([\s\S]*?)<\/table>/g;
    const tabLineRe = /<tr.*?>([\s\S]*?)<\/tr>/gm ;
    const tabColumnRe = /<td.*?>([\s\S]*?)<\/td>/gm;
    const tabTitleRe = /<a.*?>([\s\S]*?)<\/a>/;
    const tabImgRe = /data-src="([\s\S]*?\.png).*?"/;

    return this.crawl.fetchFoodRecipesPage().pipe(
      map(foodRecipesPage => {
        const match = [...foodRecipesPage.matchAll(tabRe)];
        return match[0][1];
      }),
      map(tab => {
        const match = [...tab.matchAll(tabLineRe)];
        match.shift();
        match.shift();
        return match.map(item => {
          return item[1];
        });
      }),
      map(tabLinesRaw => {
        const tabLines = tabLinesRaw.map(line => {
          const match = [...line.matchAll(tabColumnRe)];
          return match;
        });
        return tabLines.map(item => {
          return item.map(innerItem => {
            return innerItem[1];
          });
        }) as unknown as Array<Array<string>>;
      }),
      map(tabLinesRaw => {
        const data = tabLinesRaw.reduce((curr, it) => {
          if (it.length === 11) {
            return [...curr, it];
          } else {
            const previousIt = curr[curr.length - 1];
            previousIt[2] = previousIt[2] + it[0];
            return curr;
          }
        }, [] as Array<Array<string>>);
        return data;
      }),
      map(tabLines => {
        const dstTabLines = tabLines.filter(line => {
          return line[2].includes(environment.dstIconMarker) || line[2].includes(environment.reingOfGiantsMarker) || !line[2].includes('img');
        });
        return dstTabLines.map(line => {
          const titleMatch = line[1].match(tabTitleRe);
          const imgMatch = line[0].match(tabImgRe);
          return { title: titleMatch ? titleMatch[1] : line[1], img: imgMatch ? imgMatch[1] : line[0] };
        });
      }),
      map(recipesList => {
        return recipesList.sort((previousRecipes, currentRecipe) => {
          return previousRecipes.title.localeCompare(currentRecipe.title);
        });
      }),
      tap(match => {
        console.log('test');
        console.log(match);
      })
    );
  }
}
