# Momos-Token-Changer [![Release Badge](https://img.shields.io/github/v/release/TheNekoMomo/Momos-Token-Changer)](https://github.com/TheNekoMomo/Momos-Token-Changer/releases) ![License Badge](https://img.shields.io/github/license/TheNekoMomo/Momos-Token-Changer)

Momos Token Changer is a Module for Foundry Virtual Tabletop which allows the Game Master and Players to change the token art of Actors on the go. The Module adds a button to the Token HUD which allows the player to change the image displayed on their token at any time.

The module is based off [FVTT-TokenHUBWildcard](https://github.com/javieros105/FVTT-TokenHUDWildcard) - re-written to work with Foundry V10.

## Table of Contents

* [Momos-Token-Changer](#momos-token-changer-release-badge-license-badge)
  * [Getting Started](#getting-started)
    * [Install with Package Manager (Recommended Way)](#install-with-package-manager-recommended-way-to-install)
    * [Install with Manifest URL](#install-with-manifest-url)
    * [Enabling the Module](#enabling-the-module)
  * [How to Use Momos Token Changer](#how-to-use-momos-token-changer)
  * [License](#license)

## Getting Started

## How to Install
The best way to install the Module is using the [Package Manager](#install-with-package-manager-recommended-way-to-install). This allows the Module to be updated in the setup menu with ease.

### Install with Package Manager ![Recommended Way to Install](https://img.shields.io/badge/-Recommended%20Way-blue)

1. Head to your Foundry VTT Configuration and Setup Screen.
2. Click on "Add-on Modules" in the navigation.
3. Click the "Install Module" button at the bottom of the page.
4. Search for ```Momos Token Changer``` in the Package Name textbox.
5. Click "Install".

### Install with Manifest URL ![Alternative Way to Install](https://img.shields.io/badge/-Alternative%20Way-orange)

1. Head to your Foundry VTT Configuration and Setup Screen.
2. Click on "Add-on Modules" in the navigation.
3. Click the "Install Module" button at the bottom of the page.
4. In the textbox beside "Manifest URL:", copy and paste the following:
    ```TEXT
    https://raw.githubusercontent.com/TheNekoMomo/Momos-Token-Changer/main/module.json
    ```
5. Click the "Install" button beside the textbox.
 
If done correctly, Momos Token Changer should appear in the Add-on Modules list. Follow the instructions in [Enabling the Module](#enabling-the-module) to enable the Module in your Game.


### Enabling the Module

To enable the Module in your games, launch your World and navigate to the settings panel. Under the Game Settings menu, click on "Manage Modules". From here, you can enable Momos Token Changer!

## How to use Momos Token Changer

To get started using Momos Token Changer:
1. Navigate to your Actors Menu.
2. Click on your Actor to open the Character Sheet.
3. At the top, click "Prototype Token".

<p align="center">
  <img src="https://i.imgur.com/dFLvvaQ.png" />
</p>

4. In the Prototype Token Window, click on "Appearance".
5. Specify your Image Path where you have uploaded a collection of images available to use.
    - Using ```*``` introduces the wildcard and allows for the feature of the Module to be enabled.
6. Enable "Randomize Wildcard Images" under the path. This will enable Momo's Token Changer at the bottom of the token window.
    - Here, you're able to specify what image is the default image to be used. If left blank, the Module will pick one at random from the specified folder.

<p align="center">
  <img src="https://i.imgur.com/F2jQssC.png" />
</p>


## License
Momos Token Changer is licensed under the MIT License (see [LICENSE](LICENSE)).