console.log("Test.js is loaded");

Hooks.on("renderTokenHUD", async function (hud, html, token) {
    console.log("%c Momo's Token Changer Rending HUD", "color: green; font-size: 15px");

    const images = await game.actors.get(token.actorId)?.getTokenImages() ?? [];

    // TODO set to 2, at 0 for testing
    if (images.length < 0) {
        return
    }

    const imageSelectionDisplay = game.settings.get("momos-token-changer", "imageSelectionDisplay");
    const imagesParsed = images.map(im => {
        const split = im.split('/');
        var extension = im.split('.');
        extension = extension[extension.length - 1];
        const img = ['jpg', 'jpeg', 'png', 'svg', 'webp'].includes(extension);
        const vid = ['webm', 'mp4', 'm4v'].includes(extension);
        return { route: im, name: split[split.length - 1], used: im === token.img, img, vid, type: img || vid };
    });

    const wildcardDisplay = await renderTemplate("/modules/momos-token-changer/html/hud.html", { imageSelectionDisplay, imagesParsed });

    html.find("div.right").append(wildcardDisplay).click(function (event) {
        let activeButton, clickedButton, tokenButton;
        for (const button of html.find("div.control-icon")) {
            if (button.classList.contains("active")) activeButton = button;
            if (button === event.target.parentElement) clickedButton = button;
            if (button.dataset.action === "momos-token-changer-selector") tokenButton = button;
        }

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

    const buttons = html.find(".momos-token-changer-button-select");

    buttons.map(function (button) {
        buttons[button].addEventListener("click", function (event) {

            const controlled = canvas.tokens.controlled;
            const index = controlled.findIndex(x => x.data._id == token._id);
            const tokenToChange = controlled[index];

            const dimensions = getTokenDimensions(tokenToChange.document, event.target.dataset.name);
            const updateInfo = [{ _id: token._id, img: event.target.dataset.name, ...dimensions }];

            canvas.scene.updateEmbeddedDocuments("Token", updateInfo);
        });
    });
});


const getTokenDimensions = (token, imgName) => {
    const height = imgName.match(/_height(.*)_/)
    const width = imgName.match(/_width(.*)_/)
    const scale = imgName.match(/_scale(.*)_/)

    const prototypeData = token._actor.data.token;

    return {
        height: height ? parseFloat(height[1]) : prototypeData.height,
        width: width ? parseFloat(width[1]) : prototypeData.width,
        scale: scale ? parseFloat(scale[1]) : prototypeData.scale,
    }
}