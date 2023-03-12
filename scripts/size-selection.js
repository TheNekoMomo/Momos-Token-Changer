async function sizeSelection(html, token) {

    let allowSizeChange = game.settings.get("momos-token-changer", "allowSizeChange");
    if (!allowSizeChange) {
        return;
    }

    let parsedSizes = game.settings.get("momos-token-changer", "sizes").sizes;

    let sizeHUDHTML = await renderTemplate("/modules/momos-token-changer/html/sizeHUD.html", { parsedSizes });

    html.find("div.left").append(sizeHUDHTML).click(function (event) {
        // gets the stats of the button clicked to check them
        let activeButton, clickedButton, tokenButton;
        for (let button of html.find("div.control-icon")) {
            if (button.classList.contains("active")) activeButton = button;
            if (button === event.target.parentElement) clickedButton = button;
            if (button.dataset.action === "momos-token-changer-size-options-button") tokenButton = button;
        }

        // checks to see if the button clicked is the button we made
        // checks if the button is active; if not it sets it as active, otherwise it is it removes active
        if (clickedButton === tokenButton && activeButton !== tokenButton) {
            clickedButton.classList.add("active");
            html.find(".momos-token-changer-size-options-wrap")[0].classList.add("active");
        }
        else if (clickedButton === tokenButton) {
            clickedButton.classList.remove("active");
            html.find(".momos-token-changer-size-options-wrap")[0].classList.remove("active");
        }
    });

    let buttons = html.find(".momos-token-changer-size-button");
    buttons.map(function (button) {
        buttons[button].addEventListener("click", function (event) {

            let update = [{ _id: token._id, height: event.target.dataset.height, width: event.target.dataset.width }];

            canvas.scene.updateEmbeddedDocuments("Token", update);
        });
    });
};