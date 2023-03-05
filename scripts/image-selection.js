// fires when 
Hooks.on("renderTokenConfig", function (config, html) {
    console.log(config.token._id);
});

// fires when the token HUD is called to be rended
Hooks.on("renderTokenHUD", async function (hud, html, token) {

    const images = await game.actors.get(token.actorId)?.getTokenImages() ?? [];
    if (images.length < 2) {
        return;
    }

    console.log("%c Momo's Token Changer Rending HUD", "color: green; font-size: 15px");

    const imageSelectionDisplay = game.settings.get("momos-token-changer", "imageSelectionDisplay");

    //TODO clean up and fix for versons 12+
    const imagesParsed = images.map(im => {
        const split = im.split('/');
        var extension = im.split('.');
        extension = extension[extension.length - 1];
        const img = ['jpg', 'jpeg', 'png', 'svg', 'webp'].includes(extension);
        const vid = ['webm', 'mp4', 'm4v'].includes(extension);
        return { route: im, name: split[split.length - 1], used: im === token.img, img, vid, type: img || vid };
    });
    //

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

            // Gets a array of all controlled tokens
            //const controlled = canvas.tokens.controlled;
            // Gets the token at the found index of the conrolled token that trigged the "renderTokenHUD" hook
            //const index = controlled.findIndex(x => x.id == token._id);
            //const tokenToChange = controlled[index];


            //const dimensions = getTokenDimensions(tokenToChange, event.target.dataset.name);
            const update = [{ _id: token._id, img: event.target.dataset.name}];

            canvas.scene.updateEmbeddedDocuments("Token", update);
        });
    });
});

// Update selected tokens to flip between a 1x1 or a 2x2 grid.

const updates = [];
for (let token of canvas.tokens.controlled) {
    let newSize = (token.data.height == 1 && token.data.width == 1) ? 2 : 1;
    updates.push({
        _id: token.id,
        height: newSize,
        width: newSize
    });
};

// use canvas.tokens.updateMany instead of token.update to prevent race conditions
// (meaning not all updates will be persisted and might only show locally)
canvas.scene.updateEmbeddedDocuments("Token", updates);


const getTokenDimensions = (token, imgName) => {
    const height = imgName.match(/_height(.*)_/)
    const width = imgName.match(/_width(.*)_/)
    const scale = imgName.match(/_scale(.*)_/)

    return {
        height: height ? parseFloat(height[1]) : token.height,
        width: width ? parseFloat(width[1]) : token.width,
        scale: scale ? parseFloat(scale[1]) : token.scale,
    }
}