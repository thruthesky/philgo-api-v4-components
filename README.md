# PhilGo Api v4 Components

PhilGo Api v4 Components for Sonub project.

## Installation

* `git subtree add` on the same level of `philgo-api` subtree.

## Usage

### LoginComponent

* Use login component like below.

```` html
<ion-content padding>
    <app-login-component (login)="a.openHome()" (error)=" a.toast( $event ) "></app-login-component>
</ion-content>
````
