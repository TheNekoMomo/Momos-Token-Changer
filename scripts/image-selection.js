const FVTTVaildImageTypes = ["jpg", "jpeg", "png", "svg", "webp"]; // Array of vaild image file types for FVTT
const FVTTVaildVideoTypes = ["webm", "mp4", "m4v"]; // Array of vaild video file types for FVTT

console.log("%c Momo's Token Changer: Loaded", "color: green; font-size: 15px");

// Sets and Gets the DefaultToken data to/from the flag
const DefaultToken = {
    getDefaultToken: async function (token) {
        let flag = token.getFlag("momos-token-changer", "defaultToken") || "";
        return flag;
    },
    setDefaultToken: async function (token, flag) {
        await token.setFlag("momos-token-changer", "defaultToken", flag);
    }
};

// fires when the token config window is loaded
Hooks.on("renderTokenConfig", async function (config, html) {
    // gets the DefaultToken data
    let defaultTokenImage = await DefaultToken.getDefaultToken(config.token);

    // finds html fields that get used later on
    let imageDataTab = html.find('.tab[data-tab="appearance"]');
    let wildcardCheckBox = imageDataTab.find('input[name="randomImg"]');
    let updateTokenButton = html.find('button[type="submit"]');

    // loads, adds and gets the field of the HTML code for the config
    let configDisplayHTML = await renderTemplate("/modules/momos-token-changer/html/config.html", { defaultTokenImage, available: wildcardCheckBox[0].checked });
    imageDataTab.append(configDisplayHTML);
    let configDisplay = imageDataTab.find(".momos-token-changer-default");

    // gets the input filed for the file path to the DefaultToken image
    let imageInputFiled = configDisplay.find("input")[0];
    // loads the file picker when the browse filse button is clicked
    configDisplay.find("button").click(async function (event) {
        let filePicker = new FilePicker({ current: imageInputFiled.value, field: imageInputFiled });
        filePicker.browse(defaultTokenImage);
    });

    // updates the DefaultToken data if it has been changed when the Update Token Button is clicked
    updateTokenButton.click(function (event) {
        if (defaultTokenImage !== imageInputFiled.value) {
            DefaultToken.setDefaultToken(config.token, imageInputFiled.value);
            console.log("Updated DefaultToken to '" + imageInputFiled.value + "'");
        }
    });

    // updates the visibility of the DefaultToken config
    wildcardCheckBox.click(function (event) {
        if (event.target.checked) {
            configDisplay[0].classList.add("active");
        }
        else {
            configDisplay[0].classList.remove("active");
        }
    });
});

// fires before a token is made
Hooks.on("preCreateToken", async function (parent, data, options, userId) {
    // gets the DefaultToken data
    let defaultTokenImage = await DefaultToken.getDefaultToken(parent.actor.prototypeToken);

    // checks if the DefaultToken  is set to blank and is set to randomImg
    if (defaultTokenImage !== "" && parent.actor.prototypeToken.randomImg) {
        console.log("Setting DefaultToken");

        // updates the token data before it is made to set the image to what is set in the DefaultToken data
        let update = { actorId: data.actorId, texture: { src: defaultTokenImage } };
        parent.updateSource(update);
    }
});

// fires when the token HUD is called to be rended
Hooks.on("renderTokenHUD", async function (hud, html, token) {

    // Gets an array of images that the token can use and checks if they are 2 or more
    let images = await game.actors.get(token.actorId)?.getTokenImages() ?? [];
    if (images.length < 2) {
        return;
    }

    console.log("Adding Image Selection Display to Token HUD");

    // Gets the settings for if to display the image or the path
    let imageSelectionDisplay = game.settings.get("momos-token-changer", "imageSelectionDisplay");

    let parsedImages = images.map(image => {
        // Gets the file name at the end of the file path
        let filePath = image.split("/");
        let fileName = filePath[filePath.length - 1];
        // replace the %20 with a space
        fileName = fileName.replaceAll("%20", " ");

        // gets the file extension
        let fileExtensions = image.split(".");
        fileExtensions = fileExtensions[fileExtensions.length - 1];

        // checks the file extension is of a vaild type for use in FVTT
        let isVaildImageExtensions = FVTTVaildImageTypes.includes(fileExtensions);
        let isVaildVideoExtensions = FVTTVaildImageTypes.includes(fileExtensions);

        // returns all the data
        return {
            route: image,
            name: fileName,
            used: image === token.texture.src,
            isVaildImageExtensions,
            isVaildVideoExtensions,
            type: isVaildImageExtensions || isVaildVideoExtensions
        };
    });

    // Adds the HTML in for the new button and image options screen
    let wildcardDisplayHTML = await renderTemplate("/modules/momos-token-changer/html/hud.html", { imageSelectionDisplay, parsedImages });

    html.find("div.right").append(wildcardDisplayHTML).click(function (event) {
        // gets the stats of the button clicked to check them
        let activeButton, clickedButton, tokenButton;
        for (let button of html.find("div.control-icon")) {
            if (button.classList.contains("active")) activeButton = button;
            if (button === event.target.parentElement) clickedButton = button;
            if (button.dataset.action === "momos-token-changer-selector") tokenButton = button;
        }

        // checks to see if the button clicked is the button we made
        // checks if the button is active; if not it sets it as active, otherwise it is it removes active
        if (clickedButton === tokenButton && activeButton !== tokenButton) {
            clickedButton.classList.add("active");
            html.find(".momos-token-changer-selector-wrap")[0].classList.add("active");
        }
        else if (clickedButton === tokenButton)
        {
            clickedButton.classList.remove("active");
            html.find(".momos-token-changer-selector-wrap")[0].classList.remove("active");
        }
    });

    // Finds all the buttons marked with the class "momos-token-changer-button-select" and adds a click event to them.
    let buttons = html.find(".momos-token-changer-button-select");
    buttons.map(function (button) {
        buttons[button].addEventListener("click", function (event) {
            // When the buttons is clicked it gets the file path to the image and updates the token with it
            let update = [{ _id: token._id, img: event.target.dataset.name}];
            canvas.scene.updateEmbeddedDocuments("Token", update);
        });
    });
});