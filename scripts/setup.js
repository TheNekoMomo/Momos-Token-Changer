
console.log("%c Momo's Token Changer: Loaded", "color: green; font-size: 15px");

class MomoTokenChangerSizeMenu extends FormApplication {
    constructor() {
        super({});
    };
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            closeOnSubmit: false,
            classes: ['form'],
            popOut: true,
            width: "550",
            height: "auto",
            template: "/modules/momos-token-changer/html/sizeMenu.html",
            id: "momos-token-changer-size-menu",
            title: "Size Menu",
            resizable: false
        });
    };

    activateListeners(html) {
        super.activateListeners(html);

        let formGroups = $("div.form-group", html);
        for (let i = 0; i < formGroups.length; i++) {
            let removeButton = $(".momos-token-changer-size-menu-remove", formGroups[i]);
            removeButton.click(function (event) {
                formGroups[i].remove();
            });
        }

        let sizeList = $("div.momos-token-changer-size-menu-sizes", html);
        let addButton = $(".momos-token-changer-size-menu-add-button", html);
        addButton.click(async function (event) {
            let sizeMenuSection = await renderTemplate("/modules/momos-token-changer/html/sizeMenuSection.html");
            sizeList.append(sizeMenuSection);

            let newFormGroups = $("div.form-group", html);
            let newRemoveButton = $(".momos-token-changer-size-menu-remove", newFormGroups[newFormGroups.length - 1]);
            newRemoveButton.click(function (event) {
                newFormGroups[newFormGroups.length - 1].remove();
            });
        });
    };

    getData() {
        let data = game.settings.get("momos-token-changer", "sizes");
        if (foundry.utils.isEmpty(data)) {
            data = {
                sizes: [
                    { name: "Tiny", width: 0.5, height: 0.5 },
                    { name: "Small", width: 1, height: 1 },
                    { name: "Medium", width: 1, height: 1 },
                    { name: "Large", width: 2, height: 2 },
                    { name: "Huge", width: 3, height: 3 },
                    { name: "Gargantuan", width: 4, height: 4 }
                ]
            };
        }
        return data;
    };

    async _updateObject(event) {
        let button = event.submitter;
        let saveData = true;
        if (button.name === "submit") {
            let data = [];
            let formGroups = $("div.form-group", event.path[1])

            for (let i = 0; i < formGroups.length; i++) {
                let nameVal = $(".momos-token-changer-size-menu-name", formGroups[i]).val();
                let widthVal = $(".momos-token-changer-size-menu-width", formGroups[i]).val();
                let heightVal = $(".momos-token-changer-size-menu-height", formGroups[i]).val();

                if (nameVal == "") saveData = false;
                if (widthVal == "") saveData = false;
                if (heightVal == "") saveData = false;

                if (saveData === false) {
                    ui.notifications.warn("momos-token-changer: A Size must have; name, width and height.");
                    break;
                }

                // notify the user about large sizes
                if (widthVal >= 50 || heightVal >= 50) {
                    ui.notifications.warn("momos-token-changer: A large size might cause issues.");
                }

                let sizeObject = { name: nameVal, width: widthVal, height: heightVal }
                data.push(sizeObject);
            }

            if (saveData) {
                await game.settings.set("momos-token-changer", "sizes", {
                    sizes: data
                });
                ui.notifications.info("momos-token-changer: Saved new Size list.");
            }
        }
    };
};

function registerSettings() {
    game.settings.register("momos-token-changer", "imageSelectionDisplay", {
        name: game.i18n.format("MomoTokenChanger.ImageSelectionDisplayName"),
        hint: game.i18n.format("MomoTokenChanger.ImageSelectionDisplayHint"),
        scope: "client",
        config: true,
        type: Boolean,
        default: true
    });
    game.settings.register("momos-token-changer", "allowSizeChange", {
        name: game.i18n.format("MomoTokenChanger.AllowSizeChangeName"),
        hint: game.i18n.format("MomoTokenChanger.AllowSizeChangeHint"),
        scope: "world",
        config: true,
        type: Boolean,
        default: true
    });
    game.settings.register("momos-token-changer", "sizes", {
        scope: "world",
        config: false,
        type: Object,
        default: {
            sizes:[
                { name: "Tiny", width: 0.5, height: 0.5 },
                { name: "Small", width: 1, height: 1 },
                { name: "Medium", width: 1, height: 1 },
                { name: "Large", width: 2, height: 2 },
                { name: "Huge", width: 3, height: 3 },
                { name: "Gargantuan", width: 4, height: 4 }
            ]
        }
    });

    game.settings.registerMenu("momos-token-changer", "sizeMenu", {
        name: "Size Menu",
        label: "Size Menu",
        icon: "fas fa-bars",
        type: MomoTokenChangerSizeMenu,
        restricted: true
    });
};

Hooks.on("init", function () {
    registerSettings();
});

// fires when the token config window is loaded
Hooks.on("renderTokenConfig", async function (config, html) {
    defaultTokenConfig(config, html);
});

// fires before a token is made
Hooks.on("preCreateToken", async function (parent, data, options, userId) {
    checkDefaultToken(parent, data);
});

// fires when the token HUD is called to be rended
Hooks.on("renderTokenHUD", async function (hud, html, token) {
    imageSelection(html, token);
    sizeSelection(html, token);
});