const FVTTVaildImageTypes = ["jpg", "jpeg", "png", "svg", "webp"]; // Array of vaild image file types for FVTT
const FVTTVaildVideoTypes = ["webm", "mp4", "m4v"]; // Array of vaild video file types for FVTT

// fires when the token HUD is called to be rended
Hooks.on("renderTokenHUD", async function (hud, html, token) {

    // Gets an array of images that the token can use and checks if they are 2 or more
    const images = await game.actors.get(token.actorId)?.getTokenImages() ?? [];
    if (images.length < 2) {
        return;
    }

    console.log("%c Momo's Token Changer Rending HUD", "color: green; font-size: 15px");

    // Gets the settings for if to display the image or the path
    const imageSelectionDisplay = game.settings.get("momos-token-changer", "imageSelectionDisplay");

    const parsedImages = images.map(image => {
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
    const wildcardDisplay = await renderTemplate("/modules/momos-token-changer/html/hud.html", { imageSelectionDisplay, parsedImages });

    html.find("div.right").append(wildcardDisplay).click(function (event) {
        // gets the stats of the button clicked to check them
        let activeButton, clickedButton, tokenButton;
        for (const button of html.find("div.control-icon")) {
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
    const buttons = html.find(".momos-token-changer-button-select");
    buttons.map(function (button) {
        buttons[button].addEventListener("click", function (event) {
            // When the buttons is clicked it gets the file path to the image and updates the token with it
            const update = [{ _id: token._id, img: event.target.dataset.name}];
            canvas.scene.updateEmbeddedDocuments("Token", update);
        });
    });
});