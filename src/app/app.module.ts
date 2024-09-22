import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VerbInputComponent } from './components/search/verb-input/verb-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { VerbInfoComponent } from './components/search/verb-info/verb-info.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GameComponent } from './components/game/game.component';
import { SearchComponent } from './components/search/search.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LoginComponent } from './components/game/login/login.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { GameOverDialogComponent } from './components/game/game-over-dialog/game-over-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { GamePromoComponent } from './components/game/game-promo/game-promo.component';

@NgModule({ declarations: [
        AppComponent,
        VerbInputComponent,
        VerbInfoComponent,
        GameComponent,
        SearchComponent,
        LoginComponent,
        GameOverDialogComponent,
        GamePromoComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        DragDropModule,
        MatMenuModule,
        MatSnackBarModule,
        MatDialogModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule {
}
